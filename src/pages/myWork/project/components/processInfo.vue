<template>
	<div class="boxItem shadow searchInfo process">
		<div class="allTitle">过程文件</div>
		<div class="borderBox" style="width: 435px;">
			<div class="title">
				<router-link class="fr var" :to="'/myWork/'+(isExec ? 'ProcessFile':'processList')+'/'+projectNo+'?status='+status">   
				查看题目列表&gt;&gt;
				</router-link>
			</div>
			<div class="context fileBox" style="cursor: pointer;">
				<div class="file" v-for="item,index in list" @click="vive(item)">
					<template  v-if="index<5">
						<!-- <template v-if="index<3"> -->
						<i class="iconfont icon-file"></i>
						<div :title="item.titleName" style=" height: 20px; overflow: hidden; 
display: block; text-overflow: ellipsis; white-space: nowrap; cursor: pointer;width: 59px;margin: 12px auto;"
>{{item.titleName}}</div>
					</template>
				</div>
				<div class="fl uploadBox" v-if="status<3" style="margin-left: 0;">
					<div class="fl uploadBox" @click="add" style="width: 50px;padding-top: 2px;">
						<!-- <div class="fl uploadBox" v-if="list.length<3" @click="add"> -->
						<div class="upload">
							<i class="el-icon-plus"></i>
						</div>
						<span>新增题目</span>
					</div>
				</div>
				
			</div>
		</div>
		<div class="borderBox" style="border-left: none;">
			<div class="context" style="margin-top: 15px">
				<div class="fl">
					<div class="item">
						<span class="fl">文件数</span>
						<span class="fl"><span class="var">{{info.fileCounts}}</span>&nbsp;份</span>
					</div>
					<div class="item">
						<span class="fl">文件大小</span>
						<span class="fl"><span class="var">{{info.fileTotleSize?info.fileTotleSize.toFixed(2):0.00}}</span>&nbsp;MB</span>
					</div>
				</div>
				<div class="fr uploadBox" @click="upload" v-if="status<3">
					<div class="upload" style="cursor:pointer;">
						<i class="el-icon-plus"></i>
					</div>
					<span>文件上传</span>
				</div>
			</div>
		</div>
		<el-dialog title="选择题目" :visible.sync="visible" width="700px" :close-on-click-modal="false">
			<el-form  :inline="true" ref="formInline">
				<el-form-item label="题目名称">
					<el-autocomplete v-model="titleName"
						clearable
						:fetch-suggestions="querySearchAsync"
						@select="handleSelect"
						@clear="handleClear"
						style="width:6.5rem"
					></el-autocomplete>
				</el-form-item>
				<el-button class="fr" type="primary" @click="pageChange(1)">搜索</el-button>
			</el-form>
			<el-table :data="list2" border v-loading="loading" style="width: 100%">
				<el-table-column align="center" label="题目" width="75">
					<template slot-scope="scope">{{scope.$index+1+pageSize*(page-1)}}</template>
				</el-table-column>
				<el-table-column align="center" prop="titleName" label="题目名称" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column align="center" prop="fileCounts" width="150" label="文档个数"></el-table-column>
				<el-table-column align="center" label="操作" width="150">
					<template slot-scope="scope">
						<div class="btn-box" style="height: 23px;" v-if="status<3">
	                        <upload-pic accept=".doc,.docx,.xls,.xlsx,.pdf,.png,.bmp,.gif,.jpeg,.jpg,.m4a" @uploadSuccess="fillUpload">
								<div class="btn" @click="uploadTxt(scope.row.id)" style="float: none;">上传文件</div>
							</upload-pic>
	                    </div>

					</template>
				</el-table-column>
			</el-table>
			<!-- <pageination @pageChange="pageChange" :total="total" :page="page" :pageSize="pageSize"></pageination> -->
			<pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
		</el-dialog>
	</div>
