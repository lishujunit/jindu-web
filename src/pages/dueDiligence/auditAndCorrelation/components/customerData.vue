<template>
  <div class="customerData">
    <el-row>
      <companySelectMenu :operationAddBtn="false" :operationDelBtn="false" :selectData="selectData" @checkData="checkData"></companySelectMenu>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start">
          <el-button v-if="isShowOperating" type="primary" @click="setInitUpload">上传资料</el-button>
          <el-button v-if="isShowOperating" type="primary" @click="setInitAllUpload">整包上传资料</el-button>
          <uploadDialog :uploadTitle="uploadTitle" :accept="accept" :uploadFileVisible="customerDataUploadFileVisible" @filesUploadSuccess="allDataUploadSuccess" @closeDialog='closeDialog'></uploadDialog>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <dueDiligenceSearch @searchContent="searchContent" @resetSearch='resetSearch' :operations="operations" :fileNames="fileNames" :oldFileNames="oldFileNames" :dueDiligencePropertiesArr="dueDiligencePropertiesArr"></dueDiligenceSearch>
    </el-row>

    <el-row>
      <filesTable :tableData="tableData" :page="page" :pageSize="pageSize"  v-loading="loading" unqualifiedStatue='02'>
        <template v-slot:tailing>
          <el-table-column label="状态" align="center" min-width="60">
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
          <el-table-column align="center" label="尽调清单属性" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.status=='01'||!isShowOperating">{{scope.row.attributeInfoName}}</span>
              <el-select
                v-else
                v-model="scope.row.attributeIds"
                multiple
                filterable
                default-first-option
                placeholder="请选择底稿属性"
                @change="setThisAtt(scope.row.attributeIds,scope.row.attributeContent,scope.$index,scope.row.id,scope.row.fileType,scope.row)"
              >
                <el-option
                  v-for="(item, index) in dueDiligenceSelectArr"
                  :key="index"
                  :label="item.value"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
        </template>
      </filesTable>
      <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
    </el-row>
  </div>
</template>

<script>
import companySelectMenu from "../../components/companySelectMenu";
import uploadDialog from "../../components/uploadDialog";
import dueDiligenceSearch from "../../components/dueDiligenceSearch";
import filesTable from "../../components/filesTable"
import{mapState,mapActions} from 'vuex'
import {
  getCompany,
  getAuditCustomerData,
  setAttributeInfoName,
  uploadFileOnCustomer,
  getSelectListByCompanyId,
  changeTime,
  getAllFileNameforSix,//解压文件名称模糊搜索(第六七步)
  selectListByAttributeAndMatterNo,//尽调的模糊搜索
  getAllOldFileNameforSix,//原始资料名称模糊搜索(第六七步)
  selectDueDiligenceListByAttribute,//尽调模糊查询，第六步专用
  getSelectFileData,//尽调的模糊搜索（搜索框）
  allFileDataUpload,//整包上传资料
} from "@/api/dueDiligence"
import { log } from 'util';

