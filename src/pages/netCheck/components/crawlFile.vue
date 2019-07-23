<template>
    <div>
        <div class="search bg">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="form" inline>
                <el-form-item label="站点名称" prop="websiteName">
                    <el-autocomplete
                    style="width: 350px"
                    class="inline-input"
                    clearable @clear="handleClear"
                    v-model="ruleForm.websiteName"
                    :fetch-suggestions="querySearch"
                    @keyup.enter.native="handleSelect"
                    @select="handleSelect"
                    >
                    </el-autocomplete>
                </el-form-item>

                <el-form-item label="状态" prop="status" style="margin-left: 3.5rem;">
                    <el-select v-model="ruleForm.status" placeholder="请选择" class="state" @change="pageChange(1)">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item,index in options" :key="item.value" :label="item.value" :value="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <div class="rightBox">
                    <el-button type="primary" @click="pageChange(1)">搜索</el-button>
                    <el-button type="danger" @click="resetForm('ruleForm')">重置</el-button>
                </div>
                 <div>
                    <el-form-item label="创建时间" prop="beginTime">
                        <el-date-picker class="date" type="date" v-model="ruleForm.beginTime" value-format="yyyy-MM-dd" :picker-options="startDatePicker" @change="getstartTime"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="至" prop="endTime" label-width="30px">
                        <el-date-picker class="date" type="date" v-model="ruleForm.endTime" value-format="yyyy-MM-dd" :picker-options="endDatePicker" @change="getendTime"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="完成时间" prop="finishBeginTime" style="margin-left: 0.6rem;">
                        <el-date-picker class="date" type="date" v-model="ruleForm.finishBeginTime" value-format="yyyy-MM-dd" :picker-options="pickerOptions0" @change="getstartTime0"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="至" prop="finishEndTime" label-width="30px">
                        <el-date-picker class="date" type="date" v-model="ruleForm.finishEndTime" value-format="yyyy-MM-dd" :picker-options="pickerOptions1" @change="getendTime1"></el-date-picker>
                    </el-form-item>
                </div>
                <div style="display: inline-block;">

                </div>
            </el-form>

        </div>
        <el-table :data="list" :max-height="getHeight" border v-loading="loading" ref="refTable" class="netTable" :row-key="getRowKeys" :expand-row-keys="expands" @expand-change="expandChange"  @row-click="rowClick" >
            <el-table-column align="center" label="序号"  width="80">
                <template slot-scope="scope">{{scope.$index+(page-1)*pageSize+1}}</template>
            </el-table-column>
            <!--插入的列表-->
            <el-table-column type="expand" width="1" class="expandBtn">
                <template slot-scope="scope">
                    <craw-table :details="scope.row.details" :isShowOperating="isShowOperating" :batchNo="scope.row.batchNo" @refresh="refresh"></craw-table>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="batchNo" label="爬取批次" width="180">
                <template slot-scope="scope">
                   <div @click="secondListExpand(scope.row)" class="pointBtn">
                       <i style="font-weight: 600" :class="{'el-icon-arrow-down':!scope.row.countCheck,'el-icon-arrow-up':scope.row.countCheck}"></i>
                       {{scope.row.batchNo}}
                   </div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="createTime" label="创建时间" width="160">
                <template slot-scope="scope">{{scope.row.createTime}}</template>
            </el-table-column>
            <el-table-column align="center" prop="executeTime" label="完成时间"></el-table-column>
            <el-table-column align="center" prop="createUserName" label="创建人">
                <template slot-scope="scope">{{scope.row.createUserName==''?'-':scope.row.createUserName}}</template>
            </el-table-column>
            <el-table-column align="center" prop="taskDesc" label="任务描述" show-overflow-tooltip>
                <template slot-scope="scope"><div class="tabtext">{{scope.row.taskDesc}}</div></template>
            </el-table-column>
            <el-table-column align="center" prop="websiteNames" label="查询站点" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" prop="subjectCount" label="核查主体数量">
                <template slot-scope="scope">
                    <div v-if="scope.row.subjectCount">
                        <p v-if="scope.row.countCheck">{{scope.row.subjectCount}}</p>
                        <p v-else>{{scope.row.subjectCount}}</p>
                    </div>
                    <div v-else>-</div>
                </template>
            </el-table-column>
            <el-table-column  align="center" label="状态">
                <template slot-scope="scope">
                    <div>
                        <p v-if="scope.row.status == '00'">等待中</p>
                        <p v-if="scope.row.status == '01'">爬取中</p>
                        <p v-if="scope.row.status == '02'">已完成</p>
                       
                    </div>
                    </template>
            </el-table-column>
            <el-table-column  align="center" label="异常原因">
                <template slot-scope="scope"><span>-</span></template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope"><span>-</span></template>
            </el-table-column>

        </el-table>
        <div id="showDiv" style="position: absolute; background-color: white;"></div>
        <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
    </div>
