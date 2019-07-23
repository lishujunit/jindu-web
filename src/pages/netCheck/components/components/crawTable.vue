<template>
    <div>
        <el-table :data="expandList" :show-header="false" v-loading="expandLoading">
            <el-table-column align="center"  width="80"></el-table-column>
            <el-table-column align="center" prop="crawlerShowNo" width="181"></el-table-column>
            <el-table-column align="center" prop="createTime" width="160"></el-table-column>
            <el-table-column align="center" prop="executeTime"> </el-table-column>
            <el-table-column align="center" prop="createUserName">
                <template slot-scope="scope">{{scope.row.createUserName==''?'-':scope.row.createUserName}}</template>
            </el-table-column>
            <el-table-column align="center" prop="taskDesc">
                <template slot-scope="scope"><div class="tabtext">-</div></template>
            </el-table-column>
            <el-table-column align="center" prop="websiteNames"  show-overflow-tooltip>
                <template slot-scope="scope">
                    <a class='var under' :href="scope.row.websiteUrl" target="_blank" @click="goLink(scope.row.websiteUrl,$event)" show-overflow-tooltip>{{scope.row.websiteNames}}</a>
                </template>
            </el-table-column>
            <el-table-column align="center">
                <template slot-scope="scope">
                    <div class="btn" v-if="scope.row.status == '02'" @click="handleDomin(scope.row,scope.$index)">{{scope.row.subjectCount}}</div>
                    <div v-else>{{scope.row.finishNum}}/{{scope.row.subjectCount}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="status" >
                <template slot-scope="scope">
                    <div v-if="scope.row.iscatch!='00'">爬取异常</div>
                    <div v-else>
                        <p v-if="scope.row.status == '00'">等待中</p>
                        <p v-if="scope.row.status == '02'">已完成</p>
                        <p v-if="scope.row.status == '01'">爬取中</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="exceptionReason"  show-overflow-tooltip>
                <template slot-scope="scope">
                    <div class="tabtext"  show-overflow-tooltip>{{scope.row.exceptionReason}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.iscatch =='00'">
                        <p class="btn" v-if="scope.row.status == '02'" @click="goNext(scope.row,scope.$index)">查看</p>
                        <p class="btn" v-if="scope.row.status == '00' && isShowOperating" @click="DELETE(scope.row,scope.$index)">删除</p>
                    </div>
                    <div v-else >-</div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {crawler, crawlerDE,crawlerSecond,realTimeData} from "@/api/project";
    import {mapState,mapActions} from 'vuex'
    export default {
        props: {
            batchNo: '',
            details: Array,
            isShowOperating: Boolean
        },
        data(){
          return{
              expandList:[],
              expandLoading:false,
              getSecondList:[],
              matterStatus: this.$route.query.status
          }
        },
        watch: {
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
                        realTimeData(vm.crawSecondList.toString()).then(res => {
                            this.loading = false;
                            if(res.code==0){
                                list.forEach((v)=>{
                                    // console.log(v)
                                    if (v.status=='0'){
                                        return
                                    } else{
                                        res.result.forEach((v2)=>{
                                            if(v.crawlerBatchNo == v2.crawerNo){
                                                v.finishNum = v2.finishNum
                                                v.status = v2.status
                                                v.executeTime = v2.executeTime
                                            }
                                        })
                                    }

                                })
                            }else{
                                clearInterval(this.timeout)
                            }
                        }).catch(() => {
                            this.loading = false;
                        });
                    }, 5000);
                }else {
                    clearInterval(this.timeout)    // 取消定时器
                }
            },
        },
        beforeDestroy() {
            clearTimeout(this.timeout);
        },
        mounted(){
          this.getData()
        },
        computed:{
        ...mapState('netCheck', ['crawSecondList'])
        },
        methods:{
            getData(){
                this.expandList = this.details
                this.details.forEach((item)=>{
                    this.getSecondList.push(item.crawlerBatchNo)
                })
                this.getExpandList(this.getSecondList)
                return false
                let options = {
                    batchNo:this.batchNo,
                    beginTime:'',
                    createBy:'',
                    endTime:'',
                    finishBeginTime:'',
                    finishEndTime:'',
                    status:'',
                    webName:'',
                }
                crawlerSecond(options).then((res)=>{
                    if (res.code == 0){
                        // console.log(res)
                        this.expandList = res.result
                        res.result.forEach((item)=>{
                            this.getSecondList.push(item.crawlerBatchNo)
                        })
                        this.getExpandList(this.getSecondList)
                        // console.log(this.getSecondList)
                    }
                })
            },
            //跳转下一页
            goLink(address,e){
                e.currentTarget.className="under var isClick"
                window.open(address)
            },
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
                                this.$emit('refresh')
                            }
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
            },
            ...mapActions('netCheck', ['getExpandList']),

        }
    }
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
</style>
