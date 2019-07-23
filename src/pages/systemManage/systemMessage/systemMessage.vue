<template>
    <div class="system-message">
        <div class="box">
            <div class="line fl"></div>
            <div class="title fl">系统消息</div>
            <div class="fr">
                <el-button type="primary" @click="goBack">返回</el-button>
            </div>
        </div>
        <div class="model-search">
            <el-form ref="ruleForm" label-width="70px" class="form" inline>
                <el-form-item label="主题" prop="name">
                    <el-input maxlength="50" v-model="ruleForm.name" @clear="handleClear" clearable style="width: 350px" @change="handleName"></el-input>
                </el-form-item>
                <el-form-item label="时间" prop="beginTime">
                    <el-date-picker class="date" type="date" v-model="ruleForm.startTime" value-format="yyyy-MM-dd" :picker-options="startDatePicker" @change="getstartTime"></el-date-picker>
                </el-form-item>
                <el-form-item label="至" prop="endTime" label-width="30px">
                    <el-date-picker class="date" type="date" v-model="ruleForm.endTime" value-format="yyyy-MM-dd" :picker-options="endDatePicker" @change="getendTime"></el-date-picker>
                </el-form-item>
                <!--<el-form-item label="时间">-->
                    <!--<el-date-picker-->
                            <!--v-model="ruleForm.time1"-->
                            <!--type="daterange"-->
                            <!--value-format="yyyy-MM-dd"-->
                            <!--align="right"-->
                            <!--@change="handleTime2"-->
                            <!--:clearable="false"-->
                            <!--unlink-panels-->
                            <!--range-separator="至"-->
                            <!--start-placeholder="开始日期"-->
                            <!--end-placeholder="结束日期"-->
                    <!--&gt;-->
                    <!--</el-date-picker>-->
                <!--</el-form-item>-->
                <div class="fr">
                    <el-button type="primary" @click="getData(1)">搜索</el-button>
                    <el-button type="danger" @click="resetForm()">重置</el-button>
                </div>
            </el-form>
        </div>
        <div class="message-btn mt20">
            <el-button type="primary" @click="handleRead">标记已读</el-button>
            <el-button type="danger" @click="handleDelete">删除</el-button>
        </div>
        <div class="model-table mt20">
            <el-table :data="tableData" border :max-height="getHeight" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="title" label="主题" align="center">
                    <template slot-scope="scope">
                       <div @click="handleRouter(scope.row)">
                           <p class="message-jump txt" v-if="scope.row.isRead == 0" >{{scope.row.title}}</p>
                           <p class="message-jump" v-else>{{scope.row.title}}</p>
                       </div>
                    </template>
                </el-table-column>
                <el-table-column prop="createtime" label="时间" align="center" width="360"></el-table-column>
                <!--<el-table-column prop="type" label="类型" align="center" width="240"></el-table-column>-->
            </el-table>
            <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
        </div>
    </div>
</template>

