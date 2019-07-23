<template>
	<div class="boxItem shadow searchInfo">
		<div class="allTitle">前期法律研究与公开信息检索</div>
		<div class="borderBox" style="margin-right: 120px;">
			<div class="title">
				<div class="fl">
					<i class="iconfont icon-folder"></i>
					相关法规文件
				</div>
				<router-link class="fr var" :to="'/myWork/preveFile/'+projectNo+'?category=00'+'&status='+status">
					查看文件列表&gt;&gt;
				</router-link>
			</div>
			<div class="context">
				<div class="fl">
					<div class="item">
						<span class="fl">文件数</span>
						<span class="fl"><span class="var">{{data.lawCategoryCount}}</span>&nbsp;份</span>
					</div>
					<div class="item">
						<span class="fl">文件大小</span>
						<span class="fl"><span class="var">{{data.lawCategoryFilesize?data.lawCategoryFilesize.toFixed(2):0.00}}</span>&nbsp;MB</span>
					</div>
				</div>
				<div class="fr uploadBox" v-if="status<3">
					<upload-pic accept=".doc,.docx,.xls,.xlsx,.pdf,.png,.bmp,.gif,.jpeg,.jpg,.m4a" @uploadSuccess="fillUpload1">
						<div class="upload">
							<i class="el-icon-plus"></i>
						</div>
					</upload-pic>
					<span>文件上传</span>
				</div>
			</div>
		</div>
		<div class="borderBox">
			<div class="title">
				<div class="fl">
					<i class="el-icon-search"></i>
					前期信息检索文件
				</div>
				<router-link class="fr var" :to="'/myWork/preveFile/'+projectNo+'?category=01'+'&status='+status">
					查看文件列表&gt;&gt;
				</router-link>
			</div>
			<div class="context">
				<div class="fl">
					<div class="item">
						<span class="fl">文件数</span>
						<span class="fl"><span class="var">{{data.searchCategoryCount}}</span>&nbsp;份</span>
					</div>
					<div class="item">
						<span class="fl">文件大小</span>
						<span class="fl"><span class="var">{{data.searchCategoryFilesize?data.searchCategoryFilesize.toFixed(2):0.00}}</span>&nbsp;MB</span>
					</div>
				</div>
				<div class="fr uploadBox" v-if="status<3">
					<upload-pic accept=".doc,.docx,.xls,.xlsx,.pdf,.png,.bmp,.gif,.jpeg,.jpg,.m4a" @uploadSuccess="fillUpload2">
						<div class="upload">
							<i class="el-icon-plus"></i>
						</div>
					</upload-pic>
					<span>文件上传</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import {getFileStatistics,uploadFile} from '@/api/mywork'
import uploadPic from '@/components/upload'
export default{
	props:{
		status:Number,
		projectNo:''
	},
	components: {
		uploadPic
	},
	watch:{
		status(){
			this.init()
		}
	},
	data(){
		return{
			data:{}
		}
	},
	methods:{
		//初始化
		init(){
			getFileStatistics(this.projectNo).then(res=>{
				if(res.code==0){
					this.data=res.result
				}
			})
		},
		fillUpload1(path, name) {
			let options={
				category: '00',
				fileName: name,
				filePath: path,
				projectNo: this.projectNo
			}
			this.upload(options)
		},
		fillUpload2(path, name) {
			let options={
				category: '01',
				fileName: name,
				filePath: path,
				projectNo: this.projectNo
			}
			this.upload(options)
		},
		upload(options){
			uploadFile(options).then(res=>{
				if(res.code==0){
					this.$message({
						type:'success',
						message:'上传成功！'
					})
					this.init()
				}
			})
		}
	},
	mounted(){
		this.init()
	}
}
</script>
<style>

</style>

