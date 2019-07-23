<template>
    <div class="wrap-content">
        <div class="check-plan clearfix">
            <div class="items">
                <div class="bg tab-box">
                    <el-tabs class="tabText" v-model="activeId" @tab-click="changeTab">
                        <el-tab-pane v-for="(item,index) in webSites" :label="item.name" :name="item.id" :key="item.id">
                            <span class="dbl" :class="{'has':item.isClick}" slot="label" @click="gotoLink(item)"> {{item.name}}<i @click.stop="handleMarkDelete(item)" v-if="item.id ==levelId" class="el-icon-circle-close" style="margin-left: 10px;color: red;"></i></span>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
        <div class="check-table clearfix">
            <div class="tab">
                <p v-for="(item,index) in checkList" :class="{active:isActive===index}" :key="index" @click="handleTabChange(index)">{{item.name}}</p>
            </div>
            <div v-if="level=='01'" class="tabBtn">
                <el-button type="primary" v-if="getStatus" @click="handleCertify">合格</el-button>
                <el-button type="danger" v-if="getStatus" @click="handleUncertify">不合格</el-button>
            </div>
        </div>
        <div class="tables clearfix">
            <el-table :data="tableData" v-show="isActive==0" :max-height="getHeight" ref="multipleTable" border @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" @row-click="rowClick" v-loading="loading">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="sortNo" label="序号" width="100" align="center"></el-table-column>
                <el-table-column prop="name" label="一级书面核查文件清单/其他核查手段" align="center">
                    <template slot-scope="scope">
                        <p class="inspect-cursor"  @click="handleModify('01',scope.row)">{{scope.row.name}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="relation" label="关联二级" align="center" width="120"> </el-table-column>
                <el-table-column prop="relationName" label="关联二级书面核查文件清单/其他核查手段" align="center">
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
                        <span v-if="scope.row.status==='01'">未审核</span>
                        <span v-if="scope.row.status==='02'">合格</span>
                    </template>
                </el-table-column>
                <el-table-column  label="操作" align="center" width="160">
                    <template slot-scope="scope">
                        <div class="btns" v-if="getStatus">
                            <span v-if="scope.row.status ==='01'|| scope.row.status ==='03'" @click=handleDelte(scope.row)>删除 </span>
                            <span v-if="scope.row.status ==='01'" @click="handleOneCertify(scope.row)">合格 </span>
                            <span class="un-auth" style="color: red;" v-if="scope.row.status ==='01'" @click="handleOneUncertify(scope.row)">不合格 </span>
                            <!--<span style="text-decoration: none" v-if="scope.row.status=='02'">-</span>-->
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <el-table :data="tableData2" v-show="isActive!=0" :max-height="getHeight"  border :row-class-name="tableRowClassName" v-loading="loading">
                <el-table-column prop="sortNo" label="序号" width="100" align="center"></el-table-column>
                <el-table-column prop="name" label="二级书面核查文件清单/其他核查手段" align="center" width="600"></el-table-column>
                <el-table-column prop="relationFirstNos" label="关联一级" align="center" width="120"> </el-table-column>
                <el-table-column prop="relationFirstNames" align="center" label="关联一级书面核查文件清单/其他核查手段" width="600"> </el-table-column>
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
                <!--<el-table-column prop="type1" label="类型一" align="center" ></el-table-column>-->
                <!--<el-table-column prop="type2" label="类型二" align="center" ></el-table-column>-->
                <!--<el-table-column prop="type3" label="类型三" align="center" ></el-table-column>-->
                <!--<el-table-column prop="type4" label="类型四" align="center" ></el-table-column>-->
            </el-table>

        </div>
        <el-dialog title="不合格原因"  :visible.sync="dialogFormVisible" width="30%" :before-close="handleClose" :close-on-click-modal="false">
            <el-input placeholder="输入长度为100个字符" type="textarea"  rows="4" maxlength="100" v-model="reasonInput"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleCommit" :loading="btnLoading">确 定</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 修改核查手段弹框 -->
        <el-dialog title="修改书面核查文件清单/核查手段" :visible.sync="checkDialog" width="30%" :before-close="handleCheckCancel" :close-on-click-modal="false">
            <div class="inspect-check-dialog">
                <el-row >
                    <el-col :span="7"><h3>一级/二级序号</h3></el-col>
                    <el-col :span="12"><h3>一级/二级核查文件清单/核查手段</h3></el-col>
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
    import { bookMarksList,markApi,scondLevelList,delteApi,checkApi,bookMarkDelete,getModify,modifyOne } from '@/api/inspectionsApi'
    export default {
        name: "checkPlan",
        data(){
            return{
                getHeight:0,
                checkList:[
                    {name:'一级核查计划',label:'1'},
                    {name:'二级核查计划',label:'2'}
                ],
                isActive:0,
                tableData:[],
                tableData2:[],
                loading:false,
                value:'',
                options:[
                    {
                        value: '',
                        label: "全部"
                    },
                    {
                        value: '01',
                        label: "未审核"
                    },
                    {
                        value: '02',
                        label: "合格"
                    },
                    {
                        value: '03',
                        label: "不合格"
                    }
                ],
                webSites:[],
                activeId:'1',
                getIds:'',
                status:'',
                level:'01',
                rowIds:[],
                dialogFormVisible:false,
                reasonInput:'',
                checkIds:[],
                valIds:[],
                pageTotal:0,
                total:0,
                page:1,
                pageSize:10,
                handleIds:[],
                itemId:[],
                count:0,
                btnLoading:false,
                alertDialog:false,
                checkDialog:false,
                showCheckDialog:0,
                form:{
                    name:''
                },
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
          this.getMark()
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
            getMark(){
                let vm = this;
                markApi(vm.$route.params.id).then((res)=>{
                    if (res.code == 0){
                        vm.webSites = res.result
                        if (vm.webSites.length != 0){
                            vm.levelId = res.result[0].id
                            vm.activeId = res.result[0].id
                            vm.getData()
                        }
                        // vm.webSites = res.result
                        // vm.getIds = res.result[0].id
                        // vm.activeId = res.result[0].id
                        // vm.getData()
                    }
                })
            },
            getData(){
                let vm = this;
                vm.loading = false;
                let options = {
                    bookMarkId:vm.levelId,
                    status:vm.value,
                    stept:2,
                    workUnitId:vm.$route.params.id,
                }
                this.loading = false
                bookMarksList(options).then((res)=>{
                    if (res.code == 0){
                        this.showCheckDialog = 0
                        this.loading = false
                        vm.tableData = res.result
                        this.tableData2 = []
                        vm.loading = false
                    }
                })
            },
            getSecondData(){
                let vm = this
                let options = {
                    bookMarkId:vm.getIds,
                    stept:'2',
                    workUnitId:vm.$route.params.id,
                }
                this.loading = true
                scondLevelList(options).then((res)=>{
                    if (res.code == 0){
                        this.loading = false
                        this.tableData = []
                        this.tableData2 = res.result
                    }
                })
            },
            //分页
            pageChange(val){
                this.page = val;
                this.getData()
            },
            handleSizeChange(val){
                this.pageSize = val;
                this.getData()
            },
            handleTabChange(val){
                let vm = this;
                vm.isActive = val
                vm.value = '';
                this.tableData = []
                switch (val) {
                    case 0:
                        vm.level = '01';
                        vm.getData();
                        break;
                    case 1:
                        vm.level = '02';
                        vm.getSecondData();
                        break;
                }
            },
            statusChange(val){
                this.value = val
                this.getData()
            },
            //选中行的时候
            rowClick(val){
                // this.$refs.multipleTable.toggleRowSelection(val)
                // console.log(val)
            },
            //多选
            handleSelectionChange(val){
                this.multipleSelection = val
                this.rowIds = val;

            },
            //删除页签
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
                            this.getMark()
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
            changeTab(val){
                let vm = this;
                vm.isActive = 0;
                vm.getIds = val.name;
                vm.value = '';
                vm.getData();
            },
            gotoLink(val){
                this.levelId = val.id
                this.status = ''
                this.getData()
            },
            handleDelte(val){
                this.showCheckDialog = 1
                let options = {
                    stept:2,
                    id:val.id
                }
                delteApi(options).then((res)=>{
                    if (res.code == 0){
                        this.getData()
                        this.popSuccess('success',res.msg)
                    }
                })
            },
            //合格-单个
            handleOneCertify(val){
                this.showCheckDialog = 1
                this.handleIds = []
                this.handleIds.push(val.id)
                this.toCommit('Y','')
            },
            //不合格-单个
            handleOneUncertify(val){
                this.showCheckDialog = 1
                this.handleIds = []
                this.reasonInput = ''
                this.btnLoading = false
                this.handleIds.push(val.id)
                this.dialogFormVisible = true
            },
            //合格-多个
            handleCertify(){
                let vm = this;
                vm.selectRows();
                if (vm.count == 1){
                    vm.toCommit('Y','')
                }

            },
            //不合格-多个
            handleUncertify(){
                let vm = this;
                vm.selectRows();
                if (vm.count==1 ){
                    vm.dialogFormVisible = true
                    this.reasonInput = ''
                    this.btnLoading = false
                }
            },
            //不合格原因-弹框
            handleCommit(){
                if (this.reasonInput == ''){
                    this.$message({
                        type:'warning',
                        message:'输入不能为空'
                    })
                } else{
                    this.toCommit('N',this.reasonInput)
                }
            },
            //合格、不合格的公用接口
            toCommit(isPass,remark){
                this.btnLoading = true
                let options = {
                    ids:this.handleIds.toString(),
                    isPass:isPass,
                    remark:remark,
                }
                checkApi(options).then((res)=>{
                    if (res.code == 0){
                        this.btnLoading = false
                        this.dialogFormVisible = false
                        this.getData()
                    }
                }).catch((err)=>{
                })
            },
            selectRows(){
                let vm = this;
                vm.handleIds=[];
                vm.count = 0
                if (this.rowIds.length != 0){
                    this.rowIds.forEach(v => {
                        if (v.status == '01') {
                            vm.handleIds.push(v.id)
                            // vm.itemId.push(v.batchNo + '-' + v.websiteId + '-' + v.subjectNo)
                        }
                    })
                    if (vm.handleIds.length == 0) {
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
            getTableHeight(){
                this.getHeight=window.innerHeight-440;
            },
            handleClose(){
                this.dialogFormVisible = false
                this.btnLoading = false
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
                        this.modifyList = []
                        this.checkDialog = false
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
    .btns{
        color: $global-color;
        >span{
            cursor: pointer;
            text-decoration: underline;
            padding: 0 5px;
        }
        .un-auth{
            color: red;
        }
        .btn-none{
            text-decoration: none;
        }
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
<style  rel="stylesheet/scss"  lang="scss">
    @import "@/assets/css/varibles.scss";
    .check-status{
        .el-input__suffix{
            right: 10px;
        }
    }
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
</style>