<script>
    import { messageLitApi,messageReadApi,messageDeleteApi,messageTitleApi,matterDone } from '@/api/systemManageApi'
    export default {
        name: "systemMessage",
        data(){
            return{
                getHeight:window.innerHeight - 400,
                loading:false,
                ruleForm:{
                    name:'',
                    startTime:'',
                    endTime:'',
                },
                pageTotal:0,
                total:0,
                page:1,
                pageSize:20,
                tableData:[],
                getItems:[],
                count:0,
                inquiryIds:[],
                endTime:'',
                startTime:'',
                //创建时间
                startDatePicker: {
                    disabledDate: (time) => {
                        if (this.ruleForm.endTime != "") {
                            return time.getTime() >  new Date(this.ruleForm.endTime).getTime();
                        }
                    },
                },
                endDatePicker: {
                    disabledDate: (time) => {
                        return time.getTime() < new Date(this.ruleForm.startTime).getTime()- 1*24*60*60*1000;//减去一天的时间代表可以选择同一天;
                    },

                },
            }
        },
        mounted(){
          this.getData(1)
        },
        methods:{
            showBadge(){
                // messageTitleApi().then((res)=>{
                //     alert('system')
                //     if (res.code == 0){
                //         this.number = Number(res.result)
                //         // console.log(res)
                //         if (this.number != 0){
                //             this.isActive = false
                //         }
                //     }
                // })
            },
            getData(val){
                this.page = val
                let options = {
                    beginTime:this.ruleForm.startTime,
                    endTime:this.ruleForm.endTime,
                    pagenum :this.page,
                    pagesize :this.pageSize,
                    title :this.ruleForm.name,
                }
                messageLitApi(options).then((res)=>{
                    if (res.code == 0){
                        this.tableData = res.result.records
                        this.pageTotal = Number(res.result.pages);
                        this.total = Number(res.result.total);
                    }
                })
            },
            handleRouter(val){
                let path = JSON.parse(val.details),messageMatterStatus = 1;
                if (val.toPage == '5-1' ||val.toPage=='6-1' || val.toPage=='7-3'){

                } else{
                    matterDone(path.workUnitId).then((res)=>{
                        if (res.code != 0){
                            messageMatterStatus = 2
                        }else{
                            messageMatterStatus = 1
                        }
                    })
                }
                switch (val.toPage) {
                    case '5-1'://项目未开始
                        this.$router.push({path:'/myWork/details/'+path.projectNo,query:{from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '6-1'://项目准备中
                        this.$router.push({path:'/myWork/details/'+path.projectNo,query:{from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '7-3'://项目进行中
                        this.$router.push({path:'/myWork/details/'+path.projectNo,query:{from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '10-2'://审核过程文件
                        this.$router.push({path:'/myWork/processFileList/'+path.processFileTitleId,query:{projectNo:path.projectNo,id:path.processFileTitleId,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    // case '10-3'://管理过程文件
                    //     this.$router.push({path:'/processFileList/'+path.workUnitId,query:{projectNo:path.projectNo,from:'message'}})
                    //     break;
                    case '12-2'://查验计划--确认计划
                        this.$router.push({path:'/inspectionPlan/checkPlan/'+path.workUnitId,query:{projectNo:path.projectNo,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '12-4'://查验计划--审核结果
                        this.$router.push({path:'/inspectionPlan/checkResult/'+path.workUnitId,query:{projectNo:path.projectNo,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '13-2'://尽调--确认清单
                        this.$router.push({path:'/dueDiligence/confirmRepertoire/'+path.workUnitId,query:{projectNo:path.projectNo,matterNo:path.matterNo,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '13-3'://尽调--确认应答联系人
                        this.$router.push({path:'/dueDiligence/confirmContacts/'+path.workUnitId,query:{ companyId:path.companyId,projectNo:path.projectNo,projectName:path.projectName,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '13-4'://尽调--发布清单
                        this.$router.push({path:'/dueDiligence/publishedPlan/'+path.workUnitId,query:{projectNo:path.projectNo,matterNo:path.matterNo,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '13-5'://尽调--上传资料
                        this.$router.push({path:'/dueDiligence/uploadingFiles/'+path.workUnitId,query:{ companyId:path.companyId,projectNo:path.projectNo,projectName:path.projectName,from:'message',messageMatterStatus:messageMatterStatus}})
                        // this.$router.push({path:'/dueDiligence/uploadingFiles/'+path.workUnitId,query:{projectNo:path.projectNo,from:'message'}})
                        break;
                    case '13-6'://尽调--关联资料
                        this.$router.push({path:'/dueDiligence/auditAndCorrelation/customerData/'+path.workUnitId,query:{projectNo:path.projectNo,matterNo:path.matterNo,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '13-7'://尽调--确认关联
                        this.$router.push({path:'/dueDiligence/confirmRelevance/'+path.workUnitId,query:{projectNo:path.projectNo,matterNo:path.matterNo,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '13-8'://尽调--确认资料
                        this.$router.push({path:'/dueDiligence/confirmInformation/'+path.workUnitId,query:{projectNo:path.projectNo,matterNo:path.matterNo,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '14-2'://管理层访谈--确认计划
                        this.$router.push({path:'/manageInterview/'+path.workUnitId+'/confirmPlan',query:{projectNo:path.projectNo,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '14-4'://管理层访谈--审核结果
                        this.$router.push({path:'/manageInterview/'+path.workUnitId+'/auditInterview',query:{projectNo:path.projectNo,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '15-2'://业务伙伴--确认计划
                        this.$router.push({path:'/partnersInterview/'+path.workUnitId+'/partnersConfirmPlan',query:{projectNo:path.projectNo,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '15-4'://业务伙伴--审核结果
                        this.$router.push({path:'/partnersInterview/'+path.workUnitId+'/partnersAuditInterview',query:{projectNo:path.projectNo,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '16-2'://监管部门--确认计划
                        this.$router.push({path:'/regulatoryInterview/'+path.workUnitId+'/regulatoryConfirmPlan',query:{projectNo:path.projectNo,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '16-4'://监管部门--确认结果
                        this.$router.push({path:'/regulatoryInterview/'+path.workUnitId+'/regulatoryAuditInterview',query:{projectNo:path.projectNo,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '17-3'://网络核查--校验资料
                        this.$router.push({path:'/netCheck/'+path.workUnitId+'/calibration',query:{projectNoDefault:path.projectNo,workUnitId:path.workUnitId,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '17-4'://网络核查--审核资料
                        this.$router.push({path:'/netCheck/'+path.workUnitId+'/auditData',query:{projectNoDefault:path.projectNo,workUnitId:path.workUnitId,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '18-2'://合规证明--确认清单
                        this.$router.push({path:'/complianceCertification/confirmPlans/'+path.workUnitId,query:{projectNo:path.projectNo,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '18-4'://合规证明--审核证明
                        this.$router.push({path:'/complianceCertification/auditCertificate/'+path.workUnitId,query:{projectNo:path.projectNo,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '19-2'://询证--确认清单
                        this.$router.push({path:'/workUnitInquiry/unitConfirm/'+path.workUnitId,query:{projectNo:path.projectNo,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '19-4'://询证--审核回函
                        this.$router.push({path:'/workUnitInquiry/checkRecall/'+path.workUnitId,query:{projectNo:path.projectNo,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                    case '20-2'://自定义--审核资料
                        this.$router.push({path:'/selfDefine/checkFiles/'+path.workUnitId,query:{projectNo:path.projectNo,name:path.projectName,from:'message',messageMatterStatus:messageMatterStatus}})
                        break;
                }
                let options = {
                    noticeIds:val.id
                };
                messageReadApi(options).then((res)=>{
                    if (res.code == 0){
                        this.getData(1)
                        // this.popSuccess('success',res.msg)
                    }
                })
            },
            //titile 返回
            goBack(){
                // let path = window.localStorage.getItem('messageRoute')
                // this.$router.push({path:path})
                this.$router.go(-1)
            },
            resetForm(){
                this.ruleForm.name = ''
                this.ruleForm.startTime = ''
                this.ruleForm.endTime = ''
                this.ruleForm.type = ''
                this.getData(1)
            },
            // handleTime2(val){
            //     this.startTime = val[0]
            //     this.endTime = val[1]
            //     this.getData(1)
            // },
            getstartTime(val){
                this.ruleForm.startTime = val
            },
            getendTime(time) {
                this.ruleForm.endTime = time
            },
            handleName(val){
                this.ruleForm.name = val
                this.getData(1)
            },
            handleClear(){
                this.ruleForm.name = ''
            },
            pageChange(val){
                this.getData(val)
            },
            handleSizeChange(val){
                this.pageSize = val
                this.getData(1)
            },
            handleRead(){
               this.selectRow()
                if (this.count == 1) {
                    let options = {
                        noticeIds:this.getItems.toString()
                    }
                    messageReadApi(options).then((res)=>{
                        if (res.code == 0){
                            this.getData(1)
                            this.popSuccess('success',res.msg)
                            this.showBadge()
                        }
                    })
                }
            },
            handleDelete(){
                if (this.inquiryIds.length!=0){
                    this.$alert('确认删除？', '提示', {
                        type: 'warning',
                        confirmButtonText: '确定',
                        callback: () => {
                            let ids = []
                            this.inquiryIds.forEach(item=>{
                                ids.push(item.id)
                            })
                            let options = {
                                noticeIds:ids
                            }
                            messageDeleteApi(options).then((res)=>{
                                if (res.code == 0){
                                    this.getData(1)
                                    this.popSuccess('success',res.msg)
                                }
                            })
                        }
                    })

                }else{
                    this.$alert('请选择主题！', '提示', {
                        type: 'warning',
                        confirmButtonText: '确定',
                        callback: () => {}
                    })
                }
            },
            handleSelectionChange(val){
                this.multipleSelection = val;
                this.inquiryIds = val
            },
            selectRow(){
                let vm = this;
                vm.getItems=[];
                vm.count = 0
                if (this.inquiryIds.length != 0){
                    this.inquiryIds.forEach(v => {
//                      if (v.is_read === 0 ) {
                        if (v.isRead === 0 ) {
                            vm.getItems.push(v.id)
                            // vm.itemId.push(v.batchNo + '-' + v.websiteId + '-' + v.subjectNo)
                        }
                    })
                    if (vm.getItems.length == 0) {
                        this.$alert('仅可提交未标记项！', '提示', {
                            type: 'warning',
                            confirmButtonText: '确定',
                            callback: () => {}
                        })
                        return false
                    }
                    vm.count = 1
                } else{
                    this.$alert('请选择主题！', '提示', {
                        type: 'warning',
                        confirmButtonText: '确定',
                        callback: () => {}
                    })
                }
            },
            popSuccess(type,message){
                this.$message({
                    type:type,
                    message:message
                })
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import '@/assets/css/varibles.scss';
    .system-message{
        .box {
            overflow: hidden;
            .menu-title{
                float: left;
                margin-left: 50px;
                >p{
                    float: left;
                    display: inline-block;
                    cursor: pointer;
                    font-size: 16px;
                    line-height: 28px;
                    padding-right: 30px;
                    color: #949494;
                    &.active{
                        color: $global-color;
                        text-decoration: underline;
                    }
                }
                >p:after{
                    content: '';
                    position: absolute;
                    background: #969696;
                    height: 10px;
                    margin-top: 10px;
                    margin-left: 10px;
                    width: 2px;
                }
                >p:last-of-type:after{
                    display: none;
                }
            }
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
        .model-search{
            background: #ffffff;
            margin-top: 20px;
            width: 100%;
            box-sizing: content-box;
            padding: 10px;
            padding-top: 20px;
        }
        .message-jump{
            cursor: pointer;
            color: $global-color;
            text-decoration: underline;
        }
        .txt{
            font-weight: bold;
        }
    }
    .mt20{
        margin-top: 20px;
    }
</style>
