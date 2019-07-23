<template>
  <div class="dueDiligenceChecklist">
    <el-row>
      <companySelectMenu :operationAddBtn="false" :operationDelBtn="false" :selectData="selectData" @checkData="checkData"></companySelectMenu>
    </el-row>
    <el-row>
      <tableContent unqualifiedStatue='999' :tableData="tableData" v-loading="loading" :tableSelectionBool="tableSelectionBool" :needColNum="9">
        <!-- 附件 -->
        <template v-slot:appendix>
          <el-table-column align="center" label="附件" min-width="120">
            <template slot-scope="scope">
              <template v-if="scope.row.attachmentArr.length>0">
                <div v-for="(item,index) in scope.row.attachmentArr" :key="index">
                  <span :class="item.status=='N'?'changecolor':''" @click="jumpIn(item,scope.row.id,scope.row.isOperation)" style="text-decoration:underline;cursor: pointer;color:#79BBFF;">{{item.name}}</span>
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
           <el-table-column align="center" label="应答联系人" prop="respondMation" min-width="90">
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
                      <el-button v-if="item.name.length<=15" type="text" size="mini" style="width:100%;overflow: hidden;text-overflow: ellipsis;text-decoration:underline;" @click="jumpOutFile(item.name,item.address,scope.row.viewPath)">
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
                    <el-col :span="3" style="border:.5px solid #d1dfe3" v-if="(scope.row.isOperation==='N'||item.status=='02')&&isShowOperating"><p style="height:28px;line-height:28px;cursor: pointer;" @click="delThisFile(item.id,scope.row.id)"><i class="el-icon-close"/></p></el-col>
                    <el-popover :ref="item.id" placement="top" width="330" trigger="hover" popper-class="popover" v-if="item.status==='02'">
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
             </template>
           </el-table-column>
           <el-table-column align="center" label="操作" min-width="90">
             <template slot-scope="scope">
               <el-row type="flex" justify="space-between" v-if="scope.row.isOperation==='N'&&isShowOperating">
                <el-button type="text" size="mini" @click="initUpload(scope.row.id)" style="text-decoration:underline;">上传</el-button>
                <el-button type="text" size="mini" @click="clickConfirm(scope.row.id,scope.$index)" style="text-decoration:underline;">确认使用</el-button>
               </el-row>
             </template>
           </el-table-column>
           <el-table-column align="center" label="清单应答">
             <template slot-scope="scope">
              <el-row>
                <div @click="changeStatus(scope.row,scope.$index)" :class="!scope.row.respondContent?'haveHeight':''" style="cursor: pointer;">
                  <span v-if="showEdit[scope.$index]">{{scope.row.respondContent}}</span>
                  <el-input v-else ref="mark" type="textarea" v-model="scope.row.respondContent" maxlength="100" placeholder="请输入内容" @blur="setThisAtt(scope.row.respondContent,scope.$index,scope.row.respindId)"></el-input>
                </div>
              </el-row>
            </template>
           </el-table-column>
        </template>
      </tableContent>
    </el-row>
    <uploadDialog :uploadTitle="uploadTitle" :accept="uploadAccept" :uploadFileVisible="uploadFileVisible" @filesUploadSuccess="filesUploadSuccess" @closeDialog='closeDialog'></uploadDialog>
  </div>
</template>

