<template>
  <div class="createPlans">
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start">
          <upload v-if="getStatus"
            class="operate m_r20"
            id="myUpload"
            uploadType="interviewPlan"
            type="primary"
            accept=".xlsx, .xls"
            text="导入证明计划"
            @uploadSuccess="uploadPlanSuccess"
          ></upload>
          <span  class="btn-wrap" @click="handleExport">导出证明计划</span>
          <p class="download-btn"  @click="handleDownload">下载证明计划模板</p>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="end">
          <el-button v-if="getStatus" type="primary" @click="handleConfirm('confirmAll')">提交确认</el-button>
        </el-row>
      </el-col>
    </el-row>
    <download :path="downloadPath" :name="downloadName" @downloadDone="downloadDone"/>
    <el-row>
      <div class="table-box">
        <el-table
          ref="multipleTable"
          border
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          :row-class-name="rowClass"
          :max-height="getHeight"
        >
          <el-table-column align="center" type="selection" width="50"></el-table-column>
          <el-table-column align="center" prop="no" label="序号"  width="80">
            <!--<template slot="header">序号</template>-->
          </el-table-column>
          <el-table-column align="center" prop="name" label="主体名称" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column align="center" prop="type" label="类型" width="180">
              <template slot-scope="scope">
                {{scope.row.type}}
              </template>
          </el-table-column>
          <el-table-column align="center" prop="createStatus" label="状态" width="100" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <template v-if="scope.row.createStatus == 0">待提交</template>
                <template v-else-if="scope.row.createStatus == 2">待审核</template>
                <template v-else-if="scope.row.createStatus == 3">合格</template>
                <template v-else-if="scope.row.createStatus == 4">
                  <el-popover placement="top" width="330" trigger="hover" popper-class="popover">
                    <div class="reason">
                      <div class="title">不合格</div>
                      <div>{{scope.row.nopassRemark}}</div>
                      <div>
                        <span>{{scope.row.nopassAuditName}}</span>
                        <span>{{scope.row.nopassTime}}</span>
                      </div>
                    </div>
                    <div class="danger" slot="reference">
                      不合格
                      <i style="font-size: 14px;" class="el-icon-info"></i>
                    </div>
                  </el-popover>
                </template>
                <template v-else>--</template>
              </template>
            </el-table-column>
           <el-table-column align="center" width="200" :show-overflow-tooltip="true">
            <template slot="header">操作</template>
            <template slot-scope="scope" v-if="getStatus">
              <template v-if="scope.row.createStatus == 0">
                <span class="btn-item" @click="handleDelete(scope.row.id)">删除</span>
                <span class="btn-item" @click="handleConfirm(scope.row.id)">提交确认</span>
              </template>
              <!--<template v-else-if="scope.row.createStatus == 2">-</template>-->
              <!--<template v-else-if="scope.row.createStatus == 3">-</template>-->
              <template v-else-if="scope.row.createStatus == 4">
                <!-- <span class="btn-item">
                  <upload
                    accept=".png, .bmp, .gif, .jpeg, .doc, .docx, .xls, .xlsx, .pdf"
                    uploadType="outline"
                    @uploadSuccess="uploadPlanSuccess"
                  >
                    <span class="btn-item" @click="handleUpload(scope.row, 'outline')">重传</span>
                  </upload>
                </span> -->
                <span class="btn-item" @click="handleDelete(scope.row.id)">删除</span>
                <span class="btn-item" @click="handleConfirm(scope.row.id)">提交确认</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
  <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
  </div>
</template>

