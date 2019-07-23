<template>
  <div class="addAccessory">
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start">
          <div class="title" v-if="uploadJumpIn">
            <span>{{companyName}}<i class="el-icon-arrow-right" /></span>
            <span>尽调清单{{attribute}}<i class="el-icon-arrow-right" /></span>
            <span>{{annexName}}</span>
          </div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start">
          <el-button type="primary" v-if="rowAboutBtn&&encryptionBool" width="130" @click="allEncryption">加密</el-button>
        </el-row>
      </el-col>
    </el-row>

    <el-row type="flex" justify="start" style="flex-wrap:wrap;overflow:auto">
      <div><!-- @cell-click="changeContent"  -->
        <el-table :data="tableData" border   @selection-change="checkedChange" width="100%" style="margin-top:20px;"  :row-class-name="tableRowClassName">
          <el-table-column align="center" type="selection" width="50" v-if="rowAboutBtn&&encryptionBool"></el-table-column>
          <el-table-column v-for="(item,index) in tableHeader" :key="index" :min-width="item.title== '序号'?'100':'180'" :show-overflow-tooltip="true">
            <template slot="header" slot-scope="scope">
              <div @click="tabTableHeader(scope.$index)" style="width:100%;">
                <div v-if="!showEditHeader[scope.$index]" style="width:100%;word-wrap:break-word;">
                  <span v-if="item.title.length<=8">{{item.title}}</span>
                  <el-tooltip class="item" effect="dark" :content="item.title" placement="top-start" v-else>
                    <span>{{item.title}}</span>
                  </el-tooltip>
                </div>
                <el-input v-else ref="mark" v-model="item.title" placeholder="请输入内容" maxlength="20"  @blur="changeHeader(item.title,item.id)"></el-input>
              </div>
            </template>
            <template slot-scope="scope">
              <div @click="tabTablBody(scope.$index,item.id)" :class="!scope.row.attributeInfoName?'haveHeight':''" style="width:100%;cursor: pointer;overflow: hidden;text-overflow: ellipsis;">
                <el-input v-if="showEditContent[scope.$index]&&item.id===clickContent" ref="marks" maxlength="20" v-model="scope.row[item.id]" placeholder="请输入内容" @blur="changeContent(scope.$index)"></el-input>
                <span v-else>{{scope.row[item.id]}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" v-if="rowAboutBtn||onlyReadContent" min-width="200">
            <template slot-scope="scope">
              <div v-if="!scope.row.fileName">
                <el-button type="text" @click="addAttachment(scope.row.headerId)" v-if="rowAboutBtn" style="text-decoration:underline;">添加</el-button>
              </div>
              <div v-else>
                <div style="width:100%;display:flex;justify-content: space-between">
                  <div style="width:60%;">
                    <el-tooltip class="item" effect="dark" :content="scope.row.fileName" placement="top-start" style="width:100%;" v-if="scope.row.fileName.length>5">
                      <el-button type="text" @click="openFilePreview(scope.row.filePath,scope.row.fileName,scope.row.viewPath)"  style="padding:5px 10px;overflow: hidden;text-decoration:underline;text-overflow: ellipsis;white-space: nowrap">
                        <img v-if="scope.row.flag=='Y'" :src="imgPath" alt="加密文件" style="width:10px;">
                        {{scope.row.fileName}}
                      </el-button>
                    </el-tooltip>
                    <el-button v-else type="text" @click="openFilePreview(scope.row.filePath,scope.row.fileName,scope.row.viewPath)"  style="width:60%;padding:5px 10px;overflow: hidden;text-decoration:underline;text-overflow: ellipsis;white-space: nowrap">
                      <img v-if="scope.row.flag=='Y'" :src="imgPath" alt="加密文件" style="width:10px;">
                      {{scope.row.fileName}}
                    </el-button>
                  </div>
                  <el-button  v-if="rowAboutBtn" type="text" @click="delAttachmentFile(scope.row.headerId)" style="width:40%;padding:5px;text-decoration:underline;">删除</el-button>                  
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div>
        <el-button @click="addCol" v-if="colAboutBtn" style="width:200px;border-radius:0;margin-left:10px;margin-top: 20px;" plain>+ 添加列</el-button>
      </div>
    </el-row>

    <el-row>
      <div style="margin:20px 0;">
        <el-button v-if="rowAboutBtn&&addRowBool" @click="addRowVisible = true" style="width:200px;border-radius:0;" plain>+ 添加行</el-button>
        <el-dialog title="添加行" :visible.sync="addRowVisible" @close="closeRow">
          <div style="display:flex;justify-content: flex-start;flex-wrap:wrap">
            <div v-for="(item,index) in tableHeader" :key="index" style="width:30%;margin:5%;" v-if="index>0">
              <p style="padding:10px 0;">{{item.title}}:</p>
              <el-input v-model="item.content" auto-complete="off" maxlength="20" size="mini" placeholder="请输入内容" @change="getInputValue(item.content,item.id)"></el-input>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addRowVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRow">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-row>
    <uploadDialog :fileSize="500" :uploadTitle="uploadTitle" :accept="uploadAccept" :encryptionBool="encryptionBool" :uploadFileVisible="uploadFileVisible" @filesUploadSuccess="uploadSuccess" @closeDialog='closeDialog'></uploadDialog>
    <inputDialog :options="options1"></inputDialog>
  </div>
</template>

<script>
import uploadDialog from '../components/uploadDialog'
import inputDialog from "../components/inputDialog";
import { mapState,mapActions } from 'vuex'
import {
  getAttachmentList,//表格表头的数据获取
  getRowContent,//表格所有内容的数据获取
  clientuserContent,//增加的内容
  modifyAttachmentContent,//修改内容
  delAttachmentContentId,//删除附件中的附件
  attachmentEncryptionFlag,//附件加密
  uploadAttachment,//上传附件（第五六部）
  uploadAttachmentFile,//上传附件（第八步）
  getCompany,//获取公司相关
} from "@/api/dueDiligence";
import {
  previewFile, //文件预览
} from "@/utils/api";
import { MessageBox } from "element-ui";
export default {
  name: "addAccessory",
  components: {
    uploadDialog,
    inputDialog
  },
  computed: {
			...mapState('dueDiligence', ['attachmentName','thisDueId','colAboutBtn','rowAboutBtn','attachmentId','onlyReadHeader','onlyReadContent','uploadJumpIn','loginStatus','encryptionBool','companyIdStr','eightJumpIn'])
  },
  data() {
    return {
      tableData: [],//表内容
      tableHeader: [
        {
          id: "id",
          title: "序号",
        }
      ],//表头
      addRowVisible:false,//添加行的弹框
      imgPath:require('@/assets/images/dueDiligence/encryption.png'),//暂时，加密图案
      addStrObj:{},//添加行的对象
      addStrArr:[],//添加行的数组
      action: '',//上传路径
      fileDescription:'',//文件描述的输入框
      thisRowId:'',//这行的ID
      checkedDataArr:[],//多选框选择的值得ID数组
      thisHeaderId:'',//这个附件的表头id或者说附件id
      uploadTitle:'添加文件',//对话框标题（表格）
      uploadAccept:".doc, .docx, .xls, .xlsx, .pdf,.png,.bmp,.gif,.jpeg,.jpg,.m4a",//上传文件格式（表格）
      uploadFileVisible:false,//对话框是否展示（表格）
      showEditHeader:[],//表头是否切换input的数组
      showEditContent:[],//表内容是否切换input的数组
      clickContent:'',//表内容选中的值
      options1:{
          dialogFormVisible:false,
          handleClose:this.handleClose,
          reasonInput:'',
          moreShow:false,
          title:'请输入附件表头',
          handleCommit:this.handleCommit,
      },//公共组件弹框的参数(添加列)
      attribute:'',//尽调清单名称（上传资料页面进入获取）
      annexName:'',//附件名称（上传资料页面进入获取）
      companyName:'',//公司名称
      unqualifiedStatue:'',//不合格的样式
      addRowBool:true,//有没有添加行的按钮
      workUnitId:'',//工作单元id
    };
  },
  watch:{
    tableHeader:function(val,oldval){
      let allNameArr = []
      let allName = ''
      val.forEach(v=>{
        allNameArr.push(v.title)
      })
      allNameArr.splice(0,1)
      allNameArr.forEach(item=>{
        item = item.replace(/,/g,";encry;")
      })
      allName = allNameArr.join(',')
      console.log(allName);
      this.setContentName(allName)
    }
  },
  methods: {
    //表头出现input
    tabTableHeader(index){
      if(index!==0&&this.colAboutBtn){
        this.$set(this.showEditHeader,index,true)
        this.$nextTick(function () {
          this.$refs.mark[0].$el.querySelector('input').focus();
        });
      }
    },
    //变更表头
    changeHeader(col,id) {
      if(this.colAboutBtn){
        this.$set(this.showEditHeader,id,false)
        if(col){
          console.log(col);
          this.tableHeader[id].title = col;
          let allNameArr = []
          let allName = ''
          this.tableHeader.forEach(item=>{
            allNameArr.push(item.title)
          })
          allNameArr.splice(0,1)
          allNameArr.forEach(item=>{
            item = item.replace(/,/g,";encry;")
          })
          allName = allNameArr.join(',')
          console.log(allName);
          this.setContentName(allName)
        }
        // console.log(this.tableHeader);
      }
    },
    //改变表内容的input出现
    tabTablBody(index,key){
      if(key!=='id'&&this.rowAboutBtn){
        this.$set(this.showEditContent,index,true)
        this.clickContent = key
        this.$nextTick(function () {
          this.$refs.marks[0].$el.querySelector('input').focus();
        });
      }
    },
    //变更表内容(逗号加密上传)
    changeContent(index){
      if(this.rowAboutBtn){
        let thisRowContent = []
        let headerId=""
        for(let key in this.tableData[index]){
          if(key!='id'&&key!='headerId'&&key!='filePath'&&key!='fileName'&&key!='viewPath'&&key!='flag'){
            thisRowContent.push(this.tableData[index][key])//把这一行的内容放入数组
          }
        }
        // console.log(thisRowContent);
        thisRowContent.forEach(item=>{
          item = item.replace(/,/g,";encry;")
        })
        headerId = this.tableData[index].headerId
        thisRowContent = thisRowContent.join(',')
        // console.log(thisRowContent,headerId);
        modifyAttachmentContent(thisRowContent,headerId).then(res=>{
          if(res.code===0){
            this.$set(this.showEditContent,index,false)
            this.clickContent = ''
            this.$message.success('修改成功')
          }else{
            this.$router.go(-1)
          }
        })
      }
    },
    //增加表头
    addCol(){
      if(this.colAboutBtn){
        this.options1.dialogFormVisible = true
        this.options1.reasonInput = ''
      } 
    },
    //添加附件的弹框点击确认后
    handleCommit(){
      if (this.options1.reasonInput == ''){
        this.$message.warning('输入不能为空！')
      }else{
        let thisTableHeaderObj ={id:'',title:''} 
        thisTableHeaderObj.id= this.tableHeader.length
        thisTableHeaderObj.title= this.options1.reasonInput
        this.tableHeader.push(thisTableHeaderObj)
        // console.log(this.tableHeader);
        this.options1.dialogFormVisible = false
        this.options1.reasonInput = ''
      }
    },
    //添加列的弹框点击取消后
    handleClose(){
      this.options1.dialogFormVisible = false
      this.options1.reasonInput = ''
    },
    //获取输入框的值
    getInputValue(val,id){
      this.addStrObj[id]=val
      // console.log(this.addStrObj);
    },
    //增加行的方法(逗号加密上传)
    addRow(){
      if(this.rowAboutBtn){
        this.addStrArr = []
        let count = 0
        for(let key in this.addStrObj){
          if(this.addStrObj.hasOwnProperty(key)){ 
              count++;
          }
        }
        if(count>0){
          if(count===this.tableHeader.length-1){
            for(let key in this.addStrObj){
              this.addStrArr.push(this.addStrObj[key])
            }
          }else{
            for(let key in this.tableHeader){
              if(this.addStrObj[this.tableHeader[key].id]&&this.tableHeader[key].id!='id'){
                this.addStrArr.push(this.addStrObj[key])
              }else if(this.tableHeader[key].id!='id'){
                this.addStrArr.push('')
              } 
            }
          }
          let encryption = [...this.addStrArr]
          encryption.forEach(item=>{
            item = item.replace(/,/g,";encry;")
          })
          let addStr = encryption.join(',')
          console.log(addStr);
          clientuserContent(addStr,this.attachmentId).then(res=>{
            if(res.code===0){
              this.addRowVisible = false
              this.initTableAllData()
              this.$message.success('提交成功');
            }else{
              this.$router.go(-1)
            }
          })
        }else{
          this.$message.error('你还未输入任何内容，请输入内容');
        }
      }
      
    },
    //关闭增加行的方法
    closeRow(){
      this.tableHeader.forEach(item=>{
        if(item.content){
          item.content = ''
        }
      })
    },
    //点击添加按钮时
    addAttachment(val){
      this.thisRowId=val
      this.uploadFileVisible=true
    },
    //添加文件成功后的函数
    uploadSuccess(resData,fileName,fileDescription,uploadType,encryption){
      if(this.eightJumpIn){
        uploadAttachmentFile(this.thisRowId,fileDescription,fileName,resData,this.companyIdStr,this.workUnitId,encryption)
        .then(res => {
            if (res.code === 0) {
              this.initTableAllData()
              this.$message.success('上传成功');
            }else{
              this.$router.go(-1)
            }
          })
        .catch(() => {
          this.loading = true;
        });
      }else{
        uploadAttachment(this.thisRowId,fileDescription,fileName,resData,this.companyIdStr,this.workUnitId,encryption)
        .then(res => {
            if (res.code === 0) {
              this.initTableAllData()
              this.$message.success('上传成功');
            }else{
              this.$router.go(-1)
            }
          })
        .catch(() => {
          this.loading = true;
        });
      }
    },
    //对话框关闭后函数
    closeDialog(){
      this.uploadFileVisible=false
    },
    //删除文件
    delAttachmentFile(val){
      this.$confirm("此操作将永久删除该附件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        delAttachmentContentId(val).then(res=>{
          if(res.code===0){
            this.initTableAllData()
            this.$message.success("删除成功");
          }else{
            this.$router.go(-1)
          }
        })
      }).catch(()=>{
        this.$message.info( "已取消删除");
      })
    },
    //获取多选框的值
    checkedChange(val){
      if(this.rowAboutBtn){
        this.checkedDataArr =[]
        val.forEach(item=>{
          this.checkedDataArr.push(item.headerId) 
        })
        // console.log(this.checkedDataArr);
      }
    },
    //是否需要批量加密
    allEncryption(){
      if(this.checkedDataArr.length>0&&this.rowAboutBtn){
        this.$confirm("是否加密这些文件?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(()=>{
          console.log(this.checkedDataArr)
          let fileIds = []
          this.tableData.forEach(item=>{
            if(this.checkedDataArr.indexOf(item.headerId)>'-1'){
              fileIds.push(item.fileId)
            }
          })
          let fileIdStr =fileIds.join(',')
          console.log(fileIdStr);
          attachmentEncryptionFlag(fileIdStr).then(res=>{
            if(res.code===0){
              this.initTableAllData()
              this.$message.success("加密成功");
            }else{
              this.$router.go(-1)
            }
          })
        }).catch(()=>{
          this.$message.info("已取消加密");
        }) 
      }else{
        this.$alert("未选择需要加密文件", "提示", {confirmButtonText: "确定",type: "warning"});
      }
    },
    //文件预览
    openFilePreview(url,name,urlIp){
      name =name.split('.')[0]
      url = urlIp +  url
      console.log(url);
      previewFile(url,name)
    },
    //获取初始化只获取表头的方法
    initTableHeader(arr,arr2){
      if(arr.length>0&&arr[0]){
        arr.forEach((item,i)=>{
          let arrObj = {id:'',title:''}
          arrObj.id = Number(i)+1
          arrObj.title= item
          arr2.push(arrObj)
        })
      }
      return arr2
    },
    //初始化整个表的方法
    initTableAllData(){
      getRowContent(this.attachmentId).then(res=>{
          console.log(res);
          if(res.code===0&&res.result[0]){
            let headerAllDataArr = res.result[0]//第一项未表头，后面为表内容数据
            let bodyAllDataArr = res.result
            bodyAllDataArr.splice(0,1)
            //渲染表头
            let headerDataArr = []
            let headerNameArr = []
            headerNameArr = headerAllDataArr.headerName.split(',')
            headerNameArr.forEach(item=>{
              item = item.replace(/;encry;/g,",")
            })
            headerDataArr = this.initTableHeader(headerNameArr,headerDataArr)
            console.log(headerDataArr)
            this.tableHeader=[
              {
                id: "id",
                title: "序号",
              }
            ],
            this.tableHeader = this.tableHeader.concat(headerDataArr)
            this.thisHeaderId =[]
            this.thisHeaderId = headerAllDataArr.contentId
            if(this.tableHeader.length<=1){
              this.addRowBool = false
            }
            console.log(this.tableHeader)
            //渲染表身
            let bodyDataArr = []
            // console.log(bodyAllDataArr);
            for(let i=0;i<bodyAllDataArr.length;i++){
              let bodyContentArr =[]
              bodyContentArr = bodyAllDataArr[i].headerName.split(',')
              bodyContentArr.forEach(item=>{
                item = item.replace(/;encry;/g,",")
              })
              let bodyObj={
                id:Number(i)+1,//在哪一行和上面表头的id属性对应
                headerId:bodyAllDataArr[i].contentId,
                fileName:bodyAllDataArr[i].fileName,
                filePath:bodyAllDataArr[i].filePath,
                viewPath:bodyAllDataArr[i].viewPath,
                flag:bodyAllDataArr[i].flag,
                fileId:bodyAllDataArr[i].fileId
              }
              for(let j in bodyContentArr){
                bodyObj[headerDataArr[j].id]=bodyContentArr[j]
              }
              bodyDataArr.push(bodyObj)
            }
            this.tableData =[]
            this.tableData = bodyDataArr
            console.log(this.tableData);
            for(let i=0;i<this.tableData.length;i++){
              this.showEditContent.push(false)
            }
          }
        })
    },
    //有不合格的行数的样式
    tableRowClassName({row}){
      // console.log(this.unqualifiedStatue);
      // console.log(row);
      // if(row.status===this.unqualifiedStatue){
      //   return 'warnResult'
      // }else{
      //   return ''
      // }
    },
    ...mapActions('dueDiligence', ['setContentName','setAttachmentId','setColBtn','setRowBtn','setOnlyReadHeader','setOnlyReadContent','setUploadJumpIn','setLoginStatus','setEncryptionBool','setEightJumpIn','setTwoJumpIn'])
  },
  created() {
    // console.log(this.attachmentName,this.thisDueId)
    console.log(this.rowAboutBtn,this.encryptionBool);
    if(this.thisDueId){
      if(this.colAboutBtn||this.onlyReadHeader){
        getAttachmentList(this.thisDueId).then(res=>{
          console.log(res);
          if(res.code===0){
            let dataArr=[]
            for(let index in res.result){
              if(this.attachmentName===res.result[index].attachmentName){
                this.setAttachmentId(res.result[index].id)
                let headerNameArr = []
                headerNameArr = res.result[index].contentName.split(',')
                for(let i in headerNameArr){
                  headerNameArr[i] = headerNameArr[i].replace(/;encry;/g,",")
                }
                dataArr = this.initTableHeader(headerNameArr,dataArr)
              }
            }
            // console.log(dataArr);
            this.tableHeader = this.tableHeader.concat(dataArr)
            console.log(this.tableHeader);
            for(let i=0;i<this.tableHeader.length;i++){
              this.showEditHeader.push(false)
            }
          }
        })
      }
      if(this.rowAboutBtn||this.onlyReadContent){
        this.initTableAllData()
      }
      if(this.uploadJumpIn){
        // console.log(this.$route.query);
        this.attribute = this.$route.query.attribute
        this.annexName = this.$route.query.annexName
        this.companyName = this.$route.query.companyName
      }
    }else{
      this.$router.go(-1);
    }
    
  },
  mounted() {
    this.action = process.env.VUE_APP_UPLOAD
    if(this.$route.params.id){
      this.workUnitId = this.$route.params.id
    }else if(this.$route.query.id){
      this.workUnitId = this.$route.query.id
    }else{
      this.$router.go(-1)
    }
	},
  beforeDestroy() {
    this.setColBtn(false)
    this.setRowBtn(false)
    this.setOnlyReadHeader(false)
    this.setOnlyReadContent(false)
    this.setUploadJumpIn(false)
    this.setLoginStatus(false);
    this.setEncryptionBool(false)
    this.setEightJumpIn(false)
    this.setTwoJumpIn(false)
  }
};
</script>
<style lang='scss' scoped>
.haveHeight{
  height:2.7em;
}
.title {
		// color: $txt-color;
    box-sizing: border-box;
    padding:10px;
		font-size: 16px;
		line-height: 28px;
		position: relative;
		font-weight: 600;
	}
</style>
<style lang='scss'>
.el-table tr.warnResult {
  background: #FFC;
  position: relative;
  td {
    border-bottom-color: #EC395A;
    border-top: 1px solid #EC395A;
    &:first-child {
      border-left: 1px solid #EC395A;
    }
    &:last-child {
      border-right: 1px solid #EC395A;
    }
  }
}
</style>
