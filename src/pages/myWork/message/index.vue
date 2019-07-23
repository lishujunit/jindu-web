<template>
	<div>
		<title-bar @goBack="goBack" :title="title"></title-bar>
		<!-- 新增的弹框 -->
		<div class="search bg" style="margin-top: 20px;">
            <el-form :model="ruleForm" ref="ruleForm" label-width="80px" class="form" inline style="margin-right: 0">
                <el-form-item label="主题" prop="projectNo" label-width="80px">
                    <el-autocomplete class="inline-input" v-model="ruleForm.projectNo" clearable @clear="clearPro('projectNo')" :fetch-suggestions="querySearch"  @keyup.enter.native="handleSelect"
          @select="handleSelect"></el-autocomplete>
                </el-form-item>
                 <div style="display: inline-block;">
                    <el-form-item label="时间" prop="startDate">
                        <el-date-picker :picker-options="startDatePicker" class="date" type="date" v-model="ruleForm.startDate" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="至" label-width="30px" prop="endDate">
                        <el-date-picker :picker-options="endDatePicker" class="date" type="date" v-model="ruleForm.endDate" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </div>
               
            </el-form>
            <div class="rightBox">
                <el-button type="primary" @click="pageChange(1)">搜索</el-button>
                <el-button type="danger" @click="resetForm">重置</el-button>
            </div>
        </div>
        <div class="search bg" style="margin-top: 20px; padding: 15px 20px;">
        	<el-button type="primary">标记已读</el-button>
                <el-button type="danger">删除</el-button>
        </div>
		<!-- 题目搜索 -->
		<el-table :data="list" :height="tableHeight" border @row-click="rowClick" v-loading="loading" 
        class="expandTable el-table--scrollable-y" ref="table" 
        @expand-change="expandChange">
            <el-table-column align="center" prop="projectNo" label="主题">
            </el-table-column>
            <el-table-column align="center" prop="setUpTime" label="时间">
            	
            </el-table-column>
             <el-table-column align="center" prop="status" label="类型">
            </el-table-column>
            <!--<el-table-column label="操作" width="140px" align="center">
                <template slot-scope="scope">
                    <div class="btn-box">
                        <router-link class="btn" :to="'details/'+scope.row.projectNo">进入项目</router-link>
                    </div>
                </template>
            </el-table-column>-->
        </el-table>
        <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
	</div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { updateResLawyer,getRes,getPartner,getMatter,getProjectNames,cutomerCode,getProject } from '@/api/mywork'
