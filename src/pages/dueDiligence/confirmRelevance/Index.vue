<template>
  <div class="confirmRelevance">
    <el-row>
      <el-col :span="8">
        <companySelectMenu :operationAddBtn="false" :operationDelBtn="false"  :selectData="selectData" :selectBool="selectBool" @checkData="checkData"></companySelectMenu>
      </el-col>
      <el-col :span="8">
        <el-row type="flex" justify="start">
          <el-select v-model="value" placeholder="请选择" style="margin-bottom:20px;" @change="selectResults">
            <el-option v-for="item in optionsValue" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
        </el-row>
      </el-col>
      <el-col :span="8">
        <el-row type="flex" justify="end" v-if="isShowOperating">
          <el-button type="primary" @click="batchSubmit(true,'01')">合格</el-button>
          <el-button type="danger" @click="batchSubmit(false,'02')">不合格</el-button>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <dueDiligenceSearch @searchContent="searchContent" @resetSearch="resetSearch" :operations="operations" :fileNames="fileNames" :oldFileNames="oldFileNames" :dueDiligencePropertiesArr="dueDiligencePropertiesArr"></dueDiligenceSearch>
    </el-row>

    <el-row>
      <filesTable unqualifiedStatue='02' :tableData="tableData" :page="page" :pageSize="pageSize" :selectBool="selectBool" :browseBool="browseBool" @browseFileAbout="browseFileAbout" @checkedChange="checkedChange">
        <!-- 尾部 -->
         <template v-slot:tailing>
           <el-table-column prop="attributeInfoName" align="center" label="尽调清单属性">
             <template slot-scope="scope">
              <el-row>
                <!-- <div @click="changeStatus(scope.row,scope.$index,scope.row.status)" :class="!scope.row.attributeInfoName?'haveHeight':''" style="cursor: pointer;"> -->
                <span v-if="scope.row.status=='01'||scope.row.status=='02'||!isShowOperating">{{scope.row.attributeInfoName}}</span>
                  <!-- <el-autocomplete :fetch-suggestions="querySearch" @select="handleSelect" v-else ref="mark"  v-model="scope.row.attributeInfoName" placeholder="请输入内容" @blur="setThisAtt(scope.row.attributeInfoName,scope.$index,scope.row.id)"></el-autocomplete> -->
                <!-- </div> -->
                <el-select
                  v-model="scope.row.attributeIds"
                  multiple
                  filterable
                  default-first-option
                  placeholder="请选择底稿属性"
                  @change="setThisAtt(scope.row.attributeIds,scope.row.attributeContent,scope.$index,scope.row.id,scope.row.fileType,scope.row)"
                  v-else
                >
                  <el-option
                    v-for="(item, index) in dueDiligenceSelectArr"
                    :key="index"
                    :label="item.value"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-row>
            </template>
           </el-table-column>
           <el-table-column label="状态" align="center">
             <template slot-scope="scope">
               <template v-if="scope.row.status=='00'">待确认</template>
               <template v-else-if="scope.row.status=='01'">合格</template>
               <template v-else-if="scope.row.status=='02'">
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
           <el-table-column label="操作" align="center">
             <template slot-scope="scope">
               <template v-if="scope.row.status=='00'&&isShowOperating">
                 <el-button type="text" size="mini" @click="singleSubmit('01',scope.row.id,scope.row.fileType,true)" style="text-decoration:underline;">合格</el-button>
                 <el-button type="text" size="mini" style="color:red;text-decoration:underline;" @click="singleSubmit('02',scope.row.id,scope.row.fileType,false)">不合格</el-button>
               </template>
               <template v-else-if="scope.row.status=='02'&&isShowOperating">
                 <el-button type="text" size="mini" @click="delFile(scope.row.id,scope.row.fileType)">删除</el-button>
               </template>
             </template>
           </el-table-column>
         </template>
      </filesTable>
      <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
      <common-dialog :options="options1"></common-dialog>
    </el-row>
  </div>
</template>

