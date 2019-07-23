<template>
    <div class="wrap-content">
        <div class="wrap-select">
            <el-form ref="ruleForm" label-width="100px" inline>
                <el-form-item label="一级名称" prop="nameOne">
                    <el-autocomplete
                            class="search-input"
                            clearable
                            style="width: 350px;"
                            v-model="oneName"
                            @keyup.enter.native="handleSearch"
                            @clear="handleClear"
                            :fetch-suggestions="querySearchAsync"
                            @select="handleSelect"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="二级名称" prop="nameTwo">
                    <el-autocomplete
                        class="search-input"
                        clearable
                        style="width: 350px;"
                        v-model="twoName"
                        @keyup.enter.native="handleSearch"
                        @clear="handleClear2"
                        :fetch-suggestions="querySearchAsync2"
                        @select="handleSelect2"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="selectStatus" placeholder="请选择" class="state"  @change="handleSelectStatus">
                        <el-option label="全部" value=""></el-option>
                        <el-option
                                v-for="item in statusOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <div class="rightBox">
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button type="danger" @click="resetForm()">重置</el-button>
                </div>
            </el-form>
        </div>
        <div style="margin-bottom: 20px;" class="tab-list  clearfix">
            <div class="items">
                <div class="bg tab-box">
                    <el-tabs class="tabText" v-model="activeId" @tab-click="changeTab">
                        <el-tab-pane v-for="(item,index) in webSites" :label="item.name" :name="item.id" :key="item.id">
                            <span class="dbl" :class="{'has':item.isClick}" slot="label" @click="handleTab(item)"> {{item.name}}</span>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
            <div class="last">
                <el-button type="primary" class="fr" @click="mulCheck" v-if="getStatus">提交审核</el-button>
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
                            <el-radio style="line-height: 1.5!important;float: left; margin-left: 20px;" :label="item.value" @change="handleGet(item,scope.row)" :key="item.value" :value="item.value" v-for="item in radios" >{{item.label}}</el-radio>
                        </el-radio-group>
                    </template>
                </el-table-column>
                <el-table-column label="说明与备注" prop="implFlagCommentA" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
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
                <el-table-column label="核验要求" prop="verificationA" align="center" width="270">
                    <template slot-scope="scope" v-if="scope.row.nameA !=''">
                        <div v-if="scope.row.typeA == '1'">
                            <el-radio-group  v-model="scope.row.verificationA" >
                                <el-radio style="line-height: 1.5!important;float: left;!important;margin-left: 10px;" :label="item.value" @change="handleVerfication(item.value,scope.row)" :key="item.value" :value="item.value" v-for="item in firstRadios" >{{item.label}}</el-radio>
                            </el-radio-group>
                        </div>
                        <div v-if="scope.row.typeA == '2'">
                            <el-checkbox-group v-model="secondRadios2">
                                <el-checkbox style="line-height: 1.5!important;float: left;!important;margin-left: 10px;"  v-for="(item,index) in secondRadios" :key="index" :label="item" @change="handleVerficationTest($event,item,scope.row)">{{item}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div v-if="scope.row.typeA == '3'">
                            <el-radio-group  v-model="scope.row.verificationA">
                                <el-radio style="float: left;!important;" label="已进行网页截屏" value="4"  @change="handleVerfication(31,scope.row)"></el-radio>
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
                            <span v-if="scope.row.statusA == '01'">已提交</span>
                            <span v-if="scope.row.statusA == '03'">不合格</span>
                            <span v-if="scope.row.statusA == '02'">合格</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" prop="index" align="center" width="110">
                    <template slot-scope="scope">
                        <div class="btns" v-if="scope.row.statusA == '00' || scope.row.statusA == '03'">
                            <span @click="handleDelete(scope.row)">删除</span>
                            <span @click="handleCheck(scope.row)">提交审核</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="index" align="center" width="50">
                    <template slot-scope="scope" slot="header">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
                    </template>
                    <template slot-scope="scope">
                        <div class="table-checkbox-item">
                            <el-checkbox v-model="checkAllList" :label="scope.row.idB"  @change="handleCheckTitle($event, scope.row.idB)"></el-checkbox>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="序号2" prop="sortNoB" align="center"></el-table-column>
                <el-table-column label="二级书面核查文件清单/其他核查手段" prop="nameB" align="center" width="300"></el-table-column>
                <el-table-column label="是否取得/实施" prop="implFlagB" align="center" width="120">
                    <template slot-scope="scope" v-if="scope.row.nameB !=''">
                        <el-radio-group  v-model="scope.row.implFlagB">
                            <el-radio style="line-height: 1.5!important;" :label="item.value" @change="handleGet2(item,scope.row)" :key="item.value" :value="item.value" v-for="item in radios" >{{item.label}}</el-radio>
                        </el-radio-group>
                    </template>
                </el-table-column>
                <el-table-column label="说明与备注" prop="implFlagCommentB" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="文件来源" prop="fileSourceB" align="center" width="240" >
                    <template slot-scope="scope"  v-if="scope.row.nameB !=''">
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
                <el-table-column label="核验要求" prop="fileSourceCommentB" align="center" width="270">
                    <template slot-scope="scope"  v-if="scope.row.nameB !=''">
                        <div v-if="scope.row.typeB == '1'">
                            <el-radio-group  v-model="scope.row.verificationB">
                                <el-radio style="line-height: 1.5!important;float: left;!important;" :label="item.value" @change="handleVerfication2(item.value,scope.row)" :key="item.value" :value="item.value" v-for="item in firstRadios" >{{item.label}}</el-radio>
                            </el-radio-group>
                        </div>
                        <div v-if="scope.row.typeB == '2'">
                            <el-checkbox-group  v-model="secondRadios2" @change="handleSecondChange($event,scope.row)">
                                <el-checkbox style="float: left;!important;" v-for="(item,index) in secondRadios" :label="item" :key="item">{{item}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div v-if="scope.row.typeB == '3'">
                            <el-radio-group  v-model="scope.row.verificationB">
                                <el-radio style="float: left;!important;" label="31" value="31"  @change="handleVerfication2('31',scope.row)">已进行网页截图</el-radio>
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
                    <template slot-scope="scope"  v-if="scope.row.nameB !=''">
                        <div class="btns">
                            <span  @click="handleViewFile(2,scope.row)">查看文件</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="index" align="center">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="scope.row.statusB == '00'">待提交</span>
                            <span v-if="scope.row.statusB == '01'">已提交</span>
                            <span v-if="scope.row.statusB == '03'">不合格</span>
                            <span v-if="scope.row.statusB == '02'">合格</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" prop="index" align="center" width="110">
                    <template slot-scope="scope">
                        <div class="btns" v-if="scope.row.statusB == '00' || scope.row.statusB == '03'">
                            <span @click="handleDelete2(scope.row)">删除</span>
                            <span @click="handleCheck2(scope.row)">提交审核</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <common-dialog  :options="options"></common-dialog>
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
                        <p class="recal-title" @click="handleFileView(item)" :title="item.fileList">{{item.fileName}}</p>
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
    import inspectSecond from '../components/insoectSecond'
    import uploadPic from '@/components/upload'
    import {thirdMarksApi,thirdOneList,thirdDeleteApi,orpFlagApi,threeAuth,selectOneApi,selectSecondApi,forthThreeAuth,thirdNewList,getRelatedFileThree} from '@/api/inspectionsApi'
    import commonDialog from '@/components/commonDialog/commonDialog'
    import commonSelect from '@/components/commonDialog/commonSelect'
    import { previewFile } from '@/utils/api'
    export default {
        name: "inspectPlan",
        components:{
            uploadPic,
            inspectSecond,
            commonDialog,
            commonSelect
        },
        data(){
            return{
                test: true,
                options:{
                    dialogFormVisible:false,
                    handleClose:this.handleClose,
                    reasonInput:'',
                    moreShow:false,
                    title:'填写说明与备注',
                    handleMoreCommit:this.handleMoreCommit,
                    handleCommit:this.handleCommit,
                },
                getHeight:0,
                value:1,
                state4:'',
                pageTotal:0,
                getFileName:[],
                radio:'',
                isActive:0,
                selectStatus:'',
                statusOptions: [
                    {
                    value: '00',
                    label: '待提交'
                }, {
                    value: '01',
                    label: '已提交'
                }, {
                    value: '03',
                    label: '不合格'
                }, {
                    value: '02',
                    label: '合格'
                }],
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
                    {value:'11',label:'原件'},
                    {value:'12',label:'证明与原件一致的复印件'},
                    {value:'13',label:'通过其他补充核查方式确认'},
                ],
                secondRadios2:[],
                secondRadios:['已制作笔录','调查律师已签名','被调查自然人或单位负责人已签名','拒绝签名的已注明原因'],
                reason:'',
                tableData:[],
                tableLabel:{},
                total:1,
                page:1,
                pageSize:20,
                loading:false,
                webSites:[],
                activeId:'1',
                markId:'',
                rowId:'',
                type:'',
                typeBtn:'',
                inquiryIds:[],
                itemId:[],
                count:0,
                nameOne:'',
                nameTwo:'',
                oneName:'',
                twoName:'',
                getSecondSelect:[],
                secondSelectIds:[],
                checkAll:false,
                checkAllList:[],
                isIndeterminate:false,
                level:'',
                verifyList:[],
                dialogTableVisible:false,
                secondList:'',
                recalList:[],
                checkboxList:[],
                getAllSecondList:[],
                secondCheckList:[],
                scondCheckId:''
            }
        },
        mounted(){
            this.getMarks(),
            this.getTableHeight();
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
            },

        },
        methods:{
            popSuccess(type,message){
                this.$message({
                    type:type,
                    message:message
                })
            },
            //页签
            getMarks(){
                let options = {
                    step:3,
                    workUnitId:this.$route.params.id
                };
                let vm = this;
                thirdMarksApi(options).then((res)=>{
                    if (res.code == 0){
                        console.log(res)
                        this.webSites = res.result
                        if (vm.webSites.length != 0){
                            this.markId = res.result[0].id
                            this.activeId = res.result[0].id
                            this.getData()
                        }
                        // this.webSites = res.result
                        // this.markId = res.result[0].id
                        // this.activeId = res.result[0].id
                        // this.getData()
                    }
                })
            },
            //一级列表
            getData(){
                let vm = this;
                let options = {
                    firstName: vm.oneName,
                    status: vm.selectStatus,
                    twoName: vm.twoName,
                    workUnitId: vm.$route.params.id,
                    bookMarkId:vm.markId,
                }
                this.loading = false
                thirdNewList(options).then((res)=>{
                    if (res.code == 0){
                        this.loading = false
                        this.tableData.forEach(item=>{

                        })
                        vm.tableData = res.result
                    }
                })
            },
            //页签切换
            handleTab(val){
                this.markId = val.id
                this.getData()
            },
            //提交审核--单个
            handleCheck(val){
                let vm = this
                if (val.fileSourceA!=''&&val.implFlagA!=''&&val.verificationA!='') {
                    let options = {
                        ids:val.idA,
                        level:'01'
                    }
                    threeAuth(options).then((res)=>{
                        if (res.code == 0){
                            vm.getData()
                            vm.popSuccess('success',res.msg)
                        }
                    })
                }else{
                    this.$alert('选项不能为空', '提示', {
                        type: 'warning',
                        confirmButtonText: '确定',
                        callback: () => {}
                    })
                }
            },
            //提交审核--单个
            handleCheck2(val){
                // this.checkSecond()
                let vm = this
                let options = {
                    ids:val.idB,
                    level:'02'
                }
                threeAuth(options).then((res)=>{
                    if (res.code == 0){
                        vm.getData()
                        vm.popSuccess('success',res.msg)
                    }
                })
            },
            //弹框填写
            dialogFill(val){
                orpFlagApi(val).then((res)=>{
                    if (res.code == 0){
                        this.options.dialogFormVisible = false
                        this.getData()
                        this.popSuccess('success',res.msg)
                    }else{
                        this.getData()
                    }
                })
            },
            //删除
            handleDelete(val){
                let options = {
                    id:val.idA,
                    level:"01"
                }
                this.$confirm('确定删除？','提示',{
                    type:'warning',
                    confirmButtonText: '删除',
                    cancelButtonText: '取消'
                }).then(()=>{
                    thirdDeleteApi(options).then((res)=>{
                        if (res.code == 0){
                            this.type = ''
                            this.getData()
                            this.popSuccess('success',res.msg)
                        }
                    })
                })

            },
            handleDelete2(val){
                let options = {
                    id:val.idB,
                    level:"02"
                }
                this.$confirm('确定删除？','提示',{
                    type:'warning',
                    confirmButtonText: '删除',
                    cancelButtonText: '取消'
                }).then(()=>{
                    thirdDeleteApi(options).then((res)=>{
                        if (res.code == 0){
                            this.type = ''
                            this.getData()
                            this.popSuccess('success',res.msg)
                        }
                    })
                })

            },
            //实施
            handleGet(val,row){
               if (this.getStatus){
                   this.level = '01'
                   this.rowId = row.idA
                   this.type = '1'
                   this.typeBtn = val.value
                   if (val.value != '1'){
                       this.options.dialogFormVisible = true
                       this.options.reasonInput = ''
                   }else{
                       let options = {
                           level:this.level,
                           id:this.rowId,
                           type:this.type,
                           typeComment:this.options.reasonInput,
                           typeValue:this.typeBtn
                       }
                       this.dialogFill(options)
                   }
               }
            },
            //实施
            handleGet2(val,row){
                if (this.getStatus){
                    this.level = '02'
                    this.rowId = row.idB
                    this.type = '1'
                    this.typeBtn = val.value
                    if (val.value != '1'){
                        this.options.dialogFormVisible = true
                        this.options.reasonInput = ''
                    }else{
                        let options = {
                            level:this.level,
                            id:this.rowId,
                            type:this.type,
                            typeComment:this.options.reasonInput,
                            typeValue:this.typeBtn
                        }
                        this.dialogFill(options)
                    }
                }
            },
            //核验要求
            handleVerfication(val,row){
               if (this.getStatus){
                   this.rowId = row.idA
                   this.type = '3'
                   this.level = '01'
                   this.typeBtn = val
                   if (val == '13'){
                       this.options.dialogFormVisible = true
                       this.options.reasonInput = ''
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
            handleVerfication2(val,row){
                if (this.getStatus){
                    this.rowId = row.idB
                    this.type = '3'
                    this.level = '02'
                    this.typeBtn = val
                    if (val == '13'){
                        this.options.dialogFormVisible = true
                        this.options.reasonInput = ''
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
            handleMoreVerfication(val,row){
                this.verifyList.push(val)
                console.log(this.verifyList.toString())
            },
            //关闭弹框
            handleClose(){
                this.options.reasonInput = ''
                this.options.dialogFormVisible = false
            },
            //提交--多个
            handleMoreCommit(){

            },
            //提交--单个
            handleCommit(){
                // if (this.options.reasonInput == ''){
                //     this.popSuccess('warning','不适合原因不能为空！')
                // }else{
                    let options = {
                        id:this.rowId,
                        level:this.level,
                        type:this.type,
                        typeComment:this.options.reasonInput,
                        typeValue:this.typeBtn
                    }
                    this.dialogFill(options)
                // }
            },
            selectRows(){
                let vm = this;
                vm.itemId=[];
                vm.count = 0
                let Ids = [],firstId=[],fIds=[]
                // var secondIds = this.filterStr()
                var secondIds = []
                if (this.inquiryIds.length != 0  ||this.checkAllList.length !=0 ){
                    this.inquiryIds.forEach(v => {
                        if (v.statusA == '00' ) {
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
                    for (let i in secondIds){
                        Ids.push(secondIds[i]+'_02')
                    }
                    for (let j in firstId){
                        fIds.push(firstId[j]+'_01')
                    }
                    vm.itemId = Ids.concat(fIds)
                    if (vm.itemId.length == 0){
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
            },
            filterStr(){
                let newArr =this.selectSecondList()
                var arr = [],strs=[]
                this.secondSelectIds = []
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
            selectSecondList(){
                let firstFilter = []
                this.getSecondSelect.forEach(item=>{
                    if (item.excuteStatus == '00') {
                        firstFilter.push(item.id)
                    }
                })
              return  firstFilter.reduce((prev,next)=>{
                  prev[next] = (prev[next] + 1) || 1
                  return prev
              },{})
            },

            //提交审核--多选
            mulCheck(){
                let vm = this
                vm.selectRows()
                if (vm.count == 1){
                    forthThreeAuth({idlevels: vm.itemId.toString()}).then((res)=>{
                        if (res.code === 0){
                            this.getData()
                        }
                    })
                }
            },
            getTableHeight(){
                this.getHeight=window.innerHeight-440;
            },
            querySearchAsync(queryString, cb) {
                this.selectOne = []
                let options = {
                    name :queryString ,
                    step:3,
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
            handleSelect(item) {
                this.oneName = item.value
                this.getData()
            },
            handleSelect2(item) {
                this.twoName = item.value
                this.getData()
            },
            querySearchAsync2(queryString, cb) {
                // this.selectTwo = []
                let options = {
                    name :queryString,
                    step:3,
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
            handleClear(){
                this.oneName = "";
                this.getData();
            },
            handleClear2(){
                this.towName = "";
                this.getData();
            },
            handleSelectStatus(val){
                this.type = val
                this.selectStatus = val
                this.getData()
            },
            //多选
            handleSelectionChange(val){
                this.multipleSelection = val
                this.inquiryIds = val
            },
            tableRowClassName({row, rowIndex}) {
                if (row.statusA === '03' || row.statusB == '03') {
                    return 'warnResult'
                }else{
                    return ''
                }
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
            handleSelectChange(val){
               if (this.getStatus){
                   this.type='2'
                   this.level = '01'
                   this.typeBtn = val
                   if (val == '12'){
                       this.options.reasonInput = ''
                       this.options.dialogFormVisible = true;
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
            handleSelectSecond(val){
                this.rowId = val.idA
                this.type = '2'
            },
            handleSelectChange2(val){
                if (this.getStatus){
                    this.type='2'
                    this.level = '02'
                    this.typeBtn = val
                    if (val == '12'){
                        this.options.reasonInput = ''
                        this.options.dialogFormVisible = true;
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
            handleSelectSecond2(val){
                this.rowId = val.idB
                this.type = '2'
            },
            changeTab(){

            },
            secondListExpand(val){
                this.$refs.multipleTable.toggleRowExpansion(val)
            },
            expandChange(row, expandedRows) {
                if (expandedRows.indexOf(row) > -1) row.countCheck = true
                else row.countCheck = false
            },
            //搜索
            handleSearch(){
              this.getData()
            },
            //重置
            resetForm(){
                this.selectStatus = ''
                this.twoName = ''
                this.oneName = ''
                this.getData()
            },
            secondMoreSelect(val){
                this.getSecondSelect.push(val)
            },
            //二级全选
            handleCheckAllChange(val){
               if (val == true){
                   this.tableData.forEach(item=>{
                       this.checkAllList.push(item.idB)
                        //item.secondCheck = 'true'
                   })
                   this.checkAll = true;
                   this.isIndeterminate = false;
               }else{
                   this.checkAllList = []
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
            rowClick(val){
            },
            //关联文件dialog打开
            handleViewFile(step,row){
                let options = {
                    workUnitId:this.$route.params.id,
                }
                getRelatedFileThree(options).then((res)=>{
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
            handleVerficationTest(val,item,row){
                this.rowId = row.idA
                this.type = '3'
                this.level = '01'
                if (item=='拒绝签名的已注明原因'){
                    this.typeBtn = '24'
                    this.options.dialogFormVisible = true
                    this.options.reasonInput = ''
                }else{
                    if (item == '已制作笔录'){
                        this.typeBtn = '21'
                    } else if (item == '调查律师已签名') {
                        this.typeBtn = '22'
                    }else if(item == '被调查自然人或单位负责人已签名'){
                        this.typeBtn = '23'
                    }
                    let options = {
                        id:this.rowId,
                        level:this.level,
                        type:this.type,
                        typeComment:'',
                        typeValue:this.typeBtn
                    }
                    this.dialogFill(options)
                }
            },
            handleSecondChange(val,row){
                this.secondCheckList = val
                this.scondCheckId = row.idB
            },
            checkSecond(){
                let radios = []
                this.level = '02'
                this.type = '03'
                this.secondCheckList.forEach(item=>{
                    switch (item) {
                        case '已制作笔录':
                            radios.push(21)
                            break;
                        case '调查律师已签名':
                            radios.push(22)
                            break;
                        case '被调查自然人或单位负责人已签名':
                            radios.push(23)
                            break;
                        case '拒绝签名的已注明原因':
                            radios.push(24)
                            this.options.dialogFormVisible = true
                            this.options.reasonInput = ''
                            break;
                    }
                })
                let options = {
                    id:this.scondCheckId,
                    level:this.level,
                    type:this.type,
                    typeValue:radios.toString()
                }
                this.dialogFill(options)
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    @import "inspectionCreate";
    .pointBtn{
        cursor: pointer;
    }
    .inputMt{
        margin-bottom: 10px;
    }
    .viewDialog{
        .el-dialog .el-dialog__header{
            background: #fff;
            display: none;
        }
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
<style rel="stylesheet/scss" lang="scss">
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
    .tables{
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
            word-wrap: break-word;
        }
    }
    .table-checkbox-item{
        .el-checkbox__label{
            display: none !important;
        }
    }
</style>
