<template>
  <div class="createRepertoireContent">
    <el-row>
      <companySelectMenu :selectData="selectData" @checkData="checkData" @changeSelectData="changeSelectData" :addCompanyAbout="addCompanyAbout"></companySelectMenu>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start">
          <upload v-if="isShowOperating" class="operate" uploadType="interviewCompany" type="primary" accept=".xlsx, .xls" text="导入尽调清单" :companyAbout="companyAboutData" @uploadSuccess="uploadinventorySuccess"></upload>
          <el-button v-if="isShowOperating" type="primary" @click="handleExport">导出尽调清单</el-button>
          <el-button v-if="isShowOperating" type="text" @click="handleDownload" style="text-decoration:underline;">下载尽调清单模板</el-button>
          <download :methodType="methodType" :path="downloadPath" :name="downloadName" @downloadDone="downloadDone"></download>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="end">
          <el-button v-if="isShowOperating" type="primary" @click="updateAllData">提交确认</el-button>
        </el-row>
      </el-col>
    </el-row>

    <el-row>
      <tableContent unqualifiedStatue="03" :tableData="tableData" @checkedChange="checkedChange" @changeThisContent="changeThisContent" v-loading="loading" :tableSelectionBool='tableSelectionBool' :needColNum="4" class="table" :opFirst='opFirst'>
        <!-- 附件 -->
        <template v-slot:appendix>
          <el-table-column align="center" label="附件" min-width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.status==='00'||scope.row.status==='03'">
                <el-button v-if="isShowOperating" size="medium" round @click="jumpAdd(scope.row.id)">添加附件</el-button>
              </div>
              <template v-if="scope.row.attachmentArr.length>0">
                <div v-for="(item,index) in scope.row.attachmentArr" :key="index" style="cursor: pointer;color:#79BBFF; text-decoration:underline;">
                  <span :data-id="item.id" @click="jumpIn(item.name,scope.row.id)">{{item.name}}</span>
                  <i  v-if="scope.row.status==='00'||scope.row.status==='03'&&isShowOperating" class="el-icon-circle-close" style="color:red;cursor: pointer;" @click="delAttchmentBtn(item.id)"/>
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
          <el-table-column align="center" prop="state" min-width="150" label="状态" :show-overflow-tooltip="true">
            <template v-slot:header class="clear">
              <div class="check-title">状态</div>
              <el-select
                class="check-status"
                v-model="value"
                size="mini"
                @change="statusChange"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
            <template slot-scope="scope">
              <template v-if="scope.row.status==='00'">待提交</template>
              <template v-else-if="scope.row.status==='01'">待确认</template>
              <template v-else-if="scope.row.status==='02'">合格</template>
              <template v-else-if="scope.row.status==='03'">
                <el-popover placement="top" width="330" trigger="hover" popper-class="popover" v-if="scope.row.auditorContent">
                  <div class="reason">
                      <div class="title">不合格</div>
                      <div>{{scope.row.auditorContent}}</div>
                      <div>
                          <span>{{scope.row.auditorUser}}</span>
                          <span>{{scope.row.auditorTime}}</span>
                      </div>
                  </div>
                  <div class="danger" slot="reference">
                      不合格
                      <i style="font-size: 14px;" class="el-icon-info"></i>
                  </div>
                </el-popover>
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" prop="id" min-width="130">
            <template slot-scope="scope">
              <template v-if="scope.row.status==='00'">
                <el-button v-if="isShowOperating" type="text" size="mini"  @click="submitData(scope.row.id)"  style="text-decoration:underline;">提交</el-button>
              </template>
              <template v-else-if="scope.row.status==='03'||!scope.row.status">
                <el-button v-if="isShowOperating" type="text" size="mini" @click="delThisInventory(scope.row.id)"  style="text-decoration:underline;">删除</el-button>
                <el-button v-if="isShowOperating" type="text" size="mini" @click="submitData(scope.row.id)"  style="text-decoration:underline;">提交</el-button>
              </template>
            </template>
          </el-table-column>
        </template>
      </tableContent>
    </el-row>
    <inputDialog :options="options1"></inputDialog>
    <el-dialog v-if="opFirst" title="修改答疑人联系方式" :visible.sync="changeUserDialog" width="30%" :before-close="userHandleClose" :close-on-click-modal="false">
      <el-form :model="options2" ref="ruleForm" label-width="100px" class="demo-ruleForm craw-dialog" style="overflow:hidden">
        <el-form-item label="答疑人姓名:" prop="account">
          <el-input placeholder="请输入答疑人姓名" type="text" v-model="options2.name" maxlength="20" style="width:100%;"></el-input>
        </el-form-item>
        <el-form-item label="答疑人手机:" prop="account">
          <el-input placeholder="请输入手机号码" @keyup.native="handleClick" type="text" v-model="options2.phone" maxlength="11" style="width:100%;"></el-input>
        </el-form-item>
        <el-form-item label="答疑人邮箱:" prop="account">
          <el-input placeholder="请输入电子邮箱" type="text" v-model="options2.email" style="width:100%;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="userHandleCommit">确 定</el-button>
          <el-button @click="userHandleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import upload from "../components/upload";