<script>
import companySelectMenu from "../components/companySelectMenu"
import uploadDialog from "../components/uploadDialog"
import dueDiligenceSearch from "../components/dueDiligenceSearch"
import filesTable from "../components/filesTable"
import commonDialog from '@/components/commonDialog/commonDialog'
import {
  getCompany,
  comfirmRespondent,
  fileBrowseAbout,
  singleUpdateFile,
  batchUpdateFile,
  setAttributeInfoName,
  changeTime,//时间格式修改
  getSelectListByCompanyId,
  delFileData,//删除不合格文件
  getAllFileNameforSix,//解压文件名称模糊搜索(第六七步)
  selectIsOperationByAttribute,//尽调的模糊搜索
  getAllOldFileNameforSix,//原始资料名称模糊搜索(第六七步)
  getSelectFileData,//尽调的模糊搜索（搜索框）
} from "@/api/dueDiligence"
import{mapState,mapActions} from 'vuex'

export default {
  name: "confirmRelevance",
  components: {
    companySelectMenu,
    uploadDialog,
    dueDiligenceSearch,
    filesTable,
    commonDialog
  },
  data() {
    return {
      companyAbout: {id:'',companyName:''},//公司的相关数据
      selectData:[],//选择公司的数据
      value:'-1',//文件是否浏览的下拉框选择值,默认全部
      optionsValue:[
        {
          id:'-1',
          value:'全部'
        },
        {
          id:'00',
          value:'未浏览'
        },
        {
          id:'01',
          value:'浏览未使用'
        },
        {
          id:'02',
          value:'已使用'
        },
        {
          id:'03',
          value:'未浏览已使用'
        },
      ],//下拉框的参数
      tableData:[],//表格数据
      tableAllData:[],//所有数据备份
      selectBool:true,//是否有多选框
      browseBool:true,//是否编辑浏览情况
      pageTotal:0,//分页个数
      total:0,//总条数
      page:1,//当前页数
      pageSize:20,//每页数据个数
      showEdit:[],//尽调显示的输入框
      allSelect:[],//多选框的值
      attributeId:'',//尽调属性ID用于单个提交
      attributeIdArr:[],//尽调属性ID数组用于批量提交
      thisStatus:'',//合格还是不合格的改变状态
      fileType:'',//后台需求的一个字段
      filesTypeArr:[],//后台需求的这个字段的数组
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
      workUnitId:'',//工作单元id
      matterNo:'',//事项号ID
      dueDiligenceProperties:[],//尽调的筛选数据
      fileNames:[],//所有的文件名称
      oldFileNames:[],//原始资料名称
      operations:{
        startFileName: "", //原始资料名称
        unzipFilesName: "", //解压文件名
        beginTime: "", //上传开始时间
        endTime: "", //上传结束时间
        dueDiligenceProperty: "",//尽调清单属性
      },//搜索的对象数据
      attachmentFileArr:[],//附件里文件的ID
      dueDiligenceSelectArr:[],//下拉框选择项
      dueDiligencePropertiesArr:[],//尽调的筛选数据(搜索框)
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
  watch: {},
  methods: {
    //获得公司选中值
    checkData(val) {
      // console.log(val);
      if (val.length > 0) {
        this.setCompanyAboutData(val[0])
        // console.log(this.companyAboutData.id,1,10,this.workUnitId);
        this.operations.dueDiligenceProperty=''
        this.operations.beginTime=''
        this.operations.endTime =''
        this.operations.unzipFilesName=''
        this.operations.startFileName=''
        this.tabTableData(this.companyAboutData.id,1,10,this.workUnitId)
        this.getAllOldFileNameData(this.companyAboutData.id,this.workUnitId)
        this.getAllFileNameData(this.companyAboutData.id,this.workUnitId)
      } else {
        this.tableData = [];
      }
    },
    //获取是否浏览的值
    selectResults(val){
      // console.log(val);
      if(val=="-1"){
        this.tabTableData(this.companyAboutData.id,this.page,this.pageSize,this.workUnitId)
      }else{
        this.tabTableData(this.companyAboutData.id,this.page,this.pageSize,this.workUnitId,'','','','','',val)
      }
    },
    //获取多选框选择
    checkedChange(val){
      // console.log(val);
      this.allSelect =val
    },
    //获取文件浏览状态（已添加fileType）
    browseFileAbout(id,index,fileType,watchOrUse){
      console.log(id,index,fileType);
      if(this.tableData[index].attributeInfoName){
        if(watchOrUse=='03'){
          fileBrowseAbout(id,fileType,'02').then(res=>{
            if(res.code==0){
              this.searchContent()
            }else{
              this.searchContent()
            }
          })
        }
      }else{
        if(watchOrUse=='00'){
          fileBrowseAbout(id,fileType,'01').then(res=>{
            if(res.code==0){
              this.searchContent()
            }else{
              this.searchContent()
            }
          })
        }
      }
    },
    //显示文字还是输入框的方法
    changeStatus(row,index,status){
      if(status==='0'){
        this.$set(this.showEdit,index,false)
        this.$nextTick(function () {
          this.$refs.mark.$el.querySelector('input').focus();
        });
      } 
    },
    //设置尽调清单属性(直接退回已浏览未使用)
    setThisAtt(val,allVal,index,id,fileType,row){
      // console.log(this.dueDiligenceSelectArr)
      // console.log(allVal);//原来所有的尽调属性
      // console.log(val);//当前尽调属性
      //判断是否是可添加的附件的尽调
      let selectData,selectDataValue,attributeArr=[]
      if(val.length>allVal.length){//增加一个尽调id
        val.forEach(item=>{
          if(allVal.filter(rep=>rep.id.indexOf(item)===0).length<1){
            selectData =item
          }
        })
      }else{//减少一个尽调id
        allVal.forEach(item=>{
          if(val.indexOf(item.id)=='-1'){
            selectData = item.id
            if(this.dueDiligenceProperties.filter(rep=>rep.id.indexOf(selectData)===0).length<1){//如果不存在在搜索里放入
              this.dueDiligenceProperties.push(item)//将减少的尽调属性放入这个数组内
            }
          }
        })
      }
      //将当前的尽调的属性值放入一个数组内
      this.dueDiligenceSelectArr.forEach(item=>{
        val.forEach(v=>{
          if(v==item.id){
            attributeArr.push({val:item.value,id:item.id})
          }
        })
        if(selectData===item.id){
          selectDataValue = item.value
        }
      })
      if(selectDataValue){
        if(selectDataValue.split('-').length==3&&this.dueDiligenceProperties.filter(rep=>rep.id.indexOf(selectData)===0).length<1){
          this.tableData = JSON.parse(JSON.stringify(this.tableAllData))
          this.$alert("请勿添加已选择的尽调附件属性", "提示", {confirmButtonText: "确定",type: "warning"});
          return
        }
      }
      //  console.log(attributeArr)
      if(this.dueDiligenceProperties.filter(rep=>rep.id.indexOf(selectData)===0).length>0&&row.status!='01'){
        let allId=[]
        let allValue=[]
        attributeArr.forEach(item=>{
          allId.push(item.id)
          allValue.push(item.val)
        })
        let attributeId = allId.join(',')
        let value = allValue.join(',')
        setAttributeInfoName(value,id,attributeId,fileType).then(res=>{
          if(res.code===0){
            // this.$set(this.showEdit,index,true)
            this.$message.success('修改成功');
            if(this.tableData[index].attributeInfoName){//原来有值的时候
              if(value.length<1){//当前没有值时
                if(row.watchOrUse=='03'){
                  fileBrowseAbout(id,fileType,'00').then(res=>{
                    if(res.code==0){
                      this.searchContent()
                    }else{
                      this.searchContent()
                    }
                  })
                }else if(row.watchOrUse=='02'){
                  fileBrowseAbout(id,fileType,'01').then(res=>{
                    if(res.code==0){
                      this.searchContent()
                    }else{
                      this.searchContent()
                    }
                  })
                }
              }else{
                this.searchContent()
              }
            }else{//原来没有值的时候
              if(value.length>0){//当前有值的时候
                if(row.watchOrUse=='00'){
                  fileBrowseAbout(id,fileType,'03').then(res=>{
                    if(res.code==0){
                      this.searchContent()
                    }else{
                      this.searchContent()
                    }
                  })
                }else if(row.watchOrUse=='01'){
                  fileBrowseAbout(id,fileType,'02').then(res=>{
                    if(res.code==0){
                      this.searchContent()
                    }else{
                      this.searchContent()
                    }
                  })
                }
              }else{
                this.searchContent()
              }
            }
          }else{
            this.searchContent()
          }
        })
      }else{
        this.tableData = JSON.parse(JSON.stringify(this.tableAllData))
        this.$alert("请勿添加已提交的尽调属性", "提示", {confirmButtonText: "确定",type: "warning"});
      }
    },
    //搜索的内容
    searchContent(){
      console.log(this.operations,this.companyAboutData.id,this.workUnitId);
      this.tabTableData(this.companyAboutData.id,this.page,this.pageSize,this.workUnitId,this.operations.dueDiligenceProperty,this.operations.beginTime,this.operations.endTime,this.operations.unzipFilesName,this.operations.startFileName)
    },
    //重置
    resetSearch(){
      this.operations.dueDiligenceProperty=''
      this.operations.beginTime=''
      this.operations.endTime =''
      this.operations.unzipFilesName=''
      this.operations.startFileName=''
      this.tabTableData(this.companyAboutData.id,this.page,this.pageSize,this.workUnitId)
    },
    //单个提交合格或不合格(已添加fileType)
    singleSubmit(status,id,fileType,bool){
      this.attributeId = id
      this.thisStatus = status
      this.fileType = fileType
      console.log(fileType)
      if(bool){
        this.$confirm('是否确认合格并提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          singleUpdateFile(id,fileType,this.thisStatus,this.workUnitId).then(res=>{
            if(res.code===0){
              this.searchContent()
              this.$message.success('提交成功!');
            }else{
              this.searchContent()
            }
          })
        }).catch(() => {
          this.$message.info('已取消提交');          
        });
      }else{
        this.SingleOrBatch = true
        this.options1.dialogFormVisible = true
        this.options1.reasonInput = ''
      }
    },
    //批量提交(已添加fileType)
    batchSubmit(bool,status){
      this.thisStatus = status
      console.log(this.allSelect);
      if(this.allSelect.length>0){
        let setBool= false
        this.tableData.forEach(item=>{
          if(this.allSelect.indexOf(item.id)>-1&&(item.status=='00')){
            setBool = true
          }
        })
        if(setBool){
          let checkedArr = this.allSelect
          this.tableData.forEach(item=>{
            for(let j=0;j<checkedArr.length;j++){
              if(checkedArr[j]===item.id&&(item.status=='01'||item.status=='02')){
                checkedArr.splice(j,1)
                j--
              }
            }
          })
          let filesArr = []
          this.tableData.forEach(item=>{
            checkedArr.forEach(v=>{
              if(v===item.id){
                filesArr.push(item.fileType)
              }
            })
          })
          console.log(filesArr);
          if(bool){
            this.$confirm('是否确认合格并提交?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              batchUpdateFile(checkedArr,filesArr,this.thisStatus,this.workUnitId).then(res=>{
                if(res.code===0){
                  this.searchContent()
                  this.$message.success('提交成功!');
                }else{
                  this.searchContent()
                }
              })
            }).catch(() => {
              this.$message.info('已取消提交');          
            });
          }else{
            this.filesTypeArr = filesArr
            this.attributeIdArr = checkedArr
            this.SingleOrBatch = false
            this.options1.dialogFormVisible = true
            this.options1.reasonInput = ''
          }
        }else{
          this.$alert("仅可提交状态为待确认的项", "提示", {confirmButtonText: "确定",type: "warning"});
        }
      }else{
        this.$alert("您还未选择任何文件", "提示", {confirmButtonText: "确定",type: "warning"});
      }
    },
    //不合格的弹框点击确认后(已添加fileType)
    handleMoreCommit(){},
    handleCommit(){
      if (this.options1.reasonInput == ''){
        this.$message.warning('输入不能为空！')
      }else{
        // console.log(this.options1.reasonInput);
        if(this.SingleOrBatch){
          singleUpdateFile(this.attributeId,this.fileType,this.thisStatus,this.workUnitId,this.options1.reasonInput).then(res=>{
            if(res.code===0){
              this.searchContent()
              this.$message.success('提交成功!');
              this.options1.dialogFormVisible = false
            }else{
              this.searchContent()
            }
          })
        }else{
          batchUpdateFile(this.attributeIdArr,this.filesTypeArr,this.thisStatus,this.workUnitId,this.options1.reasonInput).then(res=>{
            if(res.code===0){
              this.searchContent()
              this.$message.success('提交成功!');
              this.options1.dialogFormVisible = false
            }else{
              this.searchContent()
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
    //删除该文件
    delFile(id,fileType){
      console.log(id,fileType)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delFileData(fileType,id).then(res=>{
          if(res.code==0){
            this.searchContent()
            this.$message.success('提删除成功!');
          }else{
            this.searchContent()
          }
        })
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    //每页数据个数改变时会触发,返回每页条数
    handleSizeChange(num){
      this.pageSize = num
      this.tabTableData(this.companyAboutData.id,this.page,num,this.workUnitId)
    },
    //切换到哪一页
    pageChange(val){
      this.page = val
      this.tabTableData(this.companyAboutData.id,val,this.pageSize,this.workUnitId)
    },
    //提示内容(暂时没有了)
    querySearch(queryString,cb){
      // let screenData = this.dueDiligenceProperties;
      // let results = queryString ? screenData.filter((val)=>{return val.value.indexOf(queryString) === 0}) : screenData;
      // 调用 callback 返回建议列表的数据
      // cb(results);
    },
    //提示选择后执行函数(暂时没有了)
    handleSelect(item){
      // this.setThisAtt()
    },
    //所有解压文件
    getAllFileNameData(companyId,workUnitId){
      getAllFileNameforSix(companyId,workUnitId).then(res=>{
        if(res.code==0){
          this.fileNames=[]
          if(res.result.length>0){
            res.result.forEach(item=>{
              this.fileNames.push({value:item})
            })
          }
          // console.log(this.fileNames)
        }
      })
    },
    //获取所有尽调清单属性
    getPapeProperties(companyId,workUnitId){
      selectIsOperationByAttribute(companyId,workUnitId).then(res=>{
        console.log(res.result);
        if(res.code==0){
          this.dueDiligenceProperties = []
          res.result.forEach(item=>{
            if(item.attribute%1!==0){
              this.dueDiligenceProperties.push({value:item.attribute,id:item.id})
              this.dueDiligenceSelectArr.push({value:item.attribute,id:item.id})
            }
          })
          this.selectDateUniq()
          // console.log(this.dueDiligenceProperties);
        }
      })
    },
    //原始资料名称搜索
    getAllOldFileNameData(companyId,workUnitId){
      getAllOldFileNameforSix(companyId,workUnitId).then(res=>{
        if(res.code==0){
          this.oldFileNames=[]
          if(res.result.length>0){
            res.result.forEach(item=>{
              this.oldFileNames.push({value:item})
            })
          }
          // console.log(this.oldFileNames)
        }
      })
    },
    //尽调模糊查询(搜索框)
    allgetSelectFileData(){
      if(this.companyAboutData){
        getSelectFileData(this.companyAboutData.id,this.workUnitId).then(res=>{
          console.log(res)
          if(res.code==0){
            this.dueDiligencePropertiesArr = []
            res.result.forEach(item=>{
              if(item%1!==0){
                this.dueDiligencePropertiesArr.push({value:item})
              }
            })
          }
        })
      }
    },
    //下拉框去重
    selectDateUniq(){
      for(let i=0;i<this.dueDiligenceSelectArr.length;i++){
        for(let j=i+1;j<this.dueDiligenceSelectArr.length;j++){
          if(this.dueDiligenceSelectArr[i].value==this.dueDiligenceSelectArr[j].value&&this.dueDiligenceSelectArr[i].id==this.dueDiligenceSelectArr[j].id){
            this.dueDiligenceSelectArr.splice(j,1)
            j--
          }
        }
      }
    },
    //初始化数据
    initTableData(){
      getCompany(this.workUnitId).then(res=>{
        if(res.code===0){
          this.selectData = res.result
          //传入公司Id给下面这个方法获取表单数据this.companyAboutData.id
          if(!this.companyAboutData.id){
            this.setCompanyAboutData(this.selectData[0])
            if(!this.companyAboutData){
              this.setCompanyAboutData(this.companyAbout)
            }
          }
          if(this.companyAboutData.id){
            // console.log(this.companyAboutData.id,this.page,this.pageSize,this.workUnitId);
            this.tabTableData(this.companyAboutData.id,this.page,this.pageSize,this.workUnitId)
            this.getAllOldFileNameData(this.companyAboutData.id,this.workUnitId)
            this.getAllFileNameData(this.companyAboutData.id,this.workUnitId)
            this.allgetSelectFileData()
          }else{
            this.loading=false
          }
        }
      })
    },
    //更新数据
    tabTableData(companyId,pagenum,pagesize,workUnitId,attributeInfoName,beginTime,endTime,fileName,oldFileName,watchOrUse){
      // console.log(companyId);
      comfirmRespondent(companyId,pagenum,pagesize,workUnitId,attributeInfoName,beginTime,endTime,fileName,oldFileName,watchOrUse).then(res=>{
        console.log(res);
        if(res.code===0){
          this.page = res.result.current
          this.total =Number(res.result.total)
          this.pageTotal = Number(res.result.pages)
          this.pageSize = res.result.size
          let tableAllData = res.result.records
          for(let i=0;i<tableAllData.length;i++){
            if(tableAllData[i].createTime){
              tableAllData[i].disposeCreateTime = changeTime(tableAllData[i].createTime)
            }
            if(tableAllData[i].auditorTime){
              tableAllData[i].auditorTime = changeTime(tableAllData[i].auditorTime)
            }
            if(tableAllData[i].status=='0'){
              tableAllData[i].status='00'
            }
            //分割尽调名称
            let attributeInfoNameArr = tableAllData[i].attributeInfoName.split(',').filter(val=>val&&val.trim())
            let attributeIdArr = tableAllData[i].attributeId.split(',').filter(val=>val&&val.trim())
            tableAllData[i].attributeInfoNames=[...attributeInfoNameArr]
            tableAllData[i].attributeIds = [...attributeIdArr]
            let attributeContent=[]
            for(let j=0;j<attributeInfoNameArr.length;j++){
              if(attributeInfoNameArr[j].split('-').length==3){
                this.attachmentFileArr.push({value:tableAllData[i].attributeInfoNames[j],id:tableAllData[i].id})
              }
            }
            for(let z=0;z<attributeIdArr.length;z++){
              if(attributeInfoNameArr.length>0&&attributeIdArr.length>0){
                attributeContent.push({value:tableAllData[i].attributeInfoNames[z],id:attributeIdArr[z]})
                if(tableAllData[i].status!='01'){
                  this.dueDiligenceSelectArr.push({value:tableAllData[i].attributeInfoNames[z],id:attributeIdArr[z]})
                }
              }
            }
            tableAllData[i].attributeContent =[...attributeContent]
            //切割文件后缀名
            if(!tableAllData[i].dataTpye){
              let typeArr = tableAllData[i].oldFileName.split('.')
              tableAllData[i].dataTpye ='.' + typeArr[typeArr.length-1]
            }
            //没有文件名和原始资料名的删除掉
            if(!tableAllData[i].fileName&&!tableAllData[i].oldFileName){
              tableAllData.splice(i,1)
              i--
            }
          }
          for(let i=0;i<tableAllData.length;i++){
            for(let j=i+1;j<tableAllData.length;j++){
              if(tableAllData[i].id===tableAllData[j].id){
                tableAllData.splice(j,1)
                j--
              }
            }
          }
          this.selectDateUniq()
          this.getPapeProperties(this.companyAboutData.id,this.workUnitId)
          this.tableData = JSON.parse(JSON.stringify(tableAllData))
          this.tableAllData = JSON.parse(JSON.stringify(tableAllData))
          for(let i = 0; i < this.tableData.length; i ++) {
              this.showEdit[i] = true;
          }
        }
      })
    },
    ...mapActions('dueDiligence',['setCompanyAboutData'])
  },
  created() {
    if(this.$route.params.id){
      this.workUnitId = this.$route.params.id
    }else if(this.$route.query.id){
      this.workUnitId = this.$route.query.id
    }else{
      this.$router.go(-1)
    }
    this.matterNo = this.$route.query.matterNo
    this.initTableData()
  },
  mounted() {}
};
</script>
<style lang='scss' scoped>
.haveHeight{
  height:2.7em;
}
</style>