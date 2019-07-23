<template>
    <div class="myWrapbox">
        <div class="boxBtn">
            <p class="line"></p>
            <p class="title">我的工作台</p>
            <p class="fr system-txt" @click="handleSystem" v-if="isDevops">系统管理 》》</p>

            <!-- <p class="fr system-txt" @click="handleSystem">系统管理 》》</p> -->

            <!--<el-button type="primary" class="fr" @click="goBack">返回</el-button>-->
        </div>
        <div class="search bg" style="margin-top: 20px;">
            <el-form :model="ruleForm" ref="ruleForm" label-width="80px" class="form" inline style="margin-right: 0">
                <el-form-item label="项目编号" prop="projectNo" label-width="80px">
                    <el-autocomplete class="inline-input" v-model="ruleForm.projectNo" clearable @clear="clearPro('projectNo')" :fetch-suggestions="querySearch"  @keyup.enter.native="handleSelect"
          @select="handleSelect"></el-autocomplete>
                </el-form-item>
                <el-form-item label="项目名称" prop="projectName">
                    <el-autocomplete class="inline-input" v-model="ruleForm.projectName" clearable @clear="clearPro('projectName')" :fetch-suggestions="querySearch5" @keyup.enter.native="handleSelectPName"
          @select="handleSelectPName" style="width: 5rem;"></el-autocomplete>
                </el-form-item>
                <el-form-item label="状态" prop="projectStatus">
                    <el-select v-model="ruleForm.projectStatus" placeholder="请选择" class="state" @change="pageChange(1)" style="width: 3rem;">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item,index in globalStatus.projectStatus" :key="index" :label="item" :value="index" ></el-option>
                    </el-select>
                </el-form-item>
                 <div style="display: inline-block;">
                    <el-form-item label="立项时间" prop="startDate">
                        <el-date-picker :picker-options="startDatePicker" class="date" type="date" v-model="ruleForm.startDate" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="至" label-width="30px" prop="endDate">
                        <el-date-picker :picker-options="endDatePicker" class="date" type="date" v-model="ruleForm.endDate" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </div>
                 <br>
                <el-form-item label="事项" prop="matterName" label-width="80px">
                    <el-autocomplete class="inline-input" v-model="ruleForm.matterName" clearable  @clear="clearPro" :fetch-suggestions="querySearch2" @keyup.enter.native="handleSelectMName"
          @select="handleSelectMName"></el-autocomplete>
                </el-form-item>
                <el-form-item label="合伙律师" prop="partnerLawyer">
                    <el-autocomplete class="inline-input" v-model="ruleForm.partnerLawyer" clearable  @clear="clearPro" :fetch-suggestions="querySearch3" @keyup.enter.native="handleSelectPlayer"
          @select="handleSelectPlayer"></el-autocomplete>
                </el-form-item>
                <el-form-item label="负责律师" prop="responsibleLawyer">
                    <el-autocomplete class="inline-input" v-model="ruleForm.responsibleLawyer" clearable  @clear="clearPro" :fetch-suggestions="querySearch4" @keyup.enter.native="handleSelectRlayer"
          @select="handleSelectRlayer"></el-autocomplete>
                </el-form-item>

            </el-form>
            <div class="rightBox">
                <el-button type="primary" @click="pageChange(1)">搜索</el-button>
                <el-button type="danger" @click="resetForm">重置</el-button>
            </div>
        </div>
        <el-table :data="list" :height="tableHeight" border style="margin-top: 16px;" @row-click="rowClick" v-loading="loading"
        class="expandTable myexpandTable" ref="table"
        @expand-change="expandChange">
            <el-table-column type="expand" width="1">
                <template slot-scope="scope">
                    <matter :id="scope.row.projectNo" @refresh="refresh" :getStatus="scope.row.status" :matterName='resetForm.matterName'></matter>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="projectNo" label="项目编号" width="200px">
                <template slot-scope="scope">
                    <div v-if="scope.row.status ==='1'|| scope.row.status === '0'">{{scope.row.projectNo}}</div>
                    <div @click="secondListExpand(scope.row)" style="cursor: pointer;" v-else>
                        <i style="font-weight: 600" :class="{'el-icon-arrow-down':!scope.row.countCheck,'el-icon-arrow-up':scope.row.countCheck}"></i>
                        {{scope.row.projectNo}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="projectName"  label="项目名称" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <p :title="scope.row.projectName" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;cursor: pointer;text-align: left;margin-left: 10px;">{{scope.row.projectName}}</p>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="status" label="状态" width="120px">
                <template slot-scope="scope">
                    {{globalStatus.projectStatus[scope.row.status]}}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="setUpTime" label="立项时间" width="170"></el-table-column>
            <el-table-column align="center" prop="sponsorPartner" label="主办合伙人" width="100"></el-table-column>
            <el-table-column align="center" prop="inChargeLawyer" label="负责律师" show-overflow-tooltip width="160">
                <template slot-scope="scope">
                    <!-- <div v-if="scope.row.status==0" class="var under" @click="chooseLawyer(scope.row)">指定</div> -->
                    <template class="text-ellipsis">{{scope.row.inChargeLawyer==''?'-':scope.row.inChargeLawyer}}</template>
                </template>
            </el-table-column>
            <el-table-column align="center" label="普通客户邀请码" width="140">
                <template slot-scope="scope">
                    <div v-if="scope.row.status==='3' || scope.row.status==='1'">
                        <div>-</div>
                    </div>
                    <div v-else>
                        <div class="var under" v-if="scope.row.invitationCodeAvalible" @click="handleCode(scope.row)">获取邀请码</div>
                        <div v-else>-</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="140">
                <template slot-scope="scope">
                    <div class="btn-box">
                        <span class="btn" @click="toDetails('details/'+scope.row.projectNo, scope.row.projectNo)">进入项目</span>
                        <!-- <router-link class="btn" :to="'details/'+scope.row.projectNo">进入项目</router-link> -->
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
        <chooseLawyer
        :unList="[]" :status="0" :type="0" :projectNo="dialog.projectNo" :title="dialog.projectName" :dialogVisible="dialog.visible" @closeDialog="closeDialog" @submit="submit"></chooseLawyer>
    </div>
</template>
<script>
import { getCookie } from '@/utils/auth'
import { commonAuthApi } from "@/api/commonAuthApi";
import { chooseLawyer } from '../project/components'
import { mapState, mapMutations, mapActions } from 'vuex'
import matter from './components/matter'
import { updateResLawyer,getRes,getPartner,getMatter,getProjectNames,cutomerCode,getProject } from '@/api/mywork'
import { project,projectAll } from "@/api/project";
export default {
    components: {
        matter,
        chooseLawyer
    },
    computed: {
        ...mapState('myWork', ['projectList'])
    },
    data() {
        return {
            page: 1,
            total: 0,
            pageTotal: 0,
            pageSize: 20,
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
            tableHeight:window.innerHeight-360,
            selectList:[],
            isDevops: false
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
            this.tableHeight=window.innerHeight-360;
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
               // console.log(this.list)
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
        getRole(projectNo) {
            commonAuthApi(projectNo).then(res=>{
                if(res.code == 0){
                    this.saveRole(res.result)
                }
            })
        },
        toDetails(path, projectNo) { //进入项目详情页面
            this.getRole(projectNo)
            this.$router.push(path)
        },
        //展开或者关闭的时候
        expandChange(row, expandedRows) {
            if (expandedRows.indexOf(row) > -1) {
                row.countCheck = true
                this.getRole(row.projectNo)
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
        handleSystem(){
            this.$router.push({path:'/systemManage'})
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
        ...mapActions('myWork', ['getProjectList']),
        ...mapMutations('myWork', ['saveRole'])
    },
    mounted() {
        this.pageChange(1);
        if(getCookie('devops_role_name') == 'Devops'){ //登录是否用于运维权限的标识
            this.isDevops = true;
        }
        //this.getTableHeight();
    },
    created() {
        window.addEventListener('resize', this.getTableHeight);
        //this.getTableHeight()
    },
    destroyed(){
        window.removeEventListener('resize', this.getTableHeight)
    },
}
</script>
<style rel="stylesheet/scss" lang="scss">
	.myWrapbox .el-table--border th.gutter:last-of-type{
		width:16.8px !important;
		display:table-cell !important;
	}
</style>
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
    .system-txt{
        color: $global-color;
        text-decoration: underline;
        cursor: pointer;
    }
</style>
