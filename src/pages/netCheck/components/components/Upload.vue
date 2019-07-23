<template>
  <div class="Upload">
   <el-upload
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  list-type="picture">
  <el-button size="small" type="primary">导入清单</el-button>
  <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
</el-upload>
  </div>
</template>
<script>
export default {
  name:'Upload',
  data() {
    return {
    
    };
  },
  methods: {
   handleRemove(filePath, fileList) {
        console.log(filePath, fileList);
      },
      handlePreview(filePath) {
        console.log(filePath);
      }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
@import "@/assets/css/varibles.scss";
.Upload{
    width: 3rem;
}


</style>