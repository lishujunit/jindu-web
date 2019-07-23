<template>
    <div class="file-wrap">
        <div class="file-title  clearfix">
           <div class="select">
               <el-select v-model="selectValue" @change="selectChange" placeholder="请选择" style="width: 6.5rem;">
                   <el-option
                       v-for="item in selectOptions"
                       :key="item.id"
                       :label="item.titleName"
                       :value="item.id">
                   </el-option>
               </el-select>
           </div>
            <div class="btn-rght">
                <el-button  type="primary" @click="goBack">返回</el-button>
            </div>
        </div>
        <div class="title-name">
            <div>
                <div class="uplaod-width uploadBox" v-if="isShowOperating">
                    <upload-pic accept=".doc, .docx, .xls,.xlsx,.pdf,.png,.bmp,.gif,.jpeg,.jpg,.m4a" @uploadSuccess="fillUpload1">
                        <div class="upload">
                            <i class="el-icon-plus"></i>
                            <span>上传</span>
                        </div>
                    </upload-pic>
                </div>
                <el-button class="btn" type="primary" @click="handleMark" v-if="isShowOperating">标记</el-button>
                <el-button class="btn" type="primary" @click="handleCerfiy" v-if="userAuth.indexOf('Partnership')>-1|| userAuth.indexOf('Resp')>-1" v-show="isShowOperating">确认</el-button>
            </div>
            <div class="file-name">
                <p v-show="getTimeString.fileName">{{getTimeString.fileName}}</p>
            </div>
            <div>
                <p v-show="getTimeString.fileName">{{getTimeString.uploadUserName}}</p>
                <p v-show="getTimeString.fileName">
                    <span>{{getTimeString.uploadTime}}</span>
                    <span>上传</span>
                </p>
            </div>
            <div>
                <p v-show="getTimeString.reviewer">{{getTimeString.reviewer}}</p>
                <p v-show="getTimeString.reviewTime">
                    <span>{{getTimeString.reviewTime}}</span>
                    <span>提交审核</span>
                </p>
            </div>
            <div class="pop-btn">
                <el-popover v-show="getTimeString.fileName" placement="bottom" width="330" trigger="hover">
                    <div class="reason">
                        <div class="title" v-if="isShowOperating">不合格</div>
                        <p class="content">{{getTimeString.remark}}</p>
                        <div class="time">
                            <span>{{getTimeString.uploadUserName}}</span>
                            <span>{{getTimeString.uploadTime}}</span>
                        </div>
                    </div>
                    <div class="danger" slot="reference">
                        不合格
                        <i style="font-size: 14px;" class="el-icon-info"></i>
                    </div>
                </el-popover>
            </div>
        </div>
        <div class="process-wrap clearfix">
            <div class="process-left clearfix" :class="{active:isActive}">
                <div class="left-title">
                    <div>
                        <p>文档名称</p>
                        <el-autocomplete class="search-input"
                             v-model="state4"
                             clearable
                             @clear="handleUpClearFile"
                             :fetch-suggestions="querySearcFile"
                             @select="handleSelectFile"
                        ></el-autocomplete>
                    </div>
                    <div v-if="!isActive">
                        <p>上传人</p>
                        <el-autocomplete class="search-input"
                             v-model="state5"
                             clearable
                             @clear="handleUpClearUploader"
                             :fetch-suggestions="querySearchUploader"
                             @select="handleSelectUploader"
                        ></el-autocomplete>
                    </div>
                    <div>
                        <p @click="handleSearch">搜索</p>
                    </div>
                </div>
                <!-- <div class="left-table" :style="contentHeight" :class="{active:isActive}">
                    <el-table :data="tableData"  ref="tableData" border highlight-current-row @row-click="handleListClick" @current-change="handleCurrentChange" :cell-class-name="cellClass" :row-class-name="tableRowClassName">
                        <el-table-column width="50" align="center" class="select-item">
                            <template slot-scope="scope">
                                <div >
                                    <el-radio v-model="radio" :label="scope.$index" @change.native="getRadio(scope.$index,scope.row)">&nbsp</el-radio>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="序号" width="50" align="center"> -->

                <div class="left-table" :class="{active:isActive}">
                    <el-table :data="tableData"
                     ref="tableData" border 
                     highlight-current-row 
                     @row-click="handleListClick"
                     :row-class-name="rowClass"	
                     >
                       <el-table-column width="50" align="center">
                           <template slot-scope="scope">
                               <div>
                                   <el-radio v-model="radio" :label="scope.$index" @change.native="getRadio(scope.$index,scope.row)">&nbsp</el-radio>
                               </div>
                           </template>
                       </el-table-column>
                        <el-table-column width="55" align="center" label="序号">
                            <template slot-scope="scope">
                                {{scope.$index+(pagenum-1)*pagesize+1}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="fileName" label="文档名称" align="center" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span class="fileName" style="cursor: pointer;">{{scope.row.fileName}}</span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="uploadUserName" v-if="show" label="上传人" align="center"></el-table-column>
                        <el-table-column prop="uploadTime" v-if="show" label="上传时间" align="center" width="100"></el-table-column> -->
                        <el-table-column prop="uploadUserName" v-if="show" label="上传人" align="center" width="90"></el-table-column>
                        <el-table-column prop="uploadTime" v-if="show" label="上传时间" align="center" width="90"></el-table-column>
                        <el-table-column v-if="show" label="操作" width="120" align="center">

                            <template slot-scope="scope" >
                               <div class="span-item" v-if="userAuth.indexOf('Partnership')>-1|| userAuth.indexOf('Resp')>-1">
                                   <div v-if="scope.row.isConfirmed == 'N'" style="float: left;margin: 0 0;">
                                       <span @click="remark(scope.row)" v-if="scope.row.isMark=='N'" v-show="isShowOperating">标记</span>
                                       <span @click="handleRowComfirm(scope.row)"  v-else>确认</span>
                                   </div>
                                   <div v-else style="float: left;margin: 0 0;">  
                                       <!-- <span class="cancel-remark" v-if="scope.row.isMark=='Y'" @click="remark(scope.row)">取消标记</span> -->
                                   </div>
                                   <div>
                                       <span @click="downloadFile(scope.row)">下载</span>
                                   </div>
                               </div>
                                <div class="span-item" v-else>
                                    <div v-if="scope.row.isConfirmed=='N'" style="float: left;margin: 0 0;">
                                        <span @click="remark(scope.row)" v-if="scope.row.isMark=='N'" v-show="isShowOperating">标记</span>
                                        <!-- <span v-else>确认</span> -->
                                    </div>
                                    <div v-else  style="float: left;margin: 0 0;">
                                        
                                    </div>
                                   <div>
                                       <span @click="downloadFile(scope.row)">下载</span>
                                   </div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="footer">
                        <div>
                            <span>共{{total}}条</span>
                        </div>
                        <div>
                            <div :class="{active:isActive}">
                                <div class="preve-page" :class="{active:getStart}" @click="handlePrive"></div>
                                <span>{{current}}</span>
                                <span>/</span>
                                <span>{{pageTotal==0?1:pageTotal}}</span>
                                <div class="next-page" :class="{active:getEnd}" @click="handleEnd"></div>
                            </div>
                        </div>
                        <div>
                            <span @click="handleCollapse" v-if="show">收起 <i class="el-icon-arrow-left"></i> </span>
                            <span @click="handleCollapse" v-if="!show">展开 <i class="el-icon-arrow-right"></i> </span>
                        </div>
                    </div>
                </div>
                <div class="collapse-btn" :class="{active:isActive}" @click="handleCollapse"></div>
            </div>
            <div class="process-right clearfix" :class="{active:isActive}">
                <div class="right-title">
                    <p class="empty"></p>
                    <p @click="handleAnnotion" v-if="userAuth.indexOf('Partnership')>-1|| userAuth.indexOf('Resp')>-1" v-show="isShowOperating" class="ss">不合格</p>
                </div>
                <div class="right-content" :style="contentHeight" :class="{active:isActive}" >
                    <iframe id="preview" :src="pageurl" frameborder="0" width="100%" height="100%" name="previewFile" scrolling="auto"/>
                </div>
            </div>
            <!-- 批注弹框 -->
            <el-dialog
                title='不合格原因'
                :visible.sync="dialogVisible"
                width="560px"
                :before-close="handleClose">
                <!--<span>批注为不合格文件</span>-->
                <el-input class="process-input" placeholder="100字以内" maxlength="100" type="textarea" v-model="annotion"></el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleConfirm">确 定</el-button>
                </span>
            </el-dialog>
        </div>


        <download :path="downloadPath" :params="downloadParams" :name="downloadName" @downloadDone="downloadDone"/>
        <!-- 下载文件公用组建，path和name为必传项，分别代表下载路径和下载名称(带扩展名如.xls), downloadDone方法是下载成功后的回调 -->
    </div>
</template>

<script>
    import uploadPic from '@/components/upload'
    import download from "@/components/download";
    import { processDetails,uploadApi,selectApi,remarkApi,confirmApi,downloadApi,authApi } from '@/api/finalReport'
    export default {
        name: "fileIndex",
        components:{
            uploadPic,
            download
        },
        computed: {
            userRole() {
                if (this.userAuth.indexOf("Partnership") > -1) {
                    //Partnership(大律师)
                    return "Partnership";
                }
                if (this.userAuth.indexOf("Resp") > -1) {
                    //Resp(负责律师)
                    return "Resp";
                }
                if (this.userAuth.indexOf("Exec") > -1) {
                    //Exec(执行律师)
                    return "Exec";
                }
                if (this.userAuth.indexOf("Client") > -1) {
                    //Client(客户)
                    return "Client";
                }
            },
            isShowOperating(){
                let status = true;
                if(this.matterStatus == 3){ //事项已完成
                    status = false;
                }
                return status;
            },
        },
        data(){
            return{
                downloadParams: {},
                downloadPath: "", //下载文件的地址
                downloadName: "", //下载文件名称
                options:[{
                    value:'选项1',
                    label:'这是选项一'
                }],
                selectActive:false,
                confirmMark:true,
                selectOptions:[],
                selectValue:'',
                value:'',
                state5:'',
                getUploader:[],
                isConfirmed:'',
                radio:'1',
                show:false,
                isActive:true,
                getStart:false,
                getEnd:true,
                title:'',
                contentHeight:{
                    height:''
                },
                state4:'',
                tableData:[
                    {
                        fileName:'',
                        uploadUserName:'',
                        uploadTime:'',
                        id:'',
                        projectNo:'',
                        isMark:'',
                        status:'',
                        filePath:'',
                        isConfirmed:'',
                        remark:'',
                        checked:''
                    }
                ],
                pagenum:1,
                pagesize:20,
                total:0,
                pageTotal:1,
                current:1,
                projectNo:'1',
                pageurl:'',
                dialogVisible:false,
                annotion:'',
                getId:'',
                currentRow:null,
                getFileName:[],
                selectFile:'',
                getFileNames:'',
                uploadUserName:'',
                select:'',//顶部搜索下拉框
                selectId:'',
                getSelectName:[],
                getSelectId:'',
                uploadPath:'',
                getRemark:'',
                getAllSelect:'',
                getFirstSelect:'',
                getTime:[],
                timeMax:'',
                getTimeString:[],
                finaleTime:'',
                downloadPath:'',
                downloadName:'',
                getTableHeight:'',
                remarkStrip:'',
                userAuth:'',
                tableHeight:0,
                matterStatus: this.$route.query.status,
            }
        },
        created(){
            window.addEventListener('resize', this.getHeight);
            this.getHeight()
        },
        destroyed(){
            window.removeEventListener('resize', this.getHeight)
        },
        mounted(){
            this.getHeight();
            this.uploadPath =process.env.VUE_APP_UPLOAD;
            this.changePreveiew();
            this.firstSelect();
            this.getAuth();
            this.projectNo = this.$route.params.id;
            this.selectId = this.$route.query.projectNo;
        },
        watch:{
            '$route' (to,from){
                if(this.$route.query.all.projectNo){
                    this.selectId =  this.$route.query.all.projectNo;
                    this.firstSelect();
                }
            },
            
        },
        methods: {
            downloadDone() {
                //当有下载任务完成时会调用此方法，并将下载文件名称和下载文件地址设置为空，以便下次下载，当downloadPath改变并且不为空时，会下载文件
                this.downloadParams = {};
                this.downloadName = "";
                this.downloadPath = "";
            },
            getHeight() {
                  //this.tableHeight=window.innerHeight-320;
                this.contentHeight.height = window.innerHeight - 300 + 'px';
                this.tableHeight = window.innerHeight -389+'px';
            },
            //权限
            getAuth(){
                let vm = this;
                authApi(vm.$route.query.projectNo).then((res)=>{
                    if (res.code == 0){
                        vm.userAuth = res.result;
                    }
                })
            },
             //返回按钮
            goBack() {
                if(this.userAuth =='Resp' || this.userAuth=='Partnership'){
                    if(this.$route.query.from=='list'){
                         this.$router.push({path:'/myWork/ProcessFile/'+this.$route.query.projectNo,query:{status:this.$route.query.status}})
                    }else{
                        this.$router.push({path:'/myWork/details/'+this.$route.query.projectNo,query:{status:this.$route.query.status}})
                    }
                   
                }else{
                    if(this.$route.query.from=='list'){
                         this.$router.push({path:'/myWork/ProcessFile/'+this.$route.query.projectNo,query:{status:this.$route.query.status}})
                    }else{
                        this.$router.push({path:'/myWork/details/'+this.$route.query.projectNo,query:{status:this.$route.query.status}})
                    }
                    
                }
               
            },
            changePreveiew() {
                var ifm = document.getElementById("preview");
                ifm.height = document.documentElement.clientHeight - 200;
            },
            //列表选项下拉框
            firstSelect() {
                let vm = this;
                selectApi(vm.$route.query.projectNo).then((res) => {
                    if (res.code == 0) {
                        vm.selectOptions = res.result;
                       // alert(this.$route.params.id)
                        vm.selectOptions.forEach(v=>{
                            if(v.id == this.$route.params.id){
                                 vm.selectValue =v.id;
                                 vm.getSelectId = v.id;
                            }
                        })
                       
                        
                        vm.getData();
                        vm.getSearchData()
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            getData() {
                let vm = this;
                processDetails(vm.getSelectId, vm.pagenum, vm.pagesize, vm.state4, vm.state5).then((res) => {
                    if (res.code == 0) {
                        //console.log(res)
                        vm.tableData = res.result.records;
                        vm.total = res.result.total;
                        vm.current = res.result.current;
                        vm.pageTotal = Number(res.result.pages);
                        if (vm.total > 20){
                            if(vm.current == vm.pageTotal){
                                this.getEnd = true
                                this.getStart = true
                            }else{
                                if (vm.pageTotal > 1) {
                                    this.getEnd = false
                                   if (vm.current > 1){
                                       this.getStart = true
                                   }else{
                                       this.getStart = false
                                   }
                                }

                            }
                        }
                        // else if(vm.)
                        // if (vm.pageTotal == 1 || vm.pageTotal ==vm.pagenum){
                        //     vm.getEnd = true
                        // }else{
                        //     vm.getEnd = false
                        // }
                        // if (vm.pagenum ==1){
                        //     vm.getStart = true
                        // }else{
                        //     vm.getStart = false;
                        // }
                        // if (vm.total == "0"){
                        //     vm.getStart = true;
                        //     vm.getEnd = true;
                        // }
                    }
                })
            },
            getSearchData(){
                let vm = this;
                vm.getFileName = [];
                vm.getUploader = [];
                vm.getTime = [];
                vm.getTimeString = [];
                var time = '',
                    timechage = '',
                    getNameSet = [],
                    getTimeSelect = [],
                    getSetList = [];
                processDetails(vm.getSelectId, vm.pagenum, 1000, vm.state4, vm.state5).then((res) => {
                    if (res.code == 0) {
                        res.result.records.forEach((item,index) => {
                            item.checked = index;
                            getSetList.push(item.fileName);
                            getNameSet.push(item.uploadUserName);
                            // vm.getUploader.push({'value': item.uploadUserName});
                            timechage = item.uploadTime.split(/[- : \/]/);
                            var time1 = timechage.join()
                            time = Number(time1.replace(/,/g, ""))
                            getTimeSelect.push({
                                'time': time,
                                'createUser': item.createUser,
                                'createTime': item.createTime,
                                'reviewTime': item.reviewTime,
                                'reviewer': item.reviewer,
                                'uploadUserName': item.uploadUserName,
                                'uploadTime': item.uploadTime,
                                'status': item.status,
                                'fileName': item.fileName,
                                'filePath': item.filePath,
                                'id': item.id,
                                'projectNo': item.projectNo,
                                'remark':item.remark
                            })
                        });
                        var newArray =Array.from(new Set(getSetList));
                        var newArray1 =Array.from(new Set(getNameSet));
                        newArray.forEach(item=>{
                            vm.getFileName.push({'value':item})
                        });
                        newArray1.forEach(item=>{
                            vm.getUploader.push({'value':item})
                        });
                        getTimeSelect.forEach((item)=>{
                            if (item.status==='02'){
                                vm.getTime.push(item)
                            }
                        })
                        vm.timeMax = 0;
                        for (let i = 0; i < vm.getTime.length; i++) {
                            if (vm.getTime[i].time > vm.timeMax){
                                vm.timeMax = vm.getTime[i].time;
                                vm.getTimeString = vm.getTime[i]
                            }
                        }
                    }
                })
            },
            handleSearch() {
                // if (this.state4 == '' || this.state5 == '') {
                //     this.$message({
                //         type: 'warning',
                //         message: '请输入搜索关键词'
                //     })
                // } else {
                //     this.getData();
                // }
                this.getData();
            },
            //标记后加背景颜色
            rowClass({ row, rowIndex}) {
                 let vm = this;
                if (row.isMark ==='Y') {
                    if (rowIndex ===0){
                        return 'red'
                    }else{
                        return 'red'
                    }
                }else{
                    return ''
                }
            },
            selectChange(val){
                this.getSelectId = val;
                this.pagenum = 1;
                this.getData();
                this.getSearchData()
            },
            //列表选中行
            handleListClick(val) {
                this.pageurl =  process.env.VUE_APP_PREVIEWURL+'/preview/onlinePreview?url='+ encodeURIComponent(val.filePath);
                //this.pageurl = process.env.VUE_APP_PREVIEWURL+'/preview/onlinePreview?url=' + encodeURIComponent(val.filePath);
                this.getId = val.id;
                this.getAllSelect = val;
                this.getRadio(val.checked+1,val)
            },
            //单选
            handleCurrentChange(val) {
                this.currentRow = val;
            },
            setCurrent(row) {
                this.$refs.singleTable.setCurrentRow(row);
            },
            //选中单选按钮
            getRadio(index, row) {
                this.radio = this.tableData.indexOf(row);
                this.getAllSelect = row;
               
            },
            handleSelectionChange(val) {
                this.getAllSelect = val;
            },
            // tableRowClassName(row){
            //     if (row.id === this.remarkStrip){
            //         return 'warn'
            //     }else{
            //         return ''
            //     }
            // },
           
            //翻页
            handleEnd() {
                let vm = this;
                 if (vm.pagenum < vm.pageTotal){
                     vm.pagenum+=1;
                     vm.getData()

                 }
                 // vm.getEnd  = true;
                 // vm.getStart = true
            },
            handlePrive() {
                let vm = this;
                if (vm.pagenum > 1){
                    vm.pagenum-=1;
                    vm.getData();
                }else{
                    // vm.getSelectId = true
                    // vm.getEnd = true
                }


            },
            //搜索框
            querySearchAsync(queryString, cb) {
                var restaurants = this.getSelectName;
                var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 500 * Math.random());
            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleUpClear() {
                this.select = '';
                this.getData()
            },
            handleSelect(item) {
                let vm = this;
                // vm.select = item.value;
                vm.getSelectId = item.id;
                vm.getData();
            },
            //搜索框--文档名称
            querySearcFile(queryString, cb) {
                var restaurants = this.getFileName;
                var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 500 * Math.random());
            },
            handleSelectFile(item) {
                let vm = this;
                vm.state4 = item.value;
                vm.getData();
            },
            handleUpClearFile() {
                this.state4 = '';
                this.getData();
            },
            //搜索框--上传人
            querySearchUploader(queryString, cb) {
                var restaurants = this.getUploader;
                var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 500 * Math.random());
            },
            handleUpClearUploader(item) {
                let vm = this;
                this.state5 = '';
                vm.getData();
            },
            handleSelectUploader(item) {
                this.state5 = item.value;
                this.getData();
            },
            
            handleCollapse() {
                this.isActive = !this.isActive;
                this.show = !this.show
            },
            //弹出提示框 不合格
            handleAnnotion() {
                if (this.getId != '') {
                    this.annotion = '';
                    this.dialogVisible = true;
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请选择批注文件'
                    })
                }
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },
            //提交批注
            handleConfirm() {
                if (this.annotion != '') {
                    confirmApi(this.getId,'N', this.annotion).then((res) => {
                        if (res.code == 0) {
                            this.getSearchData();
                            this.getId = '';
                            this.dialogVisible = false;
                        }
                    })
                }
            },
            fillUpload1(path,name){
                let options={
                    category: '00',
                    fileName: name,
                    filePath: path,
                    projectNo: this.projectNo
                }
                this.upload(options)
            },
            upload(options){
                let vm = this;
                uploadApi(options.fileName,options.filePath,vm.getSelectId).then(res=>{
                    if(res.code==0){
                        this.getData()
                        this.$message({
                            type:'success',
                            message:'上传成功'
                        })
                    }
                })
            },
           
            //标记
            remark(val) {
                let vm = this;
                vm.remarkStrip = val.id;
                vm.selectActive = true
                vm.titleId = this.$route.params.id
                switch (val.isMark) {
                    case "N":
                        vm.getRemark = "Y";
                        remarkApi(val.id, "Y",  this.titleId).then((res => {
                            if (res.code == 0) {
                                vm.getAllSelect.isMark = 'Y';
                                vm.getData()
                            }
                        }))
                        break;
                    case "Y":
                        vm.gtRemark = "N";
                        remarkApi(val.id, "N",  this.titleId).then((res => {
                            if (res.code == 0) {
                                vm.getData();
                                vm.getAllSelect.isMark = 'Y';
                            }
                        }))
                        break;
                }

            },
             //标记按钮
            handleMark(val) {
                if(this.radio.length){
                   this.$alert("请选择要标记的项！", "提示", {
                        type: "warning",
                        confirmButtonText: "确定",
                        callback: () => {}
                     });
                    
                }else{
                    if(this.getAllSelect.isConfirmed == 'Y' || this.getAllSelect.isMark == 'Y'){
                        this.$alert("文档已确认，不能再次标记", "提示", {
                        type: "warning",
                        confirmButtonText: "确定",
                        callback: () => {}
                     });

                    }else{
                        this.remark(this.getAllSelect); 
                    }
                }
               
            },
            //确认
            handleRowComfirm(val) {
                let vm = this;
                vm.getSwitch(val)
            },
            getSwitch(val,obj){
                if(this.getAllSelect.isConfirmed == 'Y'){
                    this.$alert("文档已确认，不能再次确认", "提示", {
                        type: "warning",
                        confirmButtonText: "确定",
                        callback: () => {}
                     });
                    return false
                }
                
                let vm = this; 
                  confirmApi(val.id,'Y',vm.annotion).then((res)=>{
                        if (res.code == 0){
                            vm.getData();
                            vm.getSearchData()
                            this.getAllSelect.isConfirmed = 'Y'
                        }
                    })
            
            },
            //确认按钮
            handleCerfiy(){ 
                let vm = this;
                if (this.radio.length) {
                    vm.$alert("请勾选文档名称", '提示', {
						type: 'warning',
						confirmButtonText: '确定',
						callback: () => {}
					})
                }else{
                    vm.getSwitch(vm.getAllSelect) 
                   
                }   
            },
            
            //不合格文件标注
            handleUnqulify(){
                let vm = this;
                vm.title = "不合格批注"
                if (vm.getId == ''){
                    vm.$message({
                        type:'warning',
                        message:'请选择批注文件'
                    })
                } else{
                    confirmApi(vm.getId,vm.isConfirmed,vm.annotion).then((res)=>{
                        if (res.code == 0){
                            this.getData();
                        }
                    })
                }

            },
            //文件下载
            downloadFile(val){
                let filePath = val.filePath;
                this.downloadParams = {downloadFileName: val.fileName, filePath: filePath};
                this.downloadName = val.fileName;
                this.downloadPath = process.env.VUE_APP_DOWNLOADURL;
                // let vm = this;
                // vm.downloadPath = process.env.VUE_APP_PREVIEWURL+'/preview/onlinePreview?url='+ encodeURIComponent(val.filePath);
                // vm.downloadName = val.filePath;
                // if (val.filePath !=''){
                //     downloadApi(val.filePath,val.fileName,'Template')
                // }
            },

        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "@/assets/css/varibles.scss";
    @import "fileIndex.scss";
    .ss{
        float: left;
        width: 68px;
        height: 24px;
        text-align: center;
        margin-top: 11px;
        background: #fff;
        color: #5e6572;
        font-size: 14px;
        line-height: 24px;
        border-radius: 10px;
        cursor: pointer;
    }
    .empty{
        background: none!important;
    }
    .el-table .red{
        background: #FFC;
        //border:1px solid #EC395A
    }
    .left-table .select-item{
        background: red;
        width: 100%;
        height: 100%;
    }
    .uplaod-width{
        >span{
            color: #fff;
        }
        .upload{
            color: #fff;
        }
    }
    .reason {
        height: 100%;
        margin: -12px;
        box-sizing: border-box;
        >span {
            display: block;
            margin: 20px 30px;
        }
        >.time {
            color: #62656c;
            text-align: right;
            font-size: 12px;
            padding-right: 16px;
            margin-bottom: 20px;
            >span:first-of-type{
                margin-right: 20px;
            }
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
            padding: 16px;
        }
    }
</style>


