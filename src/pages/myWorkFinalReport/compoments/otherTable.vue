<template>
  <div class="otherTable">
    <el-table :data="otherData" :show-header="false">
      <el-table-column align="center" prop="sortNo" label="序号" min-width="80"></el-table-column>
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
  </div>
</template>

<script>
import {
  takeSecondTable,
} from '@/api/mywork'

import {
  previewFile, //文件预览
} from "@/utils/api";

export default {
  name: "otherTable",
  components: {},
  props:{
    firstId:{type:String,default:''},//一级的ID
    matterNo:{type:String,default:''},//事项号
  },
  data() {
    return {
      otherData:[],//表格数据
    };
  },
  computed: {},
  watch: {},
  methods: {
    //在线预览
    openNewPage(fileName,filePath){
      previewFile(filePath,fileName)
    },
    //更新表格数据
    updateTableData(firstId,matterNo){
      takeSecondTable(firstId,matterNo).then(res=>{
        console.log(res);
        if(res.code=="0"){
          if(res.result.length>0){
            this.otherData = res.result
          }else{
            this.$emit('setBool',firstId)
          }
        }
      })
    }
  },
  created() {
    if(this.firstId){
      this.updateTableData(this.firstId,this.matterNo)
    }
    // console.log(this.firstId);
    // console.log(this.matterNo);
  },
  mounted() {},
};
</script>
<style lang='scss' scoped>
</style>