<template>
	<div class="viewBox">
		<div class="leftBox fl" :style="{'width':width}">
			<div class="topBox">
				<el-form :inline="true" size="mini">
					<el-form-item label="底稿属性">
						<el-input style="width: 100px" v-model="name"></el-input>
					</el-form-item>
					<el-form-item v-if="expand" label="文件描述">
						<el-input style="width: 100px" v-model="desc"></el-input>
					</el-form-item>
					<el-form-item v-if="expand">
						<el-checkbox v-model="checked">问题底稿</el-checkbox>
					</el-form-item>
					<el-button class="searchBtn">搜索</el-button>
				</el-form>
			</div>
			<el-tabs v-model="active" type="border-card" tab-position="left">
				<el-tab-pane v-for="item in tabList" :label="item.name"></el-tab-pane>
				<div class="cardtxt">
					<div class="title">
						<el-button class="confirm" type="primary">确认</el-button>
						<div class="txt">事项1：初次调查报告</div>
					</div>
					<el-table :data="tableList" class="boxTable" border>
						<el-table-column prop="index" label="报告序号"></el-table-column>
						<el-table-column prop="name" label="文件名称">
							<template slot-scope="scope">
								<span class="var">{{scope.row.name}}</span>
							</template>
						</el-table-column>
						<el-table-column v-if="expand" prop="person" label="确认人"></el-table-column>
						<el-table-column v-if="expand" prop="time" label="确认时间"></el-table-column>
						<el-table-column v-if="expand" prop="remark" label="备注"></el-table-column>
					</el-table>
					<page :page="page" :total="total" :expand="expand" @pageChange="pageChange" @expandTable="expandTable"></page>
				</div>
			</el-tabs>
		</div>
		<div class="rightBox" :style="{'margin-left':width}">
			<div class="topBox"></div>
			<div class="bg" style="min-height: 400px"></div>
		</div>
		<div class="line" :style="{'left':width}"></div>
	</div>
</template>
<script>
import page from '../../components/page'
export default {
	components: {
		page
	},
	data() {
		return {
			tabList: [],
			active: '1',
			width: '27%',
			name: '',
			desc: '',
			checked: false,
			tableList: [
				{ index: '1.1.1', name: '营业执照', person: '张三', time: '2017.07.30', remark: '暂无' },
				{ index: '1.1.2', name: '公司章程', person: '张三', time: '2017.07.30', remark: '暂无' }
			],
			total: 12,
			page: 1,
			pageSize: 10,
			expand: false
		}
	},
	methods: {
		getTabList() {
			this.tabList = [
				{ id: '1', name: '事项1' },
				{ id: '2', name: '事项2事项2' },
				{ id: '3', name: '事项3' },
				{ id: '4', name: '事项3' },
			]
		},
		pageChange(index) {
			this.page = index
		},
		expandTable(expand) {
			this.expand = expand
			this.expand ? this.width = '55%' : this.width = '27%'
		}
	},
	mounted() {
		this.getTabList()
	}
}
</script>
<style rel="stylesheet/scss" lang="scss">
@import '@/assets/css/varibles.scss';

.leftBox {
	.el-tabs--border-card {
		background: none;
		box-shadow: none;
		border: none;

		.el-tabs__nav-prev,
		.el-tabs__nav-next {
			display: none;
		}

		.el-tabs__header.is-left {
			padding: 0;
			margin: 0;
			border-right: none;
			border-left: 1px solid $table-color;
			border-bottom-color: $table-color;

			.el-tabs__nav-wrap {
				padding: 0;

				.el-tabs__nav-scroll {
					padding: 0;

					.el-tabs__item {
						border-bottom-color: $table-color;
						font-weight: 600;
						border-right: 1px solid #d1dfe3;

						&.is-active {
							border-right-color: #fff;
						}
					}
				}
			}
		}

		.el-tabs__content {
			background: #fff;
			border-left: 1px solid $table-color;
			border-bottom: 1px solid $table-color;
			padding: 0 15px 5px;
		}
	}
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/assets/css/varibles.scss';

.leftBox {
	border-bottom: none;
	border-left: none;

	.topBox {
		border-left: 1px solid $table-color;
	}
}

.cardtxt {
	.title {
		font-weight: 600;
		line-height: 40px;

		.txt {
			margin-right: 60px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.confirm {
			float: right;
			padding: 6px 15px;
			margin-top: 7px;
		}
	}
}
</style>