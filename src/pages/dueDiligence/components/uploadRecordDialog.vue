<template>
  <div class="uploadRecordDialog">
    <el-dialog title="整包上传记录" :visible.sync="dialogVisible" @close="closeDialog">
      <el-table :data="tableData" style="width: 100%;" border :max-height="300" cell-class-name="tableCell">
        <el-table-column type="index" align="center" label="序号" width="80"></el-table-column>
        <el-table-column property="fileName" align="center" label="压缩包名称"></el-table-column>
        <el-table-column property="creatDate" align="center" label="上传时间"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "uploadRecordDialog",
  components: {},
  props:{
    gridData:{type:Array,default:()=>[]},
    uploadRecordVisible:{type:Boolean,default:false},//弹框是否展示，默认不展示
  },
  data() {
    return {
      tableData:[],//表格数据
      tableAllData:[],//表格数据
      dialogVisible:false,//对话框是否展示
    };
  },
  watch: {
    gridData:function(val,oldval){
      this.tableData = JSON.parse(JSON.stringify(val))
      this.tableAllData =JSON.parse(JSON.stringify(val))
    },
    uploadRecordVisible:function(val,oldval){
      this.dialogVisible=val
    }
  },
  methods: {
    //自动增加序号
    indexMethod(index) {
      // console.log(index);
      // let curpage = this.page //单前页码，具体看组件取值
      // let limitpage = this.pageSize //每页条数，具体是组件取值
      // return index + 1 + (curpage - 1) * limitpage;
    },
    //弹框关闭时
    closeDialog(){
      this.$emit('closeDialog')
    }
  },
  created() {
      this.tableData = JSON.parse(JSON.stringify(this.gridData))
      this.tableAllData =JSON.parse(JSON.stringify(this.gridData))
  },
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>