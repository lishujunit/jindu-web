<template>
    <div class="upfile-wrap">
        <div class="btn-list clearfix" v-if="getStatus">
            <el-button type="primary"  @click="handleUpload">解压资料上传</el-button>
            <el-button type="primary" class="fr" @click="handleMoreCerfy">提交审核</el-button>
           <!--<div>-->
               <!--<el-button type="primary">解压资料上传</el-button>-->
               <!--&lt;!&ndash;<upload-pic accept=".zip,.rar" @uploadSuccess="fillUpload1">&ndash;&gt;-->
                   <!--&lt;!&ndash;<div class="upload">&ndash;&gt;-->
                       <!--&lt;!&ndash;<span>解压资料上传</span>&ndash;&gt;-->
                   <!--&lt;!&ndash;</div>&ndash;&gt;-->
               <!--&lt;!&ndash;</upload-pic>&ndash;&gt;-->
           <!--</div>-->
            <!--<div class="more-certify">-->
                <!--<el-button type="primary" @click="handleMoreCerfy">提交审核</el-button>-->
            <!--</div>-->
        </div>
        <div class="table">
            <div class="table">
                <el-table :data="tableData" :v-loading="loading" :max-height="getHeight" ref="tableData" highlight-current-row border :row-class-name="tableRowClassName" @row-click="rowClick" @selection-change="handleSelectionChange" @current-change="handleCurrentChange">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column  label="序号" width="80" align="center">
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
                    <el-table-column label="状态" align="center" width="180">
                        <template slot-scope="scope">
                            <div v-if="scope.row.status==='03'">
                                <el-popover placement="top" width="330" trigger="hover" popper-class="popover">
                                    <div class="reason">
                                        <div class="title">不合格</div>
                                        <div><p class="content">{{scope.row.auditNote}}</p></div>
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
                                <!--<span v-if="scope.row.status ==='1'" class="table-comfirm">不合格</span>-->
                                <span  v-if="scope.row.status ==='00'">已上传</span>
                                <span  v-if="scope.row.status ==='01'">待审核</span>
                                <span  v-if="scope.row.status ==='02'">合格</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="220">
                        <template slot-scope="scope">
                           <div class="buts" v-if="(scope.row.status === '03'|| scope.row.status==='00')&&getStatus">
                               <!--<div class="re-upload">-->
                                   <!--<upload-pic accept=".xlsx, .xls, .pdf, .word" @uploadSuccess="fillUpload2">-->
                                       <!--<div class="upload">-->
                                           <!--<span>重传</span>-->
                                       <!--</div>-->
                                   <!--</upload-pic>-->
                               <!--</div>-->
                               <!--<span v-if="scope.row.status==='00'||scope.row.status === '03'" @click="handleReUpload(scope.row)">重传</span>-->
                               <span  v-if="scope.row.status=== '03'" @click="handleView(scope.row)">查看</span>
                               <span v-if="(scope.row.status==='00'||scope.row.status === '03')&&getStatus" @click="handleDelete(scope.row)">删除</span>
                               <span v-if="scope.row.status=== '00'&&getStatus" @click="handleSubmit(scope.row)">提交审核</span>
                           </div>
                            <div class="buts" v-else>
                                <span @click="handleView(scope.row)">查看</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange"  :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
            </div>
            <el-dialog title="解压资料上传" :visible.sync="dialogVisible" width="35%" :before-close="handleClose" :close-on-click-modal="false">
               <el-form :model="form" label-width="80px">
                   <el-form-item label="资料选择">
                       <div class="uploadBtn" :class="{active:isActive}">
                           <upload-pic accept=".zip,.rar" @uploadSuccess="fillUpload1">
                               <div class="upload">
                                   <span v-if="!isActive">资料上传</span>
                                   <span v-else>已上传</span>
                               </div>
                           </upload-pic>
                       </div>
                   </el-form-item>
                   <el-form-item label="资料描述">
                       <el-input class="tableInput" type="textarea" :maxlength="100" placeholder="输入长度为100个字符" v-model="form.inputReason"></el-input>
                   </el-form-item>
               </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" :loading="ziploading" @click="handleConfirmUpload('form')">确 定</el-button>
                    <el-button @click="handleClose">取 消</el-button>
                </span>
            </el-dialog>
            <!--<el-dialog title="资料上传" :visible.sync="reloadDialog" width="35%" :before-close="handleClose1" :close-on-click-modal="false">-->
                <!--<el-form :model="formReload" label-width="80px">-->
                    <!--<el-form-item label="资料选择">-->
                        <!--<div class="uploadBtn">-->
                            <!--<upload-pic accept=".xlsx, .xls,.doc,.docx,.pdf,.png,.bmp,.gif,.jpeg,.jpg,.m4a" @uploadSuccess="fillUpload2">-->
                                <!--<div class="upload">-->
                                    <!--<span>文件上传</span>-->
                                <!--</div>-->
                            <!--</upload-pic>-->
                        <!--</div>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="资料描述">-->
                        <!--<el-input class="tableInput" type="textarea" :maxlength="100" placeholder="输入长度为100个字符" v-model="formReload.inputReason"></el-input>-->
                    <!--</el-form-item>-->
                <!--</el-form>-->
                <!--<span slot="footer" class="dialog-footer">-->
                    <!--<el-button @click="reloadDialog = false">取 消</el-button>-->
                    <!--<el-button type="primary" :loading="reloadLoading" @click="handleConfirmReload('form')">确 定</el-button>-->
                <!--</span>-->
            <!--</el-dialog>-->
        </div>
    </div>