</template>
<script>
import { crawler, crawlerDE,crawlerSecond, bySiteName, realTimeData,realListTime, getMatterStatus} from "@/api/project";
import crawTable from './components/crawTable'
export default {
    watch: {
        "$parent.back"() {
            this.$router.go(-1);
        },
        expandList(){
            if(this.expandList!=[]){
                let vm=this
                let data=vm.expandList;
                if(this.timeout) return;
                this.timeout = setInterval(function (row) {
                let list = vm.expandList;
                let crawlerBatchNo = [];
                list.forEach((v)=>{
                    crawlerBatchNo.push(v.crawlerBatchNo)
                })
                realTimeData(crawlerBatchNo.toString()).then(res => {
                        this.loading = false;
                        if(res.code==0){
                            list.forEach((v)=>{
                                res.result.forEach((v2)=>{
                                    if(v.crawlerBatchNo == v2.crawerNo){
                                        v.finishNum = v2.finishNum
                                        v.status = v2.status
                                        v.executeTime = v2.executeTime
                                    }
                                })
                            })
                        }else{
                           clearInterval(this.timeout)
                        }
                    }).catch(() => {
                        this.loading = false;
                        clearInterval(this.timeout)
                    });
            }, 5000);
          }else {
            clearInterval(this.timeout)    // 取消定时器
            }
        },
        list(){
            if(this.list!=[]){
                let vm=this
                let data=vm.list;
                if(this.timeout1) return;
                this.timeout1 = setInterval(function (row) {
                    let list = vm.list;
                    let batchNos = [];
                    list.forEach((v)=>{
                        batchNos.push(v.batchNo)
                    })
                    //console.log('222')
                    realListTime(batchNos.toString()).then(res => {
                        if(res.code==0){
                            list.forEach((v)=>{
                                res.result.forEach((v2)=>{
                                    if(v.batchNo == v2.batchNo){
                                        v.status = v2.status
                                        v.executeTime = v2.executeTime
                                    }
                                })
                            })
                        }else{
                            clearInterval(this.timeout1)
                        }
                    }).catch(() => {
                    });
                }, 5000);
            }else {
                clearInterval(this.timeout1)    // 取消定时器
            }
        }
    },
    beforeDestroy() {
        clearTimeout(this.timeout);
        clearTimeout(this.timeout1);
    },
    components:{
        crawTable
    },
    data() {
        return {
            changeRed:-1,
            lists:[],
            expandList:[],
            expands:[],
            getHeight:0,
            isshow:true,
            expandLoading:false,
            batchNos:[],
            timeout:null,
            timeout1:null,
            ruleForm: {
                webName: "",
                beginTime: "",
                endTime: "",
                finishBeginTime: "",
                finishEndTime: "",
                status: "",
                projectNo: "",
                batchNo: "",
                crawlerBatchNo: '',
            },
            getRowKeys(row){
                return row.id
            },
            secondId:'',
            //创建时间
             startDatePicker: {
                disabledDate: (time) => {
                    if (this.ruleForm.endTime != "") {
                        return time.getTime() >  new Date(this.ruleForm.endTime).getTime();

                    }
                },
            },
            endDatePicker: {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.ruleForm.beginTime).getTime()- 1*24*60*60*1000;//减去一天的时间代表可以选择同一天;
                },

            },
            //完成时间
            pickerOptions0: {
                disabledDate: (time) => {
                    if (this.ruleForm.finishEndTime != "") {
                        return time.getTime() >  new Date(this.ruleForm.finishEndTime).getTime();

                    }
                },
            },
            pickerOptions1: {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.ruleForm.finishBeginTime).getTime()- 1*24*60*60*1000;//减去一天的时间代表可以选择同一天;
                },

            },
            // options: ["等待中","爬取中","已完成"],     //'异常'
            options: [
                {value:'等待中',label:'00'},
                {value:'爬取中',label:'01'},
                {value:'已完成',label:'02'},
            ],     //'异常'
            list: [],
            page: 1,
            pageSize: 20,
            total: 0,
            pageTotal: 0,
            loading:false,
            expandPage:1,
            handleDominId:'',
        };
    },
    computed: {
        isShowOperating(){
        let status = getMatterStatus()
        return status
        }
    },
    mounted() {
        this.ruleForm.projectNo = this.$route.params.projectNo;
        this.pageChange(1)
        this.getTableHeight();
    },
    created() {
        this.projectNo = this.$route.params.projectNo
        window.addEventListener('resize', this.getTableHeight);
        this.getTableHeight()
    },
    destroyed(){
        window.removeEventListener('resize', this.getTableHeight)
    },
    methods: {
        handleSelect(val){
            this.ruleForm.websiteName = val.value
            this.pageChange(1)
        },
        secondListExpand(val){
            this.$refs.refTable.toggleRowExpansion(val)
            // console.log(val)
        },
        refresh(){
          this.pageChange(this.page)
        },
        getSecond(val){
            this.expandList = []
            let options=this.ruleForm
            options.pagenum=this.page
            options.pagesize=this.pageSize
            options.batchNo = val
            crawlerSecond(options).then((res)=>{
                if (res.code == 0){
                    this.expandList = res.result
                    this.expandPage = (this.page-1)*10+1
                }
            })
        },
        expandChange(row,expandedRows){
           // console.log(row)
            if (expandedRows.indexOf(row) > -1) row.countCheck = true
            else row.countCheck = false
            // var that = this
            // console.log(this.$refs.refTable)
            // if (expandedRows.length) {
            //     that.expands = []
            //     if (row) {
            //         that.expands.push(row.id)
            //         this.getSecond(row.batchNo)
            //     }
            // } else {
            //     that.expands = []
            // }
            // console.log(row)
            // console.log(expandedRows)
            // this.getSecond(row.batchNo)
        },
        rowClick(row,event,column){
            return row.id
        },
        getTableHeight(){
            this.getHeight=window.innerHeight-440;
        },
        goLink(address,e){
			e.currentTarget.className="under var isClick"
			window.open(address)
		},
        //开始时间和结束时间优化
        getstartTime(time) {
            this.startTime = time
        },
        getendTime(time) {
            this.endTime = time
        },
        //完成时间
        getstartTime0(time) {
            this.startTime = time
        },
        getendTime1(time) {
            this.finishEndTime = time
        },
        //模糊查询
      querySearch(queryString, cb) {
          let VM = this
          bySiteName(this.ruleForm.websiteName).then(res => {
              //console.log(res)
              VM.lists = res.result;
              for (let i = 0; i < VM.lists.length; i++) {
                  VM.lists[i].value = VM.lists[i].websiteName
              }
              var results = queryString ? VM.lists.filter(VM.createStateFilter(queryString)) : VM.lists;
              cb(results);
          })
        .catch(error => {
        });
      },
      createStateFilter(queryString) {
          return (state) => {
              return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
          };
      },
       handleClear(){
            this.ruleForm.websiteName = '';
            this.pageChange(1)
        },

        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.pageChange(1)
        },
        pageChange(index) {
            this.list = [];
            this.page = index;
            let options=this.ruleForm
            options.pagenum=this.page
            options.pagesize=this.pageSize
            this.loading = true;
            crawler(options).then(res => {
                if(res.code==0){
                    
                    this.loading = true;
                    this.list = res.result.records;
                    let change={'countCheck':false,'operateCheck':false}
                    this.list.forEach(item=>{
                        Object.assign(item,change)
                    })
                    this.total = Number(res.result.total);
                    this.pageTotal = Number(res.result.pages);
                    this.scrollBehavior();
                    let self = this;
                    setTimeout(function(){
                        if((self.ruleForm.websiteName != '' && self.ruleForm.websiteName != undefined) || self.ruleForm.status != ''){ //判断所有行是否展开
                            self.list.forEach(v=>{
                                self.$refs.refTable.toggleRowExpansion(v, true)
                            })
                        }else{
                            self.list.forEach(v=>{
                                self.$refs.refTable.toggleRowExpansion(v, false)
                            })
                        }
                    },50)
                    
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
        handleSizeChange(val){
            this.pageSize = val
            this.pageChange(1)
        },
        scrollBehavior (){
            window.pageYOffset = 0
            document.documentElement.scrollTop = 0
            document.body.scrollTop = 0
        },
        //删除
        DELETE(row,index) {
          this.changeRed = index;
            this.$confirm('确定删除?', '提示', {
                type:'warning',
                confirmButtonText: '删除',
                cancelButtonText: '取消'
            }).then(() => {
                crawlerDE(row.crawlerBatchNo).then(res => {
                    if (res.code == 0) {
                        // this.pageChange()
                        this.$message({
                            type: 'success',
                            message: '删除成功！'
                        })
                        if (this.expandList.length >1){
                            this.expandList.splice(index,1)
                        }else{
                            this.pageChange(this.page)
                        }
                        // if(this.expandList.length==1&&this.page>1) this.pageChange(this.page-1)
                        // else if(this.expandList.length==1&&this.page==1) {
                        //     this.list=[]
                        //     this.total=0
                        // }else{
                        //     this.pageChange(this.page)
                        // }
                    }
                })
            }).catch(() => {});
        },
        handleDomin(val, index,number) {
            this.goNext(val,index)
        },
        //跳转校验资料
        goNext(row,index) {
           this.changeRed = index;
            this.$router.push({ path: "calibration", query: { websiteId: row.websiteId } });
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/assets/css/varibles.scss";
// .search .rightBox{
//     margin-left: 17rem!important;
//     position: absolute !important;
//     left: 0!important;
//     bottom: 85px !important;
// }
.red{
        color: #BDBDBF;
}
.tabtext{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
 #tableList.active{
        background: #35495e;
    }
a:active {
color: #BDBDBF; /*鼠标按下的颜色变化*/
}
.red{
  cursor: pointer;
  color: #BDBDBF!important;
  text-decoration: none!important;
  }
.btn{
  color: #0cb3f0;
   cursor: pointer;
  text-decoration: underline;
}
.search form{
    margin-right: 0px!important;
}
.el-button--small {
	padding: 8px 29px!important;
}
a.under.isClick {
color: #bdbdbd !important; /*连接访问的颜色变化*/
}
.el-tooltip__popper is-dark{
    width: 10%!important;
}
.pointBtn{
    cursor: pointer;
}
</style>
<style lang="scss">
    .netTable{
        .el-table__expand-column{
            .cell{
                display: none;
            }
        }
    }
</style>
