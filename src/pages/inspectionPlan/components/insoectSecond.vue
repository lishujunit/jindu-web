<template>
    <div class="inspect-second">
        <el-table :data="tableData" :show-header="false" ref="multipleTable" :row-class-name="tableRowClassName"  @row-click="rowClick">
            <el-table-column width="55" fixed align="center">
                <template slot-scope="scope">
                    <el-checkbox :label="scope.row.id" @change="handleCheckbox(scope.row)">&nbsp;</el-checkbox>
                </template>
            </el-table-column>
            <el-table-column align="center" fixed prop="sortNo" label="序号" width="140"></el-table-column>
            <el-table-column prop="name" align="center" width="500"></el-table-column>
            <el-table-column prop="implFlagComment" align="center" width="240">
                <template slot-scope="scope">
                    <div >
                        <el-popover placement="top" width="330" trigger="hover" popper-class="popover">
                            <div class="get-works" v-if="scope.row.implFlagComment">
                                <p>{{scope.row.implFlagComment}}</p>
                            </div>
                            <div class="danger" slot="reference">
                                <div v-if="scope.row.name!='网络核查'">
                                    <el-radio-group  v-model="scope.row.implFlag">
                                        <el-radio :label="item.value" @change="handleGet(item,scope.row)" :key="item.value" :value="item.value" v-for="item in radios" >{{item.label}}</el-radio>
                                    </el-radio-group>
                                </div>
                            </div>
                        </el-popover>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="fileSourceComment"  align="center" width="200">
                <template slot-scope="scope">
                    <div>
                        <el-popover placement="top" width="100%" trigger="hover" popper-class="popover">
                            <div class="get-works" v-if="scope.row.fileSourceComment">
                                <p>{{scope.row.fileSourceComment}}</p>
                            </div>
                            <div class="danger" slot="reference">
                                <!--<div v-if="scope.row.excuteStatus !='02'">-->
                                    <div v-if="scope.row.name!='网络核查'">
                                        <el-select
                                                v-model="scope.row.fileSource"
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
                                    <!--</div>-->
                                    <!--<div v-else>-</div>-->
                                </div>
                                <!--<div v-else>-</div>-->
                            </div>
                        </el-popover>
                    </div>
                    <!--<div v-if="scope.row.excuteStatus !='02'">-->
                        <!--<div v-if="scope.row.name!='网络核查'" :title="scope.fileSourceComment">-->
                            <!--<el-select v-model="scope.row.fileSource" @clear="handleSelectClear"  @change="handleSelectChange" @focus="handleSelectSecond(scope.row)" clearable placeholder="请选择">-->
                                <!--<el-option-->
                                        <!--v-for="item in getSelect"-->
                                        <!--:key="item.value"-->
                                        <!--:label="item.label"-->
                                        <!--:value="item.value"-->
                                <!--&gt;-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        <!--</div>-->
                        <!--<div v-else>-</div>-->
                    <!--</div>-->
                    <!--<div v-else>-</div>-->
                </template>
            </el-table-column>
            <el-table-column prop="verificationComment" align="left" width="340">
                <template slot-scope="scope">
                    <div>
                        <el-popover placement="top" width="330" trigger="hover" popper-class="popover">
                            <div class="get-works" v-if="scope.row.verificationComment">
                                <p>{{scope.row.verificationComment}}</p>
                            </div>
                            <div class="danger" slot="reference">
                                <!--<div v-if="scope.row.excuteStatus!='02'">-->
                                    <div v-if="scope.row.name !='网络核查'">
                                        <el-radio-group  v-model="scope.row.verification" >
                                            <el-radio  :label="item.value" @change="handleVerfication(item.value,scope.row)" :key="item.value" :value="item.value" v-for="item in secondRadios" >{{item.label}}</el-radio>
                                        </el-radio-group>
                                    </div>
                                    <div class="check-radios" v-else>
                                        <el-radio-group  v-model="scope.row.verification"  v-if="scope.row.name=='网络核查'">
                                            <el-radio label="已进行网页截屏" value="4"  @change="handleVerfication(3,scope.row)"></el-radio>
                                        </el-radio-group>
                                        <!--<div v-else>-</div>-->
                                    </div>
                                <!--</div>-->
                                <!--<div v-else>-</div>-->
                            </div>
                        </el-popover>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80" align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.excuteStatus==='03'">
                        <el-popover placement="top" width="330" trigger="hover" popper-class="popover">
                            <div class="reason">
                                <div class="title">不合格</div>
                                <div>{{scope.row.auditRemark}}</div>
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
                    <span v-if="scope.row.excuteStatus==='00'">待提交</span>
                    <span v-if="scope.row.excuteStatus==='01'">已提交</span>
                    <span v-if="scope.row.excuteStatus==='02'">合格</span>
                </template>
            </el-table-column>
            <el-table-column  label="操作" width="160" align="center">
                <template slot-scope="scope" v-if="getStatus">
                    <div class="btns" v-if="scope.row.excuteStatus==='03'||scope.row.excuteStatus==='00'">
                        <span @click="handleDelete(scope.row)">删除 </span>
                        <span @click="handleCheck(scope.row)">提交审核 </span>
                    </div>
                    <!--<div class="btns" v-else style="text-decoration: none">-</div>-->
                </template>
            </el-table-column>
        </el-table>
        <common-dialog  :options="optionsDialog"></common-dialog>
    </div>
