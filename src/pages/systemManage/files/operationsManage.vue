<template>
  <div class="system-wrap">
    <div class="model-search">
      <el-form ref="ruleForm" label-width="70px" class="form" inline>
        <el-form-item label="运维人员" prop="name">
          <el-autocomplete
            class="search-input"
            clearable
            style="width: 350px;"
            v-model="ruleForm.name"
            @clear="handleClearName"
            @keyup.enter.native="handleSearchName"
            :fetch-suggestions="querySearchAsyncName"
            @select="handleSelectName"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="手机号">
          <el-autocomplete
            class="search-input"
            clearable
            style="width: 350px;"
            v-model="ruleForm.phone"
            @clear="handleClearPhone"
            @keyup.enter.native="handleSearchPhone"
            :fetch-suggestions="querySearchAsyncPhone"
            @select="handleSelectPhone"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="创建时间" prop="beginTime">
            <el-date-picker class="date" type="date" v-model="ruleForm.beginTime" value-format="yyyy-MM-dd" :picker-options="startDatePicker" @change="getstartTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="至" prop="endTime" label-width="30px">
            <el-date-picker class="date" type="date"  v-model="ruleForm.endTime" value-format="yyyy-MM-dd" :picker-options="endDatePicker" @change="getendTime"></el-date-picker>
          </el-form-item>
        <div class="fr">
          <el-button type="primary" @click="getData(1)">搜索</el-button>
          <el-button type="danger" @click="resetForm()">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="model-btns">
      <el-button type="primary" @click="addData">新增运维</el-button>
    </div>
    <div class="model-table mt20">
      <el-table :data="tableData" border :v-loading="loading" :max-height="getHeight">
        <el-table-column type="index" label="序号" align="center" width="60" :index="indexMethod"></el-table-column>
        <el-table-column prop="account" label="域账号" align="center" min-width="150"></el-table-column>
        <el-table-column prop="userName" label="运维人员" align="center" min-width="150"></el-table-column>
        <el-table-column prop="userPhone" label="手机号" align="center" min-width="150"></el-table-column>
        <el-table-column prop="email" label="邮箱地址" align="center" min-width="150"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" min-width="150"></el-table-column>
        <el-table-column label="操作" align="center" min-width="120">
          <template slot-scope="scope">
            <el-button type="text" style="padding:8px 10px;text-decoration:underline;" @click="alterData(scope.row.id,scope.row.userName,scope.row.userPhone,scope.row.account,scope.row.email)">修改</el-button>
            <el-button type="text" style="padding:8px 10px;text-decoration:underline;" @click="delData(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
    </div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="30%" :before-close="handleClose" :close-on-click-modal="false">
      <el-form :model="operation" ref="ruleForm" label-width="80px" class="demo-ruleForm craw-dialog" style="overflow:hidden">
        <el-form-item label="域账号" prop="account">
          <el-autocomplete v-if="submitBool" placeholder="请输入或选择域账号" v-model="operation.account" clearable :fetch-suggestions="querySearchLawyersSearch" @select="handleSelectLawyersSearch" style="width:100%;"></el-autocomplete>
          <el-input v-else placeholder="请输入或选择域账号" v-model="operation.account" style="width:100%;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="运维人员" prop="userName">
          <el-input placeholder="请输入运维人员" v-model="operation.userName" maxlength="20" style="width:100%;"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="userPhone">
          <el-input placeholder="请输入手机号" @keyup.native="handleClick" v-model="operation.userPhone" maxlength="11" style="width:100%;"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱地址" v-model="operation.email" style="width:100%;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleCommit">确 定</el-button>
          <el-button @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectListOperationsData,
  addOperationsStaff,
  updateSysOperationUser,
  delSysOperationUser,
  allSysOperationUser,
  allSysOperationPhone,
  allAvailableLawyers,//获取所有律师
} from "@/api/systemManageApi";

import {
  changeTime,//时间格式修改
} from "@/api/dueDiligence"

