<template>
	<div class="page">
		<div class="num">共{{count}}条</div>
		<div class="total">
			<i @click="prev" class="el-icon-caret-left" :class="{'disable':index==1}"></i>
			<span>{{index}}/{{count}}&nbsp;页</span>
			<i @click="next" class="el-icon-caret-right" :class="{'disable':index==count}"></i>
		</div>
		<div class="var under" @click="expandTable" v-if="!isExpand">展开&nbsp;&gt;</div>
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
 		}
 	},
	props:{
		total:0,
		page:0,
		expand:false
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
		},
		next(){
			if(this.index==this.total) return false
			this.index++
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
	position: relative;

	>div {
		width: 50%;
		float: left;
		line-height: 30px;

		&.num {}

		&.total {
			width: auto;
			text-align: center;
			position: absolute;
			left: 50%;
			top: 0;
			transform: translate(-50%, 0);

			* {
				display: block;
				float: left;
				line-height: 30px;
			}

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