import { project,projectAll } from "@/api/project";
export default {
    computed: {
        ...mapState('myWork', ['projectList'])
    },
    data() {
        return {
        	title:'系统消息',
            page: 1,
            total: 0,
            pageTotal: 0,
            pageSize: 10,
            expands:[],
            ruleForm: {
                projectNo: '',
                projectName: '',
                projectStatus: '',
                startDate: '',
                endDate: '',
                matterName: '',
                partnerLawyer: '',
                responsibleLawyer: ''
            },
            loading: false,
            list: [],
            info: {},
            dialog: {
                visible: false,
                projectNo: '',
                projectName: '',
            },
            startDatePicker: this.beginDate(),
            endDatePicker: this.processDate(),
            tableHeight:0,
            selectList:[],
        }
    },
    methods: {
    	handleSelect(val){
			this.ruleForm.projectNo = val.value
			//回显项目名称
			projectAll(this.ruleForm.projectNo, "").then(res => {
				if(res.code==0){
					res.result.forEach(v=>{
						this.ruleForm.projectName=v.projectName;
					})
				}
			})
			this.pageChange(1);
        },
        handleSelectRlayer(val){
        	this.ruleForm.responsibleLawyer = val.value
	        this.pageChange(1)
        },
        handleSelectPlayer(val){
        	this.ruleForm.partnerLawyer = val.value
	        this.pageChange(1)
        },
        handleSelectMName(val){
        	this.ruleForm.matterName = val.value
	        this.pageChange(1)
        },
        handleSelectPName(val){
        	this.ruleForm.projectName = val.value
        	//回显项目名称
			projectAll("", this.ruleForm.projectName).then(res => {
				if(res.code==0){
					res.result.forEach(v=>{
						this.ruleForm.projectNo=v.projectNo;
					})
				}
			})
	        this.pageChange(1)
        },
        
        getTableHeight(){
            // this.tableHeight=window.innerHeight-320;
            this.tableHeight=window.innerHeight-460;
        },
        beginDate() {
            let self = this
            return {
                disabledDate(time) {
                    if (self.ruleForm.endDate) {
                        return time.getTime() > new Date(self.ruleForm.endDate).getTime() + 8.64e6
                    } else {
                        return time.getTime() > Date.now()
                    }
                }
            }
        },
        processDate() {
            let self = this
            return {
                disabledDate(time) {
                    if (self.ruleForm.startDate) {
                        return time.getTime() > Date.now() || time.getTime() < new Date(self.ruleForm.startDate).getTime() - 8.64e7
                    } else {
                        return time.getTime() > Date.now()
                    }
                }
            }
        },
   
   
        refresh(){
          this.pageChange(this.page)
        },
        pageChange(index,callback) {
            this.page = index
            let options = this.ruleForm
                options.pagenum = this.page
                options.pagesize = this.pageSize
            this.loading = true
            this.getProjectList(options).then(() => {
                this.total = Number(this.projectList.total)
                this.pageTotal = Number(this.projectList.pages)
               
               let data = JSON.parse(JSON.stringify(this.projectList.records))
                this.list = data
                this.list.forEach(v => {
                    v.expand = false
                })
                let self = this;
                setTimeout(function(){
                   // if((self.ruleForm.projectStatus != '' && self.resetForm.projectStatus=='3') || self.ruleForm.matterName !=''){ //判断所有行是否展开
                    if(self.ruleForm.matterName !=''){ //判断所有行是否展开
                        self.list.forEach(v=>{
                            self.$refs.table.toggleRowExpansion(v, true)
                        })
                    }else{
                        self.list.forEach(v=>{
                            self.$refs.table.toggleRowExpansion(v, false)
                        })
                    }
                },50)
                this.loading = false
                console.log(this.list)
                callback&&callback(this.list)
            }).catch(() => {
                this.loading = false
            })
        },
        rowClick(row,event,column){
            return row.id
        },
        handleSizeChange(val){
            this.pageSize = val
            this.pageChange(1)
        },
        //点击展开
        secondListExpand(row) {
            this.$refs.table.toggleRowExpansion(row)
        },
        //展开或者关闭的时候
        expandChange(row, expandedRows) {
            if (expandedRows.indexOf(row) > -1) {            
                row.countCheck = true
            }else{
                row.countCheck = false
            } 
            
        },
        //重置表单
        resetForm() {
            this.$refs['ruleForm'].resetFields();
            this.pageChange(1)
        },
        goBack() {
            this.$router.go(-1)
        },
        //关闭弹框
        closeDialog(visible) {
            this.dialog.visible = visible
        },
        submit(list) {
            if (list.length == 0) {
                let msg = ""
                this.$alert("请选择负责律师！", '提示', {
                    type: 'warning',
                    confirmButtonText: '确定',
                    callback: () => {}
                })
                return false
            }
            let ids = []
            list.forEach(v => {
                ids.push(v.id)
            })
            updateResLawyer({ projectNo: this.dialog.projectNo, laywerIds: ids }).then(res => {
                if (res.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '选择成功！'
                    })
                    this.dialog.visible = false
                    this.pageChange(this.page)
                }
            })

        },
        /*模糊查询*/
        querySearch(queryString, cb) {
            projectAll(this.ruleForm.projectNo, "").then(res => {
                let selectList=[]
                if(res.code==0){
                    res.result.forEach(v=>{
                        selectList.push({value:v.projectNo})
                    })
                }
                var results = queryString ? selectList.filter(this.createStateFilter(queryString)) : selectList;
                cb(results);

            }).catch(error => {});
        },
        createStateFilter(queryString) {
            return (state) => {
                return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            }
        },
        querySearch2(queryString, cb) {
            getMatter({key:this.ruleForm.matterName}).then(res => {
                let selectList2=[]
                if(res.code==0){
                    res.result.forEach(v=>{
                        selectList2.push({value:v})
                    })
                }
                var results = queryString ? selectList2.filter(this.createStateFilter(queryString)) : selectList2;
                cb(results);

            }).catch(error => {});
        },
        querySearch3(queryString, cb) {
            getPartner({key:this.ruleForm.partnerLawyer}).then(res => {
                let selectList3=[]
                if(res.code==0){
                    res.result.forEach(v=>{
                        selectList3.push({value:v})
                    })
                }
                var results = queryString ? selectList3.filter(this.createStateFilter(queryString)) : selectList3;
                cb(results);

            }).catch(error => {});
        },
        querySearch4(queryString, cb) {
            getRes({key:this.ruleForm.responsibleLawyer}).then(res => {
                let selectList4=[]
                if(res.code==0){
                    res.result.forEach(v=>{
                        selectList4.push({value:v})
                    })
                }
                var results = queryString ? selectList4.filter(this.createStateFilter(queryString)) : selectList4;
                cb(results);

            }).catch(error => {});
        },
        querySearch5(queryString, cb) {
            this.selectList = []
//          console.log(this.ruleForm.projectNo)
            getProjectNames({key:this.ruleForm.projectName}).then(res => {
                if(res.code==0){
                    res.result.forEach(v=>{
                        this.selectList.push({value:v})
                    })
                }
                var results = queryString ? this.selectList.filter(this.createStateFilter(queryString)) : this.selectList;
                cb(results);

            }).catch(error => {});
        },
        handleCode(val){
            cutomerCode(val.projectNo).then((res)=>{
                if (res.code == 0){
                    this.$alert('客户邀请码已发送至您的手机/邮箱！','提示',{}).then(()=>{},()=>{})

                }else{
                    this.$alert('发送失败，请联系管理员！','提示',{}).then(()=>{},()=>{})
                }
            })
            // console.log(val)
        },
        clearPro(item){
        	if(item=='projectNo'){
          		if(this.ruleForm.projectNo==''){
	        		this.ruleForm.projectName=''
	        	}
        	}else if(item=='projectName'){
          		if(this.ruleForm.projectName==''){
	        		this.ruleForm.projectNo=''
	        	}
        	}
        	this.pageChange(1)
        },
        ...mapActions('myWork', ['getProjectList'])
    },
    mounted() {
        this.pageChange(1);
        this.getTableHeight();
    },
    created() {
        window.addEventListener('resize', this.getTableHeight);
        this.getTableHeight()
    },
    destroyed(){
        window.removeEventListener('resize', this.getTableHeight)
    },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    @import '@/assets/css/varibles.scss';
    .boxBtn {
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
