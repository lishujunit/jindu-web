<template>
    <div class="confirm-wrap">
        <div v-if="getStatus">
            <el-button type="primary" @click="handleMoreQualify">合格</el-button>
            <el-button type="danger" @click="handleMoreUnqualify">不合格</el-button>
        </div>
        <div class="select-list">
            <div>
                <span>主体名称</span>
                <el-autocomplete
                        class="search-input"
                        clearable
                        style="width: 350px;"
                        v-model="state4"
                        @keyup.enter.native="handleSearch"
                        @clear="handleClear"
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
            <el-table :data="tableData" :v-loading="loading" ref="tableData" :max-height="getHeight" border :row-class-name="tableRowClassName"  @current-change="handleCurrentChange"  @selection-change="handleSelectionChange" @row-click="handleClick">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column prop="number" label="序号" align="center" width="100">
                    <template slot-scope="scope">
                        {{scope.$index+(page-1)*pageSize+1}}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="主体名称" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="100">
                    <template slot-scope="scope">
                        <div v-if="scope.row.executeStatus===4">
                            <el-popover placement="top" width="330" trigger="hover" popper-class="popover">
                                <div class="reason">
                                    <div class="title">不合格</div>
                                    <div class="content"><p>{{scope.row.nopassRemark}}</p></div>
                                    <div>
                                        <span>{{scope.row.nopassAuditName}}</span>
                                        <span>{{scope.row.nopassTime}}</span>
                                    </div>
                                </div>
                                <div class="danger" slot="reference">
                                    不合格
                                    <i style="font-size: 14px;" class="el-icon-info"></i>
                                </div>
                            </el-popover>
                        </div>
                        <div class="btns" v-else>
                            <span v-if="scope.row.executeStatus===3 ">合格</span>
                            <span v-if="scope.row.executeStatus===0 ">待上传</span>
                            <span v-if="scope.row.executeStatus===1 ">已上传</span>
                            <span v-if="scope.row.executeStatus===2 ">待审核</span>
                        </div>

                    </template>
                </el-table-column>
                <el-table-column label="扫描件" align="center" width="200">
                    <template slot-scope="scope">
                        <div class="operateBtn">
                            <div class="btns" :class="{active:isActive}">
                                <span  @click="handleSecondView(scope.row)">查看</span>
                                <div class="reloadBtn clearfix" v-if="scope.row.executeStatus === 2 &&getStatus">
                                    <upload-pic accept=".xlsx, .xls,.doc,.docx,.pdf,.png,.bmp,.gif,.jpeg,.jpg,.m4a" @uploadSuccess="fillUpload2">
                                        <div class="upload" @click="handleUplaod(scope.row)">
                                            <span>上传</span>
                                        </div>
                                    </upload-pic>
                                </div>
                                <span  v-if="scope.row.executeStatus === 2 &&getStatus" @click="handleQulify(scope.row)">合格</span>
                                <span class="unauth" v-if="scope.row.executeStatus === 2 &getStatus" @click="handleUnqulify(scope.row)">不合格</span>
                                <!--<span v-if="scope.row.executeStatus === 4" @click="handleDelete(scope.row)">删除</span>-->
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <pageination @pageChange="pageChange"  @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
        </div>
        <el-dialog title="不合格原因" :visible.sync="dialogFormVisible" width="20%" :before-close="handleClose1" :close-on-click-modal="false">
            <el-input placeholder="输入长度为100个字符" type="textarea" rows="4" v-model="reasonInput" maxlength="100"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-if="moreShow"  @click="handleMoreCommit">确 定</el-button>
                <el-button type="primary" v-else  @click="handleCommit">确 定</el-button>
                <el-button @click="handleClose1">取 消</el-button>
            </div>
        </el-dialog>
        <!--查看列表弹框-->
        <el-dialog :visible.sync="dialogTableVisible" :show-close="false" class="viewDialog" :modal="false">
            <div class="dia-content clearfix">
                <div class="dia-list clearfix">
                    <div class="dia-title clearfix">
                        <p></p>
                        <p>回函列表</p>
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
                        <p v-if="showCancel===2"  class="recal" @click="handleDelete(item,index)"><i class="el-icon-remove" v-if="getStatus"></i></p>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { forthList,forthUpload,forthDelete,forthAuth,forthUnauth,searchApi,forthMoreAuth,forthMoreUnauth,viewApi } from '@/api/workUnitInqury'
    import uploadPic from '@/components/upload'
    import { previewFile } from '@/utils/api'
    export default {
        name: "checkRecall",
        components:{
            uploadPic
        },
        data(){
            return{
                state4:'',
                value4:'',
                options:[
                    {value:'',label:'全部'},
                    {value:'3',label:'合格'},
                    {value:'4',label:'不合格'},
                    // {value:'0',label:'待上传'},
                    // {value:'1',label:'已上传'},
                    {value:'2',label:'待审核'},

                ],
                tableData:[],
                show:false,
                loading:true,
                total:0,
                page:1,
                pagenum:1,
                pageSize:20,
                workUnitId:'',
                getFileName:[],
                name:'',
                status:'',
                recalList:[],
                dialogFormVisible:false,
                reasonInput:'',
                recalLenth:0,
                getHeight:0,
                pageTotal:0,
                getIds:[],
                itemId:[],
                moreShow:false,
                showSecondList:false,
                count:0,
                showCancel:0,
                secondList:0,
                dialogTableVisible:false,
                isActive:false,
                uploadId:'',
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
                this.getHeight=window.innerHeight-440;
            },
            getData(){
                let vm = this;
                vm.loading = false
                let change = {'visible':false}
                vm.tableData = []
                forthList(vm.name,vm.page,vm.pageSize,vm.value4,vm.$route.params.id).then((res)=>{
                    if (res.code == 0){
                        vm.loading = false;
                        vm.tableData = res.result.records
                        vm.tableData.forEach(item=>{
                            Object.assign(item,change)
                        })
                        vm.total = Number(res.result.total)
                        vm.pageTotal = Number(res.result.pages)
                        vm.pagenum = Number(res.result.pages)
                    }
                })
            },
            handleClick(val){
                let vm = this;
                vm.workunitId = val.id
                // console.log('handleClick')
            },
            handleSizeChange(val){
                this.pageSize = val;
                this.page = 1;
                this.getData()
            },
            //分页
            pageChange(index){
                this.page = index
                this.getData()
            },
            /*---------------   文档上传人搜索框    -------------------*/
            querySearchAsync(queryString, cb) {
                let vm = this;
                vm.getFileName = []
                searchApi(vm.state4,4,vm.$route.params.id).then((res)=>{
                    if (res.code == 0){
                        res.result.forEach(item=>{
                            vm.getFileName.push({value:item})
                        })
                    }
                    var results =  vm.getFileName;
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
            //状态修改
            change(val){
                let vm = this;
                vm.value4 = val;
                vm.page = 1;
                vm.getData()
            },
            handleSearch(){
                this.name = this.state4;
                this.status = this.value4;
                this.page = 1;
                this.getData()
            },
            handleReset(){
                let vm = this;
                vm.value4 = '';
                vm.status = '';
                vm.name = '';
                vm.state4 = '';
                vm.page = 1
                vm.getData();
            },
            /*---------------   列表    -------------------*/
            handleUplaod(val){
                this.uploadId = val.id
            },
            //上传
            fillUpload2(path,name){
                this.loading = true
                forthUpload(name,path,this.uploadId).then(res=>{
                    if(res.code==0){
                        this.loading = false
                        this.getData()
                        this.$message({
                            type:'success',
                            message:'上传成功'
                        })
                    }
                })
            },
            handleDelete(val,index) {
                this.$confirm('确定删除？','提示',{
                    type:'warning',
                    confirmButtonText: '删除',
                    cancelButtonText: '取消'
                }).then(()=>{
                    forthDelete(val.id).then((res)=>{
                        if (res.code == 0){
                            this.$message({
                                type:'success',
                                message:'删除成功'
                            })
                            if (this.recalList.length > 1){
                                this.recalList.splice(index,1)
                                this.secondList-=1
                                this.getData()
                            } else{
                                this.dialogTableVisible = false
                                this.getData()
                            }
                        }else{
                            this.dialogTableVisible = false
                        }
                    })
                })
            },
            //合格
            handleQulify(val) {
                forthAuth(val.id).then((res)=>{
                    if (res.code == 0){
                        this.getData()
                    }else{
                        this.getData()
                    }
                })
            },
            //不合格
            handleUnqulify() {
                this.reasonInput = ''
                this.false = true
                this.dialogFormVisible = true;
            },
            handleCommit(){
                if (this.reasonInput !=''){
                    forthUnauth(this.workunitId,this.reasonInput).then((res)=>{
                        if (res.code == 0){
                            this.dialogFormVisible =false
                            this.getData()
                        }else{
                            this.getData()
                            this.handleClose1()
                        }
                    })
                } else{
                    this.$message({
                        type:'warning',
                        message:'输入不能为空'
                    })
                }

            },
            tableRowClassName({row, rowIndex}) {
                if (row.executeStatus === 4) {
                    return 'warnResult'
                }else{
                    return ''
                }
            },
            //列表选取
            handleCurrentChange(val) {
                console.log(val)
            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.tableData.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.tableData.clearSelection();
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.getIds = val
                console.log(val)
            },
            handleView(val,index){
                this.recalList = val.files
                this.recalLenth = val.files.length
            },
            handClose(){
              this.getData()
            },
            selectRows(){
                let vm = this;
                vm.itemId=[];
                vm.count = 0
                if (this.getIds.length != 0){
                    this.getIds.forEach(v => {
                        if (v.executeStatus === 2) {
                            vm.itemId.push(v.id)
                            // vm.itemId.push(v.batchNo + '-' + v.websiteId + '-' + v.subjectNo)
                        }
                    })
                    if (vm.itemId.length == 0) {
                        this.$alert('仅可以提交主体状态为待审核选项！', '提示', {
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
            //合格-多选
            handleMoreQualify(){
                let vm = this;
                vm.selectRows();
                forthMoreAuth(vm.itemId).then((res)=>{
                    if (res.code ==0){
                        this.getData()
                    }
                })
            },
            //不合格-多选
            handleMoreUnqualify(){
                let vm = this;
                vm.selectRows();
                if (vm.count ==1){
                    vm.reasonInput = ''
                    this.moreShow = true
                    vm.dialogFormVisible = true
                }
            },
            handleMoreCommit(){
                let vm = this;
                if (vm.reasonInput != ''){
                    forthMoreUnauth(vm.itemId,vm.reasonInput).then((res)=>{
                        if (res.code == 0){
                            this.moreShow = false
                            this.getData()
                            this.handleClose1()
                        }else{
                            this.moreShow = false
                            this.getData()
                            this.handleClose1()
                        }
                    })
                }else{
                    vm.$message({
                        type:'warning',
                        message:'不合格原因不能为空！'
                    })
                }

            },
            handleFileView(val){
                var title = val.fileName.split('.')
                previewFile(val.filePath,title[0])
            },
            handleClose1(){
                this.reasonInput = ''
                this.dialogFormVisible = false
            },
            handleSecondView(val){
                this.dialogTableVisible = true
                this.showCancel = val.executeStatus
                viewApi(val.id).then((res)=>{
                    if (res.code == 0){
                        this.recalList = res.result
                        this.secondList= res.result.length
                        this.showSecondList = true
                    }
                })

            },
            showVisible(){
                this.dialogTableVisible = false
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
            background: #ffffff;
            line-height: 60px;
            margin-top: 20px;
            box-sizing: border-box;
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
            .reloadBtn{
                float: left;
                margin-left: 10px;
                color: $global-color;
                .upload{
                    color: $global-color;
                    text-decoration: underline;
                }
            }
            .operateBtn {
                .btns{
                    /*float: left;*/
                    width: 100%;
                    >span{
                        float: left;
                        color: $global-color;
                        padding: 0 6px;
                        text-decoration: underline;
                        cursor: pointer;
                    }
                    .items{
                        float: left;
                        margin-left: 16px;
                        cursor: pointer;
                        color: $global-color;
                        text-decoration: underline;
                    }
                    .item{
                        padding: 0;
                        margin: 0;
                        padding-bottom: 3px;
                        text-decoration: underline;
                    }
                    .unauth{
                        color: red;
                    }
                    .pop-content{
                        float: left;
                        margin-left: 10px;
                        cursor: pointer;
                        color: $global-color;
                        text-decoration: underline;
                    }
                }
            }
        }
    }
</style>
<style lang="scss">
    @import "@/assets/css/varibles.scss";
    .confirm-wrap{
        .table{
            position: relative;
            z-index: 2;
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
        .content{
            word-break: break-all;
        }
    }
</style>
