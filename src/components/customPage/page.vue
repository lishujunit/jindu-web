<template>
	<div class="page">
		<div class="num">共{{count}}条</div>
		<div class="total">
			<i @click="prev" class="el-icon-caret-left" :class="{'disable':index==1}"></i>
			<span>{{index}}/{{pageTotal==0?1:pageTotal}}&nbsp;页</span>
			<i @click="next" class="el-icon-caret-right" :class="{'disable':index>=pageTotal}"></i>
		</div>
		<div class="var under" @click="expandTable" v-if="isExpand">展开&nbsp;&gt;</div>
		<div class="var under" @click="expandTable" v-else>收起&nbsp;&lt;</div>
	</div>
</template>
<script>
export default{
	watch:{
 		total(){
 			this.count = this.total
 		},
 		page(){
 			this.index=this.page
 		},
 		index(){
// 			console.log(this.index)
 			this.$emit('pageChange',this.index)
 		}
 	},
	props:{
		total:Number,
		page:Number,
		pageTotal:Number,
		pageSize:Number,
		expand:Boolean
	},
	data(){
		return{
			index:0,
			count:0,
			isExpand:false
		}
	},
	methods:{
		prev(){
			if(this.index==1) return false
			this.index--
//			this.$emit('pageChange',this.index)
		},
		next(){
			if(this.index>=this.pageTotal) return false
			this.index++
//			this.$emit('pageChange',this.index)
		},
		pageChange(index){
			this.$emit('pageChange',index)
		},
		expandTable(){
			this.isExpand=!this.isExpand
			this.$emit('expandTable',this.isExpand)
		}
	},
	mounted(){
		this.index=this.page
		this.count=this.total
		this.isExpand=this.expand
	}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/assets/css/varibles.scss';

.page {
	height: 30px;
	overflow: hidden;
	/*position: relative;*/
	width:100%;
	display:flex;
	
	

	>div {
		/*width: 50%;*/
		/*float: left;*/
		line-height: 30px;

		&.num {}

		&.total {
			flex: 1;
			text-align: center;
			span {
				margin: 0 8px;
			}

			i {
				font-size: 16px;
				cursor: pointer;

				&.disable {
					color: #dfe0e3;
					cursor: not-allowed 
				}
			}
		}

		&.var {
			text-align: right;
		}


	}
}
</style>