<template>
	<div class="progress-bar" v-show="ishsow">
		<p class="p_title">{{title_text}}...</p>
		<span class="close_btn" @click="close"><i class="el-icon-close"></i></span>
		<el-progress 
			:type="type"
			:text-inside='textInside' 
			:percentage="percent" 
			:color="color" 
			:stroke-width='strokeWidth'
		></el-progress>
	</div>
</template>

<script>
	export default {
		name: 'VueProgress',
		watch:{
			percentage(val,val2){
//				console.log(val,val2)
				if(this.percentage>=100){
					this.ishsow=false;
					this.percentage=100;
					this.$emit('closeSuccess',false)
//					return false;
				}
				this.percent=this.percentage;
				
			},
			progressFlag(){
//				console.log(this.ishsow,this.progressFlag)
				this.ishsow=this.progressFlag;
			}
		},
		props: {
			type:{
				type:String,
				default:'line'
			},//进度条类型
			title_text:{
				type:String,
				default:'上传中'
			},//
//			width:'',//环形进度条画布宽度（只在 type=circle 时可用）
			percentage: {
		      type: Number,
		      default: 0
		    }, //百分比（必填）
			color:{
				type:String,
				default:'#fff'
			},//进度条背景色（会覆盖 status 状态颜色）
			strokeWidth:{
				type: Number,
		      	default: 20
			},//进度条的宽度，单位 px
			progressFlag:Boolean
		},
		data(){
			return {
				textInside:true,
				ishsow:false,
				percent:0
			}
		},
		methods:{
			close(){
				this.ishsow=false;
				this.$message({
					type: 'success',
					message: '进程最小化！'
				});
				this.$emit('closeSuccess',false)
			}
		},
		mounted() {
//			console.log(this.percentage,this.progressFlag)
	 		this.percent=this.percentage
	 		this.ishsow=this.progressFlag
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss">
	.progress-bar{
		position: fixed;
		left: 50%;
		top: 50%;
		margin-left: -215px;
		margin-top: -55px;
		z-index: 10000;
		width: 400px;
		padding: 28px;
		background: rgba(62,170,209,0.9);
		box-shadow: 2px 7px 8px rgba(38,166,216,0.5);
		border-radius: 3px;
		.p_title{
			padding-bottom: 24px;
			/*line-height: 40px;*/
			color: #fff;
			font-size: 16px;
		}
		.close_btn{
			position: absolute;
			right: 12px;
			top: 12px;
			color:#3eaad1;
			background: rgba(255,255,255,0.7);
			border-radius: 50%;
			cursor: pointer;
			font-size: 18px;
			/*padding: 2px;*/
			width: 18px;
			height: 18px;
			.el-icon-close{
				position: absolute;
				top: 1px !important;
				left:0px !important;
			}
		}
		.el-progress-bar__inner{
			text-align:center;
			.el-progress-bar__innerText{
				
				color: #4eabcd;
				font-size: 14px;
				font-family: arial;
			}
		}
		.el-progress-bar__outer,.el-progress-bar__inner{
			border-radius: 0px !important;
		}
		.el-progress-bar__outer{
			background: transparent;
			border: 1px solid #fff;
		}
	}
	
</style>