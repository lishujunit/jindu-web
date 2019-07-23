<template>
	<div>
		<!--<div class="box">-->
			<!--<p class="line"></p>-->
			<!--<p class="title">人工检索内部截图库</p>-->
			<!--<el-button type="primary" v-if="show" class="fr" @click="goBack">返回</el-button>-->
		<!--</div>-->
		<!--<title-bar @goBack="goBack"></title-bar>-->
		<router-view></router-view>

	</div>
</template>
<script>
export default {
    data(){
        return{
            show:false,
		}
	},
	mounted(){
        this.show =this.$store.state.netCheck.backBtn
		// console.log(this.show)
	},
	methods: {
		//返回
		 goBack() {
		// 	if (!this.view) this.$router.go(-1)
		// 	else this.view = false
		 },
	}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import '@/assets/css/varibles.scss';

	.box {
		overflow: hidden;
		>div{
			float: left;
		}
		.fr{
			float: right;
		}
		.title {
			float: left;
			color: $txt-color;
			font-size: 16px;
			line-height: 28px;
			position: relative;
			font-weight: 600;
		}

		.line {
			float: left;
			content: '';
			width: 5px;
			height: 28px;
			background-color: $global-color;
			margin-right: 8px;
		}
	}
</style>