</template>

<script>
    import { previewFile } from '@/utils/api'
    import uploadPic from '@/components/upload'
    import { selfDefineApi,uploadZipApi,reUploadApi,deleteApi,oneCheckApi  } from '@/api/selfDefinApi'
    import { commonAuthApi } from '@/api/commonAuthApi'
    export default {
        name: "uploadFiles",
        components:{
            uploadPic
        },
        data(){
            return{
                tableData:[],
                dialogVisible:false,
                reloadDialog:false,
                ziploading:false,
                reloadLoading:false,
                loading:true,
                show:false,
                isActive:false,
                total:0,
                pageTotal:0,
                page:1,
                pageSize:20,
                getHeight:0,
                // projectNo:'K0117050551',
                workunitId:'1',
                roleAuth:'',
                form:{
                    inputReason:'',
                },
                filePath:'',
                formReload:{
                    inputReason:'',
                },
                reloadID:'',
                reloadFiles:{
                    filePath:'',
                    fileName:''
                },
                getIds:[],
                itemId:[],
                count:0,
            }
        },
        mounted(){
          let vm = this;
          vm.getData();
          vm.getTableHeight();
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
            getTableHeight(){
                this.getHeight=window.innerHeight-400;
            },
            getData(){
                let vm = this;
                vm.loading = false
                selfDefineApi(vm.page,vm.pageSize,vm.$route.params.id).then((res)=>{
                    if (res.code == 0){
                        vm.loading = false;
                        vm.tableData = res.result.records;
                        vm.pageTotal = Number(res.result.pages);
                        vm.total = Number(res.result.total)
                        // console.log(res)
                    }
                })
            },
            //分页
            pageChange(index){
                this.page = index
                this.getData()
            },
            handleSizeChange(val){
                let vm = this;
                this.pageSize = val
                vm.page = 1;
                vm.getData()
            },
            rowClick(val){
                // console.log(val)
            },
            /*---------------   列表    -------------------*/
            handleReload(val) {
                // console.log(val)
            },
            handleDelete(val) {
                let vm = this;
                deleteApi(val.id).then((res)=>{
                    if (res.code == 0){
                        this.$message({
                            type:'success',
                            message:res.msg
                        })
                        vm.getData()
                    }else{
                        this.$alert(res.msg, '提示', {
                            confirmButtonText: '确定',
                            type: 'error',
                        });
                    }
                })
            },
            handleView(val) {
                var title = val.fileName.split('.')
                previewFile(val.filePath,title[0])
            },
            //重传
            handleReUpload(val){
                this.reloadDialog = true;
                this.reloadLoading = false;
                this.formReload.inputReason = '';
                this.reloadID = val.id
            },
            handleSubmit(val) {
                let vm = this;
                oneCheckApi(val.id).then((res)=>{
                    if (res.code == 0){
                        this.popSuccess('success',res.msg)
                        vm.getData()
                    }else{
                        this.getData()
                    }
                })
            },
            tableRowClassName({row, rowIndex}) {
                if (row.status === '03') {
                    return 'warnResult'
                }else{
                    return ''
                }
            },
            handleCurrentChange(val) {

            },
            handleSelectionChange(val){
                // console.log(val)
                this.getIds = val;
            },
            setCurrent(row) {
                this.$refs.singleTable.setCurrentRow(row);
            },
            handleSelect(item) {
                let vm = this;
            },
            //解压资料上传
            fillUpload1(path,name){
                if (path){
                    this.filePath = path
                    this.fileName = name
                    this.ziploading = false
                    this.dialogVisible = true
                    this.isActive = true
                } else{
                    this.popSuccess('warning','请等待文件上传完成后提交！')
                }
            },
            upload(options){
                let beans = options
                uploadZipApi(beans).then((res)=>{
                    if (res.code == 0){
                        // this.getData()
                    }

                })
            },
            //重传
            fillUpload2(path,name) {
                this.reloadFiles = {
                    fileName: name,
                    filePath: path
                }
            },
            handleUpload(){
                this.form.inputReason = ''
                this.dialogVisible = true
                this.isActive = false
                this.ziploading = false

            },
            handleConfirmUpload(val){
               let vm = this;
               let options = {
                   filePath:vm.filePath,
                   remark:vm.form.inputReason,
                   workunitId:vm.$route.params.id
               }
               if (vm.form.inputReason != '' && vm.filePath != ''){
                   vm.ziploading = true
                   uploadZipApi(options).then((res)=>{
                       if (res.code == 0){
                           this.dialogVisible = false;
                           this.form.inputReason = '';
                           this.getData()
                           this.popSuccess('success',res.msg)
                           vm.ziploading = false
                       }else{
                           this.ziploading = false
                       }
                   })
               }else{
                   if (vm.filePath==''){
                       this.popSuccess('warning','请等待文件上传完成后提交！')
                   } else{
                       this.popSuccess('warning','请上传文件或输入文件描述！')
                   }
               }
            },
            handleClose(){
                this.isActive = false
                this.form.inputReason = ''
                this.ziploading = false
                this.dialogVisible = false
            },
            handleClose1(){
                this.reloadDialog = false
            },
            handleConfirmReload(){
                let vm = this;
                if (vm.formReload.inputReason !=''&& vm.reloadFiles.filePath !=''){
                    let options = {
                        fileName:vm.reloadFiles.fileName,
                        filePath:vm.reloadFiles.filePath,
                        id:vm.getReloadId,
                        remark: vm.formReload.inputReason
                    }
                    reUploadApi(options).then((res)=>{
                        vm.reloadLoading = true;
                        if (res.code == 0){
                            vm.reloadDialog = false;
                            vm.formReload.inputReason = '';
                            vm.getData();
                            this.popSuccess('success',res.msg)
                            vm.reloadLoading = false;
                        }
                    })
                } else{
                    vm.$message({
                        type:'warning',
                        message:'资料文件或描述不能为空！'
                    })
                }
            },
            handleMoreCerfy(){
                let vm = this;
                vm.selectRows();
                if (vm.count == 1){
                    oneCheckApi(vm.itemId.toString()).then((res)=>{
                        if (res.code == 0){
                            this.popSuccess('success',res.msg)
                            vm.getData()
                        }else{
                            this.getData()
                        }
                    })
                }

            },
            popSuccess(type,message){
              this.$message({
                  type:type,
                  message:message
              })
            },
            selectRows(){
                let vm = this;
                vm.itemId=[];
                vm.count = 0
                if (this.getIds.length != 0){
                    this.getIds.forEach(v => {
                        if (v.status == '00') {
                            vm.itemId.push(v.id)
                            // vm.itemId.push(v.batchNo + '-' + v.websiteId + '-' + v.subjectNo)
                        }
                    })
                    if (vm.itemId.length == 0) {
                        this.$alert('仅可以提交状态为已上传选项！', '提示', {
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
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    .upfile-wrap{
        .table{
            margin-top: 20px;
            .table-comfirm{
                color: red;
            }
            .buts{
                span{
                    /*float: left;*/
                    color: $global-color;
                    padding: 0 10px;
                    cursor: pointer;
                    text-decoration: underline;
                }
                .re-upload{
                    width: 50px;
                    float: left;
                }
            }
        }
        .btn-list{
            float: left;
            width: 100%;
            margin-bottom: 10px;
            margin-top: -10px;
            .fr{
                float: right;
            }
        }
    }
    .uploadBtn{
        float: left;
        width: 2.6rem;
        background: $global-color;
        color: #fff;
        border-radius: 20px;
        &.active{
            opacity: .5;
        }
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
