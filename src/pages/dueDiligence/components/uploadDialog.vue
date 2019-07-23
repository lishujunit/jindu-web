<template>
  <div class="uplaodDialog">
    <el-dialog :title="uploadTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="closeDialog" @open="openDialog">
      <div style="width:100%;display:flex;justify-content: flex-start">
        <span style="width:10%;display:inline-block;line-height:30px;margin-right:0px;">文件选择</span>
        <el-upload
          ref="upload"
          :action="action"
          :accept="accept"
          :before-upload="beforeUpload"
          :on-success="filesUploadSuccess"
          :on-error="uploadError"
          :on-change="setBtnName"
          :on-remove="setBtnName"
          :on-progress="uploadProgress"
          :multiple="false"
          :limit="2"
          :auto-upload="false"
          :file-list="fileList"
          style="width:90%;"
        >
          <el-button slot="trigger" size="small" type="primary">{{btnText}}</el-button>
        </el-upload>
      </div>
      <div style="margin:20px 0;display:flex;justify-content: flex-start" v-if="encryptionBool">
        <el-checkbox v-model="encryption">加密</el-checkbox>
        <span>
          <i class="el-icon-warning" style="color:red;"></i> 请谨慎选择
        </span>
      </div>
      <div style="margin-top:20px;display:flex;justify-content: flex-start">
        <span style="width:10%;display:inline-block;line-height:30px;margin-right:0px;">文件描述</span>
        <el-input v-model="fileDescription" maxlength="20" placeholder="请输入内容" style="width:50%;"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="allDataUpload">上 传</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <progressbar
      :percentage="precent"
      :progressFlag="progressFlag"
      @closeSuccess="closeSuccess"
    ></progressbar>
  </div>
</template>

<script>
import { MessageBox } from "element-ui";
import progressbar from "@/components/progressBar/index";
export default {
  name: "uplaodDialog",
  components: {
    progressbar
  },
  props:{
    uploadTitle:{type:String,default:''},//弹框标题
    accept:{type:String,default:""},//文件的后缀名，即格式
    encryptionBool:{type:Boolean,default:false},//是否需要加密按钮，默认没有加密按钮
    uploadFileVisible:{type:Boolean,default:false},//弹框是否展示，默认不展示
    fileSize:{type:Number,default:500},//文件大小,默认500M
  },
  data() {
    return {
      action:'',//上传的地址
      fileDescription:"",//描述的内容
      encryption:false,//加密的多选框是否选中
      uploadType:'',//上传的文件的类型
      dialogVisible:false,//对话框是否展示
      fileList:[],//初始化上传的文件数组
      btnText:'浏览',//按钮文字
      precent: 0,//百分比
      progressFlag:false,//是否关闭进度条
    };
  },
  watch: {
    uploadFileVisible:function(val,oldval){
      this.dialogVisible=val
    },
  },
  methods: {
    //初始化百分比
    closeSuccess(flag) {
      this.progressFlag = flag;
      if (this.precent == 100) {
        this.precent = 0;
      }
    },
    //计算百分比
    uploadProgress(event, file, fileList){
      console.log(event);
      if(event.percent)this.precent=parseFloat(event.percent.toFixed(2))
    },
    //上传文件改变时
    setBtnName(file, fileList){
      console.log(fileList);
      this.fileList = fileList
      if(fileList.length>1){
        fileList.splice(0,1)
      };
      if(fileList.length>0){
        this.btnText = '已选择'
      }else{
        this.btnText = '浏览'
      }
    },
    //上传前
    beforeUpload(file){
      console.log(file);
      let list= file.size / 1024 / 1024 < this.fileSize;
      let accepts = this.accept.replace(/\s+/g, "").split(",");
      let name = file.name;
      let format = name.slice(name.lastIndexOf(".")).toLowerCase();
      this.uploadType = format
      if (accepts.length) {
        if (accepts.indexOf(format) == -1) {
          MessageBox.alert("请上传" + this.accept + "格式的文件", "提示", {
            type: "warning",
            confirmButtonText: "确定",
            callback: () => {}
          });
          return false;
        }
      }
      if (!list) {
        MessageBox.alert("上传的文件不能超过"+this.fileSize+"MB", "提示", {
          type: "warning",
          confirmButtonText: "确定",
          callback: () => {}
        });
        return false;
      }
      if(this.precent>0 && this.precent<100){
        var that=this;
        if(!that.progressFlag){
          MessageBox.confirm('当前进程还未结束,已上传'+this.precent+'%,是否显示当前进程', "提示", {
              type: "warning",
              confirmButtonText: "确定",
              cancelButtonText: '取消',
            }).then(()=>{
              that.progressFlag=true;
            }).catch(() => {
	            //return false;
            })
        }else{
          this.$message,info('一次只能上传一个文件');
        }
        return false;
      }else{
        this.progressFlag=true;
      }
    },
    //上传成功返回函数
    filesUploadSuccess(res, file, fileList){
      if (res.code == 0) {
        //成功后返回上传路径，名字，文件描述的内容，上传的文件类型，加密按钮选择
        this.dialogVisible = false
				this.$emit('filesUploadSuccess',res.data,file.name,this.fileDescription,this.uploadType,this.encryption)
			} else {
				this.$alert(res.msg, '提示', {
					confirmButtonText: '确定',
          type: 'error',
          callback: () => {}
				});
      }
    },
    //上传错误返回函数
    uploadError(err, file, fileList){
      this.progressFlag=false;
			this.$alert('上传失败', '提示', {
				confirmButtonText: '确定',
        type: 'error',
        callback: () => {}
			});
    },
    //点击确认的方法
    allDataUpload(){
      if(this.fileList.length===0){
        this.$alert('请选择要上传的文件', '提示', {
          confirmButtonText: '确定',
          type: 'error',
          callback: () => {}
        });
      }else if(!this.fileDescription){
        this.$alert('请输入文件描述', '提示', {
          confirmButtonText: '确定',
          type: 'error',
          callback: () => {}
        });
      }else{
        this.$refs.upload.submit();
      }
    },
    //对话框关闭
    closeDialog(){
      this.$emit('closeDialog')
    },
    clearThisFiles(){},
    //打开对话框 初始化数据
    openDialog(){
      this.fileList =[]
      this.fileDescription = ''
      this.encryption = false
      this.btnText = '浏览'
    }
  },
  created() {
  
  },
  mounted() {
    this.action = process.env.VUE_APP_UPLOAD
  },
};
</script>
<style lang='scss' scoped>
</style>