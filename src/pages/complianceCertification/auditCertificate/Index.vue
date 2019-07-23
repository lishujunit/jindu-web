<template>
  <div class="auditertificate">
    <el-dialog title="涵盖时间" :visible.sync="dialogTableVisible" :show-close="false" width="567px" :before-close="handleClose" :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="涵盖时间" :label-width="formLabelWidth" required>
            <el-form-item prop="coverBeginDate" style="float:left">
              <el-date-picker class="date" type="date" v-model="form.coverBeginDate" style="width: 80%;" value-format="yyyy-MM-dd" :picker-options="startDatePicker" @change="getstartTime"></el-date-picker>
            </el-form-item>
          <el-col class="line" :span="2" style="float: left;margin-left: -26px;">-</el-col>
            <el-form-item prop="coverEndDate" style="float:right;margin-left: -11px;">
              <el-date-picker class="date" type="date" v-model="form.coverEndDate" style="width: 80%;" value-format="yyyy-MM-dd" :picker-options="endDatePicker" @change="getendTime"></el-date-picker>
            </el-form-item>
      </el-form-item>
          <el-checkbox label="备注" v-model="form.checkbox"  @change="handleCheck" style="padding-left: 3%;"></el-checkbox>
          <el-input v-model="form.remarks" :disabled="disableInput" placeholder="此合规证明涵盖时间已过期" style="width: 73%;" :maxlength="20"></el-input>
      </el-form>
      	<span slot="footer" class="dialog-footer">
						<el-button type="primary" @click="Determine('form')">确定</el-button>
					</span>
    </el-dialog>
     <div class="confirm-wrap">
        <div class="button-list" v-if="getStatus">
            <el-button type="primary" @click="handlePass">合格</el-button>
            <el-button type="danger" @click="handleNoPass">不合格</el-button>
        </div>
     </div>
 <div class="search">
     <el-form ref="ruleForm" label-width="100px" inline>
       <el-form-item label="主体名称" prop="name">
           <el-autocomplete
               class="search-input"
               clearable
               style="width: 350px;"
               v-model="name"
               @clear="handleClear"
               @keyup.enter.native="pageChange(1)"
               :fetch-suggestions="querySearchAsync"
               @select="handleSelect"
           ></el-autocomplete>
           <!--<common-select :options="selectOptions"></common-select>-->
        </el-form-item>
         <el-form-item label="类型">
        <el-select v-model="type" placeholder="请选择" class="state"  @change="pageChange(1)">
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
         <el-table
             border
             :data="tableData"
             :max-height="getHeight"
             @selection-change="handleSelectionChange"
             :row-class-name="tableRowClassName"
             @row-click="handleRowClick"
             @current-change="handleCurrentChange"
             v-loading="loading"
        >
          <el-table-column align="center" type="selection" width="50"></el-table-column>
             <el-table-column align="center" prop="no" label="序号" width="80">
            <!--<template slot="header">序号</template>-->
          </el-table-column>
          <el-table-column prop="name" align="center" label="主体名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" prop="type" label="类型">
              <template slot-scope="scope">
                 {{scope.row.type}}
              </template>
          </el-table-column>
          <el-table-column prop="coverBeginDate" align="center" label="涵盖时间">
              <template slot-scope="scope">
                  <p v-if="scope.row.coverBeginDate == ''&&scope.row.coverEndDate==''">-</p>
                  <p v-else>{{scope.row.coverBeginDate| cutTime}}-{{scope.row.coverEndDate|cutTime}}</p>
              </template>
          </el-table-column>
          <el-table-column prop="remarks" align="center" label="备注" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                  {{scope.row.remarks==''?'-':scope.row.remarks}}
              </template>
          </el-table-column>
          <el-table-column align="center" prop="executeStatus" label="状态" >
              <template slot-scope="scope">
                <!-- <template v-if="scope.row.executeStatus == 0">待上传</template>
                <template v-else-if="scope.row.executeStatus == 1">已上传</template> -->
                <template v-if="scope.row.executeStatus == 2">待审核</template>
                <template v-else-if="scope.row.executeStatus == 3">合格</template>
                <template v-else-if="scope.row.executeStatus == 4">
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
           <el-table-column align="center" width="200" prop="executeStatus" :show-overflow-tooltip="true">
             <template slot="header">操作</template>
               <template slot-scope="scope">
                  <template v-if="scope.row.executeStatus == 2">
                    <span class="btn-item" @click="handlePreview(scope.row)">查看</span>
                      <span class="btn-item" v-if="getStatus">
                      <upload
                              accept=".png, .bmp, .gif, .jpeg, .doc, .docx, .xls, .xlsx, .pdf,.m4a,.jpg"
                              uploadType="outline"
                              @uploadSuccess="uploadPlanSuccess"
                      >
                        <span class="btn-item" v-if="getStatus" @click="handleUpload(scope.row, 'outline')">上传</span>
                      </upload>
                     </span>
                    <span class="btn-item" v-if="getStatus" @click="handleQualified(scope.row.id)">合格</span>
                    <span class="btn-item unauth" v-if="getStatus" @click="handleUnqualified(scope.row.id)">不合格</span>
                  </template>
                  <template v-else-if="scope.row.executeStatus == 3">
                    <span class="btn-item" @click="handlePreview(scope.row)">查看</span>
                  </template>
                  <template v-else-if="scope.row.executeStatus == 4">
                    <span class="btn-item" @click="handlePreview(scope.row)">查看</span>
                  </template>
            </template>

          </el-table-column>
        </el-table>
      </div>
    </el-row>
      <pageination @pageChange="pageChange"  @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
      <common-dialog :options="options"></common-dialog>
      <!--查看列表弹框-->
      <el-dialog :visible.sync="viewListDialog" :show-close="false" class="viewDialog" :modal="false">
          <div class="dia-content clearfix">
              <div class="dia-list clearfix">
                  <div class="dia-title clearfix">
                      <p></p>
                      <p>回函列表</p>
                      <p @click="showVisible"><i class="el-icon-close"></i></p>
                  </div>
                  <div class="recal-number">
                      <p>文件数<span>{{secondList}}</span>份</p>
                  </div>
                  <div v-for="(item,index) in recalList" :key="index" class="recal-content">
                      <p class="recal-title" @click="handleFileView(item)" :title="item.fileName">{{item.fileName}}</p>
                      <p>---------------</p>
                      <p>{{item.createUserName}}</p>
                      <p>{{item.createTime}}</p>
                      <p>上传</p>
                      <p>涵盖时间：</p>
                      <p>{{item.coverEndDate}}</p>
                      <p v-if="item.remarks !=''">备注：</p>
                      <p>{{item.remarks}}</p>
                  </div>
              </div>
          </div>
      </el-dialog>
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
 getAllSubmittedss,
 uploadOutlines,
 interviewUnqualifieds,
 interviewQualifieds,
 getNames,
 noPassAll,
 secondSelectApi,
 certifyView,
 passAll
} from "@/api/complianceCertification";
export default {
  name: "auditertificate",
   components: {
    upload,
   commonDialog,
   commonSelect
  },
    filters: {
        cutTime: function (value) {
            if (!value) return '';
            value = value.toString();
            let str = value.split(" ");
            let str1 = str[0].split("-")

            return str1.join('.')
        },
    },
    computed: {
        getStatus() {
            if (this.$route.query.status == 2 || this.$route.query.messageMatterStatus==2){
                return false
            } else {
                return true
            }
        }
    },
  mounted: function() {
    this.pageChange(1);
    this.workUnitId = this.$route.params.id;
    //this.baseUrl = process.env.VUE_APP_BASEURL;
    this.uploadAction = process.env.VUE_APP_UPLOAD;
    this.getNowFormatDate()
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
      disableInput:true,
      formLabelWidth: "100px",
      dialogFormVisible:false,
      inquiryIds:[],
      itemId:[],
      reasonInput:'',
      form:{
        coverBeginDate:"",
        coverEndDate:"",
        remarks:'',
        checkbox:false
      },
      //指定时间
       startDatePicker: {
            disabledDate: (time) => {
                if (this.form.coverEndDate != "") {
                    return time.getTime() >  new Date(this.form.coverEndDate).getTime();

            }
          },
        },
        endDatePicker: {
          disabledDate: (time) => {
              return time.getTime() < new Date(this.form.coverBeginDate).getTime()- 1*24*60*60*1000;//减去一天的时间代表可以选择同一天;
          },

        },
      rules:{
        coverBeginDate:[
           { type: 'string',  required: true, message: '请选择日期', trigger: 'change' }
        ],
        coverEndDate:[
           { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      name:'',
      type:'',
      status:'',
      workUnitId:"",
      stept:'',
      timeout: null,
      dialogTableVisible:false,
      lists:[],  //模糊查询
      loading: false,
      dataLoading: false,
     // baseUrl: "",
      uploadAction: "",
      total: 100,
      page: 1,
      pageSize: 20,
      seleclist: [
         {
          value: 2,
          label: "待审核"
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
      value:0,
      optionss: [],
      tableData: [],
      multipleSelection: [],
      getHeight:0,
      pageTotal:0,
      count:0,
      proofIdOne:'',
      proofId:'',
      viewListDialog:false,
      secondList:0,
      recalList:[],
    };
  },
  created() {
      window.addEventListener('resize', this.getTableHeight);
      this.getTableHeight()

  },
  destroyed(){
      window.removeEventListener('resize', this.getTableHeight)
  },
  methods: {
      selectRows(){
          let vm = this;
          vm.itemId=[];
          vm.count = 0
          if (this.inquiryIds.length != 0){
              this.inquiryIds.forEach(v => {
                  if (v.executeStatus == 2) {
                      vm.itemId.push(v.id)
                      // vm.itemId.push(v.batchNo + '-' + v.websiteId + '-' + v.subjectNo)
                  }
              })
              if (vm.itemId.length == 0) {
                  this.$alert('仅可以提交主体状态为待审核选项！', '提示', {
                      type: 'warning',
                      confirmButtonText: '确定',
                      callback: () => {}
                  })
                  return false
              }
              vm.count = 1
          } else{
              this.$alert('请选择要提交审核的项！', '提示', {
                  type: 'warning',
                  confirmButtonText: '确定',
                  callback: () => {}
              })
          }
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
       //合格-多选
      handlePass(){
          let vm = this;
          vm.selectRows();
          if (vm.count ==1){
              passAll(vm.itemId).then((res)=>{
                  if (res.code ==0){
                      this.popSuccess('success',res.msg)
                      this.pageChange(1)
                  }
              })
          }
      },
 //不合格-多选
    handleNoPass(){
        let vm = this;
        vm.selectRows();
        if (vm.count==1){
            vm.options.reasonInput = '';
            vm.options.moreShow = true;
            vm.options.dialogFormVisible = true
        }
    },
    getTableHeight(){
        this.getHeight=window.innerHeight-450;
    },
      handleSizeChange(val){
      this.pageSize = val;
      this.page = 1;
      this.pageChange();
        },
    //不合格加边框
      tableRowClassName({ row, rowIndex }) {
			if (row.executeStatus == 4) return 'warn'
			else return ''
		},
     //日历默认值
    getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        this.form.coverBeginDate = currentdate
        this.form.coverEndDate = currentdate
    },
    //时间段
      getstartTime(time) {
          this.coverBeginDate = time
      },
      getendTime(time) {
          this.coverEndDate = time
      },
      handleChange(val){
          this.name = val
          this.pageChange(1)
      },
      handleFocus(){
          this.getApis('')
      },
      //模糊查询
      querySearchAsync(queryString, cb) {
        let  getFileName = []
         getNames(queryString,4,this.$route.params.id).then((res)=>{
              if (res.code == 0){
                  res.result.forEach(item=>{
                      getFileName.push({value:item})
                  })
              }
              var results = getFileName;
              cb(results);
          })
    },

    handleClear(val){
      this.name = ""
      this.pageChange(1)
    },
    handleSelect(val){
      this.name = val.value
      //console.log(val)
      this.pageChange(1)
    },
      handleRowClick(val){
          console.log(val)
      },
   //搜索
    pageChange(index){
      this.page = index;
      let vm = this;
      vm.loading = false;
      getAllSubmittedss(vm.name,vm.status,vm.type,vm.$route.params.id,vm.page,vm.pageSize).then((res)=>{
          if (res.code == 0){
              // console.log(res)
              // vm.loading = false;
              vm.tableData = res.result.records;
              vm.pageTotal = Number(res.result.pages);
              vm.total = Number(res.result.total);
              vm.inquiryIds = [];
              vm.rowIds = []
          }
      })
    },
     //不合格
    handleUnqualified(proofId) {
      this.options.dialogFormVisible = true
        this.options.reasonInput = ''
        this.proofIdOne = proofId
    },
    //合格
    handleQualified(proofId) {
      this.loading = true;
      interviewQualifieds(proofId).then(res => {
        if (res.code === 0) {
          this.popSuccess('success',res.msg)
          this.pageChange(this.page);
        }else {
            this.pageChange(this.page)
        }
      });
    },
     //查看
    handlePreview(val) {
        this.viewListDialog = true
        certifyView(val.id).then((res=>{
            if (res.code == 0){
                this.recalList = res.result
                this.secondList = this.recalList.length
            }
        }))
        // var title = val.certificationFileName.split('.')
        // previewFile(val.certificationFilePath,title[0])
      // previewFile(localStorage.resData)
    },
      handleFileView(val){
          var title = val.fileName.split('.')
          previewFile(val.filePath,title[0])
      },
      showVisible(){
          this.viewListDialog = false
      },
    //重传
     handleUpload(row, type,proofId) {
       //console.log(row.id)
         this.getNowFormatDate()
      this.proofId = row.id;
      this.uploadType = type;

    },
     //上传
    uploadPlanSuccess(resData, fileName){
      localStorage.resData = resData;
      localStorage.fileName = fileName;
      this.dialogTableVisible=true
    },
    Determine(resData, fileName){
        this.dialogTableVisible=false
        this.loading = true
      // 上传证明
      uploadOutlines({
        proofId: this.proofId,
        filePath: localStorage.resData,
        fileName: localStorage.fileName,
        coverBeginDate:this.form.coverBeginDate,
        coverEndDate:this.form.coverEndDate,
        remarks:this.form.remarks
      })
        .then(res => {
          if (res.code == 0) {
              this.loading = false
              this.form.remarks="";
              this.form.checkbox="";
              this.disableInput = true
              this.popSuccess('success',res.msg)
              this.pageChange(this.page);
          } else {
            //alert(res.msg);
            this.loading = false;
          }
        })
        .catch(res => {
          this.loading = false;
        });

    },
      handleCheck(val){
          this.form.checkbox = val
          if (this.form.checkbox != true){
              this.form.remarks = ''
              this.disableInput = true
          }else{
              this.form.remarks = '此合规证明涵盖时间已过期'
              this.disableInput = false
          }
      },
    //重置
    resetForm(ruleForm) {
        this.name=''
        this.type=""
        this.status=""
        this.pageChange()
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
      this.inquiryIds = val
    },
      handleCurrentChange(val){
          console.log(val)
      },
      handleClose(){
        this.options.reasonInput = ''
        this.options.dialogFormVisible = false
      },
      handleMoreCommit(){
          let vm = this;
          if(vm.options.reasonInput !=''){
              noPassAll(vm.itemId.toString(),vm.options.reasonInput).then((res)=>{
                  if (res.code == 0){
                      vm.options.dialogFormVisible = false;
                      // this.getData();
                      this.popSuccess('success',res.msg)
                      vm.pageChange(this.page)
                  }else{
                      this.pageChange(this.page)
                      this.handleClose()
                  }
              })
          }else{
              vm.$message({
                  type:'warning',
                  message:'输入不能为空'
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
          } else{
              interviewUnqualifieds(vm.proofIdOne,vm.options.reasonInput).then((res)=>{
                  if (res.code == 0){
                      this.pageChange(this.page)
                      this.popSuccess('success',res.msg)
                      this.handleClose()
                  }else{
                      this.pageChange(this.page)
                      this.handleClose()
                  }
              })
          }
      },
      popSuccess(type,message){
          this.$message({
              type:type,
              message:message
          })
      }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/assets/css/varibles.scss";
.search{
  margin-top: 20px;
}

.auditertificate{
  .table-box {
    margin: 20px 0;
  }
  .m_r20 {
    margin-right: 20px;
  }
  .btn-item {
    color: #0cb3f0;
    margin: 0 5px;
    cursor: pointer;
    display: inline-block;
    text-decoration: underline;
    /*&:hover {*/
      /*color: #3dc2f3;*/
    /*}*/
  }
    .unauth{
        color: red;
    }
   .color_red{
    color: #c00;
  }
}
.el-table .cell{
  word-break: keep-all;white-space:nowrap;
}

</style>
<style lang="scss">
    @import "@/assets/css/varibles.scss";
    .viewDialog{
        .el-dialog .el-dialog__header{
            background: #fff;
            display: none;
        }
    }
    .dia-content{
        width: 100%;
        .el-dialog .el-dialog__header{
            background: #fff;
        }
        /*position: absolute;*/
        /*z-index: 999;*/
        /*left: 50%;*/
        /*top: 30%;*/
        background: #fff;
        /*box-shadow: 4px 3px 4px #ddd;*/

        .dia-list{
            width: 100%;
            border: 1px solid #ddd;
            box-sizing: border-box;
            padding-bottom: 20px;
            >div{
                float: left;
            }
            /*padding: 10px;*/
            .recal-content{
                width: 100%;
                float: left;
                margin-top: 16px;
                >p{
                    float: left;
                    padding:0 10px;
                    line-height: 1.4;
                }
                >p:first-of-type{
                    color: $global-color;
                    cursor: pointer;
                    text-decoration: underline;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow:ellipsis;
                }
                >p:last-of-type{
                    cursor: pointer;
                }
                >p:nth-of-type(2){
                    /*max-width: 180px;*/
                    max-width: 100px;
                }
                .recal{
                    /*float: right;*/
                    font-size: 16px;
                    color: red;
                }
                .recal-title{
                    max-width: 200px;
                    text-decoration: underline;
                }
            }
            .dia-title{
                width: 100%;
                border-bottom: 1px solid #ddd;
                >p{
                    float: left;
                    margin: 10px;
                }
                >p:first-of-type{
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: $global-color;
                    margin-right: -4px;
                }
                >p:nth-of-type(2){
                    font-size: 14px;
                    line-height: 16px;
                }
                >p:last-of-type{
                    float: right;

                    i{
                        font-size: 16px;
                        color: #666;
                    }
                }
            }
            .recal-number{
                padding: 5px 0;
                width: 100%;
                border-bottom: 1px solid #ddd;
                box-sizing: border-box;
                >p{
                    font-size: 16px;
                    margin-left: 14px;
                    >span{
                        font-size: 24px;
                        padding: 0 4px;
                        color: $global-color;
                    }
                }

            }
        }
    }
</style>

