<template>
	<div>
		<title-bar @goBack="goBack" :title="title"></title-bar>
		<!-- 新增的弹框 -->
		<div class="Newly">
			<el-button type="primary" @click="dialogTableVisible=true" v-if="isShowOperating">+新增题目</el-button>
				<el-dialog title="新增题目" :visible.sync="dialogTableVisible" width="500px" :before-close="handleClose" v-loading="loading" :close-on-click-modal="false">
					<el-form ref="ruleForm" :model="ruleForm" label-width="80px">
						<!-- <el-form-item label="题目名称" prop="titleName">
							<el-input v-model="ruleForm.titleName" :maxlength="20" @keyup.enter="dialogVisible()"></el-input>
						</el-form-item> -->
						<div class="el-form-item el-form-item--small">
							<label for="titleName" class="el-form-item__label" style="width: 80px;">题目名称</label>
							<div class="el-form-item__content" style="margin-left: 80px;">
								<div class="el-input el-input--small">
									<input type="text" v-model="ruleForm.titleName" @keyup.enter="dialogVisible()" autocomplete="off" maxlength="20" class="el-input__inner">
								</div>
							</div>
						</div>
					</el-form>
					<span slot="footer" class="dialog-footer">
						<el-button type="primary" @click="dialogVisible()">确 定</el-button>
						<el-button @click="closeImport('ruleForm')">取 消</el-button>
					</span>
				</el-dialog>
		</div>
		<!-- 题目搜索 -->
		<div class="Title">
			<el-form :inline="true" ref="formInline" :model="formInline" label-width="80px">
				<el-form-item label="题目名称">
					<el-autocomplete 
					v-model="formInline.titleName"
					clearable
					:fetch-suggestions="querySearchAsync"
					@select="handleSelect"
					@clear="handleClear"
					style="width:6.5rem"
					></el-autocomplete>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="pageChange(1)">搜索</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div>
			<el-table :data="list" border v-loading="loading" :max-height="tableHeight" :height="tableHeight" ref="table">
				<el-table-column align="center" prop="index" label="题目" width="75">
				 <template slot-scope="scope"><span>题目</span>{{scope.$index+1+pageSize*(page-1)}}</template>
				</el-table-column>
				<el-table-column align="center" prop="titleName" label="题目名称" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						 <div class="tabtext">{{scope.row.titleName}}</div>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="fileConfirmedName" label="确认文档名称" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<div v-if="scope.row.parent" class="tabtext">{{scope.row.fileConfirmedName}}</div>
						<div v-else='' class="tabtext">{{scope.row.fileConfirmedName}}</div>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="confirmedTime" label="最终确认时间" width="150">
					<template slot-scope="scope">{{scope.row.confirmedTime?scope.row.confirmedTime:'-'}}</template>
				</el-table-column>
				<el-table-column align="center" prop="confirmedUser" label="最终确认人" width="100">
					<template slot-scope="scope">{{scope.row.confirmedUser?scope.row.confirmedUser:'-'}}</template>
				</el-table-column>
				<el-table-column align="center" prop="fileCounts" label="文档个数" width="100">
				<template slot-scope="scope">
					{{scope.row.fileCounts}}
					<!-- <div class="var under" v-if="scope.row.fileCounts" @click="dialog(scope.row)">{{scope.row.fileCounts}}</div> -->
				</template>
				</el-table-column>
				<el-table-column align="center" label="操作" width="250"> 
				<template slot-scope="scope">
					<div class="btn-box">
					<div class="btn" @click="View(scope.row,scope.$index)" :class="{ red:changeRed == scope.$index}">查看详情</div>
					<div class="btn" @click="dialog(scope.row,scope.$index)" :class="{ red:changeReds == scope.$index}" v-if="isShowOperating">修改名称</div>
					<div class="btn" @click="deletde(scope.row,scope.$index)" style="color: rgb(243, 119, 117);" :class="{ red:changeRedss == scope.$index}" v-if="isShowOperating">删除</div>
					<!-- <div class="btn" v-else="" @click="submit(scope.row)">下载清单</div> -->
					</div>
				</template>
				</el-table-column>
			</el-table>
			<pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
		</div>
	</div>
</template>
<script>
// import { newTopics } from './components';
import { file, deletes, modify,Newfile,See} from "@/api/mywork";

