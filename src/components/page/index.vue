<template>
	<div class="page" v-if="total>0">
		<div class="fl">
			Page {{pageNum}} of {{pageTotal}}，<span>总共{{totalFormat}}条数据</span>
		</div>
		<el-pagination @size-change="handleSizeChange" @current-change="pageChange" class="fr" background layout="prev, pager, next, sizes, jumper" :page-sizes="[10, 20, 50, 100]" :total="total" :current-page="page" :page-size="pageSize"></el-pagination>
	</div>
</template>
<script>
import { numberFormat } from '@/utils/api'
export default {
 	watch:{
 		total(){
 			this.totalFormat = numberFormat(this.total, 0, ".", ",")
 			this.num = this.getNum()
 		},
 		page(){
 			this.pageNum=this.page
 		}
 	},
	props: {
		total: Number,
		page: Number,
		pageSize: Number,
        pageTotal:Number
	},
	data() {
		return {
			pageNum:0,
			num: 0,
			totalFormat: 0
		}
	},
	methods: {
		getNum() {
			if (this.total == 0) return 0
			else if (this.total <= this.pageSize) return 1
			else if (this.total % this.pageSize == 0) return this.total / this.pageSize
			else return ~~(this.total / this.pageSize) + 1
		},
		pageChange(index) {
			this.$emit('pageChange', index)
		},
        handleSizeChange(val){
		    this.$emit('handleSizeChange',val)
		}
	},
	mounted() {
		this.totalFormat = numberFormat(this.total, 0, ".", ",")
 		this.num = this.getNum()
 		this.pageNum=this.page
	}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.page {
	margin: 17px 0;
	padding-bottom: 3px;
	overflow: hidden;

	>div.fl {
		color: #7f8fa4;
		line-height: 28px;

		span {
			color: #1daaa6;
		}
	}
}
</style>