</template>
<script>
import { getProcessList, getProcessStatistic, file,uploadProcessFile,getRole } from '@/api/mywork'
import uploadPic from '@/components/upload'
import { commonAuthApi } from "@/api/commonAuthApi";
export default {
	components: {
		uploadPic
	},
	props: {
		projectNo: '',
		status: Number
	},
	watch: {
		status() {
			this.init()
		}
	},
	computed: {
	
		userRole() {
		if (this.role.indexOf("Partnership") > -1) {
			//Partnership(大律师)
			return "Partnership";
		}
		if (this.role.indexOf("Resp") > -1) {
			//Resp(负责律师)
			return "Resp";
		}
		if (this.role.indexOf("Exec") > -1) {
			//Exec(执行律师)
			return "Exec";
		}
		if (this.role.indexOf("Client") > -1) {
			//Client(客户)
			return "Client";
		}
		},
		isShowOperating(){
		let status = true;
		if(this.matterStatus == 3){ //事项已完成
			status = false;
		}
		return status;
		},
  },
	data() {
		return {
			list: [],
			info: {},
			visible: false,
			titleName:'',
			page:1,
			pageSize:20,
			total:0,
			loading:false,
			list2:[],
			loading:false,
			titleId:'',
			role:'',
			roleArr:[],
			isExec:false,
			pageTotal: 0,
			tableHeight:0,
			getFileName:[],
			matterStatus: this.$route.query.status,
		} 
	},
	methods: {
		  getRole() {
		 	commonAuthApi(this.projectNo).then(res => {
				 this.role = res.result;
				 //console.log(this.role)
		 			if(this.userRole =='Resp' || this.userRole=='Partnership'){
		 				this.isExec=true;
					 }else{
						 this.isExec=false
					 }
					 //console.log(this.isExec)
		 	})
		  },
		handleSizeChange(val){
            this.pageSize = val
            this.pageChange(1)
		},
		getTableHeight(){
            this.tableHeight=window.innerHeight-320;
		},
		created() {
			window.addEventListener('resize', this.getTableHeight);
			this.getTableHeight()
		},
		destroyed(){
			window.removeEventListener('resize', this.getTableHeight)
		},
		  //搜索框
			querySearchAsync(queryString, cb) {
                var restaurants =this.getFileName;
                // console.log(restaurants)
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
				let vm = this;
				vm.titleName = item.value;
				vm.pageChange(1);
			},
			handleClear(){
				this.titleName = "";
				this.pageChange(1);
		},
		 //跳转详情页
		 vive(item){
				this.$router.push({path:'/myWork/processFileList/'+item.id,
				query:{id:item.id,projectNo: this.projectNo,from:'detail',status:this.status}})
		 },
		//初始化
		init() {
			//console.log(this.projectNo)
			getProcessList(
				this.projectNo).then(res => {
				//console.log(res)
				if (res.code == 0) {
					this.list = res.result
				}
			})
			getProcessStatistic(this.projectNo).then(res => {
				if (res.code == 0) {
					this.info = res.result
				}
			})
		},
		//新增题目
		add() {
			this.$router.push({ params: { add: true, id: this.projectNo }, name: 'ProcessFile' })
		},
		upload() {
			if(this.list.length==0){
				this.$alert('请先添加题目！','提示',{
	                type:'warning',
	                confirmButtonText: '确定',
	                callback: () => {
	                }
	            })
	            return false
			}
			this.visible = true
			this.pageChange(1)
		},
		 getSearch(){
			let options={
				projectNo: this.projectNo,
				titleName:this.titleName,
				pageNum: this.page,
				pageSize: this.pageSize
			}
			let vm = this;
			var getFileName1 = [];
				file(options).then((res)=>{
					if (res.code == 0){
						this.list2 = res.result.records;
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
		pageChange(index) {
			this.page=index
			let options={
				projectNo: this.projectNo,
				titleName:this.titleName,
				pageNum: this.page,
				pageSize: this.pageSize
			}
			this.loading=true
			file(options).then(res => {
				if (res.code == 0) {
					this.loading = false;
					this.list2 = res.result.records;
					this.total = Number(res.result.total);
					this.pageTotal = Number(res.result.pages)
				}
				this.loading = false;
			}).catch(() => {
				this.loading = false;
			});
		},
		uploadTxt(id){
			this.titleId=id
		},
		fillUpload(path,name){
			let options={
				titleId:this.titleId,
				fileName:name,
				filePath:path
			}
			uploadProcessFile(options).then(res=>{
				if(res.code==0){
					this.$message({
						type:'success',
						message:'上传成功'
					})
					this.pageChange(1)
					this.init()
				}
			})
		}
	},
	mounted() {
		this.init()
		this.getRole()
		this.getSearch()
		this.getTableHeight();
		//this.projectNo=this.$route.params.id
	}
}
</script>
<style>
.divs{
	color: #0cb3f0;
    text-align: center;
    margin-top: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.fileBox{
	display: flex;
	flex-direction: row;
	/* flex-wrap: wrap;
	width: 1200px;
	height: 640px;
	background-color: lightsteelblue; */
}

</style>