export default {

	data(){
		return{
			changeRed:-1,
			changeReds:-1,
			changeRedss:-1,
			projectNo:'',
			titleName:'',
			dialogTableVisible:false,
			title:'过程文件-题目列表',
			restaurants: [],
			getFileName:[],
			lists:[],
			//弹框里的新增
			ruleForm:{
				titleName:'',
			},
			//搜索、列表
			formInline:{
				titleName:'',
				projectNo:'',
			},
			loading: false,
			list: [],
			page: 0,
			pageSize:20,
			total: 0,
		//	pagesize:2,
			pageTotal: 0,
			tableHeight:0,
			matterStatus: this.$route.query.status
		}
	},
	computed:{
		isShowOperating(){
		let status = true;
		if(this.matterStatus == 3){ //事项已完成
			status = false;
		}
		return status;
		}
	},
	mounted() {
		this.formInline.projectNo=this.$route.params.id
		this.pageChange(1)
		this.getSearch()
		//判断新增弹框
		if(this.$route.params.add){
			this.dialogTableVisible = true;
		}
    	this.getTableHeight();
    },
    created() {
        window.addEventListener('resize', this.getTableHeight);
        this.getTableHeight()
    },
    destroyed(){
        window.removeEventListener('resize', this.getTableHeight)
    },
	
	methods:{

		//搜索框模糊查询
		 querySearchAsync(queryString, cb) {
					var restaurants =this.getFileName;
					var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
					clearTimeout(this.timeout);
					this.timeout = setTimeout(() => {
							cb(results);
					}, 500 * Math.random());
    },
		createStateFilter(queryString) {
				return (state) => {
						return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
				};
		},
		handleSelect(item) {
				this.formInline.titleName = item.value;
				this.pageChange(1);
		},
		handleClear(){
				this.formInline.titleName = "";
				this.pageChange(1);
		},
		//删除
		deletde(row,index){
			if(row.fileConfirmedName!=''){
				this.$alert("已有文件被确认，题目不能删除", '提示', {
						type: 'warning',
						confirmButtonText: '确定',
						callback: () => {}
					})
				
			}else{
				this.changeRedsss = index;
				this.$confirm('目前此题目下关联'+(row.fileCounts)+'份文档一旦删除，文档将不能恢复确定删除?', '删除题目', {
					cancelButtonText: '取消',
					confirmButtonText: '确定',
				}).then(() => {
					this.loading = true;
					deletes(row.id).then(res => {
						if (res.code == 0) {
							this.$message({
								type: 'success',
								message: '删除成功！'
							})
						this.loading = false;
						this.pageChange(1)
						}
					})
				}).catch(() => {});
			
			}
		},
		//返回
		goBack(){
			this.$router.push({path:'/myWork/details/'+this.$route.params.id})
		},
		//点击x关闭清空内容
		handleClose(){
			this.dialogTableVisible = false;
			this.ruleForm.titleName=''
		},
		//点击取消清空表单
		closeImport(ruleForm){
			this.$refs[ruleForm].resetFields();
      		this.dialogTableVisible = false;
		},
		//修改题目文件
		dialog(row,index){
			 this.changeReds = index;
			 this.$prompt('题目名称', '修改名称', {
				cancelButtonText: '取消',
				confirmButtonText: '确定',
				//inputPattern:/^[\u4E00-\u9FA5A-Za-z0-9]+$/,    //正则条件 /^[\u4E00-\u9FA5A-Za-z0-9]+$/
				inputPattern:/^.{3,20}$/, 
				inputErrorMessage: '请输入20以内的字符',
				showInput:true,
				inputValue: row.titleName
			}).then(({ value,action }) => {
				this.loading = true;
				modify(row.id,value).then(res=>{
					this.pageChange(1)
				//	console.log(res)	
					this.$message({
							type: 'success',
							message: '修改成功！'
						})
					this.loading = false;
				})
			}).catch(() => {
				this.$message({
				type: 'info',
				message: '取消输入'
				});
			});
		},
		//新增过程文件
		dialogVisible(){
			if(this.ruleForm.titleName==""){
				this.dialogTableVisible = false;
					this.$alert("新增题目不能为空", '提示', {
						type: 'warning',
						confirmButtonText: '确定',
						callback: () => {}
					})
				}else{
					Newfile(this.formInline.projectNo,this.ruleForm.titleName).then(res=>{
						this.dialogTableVisible = false;
						if(res.code == 0){
							this.pageChange(1)
							this.loading = false;
						this.ruleForm.titleName=''
						}

					}).catch(() => {
						this.loading = false;

					});
				}
			

		},
		//查看过程文件列表
		View(row,index){
			this.$router.push({path:'/myWork/processFileList/'+row.id,query:{id:row.id,projectNo: row.projectNo,from:'list',status:this.$route.query.status}})
			 this.changeRed = index;
		},
		 getSearch(){
				let options = {
						projectNo: this.formInline.projectNo,
						titleName:this.formInline.titleName,
						pageNum: this.page,
						pageSize: this.pageSize
					}
				let vm = this;
				var getFileName1 = [];
					file(options).then((res)=>{
							if (res.code == 0){
									this.list = res.result.records;
									this.total = Number(res.result.total);
									this.pageTotal = Number(res.result.pages)
									for (let i = 0;i<res.result.records.length;i++){
											getFileName1.push(res.result.records[i].titleName)
									}
									var newArray = Array.from(new Set(getFileName1))
									vm.getFileName = [];
									for(let j = 0; j<newArray.length;j++){
											vm.getFileName.push({'value':newArray[j]});
									}
							}
					}).catch(err=>{
							console.log(err)
					})
    },
		//搜索以及列表
		pageChange(index){
			this.page = index
			let options = {
					projectNo: this.formInline.projectNo,
					titleName:this.formInline.titleName,
					pageNum: this.page,
					pageSize: this.pageSize
				}
				file(options).then(res => {
					if(res.code==0){
						this.list = res.result.records;
						this.total = Number(res.result.total);
						this.pageTotal = Number(res.result.pages)
					}
					this.loading = false;
				}).catch(() => {
				});
		},
		handleSizeChange(val){
            this.pageSize = val
            this.pageChange(1)
		},
		getTableHeight(){
            this.tableHeight=window.innerHeight-320;
        },
	},

}
</script>
<style rel="stylesheet/scss" lang="scss">
@import "@/assets/css/varibles.scss";
.tabtext{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.red{
  cursor: pointer;
  color: #BDBDBF!important;
  text-decoration: none!important;
  }
	.Newly{
		padding-top: 10px;
	}
	.Title{
		padding-top: 15px;
	}
</style>
