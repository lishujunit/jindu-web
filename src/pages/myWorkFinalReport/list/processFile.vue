<template>
    <div class="process-wrap">
        <div class="process-left clearfix" :class="{active:isActive}">
            <div class="left-title ">
                <p>题目名称</p>
                <el-autocomplete
                    class="search-input"
                     style="width: 180px;"
                     v-model="state4"
                     clearable
                    @clear="handleClear"
                     :fetch-suggestions="querySearchAsync"
                    @keyup.enter.native="handleSearch"
                     @select="handleSelect"
                ></el-autocomplete>
                <el-button @click="handleSearch" style="margin-left: 20px;" round size="mini">搜 索</el-button>
                <!--<p @click="handleSearch">搜索</p>-->
            </div>
            <div class="left-table" :class="{active:isActive}" :style="'max-height:'+maxHeight">
                <el-table :data="tableData" border max-height="tableHeight" @row-click="handleListClick" ref="singleTable" @current-change="handleCurrentChange" :row-class-name="tableRowClassName">
                    <el-table-column prop="index" label="序号" align="center" width="60">
                        <template slot-scope="scope">
                            {{scope.$index+(pagenum-1)*pagesize+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="titleName" label="题目" align="center">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="top"  v-if="!show" >
                                <p>{{ scope.row.remark!=""?scope.row.remark:'暂未批注' }}</p>
                                <div slot="reference" class="name-wrapper">
                                    {{ scope.row.titleName }}
                                </div>
                            </el-popover>
                            <span v-else> {{ scope.row.titleName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fileConfirmedName" label="文档名称" align="center">
                        <template slot-scope="scope">
                            <span class="fileName">{{scope.row.fileConfirmedName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="confirmedUser" v-if="show" label="确认人" align="center"></el-table-column>
                    <el-table-column prop="confirmedTime" v-if="show" label="确认时间" align="center"></el-table-column>
                    <el-table-column prop="remark" v-if="show" label="批注" align="center">
                        <template slot-scope="scope">
                            <span class="fileName">{{scope.row.remark}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <!--<page :total="total" :page="page" :expand="isActive" :page-total="pageTotal" :pageSize="pageSize" @pageChange="pageChange" @expandTable="expandTable"></page>-->
                <div class="process-footer">
                    <div>
                        <span>共{{total}}条</span>
                    </div>
                    <div>
                        <div :class="{active:isActive}">
                            <div class="preve-page" :class="{active:getStart}" @click="handlePrive"></div>
                            <!--<span>上一页</span>-->
                            <div class="page-center" :class="{active:isActive}">
                                <span>{{current}}</span>
                                <span>/</span>
                                <span>{{pageTotal}}</span>
                            </div>
                            <div class="next-page" :class="{active:getEnd}" @click="handleEnd"></div>
                        </div>
                        <!--<span>下一页</span>-->
                    </div>
                    <div>
                        <span @click="handleCollapse" v-if="show">收起 < </span>
                        <span @click="handleCollapse" v-if="!show">展开 > </span>
                    </div>
                </div>
            </div>
            <div class="collapse-btn" :class="{active:isActive}" @click="handleCollapse"></div>
        </div>
        <div class="process-right clearfix" :class="{active:isActive}" :style="'max-height:'+maxHeight">
            <div class="right-title">
                <p v-if="role" @click="handleSrcClose">x</p>
                <el-button  v-if="role&&getStatus" @click="handleMark" style="margin-left: 20px;" round size="mini">批 注</el-button>
                <!--<p @click="handleAnnotion">批注</p>-->
            </div>
            <div class="right-content" :class="{active:isActive}" :style="'height:'+contentHeight">
                <div >
                    <iframe id="preview" :src="pageurl" frameborder="0" width="100%" name="previewFile" scrolling="auto"></iframe>
                </div>
            </div>
        </div>
        <!-- 批注弹框 -->
        <common-dialog  :options="options"></common-dialog>
    </div>
</template>

<script>
    import commonDialog from '@/components/commonDialog/commonDialog'
    import { processFileList,processFileRemark,processSearch } from '@/api/processFile'
    import { commonAuthApi } from '@/api/commonAuthApi'
    import page from '@/components/customPage/page'
    export default {
        name: "processFile",
        components:{
            commonDialog,
            page
        },
        data(){
            return{
                options:{
                    dialogFormVisible:false,
                    handleClose:this.handleClose,
                    reasonInput:'',
                    moreShow:false,
                    title:'批注',
                    handleMoreCommit:this.handleMoreCommit,
                    handleCommit:this.handleCommit,
                },
                show:false,
                isActive:true,
                getStart:true,
                getEnd:true,
                contentHeight:'',
                state4:'',
                tableData:[
                    {
                        titleName:'',
                        fileConfirmedName:'',
                        confirmedUser:'',
                        confirmedTime:'',
                        remark:'',
                        id:''
                    }
                ],
                pagenum:1,
                pagesize:20,
                total:'',
                pageTotal:0,
                current:1,
                projectNo:'K0117050551',
                pageurl:'',
                dialogVisible:false,
                annotion:'',
                getId:'',
                currentRow:null,
                getFileName:[],
                selectFile:'',
                maxHeight:'',
                tableHeight:window.innerHeight - 500,
                userAuth:''
            }
        },

        created(){
            window.addEventListener('resize', this.getHeight);
            this.getHeight()
        },
        destroyed(){
            window.removeEventListener('resize', this.getHeight)
        },
        watch:{
           '$route':'getPath'
        },
        computed:{
            role(){
                if(this.userAuth.indexOf('Partnership') > -1 || this.userAuth.indexOf('Resp') > -1){
                    return true
                }else{
                    return false
                }
            },
            //权限
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
            getStatus() {
                if (this.$route.query.status == 2){
                    return false
                } else {
                    return true
                }
            }
        },
        mounted(){
          this.getHeight();
          this.getData();
          this.changePreveiew();
          this.getAuth()
        },
        methods:{
            getAuth(){
                commonAuthApi(this.$route.params.id).then((res)=>{
                    if (res.code == 0){
                        this.userAuth = res.result;
                    }
                })
            },
            getPath(){
                console.log(this.$route.path);
            },

            changePreveiew(){
                var ifm= document.getElementById("preview");
                ifm.height=document.documentElement.clientHeight-180;
            },
            getData(){
                let vm = this;
                let options = {
                    pagenum:this.pagenum,
                    pagesize:this.pagesize,
                    titleName:this.state4,
                    uploadUserName:'',
                    projectNo:this.$route.params.id,

                }
                processFileList(options).then((res)=>{
                    if (res.code == 0 ){
                        vm.tableData = res.result.records;
                        vm.total = res.result.total;
                        vm.current = res.result.current;
                        vm.pageTotal = res.result.pages;
                        if (vm.pageTotal == 1 || vm.pageTotal ==vm.pagenum){
                            vm.getEnd = true
                        }else{
                            vm.getEnd = false
                        }
                        if (vm.pagenum ==1){
                            vm.getStart = true
                        }else{
                            vm.getStart = false;
                        }
                        if (vm.pageTotal == "0"){
                            vm.getStart = true;
                            vm.getEnd = true;
                        }
                        // console.log(this.getFileName)
                    }else{
                        this.$message({
                            type:'warning',
                            message:res.msg
                        })
                    }
                }).catch(err=>{
                    console.log(err)
                })

            },
            handleSearch(){
                if (this.state4 == ''){
                    this.$message({
                        type:'warning',
                        message:'请输入搜索文档名称'
                    })
                }else{
                    this.getData();
                }
            },
            //列表选中行
            handleListClick(val){
                this.pageurl = process.env.VUE_APP_PREVIEWURL+'/preview/onlinePreview?url=' + encodeURIComponent(val.filePath);
                this.getId = val.id
            },
            tableRowClassName({row, rowIndex}) {
                if (row.remark != '') {
                    return 'warnResult'
                }else{
                    return ''
                }

            },
            handleCurrentChange(val){
                this.currentRow  = val;
            },
            setCurrent(row) {
                this.$refs.singleTable.setCurrentRow(row);
            },
            handleEnd(){
                let vm = this
                if (vm.pagenum < vm.pageTotal){
                    vm.pagenum+=1;
                    vm.getData()
                }
                // let vm = this;
                // if (vm.current <1){
                //     vm.getstart = false;
                //     if (this.pagenum < this.pageTotal) {
                //         this.pagenum++;
                //         this.getData();
                //     }
                // } else{
                //     vm.getstart = true;
                // }
            },
            handlePrive(){
                let vm = this;
                if (vm.pagenum > 0){
                    // vm.pagenum-=1;   因点击后页面出现-负数
                    vm.pagenum=1;
                    vm.getData();
                }
            },
            //搜索框
            querySearchAsync(queryString, cb) {
                let getFileName = []
                let options = {
                    fileName:queryString,
                    projectNo:this.$route.params.id
                }
                processSearch(options).then((res)=>{
                    if (res.code == 0){
                        res.result.forEach(item=>{
                            getFileName.push({value:item})
                        })
                    }
                    var results =  getFileName;
                    cb(results);
                })
            },
            handleClear(){
              this.state4 = ''
              this.getData()
            },
            handleSelect(item) {
                this.state4 = item.value
                this.getData();
            },
            getHeight(){
                this.contentHeight=window.innerHeight-200+'px';
                this.maxHeight=window.innerHeight-200+'px';
            },
            handleCollapse(){
                this.isActive = !this.isActive;
                this.show = !this.show
            },
            //弹出提示框
            handleAnnotion(){
                if (this.getId !=''){
                    this.dialogVisible = true;

                } else{
                    this.$message({
                        type:'warning',
                        message:'请选择批注文件'
                    })
                }

            },
            handleMark(){
                if (this.getId != ''){
                    this.options.dialogFormVisible = true
                }else{
                    this.$message({
                        type:'warning',
                        message:'请选择批注文件'
                    })
                }
            },
            handleSrcClose(){
              this.pageurl = ''
            },
            handleClose(done) {
                this.$confirm('确认关闭？','提示')
                    .then(_ => {
                        this.options.dialogFormVisible = false
                        this.options.reasonInput = ''
                        this.getId = ''
                        done();
                    })
                    .catch(_ => {});
            },
            //提交--多选
            handleMoreCommit(){
            },
            handleCommit(){
                if (this.options.reasonInput == ''){
                    this.$message({
                        type:'warning',
                        message:'输入不能为空！'
                    })
                } else{
                    let options = {
                        remark:this.options.reasonInput,
                        id:this.getId,
                    }
                    processFileRemark(options).then((res)=>{
                        if (res.code == 0){
                            this.getData()
                            this.$message({
                                type:'success',
                                message:res.msg
                            })
                            this.options.dialogFormVisible = false
                            this.options.reasonInput = ''
                            this.getId = ''
                        }
                    })
                }
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
   .process-wrap{
       margin: 0 auto;
       height: 48px;
       background: #ecf1f4;
       border: 1px solid #d0dee3;
       color: #666666;
       box-sizing: border-box;
       line-height: 48px;
       .process-left{
           float: left;
           box-sizing: border-box;
           width: 55%;
           position: relative;
           border: 1px solid #d0dee3;
           &.active{
               width: 386px;
           }
           .left-title{
               /*display: flex;*/
               background: #cfdbe3;
               padding-left: 19px;
               .search-input{
                   width: 80px;
                   /*float: left;*/
                   margin-left: 20px;
               }
               >p{
                   float: left;
               }
               .el-input{
                   width: 80px;
                   height: 24px;
                   padding-left: 20px;
               }
               >p:nth-of-type(2){
                   float: right;
                   background: #fff;
                   width: 68px;
                   height: 24px;
                   text-align: center;
                   margin-top: 11px;
                   color: #5e6572;
                   font-size: 14px;
                   line-height: 24px;
                   border-radius: 10px;
                   cursor: pointer;
                   margin-right: 10px;
               }

           }
           .left-table{
               width: 100%;
               background: #fff;
               float: left;
               min-height: 450px;
               overflow: auto;
               border: 1px solid #d0dee3;
               box-sizing: border-box;
               padding: 20px;
               border-top: none;
               /*height: 206px;*/
               &.active{
                   width: 386px;
               }
               .fileName{
                   color: $global-color;
               }
               table{
                   margin: 20px 20px 10px 19px;
                   &.active{
                       width: 346px;
                   }
                   tr,td,th{
                       width: 130px;
                       height: 30px;
                       line-height: 24px;
                       box-sizing: border-box;
                       border: 1px solid #d0dee3;
                       padding: 2px 10px;
                   }
                   .file-descripe{
                       color: $global-color;
                   }
               }
           }
           .process-footer{
               display: flex;
               margin: 0 20px;
               >div:first-of-type{
                   min-width: 50px;
               }
               >div:nth-of-type(2){
                   flex: 1;
                   text-align: center;
                   flex-direction: column;
                   position: relative;
                   >div{
                       text-align: center;
                       display: flex;
                       &.active{
                           .preve-page{
                               left: 40%;
                           }
                           .next-page{
                               left: 80%;
                           }
                       }
                   }
                   .page-center{
                       flex: 1;
                       padding-left: 64%;
                       &.active{
                           padding-left: 30%;
                       }
                   }
                   .preve-page{
                       width:0;
                       height:0;
                       float: left;
                       position: absolute;
                       left: 70%;
                       top: 18px;
                       border-top:8px solid transparent;
                       border-bottom:8px solid transparent;
                       border-right:10px solid #5e6572;
                       &.active{
                           border-right:10px solid #b9b9b9;
                       }
                   }
                   .next-page{
                       width:0;
                       height:0;
                       float: right;
                       position: absolute;
                       left: 90%;
                       top: 18px;
                       border-top:8px solid transparent;
                       border-bottom:8px solid transparent;
                       border-left:10px solid #5e6572;
                       &.active{
                           border-left:10px solid #b9b9b9;
                       }
                   }
               }
               >div:last-of-type{
                   min-width: 50px;
                   text-align: right;
                   color: $global-color;
                   text-decoration: underline;
                   flex: 1;
                   cursor: pointer;
                   /*&.active{*/
                   margin-right: 30px;
                   /*}*/
               }
           }
           .collapse-btn{
               position: absolute;
               cursor: pointer;
               width:0;
               right: 2px;
               top: 40%;
               height:0;
               border-top:8px solid transparent;
               border-bottom:8px solid transparent;
               border-right:10px solid #5e6572;
               &.active{
                   border-right:none;
                   border-left:10px solid #5e6572;

               }
           }
       }
       .process-right{
           float: right;
           width: 45%;
           margin-top: 1px;
           /*border: 1px solid #d0dee3;*/
           z-index: 3;
           &.active{
               width: calc(100% - 386px);
           }
           .right-title{
               float: left;
               background: #cfdbe3;
               width: 100%;
               margin-top: -1px;
               border-left: 1px solid #bac5ca87;
               >p{
                   margin-left: 20px;
                   color: #868889;
                   font-size: 20px;
                   cursor: pointer;
                   float: left;
               }
           }
           .right-content{
               float: right;
               width: 100%;
               background: #fff;
               box-sizing: border-box;
               border: 1px solid #d0dee3;
               text-align: center;
               overflow:hidden;
               min-height: 456px;
               padding: 20px;
               margin-bottom: 20px;
               >div{
                   height: 100%;
                   >iframe{
                       height: 100% !important;
                   }
                   /*margin-bottom: 20px;*/
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
            /*border-bottom-color: #EC395A;*/
            /*border-top: 1px solid #EC395A;*/

            &:first-child {
                /*border-left: 1px solid #EC395A;*/
            }

            &:last-child {
                /*border-right: 1px solid #EC395A;*/
            }
        }
    }
</style>
