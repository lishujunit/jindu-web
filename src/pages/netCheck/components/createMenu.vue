<template>
  <div>
    <el-dialog title="核查任务"  :visible.sync="dialogTableVisible" width="1000px" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-table :data="listData" :max-height="taskHeight">
      <el-table-column align="center" prop="subjectNo" label="主体序号">
        <template slot-scope="scope">{{scope.row.subjectNo}}</template>
      </el-table-column>
      <el-table-column align="center" prop="subjectName" label="主体名称">
         <template slot-scope="scope">{{scope.row.subjectName}}</template>
      </el-table-column>
      <el-table-column align="center" prop="subjectCode" label="主体代码">
         <template slot-scope="scope">{{scope.row.subjectCode}}</template>
      </el-table-column>
      <el-table-column align="center" prop="subjectShortname" label="主体简称">
         <template slot-scope="scope">{{scope.row.subjectShortname}}</template>
      </el-table-column>
      </el-table>
      <pageination @pageChange="pageChange2"  @handleSizeChange="handleSizeChange2" :page-total="pageTotal2" :total="total2" :page="page2" :pageSize="pageSize2"></pageination>
      <!--<pageination @pageChange="pageChange1"  @handleSizeChange="handleSizeChange1" :page-total="pageTotal1" :total="total1" :page="page1" :pageSize="pageSize1"></pageination>-->
    </el-dialog>
    <div class="search">
      <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="form" inline>
        <!-- <el-form-item label="站点名称" prop="webName">
          <el-input v-model="ruleForm.webName"></el-input>
        </el-form-item> -->
        <el-form-item label="站点名称" prop="websiteName">
        <el-autocomplete
          style="width: 350px"
          class="inline-input"
          clearable @clear="handleClear"
          v-model="ruleForm.websiteName"
          :fetch-suggestions="querySearch"
          @keyup.enter.native="handleSelect"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
        <div style="display: inline-block;">
          <el-form-item label="创建时间" prop="beginTime">
            <el-date-picker class="date" type="date" v-model="ruleForm.beginTime" value-format="yyyy-MM-dd" :picker-options="startDatePicker" @change="getstartTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="至" prop="endTime" label-width="30px">
            <el-date-picker class="date" type="date"  v-model="ruleForm.endTime" value-format="yyyy-MM-dd" :picker-options="endDatePicker" @change="getendTime"></el-date-picker>
          </el-form-item>
        </div>
        <el-form-item label="创建人" prop="createBy">
          <el-input v-model="ruleForm.createBy"></el-input>
        </el-form-item>
      </el-form>
      <div class="rightBox">
        <el-button type="primary" @click="pageChange(1)">搜索</el-button>
        <el-button type="danger" @click="resetForm('ruleForm')">重置</el-button>
      </div>
    </div>
    <message-box :projectNo="ruleForm.projectNo" v-if="isShowOperating"></message-box>
    <el-table :data="list" :max-height="getHeight" border v-loading="loading" ref="refTable" class="netTable" :row-key="getRowKeys" :expand-row-keys="expands" @expand-change="expandChange"  @row-click="rowClick" >
      <el-table-column align="center" label="序号"  width="80">
        <template slot-scope="scope">{{scope.$index+(page-1)*pageSize+1}}</template>
      </el-table-column>
      <!--插入的列表-->
      <el-table-column type="expand" width="1" class="expandBtn">
        <template slot-scope="scope">
          <create-second @fileDownload="fileDownload" :details="scope.row.details" :batchNo="scope.row.batchNo" @refresh="refresh"></create-second>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="batchNo" label="爬取批次">
        <template slot-scope="scope">
          <!--<i style="font-weight: 600" :class="{'el-icon-arrow-down':!scope.row.expand,'el-icon-arrow-up':scope.row.expand}"></i>-->
          <div class="curPoint" @click="secondListExpand(scope.row)">
            <i style="font-weight: 600" :class="{'el-icon-arrow-down':!scope.row.countCheck,'el-icon-arrow-up':scope.row.countCheck}"></i>
            {{scope.row.batchNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间">
        <template slot-scope="scope">{{scope.row.createTime}}</template>
      </el-table-column>
      <el-table-column align="center" prop="createUserName" label="创建人">
        <template slot-scope="scope">{{scope.row.createUserName==''?'-':scope.row.createUserName}}</template>
      </el-table-column>
      <el-table-column align="center" prop="taskDesc" label="任务描述" show-overflow-tooltip>
        <template slot-scope="scope"><div class="tabtext">{{scope.row.taskDesc}}</div></template>
      </el-table-column>
      <el-table-column align="center" prop="websiteNames" label="查询站点" show-overflow-tooltip>
        <template slot-scope="scope">
        <div :class="{'var under':!scope.row.parent}" v-if="scope.row.parent" class="tabtext">{{scope.row.websiteNames}}</div>
        <!-- <div :class="{'var under':!scope.row.parent}" :href="scope.row.websiteUrl" target="_blank" v-else='' class="tabtext">{{scope.row.websiteName}}</div> -->
        <a class='var under' :href="scope.row.websiteUrl" target="_blank" @click="goLink(scope.row.websiteUrl,$event)" v-else='' show-overflow-tooltip>{{scope.row.websiteNames}}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="subjectCount" label="核查主体数量">
        <template slot-scope="scope">
          <div class="var under" v-if="scope.row.parent"  @click="handleDomin(scope.row,scope,1)">
            <p v-if="scope.row.countCheck" style="color: #BDBDBF;text-decoration: underline">{{scope.row.subjectCount}}</p>
            <p v-else style="color: #0cb3f0;text-decoration: underline">{{scope.row.subjectCount}}</p>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
        <!-- <div class="btn-box"> :class="'var under'"-->
        <div class="btn" v-if="scope.row.parent" @click="handleDomin(scope.row,scope.$index,2)" :class="{ reds:changeReds == scope.$index}">
          <p v-if="scope.row.operateCheck" style="color: #BDBDBF;text-decoration: underline">核查主体</p>
          <p v-else style="color: #0cb3f0;text-decoration: underline">核查主体</p>
        </div>
        <div class="btn" v-else="" @click="submit(scope.row,scope.$index)" :class="{ red:changeRed == scope.$index}">下载清单</div>
        <!-- </div> -->
        </template>
      </el-table-column>
    </el-table>
    <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>

    <download :path="downloadPath" :name="downloadName" @downloadDone="downloadDone"/>
    <!-- 下载文件公用组建，path和name为必传项，分别代表下载路径和下载名称(带扩展名如.xls), downloadDone方法是下载成功后的回调 -->
  </div>
</template>
<script>
import { messageBox } from "./components";
import { downFile } from '@/utils/api';
import createSecond from './components/createSecond';
import download from "@/components/download";
import { checkList, batchList, exportss, getSubject, bySiteName, getMatterStatus} from "@/api/project";
export default {
  components: {
    messageBox,
    createSecond,
    download
  },
  watch: {
    "$parent.back"() {
      this.$router.go(-1);
    }
  },
  data() {
    return {
      downloadPath: "", //下载文件的地址
      downloadName: "", //下载文件名称
      changeRed:-1,
      changeReds:-1,
      handleDominId:'',
      lists:[],
      errorList: [],
      getLength:false,
      dialogTableVisible: false,
      ruleForm: {
        webName: "",
        beginTime: "",
        endTime: "",
        createBy: "",
        projectNo:'',
        batchNo: "",
        createTime: "",
        websiteNames: "",
        subjectCount: "",
        createUser: "",
        netListId:"",
        crawlerBatchId:'',
      },
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
      loading: false,
      list: [],
      listData:[],
      page: 1,
      pageSize: 20,
      total: 0,
      pageTotal: 0,
      gageTotal:0,
      pageTotal2:0,
      total2:0,
      page2:1,
      pageSize2:20,
      expandList:[],
      expandLoading:false,
      expandPage:1,
      expands:[],
      getHeight:0,
      taskHeight:0,
        count:0,
      getRowKeys(row){
        return row.id
      }
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
    //console.log(this.$route.params.projectNo)
    this.pageChange(1);
    this.getTableHeight();
    this.getTask();
  },
    created() {
        window.addEventListener('resize', this.getTableHeight);
        window.addEventListener('resize', this.getTask);
        this.getTableHeight()
        this.getTask()

    },
    destroyed(){
        window.removeEventListener('resize', this.getTableHeight)
        window.removeEventListener('resize', this.getTask)
    },
  methods: {
    fileDownload(fileName,filePath){
      this.downloadName = fileName;
      this.downloadPath = filePath;
    },
      downloadDone() {
          //当有下载任务完成时会调用此方法，并将下载文件名称和下载文件地址设置为空，以便下次下载，当downloadPath改变并且不为空时，会下载文件
          this.downloadName = "";
          this.downloadPath = "";
      },
      secondListExpand(val){
          this.$refs.refTable.toggleRowExpansion(val)
          // console.log(val)
      },
     handleSelect(val){
        this.ruleForm.websiteName = val.value
        this.pageChange(1)
        },
      getTableHeight(){
          this.getHeight=window.innerHeight-460;
      },
      getTask(){
          this.taskHeight=window.innerHeight-460;
      },
      goLink(address, e) {
          e.currentTarget.className = "under var isClick"
          window.open(address)
      },
      //开始时间和结束时间优化
      getstartTime(time) {
          this.startTime = time
      },
      getendTime(time) {
          this.endTime = time
      },
      handleClear(){
            this.ruleForm.websiteName = '';
            this.pageChange(1)
        },
      //模糊查询
      querySearch(queryString, cb) {
          bySiteName(this.ruleForm.websiteName).then(res => {
              //console.log(res)
              let VM=this
              VM.lists = res.result;
              for (let i = 0; i < VM.lists.length; i++) {
                  VM.lists[i].value = VM.lists[i].websiteName
              }
              var results = queryString ? VM.lists.filter(VM.createStateFilter(queryString)) : VM.lists;
              cb(results);

              })

      },
      createStateFilter(queryString) {
          return (state) => {
              return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
          };
      },
      // // 查看主题
      // pageChange1(data) {
      //     getSubject(data.batchNo, this.pagenum, this.pagesize).then(res => {
      //         console.log(res)
      //         this.dialogTableVisible = true
      //         this.listData = res.result.records;
      //         this.total1 = Number(res.result.total)
      //         this.pageTotal1 = Number(res.result.pages)
      //     })
      // },
      //查看主体弹框
      handleDomin(val, index,number) {
          let vm = this;
          this.count++
          this.changeReds = index;
          switch (number) {
              case 1:
                  vm.list.forEach(item=>{
                      if (item.id==val.id){
                          item.countCheck = true
                      }
                  })
                  break;
              case 2:
                  vm.list.forEach(item=>{
                      if (item.id==val.id){
                          item.operateCheck = true
                      }
                  })
                  break;
              default:
                  break;
          }
          vm.handleDominId = val.batchNo;
          vm.page2 = 1;
          vm.pageSize2 = 10;
          vm.getMain();
          vm.dialogTableVisible = true
      },
      getMain() {
         let vm = this;
          getSubject(vm.handleDominId, vm.page2, vm.pageSize2).then((res) => {
              if (res.code == 0) {
                  vm.listData = res.result.records
                  vm.total2 = Number(res.result.total)
                  vm.pageTotal2 = Number(res.result.pages)

              }
          })
      },
      //核查--上一页，下一页
      pageChange2(val) {
          let vm = this;
          vm.page2 = val;
          vm.getMain()
      },
      //核查--页数选择
      handleSizeChange2(val) {
          let vm = this;
          vm.page2 = 1;
          vm.pageSize2 = val;
          vm.getMain()
      },
      // 核查主体数
      // pagesss(data, index) {
      //     // console.log(index)
      //     this.changeReds = index;
      //     getSubject(data.batchNo, this.pagenum, this.pagesize).then(res => {
      //         console.log(res)
      //         this.dialogTableVisible = true
      //         this.listData = res.result.records;
      //         this.total1 = Number(res.result.total)
      //         this.pageTotal1 = Number(res.result.pages)

      //     })
      // },

      // 列表
      pageChange(index) {
          this.page = index
          let options = {
              projectNo: this.ruleForm.projectNo,
              webName: this.ruleForm.websiteName,
              createBy: this.ruleForm.createBy,
              beginTime: this.ruleForm.beginTime,
              endTime: this.ruleForm.endTime,
              websiteNames: this.ruleForm.websiteNames,
              subjectCount: this.ruleForm.subjectCount,
              createUser: this.ruleForm.createUser,
              pagenum: this.page,
              pagesize: this.pageSize
          }
          this.loading = true
          this.list = [];
          checkList(options).then(res => {
              this.loading = false
              if (res.code == 0) {
                  let qdList = res.result.records;
                  for (let i = 0; i < qdList.length; i++) {
                      qdList[i].parent = true;
                      qdList[i].index = i + 1;
                  }
                  this.list = res.result.records;
                  let change={'countCheck':false,'operateCheck':false}
                  this.list.forEach(item=>{
                      Object.assign(item,change)
                  })
                  //console.log(this.list)
                  this.total = Number(res.result.total)
                  this.pageTotal = Number(res.result.pages)
                  let self = this;
                  setTimeout(function(){
                    if(self.ruleForm.websiteName && self.ruleForm.websiteName != ''){ //判断所有行是否展开
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
          })
              .catch(error => {
                  this.loading = false
              });
      },
      handleSizeChange(val) {
          let Vm = this;
          Vm.pageSize = val;
          Vm.pageChange(1)
      },
      // 下载请单
      submit(row, index,number) {
          this.changeRed = index;
          switch (number) {
              case 1:
                  this.expandList.forEach(item=>{
                      if (item.id == row.id){
                          item.innerCheck = true
                      }
                  })
                  break;
              default:
                  this.expandList.forEach(item=>{
                      item.innerCheck = false
                  })
                  break;
          }
          this.$confirm('确定下载清单?', '提示', {
              type: 'warning',
              confirmButtonText: '下载',
              cancelButtonText: '取消'
          }).then(() => {
              this.downloadName = '核查主体清单.xls';
              this.downloadPath = process.env.VUE_APP_BASEURL + '/checkList/export?crawlerBatchId=' + row.id;
              // exportss(row.id).then(res => {
              //     let url = process.env.VUE_APP_BASEURL + '/checkList/export?crawlerBatchId=' + row.id;
              //     var oReq = new XMLHttpRequest();
              //     oReq.open("GET", url, true);
              //     oReq.responseType = "blob";
              //     oReq.onload = function (oEvent) {
              //         var content = oReq.response;

              //   var elink = document.createElement('a');
              //   elink.download = '核查主体清单.xls';
              //   elink.style.display = 'none';

              //         var blob = new Blob([content]);
              //         elink.href = URL.createObjectURL(blob);

              //         document.body.appendChild(elink);
              //         elink.click();

              //         document.body.removeChild(elink);
              //     };
              //     oReq.send();
              //     if (res.code == 0) {
              //         this.$message({
              //             type: 'success',
              //             message: '下载成功！'
              //         })

              //         if (this.list.length == 1 && this.page > 1) this.pageChange(this.page - 1)
              //         else if (this.list.length == 1 && this.page == 1) {
              //             this.list = []
              //             this.total = 0
              //         } else {
              //             this.pageChange(this.page)
              //         }
              //     }
              // })
          }).catch(() => {
          });
      },
      // 重置
      resetForm(ruleForm) {
          this.$refs[ruleForm].resetFields();
          this.pageChange(1)
      },
      expandChange(row, expandedRows) {
          console.log(row)
          if (expandedRows.indexOf(row) > -1) row.countCheck = true
          else row.countCheck = false
      },
      rowClick(row, event, column) {
          return row.id;
      },
      refresh(val){
          this.getLength = true

      }

  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/assets/css/varibles.scss";
.tabtext{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.red{
  cursor: pointer;
  color: #BDBDBF!important;
  text-decoration: none!important;
  }
  .reds{
  cursor: pointer;
  color: #BDBDBF!important;
  text-decoration: none!important;
  }
.btn{
  color: #0cb3f0;
   cursor: pointer;
  text-decoration: underline;
  .checked{
    color: #BDBDBF;
    text-decoration: underline;
  }
}
a.under.isClick {
color: #bdbdbd !important; /*连接访问的颜色变化*/
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
  .curPoint{
    cursor: pointer;
  }
</style>

