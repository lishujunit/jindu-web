<template>
    <div class="create-wrap">
        <div class="button-list">
            <div class="import-btn" v-if="getStatus">
                <upload-pic accept=".xlsx, .xls" @uploadSuccess="fillUpload2">
                    <div class="upload">
                        <span>导入询证计划</span>
                    </div>
                </upload-pic>
            </div>
            <el-button type="primary" @click="handleExport">导出询证计划</el-button>
            <el-button type="text" style="text-decoration: underline" @click="handleDownload">下载询证计划模板</el-button>
            <el-button type="primary" class="submit" @click="handleSubmit"  v-if="getStatus">提交确认</el-button>
        </div>
        <div class="table">
            <el-table :data="tableData" v-loading="loading" :max-height="getHeight" ref="multipleTable" border :row-class-name="tableRowClassName" @selection-change="handleSelectionChange"  @current-change="handleCurrentChange" @row-click="handleRowClick">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column type="index" label="序号" width="60" align="center">
                    <template slot-scope="scope">
                        {{scope.$index+(page-1)*pageSize+1}}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="主体名称" align="center"></el-table-column>
                <el-table-column label="状态" align="center" width="100">
                    <template slot-scope="scope">
                        <div v-if="scope.row.createStatus===4">
                            <el-popover placement="top" width="330" trigger="hover" popper-class="popover">
                                <div class="reason">
                                    <div class="title">不合格</div>
                                    <div class="text">{{scope.row.nopassRemark}}</div>
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
                            <!--<span v-if="scope.row.createStatus===4" class="table-comfirm">不合格</span>-->
                        </div>
                        <div v-else>
                            <span v-if="scope.row.createStatus===0">待确认</span>
                            <span v-if="scope.row.createStatus===2">待审核</span>
                            <span v-if="scope.row.createStatus===3">合格</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                    <template slot-scope="scope">
                        <div class="btns" v-if="scope.row.createStatus ===0 || scope.row.createStatus === 4">
                            <!--<span @click="handleReload(scope.row)">重传</span>-->
                            <span @click="handleDelete(scope.row)"  v-if="getStatus">删除</span>
                            <span @click="handleCertify(scope.row)"  v-if="getStatus">提交确认</span>
                        </div>
                        <!--<div v-else>-</div>-->
                    </template>
                </el-table-column>
            </el-table>
            <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
        </div>
        <download :path="downloadPath" :name="downloadName" @downloadDone="downloadDone"/>
    </div>
</template>

