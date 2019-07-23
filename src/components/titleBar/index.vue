<template>
	<div class="box">
		<div class="line fl"></div>
		<div class="title fl" v-if="title">{{title}}</div>
		<div class="title fl" v-else>
			<template v-for="item,index in navText">{{item}}<span v-if="index<navText.length-1" style="color: #999">&nbsp;/&nbsp;</span></template>
		</div>
		<div class="fr">
			<el-button type="primary" @click="goBack">{{$route.meta.goBack ? $route.meta.goBack : '返回'}}</el-button>
		</div>
	</div>
</template>
<script>
export default {
	watch:{
		'$route'(){
			this.navText=[]
			this.$route.matched.forEach(v=>{
				if(v.meta.title&&this.navText.indexOf(v.meta.title)==-1) this.navText.push(v.meta.title)
			})
		}
	},
	props:{
		title:'',
	},
	data() {
		return {
			navText:[],
		}
	},
	methods:{
		goBack(){
      // let route = this.$route
      // ,matched = route.matched
      // ,params = route.params
      // ,len = matched.length -1
      // ,pathItem = matched[len]
      // ,parentPath = pathItem.parent.path
			// ;
			// console.log('pathItem', pathItem)
      // console.log(this.$route.query, 'parentPath')
			// if(this.$route.query.parentPath){
			// 	this.$router.push(this.$route.query.parentPath)
			// 	return
			// }
      // if(pathItem.parent.redirect){ // 父级路由重定向指向字页面
      //   if(pathItem.path.indexOf(pathItem.parent.redirect) > -1){
      //     let parent = pathItem.parent.parent;
      //     if(parent){
      //       //parentPath = parent.path
      //     }
      //   }else{
      //     //console.log(pathItem.parent, '重定向')
      //     //parentPath = pathItem.parent.redirect
      //   }
      // }else{
      //   parentPath = pathItem.path
      // }
      // if(len >= 2){ //大于等于2级目录，有意义返回上一页
      //   if(parentPath.indexOf(':') != -1){ //判断有动态路由
      //     let pathArr = parentPath.split('/');
      //     let newPath = [];
      //     pathArr.forEach((v,i,arr)=>{
      //       if(v == "") return;
      //       if(v.indexOf(':') != -1){
      //         newPath.push(params[v.substr(1)])
      //       }else{
      //         newPath.push(v)
      //       }
      //     })
      //   this.$router.push('/' + newPath.join('/'))
      //   }else{
      //     this.$router.push(parentPath)
      //   }
      // }
			this.$emit('goBack')
		}
	},
	created(){
		this.$route.matched.forEach(v=>{
			if(v.meta.title&&this.navText.indexOf(v.meta.title)==-1) this.navText.push(v.meta.title)
		})
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
}
</style>
