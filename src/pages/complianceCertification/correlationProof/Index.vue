<template>
  <div class="complianceCertification">
 <div class="search">
     <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="form" inline>
        <el-form-item label="主体名称">
            <el-autocomplete
                    class="search-input"
                    clearable
                    v-model="ruleForm.name"
                    style="width: 320px;"
                    @clear="handleClear"
                    :fetch-suggestions="querySearchAsync"
                    @select="handleSelect"
            ></el-autocomplete>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="ruleForm.Types" placeholder="请选择" class="state" @change="handleTypes">
              <el-option label="全部" value=""></el-option>
              <el-option
                      v-for="item in optionss"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
              ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="底稿属性">
             <el-autocomplete
                     class="search-input"
                     clearable
                     v-model="ruleForm.name2"
                     style="width: 320px;"
                     @clear="handleClear2"
                     :fetch-suggestions="querySearchAsync2"
                     @select="handleSelect2"
             ></el-autocomplete>
         </el-form-item>
         <el-form-item label="底稿状态">
             <el-select v-model="ruleForm.status2" placeholder="请选择" class="state" @change="handleOneStatus2">
                 <el-option
                         v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"
                 ></el-option>
             </el-select>
         </el-form-item>
         <el-form-item label="计划属性">
             <el-autocomplete
                     class="search-input"
                     clearable
                     v-model="ruleForm.name3"
                     style="width: 320px;"
                     @clear="handleClear3"
                     :fetch-suggestions="querySearchAsync3"
                     @select="handleSelect3"
             ></el-autocomplete>
         </el-form-item>
         <el-form-item label="计划状态">
             <el-select v-model="ruleForm.status3" placeholder="请选择" class="state" @change="handleOneStatus3">
                 <el-option
                         v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"
                 ></el-option>
             </el-select>
         </el-form-item>
        <div class="rightBox">
                <el-button type="primary" @click="handleSearch">搜索</el-button>
                <el-button type="danger" @click="resetForm('ruleForm')">重置</el-button>
            </div>
      </el-form>
    </div>
    <el-row>
      <div class="corre-table">
        <el-table
          ref="multipleTable"
          border
          :data="tableData3"
          tooltip-effect="dark"
          style="width: 100%"
          :max-height="getHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" prop="no" label="序号" width="80"></el-table-column>
          <el-table-column prop="name" label="主体名称" align="center"></el-table-column>
          <el-table-column prop="type" label="类型" align="center"></el-table-column>
          <el-table-column prop="name" label="涵盖时间" align="center" width="220">
              <template slot-scope="scope">
                  <p v-if="scope.row.coverBeginDate == ''&&scope.row.coverEndDate==''">-</p>
                  <p v-else>{{scope.row.coverBeginDate|cutTime}}-{{scope.row.coverEndDate|cutTime}}</p>
              </template>
          </el-table-column>
          <el-table-column prop="name" label="证明" align="center">
              <template slot-scope="scope"><span class="handle-view" @click="handleView(scope.row)">查看</span></template>
          </el-table-column>
          <el-table-column prop="remarks" label="备注" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                  <span v-if="scope.row.remarks" style="cursor: pointer">{{scope.row.remarks}}</span>
                  <span v-else>-</span>
              </template>
          </el-table-column>
          <el-table-column prop="name" label="底稿属性" align="center">
              <template slot-scope="scope">
                 <div v-if="getStatus">
                     <el-select
                             v-model="scope.row.manuscriptAttribute"
                             multiple
                             filterable
                             allow-create
                             default-first-option
                             placeholder="请选择底稿属性"
                             @change="handleBlur(scope.row)"
                     >
                         <el-option
                                 v-for="item in options1"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                         </el-option>
                     </el-select>
                 </div>
                  <div v-else>
                      {{scope.row.manuscriptAttribute.toString()}}
                  </div>
              </template>
          </el-table-column>
            <el-table-column label="状态" align="center" width="200">
                <template slot-scope="scope">
                    <span v-if="scope.row.manuscriptStatus==1">已关联</span>
                    <span v-if="scope.row.manuscriptStatus==0">未关联</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="计划属性" align="center">
                <template slot-scope="scope">
                    <div v-if="getStatus">
                        <el-select
                                v-model="scope.row.planAttribute"
                                multiple
                                filterable
                                allow-create
                                default-first-option
                                placeholder="请选择计划属性"
                                @change="handleBlur2(scope.row)"
                        >
                            <el-option
                                    v-for="item in options2"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div v-else>
                        {{scope.row.planAttribute.toString()}}
                    </div>
                    <!--<span v-if="!scope.row.visible">{{scope.row.visible}}</span>-->
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="200">
                <template slot-scope="scope">
                    <span v-if="scope.row.planStatus===1">已关联</span>
                    <span  v-if="scope.row.planStatus==0">未关联</span>
                </template>
            </el-table-column>
        </el-table>
          <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange"  :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
      </div>
    </el-row>
  </div>
