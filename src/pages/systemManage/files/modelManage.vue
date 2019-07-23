<template>
    <div class="system-wrap">
       <div class="model-search">
           <el-form ref="ruleForm" label-width="70px" class="form" inline>
               <el-form-item label="模板名称" prop="name">
                   <el-autocomplete
                           class="search-input"
                           clearable
                           style="width: 320px;"
                           v-model="ruleForm.name"
                           @clear="handleClear"
                           @keyup.enter.native="handleSearch"
                           :fetch-suggestions="querySearchAsync"
                           @select="handleSelect"
                   ></el-autocomplete>
               </el-form-item>
               <el-form-item label="创建时间" prop="beginTime">
                   <el-date-picker class="date" type="date" v-model="ruleForm.startTime1" value-format="yyyy-MM-dd" :picker-options="startDatePicker" @change="getstartTime"></el-date-picker>
               </el-form-item>
               <el-form-item label="至" prop="endTime" label-width="30px">
                   <el-date-picker class="date" type="date" v-model="ruleForm.startTime2" value-format="yyyy-MM-dd" :picker-options="endDatePicker" @change="getstartTime2"></el-date-picker>
               </el-form-item>
               <el-form-item label="更新时间" prop="beginTime">
                   <el-date-picker class="date" type="date" v-model="ruleForm.endTime1" value-format="yyyy-MM-dd" :picker-options="startDatePicker1" @change="getendTime1"></el-date-picker>
               </el-form-item>
               <el-form-item label="至" prop="endTime" label-width="30px">
                   <el-date-picker class="date" type="date" v-model="ruleForm.endTime2" value-format="yyyy-MM-dd" :picker-options="endDatePicker2" @change="getendTime2"></el-date-picker>
               </el-form-item>
               <div class="fr">
                   <el-button type="primary" @click="getData(1)">搜索</el-button>
                   <el-button type="danger" @click="resetForm()">重置</el-button>
               </div>
           </el-form>
       </div>
        <div class="model-table mt20">
            <el-table :data="tableData" border :v-loading="loading" :max-height="getHeight">
                <el-table-column prop="index" label="序号" align="center" width="60">
                    <template slot-scope="scope">
                        {{scope.$index+(page-1)*pageSize+1}}
                    </template>
                </el-table-column>
                <el-table-column prop="templateFileName" label="模板名称" align="center">
                    <template  slot-scope="scope">
                        <p class="btns">
                            <span @click="handleView(scope.row)">{{scope.row.templateFileName}}</span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column prop="bookMarkName" label="所属核查项" align="center"></el-table-column>
                <el-table-column prop="workUnitName" label="所属工作单元" align="center"></el-table-column>
                <el-table-column prop="projectTypeName" label="所属项目类型" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="createUser" label="创建人" align="center"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
                <el-table-column prop="updateUser" label="更新人" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template  slot-scope="scope">
                        <p class="btns">
                            <span @click="handleDownload(scope.row)">下载模板</span>
                            <span @click="handleAllFresh(scope.row)">更新模板</span>
                        </p>
                    </template>
                </el-table-column>
            </el-table>
            <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
        </div>
        <el-dialog :visible.sync="dialogVisible" width="25%" title="上传模板" :before-close="handleCancel" :close-on-click-modal="false">
            <div  class="dialog-alert">
                <p><i class="el-icon-warning"></i></p>
                <p>请勿修改模板名称等既有内容，否则无法导入！</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <div class="dialog-content clearfix">
                    <div>
                        <p>{{refreshName}}</p>
                    </div>
                   <div>
                      <div class="unload-btn" :class="{active:isActive}">
                           <upload-pic accept=".xlsx, .xls" @uploadSuccess="fillUpload2">
                            <div class="upload">
                                <span>上传</span>
                            </div>
                        </upload-pic>
                      </div>
                       <el-button @click="handleCancel">取消</el-button>
                   </div>
                </div>
            </span>
        </el-dialog>
        <download :path="downloadPath" :name="downloadName" @downloadDone="downloadDone"/>
    </div>
</template>

