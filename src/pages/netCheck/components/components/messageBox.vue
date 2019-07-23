<template>
  <div class="messageBox">
    <el-dialog title="提醒" :visible.sync="dialogTableVisible" width="1000px" :before-close="handle" :close-on-click-modal="false" :close-on-press-escape="false">
       <div class="error">
        <div class="icon">
          <i class="el-icon-warning"></i>
        </div>
        <div class="txt">重复提交相同核查主体、相同查询站点共计<span>{{errorList.length}}</span>个</div>
      </div>
      <el-table :data="showList" style="padding-top:30px">
        <el-table-column property="subjectNo" label="序号"  width="60px" align="center">
            <template slot-scope="scope" v-for='item in showList'>{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column property="subjectName" label="核查主体（公司全称/公司简介/自然人姓名）" align="center" width="300px">
            <template slot-scope="scope" v-for='item in showList'>{{scope.row.subjectName}}</template>
        </el-table-column>
         <el-table-column property="subjectCode" label="身份证号/组织机构代码" align="center" width="200px">
            <template slot-scope="scope" v-for='item in showList'>{{scope.row.subjectCode}}</template>
        </el-table-column>
         <el-table-column property="subjectShortname" label="核查主体简称（百度专用 |分隔）" align="center" width="300px">
            <template slot-scope="scope" v-for='item in showList'>{{scope.row.websiteName}}</template>
        </el-table-column>
        <el-table-column align="left">
          <template slot="header" slot-scope="scope">
            <span @click="showAll = !showAll" style="cursor: pointer;color:rgb(13, 179, 241);">{{word}}</span>
          </template>
          </el-table-column>
      </el-table>
      	<span slot="footer" class="dialog-footer">
						<el-button type="primary" @click="Continue('form')" :loading="continueDis">继续提交</el-button>
						<el-button @click="handleReturn">返回修改</el-button>
					</span>
    </el-dialog>
    <!-- 在线填写弹出层 -->
        <el-dialog title="在线填写核查主体" :visible.sync="dialogForm" width="1040px" :before-close="handleCloses" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-table :data="showLists" border v-loading="loading"  class="tb-edit" highlight-current-row @row-click="handleCurrentChange" ref="singleTable">
              <el-table-column property="subjectNo" label="序号" width="100px" align="center" prop="subjectNo">
                  <template scope="scope">
                      <div class="el-input el-input--small"><input v-model="scope.row.subjectNo" @keyup="handleClick(scope.row)" type="text" autocomplete="off" maxlength="40" class="el-input__inner"></div>
                      <!-- <el-input size="small" v-model="scope.row.subjectNo" :maxlength="40" @change="handleClick(scope.row)" @input="handleClick(scope.row)" value="val"></el-input> -->
                      <span>{{scope.row.subjectNo}}</span>
                  </template>
              </el-table-column>
              <el-table-column property="subjectName" label="核查主体（公司全称/公司简介/自然人姓名）" align="center" prop="subjectName">
                    <template scope="scope">
                      <el-input size="small" v-model="scope.row.subjectName" :maxlength="40"></el-input>
                      <span>{{scope.row.subjectName}}</span>
                  </template> 
                
              </el-table-column>
              <el-table-column property="subjectCode" label="身份证号/组织机构代码（选填）" align="center" prop='subjectCode'>
                    <template scope="scope" >
                      <el-input size="small" v-model="scope.row.subjectCode" :maxlength="40"></el-input>
                      <span>{{scope.row.subjectCode}}</span>
                  </template> 
              </el-table-column>
              <el-table-column property="subjectShortname" label="核查主体简称（百度专用|分隔）" align="center" prop='subjectShortname'>
                    <template scope="scope" >
                      <el-input size="small" v-model="scope.row.subjectShortname" :maxlength="40"></el-input>
                      <span>{{scope.row.subjectShortname}}</span>
                  </template> 
              </el-table-column>
            </el-table>
            <el-button @click="addDomain()" style="margin-top: 20px">+添加行</el-button>
              <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="handleEdit()">保存</el-button>
                  <!-- <upload class="operates" accept=".xlsx, .xls" :text="btnTexts" @uploadSuccess="fillUpload"></upload> -->
                  <el-button type="danger" @click="dialogForms()">重置</el-button>
              </span>
        
        </el-dialog>


    <el-button type="primary" @click="dialogFormVisible = true" v-if="isShowOperating">创建核查任务</el-button>

    <el-dialog title="创建核查任务" :visible.sync="dialogFormVisible" width="1000px" top="3vh"  :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
      <span class="el-dialog__title" slot="title">创建核查任务
        <!-- <a display="inline-block" class="filter-item" type="text" @click="handleDownload" :class="{ red:changeRed == true}">下载核查主体清单模板</a> -->
      </span>
      <!-- <div class="error">
        <div class="icon">
          <i class="el-icon-warning"></i>
        </div>
          <div class="txt">请勿修改模板名称等模板既有内容，否则无法导入！</div>
      </div> -->
      <el-form :model="form" :rules="rules" :validate-on-rule-change="false" ref="form" vlabel-width="100px" class="demo-ruleForm" v-loading="loading">
        <el-form-item label="核查主体" :label-width="formLabelWidth" style="display: inline-block; vertical-align: middle;">
           <upload class="operate" accept=".xlsx, .xls" :text="btnText" @uploadSuccess="fillUpload" :type="button11"></upload>
        </el-form-item>
         <div class="error" style="width: 40%;display: inline-block;margin-left:25px;vertical-align: super;">
              <div class="icon">
                <i class="el-icon-warning"></i>
              </div>
              <div class="txt">请勿修改模板名称等模板既有内容，否则无法导入！</div>
          </div>
          <el-button type="primary" style="margin-left: 25px;vertical-align: text-bottom;" @click="clickfn">在线填写</el-button>
          <a display="inline-block" class="filter-item" type="text" @click="handleDownload" :class="{ red:changeRed == true}" style="vertical-align: text-top;padding-left: 3%;">下载核查主体清单模板</a>
        <el-form-item label="任务描述" :label-width="formLabelWidth" prop="taskDesc">
          <el-input type="textarea" v-model="form.taskDesc" placeholder="100字以内" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="选取查询站点" :label-width="formLabelWidth">
          <div class="error">
            <div class="icon">
              <i class="el-icon-warning"></i>
            </div>
             <div class="txt" style="width:91%">同一站点下，重复提交相同的核查主体，会导致新的爬取内容覆盖旧的，请谨慎操作！尤其是当前内容已被校验或审核时。</div>
          </div>
          <div v-if="ishow">
            <el-button  style="background: #e34d3b;color: #fff;">重置</el-button>
          </div>
          <el-row v-for="city in myData" :key="city.id">
            <el-checkbox
              :label="city.websiteName"
              :value="city.id"
              @change="checkChange($event,city.id)"
              v-model="checkedWeb"
            ></el-checkbox>
            <!-- :disabled="city.websiteName==='裁判文书网' || city.websiteName==='国家企业信用信息公示系统' || city.websiteName==='国家税务总局'"  置灰 -->
            
            <!-- 百度-->
            <div v-if="city.id==55">
              <el-form-item label="附加关键词" :label-width="formLabelWidth" prop="keyword" :class="{'ss':!baiduForm}">
                <el-input v-model="form.keyword" placeholder="违约|调查|处罚|诉讼|仲裁" @on-keyup="onkeyup($event)" :disabled="!baiduForm"></el-input>
              </el-form-item>
              <el-form-item label="时段" :label-width="formLabelWidth" style="margin-top: 16px;" prop="resource" :class="{'ss':!baiduForm}">
                <el-radio-group v-model="form.resource">
                  <el-radio label="指定时段" @change="timeRadio" style="float:left;padding-top: 9px;" :disabled="!baiduForm"></el-radio>
                   <el-form-item prop="startTime1" style="float:left">
                     <el-date-picker class="date" type="date" prop="startTime1" v-model="form.startTime1" :disabled="form.resource != '指定时段' || !baiduForm" style="margin-right: 17px;" value-format="yyyy-MM-dd" :picker-options="startDatePicker" @change="getstartTime"></el-date-picker>
                   </el-form-item>
                   <el-form-item prop="endTime1" style="float:left">
                     <el-date-picker class="date" type="date" v-model="form.endTime1" value-format="yyyy-MM-dd" prop="endTime1" :disabled="form.resource != '指定时段' || !baiduForm" :picker-options="endDatePicker" @change="getendTime"></el-date-picker>
                   </el-form-item>
                  <el-radio label="近一年" @change="timeRadio" class="radio" style="float:left;padding-top: 9px;width: 35px;" :disabled="!baiduForm"></el-radio>
                  <el-radio label="近三年" @change="timeRadiobaidu" class="radio" style="float:left;padding-top: 9px;" :disabled="!baiduForm"></el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
                <!-- 裁判文书网 -->
            <div v-if="city.id==16">
              <el-form-item label="时段" :label-width="formLabelWidths" prop="resources" :class="{'ss':!bookForm}">
                <el-radio-group v-model="form.resources">
                  <el-radio label="指定时段" @change="RefereeOne" style="float:left;padding-top: 9px;" :disabled="!bookForm"></el-radio>
                   <el-form-item prop="startTime2" style="float:left">
                     <el-date-picker class="date" type="date" prop="startTime2" v-model="form.startTime2" :disabled="form.resources != '指定时段' || !bookForm" style="margin-right: 17px;" value-format="yyyy-MM-dd" :picker-options="pickerOptions0" @change="getstartTime0"></el-date-picker>
                   </el-form-item>
                   <el-form-item prop="endTime2" style="float:left">
                     <el-date-picker class="date" type="date" v-model="form.endTime2" value-format="yyyy-MM-dd" prop="endTime2" :disabled="form.resources != '指定时段' || !bookForm" :picker-options="pickerOptions1" @change="getendTime1"></el-date-picker>
                   </el-form-item>
                  <el-radio label="近一年" @change="RefereeOne" class="radio" style="float:left;padding-top: 9px;width: 35px;" :disabled="!bookForm"></el-radio>
                  <el-radio label="近三年" @change="RefereeTwo" class="radio" style="float:left;padding-top: 9px;" :disabled="!bookForm"></el-radio>
                </el-radio-group>
<!--
                <el-form-item prop="startTime2" style="float:left">
                  <el-date-picker class="date" type="date" v-model="form.startTime2" :disabled="!bookForm" style="margin-right: 17px;" value-format="yyyy-MM-dd" :picker-options="pickerOptions0" @change="getstartTime0"></el-date-picker>
                </el-form-item>
                 <el-form-item prop="endTime2" style="float: right;margin-right: 36%;">
                    <el-date-picker class="date" type="date" v-model="form.endTime2" :disabled="!bookForm" value-format="yyyy-MM-dd" :picker-options="pickerOptions1" @change="getendTime1"></el-date-picker>
                 </el-form-item>
-->
              </el-form-item>
              <el-row class="sele">
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <el-form-item label="案件类型" prop="caseType" :label-width="formLabelWidth" :class="{'ss':!bookForm}">
                      <el-select v-model="form.caseType" placeholder="全部" class="state" :disabled="!bookForm">
                        <el-option label="全部" value='全部'></el-option>
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.name"
                          :value="item.value"
                        ></el-option>

                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <!-- <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <el-form-item label="文书类型" prop="fileType" :label-width="formLabelWidth">
                      <el-select v-model="form.fileType" placeholder="全部" multiple class="state" :disabled="bookForm">
                        <el-option label="全部" value="" style="color: #0ab4f1;font-weight: 600;" class="el-select-dropdown__item selected"></el-option>
                        <el-option
                          v-for="item in optionss"
                          :key="item.value"
                          :label="item.name"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col> -->
              </el-row>
            </div>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="submit()" :loading="disabled">提交</el-button>
        <el-button @click="closeImport('form')">取消</el-button>
      </div>
    </el-dialog>

    <file-download :path="downloadPath" :name="downloadName" @downloadDone="downloadDone"/>
    <!-- 下载文件公用组建，path和name为必传项，分别代表下载路径和下载名称(带扩展名如.xls), downloadDone方法是下载成功后的回调 -->
  </div>
</template>
<script>
import fileDownload from "@/components/download";
import upload from "@/components/upload";
import { downFile } from "@/utils/api";
import { Detailed, download, getWebSite, config } from "@/api/project";
import { constants } from 'crypto';
let rules = {
        keyword: [
          {
            required: true,
            message: "附加字段",
            trigger: "change"
          }
        ],
        resource: [
          {
            required: true,
            message: "请选择指定时间段",
            trigger: "change"
          }
        ],
        resources: [
          {
            required: true,
            message: "请选择指定时间段",
            trigger: "change"
          }
        ],
        startTime1: [
          {
            required: true,
            message: "请填写日期",
            trigger: "change"
          }
        ],
         endTime1:[
           {
            required: true,
            message: "请填写日期",
            trigger: "change"
          }
        ],
        startTime2: [
          {
            required: true,
            message: "请填写日期",
            trigger: "change"
          }
        ],

        endTime2:[
           {
            required: true,
            message: "请填写日期",
            trigger: "change"
          }
        ],
        caseType: [
          {
            required: true,
            message: "请选择案件类型",
            trigger: "change"
          }
        ],
        // fileType: [
        //  {
        //     required: true,
        //     message: "请选择文书类型",
        //     trigger: "change"
        //   }
        // ]
      };

export default {
  name: "messageBox",
  components: {
    upload,
    fileDownload
  },
  props: {
    projectNo: ""
  },
  data() {
    return {
      downloadPath: "", //下载文件的地址
      downloadName: "", //下载文件名称
      rules:{},
      disabled:false,
      continueDis:false,
      changeRed:true,
      bookForm: false,
      baiduForm: false,
      baiduForms:true,
      loading:false,
      gridData: [],
      dialog:false,   //在线填写的弹出层
      dialogForm:false,
      showListSave: [
         {
              subjectNo: '',
              subjectName: '',
              subjectCode:'',
              subjectShortname: '',
              status:1,
              isRead:1
          }, 
          {
              subjectNo: '',
              subjectName: '',
              subjectCode:'',
              subjectShortname: '',
              status:1,
              isRead:1
          },
      ],
      showLists:[
          {
              subjectNo: '',
              subjectName: '',
              subjectCode:'',
              subjectShortname: '',
              status:1,
              isRead:1
          }, 
          {
              subjectNo: '',
              subjectName: '',
              subjectCode:'',
              subjectShortname: '',
              status:1,
              isRead:1
          },
          ],
      btnTexts:'导入',
      dialogTableVisible:false,
      myData: null,
      checkedWeb: [],
      checkedWebId: [],
      errorList: [],
      // flag:true,
      uploadData: {
        projectNo: "",
        taskDesc: "",
      },
      startTime: "",
      endTime: "",
      //百度搜索指定时间
        startDatePicker: {
                disabledDate: (time) => {
                    if (this.form.endTime1 != "") {
                        return time.getTime() >  new Date(this.form.endTime1).getTime();

                }
            },
        },
        endDatePicker: {
            disabledDate: (time) => {
                return time.getTime() < new Date(this.form.startTime1).getTime()- 1*24*60*60*1000;//减去一天的时间代表可以选择同一天;
            },

        },

      //裁判文学网指定时间
        pickerOptions0: {
            disabledDate: (time) => {
                if (this.form.endTime2 != "") {
                    return time.getTime() >  new Date(this.form.endTime2).getTime();

                }
            },
        },
        pickerOptions1: {
            disabledDate: (time) => {
                return time.getTime() < new Date(this.form.startTime2).getTime()- 1*24*60*60*1000;//减去一天的时间代表可以选择同一天;
            },

        },

      dialogFormVisible: false,
      form: {
        keyword: "违约|调查|处罚|诉讼|仲裁",
        startTime: "",
        endTime: "",
        startTime1: "",
        endTime1: "",
        startTime2: "",
        endTime2: "",
        caseType: '全部',//案件类型
        isContainAll: true,
        staffNmae: [],  //存全部的
        resource: "指定时段",
        resources: "指定时段",
       // fileType: [],
        filePath: "",
        projectNo: "",
        taskDesc: "",
       
      },
      btnText:'导入清单',
      button11: 'primary',
      rules: {},
      formLabelWidth: "120px",
      formLabelWidths: "80px",
      ishow: 0,
      options: [
        {
          label: "1",
          value: "刑事案件"
        },
        {
          label: "2",
          value: "民事案件"
        },
        {
          label: "3",
          value: "行政案件"
        },
        {
          label: "4",
          value: "赔偿案件"
        },
        {
          label: "5",
          value: "执行案件"
        }

      ],
      // optionss: [
      //   {
      //     label: "选项1",
      //     value: "判决书"
      //   },
      //   {
      //     label: "选项2",
      //     value: "裁定书"
      //   },
      //   {
      //     label: "选项3",
      //     value: "调解书"
      //   },
      //   {
      //     label: "选项4",
      //     value: "决定书"
      //   },
      //   {
      //     label: "选项5",
      //     value: "通知书"
      //   },
      //   {
      //     label: "选项6",
      //     value: "批复"
      //   },
      //   {
      //     label: "选项7",
      //     value: "答复"
      //   },
      //   {
      //     label: "选项8",
      //     value: "函"
      //   },
      //   {
      //     label: "选项9",
      //     value: "令"
      //   },
      //   {
      //     label: "选项10",
      //     value: "其他"
      //   }
      // ],
      showAll:false,
      isSaved:false,//是否点击了保存按钮
      matterStatus: this.$route.query.status,
    };
  },
  watch: {
    // 字符串传值
    projectNo(val, valOld) {
      //console.log(val,'---',valOld)
      this.uploadData.projectNo = val;
      this.form.projectNo = val;
    }
  },
  mounted() {
    this.websites();
  },
  computed:{
    //点击展开
    showList:function(){
      let errorList = this.errorList;
      let dataArr = [];
      if(this.showAll){
        dataArr = errorList
      }else{
        dataArr = errorList.slice(0, 3)
      }
      return dataArr
    },
    word:function(){
      if(this.showAll == false){　　　　　　　　　　　
        return '展开全部'
      }else{
        return '收起'
      }
    },

     isShowOperating(){
      let status = true;
      if(this.matterStatus == 2){ //事项已完成
        status = false;
      }
      return status;
    }
  },
  methods: {
    downloadDone() {
      //当有下载任务完成时会调用此方法，并将下载文件名称和下载文件地址设置为空，以便下次下载，当downloadPath改变并且不为空时，会下载文件
      this.downloadName = "";
      this.downloadPath = "";
    },
    clickfn(){
      this.dialogForm = true;
     // console.log(this.showLists)
    },
      //追加表格
      addDomain(index) {
          let arr={   
             subjectNo: '',
              subjectName: '',
              subjectCode:'',
              subjectShortname: '',
              status:0
          }
          this.showLists.push(arr)
      },
       handleCurrentChange(row) { 
//          console.log(row)
            
//       alert('3333')
      },
      //保存
      handleEdit(row) {
           this.dialogForm = false;
        this.$refs.singleTable.setCurrentRow(row);
        // 改变数据行状态
        // alert(this.showLists[0].status)
        this.showLists.forEach((v,i)=>{
          v.status=1;
          if(v.isRead==1){
          	//是前两行
//        	console.log(v,'第几'+i+'行')
          	if(v.subjectCode!="" || v.subjectName!="" || v.subjectNo!="" || v.subjectShortname!=""){
          		this.isSaved=true;
//        		alert('被修改过')
          	}
          }
        })
        
        // alert(this.showLists[0].status)
        //console.log(this.showLists)
        //this.dialogForms()
        this.showListSave = JSON.parse(JSON.stringify(this.showLists));
      },
      //重复弹框X关闭
      handle(){
         this.disabled = false
         this.dialogTableVisible=false
      },
      handleCloses(){
        this.disabled = false
        this.dialogForm = false;
        this.showLists = JSON.parse(JSON.stringify(this.showListSave));
        return
         var r = []
         //alert(this.isSaved)
         if(this.isSaved){
         		//前两行修改并保存过
         		r=this.showLists.filter(function (s) {
               let state = false;
               
               for(let i in s) {
                 if(s[i] != ''){
                   state = true
                 }
               }
               console.log(state)
               if(state){
                 return s && s.status==1
               }
              // return s && s.status==1 && (s.subjectCode != '' || s.subjectName != '' || s.subjectNo != '' || s.subjectShortname != '') ; // 注：IE9(不包含IE9)以下的版本没有trim()方法 });
	         })
         }else{
           alert(2)
         		//前两行没有修改
	         	r=this.showLists.filter(function (s,i) {
	         		if(s.isRead==1){
	         			s.subjectCode="";
	         			s.subjectName="";
	         			s.subjectNo="";
	         			s.subjectShortname="";
//	         			console.log(s)
	         		}
	            return s && s.status==1; // 注：IE9(不包含IE9)以下的版本没有trim()方法 });
	         })
         }
           //console.log(r)
           this.showLists=r;
           this.$refs.singleTable.setCurrentRow();
          //去掉所有行的选中状态 current-row
//        console.log(this.$refs.singleTable)
					
        //this.dialogForms()
      },
      //重置
    dialogForms(){
         this.showLists = [
           {subjectNo:'',subjectName:'',subjectCode:'',subjectShortname:'',status:1,isRead:1},
           {subjectNo:'',subjectName:'',subjectCode:'',subjectShortname:'',status:1,isRead:1}
         ]
         this.showListSave = [
           {subjectNo:'',subjectName:'',subjectCode:'',subjectShortname:'',status:1,isRead:1},
           {subjectNo:'',subjectName:'',subjectCode:'',subjectShortname:'',status:1,isRead:1}
         ]
         	this.isSaved=false;
        // this.dialogForm = false;
        


    },
    handleClick(row){
       let subjectNo = row.subjectNo;
       var patrn = /^[0-9]*$/;
       if (!patrn.test(subjectNo)) {
         let no = row.subjectNo.slice(0,row.subjectNo.length-1)
         row.subjectNo = ''
       }
    },
    //百度指定时间
     getstartTime(time) {
          this.startTime1 = time
      },
      getendTime(time) {
          this.endTime1 = time
      },

     //裁判文学网指定时间
      getstartTime0(time) {
          this.startTime2 = time
      },
      getendTime1(time) {
          this.endTime2 = time
      },
    //点击x关闭清空内容
    handleClose(){
     
      this.dialogFormVisible=false
      this.form.taskDesc='';
      this.filePath='';
      this.checkedWeb=''
       location.reload();
       
    },
    //点击取消清空表单
    closeImport(form){
     // this.form.taskDesc='',
      this.$refs[form].resetFields();
      this.dialogFormVisible = false;
       location.reload();
    },

    //判断input
    onkeyup(event){
     // let value = event.target.value
      this.form.keyword=value.replace(/[^\u4E00-\u9FA5]/g,'');
    },
      //百度 近一年
    timeRadio(value){
      this.timeTypes = value;
       if(value == '指定时段'){
         this.baiduForms = false;
        //  let new_rules = JSON.parse(JSON.stringify(rules));
        //  this.rules.startTime1 = new_rules.startTime1;
        //  this.rules.endTime1 = new_rules.endTime1;
          }else if(value == "近一年"){
            let Vm=this;
             this.baiduForms = true;
            //  let new_rules = JSON.parse(JSON.stringify(this.rules));
            //  delete new_rules.startTime1;
            //  delete new_rules.endTime1;
            //  this.rules = new_rules;
             this.$refs['form'].clearValidate(() => {
             //
             });
          let time =  this.latestTime(365)
          this.form.startTime = time[0];
          this.form.endTime = time[1];
          console.log(time,'百度1')

          }

    },
      //百度 近三年
      timeRadiobaidu(value){
      this.timeType = value;
       if(value == '指定时段'){
         this.baiduForms = false;
        //  let new_rules = JSON.parse(JSON.stringify(rules));
        //  this.rules.startTime1 = new_rules.startTime1;
        //  this.rules.endTime1 = new_rules.endTime1;
          }else if(value == "近三年"){
            let Vm=this;
             this.baiduForms = true;
            //  let new_rules = JSON.parse(JSON.stringify(this.rules));
            //  delete new_rules.startTime1;
            //  delete new_rules.endTime1;
            //  this.rules = new_rules;
             this.$refs['form'].clearValidate(() => {
             //
             });
          let time =  this.latestTime(1095)
          this.form.startTime = time[0];
          this.form.endTime = time[1];
          console.log(time,'百度3')

          }

    },
//      //裁判文书网  近一年
      RefereeOne(value){
      this.timeTypeOne = value;
       if(value == '指定时段'){
         this.baiduForms = false;
        //  let new_rules = JSON.parse(JSON.stringify(rules));
        //  this.rules.startTime1 = new_rules.startTime1;
        //  this.rules.endTime1 = new_rules.endTime1;
          }else if(value == "近一年"){
            let Vm=this;
             this.baiduForms = true;
            //  let new_rules = JSON.parse(JSON.stringify(this.rules));
            //  delete new_rules.startTime1;
            //  delete new_rules.endTime1;
            //  this.rules = new_rules;
             this.$refs['form'].clearValidate(() => {
             //
             });
          let time =  this.latestTime(365)
          this.form.startTime = time[0];
          this.form.endTime = time[1];
          console.log(time,'裁判文书1')

          }

    },
        //裁判文书网  近三年
      RefereeTwo(value){
        this.timeTypeTwo = value;
       if(value == '指定时段'){
         this.baiduForms = false;
        //  let new_rules = JSON.parse(JSON.stringify(rules));
        //  this.rules.startTime1 = new_rules.startTime1;
        //  this.rules.endTime1 = new_rules.endTime1;
          }else if(value == "近三年"){
            let Vm=this;
             this.baiduForms = true;
            //  let new_rules = JSON.parse(JSON.stringify(this.rules));
            //  delete new_rules.startTime1;
            //  delete new_rules.endTime1;
            //  this.rules = new_rules;
             this.$refs['form'].clearValidate(() => {
             //
             });
          let time =  this.latestTime(1095)
          this.form.startTime = time[0];
          this.form.endTime = time[1];
          console.log(time,'裁判文书3')

          }

    },
    latestTime(count) {
      // 拼接时间
      const time1 = new Date()
      const time2 = new Date()
      //console.log(time1,'time1')
      if (count === 1) {
        time1.setTime(time1.getTime() - (24 * 60 * 60 * 1000))
      } else {
        if (count >= 0) {
          time1.setTime(time1.getTime())
        } else {
          if (count === -2) {
            time1.setTime(time1.getTime() + (24 * 60 * 60 * 1000) * 2)
          } else {
            time1.setTime(time1.getTime() + (24 * 60 * 60 * 1000))
          }
        }
      }
            //当月的年月日
      const Y1 = time1.getFullYear()       //年
      const M1 = ((time1.getMonth() + 1) > 9 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))     //月
      const D1 = (time1.getDate() > 9 ? time1.getDate() : '0' + time1.getDate())                          //日
      const timer1 = Y1 + '-' + M1 + '-' + D1
//        console.log(Y1,'y1')
//        console.log(M1,'m1')
        console.log(D1,'D1')
        console.log(timer1,'timer1')
        
      time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * count))             //1555234398379
        
     // console.log(time2.getTime() - (24 * 60 * 60 * 1000 * count),'time2')
        
      const Y2 = time2.getFullYear()
      const M2 = ((time2.getMonth() + 1) > 9 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
      const D2 = (time2.getDate() > 9 ? time2.getDate() : '0' + time2.getDate())
      const timer2 = Y2 + '-' + M2 + '-' + D2
//        console.log(Y2,'y2')
//        console.log(M2,'m2')
//        console.log(D2,'D2')
//        console.log(timer2,'timer2')
      return [timer2, timer1]
    },
    checkChange(checked,id) {
      //console.log(checked)  百度
      if(id == "55"){
        if(checked){
         // console.log(checked)
          this.baiduForm = true;
          if(this.bookForm){
            this.baiduForms=false;
          //  let new_rules = JSON.parse(JSON.stringify(rules));
          //  delete new_rules.startTime2;
          //  delete new_rules.endTime2;
          //  delete new_rules.caseType;
          //  delete new_rules.fileType;
          //  this.rules = new_rules;
          }else{
             //this.rules = rules;
          }
        }else{
          this.baiduForm = false;
          this.baiduForms=true;
          this.rules = {};
           this.$refs['form'].clearValidate(() => {
             //
           });
        }

      }
      //裁判文学网
      if(id == "16"){
        if(checked){
          this.bookForm = true;
        }else{
          this.bookForm = false;
          //this.rules = {};
           this.$refs['form'].clearValidate(() => {
             //
           });
        }
      }
      let webId = this.checkedWebId;
      if (webId.length == 0) {
        webId.push(id);
      } else {
        if (webId.indexOf(id) == -1) {
          webId.push(id);
        } else {
          webId.splice(webId.indexOf(id), 1);
        }
      }

    },

    // 网站列表
    websites() {
      getWebSite().then(res => {
        //console.log(res,'ssssssssssssssssssssssssssssss');
        this.myData = res.result;
       
        
      });
    },
    //上传图片
    fillUpload(res) {
      //console.log(res);
      this.button11='';
      this.btnText='已导入';
      //this.btnText.style='color: #0cb3f0!important;border-color: #b6e8fb!important;background-color: #e7f7fe;'
      this.form.filePath = res;
			if (res.code == 0) {
				this.$emit('fillUpload',res.data,file.name)
			} else {
				this.$message({
          type: 'success',
          message:'上传成功！'

				});
			}

    },
    // 下載核查清單模板
    handleDownload() {
       this.changeRed = false;
       this.downloadName = '主体模板.xls';
       this.downloadPath = '/subjectTemplate/download?crawlerBatchId='+this.projectNo;
      // download(this.projectNo).then(res => {
      //     let url = process.env.VUE_APP_BASEURL+'/subjectTemplate/download?crawlerBatchId='+this.projectNo;
      //     var oReq = new XMLHttpRequest();
      //       oReq.open("GET", url, true);
      //       oReq.responseType = "blob";
      //       oReq.onload = function (oEvent) {
      //           var content = oReq.response;

      //           var elink = document.createElement('a');
      //           elink.download = '主体模板.xls';
      //           elink.style.display = 'none';

      //           var blob = new Blob([content]);
      //           elink.href = URL.createObjectURL(blob);

      //           document.body.appendChild(elink);
      //           elink.click();

      //           document.body.removeChild(elink);
      //       };
      //       oReq.send();
      // });
    },


    // 配置核查清單提交
    submit(res, name) {
        // if(this.form.filePath == ""){
        //   this.$message({
        //     type: 'error',
        //     message:'请按照模板规范填写后上传'
        //   });
        //   return false
        // }
        
        let param = [];
        let webId = this.checkedWebId;
        //let subjectList=[];  //在线填写   subjectNo: '', subjectName: '',subjectCode:'', subjectShortname: ''
        if (webId.length > 0) {
          for (let i = 0; i < webId.length; i++) {
            let pam = { websiteId: webId[i] };
            if (webId[i] == "55") {
              //百度
              let subParam;
              if(this.timeTypes=='近一年' || this.timeType=="近三年"){
                subParam = {
                  keyword: this.form.keyword,
                  startTime: this.form.startTime,
                  endTime: this.form.endTime
                };
              }else{
                subParam = {
                  keyword: this.form.keyword,
                  startTime: this.form.startTime1,
                  endTime: this.form.endTime1
                };
              };
               
              pam.configParam = subParam;
            } else if (webId[i] == "16") {
              this.loading = false;
              //裁判文书网
              let caseTypeStr = this.form.caseType;
              if(this.form.caseType == '全部'){
                let caseType = []
                this.options.forEach((v)=>{
                  caseType.push(v.value)
                })
                caseTypeStr = caseType.join('|')
              }
//                let subParam = {
//                caseType: caseTypeStr,
//                startTime: this.form.startTime2,
//                endTime: this.form.endTime2,
//                //fileType: this.form.fileType
//              };
               let subParam;
               if(this.timeTypeOne=='近一年' || this.timeTypeTwo=="近三年"){
                  subParam = {
                        caseType: caseTypeStr,
                        startTime: this.form.startTime,
                        endTime: this.form.endTime,
                        //fileType: this.form.fileType
                      };
                  }else{
                      subParam = {
                        caseType: caseTypeStr,
                        startTime: this.form.startTime2,
                        endTime: this.form.endTime2,
                        //fileType: this.form.fileType
                      }; 
                  }
              
              pam.configParam = subParam;
            }
            // pam.configParam = "";
            param.push(pam);
          }
          if(webId.indexOf('55') >=0){ //选中百度
            this.rules.keyword = rules.keyword
            if(this.form.resource == '近一年' || this.form.resource == '近三年'){
              delete this.rules.startTime1
              delete this.rules.endTime1
            }else{
              this.rules.startTime1 = rules.startTime1
              this.rules.endTime1 = rules.endTime1
            }
          }
          if(webId.indexOf('16') >=0){ //选中裁判文书网
            this.rules.caseType = rules.caseType
              if(this.form.resources == '近一年' || this.form.resources =="近三年"){
                  delete this.rules.startTime2
                  delete this.rules.endTime2
                }else{
                    this.rules.startTime2 = rules.startTime2
                    this.rules.endTime2 = rules.endTime2
                }
              
          }
        }
        //console.log('pam', param)
        let vm = this
        setTimeout(()=>{
          vm.$refs['form'].validate((valid)=>{
            if(valid){
              this.loading = true;
               vm.disabled = true;
              let options = {
                filePath: res,
                webList: JSON.stringify(param),
                subjectList:JSON.stringify(this.showLists),
                filePath: vm.form.filePath,
                projectNo: vm.projectNo,
                taskDesc: vm.form.taskDesc,
              };
              Detailed(options).then(res => {
                 this.loading = false;
                  if (res.code == 0){
                     // console.log(res)
                      if (res.result.errorList && res.result.errorList.length > 0) {
                          vm.errorList = res.result.errorList;
                          vm.dialogTableVisible = true;
                         // console.log(res.result.errorList)
                      } else if(res.result.errorList && res.result.errorList.length == 0) {
                          vm.dialogTableVisible = false;
                          vm.dialogFormVisible=false;
                          vm.Continue()
                      }
                  }else{
                      this.disabled = false
                  }

              })
              .catch(error => {});
            }
          })
        },50)
    },

    //继续提交   config 、、configSure
    Continue(index){
      this.continueDis = false
      this.page = index;
      let self = this;
      let param = [];
      let webId = this.checkedWebId;
      //let subjectList=[];  //在线填写   subjectNo: '', subjectName: '',subjectCode:'', subjectShortname: ''
      if (webId.length > 0) {
          for (let i = 0; i < webId.length; i++) {
            let pam = { websiteId: webId[i] };
            if (webId[i] == "55") {
              //百度
              let subParam;
              if(this.timeTypes=='近一年' || this.timeType=="近三年"){
                subParam = {
                  keyword: this.form.keyword,
                  startTime: this.form.startTime,
                  endTime: this.form.endTime
                };
              }else{
                subParam = {
                  keyword: this.form.keyword,
                  startTime: this.form.startTime1,
                  endTime: this.form.endTime1
                };
              }
              pam.configParam = subParam;
            } else if (webId[i] == "16") {
              //裁判文书网
              let caseTypeStr = this.form.caseType;
              if(this.form.caseType == '全部'){
                let caseType = []
                this.options.forEach((v)=>{
                  caseType.push(v.value)
                })
                caseTypeStr = caseType.join('|')
              }
//              let subParam = {
//                caseType: caseTypeStr,
//                startTime: this.form.startTime2,
//                endTime: this.form.endTime2,
//                //fileType: this.form.fileType
//              };
             let subParam;
           if(this.timeTypeOne=='近一年' || this.timeTypeTwo=="近三年"){
              subParam = {
                    caseType: caseTypeStr,
                    startTime: this.form.startTime,
                    endTime: this.form.endTime,
                    //fileType: this.form.fileType
                  };
              }else{
                  subParam = {
                    caseType: caseTypeStr,
                    startTime: this.form.startTime2,
                    endTime: this.form.endTime2,
                    //fileType: this.form.fileType
                  }; 
              }
              pam.configParam = subParam;
            }
            // pam.configParam = "";
            param.push(pam);
          }
          if(webId.indexOf('55') >=0){ //选中百度
            this.rules.keyword = rules.keyword
            if(this.form.resource == '近一年' || this.form.resource == "近三年"){
              delete this.rules.startTime1
              delete this.rules.endTime1
            }else{
              this.rules.startTime1 = rules.startTime1
              this.rules.endTime1 = rules.endTime1
            }
            
          }
          if(webId.indexOf('16') >=0){ //选中裁判文书网
            this.rules.caseType = rules.caseType
              if(this.form.resources == '近一年' || this.form.resources =="近三年"){
                  delete this.rules.startTime2
                  delete this.rules.endTime2
                 }else{
                     this.rules.startTime2 = rules.startTime2
                     this.rules.endTime2 = rules.endTime2
                 }
          }
        }

      //console.log(param)
      //return false;
      this.$refs['form'].validate((valid)=>{
         if(valid){
           this.loading = true;
             this.continueDis = true
              let options = {
                taskDesc: this.form.taskDesc,
                webList: JSON.stringify(param),
                subjectList:JSON.stringify(this.showLists),
                filePath: this.form.filePath,
                projectNo: this.projectNo
              };
          if(this.errorList.length > 0){
            //return false
          }
          config(options)
            .then(data => {
              this.loading = false;
                if (data.code == 0){

                    this.dialogTableVisible = false;
                    this.dialogFormVisible=false;
                    //this.timeRadio()
                   location.reload();
                } else{
                    this.continueDis = false
                }
            })
            .catch(error => {
              this.continueDis = true
            });
          }
        })
    },
      //返回修改
      handleReturn(){
          this.disabled = false
          this.dialogTableVisible = false
      }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
@import "@/assets/css/varibles.scss";
.ss{
  .el-form-item__label{
    color:#C0C4CC;
  }
}
//在线填写样式
.operates{
     padding-right: 4%;
}
// .el-input__inner{
//     border: none;
//     background: none;
//     text-align: center;
// }
.tb-edit .el-input {
    display: none
}
.tb-edit .current-row .el-input {
    display: block
}
.tb-edit .current-row .el-input+span {
    display: none
}
table tbody tr{
  height: 40px;
}
// .reds{
//     color: #0cb3f0!important;
//     border-color: #b6e8fb!important;
//     background-color: #e7f7fe!important;
// }
.red{
  cursor: pointer;
  color: rgb(10, 180, 241)!important;
  text-decoration: underline!important;
  }
  .filter-item{
  font-size: 12px;
  padding-left: 4%;
  color: #BDBDBF;
  text-decoration: none
  }
.messageBox {
  margin-top: 1rem;
  margin-bottom: 16px;
  .el-checkbox__label {
    text-decoration: underline;
    color: #0ab4f1;
    font-weight: 600;
  }

  .el-button--text {
    text-decoration: underline;
  }
  .sele {
    padding-top: 17px;
  }
  .radio {
    padding-left: 11px;
  }
  .demo-ruleForm {
    margin-top: 10px;
  }

  .error {
    border: 1px solid $danger-color;
    // width: 380px;
    // margin: 5px auto 0;

    .icon {
      background: $danger-color;
      width: 50px;
      text-align: center;
      float: left;

      i {
        color: #fff;
        font-size: 28px;
        line-height: 43px;
      }
    }

    .txt {
      text-align: center;
      color: $danger-color;
      line-height: 43px;
      width: 330px;
      font-size: 14px;
      margin-left: 50px;
    }
  }
  .upload-demo {
    // width: 2.5rem;
    display: inline-block;
    //float: left;
  }
  .Retract{
    margin-top: 15px;
    float: right;
    margin-right: 20%;
    font-weight: 600;
    cursor: pointer;
  }
  a:active {
color: #BDBDBF; /*鼠标按下的颜色变化*/
}
}
</style>
