<template>
  <div class="uploadingFiles">
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start">
          <el-button type="primary" v-if="isShowOperating" @click="allDataUploadFileBtn">整包上传资料</el-button>
          <el-button type="text" style="text-decoration:underline;" @click="uploadRecordBtn">整包上传记录</el-button>
          <uploadRecordDialog :gridData="gridData" :uploadRecordVisible="uploadRecordVisible" @closeDialog='closeDialog'></uploadRecordDialog>
          <uploadDialog :fileSize="500" :encryptionBool="true" :uploadTitle="allUploadTitle" :accept="accept" :uploadFileVisible="allDataUploadFileVisible" @filesUploadSuccess="allDataUploadSuccess" @closeDialog='allCloseDialog'></uploadDialog>
        </el-row>
      </el-col>
    </el-row>

    <el-row>
      <tableContent :tableData="tableData" v-loading="loading" :tableSelectionBool="tableSelectionBool" :needColNum="8">
        <!-- 附件 -->
        <template v-slot:appendix>
          <el-table-column align="center" label="附件" min-width="120">
          <template slot-scope="scope">
            <template v-if="scope.row.attachmentArr.length>0">
              <div v-for="(item,index) in scope.row.attachmentArr" :key="index">
                <span :data-id="item.id" @click="jumpIn(item,scope.row.id,scope.row.attribute,scope.row.companyName)" style="cursor: pointer;color:#79BBFF;text-decoration:underline;">{{item.name}}</span>
              </div>
            </template>
            <template v-else>
              <span>无附件</span>
            </template>
          </template>
        </el-table-column>
      </template>
      <!-- 尾部 -->
      <template v-slot:tailing> 
        <el-table-column align="center" label="已上传资料" min-width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <template v-if="scope.row.fileNameArr.length>0">
              <div v-for="(item,index) in scope.row.fileNameArr" :key="index" style="width:100%;overflow:hidden;text-overflow: ellipsis;white-space: nowrap;">
                <span>{{item.name}}</span>
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="answerContent" label="应答内容" min-width="150">
          <template slot-scope="scope">
            <el-input v-if="isShowOperating" type="textarea" maxlength="100" :rows="2" placeholder="请输入内容" v-model="scope.row.answerContent" :autosize="true" @blur="getInputContent(scope.row.answerContent,scope.row.clientuserInfoId)"></el-input>
            <span e-else>{{scope.row.answerContent}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="respondContent" label="反馈内容" min-width="150" v-if="respindIdBool">
          <template slot-scope="scope">
            <template v-if="scope.row.respindId==='01'">未提供</template>
            <template v-if="scope.row.respindId==='02'">无法提供</template>
            <template v-if="scope.row.respindId==='03'">部分提供</template>
            <template v-if="scope.row.respindId==='04'">全部提供</template>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="auditorUser" label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button v-if="isShowOperating" type="text" @click="handleUpload(scope.row.id)" style="padding:8px 10px;text-decoration:underline;">上传资料</el-button>
            <el-button v-if="isShowOperating" type="text" @click="submitInformation(scope.row.id,scope.row.respindId)" style="padding:8px 10px;text-decoration:underline;">提交资料</el-button>
          </template>
        </el-table-column>
      </template>
      </tableContent>
      <uploadDialog :encryptionBool="true" :uploadTitle="uploadTitle" :accept="uploadAccept" :uploadFileVisible="uploadFileVisible" @filesUploadSuccess="filesUploadSuccess" @closeDialog='closeDialog'></uploadDialog>
    </el-row>
  </div>
</template>

<script>
import companySelectMenu from "../components/companySelectMenu";
import tableContent from '../components/tableContent'
import uploadDialog from '../components/uploadDialog'
import uploadRecordDialog from '../components/uploadRecordDialog'
import {
  getTableUploadFiles,//获取表单数据
  uploadDueDiligenceData,//上传资料的路径等到数据库
  respondentContent,//上传应答内容，并提交表单
  allFileDataUpload,//整包上传
  attributeId,//上传资料
  updateFeedbackContent,//修改反馈内容状态
  submitFiles,//提交资料
  attachmentEncryptionFlag,//文件加密
} from "@/api/dueDiligence";
import { mapActions, mapState } from "vuex";
import axios from 'axios'
import { truncate } from 'fs';
export default {
  name: "uploadingFiles",
  components: {
    companySelectMenu,
    tableContent,
    uploadRecordDialog,
    uploadDialog,//自己的上传组件
  },
  data() {
    return {
      tableData:[],//表格数据
      allTableData:[],//表格备份数据
      loading:false,//是否能够操作
      tableSelectionBool:false,//多选框是否出现
      thisAttributeId:"",//尽调id
      inputContent:{},//反馈输入框的值
      allUploadTitle:'整包上传',//弹框像是名字(整包)
      accept:'.zip',//上传的格式(整包)
      allDataUploadFileVisible:false,//整包上传的弹框显示与隐藏(整包)
      uploadTitle:'上传资料',//标题(表格)
      uploadAccept:'.doc, .docx, .xls, .xlsx, .pdf,.png,.bmp,.gif,.jpeg,.jpg,.m4a',//上传资料的文件类型(表格)
      uploadFileVisible:false,//对话框是否出现(表格)
      workUnitId:'',//工作单元id
      companyAboutId: '',//公司ID
      respindIdBool:false,//是否有反馈内容
      gridData:[
        {
          id:1,
          fileName:'尽调清单.zip',
          creatDate:"2016-01-01 19:25:20",
        },
        {
          id:2,
          fileName:'公司资料.zip',
          creatDate:"2016-01-02 09:11:32",
        },
        {
          id:3,
          fileName:'样板.zip',
          creatDate:"2018-03-01 15:45:20",
        },
        {
          id:4,
          fileName:'样板.zip',
          creatDate:"2018-03-01 15:45:20",
        },
        {
          id:5,
          fileName:'样板.zip',
          creatDate:"2018-03-01 15:45:20",
        },
        {
          id:6,
          fileName:'样板.zip',
          creatDate:"2018-03-01 15:45:20",
        },
      ],//上传整包资料的数据
      uploadRecordVisible:false,//上传整包资料的弹框展示
      matterStatus: this.$route.query.status,
    };
  },
  computed: {
    isShowOperating(){
      let status = true;
      // console.log(this.matterStatus)
      if(this.matterStatus == 3){ //事项已完成
        status = false;
      }
      return status;
    },
    ...mapState('dueDiligence', ['uploadJumpIn'])
  },
  watch: {},
  methods: {
    //整包上传按钮被点击
    allDataUploadFileBtn(){
      this.allDataUploadFileVisible = true
    },
    //整包上传成功后*****(公司ID和工作单元ID需要获取)
    allDataUploadSuccess(resData,fileName,fileDescription,uploadType,encryption){
      // console.log(resData,fileName,fileDescription,uploadType,encryption);
      allFileDataUpload(resData,fileName,fileDescription,uploadType,encryption,this.workUnitId,this.companyAboutId).then(res=>{
        if (res.code === 0) {
            this.$message.success("上传成功");
          }
      })
    },
    //整包上传对话框关闭后
    allCloseDialog() {
			this.allDataUploadFileVisible = false
    },
    //设置上传的尽调ID，且打开上传的对话框（表格）
    handleUpload(val,index){
      this.uploadFileVisible =true
      this.thisAttributeId = val
    },
    //上传成功的函数（表格）
    filesUploadSuccess(resData, fileName,fileDescription,uploadType,encryption){
      // console.log(this.thisAttributeId,resData, fileName,fileDescription);
       uploadDueDiligenceData(this.thisAttributeId,fileDescription,fileName,resData,encryption,this.companyAboutId,this.workUnitId)
        .then(res => {
            if (res.code === 0) {
              this.initAllData()
              this.$message.success("上传成功");
            }else{
              this.initAllData()
            }
          })
          .catch(() => {
            this.loading = true;
          });
    },
    //关闭了对话框的回调的函数(表格)
    closeDialog(index){
      this.uploadFileVisible = false
    },
    //上传资料记录按钮点击(未完成，需要获取新数据，暂无接口，所以只打开)
    uploadRecordBtn(){
      this.uploadRecordVisible = true
    },
    //弹框关闭时
    closeDialog(){
      this.uploadRecordVisible = false
    },
    //进入附件
    jumpIn(attachmentObj,id,attribute,companyName){
      if(this.isShowOperating){
        this.setRowBtn(true);
        this.setEncryptionBool(true)
      }else{
        this.setOnlyReadContent(true)
      }
      this.setUploadJumpIn(true)
      this.setLoginStatus(true)
      this.setCompanyIdStr(this.companyAboutId)
      this.setAttachmentId(attachmentObj.id);
      this.setAttachmentName('项目名称:'+this.$route.query.projectName)//标题显示名称
      this.setThisDueId(id)
      this.$router.push({
        name: "uploadingFilesAddAccessory",
        query:{
          id:this.$route.params.id,//工作单元ID
          annexName:attachmentObj.name,//附件名称
          attribute:attribute,//尽调属性
          companyName:companyName,//公司名称
          from:'dueDiligence',
        }
      });
    },
    //提交应答内容
    getInputContent(val,id){
      console.log(val,id);
      respondentContent(id,val).then(res=>{
        if(res.code===0){
          this.$message.success("内容提交成功");
        }else{
          this.initAllData()
        }
      })
    },
    //改变上传资料状态(需要看后面修改没有，没有修改需要手动修改一下)
    submitInformation(id,resId){
      this.$confirm("是否确认提交?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        submitFiles(id,'01').then(res=>{
          console.log(res);
          if(res.code===0){
            this.initAllData()
            this.$message.success("提交成功");
          }else{
            this.initAllData()
          }
        })
      }).catch(()=>{
        this.$message.info("已取消提交");
      })
    },
    //初始化数据
    initAllData() {
      //需要获取客户的公司ID（暂直接写1）    
      getTableUploadFiles(this.companyAboutId,this.workUnitId).then(res => {
        console.log(res);
        if (res.code === 0) {
          let dataArr = res.result;
          if(dataArr){
            dataArr.forEach(item=>{
              item.inforMation = item.inforMation.replace(/\,/g, "\n");
              item.respondMation = item.respondMation.replace(/\,/g, "\n");
              //分割文件相关内容
              if(item.fileName){
                let fileNameArr = []
                item.fileName = item.fileName.split(",");
                for (let i = 0;i < item.fileName.length;i++) {
                  if (item.fileName[i]) {
                    let content = {};
                    content.url = item.fileName[i];
                    content.name = item.fileName[i + 1];
                    fileNameArr.push(content);
                    i += 1;
                  }
                }
                item.fileNameArr = fileNameArr;
              }else{
                item.fileNameArr = [];
              }
              //分割附件相关内容
              if (item.attachment) {
                let contentArr = [];
                item.attachment = item.attachment.split(",");
                for (let i = 0;i < item.attachment.length;i++) {
                  if (item.attachment[i]) {
                    let content = {};
                    content.id = item.attachment[i];
                    content.name = item.attachment[i + 1];
                    contentArr.push(content);
                    i += 1;
                  }
                }
                item.attachmentArr = contentArr;
                
              } else {
                item.attachmentArr = [];
              }
              if(item.respindId!=='-1'&&item.respindId){
                this.respindIdBool = true
              }
            })
          }else{
            dataArr =[]
          }
          for(let i=0;i<dataArr.length;i++){
            if(dataArr[i].attribute%1==0&&i!=dataArr.length-1){
              if(dataArr[i+1].attribute.split('.')[0]!=dataArr[i].attribute){
                // console.log(dataArr[i])
                dataArr.splice(i,1)
                i--
              }
            }else if(dataArr[i].attribute%1==0&&i==dataArr.length-1){
              dataArr.splice(i,1)
              i--
            }
          }
          this.tableData=[]
          this.allTableData=[]
          console.log(dataArr);
          this.tableData = JSON.parse(JSON.stringify(dataArr))
          this.allTableData = JSON.parse(JSON.stringify(dataArr))
          this.loading = false
        }
      });
    },
    ...mapActions("dueDiligence", ['setAttachmentName','setAttachmentId','setThisDueId',"setRowBtn",'setLoginStatus','setUploadJumpIn','setEncryptionBool','setCompanyIdStr','setOnlyReadContent'])
  },
  created() {
    if(this.$route.params.id){
      this.workUnitId = this.$route.params.id
    }else if(this.$route.query.id){
      this.workUnitId = this.$route.query.id
    }else{
      this.$router.go(-1)
    }
    if(this.$route.query.companyId){
      this.companyAboutId = this.$route.query.companyId
    }
    this.initAllData()
    for(let i = 0; i < this.tableData.length; i ++) {
        this.showEdit[i] = false;
    }
  },
   mounted() {
    this.action = process.env.VUE_APP_UPLOAD
    this.setLoginStatus(true);//获取进入页面的是客户
    this.setAttachmentName('项目名称:'+this.$route.query.projectName)
  },
  beforeDestroy() {
    if(!this.uploadJumpIn){
      this.setLoginStatus(false)//获取进入页面的是客户
    }
  }, 
};
</script>
<style lang='scss' scoped>
.el-dialog__header{
  text-align: left;
}
</style>