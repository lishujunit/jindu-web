<template>
  <div class="tabList">
    <el-dialog title="提醒" :visible.sync="dialogVisible" width="1000px">
      
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="submit()">提交</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "tabList",
  data() {
    return {
    dialogVisible: false,
    }
  },
  
   mounted() {
   
   },
  methods: {
   
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
@import "@/assets/css/varibles.scss";

</style>