</template>

<script>
import { previewFile } from '@/utils/api'
import { validationFormat,validationPlanFormat } from '@/utils/validate'
import { fiveList,fiveMaunApi,fivePlanApi,fiveMaunSave,fivePlanSaveApi,fiveSearchApi,secondSelectApi } from "@/api/complianceCertification";
export default {
  name: "confirmPlan",
  filters: {
    cutTime: function (value) {
        if (!value) return '';
        value = value.toString();
        let str = value.split(" ");
        let str1 = str[0].split("-")
        return str1.join('.')
    },
  },
  data() {
    return {
       ruleForm:{
        name:'',
        Types:'',
        status:'',
        status2:'',
        status3:'',
        name2:'',
        name3:'',
      },
      getHeight:window.innerHeight - 400,
      options: [
          {value:'',label:'全部'},
          {value:'0',label:'未关联'},
          {value:'1',label:'已关联'},
      ],
      optionsPlan:[
          {value:'',label:'全部'},
          {value:'0',label:'未关联'},
          {value:'1',label:'已关联'},
      ],
      optionss: [],
      tableData3: [],
      multipleSelection: [],
      status:'',
      status2:'',
      pageTotal:0,
      total:0,
      page:1,
      pageSize:20,
      options1:[],
      options2:[],
      type:'',
      inputContent:[],
      inputContent2:[],
      state4:'',
      getFileName:[]
    };
  },
    computed: {
        getStatus() {
            if (this.$route.query.status == 2 || this.$route.query.messageMatterStatus == 2){
                return false
            } else {
                return true
            }
        }
    },
   mounted(){
      this.getData()
      this.remoteMethod2()
      this.remoteMethod()
      this.getTypes()
    },
  methods: {
      getTypes(){
          let options = {
              name:''
          }
          secondSelectApi(options).then((res)=>{
              if (res.code == 0){
                  res.result.forEach(item=>{
                      this.optionss.push({value:item.id,label:item.name})
                  })
              }
          })
      },
      //获取列表数据
      getData(){
          let vm = this;
          let options = {
              name:vm.ruleForm.name,
              pagenum:vm.page ,
              pagesize:vm.pageSize ,
              type:vm.ruleForm.Types,
              workUnitId:vm.$route.params.id,
              status:vm.ruleForm.status,
              manuscriptAttri:vm.ruleForm.name2,
              manuscriptStatus:vm.ruleForm.status2,
              planAttri:vm.ruleForm.name3,
              planStatus:vm.ruleForm.status3,
          }
          fiveList(options).then((res)=>{
              if (res.code == 0){
                  vm.total=Number(res.result.total)
                  vm.pageTotal = Number(res.result.current)
                  vm.tableData3 = res.result.records
                  vm.tableData3.forEach(item=>{
                      if (item.manuscriptAttribute!=''){
                          item.manuscriptAttribute = item.manuscriptAttribute.split(',')
                      }else{
                          item.manuscriptAttribute = []
                      }
                      if (item.planAttribute != ''){
                          item.planAttribute = item.planAttribute.split(',')
                      }else{
                          item.planAttribute = []
                      }

                  })
              }
          })
      },
    //重置
    resetForm(){
          this.ruleForm.name = ''
          this.ruleForm.name2 = ''
          this.ruleForm.name3 = ''
          this.ruleForm.Types = ''
          this.ruleForm.status = ''
          this.ruleForm.status3 = ''
          this.ruleForm.status2 = ''
          this.getData()
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
      //状态选择
      statusChange(val){
        console.log(val)
      },
      //查看
      handleView(val){
          var title = val.certificationFileName.split('.')
          previewFile(val.certificationFilePath,title[0])
      },
      //列表显示
      handleSizeChange(val){
        this.pageSize = val
        this.getData()
      },
      //列表分页跳转
      pageChange(val){
          this.page = val
          this.getData()
      },
      remoteMethod(){
          let options = {
              manuscriptAttribute:'',
              workUnitId:this.$route.params.id
          }
          fiveMaunApi(options).then((res)=>{
              if (res.code == 0){
                  if (res.result !=''){
                      res.result.forEach(item=>{
                          this.options1.push({value:item,label:item})
                      })
                  }
              }
          })
      },
      handleBlur({id,manuscriptAttribute:attribute = []}){
          let status = attribute.length
              ? validationFormat(attribute[attribute.length - 1])
              : true;
          if (status){
              if(this.getStatus){
                  this.loading = true
                  let options = {
                      manuscript:attribute.join(','),
                      proofId:id
                  }
                  fiveMaunSave(options).then((res)=>{
                      if (res.code == 0){
                          this.loading = false
                          this.getData()
                      }
                  })
              }
          } else{
              attribute.pop()
              this.$alert(
                  "请按照x.x，x.x-x，x.x-x-x的格式填写该属性(x为数字)",
                  "提示",
                  { confirmButtonText: "确定", type: "warning" }
              );
          }
      },
      remoteMethod2(){
          let options = {
              planAttribute:'',
              matterNo:this.$route.params.id
          }
          fivePlanApi(options).then((res)=>{
              if (res.code == 0){
                  if (res.result !=''){
                      res.result.forEach(item=>{
                          this.options2.push({value:item,label:item})
                      })
                  }
              }
          })
      },
      handleBlur2({id,planAttribute:attribute = []}){
          let status = attribute.length
              ? validationPlanFormat(attribute[attribute.length - 1])
              : true;
          if (status){
              if(this.getStatus){
                  this.loading = true
                  let options = {
                      plan:attribute.join(','),
                      proofId:id
                  }
                  fivePlanSaveApi(options).then((res)=>{
                      if (res.code == 0){
                          this.loading = false
                          this.getData()
                      }
                  })
              }
          } else{
              attribute.pop()
              this.$alert(
                  "请按照 x-x-x，x-x-x-x，x-x-x-x-x 的格式填写该属性(x为数字)",
                  "提示",
                  { confirmButtonText: "确定", type: "warning" }
              );
          }
      },
      //计划属性--状态选择
      planStatus(val){
        this.status = val
      },
      handleOneStatus(val){
          this.ruleForm.status = val
          this.getData()
      },
      handleSearch(){
          this.getData()
      },
      handleTypes(val){
          this.ruleForm.Types = val
          this.getData()
      },
      //主体名称搜索
      querySearchAsync(queryString, cb) {
          let vm = this;
          vm.getFileName = []
          let options = {
              name:queryString,
              stept:5,
              workUnitId:vm.$route.params.id
          }
          fiveSearchApi(options).then((res)=>{
              if (res.code == 0){
                  res.result.forEach(item=>{
                      vm.getFileName.push({value:item})
                  })
              }
              var results = vm.getFileName;
              cb(results);
          })
      },
      handleSelect(item) {
          let vm = this;
          vm.ruleForm.name = item.value;
          vm.getData();
      },
      handleClear(){
          this.state4 = "";
          this.getData();
      },
      querySearchAsync2(queryString, cb) {
          let getFileName = []
          let options = {
              manuscriptAttribute:queryString,
              workUnitId:this.$route.params.id
          }
          fiveMaunApi(options).then((res)=>{
              if (res.code == 0){
                  res.result.forEach(item=>{
                      getFileName.push({value:item})
                  })
              }
              var results = getFileName;
              cb(results);
          })
      },
      handleSelect2(item) {
          let vm = this;
          vm.ruleForm.name2 = item.value;
          vm.getData();
      },
      handleClear2(){
          this.ruleForm.name2 = "";
          this.getData();
      },
      querySearchAsync3(queryString, cb) {
          let getFileName = []
          let options = {
              planAttribute:'',
              matterNo:this.$route.params.id
          }
          fivePlanApi(options).then((res)=>{
              if (res.code == 0){
                  res.result.forEach(item=>{
                      getFileName.push({value:item})
                  })
              }
              var results = getFileName;
              cb(results);
          })
      },
      handleSelect3(item) {
          let vm = this;
          vm.ruleForm.name3 = item.value;
          vm.getData();
      },
      handleClear3(){
          this.ruleForm.name3 = "";
          this.getData();
      },
      handleOneStatus2(val){
          this.ruleForm.status2 = val
          this.getData()
      },
      handleOneStatus3(val){
          this.ruleForm.status3 = val
          this.getData()
      },

  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/assets/css/varibles.scss";
    .search{
      margin-top: 20px;
    }
    .corre-table {
      margin: 20px 0;
        .el-table th.is-leaf{
            padding: 0;
        }
    }
    .handle-view{
        color: $global-color;
        text-decoration: underline;
        cursor: pointer;
    }
</style>