import {validatePhone,checkPhone,validateEmail} from "@/utils/validate"
export default {
  name: "operationsManage",
  components: {},
  data() {
    return {
      ruleForm:{
        name:'',
        phone:'',
        beginTime:'',
        endTime:''
      },//表单的内容
      startDatePicker: {
        disabledDate: (time) => {
          if (this.endTime != "") {
            return time.getTime() >  new Date(this.ruleForm.endTime).getTime();
          }
        },
      },
      endDatePicker: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.ruleForm.beginTime).getTime()- 1*24*60*60*1000;//减去一天的时间代表可以选择同一天;
        },
      },
      tableData:[],//表格数据
      allTableData:[],//总表格数据,未用
      searchTableData:[],//筛选表格数据
      loading:true,//表单的加载
      getHeight:window.innerHeight - 290,//高度设置
      pageTotal: 0, //分页个数
      total: 0, //当前列表总条数
      page: 1, //当前分页
      pageSize: 20, //一页显示的数据条数
      operation:{
        account:'',
        email:'',
        userName:'',
        userPhone:'',
        id:''
      },//弹框内输入框的各项值
      oldPhone:'',//修改时原来的电话
      dialogFormVisible:false,//弹框是否弹出
      submitBool:true,//提交的是新增的还是修改的
      sysUserId:'',//运维人员id
      title:'',//弹框名称
      allName:[],//所有名字
      allPhone:[],//所有电话
      allLawyersArr:[],//所有可用律师数据
      allLawyersSearchArr:[],//所有可用律师查询数据
    };
  },
  computed: {},
  watch: {},
  methods: {
    //自动增加序号
    indexMethod(index) {
      // console.log(index);
      let curpage = this.page //单前页码，具体看组件取值
      let limitpage = this.pageSize //每页条数，具体是组件取值
      return index + 1 + (curpage - 1) * limitpage;
    },
    //清除姓名执行函数
    handleClearName(){
      this.ruleForm.name = ''
    },
    //清除电话执行函数
    handleClearPhone(){
      this.ruleForm.phone = ''
    },
    //输入姓名建议函数
    querySearchAsyncName(queryString, cb){
      let restaurants = this.allName;
      let results = queryString ? restaurants.filter(val=>val.value.indexOf(queryString) == 0) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    //姓名栏按回车时执行函数
    handleSearchName(){},
    //姓名点击时获取的数据函数
    handleSelectName(){},
    //电话栏回车时执行函数
    handleSearchPhone(){},
    //电话点击时获取的数据函数
    handleSelectPhone(){},
    //开始时间选择时
    getstartTime(){},
    //结束时间选择时
    getendTime(){},
    //输入电话建议函数
    querySearchAsyncPhone(queryString, cb){
      let restaurants = this.allPhone;
      let results = queryString ? restaurants.filter(val=>val.value.indexOf(queryString) == 0) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    //点击查询时
    getData(){
      this.initData(this.page,this.pageSize,this.ruleForm.name,this.ruleForm.phone,this.ruleForm.beginTime,this.ruleForm.endTime);
    },
    //点击重置时
    resetForm(){
      this.ruleForm.name = ''
      this.ruleForm.phone = ''
      this.ruleForm.beginTime = ''
      this.ruleForm.endTime = ''
      this.initData(this.page,this.pageSize);
    },
    //分页功能
    pageChange(index) {
      this.page = index;
      this.initData(this.page,this.pageSize,this.ruleForm.name,this.ruleForm.phone,this.ruleForm.beginTime,this.ruleForm.endTime);
    },
    //分页数据显示条数切换
    handleSizeChange(val) {
      this.pageSize = val;
      this.initData(this.page,this.pageSize,this.ruleForm.name,this.ruleForm.phone,this.ruleForm.beginTime,this.ruleForm.endTime);
    },
    //新增运维人员
    addData(){
      this.submitBool = true
      this.dialogFormVisible = true
      this.title = '新增运维人员'
    },
    //修改运维人员
    alterData(id,name,phone,account,email){
      this.submitBool = false
      this.dialogFormVisible = true
      this.sysUserId = id
      this.operation.id = id
      this.operation.userName = name
      this.operation.userPhone = phone
      this.oldPhone = phone
      this.operation.account = account
      this.operation.email = email
      this.title = '修改运维人员'
    },
    //判断是否是数字的函数
    handleClick(index){
      if(isNaN(this.operation.userPhone)&&this.operation.userPhone){
        this.operation.userPhone = this.operation.userPhone.replace(/[^0-9]/g, '');
      }
    },
    //弹框点击确定时
    handleCommit(){
      if(this.operation.userName&&this.operation.userPhone&&this.operation.account&&this.operation.email){
        if(validatePhone(this.operation.userPhone)){
          if(validateEmail(this.operation.email)){
            if(this.submitBool){
              //新增
              let thisID = true
              this.allLawyersSearchArr.forEach(item => {
                if(item.value==this.operation.account){
                  thisID = false
                  this.operation.id = item.id
                }
              });
              if(thisID){
                this.operation.id=''
              }
              // console.log(this.allPhone.filter(val=>val.value.indexOf(this.operation.userPhone)==0).length==0);
              if(this.allPhone.filter(val=>val.value.indexOf(this.operation.userPhone)==0).length==0){
                let newOperation={
                  account:this.operation.account,
                  email:this.operation.email,
                  userName:this.operation.userName,
                  userPhone:this.operation.userPhone
                }
                addOperationsStaff(newOperation).then(res=>{
                  if(res.code===0){
                    this.dialogFormVisible = false
                    this.operation.userName = ''
                    this.operation.userPhone = ''
                    this.operation.account = ''
                    this.operation.email = ''
                    this.$message.success('提交成功!');
                  }
                  this.initData(this.page,this.pageSize);
                })
              }else{
                this.$message.warning('输入电话号码有重复!');
              }
            }else{
              //修改
              // console.log(this.allPhone.filter(val=>val.value.indexOf(this.operation.userPhone)==0&&true));
              if(this.allPhone.filter(val=>val.value.indexOf(this.operation.userPhone)==0&&this.oldPhone!=this.operation.userPhone).length==0){
                updateSysOperationUser(this.sysUserId,this.operation).then(res=>{
                  if(res.code===0){
                    this.dialogFormVisible = false
                    this.operation.userName = ''
                    this.operation.userPhone = ''
                    this.oldPhone = ''
                    this.operation.account = ''
                    this.operation.email = ''
                    this.sysUserId = ''
                    this.$message.success('修改成功!');
                  }
                  this.initData(this.page,this.pageSize,this.ruleForm.name,this.ruleForm.phone,this.ruleForm.beginTime,this.ruleForm.endTime);
                })
              }else{
                this.$message.warning('输入电话号码有重复!');
              }
            }
          }else{
            this.$message.warning('请输入正确的邮箱');
          }
        }else{
          this.$message.warning('请输入正确的手机号码');
        }
      }else{
        let txtContentArr = []
        if(!this.operation.userName) txtContentArr.push('运维人员')
        if(!this.operation.userPhone) txtContentArr.push('电话号码')       
        if(!this.operation.account) txtContentArr.push('域账号')  
        if(!this.operation.email) txtContentArr.push('邮件')
        let txtContent = txtContentArr.join('、')
        this.$message.warning('请输入'+txtContent);
      }
    },
    //点击弹框关闭时
    handleClose(){
      this.dialogFormVisible = false
      this.operation.userName = ''
      this.operation.userPhone = ''
      this.operation.account = ''
      this.operation.email = ''
      this.sysUserId = ''
      this.oldPhone=''
      this.dialogFormVisible = false
    },
    //删除运维人员
    delData(id){
      if(this.tableData.length>1){
        this.$confirm("此操作将删除改运维人员, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(()=>{
          delSysOperationUser(id).then(res=>{
            if(res.code===0){
              this.$message.success('删除成功!');
            }
            this.initData(this.page,this.pageSize,this.ruleForm.name,this.ruleForm.phone,this.ruleForm.beginTime,this.ruleForm.endTime);
          })
        }).catch(()=>{
          this.$message.info("已取消删除");
        })
      }else{
        this.$alert("不可删除最后一位运维人员", "提示", {confirmButtonText: "确定",type: "warning"});
      }
    },
    //筛选运维域账号
    querySearchLawyersSearch(queryString, cb){
      let restaurants = this.allLawyersSearchArr;
      let results = queryString ? restaurants.filter(val=>val.value.indexOf(queryString) == 0) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    //选择运维域账号
    handleSelectLawyersSearch(val){
      // console.log(val)
      this.operation.account = val.value
      this.operation.email = val.email
      this.operation.userName = val.userName
      this.operation.userPhone = val.userPhone
      this.operation.id = val.id
    },
    //查询所有运维人员
    searchAllSysOperationUser(){
      allSysOperationUser().then(res=>{
        // console.log(res);
        if(res.code===0){
          let arr = res.result
          this.allName=[]
          arr = [...new Set(arr)]
          arr.forEach(item=>{
            this.allName.push({value:item})
          })
        }
      })
    },
    //查询所有运维人员的电话
    searchAllSysOperationPhone(){
      allSysOperationPhone().then(res=>{
        console.log(res);
        if(res.code===0){
          let arr = res.result
          this.allPhone = []
          arr.forEach(item=>{
            this.allPhone.push({value:item})
          })
        }
      })
    },
    //查询所有可用律师
    searchAllAvailableLawyers(){
      allAvailableLawyers().then(res=>{
        // console.log(res)
        if(res.code===0){
          this.allLawyersArr = res.result
          this.allLawyersArr.forEach(item=>{
            this.allLawyersSearchArr.push({
              value:item.account,
              id:item.id,
              email:item.email,
              userPhone:item.userPhone,
              userName:item.userName
            })
          })
          // console.log(this.allLawyersSearchArr)
        }
      })
    },
    //初始化数据
    initData(pagenum,pagesize,userName,userPhone,beginTime,endTime){
      selectListOperationsData(pagenum,pagesize,userName,userPhone,beginTime,endTime).then(res=>{
        console.log(res);
        if(res.code===0){
          this.pages = Number(res.result.pages)
          this.pageSize =res.result.size
          this.total = Number(res.result.total)
          this.pageTotal = res.result.current
          this.tableData = res.result.records
          this.loading = false
          this.tableData.forEach(item=>{
            if(item.createTime){
              item.createTime = changeTime(item.createTime)
            }
          })
          this.searchAllSysOperationUser()
          this.searchAllSysOperationPhone()
          this.searchAllAvailableLawyers()
        }
      })
    }
  },
  created() {
    this.initData(this.page,this.pageSize);
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/assets/css/varibles.scss";
@import "common";
</style>