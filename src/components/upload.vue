<template>
	<div>
		<el-upload
		    ref="upload"
		    class="upload-demo"
		    :accept="accept"
		    :action="action"
		    :show-file-list="false"
		    :before-upload="beforeUpload"
		    :on-success="uploadSuccess"
		    :on-error="uploadError"
		    :on-progress="uploadProgress"
		    :headers="headers"
		    :data="data"
		    :disabled="isabled"
		  >
		    <el-button v-if="text" size="small" :type="type" :disabled="isabled">{{text}}</el-button>
		    <slot v-else></slot>
		</el-upload>
		<progressbar :percentage="precent" :progressFlag="progressFlag" @closeSuccess="closeSuccess"></progressbar>

	</div>
</template>
<script>
import { MessageBox } from "element-ui";
import progressbar from '@/components/progressBar/index'
export default {
	components:{
		progressbar
	},
	props: {
		type: '',
		text: '',
		data: {},
		accept: '',//上传文件格式限制，格式为: '.jpeg, .gif, .xls'
		uploadType: String,
		fileSize: {
	      type: Number,
	      default: 500
	    }, //上传文件大小,单位(MB)
		isabled:{
			type:Boolean,
			default:false
		},//上传组件是否禁用
	},
	data() {
		return {
			progressFlag:false,
			action: '',
			headers: {},
			precent:0,
			progress_text:'',
			progress_type:'',
			fileList:[],
			imgsFormat:['.png','.bmp','.gif','.jpeg'],
			docFormat:['.doc','.docx','.xls','.xlsx','.pdf'],
			videoFormat:['.mp4'],
			zipFormat:['.zip'],
			format:'',
		}
	},
	methods: {
		closeSuccess(flag){
			this.progressFlag=flag;
			if(this.precent==100){
				this.precent=0;
			}
//			this.precent=0;
		},
		uploadProgress(event, file, fileList){

			if(event.percent)this.precent=parseFloat(event.percent.toFixed(2))
	},

		beforeUpload(file) {
			console.log(file);
			  this.progress_text=file.name;
			  const fileSize = this.fileSize;
		      const isLt500M = file.size / 1024 / 1024 < fileSize;
		      const accepts = this.accept.replace(/\s+/g, "").split(",");
		      const name = file.name;
		      const format = name.slice(name.lastIndexOf(".")).toLowerCase();
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
		      if (!isLt500M) {
		        MessageBox.alert("上传的文件不能超过" + fileSize + "MB", "提示", {
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
	//		         	return false;
			         })
	        	}else{
					this.$message({
							type: 'info',
							message: '一次只能上传一个文件'
					});
	        	}

		          return false;
	        }else{
	        	this.progressFlag=true;
	        }



		},
		// beforeUpload(file) {

		// 	let accepts = this.accept.replace(/\s+/g, "").split(',');
		// 	let name = file.name
		// 	let format = name.slice(name.lastIndexOf(".")).toLowerCase();
		// 	console.log(format)
		// 	if (this.accept == 'image/*') {
		// 		if (!/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test(format)) {
		// 			this.$alert('请上传图片！', '提示', {
		// 				type: "warning",
		// 				confirmButtonText: "确定",
		// 				callback: () => {}
		// 			})
		// 			return false
		// 		}


		// 	}else{
		// 		if (accepts.length) {
		// 			if (accepts.indexOf(format) == -1) {
		// 				MessageBox.alert('请上传' + this.accept + '格式的文件', "提示", {
		// 					type: "warning",
		// 					confirmButtonText: "确定",
		// 					callback: () => {}
		// 				});
		// 				return false
		// 			}
		// 		}
		// 	}

		// },
		//上传成功
		uploadSuccess(res, file, fileList) {
			if (res.code == 0) {
				this.$emit('uploadSuccess', res.data, file.name, this.uploadType)
			} else {
				this.$alert(res.msg, '提示', {
					confirmButtonText: '确定',
					type: 'error',
					callback: action => {}
				});
			}
		},
		uploadError(err, file, fileList) {
			this.progressFlag=false;
			this.$alert('上传失败', '提示', {
				confirmButtonText: '确定',
				type: 'error',
				callback: action => {}
			});
		},
		IsInArray(arr,val){
			var flag=false;
			arr.forEach(item => {
				if(item.name==val){
					flag=true;
				}
			});
			return flag;
		},
		removeInArray(arr,val){
			var testStr=','+arr.join(",")+",";
			var index=testStr.indexOf(","+val+",");
			arr.splice(index,1);
		}
	},
	mounted() {
		this.action = process.env.VUE_APP_UPLOAD
	}
}
</script>
<style rel="stylesheet/scss" lang="scss">
@import '@/assets/css/varibles.scss';

.upload-demo {
	position:relative;
	.el-upload {
		width: 100%;

		.el-button {
			width: 100%;
		}
	}
	.el-upload-list{
		position:absolute;
		z-index: 999;
	}
}
.modal-bg{
	position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
}
.z_index{
	z-index: 10000;
}
.modal-loadding{
	position: fixed;
    top: 50%;
    left: 50%;
    /*width: 400px;*/
    height: 50px;
    /*background: red;*/
    margin-left: -200px;
    margin-top: -25px;
    .progress_icon{
    	padding-right: 5px;
    	font-size:30px;
    	color: #fff;
    }
    .progress_label{
    	padding-right: 10px;
    	line-height: 28px;
    	font-size: 18px;
    	color: #fff;
    }
    .progress_box{
    	width: 360px;
    	margin-top: 6px;
    	/*position: relative;
    	.el-progress__text{
    		position: absolute;
    		right:0px;
    		width: 80px;
    		text-align: left;
    	}
    	.el-progress-bar{
    		margin-right: -80px;
    	}*/
    	.el-progress-bar__innerText{
    		color: #333;
    	}
    }
    .closebtn{
    	height: 30px;
    	line-height: 30px;
    	width: 30px;
    	text-align: center;
    	font-size: 18px;
    	font-weight: bold;
    	color: #fff;
    	margin-left: 20px;
    	.okicon{
    		background: #0cb3f0;
    		border-radius: 50%;
    		width: 20px;
    		height: 20px;
    		line-height: 20px;
    	}
    	.el-icon-close{
    		display: none;
    		width: 20px;
    		height: 20px;
    		border-radius: 50%;
    		cursor: pointer;
    	}

    }
    .closebtn2{
    	height: 30px;
    	line-height: 30px;
    	width: 30px;
    	text-align: center;
    	font-size: 18px;
    	font-weight: bold;
    	color: #fff;
    	margin-left: 20px;
    	.el-icon-close{
    		cursor: pointer;
    	}
    }
}
</style>
