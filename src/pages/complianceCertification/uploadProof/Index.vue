<template>
<div class="uploadProof">
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
          <el-checkbox label="备注" v-model="form.checkbox" @change="handleCheck" style="padding-left: 3%;"></el-checkbox>
          <el-input v-model="form.remarks"  :disabled="inputDiable" placeholder="此合规证明涵盖时间已过期" style="width: 73%;" :maxlength="20"></el-input>
      </el-form>
      	<span slot="footer" class="dialog-footer">
						<el-button type="primary" :loading="deterLoding" @click="Determine('form')">确定</el-button>
					</span>
    </el-dialog>
 <div class="search">
     <el-form ref="ruleForm" label-width="100px" inline>
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
        <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" :row-class-name="rowClass" :max-height="getHeight" >
          <!--<el-table-column align="center" type="selection" width="50"></el-table-column>-->
          <el-table-column align="center" prop="no" label="序号" width="80">
            <!--<template slot="header" slot-scope="scope">序号</template>-->
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
                <p v-else>{{scope.row.coverBeginDate|cutTime}}-{{scope.row.coverEndDate|cutTime}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="remarks" align="center" label="备注" :show-overflow-tooltip="true">
             <template slot-scope="scope">
                {{scope.row.remarks==''?'-':scope.row.remarks}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="executeStatus" label="状态" >
              <template slot-scope="scope">
                <template v-if="scope.row.executeStatus == 0">待上传</template>
                <template v-else-if="scope.row.executeStatus == 1">已上传</template>
                <template v-else-if="scope.row.executeStatus == 2">待审核</template>
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

           <el-table-column align="center" width="200" prop="executeStatus" label="操作">
               <template slot-scope="scope">
                   <div v-if="getStatus">
                       <span class="btn-item" v-if="scope.row.executeStatus == 0|| scope.row.executeStatus == 4 || scope.row.executeStatus == 1">
                           <upload
                               accept=".png, .bmp, .gif, .jpeg, .doc, .docx, .xls, .xlsx, .pdf,.m4a,.jpg"
                               uploadType="outline"
                               @uploadSuccess="uploadPlanSuccess"
                           >
                           <span class="btn-item" @click="handleUpload(scope.row, 'outline')" >上传</span>
                       </upload>
                       </span>
                       <!--<span class="btn-item" v-if="scope.row.executeStatus == 4 || scope.row.executeStatus == 1 ">-->
                          <!--<upload-->
                              <!--accept=".png, .bmp, .gif, .jpeg, .doc, .docx, .xls, .xlsx, .pdf,.m4a,.jpg"-->
                              <!--uploadType="outline"-->
                              <!--@uploadSuccess="uploadPlanSuccess"-->
                          <!--&gt;-->
                            <!--<span class="btn-item" @click="handleUpload(scope.row, 'outline')">上传-&#45;&#45;</span>-->
                          <!--</upload>-->
                     <!--</span>-->
                       <span class="btn-item" v-if="scope.row.executeStatus != 0" @click="handlePreview(scope.row)">查看</span>
                       <span class="btn-item" v-if="scope.row.executeStatus == 4 || scope.row.executeStatus == 1"  @click="handleSubmit(scope.row.id)">提交审核</span>
                   </div>

                   <div v-else>
                       <span class="btn-item" v-if="scope.row.executeStatus !=0" @click="handlePreview(scope.row)">查看</span>
                   </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
      <pageination @pageChange="pageChange" :total="total" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :page="page" :pageSize="pageSize"></pageination>
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
                        <p>涵盖时间：<span>{{item.coverEndDate}}</span></p>
                        <!--<p>{{item.coverEndDate}}</p>-->
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
import commonSelect from '@/components/commonDialog/commonSelect'
import {
  getAllSubmitted,
  getAllSubmitteds,
  uploadOutline,
  submitExcute,
  getNames,
  certifyView,
  secondSelectApi
} from "@/api/complianceCertification";
export default {
  name: "uploadProof",
  components: {
    upload,
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
            if (this.$route.query.status == 2){
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
        selectOptions:{
            remoteMethod:this.remoteMethod,
            handleChange:this.handleChange,
            handleFocus:this.handleFocus,
            listOptions:[],
            name:''
        },
      inputDiable:true,
      deterLoding:false,
      formLabelWidth: "100px",
      form:{
        coverBeginDate:"",
        coverEndDate:"",
        remarks:'',
        checkbox:false
      },
      //时间
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
      dialogTableVisible:false,
      lists:[],  //模糊查询
      loading: false,
      //baseUrl: "",
      uploadAction: "",
      total: 100,
      page: 1,
      pageSize: 20,
      seleclist: [
        {
          value: 0,
          label: "待上传"
        },
        {
          value: 1,
          label: "已上传"
        },
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
      upfilePath:'',
      upfileName:'',
      fileName:[],
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
    getTableHeight(){
        this.getHeight=window.innerHeight-400;
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
      this.pageChange(1);
        },
    //不合格加边框
   rowClass({ row, rowIndex }) {
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
    //指定时间段
      getstartTime(time) {
            this.coverBeginDate = time
      },
      getendTime(time) {
           this.coverEndDate = time
      },
    //提交审核
    handleSubmit(proofId) {
      submitExcute(proofId).then(res => {
        if (res.code == 0) {
            this.$message({
                type:'success',
                message:res.msg
            })
          this.pageChange(this.page);
        }else{
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
    },
    handleFileView(val){
        var title = val.fileName.split('.')
        previewFile(val.filePath,title[0])
    },
      showVisible(){
          this.viewListDialog = false
      },
    //重传
     handleUpload(row, type) {
      this.getNowFormatDate()
      this.proofId = row.id;
      this.uploadType = type;
      this.loading = false
    },
    //上传
    uploadPlanSuccess(resData, fileName){
      this.loading = true
      this.upfilePath= resData;
      this.upfileName = fileName;
      this.dialogTableVisible=true
    },
    Determine(resData, fileName){

      //console.log(resData)
        this.deterLoding = true
        this.dialogTableVisible=false
      // 上传证明
      uploadOutline({
        proofId: this.proofId,
        filePath: this.upfilePath,
        fileName: this.upfileName,
        coverBeginDate:this.form.coverBeginDate,
        coverEndDate:this.form.coverEndDate,
        remarks:this.form.remarks
      })
        .then(res => {
          //console.log(res)
          if (res.code == 0) {
              this.loading = false
              this.deterLoding = false
              this.inputDiable = true
              this.form.remarks="";
              this.form.checkbox="";
              this.upfileName = '';
              this.upfilePath = ''
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
      popSuccess(type,message){
        this.$message({
            type:type,
            message:message
        })
      },
      querySearchAsync(queryString, cb) {
          let vm = this;
          vm.getFileName = []
          getNames(queryString, 3, this.$route.params.id).then((res) => {
              if (res.code == 0) {
                  res.result.forEach(item => {
                      vm.getFileName.push({value: item})
                  })
              }
              var results = vm.getFileName;
              cb(results);
          })
      },
      createStateFilter(queryString) {
          return (state) => {
              return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
          };
      },
      remoteMethod(query){
          this.getApis(query)
      },
      getApis(val){
          var lists = []
          getNames(val,3,this.$route.params.id).then((res)=>{
              if (res.code == 0) {
                  res.result.forEach((item)=>{
                      lists.push({value:item,label:item})
                  })
                  this.selectOptions.listOptions = lists.filter(item => {
                      return item.label.toLowerCase()
                          .indexOf(val.toLowerCase()) > -1;
                  });
              }else{
                  this.selectOptions.listOptions = []
              }
          })
      },
      handleChange(val){
          this.name = val
          this.pageChange(1)
      },
      handleFocus(){
          this.getApis('')
      },
     //模糊查询
  querySearch(queryString, cb) {
        let vm=this
        this.lists = []
        getNames(vm.name,3,vm.$route.params.id).then((res)=>{
            res.result.forEach(item=>{
                this.lists.push({value:item})
            })

        var lists = this.lists;
        var results = queryString ? lists.filter(this.createStateFilter(queryString)) : lists;
         cb(results);
        })
    },
    createStateFilter(queryString) {
        return (state) => {
            return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
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
   //搜索
    pageChange(index){
      this.page = index;
      let vm = this;
      vm.loading = false;
      getAllSubmitteds(vm.name,vm.status,vm.type,vm.$route.params.id,vm.page,vm.pageSize).then((res)=>{
          if (res.code == 0){
              // console.log(res)
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
      handleCheck(val){
        this.form.checkbox = val
          if (this.form.checkbox != true){
              this.form.remarks = ''
              this.inputDiable = true
          }else{
              this.form.remarks = '此合规证明涵盖时间已过期'
              this.inputDiable = false
          }
      },
      handleClose(){
        this.dialogTableVisible = false
      }
  }

};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/assets/css/varibles.scss";
.search{
  margin-top: 20px;
}
.uploadProof{
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

