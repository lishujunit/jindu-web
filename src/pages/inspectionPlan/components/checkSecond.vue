<template>
    <div class="inspect-second">
        <el-table :data="tableData" :show-header="false" :row-class-name="tableRowClassName">
            <el-table-column width="55" align="center">
                <template slot-scope="scope">
                    <el-checkbox :label="scope.row.id"  @change="handleCheckbox(scope.row)">&nbsp;</el-checkbox>
                </template>
            </el-table-column>
            <el-table-column prop="sortNo" label="序号" width="100" align="center"></el-table-column>
            <el-table-column prop="name" align="center" width="500"> </el-table-column>
            <el-table-column prop="relativeScond"  align="center" width="280">
                <template slot-scope="scope">
                       <div v-if="scope.row.excuteStatus!='02'">
                           <div>
                               <el-popover placement="top" width="330" trigger="hover" popper-class="popover">
                                   <div class="get-works" v-if="scope.row.implFlagComment">
                                       <p>{{scope.row.implFlagComment}}</p>
                                   </div>
                                   <div class="danger" slot="reference">
                                       <el-radio-group  v-model="scope.row.implFlag" >
                                           <el-radio :label="item.value" @change="handleGet(item,scope.row)" :key="item.value" :value="item.value" v-for="item in radios" >{{item.label}}</el-radio>
                                       </el-radio-group>
                                   </div>
                               </el-popover>
                           </div>
                           <!--<el-radio-group  v-model="scope.row.implFlag" >-->
                               <!--<el-radio :label="item.value" @change="handleGet(item,scope.row)" :key="item.value" :value="item.value" v-for="item in radios" >{{item.label}}</el-radio>-->
                           <!--</el-radio-group>-->
                       </div>
                       <div v-else>
                           <span v-if="scope.row.implFlag==='1'">是</span>
                           <span v-if="scope.row.implFlag==='2'">否</span>
                           <span v-if="scope.row.implFlag==='3'">不适合</span>
                       </div>
                </template>
            </el-table-column>
            <el-table-column prop="implFlagComment" align="center" width="160" :show-overflow-tooltip="true">
                <template slot-scope="scope"><span class="get-cursor">{{scope.row.implFlagComment}}</span></template>
            </el-table-column>
            <el-table-column prop="checkSecond" align="center" width="240">
                <template slot-scope="scope">
                    <div v-if="scope.row.excuteStatus!='02'">
                        <div v-if="scope.row.name=='合规证明'"></div>
                        <div v-else>
                            <div>
                                <el-popover placement="top" width="330" trigger="hover" popper-class="popover">
                                    <div class="get-works" v-if="scope.row.fileSourceComment">
                                        <p>{{scope.row.fileSourceComment}}</p>
                                    </div>
                                    <div class="danger" slot="reference">
                                        <el-select  style="width: 220px;"
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
                                    </div>
                                </el-popover>
                            </div>
                            <!--<el-select v-model="scope.row.fileSource" @clear="handleSelectClear"  @change="handleSelectChange" @focus="handleSelectSecond(scope.row)" clearable placeholder="请选择">-->
                                <!--<el-option-->
                                        <!--v-for="item in getSelect"-->
                                        <!--:key="item.value"-->
                                        <!--:label="item.label"-->
                                        <!--:value="item.value"-->
                                <!--&gt;-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        </div>
                    </div>
                    <div v-else>{{globalStatus.inspectSelect[scope.row.fileSource]}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="fileSourceComment"  align="center" width="160" :show-overflow-tooltip="true">
                <template slot-scope="scope"><span class="get-cursor">{{scope.row.fileSourceComment}}</span></template>
            </el-table-column>>
            <el-table-column prop="verification" align="left"  width="360">
                    <template slot-scope="scope">
                       <div v-if="scope.row.excuteStatus!='02'">
                           <div>
                               <el-popover placement="top" width="330" trigger="hover" popper-class="popover">
                                   <div class="get-works" v-if="scope.row.fileSourceComment">
                                       <p>{{scope.row.fileSourceComment}}</p>
                                   </div>
                                   <div class="danger" slot="reference">
                                       <div v-if="scope.row.name !='网络核查'">
                                           <el-radio-group  v-model="scope.row.verification" >
                                               <el-radio  :label="item.value" @change="handleVerfication(item.value,scope.row)" :key="item.value" :value="item.value" v-for="item in secondRadios" >{{item.label}}</el-radio>
                                           </el-radio-group>
                                       </div>
                                       <div v-else-if="scope.row.name==='网络核查'">
                                           <el-radio-group  v-model="scope.row.verification" >
                                               <el-radio  label="已进行网页截屏" value="4"  @change="handleVerfication(4,scope.row)"></el-radio>
                                           </el-radio-group>
                                       </div>
                                   </div>
                               </el-popover>
                           </div>
                               <!--<div v-if="scope.row.name !='网络核查'">-->
                                   <!--<el-radio-group  v-model="scope.row.verification" >-->
                                       <!--<el-radio  :label="item.value" @change="handleVerfication(item.value,scope.row)" :key="item.value" :value="item.value" v-for="item in secondRadios" >{{item.label}}</el-radio>-->
                                   <!--</el-radio-group>-->
                               <!--</div>-->
                               <!--<div v-else-if="scope.row.name==='网络核查'">-->
                                   <!--<el-radio-group  v-model="scope.row.verification" >-->
                                       <!--<el-radio  label="已进行网页截屏" value="4"  @change="handleVerfication(4,scope.row)"></el-radio>-->
                                   <!--</el-radio-group>-->
                               <!--</div>-->
                               <!--<div v-else>-</div>-->
                           </div>
                        <div v-else style="text-align: center">{{globalStatus.inspectSecond[scope.row.verification]}}</div>
                    </template>
            </el-table-column>
            <el-table-column prop="verificationComment" align="center" width="160" :show-overflow-tooltip="true">
                <template slot-scope="scope"><span class="get-cursor">{{scope.row.verificationComment}}</span></template>
            </el-table-column>>
            <el-table-column prop="excuteStatus"  width="80" align="center">
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
                    </div>
                    <span v-if="scope.row.excuteStatus==='01'">待审核</span>
                    <span v-if="scope.row.excuteStatus==='02'">合格</span>
                </template>
            </el-table-column>
            <el-table-column  label="操作" width="120" align="center">
                <template slot-scope="scope" v-if="getStatus">
                    <div class="btns" v-if="scope.row.excuteStatus == '01'">
                        <span @click="handleAuth(scope.row)">合格</span>
                        <span class="un-quality" @click="handleUnauth(scope.row)">不合格</span>
                    </div>
                    <!--<div class="btns" v-else style="text-decoration: none">-</div>-->
                </template>
            </el-table-column>
        </el-table>
        <common-dialog  :options="options1"></common-dialog>
    </div>
</template>

<script>
    import { forthSecondList,forthFilled,forthAuditApi } from '@/api/inspectionsApi'
    import commonDialog from '@/components/commonDialog/commonDialog'
    export default {
        name: "insoectSecond",
        components:{
            commonDialog,
        },
        props:{
            checkId:''
        },
        data(){
            return{
                options1:{
                    dialogFormVisible:false,
                    handleClose:this.handleClose,
                    reasonInput:'',
                    moreShow:false,
                    title:'不合格原因',
                    handleMoreCommit:this.handleMoreCommit,
                    handleCommit:this.handleCommit,
                },
                value:1,
                state4:'',
                getFileName:[],
                radio:'',
                checkList:[
                    {name:'一级核查计划',label:'1'},
                    {name:'二级核查计划',label:'2'}
                ],
                tabList:[
                    {name:'一级核查计划',label:'1'},
                    {name:'二级核查计划',label:'2'}
                ],
                isActive:0,
                options: [{
                    value: 1,
                    label: '全部'
                },{
                    value: 2,
                    label: '合格'
                },{
                    value: 3,
                    label: '未审核'
                }, {
                    value: 4,
                    label: '不合格'
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
                secondRadios:[
                    {value:'1',label:'已制作面谈笔录'},
                    {value:'2',label:'面谈对象已签名'},
                    {value:'3',label:'已注明面谈对象拒绝签字'},
                ],
                changeRadio:false,
                dialogFormVisible:false,
                reason:'',
                tableData:[],
                tableLabel:{
                    first:'一级书面核查文件清单/其他核查手段',
                    second:'是否取得/实施',
                    third:'文件来源',
                    forth:'核验要求',
                },
                loading:false,
                webSites1:[],
                activeId:'1',
                rowIds:[],
                inquiryIds:[],
                status:'',
                towName:'',
                rowId:'',
                typeBtn:'',
                type:'',
                authId:''


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
          this.getData()
          this.getSelect = this.getSelect2
        },
        methods:{
            getData(){
                let options = {
                    firstId:this.checkId,
                    status:this.status,
                    towName:this.towName
                }
                forthSecondList(options).then((res)=>{
                    if (res.code == 0){
                        this.tableData = res.result
                    }
                })
            },
            //弹框
            handleClose(){
                this.options1.moreShow = false
                this.options1.dialogFormVisible = false
                this.options1.reasonInput = ''
                this.getData()
            },
            handleCommit(){
                if (this.options1.reasonInput == ''){
                    this.popSuccess('warning','输入不能为空！')
                } else{
                    let options = {
                        id:this.rowId,
                        level:'02',
                        type:this.type,
                        typeComment:this.options1.reasonInput,
                        typeValue:this.typeBtn
                    }
                    this.dialogFill(options)
                }
            },
            handleMoreCommit(){
                if (this.options1.reasonInput == ''){
                    this.popSuccess('warning','输入不能为空！')
                } else{
                    let options = {
                        ids:this.authId,
                        level:'02',
                        remarks:this.options1.reasonInput,
                        status:'03'
                    }
                    this.commonAuth(options)
                }
            },
            tableRowClassName({row, rowIndex}) {
                if (row.excuteStatus === '03') {
                    return 'warnResult'
                }else{
                    return ''
                }
            },
            handleVerfication(val,row){
               if (this.getStatus){
                   this.rowId = row.id
                   this.type = '3'
                   this.typeBtn = val
                   if (val == '3'){
                       this.optionsDialog.dialogFormVisible = true
                       this.optionsDialog.reasonInput = ''
                   }else {
                       let options = {
                           id: this.rowId,
                           level: '02',
                           type: this.type,
                           typeComment: '',
                           typeValue: this.typeBtn
                       }
                       this.dialogFill(options)
                   }
               }
            },
            handleGet(val,row){
                if (this.getStatus){
                    this.rowId = row.id
                    this.type = '1'
                    this.typeBtn = val.value
                    if (val.value == '3'){
                        this.options1.reasonInput = ''
                        this.options1.dialogFormVisible = true
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
            //弹框填写
            dialogFill(val){
                forthFilled(val).then((res)=>{
                    if (res.code == 0){
                        this.handleClose()
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
            //合格
            handleAuth(val){
                let vm = this;
                let options = {
                    ids:val.id,
                    level:'02',
                    remarks:'',
                    status:'02'
                }
                vm.commonAuth(options)
            },
            handleUnauth(val){
                this.authId = val.id
                this.options1.moreShow = true
                this.options1.dialogFormVisible = true
                this.options1.reasonInput = ''
            },
            commonAuth(val){
                forthAuditApi(val).then((res)=>{
                    if (res.code == 0){
                        this.popSuccess('success',res.msg)
                        this.handleClose()
                    }
                })
            },
            rowClick(val){
                // this.$refs.multipleTable.toggleRowSelection(val)
                // console.log(val)
            },
            //多选
            handleSelectionChange(val){
                this.multipleSelection = val
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
                    level:'02',
                    type:'2',
                    typeComment:'',
                    typeValue:''
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
                       this.options1.reasonInput = ''
                       this.options1.dialogFormVisible = true;
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
            color: $global-color;
            cursor: pointer;
            text-decoration: underline;
            padding: 0 4px;
        }
        .un-quality{
            color: red;
            cursor: pointer;
        }
    }
    .get-cursor{
        cursor: pointer;
    }
</style>
<style rel="stylesheet/scss" lang="scss">
    @import "@/assets/css/varibles.scss";
    .get-works{
        padding: 10px;
        border-radius: 10px;
        >p{
            padding: 10px;
            word-wrap: break-word;
        }
    }

</style>
