<template>
    <div class="chenckFile-wrap">
        <div class="button-list" v-if="getStatus">
            <el-button type="primary" @click="handleAuth">合格</el-button>
            <el-button type="danger" @click="handleUnauth">不合格</el-button>
        </div>
        <div class="checkFileTable">
            <el-table :data="tableData" :max-height="getHeight" :v-loading="loading" border ref="tableData"  highlight-current-row :row-class-name="tableRowClassName" @selection-change="handleSelectionChange"  @current-change="handleCurrentChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column type="index" label="序号" width="80" align="center">
                    <template slot-scope="scope">
                        {{scope.$index+(page-1)*pageSize+1}}
                    </template>
                </el-table-column>
                <el-table-column prop="fileName" label="资料名称" align="center">
                    <template slot-scope="scope">
                        <p class="title-link"  @click="handleView(scope.row)">{{scope.row.fileName}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="描述" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <p class="one-line">{{scope.row.remark}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="updateUserName" label="最后操作人" align="center"></el-table-column>
                <el-table-column prop="updateTime" label="最后操作时间" align="center"></el-table-column>
                <el-table-column label="状态" align="center" width="200">
                    <template slot-scope="scope" slot="header">
                        <div class="status-change">
                            <div>状态</div>
                            <div class="status-select">
                                <el-select  v-model="status" @change="statusChange">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                    ></el-option>
                                </el-select>
                            </div>
                        </div>
                    </template>
                    <template slot-scope="scope">
                        <div v-if="scope.row.status==='03'">
                            <el-popover placement="top" width="330" trigger="hover" popper-class="popover">
                                <div class="reason">
                                    <div class="title">不合格</div>
                                    <div>{{scope.row.auditNote}}</div>
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
                        <div v-else>
                            <!--<span  v-if="scope.row.status ==='1'" class="table-comfirm">不合格</span>-->
                            <span  v-if="scope.row.status ==='00'">已上传</span>
                            <span  v-if="scope.row.status ==='01'">待审核</span>
                            <span  v-if="scope.row.status ==='02'">合格</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="number" label="操作" align="center" width="200">
                    <template slot-scope="scope">
                       <div class="btns" v-if="(scope.row.status==='03'||scope.row.status==='01')&&getStatus">
                           <span  @click="handleView(scope.row)">查看</span>
                           <!--<span v-if="scope.row.status==='03'" @click="handleUpload(scope.row)">重传</span>-->
                           <span v-if="scope.row.status==='03'&&getStatus" @click="handleDelete(scope.row)">删除</span>
                           <span v-if="scope.row.status==='01'&&getStatus" @click="handleQulify(scope.row)">合格</span>
                           <span v-if="scope.row.status==='01'&&getStatus" class="unAuth" @click="handleUnqulify(scope.row)">不合格</span>

                       </div>
                        <div class="btns" v-else>
                            <span @click="handleView(scope.row)">查看</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange"  :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
        </div>
        <!--不合格-->
        <el-dialog title="不合格原因" :visible.sync="dialogFormVisible" width="30%" :before-close="handleClose" :close-on-click-modal="false">
            <el-input placeholder="输入长度为100个字符" type="textarea" rows="4"  maxlength="100" v-model="reasonInput"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary"  @click="handleCommit">确 定</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </div>
        </el-dialog>
        <!--重传-->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="35%" :before-close="handleClose1" :close-on-click-modal="false">
            <el-form :model="form" label-width="80px">
                <el-form-item label="资料选择">
                    <div class="uploadBtn">
                        <upload-pic accept=".xlsx, .xls,.doc,.docx,.pdf,.png,.bmp,.gif,.jpeg,.jpg,.m4a" @uploadSuccess="fillUpload1">
                            <div class="upload">
                                <span>文件上传</span>
                            </div>
                        </upload-pic>
                    </div>
                </el-form-item>
                <el-form-item label="资料描述">
                    <el-input class="tableInput" type="textarea" :maxlength="100" placeholder="输入长度为100个字符" v-model="form.inputReason"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" :loading="uploading" @click="handleConfirmUpload('form')">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
    import { previewFile } from '@/utils/api'
    import uploadPic from '@/components/upload'
    import { secondListApi,secondAuthApi,secondUnauthApi,deleteApi,reUploadApi } from '@/api/selfDefinApi'
    export default {
        name: "checkFiles",
        components:{
            uploadPic
        },
        data(){
            return{
                status:"",
                dialogFormVisible:false,
                dialogVisible:false,
                loading:true,
                uploading:false,
                reasonInput:'',
                options:[
                    {
                        value: "",
                        label: "全部"
                    },{
                        value: "01",
                        label: "待审核"
                    },
                    {
                        value: "03",
                        label: "不合格"
                    },
                    {
                        value: "02",
                        label: "合格"
                    }
                ],
                tableData:[],
                workunitId:'',
                projectNo:'',
                total:0,
                pageTotal:0,
                page:1,
                pageSize:20,
                getRows:[],
                rowIds:[],
                count:0,
                form:{
                    inputReason:''
                },
                reupload:{
                    fileName:'',
                    filePath:'',
                    id:'',
                    remark:''
                },
                getHeight:0,
            }
        },
        mounted(){
          this.getData();
          this.getTableHeight();
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
                this.getHeight=window.innerHeight-430;
            },
            getData(){
              let vm = this;
              vm.loading = false;
                secondListApi(vm.page,vm.pageSize,vm.status,vm.$route.params.id).then((res)=>{
                    if (res.code == 0){
                        vm.loading = false;
                        vm.tableData = res.result.records;
                        vm.total = Number(res.result.total);
                        vm.pageTotal = Number(res.result.pages);
                    }
              })
            },
            statusChange(val){
                this.page = 1;
                this.status = val
                this.getData()
            },
            //分页
            pageChange(index){
                this.page = index
                this.getData()
            },
            handleSizeChange(val){
                let vm = this;
                vm.pageSize = val;
                vm.page = 1;
                vm.getData()
            },
            /*---------------   列表    -------------------*/
            handleDelete(val) {
                deleteApi(val.id).then((res)=>{
                    if (res.code == 0){
                        this.popSuccess('success',res.msg)
                        this.getData()
                    }
                })
                this.tableData.splice(val,1)
            },
            //查看
            handleView(val) {
                var title = val.fileName.split('.')
                previewFile(val.filePath,title[0])
            },
            //重传
            handleUpload(val){
                this.reupload.id = val.id
                this.form.inputReason = '';
                this.dialogVisible = true;

            },
            //重传--确认
            handleConfirmUpload(){
                let vm = this;
                let options = {
                    fileName:vm.reupload.fileName,
                    filePath:vm.reupload.filePath,
                    id:vm.reupload.id,
                    auditNote:vm.form.reasonInput,
                }
                if (vm.form.reasonInput !=''&& vm.reupload.filePath !='') {
                    vm.uploading = true
                    reUploadApi(options).then((res)=>{
                        if (res.code == 0){
                            this.popSuccess('success',res.msg)
                            this.getData()
                            vm.form.reasonInput = ''
                            vm.dialogVisible = false
                            vm.uploading = false
                        }
                    })
                }else{
                    this.$message({
                        type:'warning',
                        message:'上传文件或备注不能为空！'
                    })
                }
            },
            //重传--文件
            fillUpload1(filePath,name){
                this.reupload = {
                    filePath:filePath,
                    fileName:name
                }
            },
            handleClose(){
                this.reasonInput = '';
                this.rowIds = []
                this.dialogFormVisible = false;
            },
            handleClose1(){
                this.dialogVisible = false
                this.form.inputReason = ''
            },
            //合格-单个
            handleQulify(val) {
                // console.log(val)
                secondAuthApi(val.id).then((res)=>{
                    if (res.code == 0){
                        this.popSuccess('success',res.msg)
                        this.page = 1
                        this.getData()
                    }else{
                        this.page = 1
                        this.getData()
                    }
                })
            },
            //不合格--单个
            handleUnqulify(val) {
                this.rowIds.push(val.id)
                // this.singleId = val.id
                this.reasonInput = '';
                this.dialogFormVisible = true;

                // this.getUnauth(val.id)
            },
            handleSubmit(val) {
                console.log(val)
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.getRows = val
                console.log(val)
            },
            //列表选取
            handleCurrentChange(val) {
                this.setCurrent = val;
            },
            setCurrent(row) {
                this.$refs.singleTable.setCurrentRow(row);
            },
            handleSelect(item) {
                let vm = this;
            },
            //文件重传
            fillUpload2(path,name){
                let options = {
                    filePath:path,
                    fileName:name
                }
                this.upload(options)
            },
            upload(options){

            },
            //不合格原因--弹框提交
            handleCommit(){
                if(this.reasonInput != ''){
                    this.getUnauth()
                }else{
                    this.$message({
                        type:'warning',
                        message:'输入不能为空'
                    })
                }
            },
            getUnauth(){
                let vm = this
                let ids = vm.rowIds.join()
                if (vm.reasonInput != ''){
                    let beans = {
                        ids:ids,
                        auditNote:vm.reasonInput
                    }
                    secondUnauthApi(beans).then((res)=>{
                        if (res.code == 0){
                            this.popSuccess('success',res.msg)
                            vm.dialogFormVisible = false;
                            vm.reasonInput = ''
                            vm.rowIds = []
                            this.page = 1
                            vm.getData()
                        }else{
                            this.page = 1
                            this.handleClose()
                            this.getData()
                        }
                    })
                }
            },
            //合格-多个按钮
            handleAuth(){
                let vm = this;
                vm.getSelect()
                vm.getMoreauth()
            },
            getMoreauth(){
                secondAuthApi(this.rowIds.join()).then((res)=>{
                    if (res.code == 0){
                        this.popSuccess('success',res.msg)
                        this.getData()
                    }
                })
            },
            getSelect(){
                let vm = this;
                vm.rowIds=[];
                vm.count = 0
                if (this.getRows.length != 0){
                    this.getRows.forEach(v => {
                        if (v.status == '01') {
                            vm.rowIds.push(v.id)
                            // vm.itemId.push(v.batchNo + '-' + v.websiteId + '-' + v.subjectNo)
                        }
                    })
                    if (vm.rowIds.length == 0) {
                        this.$alert('仅可以提交状态为待审核选项！', '提示', {
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
            //不合格--多选
            handleUnauth(){
                let vm = this;
                vm.getSelect()
                if (vm.count == 1){
                    vm.reasonInput = '';
                    vm.dialogFormVisible = true
                }
            },

        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    .chenckFile-wrap{
        .checkFileTable{
            margin-top: 20px;
            .table-comfirm{
                color:red;
            }
            .btns{
                color: $global-color;
                /*float: left;*/
                span{
                    text-decoration: underline;
                    padding: 0 10px;
                    cursor: pointer;
                }
                >span:first-of-type{
                    padding-left: 0;
                }
                .unAuth{
                    color: red;
                }
            }
        }
    }
    .uploadBtn{
        float: left;
        width: 2.6rem;
        background: $global-color;
        color: #fff;
        border-radius: 20px;
        .upload{
            color: #fff;
        }
    }
    .one-line{
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
    }
    .title-link{
        color: $global-color;
        cursor: pointer;
        text-decoration: underline;
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
    .status-select{
        width: 60px;
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