<script>
import { previewFile } from "@/utils/api";
import upload from "@/components/upload";
import { MessageBox } from "element-ui";
import download from "@/components/download";
import {
  getInterviewPlanData,
  importPlan,
  exportInterview,
  downloadTemplate,
  uploadOutline,
  deleteInterview,
  confirmInterview,
  getUrlType,
  getWorkUnitId
} from "@/api/complianceCertification";
export default {
  name: "createPlas",
  components: {
    upload,
    download
  },
  mounted: function() {
    this.workUnitId =this.$route.params.id;
    this.getUpdateInterviewPlanData();
    this.baseUrl = process.env.VUE_APP_BASEURL;
    this.uploadAction = process.env.VUE_APP_UPLOAD;
    this.getTableHeight()
  },
   watch: {
    "$parent.back"() {
      this.$router.go(-1);
    }
  },
  data() {
    return {
      loading: true,
      myUpload: null,
      baseUrl: "",
      uploadAction: "",
      total: 0,
      page: 1,
      pageSize: 20,
      tableData: [],
      multipleSelection: [],
      proofId: "",
      uploadType: "",
      workUnitId:'',
      getHeight:0,
      pageTotal:0,
      downloadPath:'',
      downloadName:'',

    };
  },
    computed: {
        getStatus() {
            if (this.$route.query.status == 2){
                return false
            } else {
                return true
            }
        }
    },
   created() {
      window.addEventListener('resize', this.getTableHeight);
      this.getTableHeight()

  },
  destroyed(){
      window.removeEventListener('resize', this.getTableHeight)
  },
  methods: {

    getTableHeight(){
        this.getHeight=window.innerHeight-360;
    },
    //不合格加边框
    rowClass({ row, rowIndex }) {
			if (row.createStatus == 4) return 'warn'
			else return ''
		},
    //分页
    pageChange(index) {
      this.page = index;
      this.getUpdateInterviewPlanData();
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //点击复选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //列表
    getUpdateInterviewPlanData(pageNum) {
      let vm = this;
      vm.loading = false;
      getInterviewPlanData(vm.$route.params.id,vm.page,vm.pageSize).then((res)=>{
          if (res.code == 0){
              // console.log(res)
              vm.tableData = res.result.records;
              vm.pageTotal = Number(res.result.pages);
              vm.total = Number(res.result.total);
              // vm.loading = false;
          }
      })
    },
     handleSizeChange(val){
      this.pageSize = val;
      this.page = 1;
      this.getUpdateInterviewPlanData();
        },
    //导入计划证明
   uploadPlanSuccess(path,name) {
      let options={
            filePath: path,
            workUnitId : this.$route.params.id
        }
      this.upload(options)
    },
       upload(options){
        importPlan(options.filePath,options.workUnitId).then(res=>{
            if(res.code==0){
                this.getUpdateInterviewPlanData()
                this.$message({
                    type:'success',
                    message:'上传成功'
                })
            }
        })
    },
    //下载证明计划模板
    handleDownload() {
    // alert(1123123)
    //console.log(this.baseUrl)
        this.download(this.baseUrl, "证明计划模板.xls", "Template");
      // downloadTemplate('', "证明计划模板.xls", "Template");
    },
    //导出证明计划
    handleExport() {
        //导出选中的访谈计划，.xls格式
        if (this.multipleSelection.length) {
            let interviewId = [];
            this.multipleSelection.forEach(v => {
                interviewId.push(v.id);
            });
            exportInterview({
                proofCertification: interviewId.toString()
            }).then(res => {
                this.download(
                    this.baseUrl,
                    "证明计划.xls",
                    "InterviewPlan",
                    interviewId.toString()
                );
            });
        } else {
            MessageBox.alert("请选择证明计划", "提示", {
                type: "warning",
                confirmButtonText: "确定",
                callback: () => {}
            });
            return false;
        }
      // let vm = this;
      //   var proofId = [];
      //   if(vm.multipleSelection.length !=0){
      //       vm.multipleSelection.forEach(item=>{
      //           proofId.push(item.id)
      //       })
      //       downloadTemplate('','证明计划.xls','InterviewPlan',proofId.toString())
      //       console.log(proofId);
      //   }else{
      //      MessageBox.alert("请选择证明计划", "提示", {
      //         type: "warning",
      //         confirmButtonText: "确定",
      //         callback: () => {}
      //       });
      //   return false;
      //   }
    },
    download(url, fileName, type, interviewId) {
          //下载文件公用方法，根据传入的type定义不同的下载地址
          let downloadUrl = url;
          switch (
              type //判断下载的类型，Template（下载访谈计划模板），InterviewPlan（导出/下载访谈计划）
              ) {
              case "Template":
                  downloadUrl = "/proofCertification/" + getUrlType() + "/download";
                  break;
              case "InterviewPlan":
                  downloadUrl =
                      "/proofCertification/" +
                      getUrlType() +
                      "/export? &proofIds=" +
                      interviewId;
                  break;
              default:
          }
          if (this.downloadPath != "") {
              //如果当前有下载任务给出提示
              console.log("正在下载请稍后...");
              return false;
          } else {
              //设置下载名称和下载地址，当downloadPath改变并且不为空时，会下载文件
              this.downloadName = fileName;
              this.downloadPath = downloadUrl;
          }
      },
    downloadDone() {
        //当有下载任务完成时会调用此方法，并将下载文件名称和下载文件地址设置为空，以便下次下载，当downloadPath改变并且不为空时，会下载文件
        this.downloadName = "";
        this.downloadPath = "";
    },
      //删除
    handleDelete(proofId) {
      MessageBox.alert("是否要删除？", "提示", {
        type: "warning",
        confirmButtonText: "确定",
        callback: action => {
          if (action === "confirm") {
            this.loading = true;
            deleteInterview(proofId)
              .then(res => {
                if (res.code == 0) {
                  this.getUpdateInterviewPlanData();
                } else {
                    this.pageChange(this.index)
                  //alert(res.msg);
                  this.loading = false;
                }
              })
              .catch(res => {
                this.loading = false;
              });
          }
        }
      });
    },

    //确认提交
    handleConfirm(proofId) {
      if (proofId === "confirmAll") {
        if (this.multipleSelection.length) {
          proofId = [];
          this.multipleSelection.forEach(v => {
            if (v.createStatus === 0 || v.createStatus === 4) {
              proofId.push(v.id);
            }
          });
          if (proofId.length){
              confirmInterview(proofId).then((res)=>{
                  if (res.code == 0){
                      this.popMessage('success',res.msg)
                      this.getUpdateInterviewPlanData();
                  }
              })
          } else{
              MessageBox.alert("仅可以提交主体状态为待提交和不合格的选项！", "提示", {
                  type: "warning",
                  confirmButtonText: "确定",
                  callback: () => {}
              });
          }
        } else {
            MessageBox.alert("请选择要提交审核的项！", "提示", {
            type: "warning",
            confirmButtonText: "确定",
            callback: () => {}
          });
          return false;
        }
      }else{
          this.loading = true;
          confirmInterview(proofId)
            .then(res => {
              if (res.code == 0) {
                  this.popMessage('success',res.msg)
                this.getUpdateInterviewPlanData();
              } else {
                  this.pageChange(this.page)
                this.loading = false;
              }
            })
            .catch(res => {
              this.loading = false;
            });
      }

    },
    popMessage(type,message){
        this.$message({
            type:type,
            message:message
        })
    }

  }
};
</script>

<style lang="scss">
  @import "@/assets/css/varibles.scss";
.createPlans {
  .table-box {
    margin: 20px 0;
  }
  .btn-wrap{
    background: $global-color;
    color: #fff;
    border-radius: 18px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    padding: 0 30px;
    cursor: pointer;
  }
  .download-btn{
    margin: 10px;
    font-size: 14px;
    color: $global-color;
    text-decoration: underline;
    cursor: pointer;
  }
  .m_r20 {
    margin-right: 20px;
  }
  .btn-item {
    color: #0cb3f0;
    margin: 0 5px;
    cursor: pointer;
    display: inline-block;
    text-decoration: underline;
    &:hover {
      color: #3dc2f3;
    }
  }
   .color_red{
    color: #c00;
  }
}
.el-table .cell{
  word-break: keep-all;white-space:nowrap;
}
.el-table{
  border-collapse:collapse;
}
.reason {
  box-sizing: border-box;
  padding-bottom: 10px;
  >span {
    display: block;
    margin: 30px 40px 20px;

  }
  >div:nth-of-type(2){
    padding: 20px;
  }
  >div:last-of-type{
    float: right;
    padding: 20px;
    >span:first-of-type{
      margin-right: 20px;
    }
  }
  >.time {
    color: #62656c;
    text-align: right;
    font-size: 12px;
    padding-right: 16px;
  }

  >.title {
    padding: 0;
    position: relative;
    font-size: 16px;
    font-weight: 600;
    color: #424242;
    background: #ecf1f4;
    padding: 6px 28px;

    &::before {
      content: '';
      height: 16px;
      width: 4px;
      position: absolute;
      top: 50%;
      margin-top: -8px;
      left: 15px;
      background: $global-color;
    }
  }
}
</style>
