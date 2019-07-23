<template>
  <div class="confirmRelevance">
    <el-row>
      <companySelectMenu :operationAddBtn="false" :operationDelBtn="false" :selectData="selectData" @checkData="checkData"></companySelectMenu>
    </el-row>
    <el-row>
      <dueDiligenceSearch @searchContent="searchContent" @resetSearch="resetSearch" :operations="operations" :fileNames="fileNames" :oldFileNames="oldFileNames" :propertyBool="false">
        <template v-slot:otherSearch>
          <el-row>
            <el-col :span="6">
              <span style="padding-right:1.5%">底稿属性</span>
              <el-autocomplete placeholder="请输入内容" clearable v-model="projectsProperties" :fetch-suggestions="querySearch" style="width:70%" @select="searchContent" @clear="searchContent"></el-autocomplete>
            </el-col>
            <el-col :span="6">
              <span style="margin:0;padding:0;">底稿属性状态 </span>
              <el-select v-model="papersValue" size="mini" @change="papersStatusChange" placeholder="请选择" style="width:40%;">
                <el-option
                  v-for="item in selectList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <span style="padding-right:1.5%">计划属性</span>
              <el-autocomplete placeholder="请输入内容" clearable v-model="papersProperties" :fetch-suggestions="planQuerySearch" style="width:70%" @select="searchContent" @clear="searchContent"></el-autocomplete>
            </el-col>
            <el-col :span="6">
              <span style="margin:0;padding:0;">计划属性状态 </span>
              <el-select v-model="projectValue" size="mini" @change="papersStatusChange" placeholder="请选择" style="width:40%;">
                <el-option
                  v-for="item in selectList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-row> 
        </template>
      </dueDiligenceSearch>
    </el-row>

    <el-row>
      <filesTable :tableData="tableData" :page="page" :pageSize="pageSize">
         <template v-slot:tailing>
           <el-table-column align="center" prop="attributeInfoName" label="底稿属性" min-width="120">
             <template slot-scope="scope">
               <span v-if="!isShowOperating">{{scope.row.manuscriptInfoName}}</span>
              <!-- <el-input v-model="scope.row.attributeInfoName" @blur="updateStatus(scope.row.id,scope.row.attributeInfoName,true)"></el-input> -->
              <el-select
                  v-else
                  v-model="scope.row.manuscriptInfoNames"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择底稿属性"
                  @change="updateStatus(scope.row.id,scope.row.manuscriptInfoNames,true,scope.$index)"
                >
                  <el-option
                    v-for="(item, index) in papeProperties"
                    :key="index"
                    :label="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
             </template>
           </el-table-column>
           <el-table-column align="center" min-width="90" label="状态">
            <template slot-scope="scope">
              <template v-if="scope.row.manuscriptInfoNames.length>0">已关联</template>
              <template v-else>未关联</template>
            </template>
           </el-table-column>
           <el-table-column align="center" prop="planInfoName" label="计划属性" min-width="120">
             <template slot-scope="scope">
               <span v-if="!isShowOperating">{{scope.row.planInfoName}}</span>
              <!-- <el-input v-model="scope.row.planInfoName" @blur="updateStatus(scope.row.id,scope.row.planInfoName,false)"></el-input> -->
              <el-select
                  v-else
                  v-model="scope.row.planInfoNames"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择计划属性"
                  @change="updateStatus(scope.row.id,scope.row.planInfoNames,false,scope.$index)"
                >
                  <el-option
                    v-for="(item, index) in projectProperties"
                    :key="index"
                    :label="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
             </template>
           </el-table-column>
           <el-table-column align="center" min-width="90" label="状态">
            <template slot-scope="scope">
              <template v-if="scope.row.planInfoNames.length>0">已关联</template>
              <template v-else>未关联</template>
            </template>
           </el-table-column>
         </template>
      </filesTable>
      <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
    </el-row>
  </div>
</template>

<script>
import companySelectMenu from "../components/companySelectMenu"
import dueDiligenceSearch from "../components/dueDiligenceSearch"
import filesTable from "../components/filesTable"
import{mapState,mapActions} from 'vuex'

