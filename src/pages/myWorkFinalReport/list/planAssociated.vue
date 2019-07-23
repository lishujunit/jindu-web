<template>
  <div class="planAssociated">
    <div class="bg tab-box">
      <!-- <el-button type="primary" class="fr" @click="mulCheck">提交审核</el-button> -->
      <el-tabs class="tabText" v-model="activeId" @tab-click="changeTab">
        <el-tab-pane v-for="(item,index) in webSites" :label="item.name" :name="item.id" :key="item.id">
          <span class="dbl" :class="{'has':item.isClick}" slot="label" @dblclick="gotoLink(item,index)">{{item.name}}</span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%" border ref="refTable" class="netTable" :row-key="getRowKeys" :expand-row-keys="expands" @expand-change="expandChange">
         <el-table-column align="center" prop="sortNo" label="序号" min-width="80">
           <template slot-scope="scope">
            <div class="curPoint" @click="secondListExpand(scope.row)" v-if="scope.row.expand">
              <i style="font-weight: 600" :class="{'el-icon-arrow-down':!scope.row.countCheck,'el-icon-arrow-up':scope.row.countCheck}"></i>
              {{scope.row.sortNo}}
            </div>
            <div v-else>
              {{scope.row.sortNo}}
            </div>
          </template>
         </el-table-column>
         <el-table-column type="expand" width="1" class="expandBtn">
          <template slot-scope="scope" v-if="scope.row.expand">
            <otherTable :firstId="scope.row.id" :matterNo="materId" @setBool="setBool"></otherTable>
          </template>
        </el-table-column>
         <el-table-column align="center" prop="name" label="一级书面核验文件清单/其他核查手段" :show-overflow-tooltip="true"></el-table-column>
         <el-table-column align="center" prop="implFlag" label="是否取得/实施" :show-overflow-tooltip="true"></el-table-column>
         <el-table-column align="center" prop="implFlagComment" label="说明与备注" :show-overflow-tooltip="true"></el-table-column>
         <el-table-column align="center" prop="fileSource" label="文件来源" :show-overflow-tooltip="true"></el-table-column>
         <el-table-column align="center" prop="fileSourceComment" label="说明与备注" :show-overflow-tooltip="true"></el-table-column>
         <el-table-column align="center" prop="verification" label="核验要求" :show-overflow-tooltip="true"></el-table-column>
         <el-table-column align="center" prop="verificationComment" label="说明与备注" :show-overflow-tooltip="true"></el-table-column>
         <el-table-column align="center" label="文档">
           <template slot-scope="scope">
            <el-row v-if="scope.row.fileName">
              <el-tooltip class="item" effect="dark" :content="scope.row.fileName" placement="top-start" v-if="scope.row.fileName.length>12">
                <el-button type="text" @click="openNewPage(scope.row.fileName,scope.row.filePath)" style="width:100%;overflow: hidden;text-overflow: ellipsis;text-decoration:underline;">
                  {{scope.row.fileName}}</el-button>
              </el-tooltip>
              <el-button v-else type="text" @click="openNewPage(scope.row.fileName,scope.row.filePath)" style="width:100%;overflow: hidden;text-overflow: ellipsis;text-decoration:underline;">
                {{scope.row.fileName}}</el-button>
            </el-row>
            <el-row v-else></el-row>
          </template>
         </el-table-column>
      </el-table>
      <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
    </div>
  </div>
</template>

<script>
import otherTable from "../compoments/otherTable"
import {
  bookMarksByMatterNo,
  takeFirstTable,
  takeSecondTable,
} from '@/api/mywork'

