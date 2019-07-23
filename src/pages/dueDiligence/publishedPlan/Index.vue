<template>
  <div class="publishedPlan">
    <el-row>
      <companySelectMenu :operationAddBtn="false" :operationDelBtn="false" :selectData="selectData" @checkData="checkData" @changeSelectData="changeSelectData"></companySelectMenu>
    </el-row>
    <el-row>
      <el-col :span="12" :offset="12">
        <el-row type="flex" justify="end">
          <el-button v-if="isShowOperating" type="primary" @click="publishPlan">发布清单</el-button>
        </el-row>
      </el-col>
    </el-row>

    <el-row>
       <tableContent :tableData="tableData" v-loading="loading" @checkedChange='checkedChange' :needColNum="9">
         <!-- 附件 -->
         <template v-slot:appendix>
            <el-table-column align="center" label="附件" min-width="100">
            <template slot-scope="scope">
              <template v-if="scope.row.attachmentArr.length>0">
                <div v-for="(item,index) in scope.row.attachmentArr" :key="index">
                  <span :data-id="item.id" @click="jumpIn(item.name,scope.row.id)" style="cursor: pointer;color:#79BBFF;text-decoration:underline;">{{item.name}}</span>
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
          <el-table-column align="center" prop="dept" label="应答部门" min-width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.releaseStatus==='Y'" calss="box">
                <span>{{scope.row.dept}}</span>
              </div>
              <div @click="changeDept(scope.row,scope.$index)" v-else calss="box">
                <span v-if="showEditDept[scope.$index]">{{scope.row.dept}}</span>
                <el-input v-else ref="dept" maxlength="20" v-model="scope.row.dept" placeholder="请输入部门" @blur="clientUser(scope.row.clientuserInfoId,scope.$index)"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="respondMation" label="应答联系人" min-width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.releaseStatus==='Y'" calss="box">
                <div><span>{{scope.row.departmentHead}}</span></div>
                <div><span>{{scope.row.contactPhone}}</span></div>
              </div>
              <div v-else>
                <div @click="changeDepartmentHeadStatus(scope.row,scope.$index)" calss="box">
                <span v-if="showEditDepartmentHead[scope.$index]">{{scope.row.departmentHead}}</span>
                <el-input v-else ref="departmentHead" maxlength="20" v-model="scope.row.departmentHead" placeholder="请输入应答联系人" @blur="clientUser(scope.row.clientuserInfoId,scope.$index)"></el-input>
              </div>
              <div @click="changeContactPhone(scope.row,scope.$index)">
                <span v-if="showEditContactPhone[scope.$index]">{{scope.row.contactPhone}}</span>
                <el-input v-else ref="contactPhone" maxlength="13" v-model="scope.row.contactPhone" placeholder="请输入电话号码" @keyup.native="handleClick(scope.$index)" @blur="clientUser(scope.row.clientuserInfoId,scope.$index,scope)"></el-input>
              </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="releaseStatus" label="状态" min-width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.releaseStatus==='Y'">已发布</span>
              <span v-else>待发布</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="respondMation" label="操作" min-width="150">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="publishSinglePlan(scope.row.clientuserInfoId)" v-if="scope.row.releaseStatus!=='Y'&&isShowOperating">发布</el-button>
            </template>
          </el-table-column>
        </template>
       </tableContent>
    </el-row>
  </div>
</template>

