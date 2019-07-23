<template>
    <div class="wrap-content">
        <div class="ins-upload clearfix">
            <div class="big-btns"  v-if="getStatus">
                <upload-pic accept=".xlsx, .xls" @uploadSuccess="fillUpload" >
                    <div class="upload">
                        <span>导入页签</span>
                    </div>
                </upload-pic>
            </div>
            <div  class="second-up"  v-if="getStatus">
                <upload-pic accept=".xlsx, .xls" @uploadSuccess="fillUpload2">
                    <div class="upload">
                        <span>导入查验计划</span>
                    </div>
                </upload-pic>
            </div>
            <div class="export">
                <el-button type="primary" @click="handleExport">导出查验计划</el-button>
            </div>
            <div class="handle-btn">
                <span  @click="handleDownload">下载查验计划模板</span>
                <span @click="handleMarkDownload">下载页签模板</span>
            </div>

        </div>
        <div class="tab-change">
            <div class="tab-list clearfix" v-if="isActive == 0">
                <div class="items">
                    <div class="bg tab-box">
                        <el-tabs class="tabText" v-model="activeId" @tab-click="changeTab">
                            <el-tab-pane v-for="(item,index) in webSites" :label="item.name" :name="item.id" :key="index">
                                <span class="dbl" :class="{'has':item.isClick}" slot="label" @click="handleTab(item)"> {{item.name}}<i @click.stop="handleMarkDelete(item)"  v-if="item.id ==levelId" class="el-icon-circle-close" style="margin-left: 10px;color: red;"></i></span>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
                <div class="last" >
                    <el-button v-if="getStatus" type="primary" class="fr" @click="mulCheck">提交审核</el-button>
                </div>
            </div>
            <div class="check-plan clearfix" v-else>
                <div class="items">
                    <div class="bg tab-box">
                        <el-tabs class="tabText" v-model="activeId"  @tab-click="changeTab">
                            <el-tab-pane v-for="(item,index) in webSites" :label="item.name" :name="item.id" :key="item.id">
                                <span class="dbl" :class="{'has':item.isClick}" slot="label" @click="handleTab(item)">{{item.name}} <i @click.stop="handleMarkDelete(item)" v-if="item.id ==levelId" class="el-icon-circle-close" style="margin-left: 10px;color: red;"></i></span>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </div>
        <div class="tab-table clearfix">
            <p v-for="(item,index) in tabList" :class="{active:isActive===index}" :key="index" @click="handleTabChange(index)">{{item.name}}</p>
        </div>
        <div class="tables clearfix">
            <el-table :data="tableData" v-show="isActive==0" :max-height="getHeight" ref="multipleTable" border @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" @row-click="rowClick" v-loading="loading">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="sortNo" label="序号" width="100" align="center"></el-table-column>
                <el-table-column prop="name" label="一级书面核查文件清单/其他核查手段" align="center" width="300">
                    <template slot-scope="scope">
                        <p class="inspect-cursor"  @click="handleModify('01',scope.row)">{{scope.row.name}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="relation" label="关联二级" align="center" width="120"> </el-table-column>
                <el-table-column prop="relationName" label="关联二级书面核查文件清单/其他核查手段" align="center" width="300">
                    <template slot-scope="scope">
                        <p class="inspect-cursor" @click="handleModify('02',scope.row)">{{scope.row.relationName}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="核验要求" align="center" >
                    <template slot-scope="scope">
                        <div v-if="scope.row.type =='1'">
                            <p>原件</p>
                            <p>证明与原件一致的复印件</p>
                            <p>通过其他补充核查方式确认</p>
                        </div>
                        <div v-if="scope.row.type =='2'">
                            <p>已制作笔录</p>
                            <p>调查律师已签名</p>
                            <p>被调查自然人或单位负责人已签名</p>
                            <p>拒绝签名的已注明原因</p>
                        </div>
                        <div v-if="scope.row.type =='3'">
                            <p>已进行网页截屏</p>
                        </div>
                        <div v-if="scope.row.type =='4'">
                            <p><span>函证比例{{scope.row.proofRequest}}%</span></p>
                            <p><span>回函比例{{scope.row.proofResponse}}%</span></p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="200">
                    <template slot-scope="scope" slot="header">
                        <div class="check-title">状态</div>
                        <el-select class="check-status" v-model="value" size="mini" @change="statusChange" placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </template>
                    <template slot-scope="scope" >
                        <div v-if="scope.row.status==='03'">
                            <el-popover placement="top" width="330" trigger="hover" popper-class="popover">
                                <div class="reason">
                                    <div class="title">不合格</div>
                                    <div><p>{{scope.row.auditRemark}}</p></div>
                                    <div>
                                        <span>{{scope.row.auditUserName}}</span>
                                        <span>{{scope.row.auditTime}}</span>
                                    </div>
                                </div>
                                <div class="danger" slot="reference">
                                    不合格
                                    <i style="font-size: 14px;" class="el-icon-info"></i>
                                </div>
                            </el-popover>
                            <!--<span v-if="scope.row.createStatus===4" class="table-comfirm">不合格</span>-->
                        </div>
                        <span v-if="scope.row.status==='00'">未提交</span>
                        <span v-if="scope.row.status==='01'">已提交</span>
                        <span v-if="scope.row.status==='02'">合格</span>
                    </template>
                </el-table-column>
                <el-table-column  label="操作" align="center" width="140">
                    <template slot-scope="scope">
                        <div class="btns"  v-if="scope.row.status ==='00' ||scope.row.status=='03'">
                            <span @click="handlDelete(scope.row)" v-if="getStatus">删除 </span>
                            <span @click="handlseCertify(scope.row)" v-if="getStatus">提交审核 </span>
                            <!--<span v-if="scope.row.status=='02' || scope.row.status=='01'" style="text-decoration: none">- </span>-->
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-table :data="tableData2" v-show="isActive!=0" :max-height="getHeight"  border :row-class-name="tableRowClassName" v-loading="loading">
                <!--<el-table-column type="selection" width="55" v-if="isActive!=0" align="center"></el-table-column>-->
                <el-table-column prop="sortNo" label="序号" width="100" align="center"></el-table-column>
                <el-table-column prop="name" label="二级书面核查文件清单/其他核查手段" align="center" width="600"></el-table-column>
                <el-table-column prop="relationFirstNos" label="关联一级" align="center" width="120"></el-table-column>
                <el-table-column prop="relationFirstNames" label="关联一级书面核查文件/其他核查手段" align="center" width="600"></el-table-column>
                <el-table-column prop="type" label="核验要求" align="center" >
                    <template slot-scope="scope">
                        <div v-if="scope.row.type =='1'">
                            <p>原件</p>
                            <p>证明与原件一致的复印件</p>
                            <p>通过其他补充核查方式确认</p>
                        </div>
                        <div v-if="scope.row.type =='2'">
                            <p>已制作笔录</p>
                            <p>调查律师已签名</p>
                            <p>被调查自然人或单位负责人已签名</p>
                            <p>拒绝签名的已注明原因</p>
                        </div>
                        <div v-if="scope.row.type =='3'">
                            <p>已进行网页截屏</p>
                        </div>
                        <div v-if="scope.row.type =='4'">
                            <p><span>函证比例{{scope.row.proofRequest}}%</span></p>
                            <p><span>回函比例{{scope.row.proofResponse}}%</span></p>
                        </div>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="type" label="核验要求" align="center" >-->
                    <!--<template slot-scope="scope">-->
                        <!--<div v-if="scope.row.typeA ==1">-->
                            <!--<span v-if="scope.row.verificationA==11">原件</span>-->
                            <!--<span v-if="scope.row.verificationA==12">证明与原件一致的复印件</span>-->
                            <!--<span v-if="scope.row.verificationA==13">通过其他补充核查方式确认</span>-->
                        <!--</div>-->
                        <!--<div v-if="scope.row.typeA ==2">{{scope.row.verificationA}}</div>-->
                        <!--<div v-if="scope.row.typeA ==3">-->
                            <!--<span v-if="scope.row.verificationA==31">已进行网页截屏</span>-->
                        <!--</div>-->
                        <!--<div v-if="scope.row.typeA ==4">-->
                            <!--<p><span>函证比例{{scope.row.proofRequestA}}%</span></p>-->
                            <!--<p><span>回函比例{{scope.row.proofResponseA}}%</span></p>-->
                        <!--</div>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column prop="type1" label="类型一" align="center" ></el-table-column>-->
                <!--<el-table-column prop="type2" label="类型二" align="center" ></el-table-column>-->
                <!--<el-table-column prop="type3" label="类型三" align="center" ></el-table-column>-->
                <!--<el-table-column prop="type4" label="类型四" align="center" ></el-table-column>-->
            </el-table>
        </div>
        <download :path="downloadPath" :name="downloadName" @downloadDone="downloadDone"/>
        <el-dialog title="提示" :visible.sync="alertDialog" width="30%" :before-close="handleClose" :close-on-click-modal="false">
            <span>是否覆盖已有标签？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleConfirm">覆 盖</el-button>
                <el-button @click="handleUncomfirm">不覆盖</el-button>
              </span>
        </el-dialog>
        <!-- 修改核查手段弹框 -->
        <el-dialog title="修改书面核查文件清单/核查手段" :visible.sync="checkDialog" width="30%" :before-close="handleCheckCancel" :close-on-click-modal="false">
            <div class="inspect-check-dialog">
                <el-row >
                    <el-col :span="7"><h4>一级/二级序号</h4></el-col>
                    <el-col :span="12"><h4>一级/二级核查文件清单/核查手段</h4></el-col>
                </el-row>
                <el-form ref="form" :model="form" label-width="100px" class="mt10">
                    <div  v-for="(item,index) in modifyList" :key="index">
                        <el-form-item :label="item.sortNo">
                            <el-input v-model="item.name" @keyup.enter.native="handleCheckConfirm"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                 <el-button type="primary" @click="handleCheckConfirm">确 定</el-button>
                <el-button @click="handleCheckCancel">取 消</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        downloadApi,
        deleteApi,
        bookMarksList,
        checkInfo,
        importApi,
        markApi,
        oneCertifyApi,
        getUrlType,
        getWorkUnitId,
        bookMarkDelete,
        exportInterview,
        exportSecond,
        scondLevelList,
        delteApi,importMarkApi,
        modifyOne,
        getModify } from '@/api/inspectionsApi'
    import uploadPic from '@/components/upload'
    import download from "@/components/download"
    import { MessageBox } from "element-ui";
    export default {
        name: "inspectionCreate",
        components:{
            uploadPic,
            download
        },
        data(){
            return{
                tabList:[
                    {name:'一级核查计划',label:'01'},
                    {name:'二级核查计划',label:'02'}
                ],
                options:[
                    {label:'全部',value:''},
                    {label:'合格',value:'02'},
                    {label:'不合格',value:'03'},
                    {label:'未提交',value:'00'},
                    {label:'已提交',value:'01'},
                ],
                value:'',
                isActive:0,
                loading:false,
                show:true,
                multipleSelection:[],
                tableData:[],
                tableData2:[],
                webSites:[],
                activeId:'',
                rowId:'',
                ids:[],
                type:'01',
                getId:'1',
                status:'',
                getTabId:'',
                pageTotal:0,
                total:0,
                page:1,
                pageSize:20,
                downloadPath:'',
                downloadName:'',
                baseUrl:'',
                getInquiry:[],
                tabId:'',
                levelId:'',
                getIds:[],
                count:0,
                getHeight:0,
                alertDialog:false,
                markFilePath:'',
                markTag:false,
                checkDialog:false,
                form:{
                    name:''
                },
                showDialog:0,
                modifyList:[],
                modifyLevel:'',
            }
        },
        computed: {
            getStatus() {
                if (this.$route.query.status == 2 || this.$route.query.messageMatterStatus){
                    return false
                } else {
                    return true
                }
            }
        },
        mounted(){
            this.baseUrl = process.env.VUE_APP_BASEURL;
            this.uploadAction = process.env.VUE_APP_UPLOAD;
            this.getMarks();
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
            popSuccess(type,message){
              this.$message({
                  type:type,
                  message:message
              })
            },
            getTableHeight(){
                this.getHeight=window.innerHeight-440;
            },
            getMarks(){
                let vm = this
                markApi(this.$route.params.id).then((res)=>{
                    // if (res.code == 0){
                    //     if (res.result == '') {
                    //         this.$alert('请导入页签！', '提示', {
                    //             type: 'warning',
                    //             confirmButtonText: '确定',
                    //             callback: () => {
                    //             }
                    //         })
                    //     }else{
                        this.webSites = [];
                        setTimeout(function(){
                            vm.webSites = res.result
                            if (vm.webSites.length != 0){
                                vm.levelId = res.result[0].id
                                vm.activeId = res.result[0].id
                                vm.getData()
                            }
                        },0)

                        // }
                    // }
                })
            },
            getData(){
                let vm = this;
                vm.loading = false
                let options = {
                    bookMarkId:vm.levelId,
                    status:vm.status,
                    stept:'1',
                    workUnitId:vm.$route.params.id,
                }
                bookMarksList(options).then((res)=>{
                    if (res.code == 0){
                        this.tableData2 = []
                        vm.tableData = res.result
                        vm.showDialog = 0
                        vm.loading = false
                    }
                })
            },
            getSecondData(){
                let vm = this
                let options = {
                    bookMarkId:vm.levelId,
                    stept:1,
                    workUnitId:vm.$route.params.id,
                }
                this.loading = false
                scondLevelList(options).then((res)=>{
                    if (res.code == 0){
                        this.loading = false
                        this.tableData = []
                        this.tableData2 = res.result
                    }
                })
            },
            statusChange(val){
                this.status = val
                this.getData()
            },
            pageChange(val){
                this.page = val
                this.getData()
            },
            handleSizeChange(val){
                this.pageSize = val
                this.getData()
            },
            handleTabChange(val){
                let vm = this;
                this.isActive = val;
                switch (val) {
                    case 0:
                        vm.status = '';
                        vm.getData();
                        break;
                    case 1:
                        vm.status = '';
                        vm.getSecondData()
                        break;
                }
            },
            //选中行的时候
            rowClick(val){
                // if (this.showDialog == 0){
                //     if (val.status == '03' || val.status == '00'){
                //         this.checkDialog = true
                //     }
                // }

                // this.$refs.multipleTable.toggleRowSelection(val)
                // console.log(val)
                // this.rowId = val.checkFirst
            },
            //多选
            handleSelectionChange(val){
                this.getInquiry = []
                this.multipleSelection = val
                this.ids = val
                this.getInquiry = val
            },
            tableRowClassName({row, rowIndex}) {
                if (row.status === '03') {
                    return 'warnResult'
                }else{
                    return ''
                }
            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            fillUpload2(path,name){
                if (this.webSites == ''){
                    this.$alert('请先导入页签！', '提示', {
                        type: 'warning',
                        confirmButtonText: '确定',
                        callback: () => {
                        }
                    })
                } else{
                    let options={
                        // bookmarkId:this.levelId,
                        filePath: path,
                        workUnitId : this.$route.params.id,
                    }
                    // this.inspectDialog = true
                    this.upload(options)
                }
            },
            upload(options){
                importApi(options).then(res=>{
                    if(res.code==0){
                        this.$message({
                            type:'success',
                            message:'上传成功！'
                        })
                        this.getData()
                    }
                })
            },
            //页签导入
            fillUpload(path,name){
                this.markFilePath = path
                this.markTag = true
                if (this.webSites == ''){
                    let options = {
                        filePath:path,
                        flag:'00',
                        workUnitId:this.$route.params.id
                    }
                    this.markGet(options)
                } else{
                    this.alertDialog = true
                }
            },
            markGet(val){
                importMarkApi(val).then((res)=>{
                    if (res.code == 0){
                        this.getMarks()
                        this.markTag = false
                        this.alertDialog = false
                        this.popSuccess('success',res.msg)
                    }else{
                        this.getMarks()
                    }
                })
            },
            handleClose(){
                this.alertDialog = false
                this.$message('导入已取消!');
            },
            //导入不覆盖
            handleUncomfirm(){
                let options = {
                    filePath:this.markFilePath,
                    flag:'00',
                    workUnitId:this.$route.params.id
                }
                this.markGet(options)
            },
            handleConfirm(){
                let options = {
                    filePath:this.markFilePath,
                    flag:'01',
                    workUnitId:this.$route.params.id
                }
                this.markGet(options)
            },

            handleDownload(){
                this.download(this.baseUrl,'查验计划模板.xls','Template')
                // downloadApi('','','Template')
            },

            gotoLink(item,index){
                this.tabId = item.id
            },
            handleTab(val){
                this.levelId = val.id
                this.status = ''
                this.getData()
            },
            mulCheck(){
                let vm = this;
                vm.selectRows();
                if (vm.count==1){
                    vm.certify(vm.getIds)
                }
            },
            selectRows(){
                let vm = this;
                vm.getIds=[];
                vm.count = 0
                if (this.ids.length != 0){
                    this.ids.forEach(v => {
                        if (v.status == '00') {
                            vm.getIds.push(v.id)
                            // vm.itemId.push(v.batchNo + '-' + v.websiteId + '-' + v.subjectNo)
                        }
                    })

                    if (vm.getIds.length == 0) {
                        this.$alert('仅可以提交状态为未提交选项！', '提示', {
                            type: 'warning',
                            confirmButtonText: '确定',
                            callback: () => {}
                        })
                        return false
                    }
                    // this.submitCheck(i.join(','))
                    vm.count = 1
                } else {
                    this.$alert('请选择要提交审核的项！', '提示', {
                        type: 'warning',
                        confirmButtonText: '确定',
                        callback: () => {
                        }
                    })
                }
            },
            //删除
            handlDelete(val){
                this.showDialog = 1
                let options = {
                    id:val.id,
                    stept :1,
                }
                delteApi(options).then((res)=>{
                    if (res.code == 0){
                        this.popSuccess('success',res.msg)
                        this.getData()
                    }
                })
            },
            //提交审核
            handlseCertify(val){
                this.certify(val.id)
                this.showDialog  = 1
            },
            certify(val){
                let vm = this;
                oneCertifyApi(val.toString()).then((res)=>{
                    if (res.code == 0) {
                        vm.getData()
                        vm.$message({
                            type:'success',
                            message:res.msg
                        })
                    }else{
                        vm.$message({
                            type:'warning',
                            message:res.msg
                        })
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            changeTab(tab, event){
                let vm = this;
                vm.isActive = 0;
                vm.status = '';
                vm.getId = tab.paneName
                vm.getData()
            },
            //页签删除
            handleMarkDelete(val){
                this.$confirm('确认删除页签！', '提示', {
                    type: 'warning',
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                }).then(()=>{
                    let options = {
                        bookMarkId:val.id,
                        workUnitId:this.$route.params.id
                    }
                    bookMarkDelete(options).then((res)=>{
                        if (res.code == 0){
                            this.getMarks()
                            this.$message({
                                type: 'success',
                                message: res.msg
                            });
                        }
                    })
                }).catch(()=>{
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                })

            },
            //页签下载
            handleMarkDownload(){
                this.download(this.baseUrl,'页签模板.xls','markDownLoad')
            },
            //导出
            handleExport(){
                if (this.getInquiry.length) {
                    let interviewId = [];
                    this.getInquiry.forEach(v => {
                        interviewId.push(v.id);
                    });
                    if (this.isActive == 1){
                        let interviewId = [];
                        this.getInquiry.forEach(v => {
                            interviewId.push(v.sortNo);
                        });
                        let options = {
                            sortNos: interviewId,
                            bookMarkId:this.levelId,
                            stept:1,
                            workUnitId:this.$route.params.id,
                        }
                        exportSecond(options).then(res => {
                            this.download(
                                this.baseUrl,
                                "查验计划.xls",
                                "third",
                                interviewId.toString()
                            );
                        });
                    }else{
                        let options = {
                            ids: interviewId.toString(),
                        }
                        exportInterview(options).then(res => {
                            this.download(
                                this.baseUrl,
                                "查验计划.xls",
                                "InterviewPlan",
                                interviewId.toString()
                            );
                        });
                    }

                } else {
                    MessageBox.alert("请选择计划", "提示", {
                        type: "warning",
                        confirmButtonText: "确定",
                        callback: () => {}
                    });
                    return false;
                }
            },
            downloadDone(){
                this.downloadName = "";
                this.downloadPath = "";
            },
            download(url, fileName, type, interviewId) {
                //下载文件公用方法，根据传入的type定义不同的下载地址
                let downloadUrl = url;
                switch (
                    type //判断下载的类型，Template（下载访谈计划模板），InterviewPlan（导出/下载访谈计划）
                    ) {
                    case "Template":
                        downloadUrl = "/checkPlanInfo" + getUrlType() + "/download";
                        break;
                    case "InterviewPlan":
                        downloadUrl = '/checkPlanInfo/export?ids='+interviewId;
                        break;
                    case "third":
                        downloadUrl = '/checkPlanInfo/exportSecond?bookMarkId='+this.levelId+'&sortNos='+interviewId+'&stept=1&workUnitId='+this.$route.params.id;
                        break;
                    case 'markDownLoad':
                        downloadUrl = "/checkPlanInfo" + getUrlType() + "/downloadBookMarks";
                        break;
                    default:
                }
                if (this.downloadPath != "") {
                    //如果当前有下载任务给出提示
                    console.log("正在下载请稍后...");
                    return false;
                } else {
                    //设置下载名称和下载地址，当downloadPath改变并且不为空时，会下载文件
                    this.downloadName = fileName;
                    this.downloadPath = downloadUrl;
                }
            },
            handleModify(val,row){
               if (row.status == '00' || row.status=='03'){
                   this.modifyList = []
                   this.modifyLevel = val
                   getModify({id:row.id,level:val}).then((res=>{
                       if (res.code == 0){
                           this.modifyList = res.result
                           this.checkDialog = true
                       }
                   }))
               }
               // if (val == '01'){
               //     this.modifyList.push({sortNo:row.sortNo,name:row.name})
               // } else{
               //
               // }

            },
            //核验要求修改--确认
            handleCheckConfirm(){
                let listName = []
                this.modifyList.forEach(item=>{
                    listName.push(item.name)
                })
                let options = {
                    id:this.modifyList[0].id,
                    level:this.modifyLevel,
                    name:listName.toString()
                }
                modifyOne(options).then((res)=>{
                    if (res.code == 0){
                        this.getData()
                        this.checkDialog = false
                        this.modifyList = []
                    }
                })
            },
            handleCheckCancel(){
                this.modifyList = []
                this.checkDialog = false
            }
        }
    }
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    @import "inspectionCreate";
    .handle-btn{
        >span{
            cursor: pointer;
            font-size: 14px;
        }
        >span:first-of-type{
            margin-right: 20px;
        }
    }
    .inspect-float{
        >p{
            display: inline-block;
        }
        >p:last-of-type{
            margin-left: 30px;
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss">
    .items{
        .el-tabs__nav-next, .el-tabs__nav-prev{
            margin-top: 6px;
        }
    }
</style>
<style lang="scss">
    @import "@/assets/css/varibles.scss";
    .el-table tr.warnResult {
        background: #FFC;
        position: relative;
        td {
            border-bottom-color: #EC395A;
            border-top: 1px solid #EC395A;

            &:first-child {
                border-left: 1px solid #EC395A;
            }

            &:last-child {
                border-right: 1px solid #EC395A;
            }
        }
    }
    .reason {
        padding-bottom: 10px;
        >span {
            display: block;
            margin: 30px 40px 20px;

        }
        >div:nth-of-type(2){
            padding: 20px;
            word-wrap: break-word;
        }
        >div:last-of-type{
            float: right;
            padding: 20px;
            >span:first-of-type{
                margin-right: 20px;
            }
        }
        >.time {
            color: #62656c;
            text-align: right;
            font-size: 12px;
            padding-right: 16px;
        }

        >.title {
            position: relative;
            font-size: 16px;
            font-weight: 600;
            color: #424242;
            background: #ecf1f4;
            padding: 6px 28px;

            &::before {
                content: '';
                height: 16px;
                width: 4px;
                position: absolute;
                top: 50%;
                margin-top: -8px;
                left: 15px;
                background: $global-color;
            }
        }
    }
    .second-up{
        background: $global-color;
        border-radius: 20px;
        box-sizing: border-box;
        padding: 10px 20px;
        margin-right: 16px;
        .upload{
            padding-top: -6px;
        }
    }
    .inspect-inner-table{
        width: 100%;
        overflow-y: auto;
    }
    .inspect-check-dialog{
        h3{
            font-weight: bold;
        }
    }
    .mt10{
        margin-top: 20px;
    }
    .inspect-cursor{
        cursor: pointer;
    }
</style>