import {
  previewFile, //文件预览
} from "@/utils/api";
import { truncate } from 'fs';
export default {
  name: "planAssociated",
  components: {
    otherTable
  },
  props:{
    materId:{type:String,default:''},
    projectNo:{type:String,default:''},
    clickBool:{type:Boolean,default:false},
  },
  data() {
    return {
      webSites:[],//标签数据
      tableData:[],//当前表格数据
      tableAllData:[],//表格总数据
      activeId:'',//标签ID
      getRowKeys(row){
        return row.setIndex
      },
      expands:[],
      pageTotal:0,//分页个数
      total:0,//数据总量
      page:1,//当前页数
      pageSize:20,//当前页的数据量
    };
  },
  computed: {},
  watch: {
    clickBool:function(val,oldval){
      console.log(val)
      if(val){
        this.initBookMark()
      }
    }
  },
  methods: {
    //展开项打开或关闭会执行
    expandChange(row, expandedRows) {
        console.log(row)
        if (expandedRows.indexOf(row) > -1) row.countCheck = true
        else row.countCheck = false
    },
    secondListExpand(val){
        this.$refs.refTable.toggleRowExpansion(val)
        // console.log(val)
    },
    //双击标签页执行
    gotoLink(val){
      console.log(val);
      this.activeId = val.id
      this.updateTableData(this.activeId,this.materId)
    },
    //点击标签页执行
    changeTab(val){
      console.log(val.name);
      this.activeId = val.name
      this.updateTableData(this.activeId,this.materId)
    },
    //如果没有数据，关闭下拉框(未成功)
    setBool(firstId){
      // this.tableData.forEach(item=>{
      //   if(item.id===firstId&&item.expand === true){
      //     this.$set(item,'expand',false)
      //     this.$message.warning('抱歉，该属性没有下拉序号');
      //   }
      // })
    },
    //在线预览
    openNewPage(fileName,filePath){
      previewFile(filePath,fileName)
    },
    //分页改变时
    pageChange(val){
      // console.log(val);
      this.page = val
      this.tableData = []
      for(let i=(this.page-1)*this.pageSize;i<this.page*this.pageSize;i++){
        if(i<this.tableAllData.length){
          this.tableData.push(this.tableAllData[i])
        }
      }
    },
    //分页数据量改变时
    handleSizeChange(val){
      this.pageSize = val
      this.pageTotal = Math.ceil(this.total/this.pageSize)
      this.pageChange(1)
    },
    //初始化页签
    initBookMark(){
      bookMarksByMatterNo(this.materId).then(res=>{
        console.log(res);
        if(res.code=='0'){
          this.webSites = res.result
          if(this.webSites.length>0){
            this.activeId = this.webSites[0].id
            console.log(this.webSites);
            this.updateTableData(this.activeId,this.materId)
          }
        }
      })
    },
    //更新表格数据
    updateTableData(bookMarkId,matterNo){
      takeFirstTable(bookMarkId,matterNo).then(res=>{
        // console.log(res);
        if(res.code=='0'){
          this.tableAllData = res.result
          for(let i=0;i<this.tableAllData.length;i++){
            this.tableAllData[i].expand = true
            this.tableAllData[i].setIndex = i
            if(i<(this.tableAllData.length-1)){
              if(this.tableAllData[i].id===this.tableAllData[i+1].id){
                this.tableAllData[i].expand = false
              }
            }
          }
          this.total = this.tableAllData.length
          this.pageTotal = Math.ceil(this.total/this.pageSize)
          this.pageChange(1)
        }
      })
    }
  },
  created() {
    
  },
  mounted() {},
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/assets/css/varibles.scss";
.tab-box {
  margin-top: 20px;
  margin-bottom: 15px;
  height: 42px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);

  .tabText {
    margin-right: 160px;
    margin-top: 0;

    .el-tabs__header {
      margin: 0;
    }
  }
  .el-button--small {
    margin-top: 6px;
    margin-right: 20px;
  }
}
.tabtext{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.red{
  cursor: pointer;
  color: #BDBDBF!important;
  text-decoration: none!important;
  }
  .reds{
  cursor: pointer;
  color: #BDBDBF!important;
  text-decoration: none!important;
  }
.btn{
  color: #0cb3f0;
   cursor: pointer;
  text-decoration: underline;
  .checked{
    color: #BDBDBF;
    text-decoration: underline;
  }
}
a.under.isClick {
color: #bdbdbd !important; /*连接访问的颜色变化*/
}
</style>
<style lang="scss">
  .netTable{
    .el-table__expand-column{
      .cell{
        display: none;
      }
    }
  }
  .curPoint{
    cursor: pointer;
  }
</style>