<script>
    import { unitInqueryApi,importApi,downloadApi,oneCertify,moreCertify,deleteApi,getWorkUnitId,getUrlType,exportInterview } from '@/api/workUnitInqury'
    import uploadPic from '@/components/upload'
    import download from "@/components/download";
    import { MessageBox } from "element-ui";
    export default {
        name: "unitCreate",
        components:{
            uploadPic,
            download
        },
        data(){
            return{
                loading:true,
                downloadPath:'',
                downloadName:'',
                baseUrl:'',
                tableData:[],
                total: 0,
                page: 1,
                pagenum:1,
                pageSize: 20,
                workUnitId:'1',
                inquiryIds:[],
                getItems:[],
                getHeight:0,
                pageTotal:0,
                count:0,
            }
        },
        mounted(){
          let vm = this;
          vm.workUnitId = vm.$route.params.id;
          vm.baseUrl = process.env.VUE_APP_BASEURL;
          vm.uploadAction = process.env.VUE_APP_UPLOAD;
          vm.getData();
          vm.getTableHeight();
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
            getTableHeight(){
                this.getHeight=window.innerHeight-360;
            },
            getData(){
              let vm = this;
              vm.loading = false;
              unitInqueryApi(vm.$route.params.id,vm.page,vm.pageSize).then((res)=>{
                  if (res.code == 0){
                      // console.log(res)
                      vm.loading = false;
                      vm.tableData = res.result.records;
                      vm.pageTotal = Number(res.result.pages);
                      vm.total = Number(res.result.total);
                  }
              })
            },
            //分页
            pageChange(index){
                let vm = this;
                vm.page = index;
                vm.getData();
            },
            handleSizeChange(val){
              this.pageSize = val;
              this.page = 1;
              this.getData();
            },
            //导入询证计划
            fillUpload2(path,name){
                let options={
                    filePath: path,
                    workUnitId : this.$route.params.id
                }
                this.upload(options)
            },
            upload(options){
                importApi(options.filePath,options.workUnitId).then(res=>{
                    if(res.code==0){
                        this.page = 1
                        this.getData()
                        this.$message({
                            type:'success',
                            message:'上传成功'
                        })
                    }
                }).catch((error)=>{
                    console.log(error)
                })
            },
            // 导出询证计划
            handleExport(){
                if (this.inquiryIds.length) {
                    let interviewId = [];
                    this.inquiryIds.forEach(v => {
                        interviewId.push(v.id);
                    });
                    exportInterview({
                        inquiryIds: interviewId.toString()
                    }).then(res => {
                        this.download(
                            this.baseUrl,
                            "询证计划.xls",
                            "InterviewPlan",
                            interviewId.toString()
                        );
                    });
                } else {
                    MessageBox.alert("请选择询证计划", "提示", {
                        type: "warning",
                        confirmButtonText: "确定",
                        callback: () => {}
                    });
                    return false;
                }
                // let vm = this;
                // var getIds = [];
                // if(vm.inquiryIds.length !=0){
                //     vm.inquiryIds.forEach(item=>{
                //         getIds.push(item.id)
                //     })
                //     downloadApi('','询证计划.xls','InterviewPlan',getIds)
                // }else{
                //     vm.$message({
                //         type:'warning',
                //         message:'请选择导出的计划'
                //     })
                // }
            },
            //下载模板
            handleDownload(){
                this.download(this.baseUrl, "询证计划模板.xls", "Template");
                // downloadApi('','','Template')
                // downloadApi('','','InterviewPlan',this.inquiryIds)
            },
            selectRow(){
                let vm = this;
                vm.getItems=[];
                vm.count = 0
                if (this.inquiryIds.length != 0){
                    this.inquiryIds.forEach(v => {
                        if (v.createStatus === 0 || v.createStatus === 4) {
                            vm.getItems.push(v.id)
                            // vm.itemId.push(v.batchNo + '-' + v.websiteId + '-' + v.subjectNo)
                        }
                    })
                    if (vm.getItems.length == 0) {
                        this.$alert('仅可以提交主体状态为待确认或不合格选项！', '提示', {
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
            // },
            //提交确认--多个
            handleSubmit(){
                let vm = this;
                vm.selectRow()
                    if (vm.count == 1){
                        moreCertify(vm.getItems.toString()).then((res)=>{
                            if (res.code == 0){
                                this.getData()
                                this.$message({
                                    type:'success',
                                    message:res.msg
                                })
                            }
                        })
                    }
            },
            //确认提交 -- 一个
            oneCertifyUpdate(val){
                oneCertify(val.id).then((res)=>{
                    if (res.code == 0){
                        this.$message({
                            type:'success',
                            message:'操作成功！'
                        })
                        this.getData()
                    }else{
                        this.getData()
                    }
                })
            },
            /**************************      table点击事件    ***************************/
            //操作-重传
            handleReload(val){
                // console.log(val)
            },
            //操作-删除
            handleDelete(val){
                this.$confirm('确定删除？','提示',{
                    type:'warning',
                    confirmButtonText: '删除',
                    cancelButtonText: '取消'
                }).then(()=>{
                    deleteApi(val.id).then((res)=>{
                        if (res.code == 0){
                            this.$message({
                                type:'success',
                                message:'删除成功！'
                            })
                            this.getData()
                        }else{
                            this.getData()
                        }
                    })
                })

            },
            handleCertify(val){
                this.oneCertifyUpdate(val)
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
            tableRowClassName({row, rowIndex}) {
                if (row.createStatus === 4) {
                    return 'warnResult'
                }else{
                    return ''
                }
            },
            //列表选取
            handleCurrentChange(val){
                // console.log(val)
            },
            handleRowClick(val){
                if (val.status) {

                }
                // console.log(val)
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
                        downloadUrl = "/inquiryInfo/" + getUrlType() + "/download";
                        break;
                    case "InterviewPlan":
                        downloadUrl = '/inquiryInfo/export?inquiryIds=' + interviewId;
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
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
    .create-wrap{
        .text_under{
            span{
                text-decoration: underline;
            }
        }
        .submit{
            float: right;
        }
        .table{
            margin-top: 20px;
            .table-comfirm{
                color:red;
            }
            .btns{
                color: $global-color;
                span{
                    padding: 0 10px;
                    text-decoration: underline;
                    cursor: pointer;
                    text-decoration: underline;
                }
            }
        }
    }
    .button-list{
        .text_under{
            margin-left: -10px;
        }
    }
    .import-btn{
        float: left;
        width: 120px;
        background: $global-color;
        border-radius: 20px;
        color: #fff;
        height: 30px;
        font-size: 12px;
        box-sizing: border-box;
        line-height: 30px;
        margin-right: 20px;
        .upload{
            color: #fff;
        }
    }
</style>
<style lang="scss">
    @import '@/assets/css/varibles.scss';
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
        box-sizing: border-box;
        padding-bottom: 10px;
        >span {
            display: block;
            margin: 30px 40px 20px;

        }
        >div:nth-of-type(2){
            padding: 20px;
            word-break: break-all;
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


