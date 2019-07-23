<template>
  <div class="ConfirmInformation">
    <el-row>
      <companySelectMenu :operationAddBtn="false" :operationDelBtn="false" :selectData="selectData" @checkData="checkData"></companySelectMenu>
    </el-row>
    <el-row>
      <tableContent :tableData="tableData" v-loading="loading" :tableSelectionBool="tableSelectionBool" :needColNum="9">
        <!-- 附件 -->
        <template v-slot:appendix>
          <el-table-column align="center" label="附件" min-width="120">
            <template slot-scope="scope">
              <template v-if="scope.row.attachmentArr.length>0">
                <div v-for="(item,index) in scope.row.attachmentArr" :key="index">
                  <span :data-id="item.id" @click="jumpIn(item,scope.row.id,scope.$index)" style="cursor: pointer;color:#79BBFF;text-decoration:underline;">{{item.name}}</span>
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
          <el-table-column align="center" label="应答部门" prop="dept"></el-table-column>
          <el-table-column align="center" label="应答联系人" prop="respondMation" min-width="95">
            <template slot-scope="scope">
              <div>
                <span>{{scope.row.respondMation}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="文件" min-width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.fileDataArr.length>0">
                <el-row v-for="(item,index) in scope.row.fileDataArr" :key="index" :class="item.status=='02'?'border':''" @mouseenter="pOpen(item.id,scope.$index)" @mouseleave="pClose(item.id,scope.$index)">
                  <el-col :span="13" style="border:.5px solid #d1dfe3;">
                    <el-button v-if="item.name.length<=12" type="text" size="mini" style="width:100%;overflow: hidden;text-overflow: ellipsis;text-decoration:underline;" @click="jumpOutFile(item.name,item.address,scope.row.viewPath)">
                    <img v-if="item.encryption=='Y'" :src="imgPath" alt="加密文件" style="width:10px;">
                    {{item.name}}</el-button>
                    <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start" v-else>
                      <el-button type="text" size="mini" style="width:100%;overflow: hidden;text-overflow: ellipsis;text-decoration:underline;" @click="jumpOutFile(item.name,item.address,scope.row.viewPath)">
                        <img v-if="item.encryption=='Y'" :src="imgPath" alt="加密文件" style="width:10px;">
                      {{item.name}}</el-button>
                    </el-tooltip>
                  </el-col>
                  <el-col :span="8" style="border:.5px solid #d1dfe3">
                    <div style="width:100%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" v-if="item.txt.length<=8">
                      <span style="height:28px;line-height:28px">{{item.txt}}</span>
                    </div>
                    <el-tooltip class="item" effect="dark" :content="item.txt" placement="top-start" v-else>
                      <div style="width:100%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                        <span style="height:28px;line-height:28px">{{item.txt}}</span>
                      </div>
                    </el-tooltip>
                  </el-col>
                  <el-col :span="3" style="border:.5px solid #d1dfe3" v-if="(scope.row.feedbackContent=='00'||item.status=='02')&&isShowOperating"><p style="height:28px;line-height:28px;cursor: pointer;" @click="delThisFile(item.id,scope.row.id)"><i class="el-icon-close"/></p></el-col>
                  <el-popover :ref="item.id" placement="top" width="330" trigger="hover" popper-class="popover" v-if="scope.row.status==='02'">
                    <div class="reason">
                        <div class="title">不合格</div>
                        <div>{{scope.row.auditorContent}}</div>
                        <div>
                            <span>{{scope.row.auditorUser}}</span>
                            <span>{{scope.row.auditorTime}}</span>
                        </div>
                    </div>
                  </el-popover>
                </el-row>
              </div>
              <el-row v-else>
                <span>无文件</span>
              </el-row>
              <el-row>
                <el-button type="text" size="mini" @click="initUpload(scope.row.id)" v-if="scope.row.feedbackContent=='00'&&isShowOperating" style="text-decoration:underline;">上传</el-button>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column align="center" label="清单应答" prop="respondContent"></el-table-column>
          <el-table-column align="center" label="审核校验" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.feedbackContent=='00'&&isShowOperating">
                <div> 
                  <el-select v-model="scope.row.feedbackContents" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div>
                  <el-button type="text" size="mini" @click="saveAndSubmit(scope.row.feedbackContents,scope.row.clientuserInfoId)" style="text-decoration:underline;">保存并提交</el-button>
                </div>
              </div>
              <div v-else>
                <span v-if="scope.row.feedbackContents=='01'">未提供</span>
                <span v-if="scope.row.feedbackContents=='02'">无法提供</span>
                <span v-if="scope.row.feedbackContents=='03'">部分提供</span>
                <span v-if="scope.row.feedbackContents=='04'">全部提供</span>
              </div>
            </template>
          </el-table-column>
        </template>
      </tableContent>
      <uploadDialog :uploadTitle="uploadTitle" :accept="uploadAccept" :uploadFileVisible="uploadFileVisible" @filesUploadSuccess="filesUploadSuccess" @closeDialog='closeDialog'></uploadDialog>
    </el-row>
  </div>
</template>

<script>
import companySelectMenu from "../components/companySelectMenu";
import tableContent from "../components/tableContent"
import uploadDialog from '../components/uploadDialog'
import {
  getCompany,//获取公司名称
  selectGetAllListByCompanyId,//获取页面数据
  uploadDueDiligenceDataFile,//文件上传(第八步的方法)
  respondentFeedbackContent,//添加反馈内容
  updateFeedbackContent,//修改反馈内容
  delAttachmentFile,//删除文件
} from "@/api/dueDiligence"

import {previewFile} from "@/utils/api"
import { mapActions, mapState } from "vuex";
export default {
  name: "ConfirmInformation",
  components: {
    companySelectMenu,
    tableContent,
    uploadDialog
  },
  data() {
    return {
      tableData: [],//表格数据
      loading:false,//加载动画
      tableSelectionBool:false,//是否有多选框
      operationBtn:false,//是否有删除或添加公司的按钮
      selectData:[],//选择公司的数据
      companyAbout: {id:'',companyName:''},//选中的公司
      imgPath:require('@/assets/images/dueDiligence/encryption.png'),//暂时，加密图案
      uploadTitle:'上传资料',//标题(表格)
      uploadAccept:'.doc, .docx, .xls, .xlsx, .pdf,.png,.bmp,.gif,.jpeg,.jpg,.m4a',//上传资料的文件类型(表格)
      uploadFileVisible:false,//对话框是否出现(表格)
      options:[
        {
          value:'00',
          label:'待校验'
        },
        {
          value:'01',
          label:'未提供'
        },
        {
          value:'02',
          label:'无法提供'
        },
        {
          value:'03',
          label:'部分提供'
        },
        {
          value:'04',
          label:'全部提供'
        },
      ],//下拉框选项
      workUnitId:'',//工作单元ID
      thisAttributeId:'',//尽调id
      thisStatus:true,//是否能操作（不合格文件无法操作）
      matterStatus: this.$route.query.status,
    };
  },
  computed: {
    isShowOperating(){
      let status = true;
      if(this.matterStatus == 2){ //事项已完成
        status = false;
      }
      return status;
    },
    ...mapState('dueDiligence', ['companyAboutData'])
  },
  watch: {},
  methods: {
    //获得公司选中值
    checkData(val) {
      if (val.length > 0) {
        this.setCompanyAboutData(val[0])
        this.tabTableData(this.companyAboutData.id,this.workUnitId)
      } else {
        this.tableData = [];
      }
    },
    //进入附件
    jumpIn(attachmentObj,id,index){
      if(this.tableData[index].feedbackContent!=='00'||!this.isShowOperating){
        this.setOnlyReadContent(true)
      }else{
        this.setRowBtn(true);
      }
      this.setCompanyIdStr(this.companyAboutData.id)
      this.setAttachmentId(attachmentObj.id)
      this.setAttachmentName(attachmentObj.name)
      this.setThisDueId(id)
      this.setEightJumpIn(true)
      this.$router.push({
        name: "confirmInformationAddAccessory",
        query:{id:this.$route.params.id,from:'dueDiligence',}
      });
    },
    //点击上传执行函数
    initUpload(val){
      this.thisAttributeId = val
      this.uploadFileVisible=true
    },
    //上传成功的函数（表格）
    filesUploadSuccess(resData, fileName,fileDescription,uploadType){
      // console.log(this.thisAttributeId,resData, fileName,fileDescription);
       uploadDueDiligenceDataFile(this.thisAttributeId,this.companyAboutData.id,this.workUnitId,fileDescription,fileName,resData,uploadType)
        .then(res => {
          if (res.code === 0) {
            this.tabTableData(this.companyAboutData.id,this.workUnitId)
            this.$message.success('上传成功!');
          }else{
            this.tabTableData(this.companyAboutData.id,this.workUnitId)
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
    //删除资料函数
    delThisFile(val,attrId){
      console.log(val,attrId);
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delAttachmentFile(val,attrId).then(res=>{
            if(res.code===0){
              this.tabTableData(this.companyAboutData.id,this.workUnitId)
              this.$message.success('删除成功!');
            }else{
              this.tabTableData(this.companyAboutData.id,this.workUnitId)
            }
          })
        }).catch(() => {
          this.$message.info('已取消删除');
        });  
    },
    //文件在线预览
    jumpOutFile(fileName,filePath,urlIp){
      let name =fileName.split('.')[0]
      filePath = urlIp +  filePath
      previewFile(filePath,name)
    },
    //保存并提交
    saveAndSubmit(val,clientuserInfoId){
      if(val==='00'){
        this.$alert("请选择校验状态后再次提交", "提示", {confirmButtonText: "确定",type: "warning"});
      }else{
        console.log(clientuserInfoId,val);
        respondentFeedbackContent(clientuserInfoId,val).then(res=>{
          if(res.code===0){
            this.tabTableData(this.companyAboutData.id,this.workUnitId)
            this.$message.success('提交成功!');
          }else{
            this.tabTableData(this.companyAboutData.id,this.workUnitId)
          }
        })
      }
    },
    //初始化表格
    initTableData(){
      getCompany(this.workUnitId).then(res=>{
        if(res.code===0){
          this.selectData = res.result
          //传入公司Id给下面这个方法获取表单数据this.companyAboutData.id
          if(!this.companyAboutData.id){
            this.setCompanyAboutData(this.selectData[0])
            if(!this.companyAboutData){
              this.setCompanyAboutData(this.companyAbout)
            }
          }
          if(this.companyAboutData.id){
            this.tabTableData(this.companyAboutData.id,this.workUnitId)
          }else{
            this.loading=false
          }
        }
      })
    },
    //更新表格
    tabTableData(companyAboutId,workUnitId){
      selectGetAllListByCompanyId(companyAboutId,workUnitId).then(res=>{
        console.log(res);
        if(res.code===0){
          let dataArr = res.result;
          if(!dataArr){
            dataArr = []
          }
          dataArr.forEach(item=>{
            //分割答疑人联系方式及应答联系人
            item.inforMation = item.inforMation.replace(/\,/g, "\n");
            item.respondMation = item.respondMation.replace(/\,/g, "\n");
            //分割附件
            if (item.attachment) {
              let contentArr = [];
              item.attachments = item.attachment.split(",");
              // item.thisStatus = item.attachments.replace(item.attachments.length-1,1)
              for (let i = 0;i < item.attachments.length;i++) {
                if (item.attachments[i]) {
                  let content = {};
                  content.id = item.attachments[i];
                  content.status = item.attachments[i + 1];
                  content.name = item.attachments[i + 2];
                  contentArr.push(content);
                  i += 2;
                }
              }
              item.attachmentArr = contentArr;
            } else {
              item.attachmentArr = [];
            }
            //分割文件
            if(item.fileData){
              let fileDataArr =[]
              item.fileDatas = item.fileData.split(",");
              for (let i = 0;i < item.fileDatas.length;i++) {
                if (item.fileDatas[i+1]) {
                  let content = {};
                  content.status = item.fileDatas[i]
                  content.id = item.fileDatas[i+1];
                  // content.attributeId = item.fileDatas[i+2];
                  content.address = item.fileDatas[i + 2];
                  content.name = item.fileDatas[i + 3];
                  content.txt = item.fileDatas[i + 4];
                  content.encryption = item.fileDatas[i + 5];
                  fileDataArr.push(content);
                  i += 5;
                }
              }
              item.fileDataArr = fileDataArr;
            }else{
              item.fileDataArr = [];
            }
            if(!item.feedbackContent){
              item.feedbackContent='00'
            }
            item.feedbackContents = item.feedbackContent
          })
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
          this.tableData = dataArr;
          this.loading = false
        }
      })
    },
    ...mapActions("dueDiligence", ['setAttachmentName','setAttachmentId','setThisDueId',"setRowBtn",'setOnlyReadContent','setCompanyAboutData','setCompanyIdStr','setEightJumpIn'])
  },
  created() {
    if(this.$route.params.id){
      this.workUnitId = this.$route.params.id
    }else if(this.$route.query.id){
      this.workUnitId = this.$route.query.id
    }else{
      this.$router.go(-1)
    }
    this.initTableData()
  },
  mounted() {}
};
</script>
<style lang='scss' scoped>
 .tableCell div{
    white-space: pre-line;
  }
</style>