import {
  getCompany,//公司获取
  selectRelationFileAllList,//关联底稿 列表显示
  insertRelationManuscripts,//关联底稿 添加底稿属性
  insertRelationPlanInfoName,//关联底稿 添加计划属性
  changeTime,//时间格式修改
  selectListByAttributeAndMatterNo,//底稿属性
  selectListByManuscriptInfoName,//底稿属性(搜索框)
  selectListByPlanInfoName,//计划属性(搜索框)
  relationPlanInfo,//计划属性
  getAllFileName,//解压文件名称模糊搜索
  getAllOldFileName,//原始资料名称模糊搜索
  
} from "@/api/dueDiligence"

import{
  validationFormat,//底稿格式验证
  validationPlanFormat,//计划属性格式验证
} from '@/utils/validate'

export default {
  name: "confirmRelevance",
  components: {
    companySelectMenu,
    dueDiligenceSearch,
    filesTable
  },
  data() {
    return {
      selectData:[],//选择公司的数据
      uploadTitle:'资料上传',//弹框标题
      accept:'.xls,.xlsx,.png,.bmp,.gif,.jpeg',//上传资料的文件类型
      uploadFileVisible:false,//弹框是否展示
      tableData:[],//表格数据
      allTableData:[],//表格所有数据
      pageTotal:0,//分页个数
      total:0,//总条数
      page:1,//当前页数
      pageSize:20,//每页数据个数
      papersProperties:'',//底稿属性
      projectsProperties:'',//计划属性
      selectList:[
        {
          id:'-1',
          label:'全部'
        },
        {
          id:'01',
          label:'已关联'
        },
        {
          id:'02',
          label:'未关联'
        },
      ],//选择器数据
      papersValue:'-1',//底稿属性的状态选择
      projectValue:'-1',//计划属性的状态选择
      companyAbout: {id:'',companyName:''},//选中的公司
      matterNo:'',//事项号
      papeProperties:[],//所有底稿属性
      papePropertiesArr:[],//所有底稿属性(搜索框)
      projectProperties:[],//所有计划属性
      projectPropertiesArr:[],//所有计划属性(搜索框)
      workUnitId:'',//工作单元id
      fileNames:[],//所有解压资料名称
      oldFileNames:[],//所有原始资料名称
      operations:{
        startFileName: "", //原始资料名称
        unzipFilesName: "", //解压文件名
        beginTime: "", //上传开始时间
        endTime: "", //上传结束时间
        dueDiligenceProperty: "",//尽调清单属性
      },//搜索的对象数据
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
        this.operations.beginTime=''
        this.operations.endTime =''
        this.operations.unzipFilesName=''
        this.operations.startFileName=''
        this.papersProperties=''
        this.projectsProperties=''
        this.papersValue='-1',//底稿属性的重置
        this.projectValue='-1',//计划属性的重置
        this.tabTableData(this.companyAboutData.id,1,10,this.workUnitId)
        this.getAllOldFileNameData(this.companyAboutData.id,this.workUnitId)
        this.getAllFileNameData(this.companyAboutData.id,this.workUnitId)
        this.getProjectProperties()
        this.getPapeProperties()
        this.getSelectListByPlanInfoName()
        this.getSelectListByManuscriptInfoName()
      } else {
        this.tableData = [];
        this.allTableData=[]
      }
    },
    //底稿属性还是计划属性的更新
    updateStatus(id,val,bool,index){
        if(bool){
          let operationBool=true
          val.forEach(item=>{
            if(!validationFormat(item)) operationBool=false
          })
          if(operationBool){
            let value = val.join(',')
            insertRelationManuscripts(id,value).then(res=>{
              if(res.code===0){
                this.searchContent()
                this.getSelectListByManuscriptInfoName()
                this.$message.success('修改成功');
              }else{
                this.searchContent()
                this.getSelectListByManuscriptInfoName()
              }
            })
          }else{
            this.$alert("请按照x.x，x.x-x，x.x-x-x的格式填写该属性(x为数字)", "提示", {confirmButtonText: "确定",type: "warning"});
            this.tableData[index].manuscriptInfoNames = this.allTableData[index].manuscriptInfoNames
          }
        }else{
          let operationBool=true
          val.forEach(item=>{
            if(!validationPlanFormat(item)) operationBool=false
          })
          if(operationBool){
            let value = val.join(',')
            insertRelationPlanInfoName(id,value).then(res=>{
              if(res.code===0){
                this.searchContent()
                this.getProjectProperties()
                this.$message.success('修改成功');
              }else{
                this.searchContent()
                this.getProjectProperties()
              }
            })
          }else{
            this.$alert("请按照 x-x-x，x-x-x-x，x-x-x-x-x 的格式填写该属性(x为数字)", "提示", {confirmButtonText: "确定",type: "warning"});
            this.tableData[index].planInfoNames = this.allTableData[index].planInfoNames
          }
        }
      
    },
    //底稿搜索
    querySearch(queryString, cb) {
      var papePropertiesArr = [...this.papePropertiesArr]
      var results = queryString ? papePropertiesArr.filter(val=>val.value.indexOf(queryString) === 0) : papePropertiesArr;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    //计划属性搜索
    planQuerySearch(queryString, cb) {
      var projectPropertiesArr = [...this.projectPropertiesArr]
      var results = queryString ? projectPropertiesArr.filter(val=>val.value.indexOf(queryString) === 0) : projectPropertiesArr;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    //搜索的内容
    searchContent(){
      this.tabTableData(this.companyAboutData.id,this.page,this.pageSize,this.workUnitId,this.operations.beginTime,this.operations.endTime,this.operations.unzipFilesName,this.operations.startFileName,this.projectsProperties,this.papersProperties)
    },
    //重置
    resetSearch(){
      this.operations.beginTime=''
      this.operations.endTime =''
      this.operations.unzipFilesName=''
      this.operations.startFileName=''
      this.papersProperties=''
      this.projectsProperties=''
      this.papersValue='-1',//底稿属性的重置
      this.projectValue='-1',//计划属性的重置
      this.tabTableData(this.companyAboutData.id,this.page,this.pageSize,this.workUnitId)
    },
    //每页数据个数改变时会触发,返回每页条数
    handleSizeChange(num){
      this.pageSize = num
      this.tabTableData(this.companyAboutData.id,this.page,num,this.workUnitId)
    },
    //当前页数改变时会触发,返回当前页数
    pageChange(val){
      this.page = val
      this.tabTableData(this.companyAboutData.id,val,this.pageSize,this.workUnitId)
    },
    //表格底稿属性选择器选择后筛选表格内容的方法
    papersStatusChange(){
      // console.log(this.papersValue,this.projectValue);
      //初始化
      this.tableData = []
      this.tableData = JSON.parse(JSON.stringify(this.allTableData))
      if(this.papersValue=='-1'&&this.projectValue=='-1'){//都是全部的情况
        this.tableData = JSON.parse(JSON.stringify(this.allTableData))
      }else if(this.papersValue=='-1'&&this.projectValue=='01'){//计划属性是已关联的情况
        this.tableData = this.tableData.filter(val=>val.planInfoName)
      }else if(this.papersValue=='-1'&&this.projectValue=='02'){//计划属性是未关联的情况
        this.tableData = this.tableData.filter(val=>!val.planInfoName)
      }else if(this.papersValue=='01'&&this.projectValue=='-1'){//底稿属性是已关联的情况
        this.tableData = this.tableData.filter(val=>val.manuscriptInfoName)
      }else if(this.papersValue=='01'&&this.projectValue=='01'){//全部是已关联的情况
        this.tableData = this.tableData.filter(val=>val.manuscriptInfoName&&val.planInfoName)
      }else if(this.papersValue=='01'&&this.projectValue=='02'){//底稿属性是已关联,计划属性是未关联的情况
        this.tableData = this.tableData.filter(val=>val.manuscriptInfoName&&!val.planInfoName)
      }else if(this.papersValue=='02'&&this.projectValue=='-1'){//底稿属性是未关联的情况
        this.tableData = this.tableData.filter(val=>!val.manuscriptInfoName)
      }else if(this.papersValue=='02'&&this.projectValue=='01'){//底稿属性是未关联,计划属性是未关联的情况
        this.tableData = this.tableData.filter(val=>!val.manuscriptInfoName&&val.planInfoName)
      }else if(this.papersValue=='02'&&this.projectValue=='02'){//全部是未关联的情况
        this.tableData = this.tableData.filter(val=>!val.manuscriptInfoName&&!val.planInfoName)
      }
    },
    //获取所有底稿属性
    getPapeProperties(){
      selectListByAttributeAndMatterNo(this.companyAboutData.id,this.workUnitId).then(res=>{
        console.log(res);
        if(res.code==0){
          this.papeProperties=[]
          if(res.result.length>0){
            res.result.forEach(item=>{
              if(item%1!==0){
                this.papeProperties.push({value:item})
              }
            })
          }
          // console.log(this.papeProperties);
        }
      })
    },
    //获取所有底稿属性（搜索框）
    getSelectListByManuscriptInfoName(){
      selectListByManuscriptInfoName(this.companyAboutData.id,this.workUnitId).then(res=>{
        console.log(res);
        if(res.code==0){
          this.papePropertiesArr=[]
          if(res.result.length>0&&res.result[0]){
            res.result = res.result[0].split(',')
            res.result.forEach(item=>{
              if(item%1!==0){
                this.papePropertiesArr.push({value:item})
              }
            })
          }
          // console.log(this.papeProperties);
        }
      })
    },
    //获取所有计划属性
    getProjectProperties(){
      relationPlanInfo(this.matterNo).then(res=>{
          console.log(res);
          if(res.code==0){
            this.projectProperties=[]
            if(res.result.length>0){
              res.result.forEach(item=>{
                this.projectProperties.push({value:item})
              })
            }
          }
      })
    },
    //获取所有计划属性（搜索框）
    getSelectListByPlanInfoName(){
      selectListByPlanInfoName(this.companyAboutData.id,this.workUnitId).then(res=>{
        console.log(res);
        if(res.code==0){
          this.projectPropertiesArr=[]
          if(res.result.length>0&&res.result[0]){
            res.result = res.result[0].split(',')
            res.result.forEach(item=>{
              if(item%1!==0){
                this.projectPropertiesArr.push({value:item})
              }
            })
          }
          // console.log(this.papeProperties);
        }
      })
    },
    //获取所有解压文件
    getAllFileNameData(companyId,workUnitId){
      getAllFileName(companyId,workUnitId).then(res=>{
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
    //原始资料名称搜索
    getAllOldFileNameData(companyId,workUnitId){
      getAllOldFileName(companyId,workUnitId).then(res=>{
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
            this.tabTableData(this.companyAboutData.id,this.page,this.pageSize,this.workUnitId)
            this.getAllOldFileNameData(this.companyAboutData.id,this.workUnitId)
            this.getAllFileNameData(this.companyAboutData.id,this.workUnitId)
            this.getProjectProperties()
            this.getPapeProperties()
            this.getSelectListByPlanInfoName()
            this.getSelectListByManuscriptInfoName()
          }else{
            this.loading=false
          }
        }
      })
    },
    //更新数据
    tabTableData(companyId,pagenum,pagesize,workUnitId,beginTime,endTime,fileName,oldFileName,manuscriptInfoName,planInfoName){
      selectRelationFileAllList(companyId,pagenum,pagesize,workUnitId,beginTime,endTime,fileName,oldFileName,manuscriptInfoName,planInfoName).then(res=>{
        console.log(res);
        if(res.code===0){
          this.page = res.result.current
          this.total =Number(res.result.total)
          this.pageTotal = Number(res.result.pages)
          this.pageSize = res.result.size
          let tableAllData = res.result.records
          // console.log(tableAllData);
          for(let i=0;i<tableAllData.length;i++){
            if(tableAllData[i].createTime){
              tableAllData[i].disposeCreateTime = changeTime(tableAllData[i].createTime)
            }
            let manuscriptInfoNameArr = tableAllData[i].manuscriptInfoName.split(',').filter(val=>val&&val.trim())
            tableAllData[i].manuscriptInfoNames=[...manuscriptInfoNameArr]
            let planInfoNameArr = tableAllData[i].planInfoName.split(',').filter(val=>val&&val.trim())
            tableAllData[i].planInfoNames=[...planInfoNameArr]
            if(!tableAllData[i].dataTpye){
              let typeArr = tableAllData[i].oldFileName.split('.')
              tableAllData[i].dataTpye ='.' + typeArr[typeArr.length-1]
            }
            if(!tableAllData[i].fileName&&!tableAllData[i].oldFileName){
              tableAllData.splice(i,1)
              i--
            }
          }
          // console.log(tableAllData);
          this.tableData = JSON.parse(JSON.stringify(tableAllData))
          this.allTableData =JSON.parse(JSON.stringify(tableAllData))
          console.log(this.tableData);
        }
      })
    },
    ...mapActions("dueDiligence", ['setCompanyAboutData'])
  },
  //生命周期 - 创建完成（可以访问当前this实例）
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
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style lang='scss' scoped>
</style>