<script>
import companySelectMenu from "../../components/companySelectMenu";
import tableContent from "../../components/tableContent"
import uploadDialog from '../../components/uploadDialog'
import{mapState,mapActions} from 'vuex'
import {
  getCompany,
  getSelectListByCompanyId,
  setUpdateContent,
  ConfirmToUse,
  delAttachmentFile,
  uploadFileInAttachment,
  batchUpdateFile,//批量提交审核内容
} from "@/api/dueDiligence"
import {previewFile} from "@/utils/api"
export default {
  name: "dueDiligenceChecklist",
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
      selectData:[],//选择公司的数据
      companyAbout: {id:'',companyName:''},//选中的公司
      showEdit:[],//点击出现输入框
      imgPath:require('@/assets/images/dueDiligence/encryption.png'),//暂时，加密图案
      uploadTitle:'上传资料',//标题(表格)
      uploadAccept:'.doc, .docx, .xls, .xlsx, .pdf,.png,.bmp,.gif,.jpeg,.jpg,.m4a',//上传资料的文件类型(表格)
      uploadFileVisible:false,//对话框是否出现(表格)
      thisAttributeId:'',//尽调id
      workUnitId:'',//工作单元id
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
    jumpIn(attachmentObj,id,isOperation){
      // console.log(isOperation,state);
      if(isOperation==='N'&&this.isShowOperating){
        this.setRowBtn(true);
      }else{
        this.setOnlyReadContent(true)
      }
      this.setAttachmentId(attachmentObj.id)
      this.setAttachmentName(attachmentObj.name)
      this.setThisDueId(id)
      this.setCompanyIdStr(this.companyAboutData.id)
      this.$router.push({
        name: "auditAndCorrelationAddAccessory",
        query:{id:this.$route.params.id,from:'dueDiligence',}
      });
    },
    //文件在线预览
    jumpOutFile(fileName,filePath,urlIp){
      let name =fileName.split('.')[0]
      filePath =  urlIp +  filePath
      console.log(filePath);
      previewFile(filePath,name)
    },
    //显示文字还是输入框的方法
    changeStatus(row,index){
      if(row.isOperation==='N'&&this.isShowOperating){
        this.$set(this.showEdit,index,false)
        this.$nextTick(function () {
          this.$refs.mark.$el.querySelector('textarea').focus();
        });
      }
    },
    //设置尽调清单的清单应答  id为应答id，不是尽调id
    setThisAtt(val,index,id){
      console.log(val,index);
      setUpdateContent(val,id).then(res=>{
        if(res.code===0){
          this.$message.success('修改成功!');
          this.$set(this.showEdit,index,true)
        }
        this.tabTableData(this.companyAboutData.id,this.workUnitId)
      })    
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
    //确认使用函数 合格与不合格状态没有修改，无法调整
    clickConfirm(val,index){
      ConfirmToUse(val,'Y').then(res=>{
        if(res.code===0){
          let fileIdArr = []
          for(let i=0;i<this.tableData[index].fileDataArr.length;i++){
            fileIdArr.push(this.tableData[index].fileDataArr[i].id)
          }
          // batchUpdateFile(fileIdArr,'00')
          this.tabTableData(this.companyAboutData.id,this.workUnitId)
          this.$message.success('提交成功!');
        }else{
          this.tabTableData(this.companyAboutData.id,this.workUnitId)
        }
      })
    },
    //点击上传执行函数
    initUpload(val){
      this.thisAttributeId = val
      this.uploadFileVisible=true
    },
    //上传成功的函数（表格）(未完成,第一个参数未知)??已知了 但不知道有没有问题
    filesUploadSuccess(resData, fileName,fileDescription,uploadType){
      // console.log(this.thisAttributeId,resData, fileName,fileDescription);
       uploadFileInAttachment(this.thisAttributeId,fileDescription,fileName,resData,uploadType,this.companyAboutData.id,this.workUnitId)
        .then(res => {
          if (res.code === 0) {
            this.tabTableData(this.companyAboutData.id,this.workUnitId)
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
    //不合格提示显示与影藏
    pOpen(val,index){
      if(this.tableData[index].auditorContent){
        this.$refs[val].doShow()
      }
    },
    pClose(val,index){
      if(this.tableData[index].auditorContent){
        this.$refs[val].doClose()
      }
    },
    //初始化数据
    initTableData(){
      getCompany(this.workUnitId).then(res=>{
        if(res.code===0){
          this.selectData = res.result
          //获取这个公司下的所有清单 后需要改，暂时公司ID为1
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
    //更新表格数据(有问题，暂时这样)
    tabTableData(id,workUnitId){
      getSelectListByCompanyId(id,workUnitId).then(res=>{
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
                  for(let i = 0;i<item.attachments.length;i++) {
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
                  for(let i = 0;i < item.fileDatas.length;i++) {
                    if (item.fileDatas[i]) {
                      let content = {};
                      if(item.fileDatas[i + 1]){
                        content.status = item.fileDatas[i]
                        content.id = item.fileDatas[i+1];
                        // content.attributeId = item.fileDatas[i+2];
                        content.address = item.fileDatas[i + 2];
                        content.name = item.fileDatas[i + 3];
                        content.txt = item.fileDatas[i + 4];
                        content.encryption = item.fileDatas[i + 5];
                        fileDataArr.push(content);
                      }
                      i += 5;
                    }
                  }
                  item.fileDataArr = fileDataArr;
                }else{
                  item.fileDataArr = [];
                }
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
              for(var i = 0; i < this.tableData.length; i ++) {
                  this.showEdit[i] = true;
              }
            }
          })
    },
    ...mapActions('dueDiligence', ['setThisDueId','setAttachmentName','setAttachmentId','setRowBtn','setOnlyReadContent','setCompanyAboutData','setCompanyIdStr'])
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
.haveHeight{
  height:4.4em;
}
.border{
  border:1px solid red;
}
.popoverContent{
  margin:0;
  padding:0;
  .line{
    content: '';
		width: 5px;
		height: 28px;
		background-color: #0cb3f0;
		margin-right: 8px;
  }
  .popoverTextContent{
    text-align:center;
    padding:20px;
    box-sizing:border-box;
  }
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.clear:after{
     content:".";
     display:block;
     height:0;
     clear:both;
     visibility:hidden;
}
.clear{
    clear: both;
}
 .tableCell div{
    white-space: pre-line;
  }

  .changecolor{
    color:red
  }
</style>