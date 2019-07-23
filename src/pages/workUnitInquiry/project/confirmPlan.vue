<template>
    <div class="confirm-wrap">
        <div class="button-list" v-if="getStatus">
            <el-button type="primary" @click="handleQulified">合格</el-button>
            <el-button type="danger" @click="handleUnqulified">不合格</el-button>
        </div>
        <div class="select-list">
           <div>
               <span>主体名称</span>
               <el-autocomplete
                       class="search-input"
                       clearable
                       style="width: 350px;"
                       v-model="state4"
                       @clear="handleClear"
                       @keyup.enter.native="handleSearch"
                       :fetch-suggestions="querySearchAsync"
                       @select="handleSelect"
               ></el-autocomplete>
           </div>
            <div>
                <span>状态</span>
                <el-select v-model="value4" @change="change" clearable placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
                <el-button type="danger" @click="handleReset">重置</el-button>
            </div>
        </div>
        <div class="table">
            <el-table :data="tableData" :max-height="getHeight" border @selection-change="handleSelectionChange" :row-class-name="tableRowClassName"  @row-click="handleRowClick" @current-change="handleCurrentChange" v-loading="loading">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="number" label="序号" align="center" width="60">
                    <template slot-scope="scope">
                        {{scope.$index+(page-1)*pageSize+1}}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="主体名称" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="100">
                    <template slot-scope="scope">
                        <div v-if="scope.row.createStatus===4">
                            <el-popover placement="top" width="330" trigger="hover" popper-class="popover">
                                <div class="reason">
                                    <div class="title">不合格</div>
                                    <div >{{scope.row.nopassRemark}}</div>
                                    <div >
                                        <span>{{scope.row.nopassAuditName}}</span>
                                        <span>{{scope.row.nopassTime}}</span>
                                    </div>
                                </div>
                                <div class="danger" slot="reference">
                                    不合格
                                    <i style="font-size: 14px;" class="el-icon-info"></i>
                                </div>
                            </el-popover>
                            <!--<span v-if="scope.row.createStatus===4" class="table-comfirm">不合格</span>-->
                        </div>
                        <div v-else>
                            <span v-if="scope.row.createStatus===0">待提交</span>
                            <span v-if="scope.row.createStatus===2">待审核</span>
                            <span v-if="scope.row.createStatus===3">合格</span>
                        </div>

                    </template>
                </el-table-column>
                <el-table-column prop="number" label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <div class="btns" v-if="getStatus">
                            <span v-if="scope.row.createStatus ===4" @click="handleDelete(scope.row)">删除</span>
                            <span v-if="scope.row.createStatus ===2" @click="handleQulify(scope.row)">合格</span>
                            <span v-if="scope.row.createStatus ===2" class="uncertain" @click="handleUnqulify(scope.row)">不合格</span>
                            <!--<span v-if="scope.row.createStatus ===3" class="none" >-</span>-->
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
        </div>
        <el-dialog title="不合格原因" :visible.sync="dialogFormVisible" width="20%" :before-close="handleClose1" :close-on-click-modal="false">
            <el-input placeholder="输入长度为100个字符" type="textarea" rows="4" v-model="reasonInput" maxlength="100" ></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-if="oneAndMore" @click="handleCommit">确 定</el-button>
                <el-button type="primary" v-if="!oneAndMore" @click="handleCommitOne">确 定</el-button>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { certifyList,moreQulified,oneQulified,moreUnqulified,oneUnqulified,handleAudit,deleteItem,searchApi } from '@/api/workUnitInqury'
    export default {
        name: "unitConfirm",
        data(){
            return{
                loading:true,
                state4:'',
                value4:'',
                options:[
                    {value:'',label:'全部'},
                    {value:'3',label:'合格'},
                    {value:'4',label:'不合格'},
                    {value:'2',label:'待审核'},
                ],
                tableData:[],
                oneAndMore:false,
                total:0,
                pageTotal:0,
                page:1,
                pageSize:20,
                name:'',
                workUnitId:'',
                getIds:'',
                inquiryIds:[],
                dialogFormVisible:false,
                reasonInput:'',
                reasonId:'',
                status:'',
                rowIds:[],
                getFileName:[],
                getHeight:0,
                count:0,
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
          this.getData();
          this.getTableHeight();
        },
        created() {
            window.addEventListener('resize', this.getTableHeight);
            this.getTableHeight()

        },
        destroyed(){
            window.removeEventListener('resize', this.getTableHeight)
        },
        methods: {
            getTableHeight(){
                this.getHeight=window.innerHeight-430;
            },
            getData(){
                let vm = this;
                vm.loading = false;
                certifyList(vm.name,vm.page,vm.pageSize,vm.status,vm.$route.params.id).then((res)=>{
                    if (res.code ==0){
                        vm.loading = false;
                        vm.tableData = res.result.records
                        vm.page = Number(res.result.current)
                        vm.pageTotal = Number(res.result.pages)
                        vm.total = Number(res.result.total)
                        this.inquiryIds = [];
                        this.rowIds = []
                    }
                })
            },
            //分页
            pageChange(val){
                this.page = val;
                this.getData();
            },
            handleSizeChange(val){
                this.pageSize = val;
                this.page = 1;
                this.getData();
            },
            /*---------------   文档上传人搜索框    -------------------*/
            querySearchAsync(queryString, cb) {
                let vm = this;
                vm.getFileName = []
                searchApi(vm.state4,2,vm.$route.params.id).then((res)=>{
                    if (res.code == 0){
                        res.result.forEach(item=>{
                            vm.getFileName.push({value:item})
                        })
                    }
                    var results = vm.getFileName;
                    cb(results);
                })
            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item) {
                let vm = this;
                vm.name = item.value;
                vm.page = 1;
                vm.getData();
            },
            handleClear(){
                this.name = '';
                this.page = 1;
                this.getData();
            },
            selectRows(){
                let vm = this;
                vm.rowIds=[];
                vm.count = 0
                if (this.inquiryIds.length != 0){
                    this.inquiryIds.forEach(v => {
                        if (v.createStatus == 2) {
                            vm.rowIds.push(v.id)
                            // vm.itemId.push(v.batchNo + '-' + v.websiteId + '-' + v.subjectNo)
                        }
                    })
                    if (vm.rowIds.length == 0) {
                        this.$alert('仅可以提交主体状态为待审核选项！', '提示', {
                            type: 'warning',
                            confirmButtonText: '确定',
                            callback: () => {}
                        })
                        return false
                    }
                    vm.count = 1
                } else{
                    this.$alert('请选择要提交审核的项！', '提示', {
                        type: 'warning',
                        confirmButtonText: '确定',
                        callback: () => {}
                    })
                }
            },
            //合格--多个
            handleQulified(){
                let vm = this;
                vm.selectRows()
                if(vm.count == 1){
                    moreQulified(vm.rowIds.toString()).then((res)=>{
                        if (res.code == 0){
                            vm.getData();
                        }
                    })
                }


            },
            //不合格--多个
            handleUnqulified(){
                let vm = this;
                vm.selectRows()
                if (vm.count == 1){
                    vm.oneAndMore = true;
                    vm.reasonInput = '';
                    vm.dialogFormVisible = true
                }
            },
            //合格 -单个
            oneCheck(val){
                oneQulified(val).then((res)=>{
                    if (res.code == 0){
                        this.getData()
                    } else{
                        this.getData()
                    }
                })
            },
            //状态选择
            change(val){
                let vm = this;
                vm.status = val;
                vm.getData()
            },
            //搜索
            handleSearch(){
                let vm = this;
                vm.name = vm.state4;
                // console.log(vm.name)
                vm.status = vm.value4;
                vm.page = 1;
                vm.getData()
            },
            //重置
            handleReset(){
                let vm = this;
                vm.status = '';
                vm.value4 = '';
                vm.state4 = '';
                vm.name = '';
                vm.getData();
            },
            /*---------------   列表    -------------------*/
            handleReload(val) {
                // console.log(val)
            },
            handleDelete(val) {
                this.$confirm('确定删除？','提示',{
                    type:'warning',
                    confirmButtonText: '删除',
                    cancelButtonText: '取消'
                }).then(()=>{
                    deleteItem(val.id).then((res)=>{
                        if (res.code == 0 ){
                            this.getData()
                        }else{
                            this.getData()
                            this.$alert(res.msg, '提示', {
                                confirmButtonText: '确定',
                                type: 'error',
                                // callback: action => {}
                            });
                        }
                    })
                })
                // console.log(val)
            },
            handleQulify(val) {
                this.oneCheck(val.id);
            },
            //不合格-单个
            handleUnqulify(val) {
                let vm = this;
                vm.reasonId = val.id;
                if (val != ''){
                    vm.reasonInput = '';
                    vm.oneAndMore = false;
                    vm.dialogFormVisible = true;
                }

                // console.log(val)
            },
            //不合格原因提交--多个
            handleCommit(){
                let vm = this;
                if(vm.reasonInput !=''){
                    moreUnqulified(vm.rowIds,vm.reasonInput).then((res)=>{
                        if (res.code == 0){
                            vm.dialogFormVisible = false;
                            this.getData();
                        }
                    }).catch(err=>{
                        console.log(err)
                    })
                }else{
                    vm.$message({
                        type:'warning',
                        message:'输入不能为空'
                    })
                }
            },
            //不合格原因--单个提交
            handleCommitOne(){
                let vm = this;
                if(vm.reasonInput !=''){
                    oneUnqulified(vm.reasonId,vm.reasonInput).then((res)=>{
                        if (res.code == 0){
                            vm.dialogFormVisible = false;
                            this.getData();
                        }else{
                            this.dialogFormVisible = false
                            this.getData()
                        }
                    })
                }else{
                    vm.$message({
                        type:'warning',
                        message:'输入不能为空'
                    })
                }
            },
            //列表选中
            handleRowClick(val){
                console.log(val)
            },
            tableRowClassName({row, rowIndex}) {
                if (row.createStatus === 4) {
                    return 'warnResult'
                }else{
                    return ''
                }
            },
            //多选
            handleSelectionChange(val){
                this.multipleSelection = val;
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
            //列表选取
            handleCurrentChange(val) {
                console.log(val)
            },
            handleClose1(){
                this.dialogFormVisible = false
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    .confirm-wrap{
    .select-list{
        width: 100%;
        height: 60px;
        box-sizing: border-box;
        background: #ffffff;
        line-height: 60px;
        margin-top: 20px;
        padding: 0 20px;
        .search-input{
            margin-left: 10px;
        }
        >div{
            float: left;
        }
        >div:nth-of-type(2){
            margin-left: 40px;
            >span{
                margin-right: 10px;
            }
        }
        >div:last-of-type{
            float: right;
        }
    }
        .table{
            margin-top: 20px;
            .table-comfirm{
                color:red;
            }
            .btns{
                /*float: left;*/
                color: $global-color;
                span{
                    padding: 0 10px;
                    text-decoration: underline;
                    cursor: pointer;
                }
                .uncertain{
                    color: red;
                }
                .none{
                    text-decoration: none;
                }
            }
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
