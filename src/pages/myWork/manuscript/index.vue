<template>
	<div style="position:relative;">
		<el-tabs v-model="tab" class="titleTab" :lazy="true">
			<el-tab-pane label="报告底稿" name="01">
				<report></report>
			</el-tab-pane>
			<el-tab-pane label="过程文件" name="02"></el-tab-pane>
			
		</el-tabs>
		<el-button class="back" type="primary" @click="goBack">返回</el-button>
	</div>
</template>
<script>
import report from './report/index'
export default{
	components:{
		report
	},
	data(){
		return{
			tab:'01'
		}
	},
	methods:{
		goBack(){

		}
	}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/assets/css/varibles.scss';
.back{
	position: absolute;
	right: 0;
	top: 4px;
}
</style>