<script>
import tableContent from "../components/tableContent";
import companySelectMenu from "../components/companySelectMenu";
import {
  getTablePublishedPlan,
  getCompany,
  publishedAllPlan,
  updateClientuserInfoById
} from "@/api/dueDiligence";
import{mapState,mapActions} from 'vuex'
import {validatePhone,checkPhone} from "@/utils/validate"
import { log } from 'util';
export default {
  name: "publishedPlan",
  components: {
    tableContent,
    companySelectMenu
  },
  data() {
    return {
      selectData:[],//选择公司的数据
      tableData:[],//表格数据
      allTableData:[],//表格原始数据
      loading:true,//载入样式
      companyAbout:{id:'',companyName:''},//选中公司的相关数据
      checkedData:[],//选择尽调ID的数组
      showEditDept:[],//部门出现的输入框
      showEditDepartmentHead:[],//应答联系人出现的输入框
      showEditContactPhone:[],//应答联系人电话出现的输入框
      workUnitId:"",//工作单元id
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
    //公司下拉框添加或删除后获得所有值
    changeSelectData(val, boolean) {
      console.log(val, boolean);
      if (boolean) {
        addCompany(this.workUnitId,val).then(res=>{
          if(res.code===0){
             getCompany(this.workUnitId).then(res => {
              if (res.code === 0) {
                this.addCompanyAbout = res.result.find(item => val === item.companyName);
                this.setCompanyAboutData(this.addCompanyAbout)
                this.tabTableData(this.addCompanyAbout.id,this.workUnitId)
              }else{
                this.initAllData()
              }
            });
            this.$message.success("操作成功");
          }
        })
      } else {
        delCompany(val).then(res=>{
          if(res.code===0){
            getCompany(this.workUnitId).then(res => {
              if (res.code === 0) {
                this.selectData = res.result;
                this.$message.success("操作成功");
              }else{
                this.initAllData()
              }
            });
          }
        })
      }
    }, 
    //获得公司选中值
    checkData(val) {
      if (val.length > 0) {
        this.setCompanyAboutData(val[0])
        this.tabTableData(this.companyAboutData.id,this.workUnitId)
      } else {
        this.tableData = [];
        this.allTableData=[]
      }
    },
    //进入附件
    jumpIn(name,id){
      this.setAttachmentName(name)
      this.setThisDueId(id)
      this.setOnlyReadHeader(true)
      this.$router.push({
        name: "publishedPlanAddAccessory",
        query:{id:this.$route.params.id,from:'dueDiligence',}
      });
    },
    //选择尽调的ID的数组（多选框）
    checkedChange(val) {
      this.checkedData = [];
      this.checkedData = [...val];
      console.log(this.checkedData);
    },
    //显示获取部门还是输入框的方法
    changeDept(row,index){
      if(this.isShowOperating){
        this.$set(this.showEditDept,index,false)
        this.$nextTick(function () {
          this.$refs.dept.$el.querySelector('input').focus();
        });
      }
      
    },
    //显示获取应答联系人还是输入框的方法
    changeDepartmentHeadStatus(row,index){
      if(this.isShowOperating){
        this.$set(this.showEditDepartmentHead,index,false)
        this.$nextTick(function () {
          this.$refs.departmentHead.$el.querySelector('input').focus();
        });
      }
    },
    //显示获取应答联系人电话还是输入框的方法
    changeContactPhone(row,index){
      if(this.isShowOperating){
        this.$set(this.showEditContactPhone,index,false)
        this.$nextTick(function () {
          this.$refs.contactPhone.$el.querySelector('input').focus();
        });
      }
    },
    //只能输入数字的方法
    handleClick(index){
      if(isNaN(this.tableData[index].contactPhone)&&this.tableData[index].contactPhone){
        this.tableData[index].contactPhone = this.tableData[index].contactPhone.replace(/[^0-9|-]/g, '');
      }
    },
    //提交
    clientUser(dueId,thisIndex,val){
      this.$set(this.showEditContactPhone,thisIndex,true)
      this.$set(this.showEditDepartmentHead,thisIndex,true)
      this.$set(this.showEditDept,thisIndex,true)
      let dept=this.tableData[thisIndex].dept
      let respondName=this.tableData[thisIndex].departmentHead
      let respondPhone=this.tableData[thisIndex].contactPhone
      // console.log(dept,respondName,respondPhone,thisIndex)
      if(validatePhone(respondPhone)||checkPhone(respondPhone)){
        // console.log(thisId,dept,respondName,respondPhone);
        if(dueId&&dept&&respondName&&respondPhone){
          updateClientuserInfoById(dueId,dept,respondName,respondPhone).then(res=>{
            if(res.code===0){
              this.$message.success('提交成功');
            }else{
              this.tabTableData(this.companyAboutData.id,this.workUnitId)
            }
          })
        }else{
          this.tableData = []
          this.tableData = JSON.parse(JSON.stringify(this.allTableData))
          this.$message.info('已取消提交');
        }
      }else{
        this.tableData = []
        this.tableData = JSON.parse(JSON.stringify(this.allTableData))
        this.$message.error('电话号码输入有误');
      }
    },
    //批量发布清单
    publishPlan(){
      if(this.tableData.length>0&&this.checkedData.length>0){
        let setBool= false
        this.tableData.forEach(item=>{
          if(this.checkedData.indexOf(item.id)>-1&&(item.releaseStatus==='N')){
            setBool = true
          }
        })
        if(setBool){
          let checkedArr = this.checkedData
          let checkedClientuserInfoIdArr = []
          this.tableData.forEach(item=>{
            for(let j=0;j<checkedArr.length;j++){
              if(checkedArr[j]===item.id&&(item.releaseStatus==='Y')){
                checkedArr.splice(j,1)
                j--
              }
            }
          })
          this.tableData.forEach(item=>{
            if(checkedArr.indexOf(item.id)>-1&&item.clientuserInfoId){
              checkedClientuserInfoIdArr.push(item.clientuserInfoId)
            }
          })
          // console.log(checkedClientuserInfoIdArr)
          this.$confirm("是否确认提交该尽调清单?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(()=>{
            publishedAllPlan(checkedClientuserInfoIdArr).then(res=>{
              if(res.code===0){
                this.tabTableData(this.companyAboutData.id,this.workUnitId)
                this.$message.success('发布成功');
              }else{
                this.tabTableData(this.companyAboutData.id,this.workUnitId)
              }
            })
          }).catch(()=>{
            this.$message.info("已取消提交");
          })
        }else{
          this.$alert("仅可提交状态为待发布的项", "提示", {confirmButtonText: "确定",type: "warning"});
        }
      }else{
        this.$alert("请选择需要提交的项！", "提示", {confirmButtonText: "确定",type: "warning"});
      }
    },
    //单个发布清单
    publishSinglePlan(val){
      this.$confirm("是否确认提交该尽调清单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        publishedAllPlan([val]).then(res=>{
          if(res.code===0){
            this.tabTableData(this.companyAboutData.id,this.workUnitId)
            this.$message.success('发布成功');
          }else{
            this.tabTableData(this.companyAboutData.id,this.workUnitId)
          }
        })
      }).catch(()=>{
        this.$message.info("已取消提交");
      })
    },
    //初始化数据
    initAllData() {
      getCompany(this.workUnitId).then(res=>{
        if (res.code === 0) {         
          this.selectData = res.result; 
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
    //更新表格数据
    tabTableData(companyAboutId,workUnitId){
      getTablePublishedPlan(companyAboutId,workUnitId).then(res => {
            console.log(res);
            if (res.code === 0) {
              let dataArr = res.result;
              if(dataArr.length>0){
                dataArr.forEach(item=>{
                  item.inforMation = item.inforMation.replace(/\,/g, "\n");
                  item.respondMation = item.respondMation.split(',');
                  item.departmentHead=item.respondMation[0]
                  item.contactPhone=item.respondMation[1]
                  if (item.attachment) {
                    let contentArr = [];
                    item.attachment = item.attachment.split(",");
                    for(let i = 0;i<item.attachment.length;i++) {
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
                });
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
              for(var i = 0; i < this.tableData.length; i ++) {
                  this.showEditDept[i] = true;
                  this.showEditDepartmentHead[i] = true;
                  this.showEditContactPhone[i] = true;
              }
            }
          });
    },
    ...mapActions('dueDiligence',['setAttachmentName','setThisDueId','setOnlyReadHeader','setCompanyAboutData'])
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
</style>