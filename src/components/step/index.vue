<template>
	<div class="bg shadow" v-if="isStep">
		<ul>
			<li class="item fl" :class="{'active':$route.path.indexOf(item.path)>-1}" v-for="item,index in list" :style="{'width':100/list.length+'%'}">
				<div class="inner" @click="goLink(item)">
					<img :src="$route.path.indexOf(item.path)>-1?item.activeIcon:item.icon">
					<span>{{item.name}}</span>
				</div>
				<div class="line next" v-if="index!=0"></div>
				<div class="line prev" v-if="index!=list.length-1"></div>
			</li>
		</ul>
	</div>
</template>
<script>
export default {
	data(){
		return{
			isStep: this.$route.meta.isStep ? false : true
		}
	},
	watch:{
		'$route'(){
			this.isStep = this.$route.meta.isStep ? false : true
		}
	},
	props: {
		tab: 0,
		list: Array
	},
	methods:{
		goLink(item){
		    console.log(item)
			if(item.stepRole){ //路由跳转由父组件完成
				this.$emit('handleLink', item)
			}else{
				this.$router.push({name:item.path,query:item.query})
			}
		}
	},
	created(){
		this.isStep = this.$route.meta.isStep ? false : true
	}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/assets/css/varibles.scss';
.bg {
	padding: 10px 0;
	height: 70px;
	li{
		position: relative;
		.inner{
			cursor: pointer;
			img{
				width: 50px;
				display: block;
				text-align: center;
				margin:0 auto;
			}
			span{
				display: block;
				text-align: center;
				font-size: 16px;
				color: #BDBDBF;
				margin-top: 5px;
			}
		}
		&.active span{
			color:  $global-color;
		}
		.line{
			position: absolute;
			height: 3px;
			background-color: #f0f2f5;
			border:1px solid #e7eaed;
			opacity: 0.6;
			width: calc(50% - 30px);
			top: 24px;
			&.prev{
				border-radius: 3px 0 0 3px;
				border-right: 0;
				right: 0;
			}
			&.next{
				border-radius: 0 3px 3px 0;
				border-left: 0;
				left: 0
			}
		}
	}
}
</style>
