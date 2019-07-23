<template>
    <div class="wrap-content">
        <div class="result-select">
            <div>
                <span>一级名称</span>
                <el-autocomplete
                    class="search-input"
                    clearable
                    style="width: 350px;"
                    v-model="oneName"
                    @clear="handleClear"
                    @keyup.enter.native="handleSearch"
                    :fetch-suggestions="querySearchAsync"
                    @select="handleSelect"
                ></el-autocomplete>
            </div>
            <div>
                <span>二级名称</span>
                <el-autocomplete
                    class="search-input"
                    clearable
                    style="width: 350px;"
                    v-model="twoName"
                    @clear="handleClear2"
                    @keyup.enter.native="handleSearch"
                    :fetch-suggestions="querySearchAsync2"
                    @select="handleSelect2"
                ></el-autocomplete>
            </div>
            <div>
                <span>状态</span>
                <el-select v-model="status" @change="handleStatus" placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div style="float: right;">
                <el-button type="primary" @click="handleSearch">搜索</el-button>
                <el-button type="danger" @click="handleReset">重置</el-button>
            </div>
        </div>
        <div class="check-plan clearfix" style="margin: 20px 0;">
            <div class="items">
                <div class="bg tab-box">
                    <el-tabs class="tabText" v-model="activeId" @tab-click="changeTab">
                        <el-tab-pane v-for="(item,index) in webSites" :label="item.name" :name="item.id" :key="item.id">
                            <span class="dbl" :class="{'has':item.isClick}" slot="label" @click="handleTab(item)"> {{item.name}}</span>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
        <div class="check-table clearfix">
            <div style="margin: -10px 0;">
                <el-button type="primary" @click="handleDownloadAll">下载整个表格</el-button>
                <el-button type="primary" @click="handleAuth" v-if="getStatus">合格</el-button>
                <el-button type="danger" @click="handleUnauth" v-if="getStatus">不合格</el-button>
                <!--<p>合格</p>-->
                <!--<p>不合格</p>-->
            </div>
        </div>

        <div class="tables clearfix">
            <el-table :data="tableData"  :max-height="getHeight" ref="multipleTable" border @selection-change="handleSelectionChange" @row-click="rowClick" :row-class-name="tableRowClassName" v-loading="loading" @expand-change="expandChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="序号1" prop="sortNoA" align="center"></el-table-column>
                <el-table-column label="一级书面核查文件清单/其他核查手段" prop="nameA" align="center" width="300"></el-table-column>
                <el-table-column label="是否取得/实施" prop="implFlagA" align="center" width="120">
                    <template slot-scope="scope" v-if="scope.row.nameA !=''">
                        <el-radio-group  v-model="scope.row.implFlagA">
                            <el-radio style="line-height: 1.5!important;" :label="item.value" @change="handleGet(item,scope.row,'01')" :key="item.value" :value="item.value" v-for="item in radios" >{{item.label}}</el-radio>
                        </el-radio-group>
                    </template>
                </el-table-column>
                <el-table-column label="说明与备注" prop="implFlagCommentA" align="center" width="120" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="文件来源" prop="fileSourceA" align="center" width="240">
                    <template slot-scope="scope" v-if="scope.row.nameA !=''">
                        <el-select
                                style="width: 220px;"
                                v-model="scope.row.fileSourceA"
                                filterable
                                :filter-method="filterMethod"
                                @change="handleSelectChange"
                                @focus="handleSelectSecond(scope.row)"
                                placeholder="请选择">
                            <el-option
                                    v-for="item in getSelect"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="说明与备注" prop="fileSourceCommentA" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="核验要求" prop="verificationA" align="center" width="220">
                    <template slot-scope="scope" v-if="scope.row.nameA !=''">
                        <div v-if="scope.row.typeA == '1'">
                            <el-radio-group  v-model="scope.row.verificationA" >
                                <el-radio style="line-height: 1.5!important;float: left;!important;" :label="item.value" @change="handleVerfication(item.value,scope.row,'01')" :key="item.value" :value="item.value" v-for="item in firstRadios" >{{item.label}}</el-radio>
                            </el-radio-group>
                        </div>
                        <div v-if="scope.row.typeA == '2'">
                            <el-checkbox-group v-model="secondRadios2">
                                <el-checkbox style="line-height: 1.5!important;float: left;!important;"  v-for="(item,index) in secondRadios" :key="index" :label="item" @change="handleVerficationTest(item,scope.row,'01')">{{item}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div v-if="scope.row.typeA == '3'">
                            <el-radio-group  v-model="scope.row.verificationA">
                                <el-radio style="float: left;!important;" label="已进行网页截屏" value="4"  @change="handleVerfication(31,scope.row,'01')"></el-radio>
                            </el-radio-group>
                        </div>
                        <div v-if="scope.row.typeA == '4'">
                            <div>
                                <p class="inputMt">函证比例：<el-input style="width: 60px;"  maxlength="3"  type="text" v-model="scope.row.proofRequestA" @change="handleInput($event,scope.row,4,'01')"></el-input>%</p>
                                <p>回函比例：<el-input style="width: 60px;" maxlength="3"  type="text"  v-model="scope.row.proofResponseA" @change="handleInput($event,scope.row,5,'01')"></el-input>%</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="说明与备注" prop="verificationCommentA" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="已关联文件" prop="verificationCommentA" align="center" width="100">
                    <template slot-scope="scope" v-if="scope.row.nameA !=''">
                        <div class="btns">
                            <span  @click="handleViewFile(1,scope.row)">查看文件</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="statusA" align="center">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="scope.row.statusA == '00'">待提交</span>
                            <span v-if="scope.row.statusA == '01'">待审核</span>
                            <span v-if="scope.row.statusA == '03'">不合格</span>
                            <span v-if="scope.row.statusA == '02'">合格</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" prop="index" align="center" width="110">
                    <template slot-scope="scope">
                        <div class="btns" v-if="scope.row.statusA == '00'||scope.row.statusA=='01'">
                            <span @click="handleOneAuth(scope.row,'01')">合格</span>
                            <span style="color: red;" @click="handleOneUnauth(scope.row,'01')">不合格</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="index" align="center" width="50">
                    <template slot-scope="scope" slot="header">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
                    </template>
                    <template slot-scope="scope">
                        <div class="table-checkbox-item">
                            <el-checkbox v-model="checkAllList" :label="scope.row.idB"  @change="handleCheckTitle($event,scope.row.idB)"></el-checkbox>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="序号2" prop="sortNoB" align="center"></el-table-column>
                <el-table-column label="二级书面核查文件清单/其他核查手段" prop="nameB" align="center" width="300"></el-table-column>
                <el-table-column label="是否取得/实施" prop="implFlagB" align="center" width="120">
                    <template slot-scope="scope" v-if="scope.row.nameB !=''">
                        <el-radio-group  v-model="scope.row.implFlagB">
                            <el-radio style="line-height: 1.5!important;" :label="item.value" @change="handleGet(item,scope.row,'02')" :key="item.value" :value="item.value" v-for="item in radios" >{{item.label}}</el-radio>
                        </el-radio-group>
                    </template>
                </el-table-column>
                <el-table-column label="说明与备注" prop="implFlagCommentB" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="文件来源" prop="fileSourceB" align="center" width="240" >
                    <template slot-scope="scope" v-if="scope.row.nameB !=''">
                        <el-select
                                style="width: 220px;"
                                v-model="scope.row.fileSourceB"
                                filterable
                                :filter-method="filterMethod"
                                @change="handleSelectChange2"
                                @focus="handleSelectSecond2(scope.row)"
                                placeholder="请选择">
                            <el-option
                                    v-for="item in getSelect"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="说明与备注" prop="fileSourceCommentB" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="核验要求" prop="fileSourceCommentB" align="center" width="220">
                    <template slot-scope="scope" v-if="scope.row.nameB !=''">
                        <div v-if="scope.row.typeB == '1'">
                            <el-radio-group  v-model="scope.row.verificationB">
                                <el-radio style="line-height: 1.5!important;float: left;!important;" :label="item.value" @change="handleVerfication(item.value,scope.row,'02')" :key="item.value" :value="item.value" v-for="item in firstRadios" >{{item.label}}</el-radio>
                            </el-radio-group>
                        </div>
                        <div v-if="scope.row.typeB == '2'">
                            <el-checkbox-group   v-model="scope.row.verificationB">
                                <el-checkbox style="float: left;!important;" v-for="(item,index) in secondRadios" :label="item" :key="item" @change="handleMoreVerfication('1'+(index+1),scope.row)">{{item}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div v-if="scope.row.typeB == '3'">
                            <el-radio-group  v-model="scope.row.verificationB">
                                <el-radio style="float: left;!important;" label="已进行网页截屏" value="31"  @change="handleVerfication('31',scope.row,'02')"></el-radio>
                            </el-radio-group>
                        </div>
                        <div v-if="scope.row.typeB == '4'">
                            <div>
                                <p class="inputMt">函证比例：<el-input style="width: 60px;"  maxlength="3"  type="text" v-model="scope.row.proofRequestB" @change="handleInput($event,scope.row,4,'02')"></el-input>%</p>
                                <p>回函比例：<el-input style="width: 60px;" maxlength="3"  type="text"  v-model="scope.row.proofResponseB" @change="handleInput($event,scope.row,5,'02')"></el-input>%</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="说明与备注" prop="verificationCommentB" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="已关联文件" prop="verificationCommentB" align="center" width="100">
                    <template slot-scope="scope" v-if="scope.row.nameB !=''">
                        <div class="btns">
                            <span  @click="handleViewFile(2,scope.row)">查看文件</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="index" align="center">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="scope.row.statusB == '00'">待提交</span>
                            <span v-if="scope.row.statusB == '01'">待审核</span>
                            <span v-if="scope.row.statusB == '03'">不合格</span>
                            <span v-if="scope.row.statusB == '02'">合格</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" prop="index" align="center" width="110">
                    <template slot-scope="scope">
                        <div class="btns" v-if="scope.row.statusB == '00' ||scope.row.statusB == '01'">
                            <span @click="handleOneAuth(scope.row,'02')">合格</span>
                            <span style="color: red;" @click="handleOneUnauth(scope.row,'02')">不合格</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <common-dialog  :options="options1"></common-dialog>
        <common-dialog  :options="options2"></common-dialog>
        <common-dialog  :options="options3"></common-dialog>
        <el-dialog title="下载整个表格" :visible.sync="downloadAllDialog" width="40%" :before-close="handleDownladCancel" :close-on-click-modal="false">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="核查结论">
                    <el-input type="textarea" rows="3" row="4" v-model="form.result" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="注释1" >
                    <el-input type="textarea" rows="3" v-model="form.remark1" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="注释2" >
                    <el-input type="textarea" rows="3" v-model="form.remark2" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="注释3">
                    <el-input type="textarea" rows="3" v-model="form.remark3" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="注释4">
                    <el-input type="textarea" rows="3" v-model="form.remark4" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="注释5">
                    <el-input type="textarea" rows="3" v-model="form.remark5" maxlength="100"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmit('form')">下 载</el-button>
                <el-button @click="handleDownladCancel">取 消</el-button>
              </span>
        </el-dialog>
        <download :path="downloadPath" :name="downloadName" @downloadDone="downloadDone"/>
        <!--查看列表弹框-->
        <el-dialog :visible.sync="dialogTableVisible" title="已关联文件" :show-close="false" class="viewDialog" :modal="false">
            <div class="dia-content clearfix">
                <div class="dia-list clearfix">
                    <div class="dia-title clearfix">
                        <p></p>
                        <p>文件列表</p>
                        <p @click="showVisible"><i class="el-icon-close"></i></p>
                    </div>
                    <div class="recal-number">
                        <p>文件数<span>{{secondList}}</span>份</p>
                    </div>
                    <div v-for="(item,index) in recalList" :key="index" class="recal-content">
                        <p class="recal-title" @click="handleFileView(item)" :title="item.fileName">{{item.fileName}}</p>
                        <p>---------------</p>
                        <p>{{item.createUserName}}</p>
                        <p>{{item.createTime}}</p>
                        <p>上传</p>
                        <!--<p v-if="(showCancel===4 || showCancel === 1)&&getStatus"  class="recal" @click="handleDelete(item,index)"><i class="el-icon-remove"></i></p>-->
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import checkSecond from '../components/checkSecond'
    import download from "@/components/download"
    import { getUrlType,getRelatedFileForth,thirdMarksApi,forthNewList,forthFilled,forthAuditApi,selectOneApi,selectSecondApi,forthForthAuth,forthDownloadResult,forthDownloadPut } from '@/api/inspectionsApi'
    import commonDialog from '@/components/commonDialog/commonDialog'
    import { previewFile } from '@/utils/api'
    export default {
        name: "checkResult",
        components:{
            checkSecond,
            commonDialog,
            download,
        },
        data(){
            return{
                downloadPath:'',
                downloadName:'',
                downloadAllDialog:false,
                form:{},
                options1:{
                    dialogFormVisible:false,
                    handleClose:this.handleClose,
                    reasonInput:'',
                    moreShow:false,
                    title:'不合格原因',
                    handleMoreCommit:this.handleMoreCommit,
                    handleCommit:this.handleCommit,
                },
                options2:{
                    dialogFormVisible:false,
                    handleClose:this.handleClose2,
                    reasonInput:'',
                    moreShow:false,
                    title:'填写说明与备注',
                    handleMoreCommit:this.handleMoreCommit2,
                    handleCommit:this.handleCommit2,
                },
                options3:{
                    dialogFormVisible:false,
                    handleClose:this.handleClose3,
                    reasonInput:'',
                    moreShow:false,
                    title:'不合格原因',
                    handleMoreCommit:this.handleMoreCommit3,
                    handleCommit:this.handleCommit3,
                },
                btnLoading:false,
                getHeight:0,
                value:1,
                state4:'',
                activeId:'1',
                getFileName:[],
                radio:'',
                isActive:0,
                options: [{
                    value: '',
                    label: '全部'
                },{
                    value: '02',
                    label: '合格'
                },{
                    value: '01',
                    label: '待审核'
                }, {
                    value: '03',
                    label: '不合格'
                }],
                checkRadios:[
                    {value:'1',label:'原件'},
                    {value:'2',label:'证明与原件一致的复印件'},
                    {value:'3',label:'通过其他补充核查方式确认'},
                ],
                selectValue:'',
                getSelect:[],
                getSelect2:[
                    {
                        value: '1',
                        label: '发行人'
                    },
                    {
                        value: '2',
                        label: '承销商'
                    },
                    {
                        value: '3',
                        label: '国家机关'
                    }, {
                        value: '4',
                        label: '具有管理公共事务职能的组织'
                    },
                    {
                        value: '5',
                        label: '会计师事务所'
                    },
                    {
                        value: '6',
                        label: '资产评估机构'
                    },
                    {
                        value: '7',
                        label: '公证机构'
                    },
                    {
                        value: '8',
                        label: '客户'
                    },
                    {
                        value: '9',
                        label: '供应商'
                    },
                    {
                        value: '10',
                        label: '公开网络'
                    },
                    {
                        value: '11',
                        label: '出具声明和承诺的主体'
                    },
                    {
                        value: '12',
                        label: '其他'
                    },
                ],
                radios:[
                    {value:'1',label:'是'},
                    {value:'2',label:'否'},
                    {value:'3',label:'不适合'},
                ],
                changeRadio:false,
                firstRadios:[
                    {value:"11",label:'原件'},
                    {value:"12",label:'证明与原件一致的复印件'},
                    {value:"13",label:'通过其他补充核查方式确认'},
                ],
                secondRadios2:[],
                secondRadios:['已制作笔录','调查律师已签名','被调查自然人或单位负责人已签名','拒绝签名的已注明原因'],
                dialogFormVisible:false,
                reason:'',
                tableData:[],
                loading:false,
                webSites:[],
                getIds:'',
                firstName:'',
                status:'',
                twoName:'',
                rowId:'',
                type:'',
                typeBtn:'',
                inquiryIds:[],
                rowIds:[],
                count:0,
                selectOne:[],
                selectTwo:[],
                oneName:'',
                getSecondSelect:[],
                baseUrl:'',
                isIndeterminate:false,
                checkAll:false,
                checkAllList:[],
                level:'',
                dialogTableVisible:false,
                secondList:'',
                recalList:[],
                checkboxList:[],
                getAllSecondList:[],
            }
        },
        mounted(){
            this.getMark()
            this.getTableHeight();
            this.baseUrl = process.env.VUE_APP_BASEURL;
            this.getSelect = this.getSelect2
        },
        created() {
            window.addEventListener('resize', this.getTableHeight);
            this.getTableHeight()

        },
        destroyed(){
            window.removeEventListener('resize', this.getTableHeight)
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
            getMark(){
                let vm = this;
                let options = {
                    step:4,
                    workUnitId:this.$route.params.id
                }
                thirdMarksApi(options).then((res)=>{
                    if (res.code == 0){
                        vm.webSites = res.result
                        if (vm.webSites.length != 0){
                            vm.getIds = res.result[0].id
                            this.activeId = res.result[0].id
                            vm.getData()
                        }
                        // vm.webSites = res.result
                        // vm.getIds = res.result[0].id
                        // this.activeId = res.result[0].id
                        // vm.getData()
                    }
                })
            },
            getData(){
                let options = {
                    bookMarkId:this.getIds,
                    workUnitId:this.$route.params.id,
                    firstName:this.oneName,
                    status:this.status,
                    twoName:this.twoName,
                }
                this.loading = false
                forthNewList(options).then((res)=>{
                    if (res.code == 0){
                        this.loading = false
                        this.tableData = res.result
                        let change={'countCheck':false}
                        this.tableData.forEach(item=>{
                            Object.assign(item,change)
                        })
                    }
                })
            },
            handleGet(val,row,level){
                if (this.getStatus){
                    this.rowId = row.idA
                    this.type = '1'
                    this.typeBtn = val.value
                    this.level = level
                    if (val.value != '1'){
                        this.options2.dialogFormVisible = true
                        this.options2.reasonInput = ''
                    }else{
                        let options = {
                            id:this.rowId,
                            level:this.level,
                            type:this.type,
                            typeComment:'',
                            typeValue:this.typeBtn
                        }
                        this.dialogFill(options)
                    }
                }
            },
            //列表统一提交接口
            dialogFill(val){
                forthFilled(val).then((res)=>{
                    if (res.code == 0){
                        this.options2.dialogFormVisible = false
                        this.options2.reasonInput = ''
                        this.popSuccess('success',res.msg)
                        this.getData()
                    }else{
                        this.getData()
                    }
                })
            },
            handleClose2(){
                this.options2.dialogFormVisible = false
                this.options2.reasonInput = ''
            },
            handleCommit2(){
                // if (this.options2.reasonInput == ''){
                //     this.popSuccess('warning','输入不能为空！')
                // }else{
                    let options = {
                        id:this.rowId,
                        level:this.level,
                        type:this.type,
                        typeComment:this.options2.reasonInput,
                        typeValue:this.typeBtn
                    }
                    this.dialogFill(options)
                // }
            },
            handleMoreCommit2(){},
            //合格-不合格统一接口
            commonAuth(val){
                forthAuditApi(val).then((res)=>{
                    if (res.code == 0){
                        this.options1.dialogFormVisible = false
                        this.options1.reasonInput = ''
                        this.getData()
                        this.popSuccess('success',res.msg)
                    }
                })
            },
            handleOneAuth(val,step){
                let vm = this;
                let options = {
                    ids:val.idA,
                    level:step,
                    remarks:'',
                    status:'02'
                }
                vm.commonAuth(options)
            },
            handleOneUnauth(val,step){
                this.level = step
                this.rowIds= []
                this.rowIds.push(val.idA)
                this.options1.dialogFormVisible = true
                this.options1.reasonInput = ''
            },
            //弹框
            handleClose(){
                this.options1.dialogFormVisible = false;
                this.options1.reasonInput = ''
            },
            handleMoreCommit(){},
            handleCommit(){
                if (this.options1.reasonInput == ''){
                    this.popSuccess('warning','输入不能为空！')
                }else{
                    let options = {
                        ids:this.rowIds,
                        level:this.level,
                        remarks:this.options1.reasonInput,
                        status:'03'
                    }
                    this.commonAuth(options)
                }
            },
            handleMoreCommit3(){},
            handleClose3(){
                this.options3.dialogFormVisible = false
                this.options3.reasonInput = ''
            },
            handleCommit3(){
                if (this.options3.reasonInput == ''){
                    this.popSuccess('warning','输入不能为空！')
                } else{
                    let options = {
                        idlevels:this.rowIds.toString(),
                        remarks:this.options3.reasonInput,
                        status:'03'
                    }
                    forthForthAuth(options).then((res)=>{
                        if (res.code === 0){
                            this.getData()
                            this.popSuccess('success',res.msg)
                            this.handleClose3()
                        }else{
                            this.getData()
                        }
                    })
                }
            },
            handleClear(){
                this.oneName = "";
                this.getData();
            },
            handleClear2(){
                this.twoName = "";
                this.getData();
            },
            querySearchAsync(queryString, cb) {
                this.selectOne = []
                let options = {
                    name :queryString ,
                    step:4,
                    workUnitId:this.$route.params.id,
                }
                selectOneApi(options).then((res)=>{
                    if (res.code == 0){
                        res.result.forEach(item=>{
                            this.selectOne.push({value:item})
                        })
                    }
                    var results =  this.selectOne;
                    cb(results);
                })

            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            querySearchAsync2(queryString, cb) {
                // this.selectTwo = []
                let options = {
                    name :queryString ,
                    step:4,
                    workUnitId:this.$route.params.id,
                }
                selectSecondApi(options).then((res)=>{
                   let selectList = []
                    if (res.code == 0){
                        res.result.forEach(item=>{
                            selectList.push({value:item})
                        })
                    }
                    var results = selectList;
                    cb(results);
                })

            },
            handleSelect(item) {
                this.oneName = item.value
                this.getData()
            },
            handleSelect2(item) {
                this.twoName = item.value
                this.getData()
            },
            handleStatus(val){
                this.status = val
                this.getData()
            },
            handleSearch(){
              this.getData()
            },
            handleReset(){
              this.oneName = ''
              this.twoName = ''
              this.status = ''
              this.getData()
            },
            pageChange(val){
                this.page = val
                // this.getData()
            },
            handleSizeChange(val){
                this.pageSize = val
                // this.getData()
            },
            expandChange(row, expandedRows) {
                if (expandedRows.indexOf(row) > -1) row.countCheck = true
                else row.countCheck = false
            },
            //选中行的时候
            rowClick(val){
                //点击列表行任意位置可实现checkbox的点击效果
                // this.$refs.multipleTable.toggleRowSelection(val)
                // console.log(val)
            },
            //多选
            handleSelectionChange(val){
                this.multipleSelection = val
                this.inquiryIds = val
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
            handleSelectClear(){
                let options = {
                    id:this.rowId,
                    level:'01',
                    type:'2',
                    typeComment:'',
                    typeValue:''
                }
                this.dialogFill(options)
            },
            handleSelectChange(val){
                if (this.getStatus){
                    this.typeBtn = val
                    this.type = '2'
                    if (val == '12'){
                        this.options2.reasonInput = ''
                        this.options2.dialogFormVisible = true;
                    }else{
                        let options = {
                            id:this.rowId,
                            level:'01',
                            type:this.type,
                            typeComment:'',
                            typeValue:this.typeBtn
                        }
                        this.dialogFill(options)
                    }
                }
            },
            handleSelectSecond(val){
                this.rowId = val.idA
                this.type = '2'
            },
            handleSelectChange2(val){
                if (this.getStatus){
                    this.typeBtn = val
                    this.type = '2'
                    if (val == '12'){
                        this.options2.reasonInput = ''
                        this.options2.dialogFormVisible = true;
                    }else{
                        let options = {
                            id:this.rowId,
                            level:'02',
                            type:this.type,
                            typeComment:'',
                            typeValue:this.typeBtn
                        }
                        this.dialogFill(options)
                    }
                }
            },
            handleSelectSecond2(val){
                this.rowId = val.idB
                this.type = '2'
            },
            filterMethod(val){
                if (val) { //val存在
                    this.getSelect = this.getSelect2.filter((item) => {
                        if (!!~item.value.indexOf(val) || !!~item.label.toUpperCase().indexOf(val.toUpperCase())) {
                            return true
                        }
                    })
                } else { //val为空时，还原数组
                    this.getSelect = this.getSelect2
                }
            },
            handleRadio(val,row){
               if (this.getStatus){
                   this.rowId = row.id
                   this.type = '3'
                   this.typeBtn = val
                   if (val == '3'){
                       this.options2.dialogFormVisible = true
                       this.options2.reasonInput = ''
                   }else{
                       let options = {
                           id:this.rowId,
                           level:'01',
                           type:this.type,
                           typeComment:'',
                           typeValue:this.typeBtn
                       }
                       this.dialogFill(options)
                   }
               }
            },
            handleConfirm(){
                this.btnLoading = true
                this.dialogFormVisible = false
            },
            tableRowClassName({row, rowIndex}) {
                if (row.statusA === '03' || row.statusB == '03') {
                    return 'warnResult'
                }else{
                    return ''
                }
            },
            changeTab(){

            },
            handleTab(val){
                this.getIds = val.id
                this.getData()
            },
            //下载整个表格
            handleDownloadAll(){
                if (this.getIds == ''){
                    this.$alert('页签不能为空！', '提示', {
                        type: 'warning',
                        confirmButtonText: '确定',
                        callback: () => {
                        }
                    })
                } else{
                    this.downloadAllDialog = true
                    this.getDownloadResult()
                }

            },
            //获取下载结论
            getDownloadResult(){
                let options = {
                    bookMarkId:this.getIds
                }
                forthDownloadResult(options).then((res)=>{
                    if (res.code == 0){
                        this.form = res.result
                    }
                })
            },
            //提交下载表单
            onSubmit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.form.remark1==''|| this.form.remark2=='' || this.form.remark3=='' || this.form.remark4=='' ||this.form.remark5 == ''){
                            this.popSuccess('warning','输入不能为空！')
                        }else{
                            this.submitResult(this.form)
                        }
                    } else {
                        return false;
                    }
                });
            },
            //提交结论
            submitResult(val){
                let options = {
                    bookMarkId:this.getIds,
                    remark1:val.remark1,
                    remark2:val.remark2,
                    remark3:val.remark3,
                    remark4:val.remark4,
                    remark5:val.remark5,
                    result:val.result,
                }
                forthDownloadPut(options).then((res)=>{
                    if (res.code == 0){
                        this.download(this.baseUrl,'查验计划审核结果.xls','Template',this.getIds)
                        this.downloadAllDialog = false
                        this.popSuccess('success',res.msg)
                    }
                })
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
                        downloadUrl = '/checkPlanInfo/downloadIPO?bookMarkId='+interviewId;
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
            //关闭下载窗口
            handleDownladCancel(){
                this.$alert('确认关闭窗口，下载将取消！', '提示', {
                    type: 'warning',
                    confirmButtonText: '确定',
                    callback: () => {
                        this.downloadAllDialog = false
                    }
                })

            },
            //合格-多选
            handleAuth(){
                let vm = this
                vm.selectRows()
                if (vm.count == 1){
                    let options = {
                        idlevels:vm.rowIds.toString(),
                        remarks:'',
                        status:'02'
                    }
                    console.log(this.rowIds)
                    forthForthAuth(options).then((res)=>{
                        if (res.code === 0){
                            this.getData()
                            this.popSuccess('success',res.msg)
                        }else{
                            this.getData()
                        }
                    })
                    // this.commonAuth(options)
                }

            },
            //不合格-多选
            handleUnauth(){
                let vm = this
                vm.selectRows()
                if (vm.count == 1){
                    vm.options3.dialogFormVisible = true
                    vm.options3.reasonInput = ''
                }
            },
            selectRows(){
                let vm = this;
                vm.rowIds=[];
                vm.count = 0
                let Ids = [],firstId=[],fIds=[]
                // var secondIds = this.filterStr()
                var secondIds = []
                if (this.inquiryIds.length != 0 || this.checkAllList.length!=0){
                    this.inquiryIds.forEach(v => {
                        if (v.statusA == '01' || v.statusA == '00') {
                            firstId.push(v.idA)
                            // vm.itemId.push(v.batchNo + '-' + v.websiteId + '-' + v.subjectNo)
                        }
                    })
                    this.tableData.forEach(item=>{
                        this.checkAllList.forEach(item2=>{
                            if (item.idB == item2){
                                if (item.statusB == '00'){
                                    secondIds.push(item2)
                                }
                            }
                        })
                    })
                    for (let i in this.checkAllList){
                        Ids.push(secondIds[i]+'_02')
                    }
                    for (let j in firstId){
                        fIds.push(firstId[j]+'_01')
                    }
                    vm.rowIds = Ids.concat(fIds)
                    if (vm.rowIds.length == 0){
                        this.$alert('仅可以提交状态为待审核选项！', '提示', {
                            type: 'warning',
                            confirmButtonText: '确定',
                            callback: () => {}
                        })
                        return false
                    }
                    vm.count = 1
                } else{
                    this.$alert('请选择要审核的选项！', '提示', {
                        type: 'warning',
                        confirmButtonText: '确定',
                        callback: () => {}
                    })
                }
                // if (this.inquiryIds.length != 0){
                //     this.inquiryIds.forEach(v => {
                //         if (v.excuteStatus == '01') {
                //             vm.rowIds.push(v.id)
                //             // vm.itemId.push(v.batchNo + '-' + v.websiteId + '-' + v.subjectNo)
                //         }
                //     })
                //     if (vm.rowIds.length == 0) {
                //         this.$alert('仅可以提交主体状态为待审核选项！', '提示', {
                //             type: 'warning',
                //             confirmButtonText: '确定',
                //             callback: () => {}
                //         })
                //         return false
                //     }
                //     vm.count = 1
                // } else{
                //     this.$alert('请选择要提交审核的项！', '提示', {
                //         type: 'warning',
                //         confirmButtonText: '确定',
                //         callback: () => {}
                //     })
                // }
            },
            secondListExpand(val){
                this.$refs.multipleTable.toggleRowExpansion(val)
            },
            secondMoreSelect(val){
                this.getSecondSelect.push(val)
            },
            selectSecondList(){
                let firstFilter = []
                this.getSecondSelect.forEach(item=>{
                    if (item.excuteStatus == '01') {
                        firstFilter.push(item.id)
                    }
                })
                return  firstFilter.reduce((prev,next)=>{
                    prev[next] = (prev[next] + 1) || 1
                    return prev
                },{})
            },
            filterStr(){
                let newArr =this.selectSecondList()
                var arr = [],strs=[]
                for (let i in newArr){
                    arr.push({name:i,count:newArr[i]})
                }
                arr.forEach((item)=>{
                    if (item.count%2==1){
                        strs.push(item.name)
                    }
                })
                return strs
            },
            //二级全选
            handleCheckAllChange(val){
                if (val == true){
                    this.tableData.forEach(item=>{
                        this.checkAllList.push(item.idB)
                        // this.getAllSecondList.push({idB:item.idB,statusB:item.statusB})
                        //item.secondCheck = 'true'
                    })
                    this.checkAll = true;
                    this.isIndeterminate = false;
                }else{
                    this.checkAllList = []
                    this.getAllSecondList = []
                    this.checkAll = false;
                    this.isIndeterminate = false;
                }
                return this.isIndeterminate = false;
                // this.checkedCities = val ? cityOptions : [];

            },
            handleCheckTitle(val, id){
                if(this.checkAllList.length == this.tableData.length){
                    this.checkAll = true;
                    this.isIndeterminate = false;
                }else{
                    this.checkAll = false;
                    this.isIndeterminate = this.checkAllList.length ? true : false;
                }

            },
            handleVerfication(val,row,step){
                if (step == '01'){
                    this.level = '01'
                    this.rowId = row.idA
                } else{
                    this.level = '02'
                    this.rowId = row.idB
                }
                if (this.getStatus){
                    this.type = '3'
                    this.typeBtn = val
                    if (val == '13'){
                        this.options2.dialogFormVisible = true
                        this.options2.reasonInput = ''
                    }else{
                        let options = {
                            id:this.rowId,
                            level:this.level,
                            type:this.type,
                            typeComment:'',
                            typeValue:this.typeBtn
                        }
                        this.dialogFill(options)
                    }
                }
            },
            handleViewFile(step,row){
                let options = {
                    workUnitId:this.$route.params.id,
                }
                getRelatedFileForth(options).then((res)=>{
                    if (res.code == 0){
                        this.recalList = res.result
                        this.secondList = this.recalList.length
                    }
                })
                this.dialogTableVisible = true
            },
            //查看关联的文件
            handleFileView(val){
                var title = val.fileName.split('.')
                previewFile(val.filePath,title[0])
            },
            showVisible(){
                this.dialogTableVisible = false

            },
            handleInput(val,row,number,steps){
                if (this.getStatus) {
                    if (steps== '01'){
                        this.rowId = row.idA
                    }else{
                        this.rowId = row.idB
                    }
                    let options = {
                        id:this.rowId,
                        level:steps,
                        type:number,
                        typeComment:'',
                        typeValue:val,
                    }
                    this.dialogFill(options)
                }
            },
        }
    }
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    @import "inspectionCreate";
    .pointBtn{
        cursor: pointer;
    }
    .get-cursor{
        cursor: pointer;
    }
    .dia-content{
        width: 100%;
        .el-dialog .el-dialog__header{
            background: #fff;
        }
        /*position: absolute;*/
        /*z-index: 999;*/
        /*left: 50%;*/
        /*top: 30%;*/
        background: #fff;
        /*box-shadow: 4px 3px 4px #ddd;*/

        .dia-list{
            width: 100%;
            border: 1px solid #ddd;
            box-sizing: border-box;
            padding-bottom: 20px;
            >div{
                float: left;
            }
            /*padding: 10px;*/
            .recal-content{
                width: 100%;
                float: left;
                margin-top: 16px;
                >p{
                    float: left;
                    padding:0 10px;
                    line-height: 1.4;
                }
                >p:first-of-type{
                    color: $global-color;
                    cursor: pointer;
                    text-decoration: underline;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow:ellipsis;
                }
                >p:last-of-type{
                    cursor: pointer;
                }
                >p:nth-of-type(2){
                    /*max-width: 180px;*/
                    max-width: 100px;
                }
                .recal{
                    /*float: right;*/
                    font-size: 16px;
                    color: red;
                }
                .recal-title{
                    max-width: 200px;
                    text-decoration: underline;
                }
            }
            .dia-title{
                width: 100%;
                border-bottom: 1px solid #ddd;
                >p{
                    float: left;
                    margin: 10px;
                }
                >p:first-of-type{
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: $global-color;
                    margin-right: -4px;
                }
                >p:nth-of-type(2){
                    font-size: 14px;
                    line-height: 16px;
                }
                >p:last-of-type{
                    float: right;

                    i{
                        font-size: 16px;
                        color: #666;
                    }
                }
            }
            .recal-number{
                padding: 5px 0;
                width: 100%;
                border-bottom: 1px solid #ddd;
                box-sizing: border-box;
                >p{
                    font-size: 16px;
                    margin-left: 14px;
                    >span{
                        font-size: 24px;
                        padding: 0 4px;
                        color: $global-color;
                    }
                }

            }
        }
    }
</style>
<style lang="scss">
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
    .checkTables{
        .el-table__expanded-cell{
            padding: 0px;
        }
        .el-table__expand-column{
            .cell{
                display: none;
            }
        }
    }
    .get-works{
        padding: 10px;
        border-radius: 10px;
        >p{
            padding: 10px;
        }
    }
    .table-checkbox-item{
        .el-checkbox__label{
            display: none !important;
        }
    }
</style>
