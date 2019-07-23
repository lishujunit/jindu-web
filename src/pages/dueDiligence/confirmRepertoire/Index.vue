<template>
  <div class="confirmRepertoire">
    <el-row>
      <companySelectMenu :operationAddBtn="false" :operationDelBtn="false" :selectData="selectData" @checkData="checkData" @changeSelectData="changeSelectData"></companySelectMenu>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start">
          <el-button v-if="isShowOperating" type="danger" @click="batchSubmintStatus(false)">不合格</el-button>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="end">
          <el-button v-if="isShowOperating" type="primary" @click="batchSubmintStatus(true)">合格并提交客户</el-button>
        </el-row>
      </el-col>
    </el-row>

    <el-row>
      <tableContent unqualifiedStatue="03" :tableData="tableData" v-loading="loading" :tableSelectionBool="tableSelectionBool" @checkedChange="checkedChange" @changeThisContent="changeThisContent" :needColNum="4" class="table" :opFirst='opFirst'>
         <!-- 附件 -->
        <template v-slot:appendix>
            <el-table-column align="center" label="附件" min-width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.status==='01'&&isShowOperating">
                <el-button size="medium" round @click="jumpAdd(scope.row.id)">添加附件</el-button>
              </div>
              <template v-if="scope.row.attachmentArr.length>0">
                <div v-for="(item,index) in scope.row.attachmentArr" :key="index">
                  <span :data-id="item.id" @click="jumpIn(item.name,scope.row.id)" style="cursor: pointer;color:#79BBFF;text-decoration:underline">{{item.name}}</span>
                  <i v-if="scope.row.status==='01'&&isShowOperating" class="el-icon-circle-close" style="color:red;cursor: pointer;" @click="delAttchmentBtn(item.id)"/>
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
          <el-table-column align="center" prop="state" min-width="160" label="状态" :show-overflow-tooltip="true">
            <template slot="header" class="clear">
              <div class="check-title">状态</div>
              <el-select v-model="value" size="mini" @change="statusChange" placeholder="请选择" class="check-status">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
            <template slot-scope="scope">
              <template v-if="scope.row.status==='01'">待确认</template>
              <template v-else-if="scope.row.status==='02'">已提交</template>
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
          <el-table-column align="center" label="操作" prop="id" min-width="150">
            <template slot-scope="scope">
              <template v-if="scope.row.status==='01'&&isShowOperating">
                <el-button type="text" size="mini" @click="singleSubmitStatus(scope.row.id,true)"  style="text-decoration:underline;">合格并提交</el-button>
                <el-button type="text" size="mini" style="color:red;text-decoration:underline;" @click="singleSubmitStatus(scope.row.id,false)">不合格</el-button>
              </template>
              <template v-if="scope.row.status==='03'||!scope.row.status">
                <el-button v-if="isShowOperating" type="text" size="mini" @click="delThisInventory(scope.row.id)" style="text-decoration:underline;">删除</el-button>
              </template>
            </template>
          </el-table-column>
        </template>
      </tableContent>
    </el-row>
    <common-dialog :options="options1"></common-dialog>
    <inputDialog :options="options2"></inputDialog>
    <el-dialog v-if="opFirst" title="修改答疑人联系方式" :visible.sync="changeUserDialog" width="30%" :before-close="userHandleClose" :close-on-click-modal="false">
      <el-form :model="options3" ref="ruleForm" label-width="100px" class="demo-ruleForm craw-dialog" style="overflow:hidden">
        <el-form-item label="答疑人姓名:" prop="account">
          <el-input placeholder="请输入答疑人姓名" type="text" v-model="options3.name" maxlength="20" style="width:100%;"></el-input>
        </el-form-item>
        <el-form-item label="答疑人手机:" prop="account">
          <el-input placeholder="请输入手机号码" @keyup.native="handleClick" type="text" v-model="options3.phone" maxlength="11" style="width:100%;"></el-input>
        </el-form-item>
        <el-form-item label="答疑人邮箱:" prop="account">
          <el-input placeholder="请输入电子邮箱" type="text" v-model="options3.email" style="width:100%;"></el-input>
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
import companySelectMenu from "../components/companySelectMenu";
import tableContent from "../components/tableContent";
import commonDialog from '@/components/commonDialog/commonDialog'
import inputDialog from "../components/inputDialog";
import {
  getCompany,
  addCompany,
  delCompany,
  getTableDataComPage,
  commitStatus,
  batchcommitStatus,
  changeTime,
  addAttachmentName,
  deleteAttachmentByIdTwo,
  deleteListByIdTwo,
  insertAttachmentNameTwo,
  updateAnswerDataTwo
} from "@/api/dueDiligence";
import {validatePhone,checkPhone,validateEmail} from "@/utils/validate"
import{mapState,mapActions} from 'vuex'
export default {
  name: "confirmRepertoire",
  components: {
    companySelectMenu,
    tableContent,
    commonDialog,
    inputDialog
  },
  data() {
    return {
      selectData: [],//公司下拉框的数据
      tableData: [],//表格数据
      allTableData:[],//备份的所有表格数据
      options: [
        {
          value: '-1',
          label: "全部"
        },
        {
          value: '01',
          label: "待确认"
        },
        {
          value: '02',
          label: "已提交"
        },
        {
          value: '03',
          label: "不合格"
        }
      ],//表格内下拉框的选项
      checkedData:[],//多选框选中值
      value: '-1',//默认表格内下拉框选中值
      loading:true,//是是否能操作
      tableSelectionBool:true,//多选框是否存在
      companyAbout:{id:'',companyName:''},//选中公司的值
      attributeId:'',//尽调属性ID用于单个提交
      attributeIdArr:[],//尽调属性ID数组用于批量提交
      SingleOrBatch:true,//单个还是批量提交不合格true为单个，false为批量
      options1:{
          dialogFormVisible:false,
          handleClose:this.handleClose,
          reasonInput:'',
          moreShow:false,
          title:'不合格原因',
          handleMoreCommit:this.handleMoreCommit,
          handleCommit:this.handleCommit,
      },//公共组件弹框的参数(不合格)
      options2:{
          dialogFormVisible:false,
          handleClose:this.handleClose2,
          reasonInput:'',
          moreShow:false,
          title:'添加附件',
          handleCommit:this.handleCommit2,
      },//公共组件弹框的参数(添加附件)
      opFirst:true,//是否允许修改联系人和是否大标题有删除按钮
      changeUserDialog:false,//修改联系人的弹框
      options3:{
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
      console.log(this.matterStatus)
      if(this.matterStatus == 2){ //事项已完成
        status = false;
      }
      return status;
    },
    ...mapState('dueDiligence', ['companyAboutData'])
  },
  methods: {
    //公司下拉框添加或删除后获得所有值
    changeSelectData(val, boolean) {
      console.log(val, boolean);
      if (boolean) {
        addCompany(this.workUnitId,val).then(res=>{
          if(res.code===0){
           this.initAllData()
           this.$message.success("操作成功");
          }else{
            this.initAllData()
          }
        })
      } else {
        delCompany(val).then(res=>{
          if(res.code===0){
            this.initAllData()
            this.$message.success("操作成功");
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
    //添加附件
    jumpAdd(val) {
      this.options2.dialogFormVisible = true
      this.options2.reasonInput = ''
      this.attributeId = val
    }, 
    //添加附件的弹框点击确认后
    handleCommit2(){
      if (this.options2.reasonInput == ''){
        this.$message.warning('输入不能为空！')
      }else{
        insertAttachmentNameTwo(this.options2.reasonInput,this.attributeId).then(res=>{
          if(res.code===0){
            this.setAttachmentName(this.options2.reasonInput)
            this.setThisDueId(this.attributeId)
            this.setColBtn(true)
            this.$message.success("添加成功");
            this.setTwoJumpIn(true)
            this.options2.dialogFormVisible = false
            this.options2.reasonInput = ''
            this.$router.push({
              name: "confirmRepertoireAddAccessory",
              query:{id:this.$route.params.id||this.$route.query.id,from:'dueDiligence'}
            });
          }else{
            this.tabTableData(this.companyAboutData.id,this.workUnitId)
          }
        })
      }
    },
    //添加附件的弹框点击取消后
    handleClose2(){
      this.options2.dialogFormVisible = false
      this.options2.reasonInput = ''
    },
    //删除附件
    delAttchmentBtn(val){
      this.$confirm("此操作将永久删除该附件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        deleteAttachmentByIdTwo(val).then(res=>{
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
    //批量提交合格或不合格（新需求需要改***）
    batchSubmintStatus(boolean) {
      if(this.isShowOperating){
        if(this.checkedData.length>0){
          let setBool= false
          this.tableData.forEach(item=>{
            if(this.checkedData.indexOf(item.id)>-1&&(item.status==='01')){
              setBool = true
            }
          })
          if(setBool){
            let checkedArr = this.checkedData
            this.tableData.forEach(item=>{
              for(let j=0;j<checkedArr.length;j++){
                if(checkedArr[j]===item.id&&(item.status==='02'||item.status==='03'||item.attribute%1 === 0)){
                  checkedArr.splice(j,1)
                  j--
                }
              }
            })
            if(boolean){
              this.$confirm('是否确认合格并提交?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                batchcommitStatus(checkedArr,'','02').then(res=>{
                  if(res.code===0){
                    this.tabTableData(this.companyAboutData.id,this.workUnitId)
                    this.$message.success('提交成功!');
                  }else{
                    this.tabTableData(this.companyAboutData.id,this.workUnitId)
                  }
                })
              }).catch(() => {});
            }else{
              this.attributeIdArr = [...checkedArr]
              this.SingleOrBatch = false
              this.options1.dialogFormVisible = true
              this.options1.reasonInput = ''
            }
          }else{
            this.$alert("仅可提交状态为待确认的项", "提示", {confirmButtonText: "确定",type: "warning"});
          }
        }else{
          this.$alert('请选择需要提交的尽调清单', '提示', {confirmButtonText: "确定",type: "warning"});
        }
      }
    },
    //列表筛选
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
    //单个的合格并提交或不合格
    singleSubmitStatus(val,boolean) {
      this.attributeId = val
      if(boolean){
        this.$confirm('是否确认合格并提交?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          commitStatus(this.attributeId,'','02').then(res=>{
            if(res.code===0){
              this.tabTableData(this.companyAboutData.id,this.workUnitId)
              this.$message.success('提交成功!');
            }else{
              this.tabTableData(this.companyAboutData.id,this.workUnitId)
            }
          })
        }).catch(() => {});
      }else{
        this.SingleOrBatch = true
        this.options1.dialogFormVisible = true
        this.options1.reasonInput = ''
      }
    },
    //不合格的弹框点击确认后
    handleMoreCommit(){},
    handleCommit(){
      if (this.options1.reasonInput == ''){
        this.$message.warning('输入不能为空！')
      }else{
        // console.log(this.options1.reasonInput);
        if(this.SingleOrBatch){
          commitStatus(this.attributeId,this.options1.reasonInput,'03').then(res=>{
            if(res.code===0){
              this.options1.dialogFormVisible = false
              this.options1.reasonInput = ''
              this.tabTableData(this.companyAboutData.id,this.workUnitId)
              this.$message.success('提交成功!');
            }else{
              this.tabTableData(this.companyAboutData.id,this.workUnitId)
            }
          })
        }else{
          batchcommitStatus(this.attributeIdArr,this.options1.reasonInput,'03').then(res=>{
            if(res.code===0){
              this.options1.dialogFormVisible = false
              this.options1.reasonInput = ''
              this.tabTableData(this.companyAboutData.id,this.workUnitId)
              this.$message.success('提交成功!');
            }else{
              this.tabTableData(this.companyAboutData.id,this.workUnitId)
            }
          })
        }
      }
    },
    //不合格的弹框点击取消后
    handleClose(){
      this.options1.dialogFormVisible = false
      this.options1.reasonInput = ''
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
          deleteListByIdTwo(val).then(res => {
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
      // console.log(this.checkedData);
    },
    //进入附件
    jumpIn(name,id){
      let thisData = this.tableData.find(item => id === item.id);
      if(thisData.status==='02'||thisData.status==='03'){
        this.setOnlyReadHeader(true)
      }else{
        if(this.isShowOperating){
          this.setColBtn(true)
        }else{
          this.setOnlyReadHeader(true)
        }
      }
      this.setAttachmentName(name)
      this.setTwoJumpIn(true)
      this.setThisDueId(id)
      this.$router.push({
        name: "confirmRepertoireAddAccessory",
        query:{id:this.$route.params.id||this.$route.query.id,from:'dueDiligence',}
      });
    },
    //点击答疑人的div时
    changeThisContent(row){
      if(row.status=='01'||row.status=='03'){
        this.changeUserDialog = true
        // console.log(mationArr)
        this.options3.phone = row.answerPhone
        this.options3.email = row.answerMail
        this.options3.name = row.answerName
        this.options3.id = row.id
      }else{
        this.changeUserDialog = false 
      }
    },
    //判断是否是数字的函数
    handleClick(index){
      if(isNaN(this.options3.phone)&&this.options3.phone){
        this.options3.phone = this.options3.phone.replace(/[^0-9]/g,'');
      }
    },
    //点击确定时
    userHandleCommit(){
      if(validatePhone(this.options3.phone)||checkPhone(this.options3.phone)||!this.options3.phone){
        if(validateEmail(this.options3.email)||!this.options3.email){
          updateAnswerDataTwo(this.options3).then(res=>{
            if(res.code==0){
              this.changeUserDialog = false
              this.options3.phone = ''
              this.options3.email = ''
              this.options3.name = ''
              this.options3.id = ''
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
        // console.log(res);
        if (res.code === 0) {         
          this.selectData = res.result;
          //传入第一个数据的公司Id给下面这个方法获取表单数据
          if(!this.companyAboutData){
            this.setCompanyAboutData(this.companyAbout)
          }
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
      });
    },
    //更新表格数据
    tabTableData(companyAboutId,workUnitId){
      getTableDataComPage(companyAboutId,workUnitId).then(res => {
        console.log(res);
        if (res.code === 0) {
          let dataArr = res.result;
          let bigAttribute =[]
          if(!dataArr){
            dataArr = []
          }
          dataArr.forEach(item=>{
            item.inforMation = item.inforMation.replace(/\,/g, "\n");
            if (item.attachment) {
              let contentArr = [];
              item.attachment = item.attachment.split(",");
              for(let i = 0; i < item.attachment.length; i++) {
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
            if(item.auditorTime){
              item.auditorTime = changeTime(item.auditorTime)
            }
            //大标题的相关设置
            if(item.attribute%1 === 0){
              item.status = ''
              item.operationBool = false
              bigAttribute.push(item.attribute)
            }else{
              if(item.status==='01'||item.status==='03'){
                item.operationBool = true
              }else{
                item.operationBool = false
              }
            }
          })
          bigAttribute.forEach((v,index)=>{
            dataArr.forEach(k=>{
              if(k.attribute%1!=0&&k.attribute.indexOf(v)==0){
                if(k.status==='01'||k.status==='03'){
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
          this.tableData=[]
          this.allTableData=[]
          console.log(dataArr);
          this.tableData = JSON.parse(JSON.stringify(dataArr))
          this.allTableData = JSON.parse(JSON.stringify(dataArr))
          // this.value='-1'
          this.loading = false
          this.statusChange(this.value)
        }
      });
    },
    ...mapActions('dueDiligence',['setAttachmentName','setThisDueId','setOnlyReadHeader','setColBtn','setCompanyAboutData','setTwoJumpIn'])
  },
  created() {
    if(this.$route.params.id){
      this.workUnitId = this.$route.params.id
    }else if(this.$route.query.id){
      this.workUnitId = this.$route.query.id
    }else{
      this.$router.go(-1)
    }
    this.initAllData()
  },
};
</script>
<style lang='scss' scoped>
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
    width: 100%;
    text-align:left;
    padding:10px 15px;
    box-sizing:border-box;
    word-wrap:break-word;
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