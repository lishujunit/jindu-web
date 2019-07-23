<template>
  <div class="confirmPlans">
    <el-row v-if="getStatus">
      <el-button type="primary" @click="handlePass">合格</el-button>
      <el-button type="danger" @click="handleNoPass">不合格</el-button>
    </el-row>
    <div class="search">
     <el-form ref="ruleForm" label-width="100px" class="form" inline>
         <el-form-item label="主体名称" prop="name">
             <el-autocomplete
                 class="search-input"
                 clearable
                 style="width: 350px;"
                 v-model="name"
                 @clear="handleClear"
                 @keyup.enter.native="handleSearch"
                 :fetch-suggestions="querySearchAsync"
                 @select="handleSelect"
             ></el-autocomplete>
             <!--<common-select :options="selectOptions"></common-select>-->
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="type" placeholder="请选择" class="state" @change="pageChange(1)">
              <el-option label="全部" value=""></el-option>
              <el-option
              v-for="item in optionss"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="status" placeholder="请选择" class="state" @change="pageChange(1)">
              <el-option label="全部" value=""></el-option>
              <el-option
              v-for="item in seleclist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              ></el-option>
          </el-select>
        </el-form-item>
        <div class="rightBox">
              <el-button type="primary" @click="pageChange(1)">搜索</el-button>
              <el-button type="danger" @click="resetForm()">重置</el-button>
        </div>
      </el-form>
    </div>
    <el-row>
     <div class="table-box">
        <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" :row-class-name="rowClass"
          :max-height="getHeight"
        >
          <el-table-column align="center" type="selection" width="50"></el-table-column>
            <el-table-column align="center" prop="no" label="序号" width="80">
            <!--<template slot="header">序号</template>-->
          </el-table-column>
          <el-table-column align="center" prop="name" label="主体名称" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
            <el-table-column align="center" prop="type" label="类型" width="180">
              <template slot-scope="scope">{{scope.row.type}}</template>
          </el-table-column>
          <el-table-column align="center" prop="createStatus" label="状态" width="100" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <template v-if="scope.row.createStatus == 0">待提交</template>
                <template v-else-if="scope.row.createStatus == 2">待确认</template>
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
              <template v-if="scope.row.createStatus == 0">--</template>
              <template v-else-if="scope.row.createStatus == 2">
                <span class="btn-item" @click="handleQualified(scope.row.id)">合格</span>
                <span class="btn-item" style="color: red;" @click="handleUnqualified(scope.row.id)">不合格</span>
              </template>
              <!--<template v-else-if="scope.row.createStatus == 3">-</template>-->
              <template v-else-if="scope.row.createStatus == 4">
                <!-- <span class="btn-item">
                  <upload
                    accept=".png, .bmp, .gif, .jpeg, .doc, .docx, .xls, .xlsx, .pdf"
                    uploadType="outline"
                  >
                    <span class="btn-item" @click="handleUpload(scope.row, 'outline')">重传</span>
                  </upload>
                </span> -->
                <span class="btn-item" @click="handleDelete(scope.row.id)">删除</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
     <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
      <common-dialog :options="options"></common-dialog>
  </div>
</template>