import { MessageBox } from "element-ui";
import tableContent from "../components/tableContent";
import companySelectMenu from "../components/companySelectMenu";
import download from "../components/download";
import inputDialog from "../components/inputDialog";
import {
  downloadTemplate,
  getTableData,
  uploadinventory,
  delinventory,
  singleSubmit,
  getCompany,
  addCompany,
  delCompany,
  singleSubmitAll,
  addAttachmentName,
  getAttachmentList,
  delAttchment,
  updateAnswerData,
  changeTime,
} from "@/api/dueDiligence";
import {validatePhone,checkPhone,validateEmail} from "@/utils/validate"
import{mapState,mapActions} from 'vuex'

export default {
  name: "createRepertoireContent",
  components: {
    upload,
    tableContent,
    companySelectMenu,
    download,
    inputDialog
  },
  data() {
    return {
      selectData: [],//公司选择下拉框数据
      allTableData:[],//表格所有数据
      tableData: [],//表格渲染数据
      options: [
        {
          value: '-1',
          label: "全部"
        },
        {
          value: '00',
          label: "待提交"
        },
        {
          value: '01',
          label: "待确认"
        },
        {
          value: '02',
          label: "合格"
        },
        {
          value: '03',
          label: "不合格"
        }
      ],//表格下拉框数据
      value: '-1',//表格下拉框默认选项
      loading: true,//初始化出现载入数据
      companyAbout: {id:'',companyName:''},//选中的公司
      addCompanyAbout: {},//新增加的公司
      checkedData: [],//表格多选框选择的尽调ID数组
      tableSelectionBool:true,//是否出现表格多选框的按钮
      workUnitId:'',//工作单元id
      downloadPath:'',//下载的路径
      downloadName:'',//下载的名称
      methodType:'',//下载的方式是POST还是GET
      attributeId:'',//尽调属性ID
      options1:{
          dialogFormVisible:false,
          handleClose:this.handleClose,
          reasonInput:'',
          moreShow:false,
          title:'添加附件',
          handleCommit:this.handleCommit,
      },//公共组件弹框的参数(添加附件)
      opFirst:true,//是否允许修改联系人和是否大标题有删除按钮
      changeUserDialog:false,//修改联系人的弹框
      options2:{
        id:'',
        name:'',
        phone:'',
        email:'',
      },//弹框内容
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
    downloadDone() {
      //当有下载任务完成时会调用此方法，并将下载文件名称和下载文件地址设置为空，以便下次下载，当downloadPath改变并且不为空时，会下载文件
      this.downloadName = "";
      this.downloadPath = "";
      this.methodType = "";
      this.downloadParams = {};
    },
    download(url, fileName, type, Ids) {
      //下载文件公用方法，根据传入的type定义不同的下载地址
      let downloadUrl = url
      switch (type) {
        case 'POST':
          downloadUrl += '/lawyer/download'
          break;
        case 'GET':
          downloadUrl += '/lawyer/export?&ids=' + Ids
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
          this.methodType = type
      }
    },
    //公司下拉框添加或删除后获得所有值
    changeSelectData(val, boolean) {
      console.log(val, boolean);
      if (boolean) {
        addCompany(this.workUnitId,val).then(res=>{
          if(res.code===0){
             getCompany(this.workUnitId).then(res => {
              if (res.code === 0) {
                this.addCompanyAbout = res.result.find(item => val === item.companyName);
                // console.log(this.addCompanyAbout );
                this.setCompanyAboutData(this.addCompanyAbout)
                this.tabTableData(this.addCompanyAbout.id,this.workUnitId)
              }
            });
            this.$message.success("操作成功");
          }else{
            this.initAllData()
          }
        })
      } else {
        delCompany(val).then(res=>{
          if(res.code===0){
            getCompany(this.workUnitId).then(res => {
              if (res.code === 0) {
                this.selectData = res.result;
                this.$message.success("操作成功");
              }
            });
            // this.initAllData()
          }else{
            this.initAllData()
          }
        })
      }
    },
    //获得公司选中值
    checkData(val) {
      if (val.length > 0) {
        this.setCompanyAboutData(val[0])
        if(!this.companyAboutData){
          this.setCompanyAboutData(this.companyAbout)
        }
        if(this.companyAboutData.id){
          this.tabTableData(this.companyAboutData.id,this.workUnitId)
        }
      } else {
        this.tableData = [];
        this.allTableData=[]
      }
    },
    //导入尽调清单
    uploadinventorySuccess(resData,fileName,uploadTypes) {
      // console.log(resData, fileName, uploadTypes);
      if(this.companyAboutData.id){
        // console.log(this.companyAboutData.id, this.companyAboutData.companyName, resData,this.workUnitId);
        uploadinventory(this.companyAboutData.id, this.companyAboutData.companyName, resData,this.workUnitId)
          .then(res => {
            console.log(res);
            if (res.code === 0) {
              this.tabTableData(this.companyAboutData.id,this.workUnitId)
              this.$message.success('上传成功');
            }
          })
          .catch(() => {
            this.$message.error('上传失败');
          });
      }
    },
    //导出尽调清单
    handleExport() { 
      if(this.checkedData.length>0){
        //获取大的尽调属性
        let allAttributeDataArr = []
        let allIdDataArr = this.checkedData
        //获取整数位是什么数字
        this.checkedData.forEach(item=>{
          for(let j=0;j<this.tableData.length;j++){
            if(item===this.tableData[j].id){
              allAttributeDataArr.push(this.tableData[j].attribute.split('.')[0])
            }
          }
        })
        console.log(allAttributeDataArr);
        //去重后找到该尽调ID
        allAttributeDataArr = [...new Set(allAttributeDataArr)];
        this.tableData.forEach(item=>{
          if(allAttributeDataArr.indexOf(item.attribute)>-1){
            allIdDataArr.push(item.id)
          }
        }) 
        allIdDataArr = [...new Set(allIdDataArr)];
        console.log(allIdDataArr);
        // downloadTemplate(this.baseUrl, "尽调清单.xlsx", "GET", allIdDataArr);
        this.download(this.baseUrl, "尽调清单.xls", "GET", allIdDataArr)
      }else{
        this.$message.error('你还未选择需要导出的尽调清单');
      }
    },
    //下载尽调模板
    handleDownload() {
      this.download(this.baseUrl, "尽调清单模板.xls", "POST")
      // downloadTemplate(this.baseUrl, "尽调清单模板.xlsx", "POST");
    },
    //添加附件
    jumpAdd(val) {
      this.options1.dialogFormVisible = true
      this.options1.reasonInput = ''
      this.attributeId = val
    }, 
    //添加附件的弹框点击确认后
    handleCommit(){
      if (this.options1.reasonInput == ''){
        this.$message.warning('输入不能为空！')
      }else{
        addAttachmentName(this.options1.reasonInput,this.attributeId).then(res=>{
          if(res.code===0){
            this.setAttachmentName(this.options1.reasonInput)
            this.setThisDueId(this.attributeId)
            this.setColBtn(true)
            this.$message.success("添加成功");
            this.options1.dialogFormVisible = false
            this.options1.reasonInput = ''
            this.$router.push({
              name: "createRepertoireAddAccessory",
              query:{id:this.$route.params.id||this.$route.query.id,from:'dueDiligence',}
            }); 
          }else{
            this.tabTableData(this.companyAboutData.id,this.workUnitId)
          }
        })
      }
    },
    //添加附件的弹框点击取消后
    handleClose(){
      this.options1.dialogFormVisible = false
      this.options1.reasonInput = ''
    },
    //进入附件
    jumpIn(name,id){
      console.log(this.$route.params.id);
      let thisData = this.tableData.find(item => id === item.id);
      console.log(this.isShowOperating)
      if(thisData.status==='01'||thisData.status==='02'){
        this.setOnlyReadHeader(true)
      }else{
        if(this.isShowOperating){
          this.setColBtn(true)
        }else{
          this.setOnlyReadHeader(true)
        }
      }
      this.setAttachmentName(name)
      this.setThisDueId(id)
      this.$router.push({
        name: "createRepertoireAddAccessory",
        query:{id:this.$route.params.id||this.$route.query.id,from:'dueDiligence',}
      });
    },
    //删除附件
    delAttchmentBtn(val){
      this.$confirm("此操作将永久删除该附件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        delAttchment(val).then(res=>{
          if(res.code===0){
            this.tabTableData(this.companyAboutData.id,this.workUnitId)
            this.$message.success("删除成功");
          }else{
            this.tabTableData(this.companyAboutData.id,this.workUnitId)
          }
        })
      }).catch(()=>{
        this.$message.info("已取消删除");
      })
    },
    //表格筛选按钮
    statusChange(val) {
      this.tableData =[]
      if(val !== '-1'){
        let allAttributeDataArr = []
        let allIdDataArr = []
        //将有选择的状态的数据放入数组
        this.allTableData.forEach(item=>{
          if(item.status === val && val !== '-1'||!item.status){
            allIdDataArr.push(item)
          }
        })
        //将有状态的数据的大标题的尽调属性筛选出来放入数组
        for(let i=0;i<this.allTableData.length;i++){
          for(let j=0;j<allIdDataArr.length;j++){
            if(allIdDataArr[j].attribute%1!==0&&this.allTableData[i].id===allIdDataArr[j].id){
              allAttributeDataArr.push(allIdDataArr[j].attribute.split('.')[0])
            }
          }
        }
        //去重后找到该尽调ID
        allAttributeDataArr = [...new Set(allAttributeDataArr)];
        console.log(allAttributeDataArr);
        for(let index = 0;index<allIdDataArr.length;index++){
          if(allIdDataArr[index].attribute%1===0&&allAttributeDataArr.indexOf(allIdDataArr[index].attribute)===-1){
            allIdDataArr.splice(index,1)
            index -= 1
          }
        }
        this.tableData = [...allIdDataArr]
      }else{
        this.tableData = [...this.allTableData] 
      }
    },
    //删除清单一行
    delThisInventory(val) {
      console.log(val);
      this.$confirm("此操作将永久删除该清单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delinventory(val).then(res => {
            if (res.code === 0) {
              this.tabTableData(this.companyAboutData.id,this.workUnitId)
              this.$message.success("删除成功");
            }else{
              this.tabTableData(this.companyAboutData.id,this.workUnitId)
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    //选择尽调的ID的数组（多选框）
    checkedChange(val) {
      this.checkedData = [];
      this.checkedData = [...val];
      console.log(this.checkedData);
    },
    //单个提交
    submitData(val) {
      let thisData = {};
      thisData = this.tableData.find(item => item.id == val);
      if(thisData.status!=='01'){
        singleSubmit(thisData.id, "01").then(res => {
          if(res.code===0){
            this.tabTableData(this.companyAboutData.id,this.workUnitId)
            this.$message.success("操作成功");
          }else{
            this.tabTableData(this.companyAboutData.id,this.workUnitId)
          }
        });
      }else{
        this.$alert('已修改过，请勿重复修改', '提示', {confirmButtonText: '确定',type: "warning"});
      } 
    },
    //批量提交
    updateAllData() {
      if(this.isShowOperating){
        if (this.checkedData.length > 0) {
          //判断是否有提交过的属性，有则不执行
          let setBool= false
          this.tableData.forEach(item=>{
            if(this.checkedData.indexOf(item.id)>-1&&(item.status==='00'||item.status==='03')){
              setBool = true
            }
          })
          if(setBool){
            let checkedArr = this.checkedData
            this.tableData.forEach(item=>{
              for(let j=0;j<checkedArr.length;j++){
                if(checkedArr[j]===item.id&&(item.status==='01'||item.status==='02'||item.attribute%1==0)){
                  checkedArr.splice(j,1)
                  j--
                }
              }
            })
            console.log(checkedArr);
            singleSubmitAll(checkedArr, "01").then(res => {
              if(res.code===0){
                this.tabTableData(this.companyAboutData.id,this.workUnitId)
                this.$message.success( "操作成功");
              }else{
                this.tabTableData(this.companyAboutData.id,this.workUnitId)
              }
            });
          }else{
            this.$alert("仅可提交状态为待提交和不合格的项", "提示", {confirmButtonText: "确定",type: "warning"});
          }
        } else {
          this.$alert("请选择清单后提交", "提示", {confirmButtonText: "确定",type: "warning"});
        }
      }
    },
    //点击答疑人的div时
    changeThisContent(row){
      if(row.status=='00'||row.status=='03'){
        this.changeUserDialog = true
        // console.log(mationArr)
        this.options2.phone = row.answerPhone
        this.options2.email = row.answerMail
        this.options2.name = row.answerName
        this.options2.id = row.id
      }else{
        this.changeUserDialog = false 
      }
    },
    //判断是否是数字的函数
    handleClick(index){
      if(isNaN(this.options2.phone)&&this.options2.phone){
        this.options2.phone = this.options2.phone.replace(/[^0-9]/g,'');
      }
    },
    //点击确定时
    userHandleCommit(){
      if(validatePhone(this.options2.phone)||checkPhone(this.options2.phone)||!this.options2.phone){
        if(validateEmail(this.options2.email)||!this.options2.email){
          updateAnswerData(this.options2).then(res=>{
            if(res.code==0){
              this.changeUserDialog = false
              this.options2.phone = ''
              this.options2.email = ''
              this.options2.name = ''
              this.options2.id = ''
              this.$message.success("操作成功");
            }
            this.tabTableData(this.companyAboutData.id,this.workUnitId)
          })
        }else{
          this.$message.warning('请输入正确的邮箱');
        }
      }else{
        this.$message.warning('请输入正确的手机号码');
      }
    },
    //关闭弹框
    userHandleClose(){
      this.changeUserDialog = false
    },
    //初始化数据
    initAllData() {
      getCompany(this.workUnitId).then(res => {
        console.log(res);
        if (res.code === 0) {
          this.selectData = res.result;
          //传入公司Id给下面这个方法获取表单数据this.companyAboutData.id
          if(!this.companyAboutData){
            this.setCompanyAboutData(this.companyAbout)
          }
          if(!this.companyAboutData.id){
            this.setCompanyAboutData(this.selectData[0])
            if(!this.companyAboutData){
              this.setCompanyAboutData(this.companyAbout)
            }
          }
          // console.log(this.companyAboutData);
          if(this.companyAboutData.id){
            this.tabTableData(this.companyAboutData.id,this.workUnitId)
          }else{
            this.loading=false
          }
        }
      });
    },
    //更新表格数据
    tabTableData(companyAboutId,workUnitId){
      // console.log(companyAboutId);
      return getTableData(companyAboutId,workUnitId).then(res => {
        // console.log(res);
        if (res.code === 0) {
          let dataArr = res.result;
          let bigAttribute =[]
          if(!dataArr){
            dataArr = []
          }
          dataArr.forEach(item=>{
            item.inforMation = item.inforMation.replace(/\,/g, "\n");
            //附件切割
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
            //时间修改
            if(item.auditorTime){
              item.auditorTime = changeTime(item.auditorTime)
            }
            //大标题的相关设置
            if(item.attribute%1 === 0){
              item.status = ''
              item.operationBool = false
              bigAttribute.push(item.attribute)
            }else{
              if(item.status==='00'||item.status==='03'){
                item.operationBool = true
              }else{
                item.operationBool = false
              }
            }
          })
          bigAttribute.forEach((v,index)=>{
            dataArr.forEach(k=>{
              if(k.attribute%1!=0&&k.attribute.indexOf(v)==0){
                if(k.status==='00'||k.status==='03'){
                  dataArr.forEach(z=>{
                    if(z.attribute==v){
                      z.operationBool=true
                    }
                  })
                }
              }
            })
          })
          let addObj= {
            id:'',
            attribute:'0',
            content:"暂无数据"
          }
          for(let i=0;i<dataArr.length;i++){
            if(dataArr[i].attribute%1==0&&i!=dataArr.length-1){
              if(dataArr[i+1].attribute.split('.')[0]!=dataArr[i].attribute){
                // console.log(dataArr[i])
                dataArr[i].noData = true
                dataArr.splice(i+1,0,addObj)
                i++
              }
            }else if(dataArr[i].attribute%1==0&&i==dataArr.length-1){
              dataArr[i].noData = true
              dataArr.splice(i+1,0,addObj)
              i++
            }
          }
          console.log(dataArr);
          this.tableData = JSON.parse(JSON.stringify(dataArr))
          this.allTableData = JSON.parse(JSON.stringify(dataArr))
          // this.value='-1'
          this.loading = false
          this.statusChange(this.value)
        }
      });
    },
    ...mapActions('dueDiligence',['setAttachmentName','setThisDueId','setColBtn','setOnlyReadHeader','setCompanyAboutData'])
  },
  //创建 无数据
  created() {
    // console.log(this.$route.params);
    console.log(this.$route.query);
    if(this.$route.params.id){
      this.workUnitId = this.$route.params.id
    }else if(this.$route.query.id){
      this.workUnitId = this.$route.query.id
    }else{
      this.$router.go(-1)
    }
    this.initAllData()
  },
  //挂载
  mounted() {
    this.baseUrl = process.env.VUE_APP_BASEURL;
    this.uploadAction = process.env.VUE_APP_UPLOAD;
  }
};
</script>
<style lang='scss' scoped>
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

.operate {
  margin-right: 20px;
}
</style>
<style lang='scss'>
.table{
  .check-title{
      float: left;
      // display: inline-block;
    }
    .check-status{
      width: 130px;
      // display: inline-block;
      float: left;
      margin-top: -2px;
      margin-left: -10px;

    }
}
    
</style>