</template>

<script>
    import {threeSecondList,orpFlagApi,thirdDeleteApi,threeAuth} from '@/api/inspectionsApi'
    import commonDialog from '@/components/commonDialog/commonDialog'
    export default {
        name: "insoectSecond",
        props:{
            inspectId:'',
        },
        components:{
            commonDialog
        },
        data(){
            return{
                value:1,
                state4:'',
                checked:false,
                pageTotal:0,
                getFileName:[],
                radio:'',
                tabList:[
                    {name:'一级核查计划',label:'1'},
                    {name:'二级核查计划',label:'2'}
                ],
                isActive:0,
                options: [{
                    value: 1,
                    label: '全部'
                }, {
                    value: 2,
                    label: '待提交'
                }, {
                    value: 3,
                    label: '已提交'
                }, {
                    value: 4,
                    label: '不合格'
                }, {
                    value: 5,
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
                checkRadios:[
                    {value:'1',label:'原件'},
                    {value:'2',label:'证明与原件一致的复印件'},
                    {value:'3',label:'通过其他补充核查方式确认'},
                ],
                dialogFormVisible:false,
                reason:'',
                tableData:[],
                tableLabel:{
                    first:'一级书面核查文件清单/其他核查手段',
                    second:'是否取得/实施',
                    third:'文件来源',
                    forth:'核验要求',
                },
                secondRadios:[
                    {value:'1',label:'已制作面谈笔录'},
                    {value:'2',label:'面谈对象已签名'},
                    {value:'3',label:'已注明面谈对象拒绝签字'},
                ],
                total:1,
                page:1,
                pageSize:10,
                loading:false,
                webSites:[],
                activeId:'1',
                optionsDialog:{
                    dialogFormVisible:false,
                    handleClose:this.handleClose,
                    reasonInput:'',
                    moreShow:false,
                    title:'填写说明与备注',
                    handleMoreCommit:this.handleMoreCommit,
                    handleCommit:this.handleCommit,
                },
                rowId:'',
                typeBtn:'',
                type:'',
                secondSelect:[],
                twoName:'',
                status:''
            }
        },
        mounted(){
          this.getData()
          this.getSelect = this.getSelect2
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
            getData(){
                let options = {
                    firstId:this.inspectId,
                    status:this.status,
                    twoName:this.twoName
                }
                threeSecondList(options).then((res)=>{
                    if (res.code == 0){
                        this.tableData = res.result
                        let change={'countCheck':false}
                        this.tableData.forEach(item=>{
                            Object.assign(item,change)
                        })
                    }
                })
            },
            handleGet(val,row){
                if (this.getStatus){
                    this.rowId = row.id
                    this.type = '1'
                    this.typeBtn = val.value
                    if (val.value != '1'){
                        this.optionsDialog.reasonInput = ''
                        this.optionsDialog.dialogFormVisible = true
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
            handleClose(){
                this.getData()
                this.optionsDialog.reasonInput = ''
                this.optionsDialog.dialogFormVisible = false
            },
            handleMoreCommit(){

            },
            handleCommit(){
                // if (this.optionsDialog.reasonInput == ''){
                //     this.popSuccess('warning','输入不能为空！')
                // }else{
                    let options = {
                        id:this.rowId,
                        level:'02',
                        type:this.type,
                        typeComment:this.optionsDialog.reasonInput,
                        typeValue:this.typeBtn
                    }
                    this.dialogFill(options)
                // }
            },
            //弹框填写
            dialogFill(val){
                console.log(val)
                orpFlagApi(val).then((res)=>{
                    if (res.code == 0){
                        // this.getData()
                        this.optionsDialog.dialogFormVisible = false
                        this.getData()
                        this.popSuccess('success',res.msg)
                    }else{
                        this.getData()
                    }
                })
            },
            popSuccess(type,message){
                this.$message({
                    type:type,
                    message:message
                })
            },
            //删除
            handleDelete(val){
                let options = {
                    id:val.id,
                    level:"02"
                }
                thirdDeleteApi(options).then((res)=>{
                    if (res.code == 0){
                        this.getData()
                        this.popSuccess('success',res.msg)
                    }
                })
            },
            //提交审核--单个
            handleCheck(val){
                let vm = this
                // if (val.fileSource!=''&&val.implFlag!=''&&val.verification!='') {
                    let options = {
                        ids:val.id,
                        level:'02'
                    }
                    threeAuth(options).then((res)=>{
                        if (res.code == 0){
                            vm.getData()
                            vm.popSuccess('success',res.msg)
                        }
                    })
                // }else{
                //     this.$alert('选项不能为空', '提示', {
                //         type: 'warning',
                //         confirmButtonText: '确定',
                //         callback: () => {}
                //     })
                // }
            },
            handleSizeChange(val){
                this.pageSize = val
                this.getData
            },
            //选中行的时候
            rowClick(val){
                this.$refs.multipleTable.toggleRowSelection(val)
                // this.$emit('secondMoreSelect',val)
                // console.log(val)
            },
            //多选
            handleSelectionChange(val){
                this.multipleSelection = val
                this.secondSelect = val
                // this.handleGetSecond(val)
            },
            tableRowClassName({row, rowIndex}) {
                if (row.excuteStatus === '03') {
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
            handleSelectClear() {
                let options = {
                    id: this.rowId,
                    level: '02',
                    type: '2',
                    typeComment: '',
                    typeValue: ''
                }
                this.dialogFill(options)
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
                    this.typeBtn = val
                    if (val == '12'){
                        this.optionsDialog.reasonInput = ''
                        this.optionsDialog.dialogFormVisible = true;
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
            handleSelectSecond(val){
                this.rowId = val.id
                this.type = '2'
            },
            handleVerfication(val,row){
                if (this.getStatus){
                    this.rowId = row.id
                    this.type = '3'
                    this.typeBtn = val
                    if (val == '3'){
                        this.optionsDialog.reasonInput = ''
                        this.optionsDialog.dialogFormVisible = true
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
            handleCheckbox(val){
                this.$emit('secondMoreSelect',val)
            },

        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    .btns{
        >span{
            text-decoration:underline;
            color: $global-color;
            padding: 0 4px;
            cursor: pointer;
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
    .get-works{
        padding: 10px;
        border-radius: 10px;
        >p{
            padding: 10px;
            word-wrap: break-word;
        }
    }
</style>