<script>
    import uploadPic from '@/components/upload'
    import { getUrlType,downloadApi,moduleDownload,moduleApi,moduleUpdateApi,moduleSearchApi } from '@/api/systemManageApi'
    import download from "@/components/download";
    import { previewFile } from '@/utils/api'
    export default {
        name: "modelManage",
        components:{
            uploadPic,
            download
        },
        data(){
            return{
                getHeight:window.innerHeight - 290,
                ruleForm:{
                    name:'',
                    time1:[],
                    time2:[]
                },
                tableData:[],
                dialogVisible:false,
                loading:false,
                isActive:false,
                downloadPath:'',
                downloadName:'',
                pageTotal:0,
                total:0,
                page:1,
                pageSize:20,
                getUpId:'',
                baseUrl:'',
                startTime1:'',
                startTime2:'',
                endTime1:'',
                endTime2:'',
                refreshName:'',
                //创建时间
                startDatePicker: {
                    disabledDate: (time) => {
                        if (this.ruleForm.startTime2 != "") {
                            return time.getTime() >  new Date(this.ruleForm.startTime2).getTime();

                        }
                    },
                },
                endDatePicker: {
                    disabledDate: (time) => {
                        return time.getTime() < new Date(this.ruleForm.startTime1).getTime()- 1*24*60*60*1000;//减去一天的时间代表可以选择同一天;
                    },

                },
                //创建时间
                startDatePicker1: {
                    disabledDate: (time) => {
                        if (this.ruleForm.endTime2 != "") {
                            return time.getTime() >  new Date(this.ruleForm.endTime2).getTime();

                        }
                    },
                },
                endDatePicker2: {
                    disabledDate: (time) => {
                        return time.getTime() < new Date(this.ruleForm.endTime1).getTime()- 1*24*60*60*1000;//减去一天的时间代表可以选择同一天;
                    },

                },
            }
        },
        mounted(){
            let vm = this;
            vm.baseUrl = process.env.VUE_APP_BASEURL;
            this.getData(1)
        },
        methods:{
            //列表
            getData(val){
                this.loading = true
                this.page = val
                let options = {
                    createBeginTime:this.ruleForm.startTime1,
                    createEndTime:this.ruleForm.startTime2,
                    name:this.ruleForm.name,
                    updateBeginTime:this.ruleForm.endTime1,
                    updateEndTime:this.ruleForm.endTime2,
                    pageNum:this.page,
                    pageSize:this.pageSize
                }
                moduleApi(options).then((res)=>{
                    if (res.code == 0){
                        this.loading = false
                        this.tableData = res.result.records
                        this.total = Number(res.result.total)
                        this.pageTotal = Number(res.result.pages)
                    }
                })
                this.page = val
            },
            //分页
            pageChange(val){
                this.getData(val)
            },
            handleSizeChange(val){
                this.pageSize = val
                this.getData(1)
            },
            //主体名称
            querySearchAsync(queryString, cb) {
                let getFileName = []
                let options = {
                    name:queryString
                }
                moduleSearchApi(options).then((res)=>{
                    if (res.code == 0){
                        res.result.forEach(item=>{
                            getFileName.push({value:item})
                        })
                    }
                    var results = getFileName;
                    cb(results);
                })
            },
            handleClear(){
                this.ruleForm.name = ''
                this.getData(1)
            },
            handleSelect(val){
                this.ruleForm.name = val.value
                this.getData(1)
            },
            handleSearch(){
                this.getData(1)
            },
            //搜索重置
            resetForm(){
                this.ruleForm.name = ''
                this.ruleForm.startTime1 = ''
                this.ruleForm.startTime2 = ''
                this.ruleForm.endTime1 = ''
                this.ruleForm.endTime2 = ''
                this.getData(1)
            },
            //更新模板
            handleAllFresh(val){
                this.getUpId = val.id
                this.isActive = true
                this.dialogVisible = true
                this.refreshName = val.templateFileName.split('.')[0]
            },
            //上传
            fillUpload2(path,name){
                this.loading = true
                let options = {
                    templateId :this.getUpId,
                    fileName:name,
                    filePath:path,
                }
                moduleUpdateApi(options).then((res)=>{
                    if (res.code == 0){
                        this.loading = false
                        this.getData(1)
                        this.handleCancel()
                    }else{
                        this.getData(this.page)
                    }
                })
            },
            //关闭弹框
            handleCancel(){
                this.dialogVisible = false
            },
            //下载
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
                        downloadUrl = "/templateManagement/" + getUrlType() + "/download/"+interviewId;
                        break;
                    case "InterviewPlan":
                        downloadUrl = '/templateManagement/download/'+ interviewId;
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
            //下载
            handleDownload(val){
                moduleDownload(val.id).then((res)=>{
                    if (res.code != 92329){
                        this.download(this.baseUrl, val.templateFileName, "InterviewPlan",val.id);
                    }
                })
                // this.download(this.baseUrl, val.templateFileName, "InterviewPlan",val.id);
            },
            //查看
            handleView(val){
                var title = val.templateFilePath.split('.')
                previewFile(val.templateFilePath,title[0])
            },
            handleTime1(val){
                this.ruleForm.time1 = val
                if (val !=''){
                    this.startTime1 = val[0]
                    this.startTime2 = val[1]
                    this.getData(1)
                }

            },
            getstartTime(val){
              this.ruleForm.startTime1 = val
            },
            getstartTime2(val){
                this.ruleForm.startTime2 = val
            },
            getendTime1(val){
                this.ruleForm.endTime1 = val
            },
            getendTime2(val){
                this.ruleForm.endTime2 = val
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    @import "common";
    .uploadBtn{
        &.active{
            opacity: .5;
        }
        .upload{
            color: #fff;
        }
    }
</style>