<script>
import { previewFile } from "@/utils/api";
import upload from "@/components/upload";
import { MessageBox } from "element-ui";
import commonDialog from '@/components/commonDialog/commonDialog'
import commonSelect from '@/components/commonDialog/commonSelect'
import {
  getAllSubmitted,
  interviewQualified,
  interviewQualifiedAll,
  interviewUnqualified,
  interviewUnqualifiedAll,
  uploadOutline,
  deleteInterviews,
  getNames,
 secondSelectApi
} from "@/api/complianceCertification";
export default {
  name: "confirmPlans",
  components: {
    upload,
    commonDialog,
    commonSelect
  },
  mounted: function() {
    this.pageChange(1);
    this.workUnitId = this.$route.params.id;
    //this.baseUrl = process.env.VUE_APP_BASEURL;
    this.uploadAction = process.env.VUE_APP_UPLOAD;
    this.getTableHeight()
    this.getTypes()
  },
  data() {
    return {
      options:{
          dialogFormVisible:false,
          handleClose:this.handleClose,
          reasonInput:'',
          title:'不合格原因',
          moreShow:false,
          handleMoreCommit:this.handleMoreCommit,
          handleCommit:this.handleCommit,
      },
      name:'',
      type:'',
      status:'',
      stept:'',
      workUnitId:"",
      lists:[],  //模糊查询
      loading: false,
     // baseUrl: "",
      uploadAction: "",
      total: 100,
      page: 1,
      pageSize: 20,
      seleclist: [
        // {
        //   value: 0,
        //   label: "待提交"
        // },
        {
          value: 2,
          label: "待确认"
        },
        {
          value: 3,
          label: "合格"
        },
        {
          value: 4,
          label: "不合格"
        }
      ],
       mark: "",
      value:1,
      optionss: [],
      tableData: [],
      multipleSelection: [],
      getHeight:0,
      pageTotal:0,
      Refresh:false,
      proofId:'',
      getProofIds:[],
    };
  },
  created() {
      window.addEventListener('resize', this.getTableHeight);
      this.getTableHeight()

  },
  destroyed(){
      window.removeEventListener('resize', this.getTableHeight)
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
  methods: {
    getTableHeight(){
        this.getHeight=window.innerHeight-450;
    },
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
    handleSizeChange(val){
      this.pageSize = val;
      this.page = 1;
      this.pageChange();
        },
    //不合格加边框
   rowClass({ row, rowIndex }) {
			if (row.createStatus == 4) return 'warn'
			else return ''
    },
    //重传
    // handleUpload(row, type) {
    //   console.log(row);
    //   console.log(type);
    //   this.proofId = row.id;
    //   this.uploadType = type;
    // },
    //删除
     handleDelete(proofId) {
      MessageBox.alert("是否要删除？", "提示", {
        type: "warning",
        confirmButtonText: "确定",
        callback: action => {
          if (action === "confirm") {
            this.loading = true;
            deleteInterviews(proofId)
              .then(res => {
                if (res.code == 0) {
                  this.popMessage('success',res.msg)
                  this.pageChange(this.page);
                } else {
                    this.pageChange(this.page)
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
    //多选合格
    handlePass() {
      let multipleSelection = this.multipleSelection;
      let proofId = [];
      if (multipleSelection.length) {
        multipleSelection.forEach(v => {
          if (v.createStatus == 2) {
            proofId.push(v.id);
          }
        });
        if (proofId.length) {
          interviewQualifiedAll(proofId.toString()).then(res=>{
            if (res.code === 0) {
                  this.popMessage('success',res.msg)
                  this.pageChange(this.page);
                }
          })
        } else {
           MessageBox.alert("仅可以选择待审核状态的选项！", "提示", {
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
      }
    },
    //单选合格
    handleQualified(proofId) {
      this.loading = true;
      interviewQualified(proofId).then(res => {
        if (res.code === 0) {
          this.popMessage('success',res.msg)
          this.pageChange(this.page);
        }else{
            this.pageChange(this.page)
        }
      });
    },
    //多选不合格
     handleNoPass() {
      let multipleSelection = this.multipleSelection;
      this.getProofIds = [];
      if (multipleSelection.length) {
        //2提交 4不合格
        multipleSelection.forEach(v => {
          if (v.createStatus == 2) {
            this.getProofIds.push(v.id);
          }
        });
        if (this.getProofIds.length) {
            this.options.reasonInput = ''
            this.options.moreShow = true
            this.options.dialogFormVisible = true
        } else {
           MessageBox.alert("仅可以选择待审核状态的选项！", "提示", {
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
      }
    },
    //单选不合格
    handleUnqualified(proofId) {
        this.options.dialogFormVisible = true
        this.options.moreShow = false
        this.options.reasonInput = ''
        this.proofId = proofId
    },
    handleSearch(){
      let vm=this
      vm.page = 1;
      vm.pageChange()
    },
      querySearchAsync(queryString, cb) {
          let vm = this;
          vm.getFileName = []
          getNames(queryString,2,this.$route.params.id).then((res)=>{
              if (res.code == 0){
                  res.result.forEach(item=>{
                      vm.getFileName.push({value:item})
                  })
              }
              var results =  vm.getFileName;
              cb(results);
          })

          },
          createStateFilter(queryString) {
              return (state) => {
                  return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
              };
          },
      handleSelect(val){
          this.name = val.value
          this.pageChange(1)
      },
      handleClear(){
          this.name == ''
          this.pageChange(1)
      },
    //搜索
    pageChange(index){
      this.page = index;
      let vm = this;
      vm.loading = false;
      getAllSubmitted(vm.name,vm.status,vm.type,vm.$route.params.id,vm.page,vm.pageSize).then((res)=>{
          if (res.code == 0){
              // console.log(res)
              // vm.loading = false;
              vm.tableData = res.result.records;
              vm.pageTotal = Number(res.result.pages);
              vm.total = Number(res.result.total);
          }
      })
    },
    //重置
     resetForm() {
        this.name=''
        this.type=""
        this.status=""
        this.pageChange(1)
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
     // console.log(val)
      this.multipleSelection = val;
    },
   handleClose(){
        this.options.moreShow = false
        this.options.reasonInput = ''
       this.options.dialogFormVisible = false
   },
  handleMoreCommit(){
      let vm = this;
      if (vm.options.reasonInput == ''){
          this.$message({
              type:'warning',
              message:'不合格原因不能为空！'
          })
      }else{
          interviewUnqualifiedAll(vm.getProofIds,vm.options.reasonInput).then((res)=>{
              if (res.code == 0){
                  this.popMessage('success',res.msg)
                  this.pageChange(this.page)
                  this.handleClose()
              }else{
                  this.pageChange(this.page)
                  this.handleClose()
              }
          })
      }
  },
  handleCommit(){
      let vm = this;
      if (vm.options.reasonInput == ''){
          this.$message({
              type:'warning',
              message:'不合格原因不能为空！'
          })
      }else{
          interviewUnqualified(vm.proofId,vm.options.reasonInput).then((res)=>{
              if (res.code == 0){
                  this.popMessage('success',res.msg)
                  this.pageChange(this.page)
                  this.handleClose()
              }else{
                  this.handleClose()
                  this.pageChange(this.page)
              }
          })
      }
   },
  popMessage(type,message){
      this.$message({
          type:type,
          message:message
      })
  }
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/assets/css/varibles.scss";

.search{
  margin-top: 20px;
}
.confirmPlans {
  .table-box {
    margin: 20px 0;
  }
  .m_r20 {
    margin-right: 20px;
  }
  .btn-item {
    text-decoration: underline;
    color: #0cb3f0;
    margin: 0 8px;
    cursor: pointer;
    display: inline-block;
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


</style>
