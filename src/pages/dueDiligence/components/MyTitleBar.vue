<template>
	<div class="box">
		<div class="line fl"></div>
		<div class="title fl">{{attachmentName}}</div>
		<div class="tabViewBox fl" v-if="tabViewBtn">
			<span :class="tabViewBtnStatus?'active':''" style="line-height: 28px;cursor: pointer;" @click="tabStatus('customer')">客户资料</span>
			<span style="padding:0 10px;">|</span>
			<span :class="tabViewBtnStatus?'':'active'" style="line-height: 28px;cursor: pointer;" @click="tabStatus('due')">尽调清单</span>
		</div>
		<div class="fr">
			<el-button type="primary" v-if="colAboutBtn&&isShowOperating" @click="saveBtn">保存</el-button>
			<el-button type="primary" @click="goBack">返回</el-button>
		</div>
	</div>
</template>
<script>
import { mapActions,mapState } from 'vuex'
import {
	addAttachmentHeader,
	addAttachmentHeaderOnTow
} from "@/api/dueDiligence";
export default {
	computed: {
		isShowOperating(){
      let status = true;
      if(this.matterStatus == 2){ //事项已完成
        status = false;
      }
      return status;
    },
		...mapState('dueDiligence', ['colAboutBtn','tabViewBtn','tabViewBtnStatus','attachmentName','thisDueId','contentName','attachmentId','twoJumpIn'])
	},
	watch:{
    $route(to,from){
			console.log(to.path.split('/')[3])
			if(to.path.split('/')[3]=='customerData'){
				this.setTabViewBtnStatus(true)
			}else if(to.path.split('/')[3]=='dueDiligenceChecklist'){
				this.setTabViewBtnStatus(false)
			}
  },
	},
	data() {
		return {
			matterStatus: this.$route.query.status,
		}
	},
	methods:{
		//返回上一页
		goBack(){
			this.$emit('goBack')
		},
		//有保存按钮时，保存的功能
		saveBtn(){
			if(this.contentName&&this.colAboutBtn){
				console.log(this.attachmentId,this.thisDueId,this.contentName,this.twoJumpIn)
				if(this.twoJumpIn){
					addAttachmentHeaderOnTow(this.attachmentId,this.thisDueId,this.contentName).then(res=>{
						if(res.code===0){
							this.$message.success( "修改成功");
							this.goBack()
						}else{
							this.goBack()
						}
					})
				}else{
					addAttachmentHeader(this.attachmentId,this.thisDueId,this.contentName).then(res=>{
						if(res.code===0){
							this.$message.success( "修改成功");
							this.goBack()
						}else{
							this.goBack()
						}
					})
				}
			}
		},
		//有切换视图时，切换的功能
		tabStatus(val){
			if(val==='customer'){
				this.setTabViewBtnStatus(true)
				this.$router.push({
					name: "customerData",
					query:this.$route.query
				});
			}else if(val==='due'){
				this.setTabViewBtnStatus(false)
				this.$router.push({
					name: "dueDiligenceChecklist",
					query:this.$route.query
				});
			}
			
		},
		...mapActions("dueDiligence", ['setTabViewBtnStatus','setTwoJumpIn'])
	},
	created(){
		let routerPath = this.$route.path
		routerPath = routerPath.split('/')[3]
		if(routerPath=='customerData'){
			this.setTabViewBtnStatus(true)
		}else if(routerPath=='dueDiligenceChecklist'){
			this.setTabViewBtnStatus(false)
		}
	}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/assets/css/varibles.scss';

.box {
	overflow: hidden;

	.title {
		color: $txt-color;
		font-size: 16px;
		line-height: 28px;
		position: relative;
		font-weight: 600;
	}

	.line {
		content: '';
		width: 5px;
		height: 28px;
		background-color: $global-color;
		margin-right: 8px;
	}
	.tabViewBox{
		margin-left:2%;
	}
	.active{
		color:$global-color;
		border-bottom:.5px solid $global-color;
		
	}
}
</style>
