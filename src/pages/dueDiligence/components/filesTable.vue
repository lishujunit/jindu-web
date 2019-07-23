<template>
  <div class="filesTable">
    <el-table :data="tableData" style="width: 100%" border @selection-change="checkedChange" :row-class-name="tableRowClassName" cell-class-name="tableCell" :max-height="getHeight">
      <el-table-column  type="selection" align="center" min-width="50" v-if="selectBool"></el-table-column>
      <el-table-column type="index" align="center" :index="indexMethod" label="序号" width="80"></el-table-column>
      <el-table-column prop="oldFileName" align="center" label="原始资料名称">
        <template slot-scope="scope">
          <div v-if="scope.row.oldFileName.length<=14">
            <span>{{scope.row.oldFileName}}</span>
          </div>
          <el-tooltip class="item" effect="dark" :content="scope.row.oldFileName" placement="top-start" v-else>
            <div style="width:100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
              <span>{{scope.row.oldFileName}}</span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="dataTpye" align="center" label="文件类型" min-width="80"></el-table-column>
      <el-table-column prop="userName" align="center" label="上传者"></el-table-column><!-- 需修改 -->
      <el-table-column prop="disposeCreateTime" align="center" label="上传时间" min-width="90"></el-table-column>
      <el-table-column prop="dataSize" align="center" label="文件大小" min-width="80">
        <template slot-scope="scope">
          <span>{{scope.row.dataSize}}KB</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="解压文件名称" min-width="100">
        <template slot-scope="scope">
          <el-row>
            <el-tooltip class="item" effect="dark" :content="scope.row.fileName" placement="top-start" v-if="scope.row.fileName.length>12">
              <el-button type="text" @click="openNewPage(scope.row.fileName,scope.row.fileUrl,scope.row.id,scope.$index,scope.row.viewPath,scope.row.fileType,scope.row.watchOrUse)" style="width:100%;overflow: hidden;text-overflow: ellipsis;text-decoration:underline;">
                <img v-if="scope.row.flag==='Y'" :src="imgPath" alt="加密文件" style="width:10px;">
                {{scope.row.fileName}}</el-button>
            </el-tooltip>
            <el-button v-else type="text" @click="openNewPage(scope.row.fileName,scope.row.fileUrl,scope.row.id,scope.$index,scope.row.viewPath,scope.row.fileType,scope.row.watchOrUse)" style="width:100%;overflow: hidden;text-overflow: ellipsis;text-decoration:underline;">
              <img v-if="scope.row.flag==='Y'" :src="imgPath" alt="加密文件" style="width:10px;">
              {{scope.row.fileName}}</el-button>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column align="center" label="文件描述">
        <template slot-scope="scope">
          <div v-if="scope.row.dataDescribe.length<=12">
            <span>{{scope.row.dataDescribe}}</span>
          </div>
          <el-tooltip class="item" effect="dark" :content="scope.row.dataDescribe" placement="top-start" v-else>
            <div style="width:100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
              <span>{{scope.row.dataDescribe}}</span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <slot name="tailing">尾部</slot>
    </el-table>
  </div>
</template>

<script>
import {previewFile} from "@/utils/api"
export default {
  name: "filesTable",
  components: {},
  props:{
    tableData:{type:Array,default() {return [];}},//表格数据
    page:{type:Number,default:1},//当前页码
    pageSize:{type:Number,default:0},//每页条数
    selectBool:{type:Boolean,default:false},//每页条数
    browseBool:{type:Boolean,default:false},//每页条数
    unqualifiedStatue:{type:String,default:'10000'}//不合格的状态值
  },
  data() {
    return {
      imgPath:require('@/assets/images/dueDiligence/encryption.png'),
      checkedDataArr:[],
      getHeight:0,
    };
  },
  methods: {
    //自动增加序号
    indexMethod(index) {
      // console.log(index);
      let curpage = this.page //单前页码，具体看组件取值
      let limitpage = this.pageSize //每页条数，具体是组件取值
      return index + 1 + (curpage - 1) * limitpage;
    },
    //文件预览
    openNewPage(fileName,filePath,id,index,urlIp,fileType,watchOrUse){
      let name =fileName.split('.')[0]
      filePath = urlIp +  filePath
      console.log(filePath,name);
      previewFile(filePath,name)
      if(this.browseBool){
        this.$emit('browseFileAbout',id,index,fileType,watchOrUse)
      }
    },
    //获取多选的ID
    checkedChange(val) {
      console.log(val);
      if(this.selectBool){
        this.checkedDataArr =[]
        val.forEach(item => {
          this.checkedDataArr.push(item.id)
        });
        this.$emit('checkedChange',this.checkedDataArr)
        }
    },
    //有不合格的行数的样式
    tableRowClassName({row}){
      // console.log(this.unqualifiedStatue);
      // console.log(row.status);
      if(row.status===this.unqualifiedStatue){
        return 'warnResult'
      }else{
        return ''
      }
    },
    //获取表格高度
    getTableHeight(){
        this.getHeight=window.innerHeight-560;
    },
  },
  created() {
      window.addEventListener('resize', this.getTableHeight);
      this.getTableHeight()
  },
   mounted: function() {
    this.getTableHeight()
  },
  destroyed(){
      window.removeEventListener('resize', this.getTableHeight)
  },
};
</script>
<style lang='scss'>
  .el-table tr.warnResult {
    background: #FFC;
    position: relative;
    td {
      border-bottom-color: #EC395A;
      border-top: 1px solid #EC395A;
      &:first-child {
        border-left: 1px solid #EC395A;
      }
      &:last-child {
        border-right: 1px solid #EC395A;
      }
    }
}
</style>