export default {
  name: "customerData",
  components: {
    companySelectMenu,
    uploadDialog,
    dueDiligenceSearch,
    filesTable
  },
  data() {
    return {
      selectData:[],//选择公司的数据
      companyAbout:{id:'',companyName:''},//选中公司的相关数据
      uploadTitle:'上传资料',//上传资料的名称
      customerDataUploadFileVisible:false,//上传资料的模块显示隐藏
      accept:'.doc, .docx, .xls, .xlsx, .pdf,.png,.bmp,.gif,.jpeg,.jpg,.m4a',//上传的格式,.zip
      page:1,//当前页数
      pageTotal:0,//总分页的数量
      pageSize:20,//每页数据的个数
      total:0,//总条数
      tableData: [],//表格数据
      tableAllData: [],//所有数据备份
      showEdit:[],//点击出现选择框
      workUnitId:'',//工作单元id
      loading:false,//加载动画
      dueDiligenceProperties:[],//尽调的筛选数据
      dueDiligenceSelectArr:[],//下拉框选择项
      fileNames:[],//所有的文件名称
      oldFileNames:[],//原始资料名称
      operations:{
        startFileName: "", //原始资料名称
        unzipFilesName: "", //解压文件名
        beginTime: "", //上传开始时间
        endTime: "", //上传结束时间
        dueDiligenceProperty: "",//尽调清单属性
      },//搜索的对象数据
      matterNo:'',//事项号id
      attachmentFileArr:[],//附件里文件的ID
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
      if (val.length > 0) {
        this.setCompanyAboutData(val[0])
        this.operations.dueDiligenceProperty=''
        this.operations.beginTime=''
        this.operations.endTime =''
        this.operations.unzipFilesName=''
        this.operations.startFileName=''
        this.getAllOldFileNameData(this.companyAboutData.id,this.workUnitId)
        this.getAllFileNameData(this.companyAboutData.id,this.workUnitId)
        this.resetSearch()
      } else {
        this.tableData = [];
      }
    },
    //初始化设置上传
    setInitUpload(){
      this.uploadTitle='上传资料'
      this.accept='.doc, .docx, .xls, .xlsx, .pdf,.png,.bmp,.gif,.jpeg,.jpg,.m4a'
      if(this.companyAboutData.id){
        this.customerDataUploadFileVisible = true
      }else{
        this.$alert("请选择公司后上传文件", "提示", {confirmButtonText: "确定",type: "warning"});
      }
    },
    //初始化整包设置上传
    setInitAllUpload(){
      this.uploadTitle='整包资料上传'
      this.accept='.zip'
      if(this.companyAboutData.id){
        this.customerDataUploadFileVisible = true
      }else{
        this.$alert("请选择公司后上传文件", "提示", {confirmButtonText: "确定",type: "warning"});
      }
    },
    //关闭对话框之后
    closeDialog(){
      this.customerDataUploadFileVisible = false
    },
    //上传成功
    allDataUploadSuccess(resData,fileName,fileDescription,uploadType){
      console.log(uploadType)
      if(uploadType=='.zip'){
        allFileDataUpload(resData,fileName,fileDescription,uploadType,false,this.workUnitId,this.companyAboutData.id).then(res=>{
          if(res.code===0){
              this.resetSearch()
              this.$message.success("上传成功");
            }else{
              this.resetSearch()
            }
        })
      }else{
        uploadFileOnCustomer(this.companyAboutData.id,fileDescription,fileName,resData,this.workUnitId)
          .then(res=>{
            if(res.code===0){
              this.resetSearch()
              this.$message.success("上传成功");
            }else{
              this.resetSearch()
            }
          })
      }
    },
    //搜索返回的值附给当页的值
    searchContent(){
      // console.log(this.operations);
      this.updateTableData(this.companyAboutData.id,this.page,this.pageSize,this.workUnitId,this.operations.dueDiligenceProperty,this.operations.beginTime,this.operations.endTime,this.operations.unzipFilesName,this.operations.startFileName)
    },
    //重置
    resetSearch(){
      this.operations.dueDiligenceProperty=''
      this.operations.beginTime=''
      this.operations.endTime =''
      this.operations.unzipFilesName=''
      this.operations.startFileName=''
      this.updateTableData(this.companyAboutData.id,this.page,this.pageSize,this.workUnitId)
    },
    //切换到哪一页
     pageChange(val){
      this.page = val
      this.searchContent()
    },
    //切换每页多少条数据
    handleSizeChange(val){
      this.pageSize = val
      this.searchContent()
    },
    //显示文字还是输入框的方法（修改，暂用下拉框，即没有这种样式）
    changeStatus(row,index){
      // this.$set(this.showEdit,index,false)
      // this.$nextTick(function () {
      //   this.$refs.mark.$el.querySelector('input').focus();
      // });
    },
    //设置尽调清单属性(已完成)（增加了判断是否附件里的文件被选择的属性）
    setThisAtt(val,allVal,index,id,fileType,row){//分别为新数据id，原始数据，哪一行，文件id，文件的fileType
      // console.log(this.dueDiligenceSelectArr)
      // console.log(allVal);
      // console.log(val);
      //判断是否是可添加的附件的尽调
      let selectData,selectDataValue,attributeArr=[]
      if(val.length>allVal.length){//增加一个尽调
        val.forEach(item=>{
          if(allVal.filter(rep=>rep.id.indexOf(item)===0).length<1){
            selectData =item
          }
        })
      }else{//减少一个尽调
        allVal.forEach(item=>{
          if(val.indexOf(item.id)=='-1'){
            selectData = item.id
            if(this.dueDiligenceProperties.filter(rep=>rep.id.indexOf(selectData)===0).length<1){//如果不存在在搜索里放入
              this.dueDiligenceProperties.push(item)//将减少的尽调属性放入这个数组内
            }
          }
        })
      }
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
      //  console.log(attributeArr)
      //  console.log(selectDataValue)
      if(selectDataValue){
        if(selectDataValue.split('-').length==3&&this.dueDiligenceProperties.filter(rep=>rep.id.indexOf(selectData)===0).length<1){
          this.tableData = JSON.parse(JSON.stringify(this.tableAllData))
          this.$alert("请勿添加已选择的尽调附件属性", "提示", {confirmButtonText: "确定",type: "warning"});
          return
        }
      }
      if(this.dueDiligenceProperties.filter(rep=>rep.id.indexOf(selectData)===0).length>0&&row.status!='01'){
        let allId=[]
        let allValue=[]
        attributeArr.forEach(item=>{
          allId.push(item.id)
          allValue.push(item.val)
        })
        let attributeId = allId.join(',')
        let value = allValue.join(',')
        // console.log(attributeId,value)
        setAttributeInfoName(value,id,attributeId,fileType).then(res=>{
          if(res.code===0){
            //数据是添加且是附件里的文件，将删除，其他情况需要添加的话在上面的步骤里
            if(selectDataValue.split('-').length==3&&val.length>allVal.length){
              for(let i=0;i<this.dueDiligenceProperties.length;i++){
                if(this.dueDiligenceProperties[i].id==selectData){
                  this.dueDiligenceProperties.splice(i,1)
                  i--
                }
              }
            }
            console.log(this.dueDiligenceProperties)
            this.tableAllData[index].attributeContent = [...attributeArr]
            this.tableAllData[index].attributeIds = [...allId]
            this.tableData = JSON.parse(JSON.stringify(this.tableAllData))
            this.$message.success('修改成功');
            // this.searchContent()
            // this.getPapeProperties(this.companyAboutData.id,this.workUnitId)
          }else{
            this.searchContent()
          }
        })
      }else{
        this.tableData = JSON.parse(JSON.stringify(this.tableAllData))
        this.$alert("请勿添加已提交的尽调属性", "提示", {confirmButtonText: "确定",type: "warning"});
      }
    },
    //所有解压文件
    getAllFileNameData(companyId,workUnitId){
      getAllFileNameforSix(companyId,workUnitId).then(res=>{
        // console.log(res)
        if(res.code==0){
          this.fileNames=[]
          if(res.result.length>0){
            res.result.forEach(item=>{
              this.fileNames.push({value:item})
            })
          }
        }
      })
    },
    //获取所有尽调清单属性
    getPapeProperties(companyId,workUnitId){
      selectDueDiligenceListByAttribute(companyId,workUnitId).then(res=>{
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
          console.log(this.dueDiligenceProperties);
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
          // console.log(this.selectData);
          //获取这个公司下的所有清单 后需要改，暂时公司ID为1
          if(!this.companyAboutData.id){
            this.setCompanyAboutData(this.selectData[0])
            if(!this.companyAboutData){
              this.setCompanyAboutData(this.companyAbout)
            }
          }
          if(this.companyAboutData.id){
            this.updateTableData(this.companyAboutData.id,this.page,this.pageSize,this.workUnitId)
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
    updateTableData(companyId,pagenum,pagesize,workUnitId,attributeInfoName,beginTime,endTime,fileName,oldFileName){
      getAuditCustomerData(companyId,pagenum,pagesize,workUnitId,attributeInfoName,beginTime,endTime,fileName,oldFileName).then(res=>{
        if(res.code===0){
          console.log(res);
          this.page = res.result.current
          this.total =Number(res.result.total)
          this.pageTotal = Number(res.result.pages)
          this.pageSize = res.result.size
          let tableAllData = res.result.records
          this.attachmentFileArr=[]
          this.dueDiligenceSelectArr=[]
          for(let i=0;i<tableAllData.length;i++){
            if(tableAllData[i].createTime){
              tableAllData[i].disposeCreateTime = changeTime(tableAllData[i].createTime)
            }
            if(tableAllData[i].auditorTime){
              tableAllData[i].auditorTime = changeTime(tableAllData[i].auditorTime)
            }
            //分割尽调名称
            let attributeInfoNameArr = tableAllData[i].attributeInfoName.split(',').filter(val=>val&&val.trim())
            // console.log(attributeInfoNameArr)
            let attributeIdArr = tableAllData[i].attributeId.split(',').filter(val=>val&&val.trim())
            // console.log(attributeIdArr)
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
                  this.dueDiligenceSelectArr.push({value:attributeInfoNameArr[z],id:attributeIdArr[z]})
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
          console.log(this.dueDiligenceSelectArr)
          this.getPapeProperties(this.companyAboutData.id,this.workUnitId)
          this.tableData = JSON.parse(JSON.stringify(tableAllData))
          this.tableAllData = JSON.parse(JSON.stringify(tableAllData))
          // console.log(this.tableData);
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
    // console.log(this.workUnitId);
    this.matterNo = this.$route.query.matterNo
    this.initTableData()
  },
  mounted() {
  }
};
</script>
<style lang='scss' scoped>
.haveHeight{
  height:2.7em;
}
</style>
