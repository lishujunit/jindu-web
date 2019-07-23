<template>
    <div class="preve-wrap">
        <title-bar @goBack="goBack"></title-bar>
        <div class="preve-table">
            <div class="preve-left clearfix">
                <div class="left-title" :class="{active:isActive}">
                    <div>
                        <p>文档名称</p>
                        <el-autocomplete
                            class="search-input"
                            clearable
                            v-model="state4"
                            @clear="handleClear"
                            :fetch-suggestions="querySearchAsync"
                            @select="handleSelect"
                        ></el-autocomplete>
                    </div>
                    <div v-show="show">
                        <p>上传人</p>
                        <el-autocomplete
                            class="search-input"
                             v-model="state5"
                             clearable
                            @clear="handleUpClear"
                             :fetch-suggestions="queryUploader"
                             @select="handleUploader"
                        ></el-autocomplete>
                    </div>
                    <div @click="handleSearch">
                        <p>搜索</p>
                    </div>
                </div>

            </div>

            <div class="preve-right clearfix" :class="{active:isActive}">
                <div class="right-title" v-if="isShowOperating">
                    <!--<p>X</p> doc,docx,xls,xlsx,pdf-->
                    <upload-pic accept=".doc, .docx, .xls,.xlsx,.pdf,.png,.bmp,.gif,.jpeg,.jpg,.m4a" @uploadSuccess="fillUpload1">
                        <div class="upload" :class="{active:uploadActive}">
                            <!--<i class="el-icon-plus"></i>-->
                            <span>上传</span>
                        </div>
                    </upload-pic>
                    <!--<el-upload-->
                        <!--class="uplod-btn"-->
                        <!--:action="uploadPath"-->
                        <!--:on-success="uploadSuccess"-->
                        <!--:show-file-list="false"-->
                        <!--:on-error="uploadError"-->
                    <!--&gt;-->
                        <!--<el-button slot="trigger" ref="uploadItem" size="small" type="primary">上传</el-button>-->
                    <!--</el-upload>-->
                </div>
            </div>
        </div>
        <div class="preve-second clearfix">
            <div class="preve-content" :class="{active:isActive}">
                <div class="left-table"  :class="{active:isActive}">
                    <el-table :data="tableData"
                    ref="tableData" border
                    @row-click="handleListClick"
                    highlight-current-row
                    @current-change="handleCurrentChange">
                        <el-table-column prop="projectNo" label="序号" height="50" width="50" type="index" align="center">
                            <template slot-scope="scope">
                                {{scope.$index+(pagenum-1)*pageInfo.pageNumber+1}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="fileName" label="文档名称" align="center" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span class="fileName" style="cursor: pointer;">{{scope.row.fileName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="show" prop="createUserName" label="上传人" align="center"  width="100"></el-table-column>
                        <el-table-column v-if="show" prop="createTime" label="上传时间" align="center" width="140"></el-table-column>
                    </el-table>
                    <div class="footer">
                        <div>
                            <span>共{{pageInfo.total}}条</span>
                        </div>
                        <div>
                            <div :class="{active:getStart}" class="preve-page" @click="backHandle"></div>
                            <span>{{pageInfo.current}}</span>
                            <span>/</span>
                            <span>{{pageInfo.pageTotal==0?1:pageInfo.pageTotal}}</span>
                            <div :class="{active:getEnd}" class="next-page" @click="nextHandle"></div>
                        </div>
                        <div :class="{active:isActive}">
                            <span @click="handleCollapse" v-if="isActive">展开 > </span>
                            <span @click="handleCollapse" v-else>收起 < </span>
                        </div>
                    </div>
                </div>
                <div class="preve-collapse" :class="{active:isActive}" @click="handleCollapse">
                </div>
            </div>
            <div class="right-conten" :class="{active:isActive}" :style="contentHeight">
               <div>
                   <iframe id="preview" :src="pageurl" frameborder="0" width="100%" name="previewFile" scrolling="auto"></iframe>
               </div>
            </div>
        </div>
    </div>
</template>

<script>
    import uploadPic from '@/components/upload'
    import { processList,uoloadFile,authApi } from '@/api/preveFile'
    export default {
        name: "preveFile",
        components:{
            uploadPic
        },
        data(){
            return {
                isActive:true,
                getStart:true,//分页上一页按钮
                getEnd:false,//分页下一页按钮
                getFileName:[],//文档名称
                uploader:[],//上传人
                show:false,
                uploadActive:false,
                projectId:'',//项目ID
                contentHeight:{
                    height:'',
                },
                tableHeight:{
                    height:'',
                },
                pageInfo:{
                    total:0,
                    pages:0,
                    current:0,
                    pageNumber:20,
                    pageTotal:0,
                },
                tableData:[
                    {
                        category:'',
                        createTime:'',
                        createUserName:'',
                        fileName:'',
                        filePath:'',
                        id:'',
                        projectNo:'',
                    }
                ],
                restaurants: [],
                state4: '',
                state5: '',
                selectName:'',
                selectFile:'',
                timeout:  null,
                getSrc:'',
                loading:false,
                pagenum:1,
                action:'',
                uploadPath:'',
                pageurl:'',
                getProjectNo:'',
                category:'',
                authName:'',
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
        computed:{
            isShowOperating(){
                let status = true;
                if(this.matterStatus == 3){ //事项已完成
                    status = false;
                }
                return status;
			},
        },
        mounted(){
            this.getHeight();
            this.getData();
            this.getSearchData();
            //文件上传地址
            this.uploadPath =process.env.VUE_APP_UPLOAD;
            // this.projectNo = this.$router.params.id;
            this.projectNo = 1;
            this.changePreveiew();
            this.getProjectNo = this.$route.params.id;
            this.category = this.$route.query.category;
        },
        methods:{
            changePreveiew(){
                var ifm= document.getElementById("preview");
                ifm.height=document.documentElement.clientHeight;
            },
            getData(){
                let vm = this;
                processList(this.$route.query.category,this.pagenum,this.pageInfo.pageNumber,this.$route.params.id,this.selectFile,this.selectName).then(res=>{
                    if (res.code === 0){
                       vm.tableData = res.result.records;
                       vm.pageInfo.total = res.result.total;
                       vm.pageInfo.current = res.result.current;
                       vm.pageInfo.pageTotal = res.result.pages;
                        if (vm.pageInfo.pageTotal == 1 || vm.pageInfo.pageTotal ==vm.pagenum){
                            vm.getEnd = true
                        }else{
                            vm.getEnd = false
                        }
                        if (vm.pagenum ==1){
                            vm.getStart = true
                        }else{
                            vm.getStart = false;
                        }
                        if (vm.pageInfo.total == "0"){
                            vm.getStart = true;
                            vm.getEnd = true;
                        }
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            getSearchData(){
                let vm = this;
                var newUploader = [];
                var getFilename1 = [];
                processList(this.$route.query.category,this.pagenum,'',this.$route.params.id,this.selectFile,this.selectName).then(res=>{
                     //console.log(category)
                    if (res.code === 0){
                       for (let i = 0;i<res.result.records.length;i++){
                           getFilename1.push(res.result.records[i].fileName)
                           newUploader.push(res.result.records[i].createUserName)
                       }
                        var newArray = Array.from(new Set(getFilename1))
                        var newArrayUp = Array.from(new Set(newUploader))
                        vm.getFileName = [];
                        vm.uploader = [];
                        for(let j = 0; j<newArray.length;j++){
                            vm.getFileName.push({'value':newArray[j]});
                        }
                        for (let i = 0;i<newArrayUp.length;i++){
                            vm.uploader.push({'value':newArrayUp[i]});
                        }
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            handleListClick(val){
                this.pageurl = process.env.VUE_APP_PREVIEWURL+'/preview/onlinePreview?url=' + encodeURIComponent(val.filePath);
                // console.log(this.pageurl)
            },
            handleCurrentChange(val){
                this.currentRow = val;
            },
            setCurrent(row) {
                this.$refs.tableData.setCurrentRow(row);
            },
            getHeight(){
                // this.contentHeight.height=window.innerHeight-180+'px';
                // this.tableHeight.height=window.innerHeight-220+'px';
                 this.contentHeight.height = window.innerHeight - 300 + 'px';
                this.tableHeight = window.innerHeight -389+'px';
            },
            goBack() {
                this.$router.push({path:'/myWork/details/'+this.$route.params.id})
                // this.$router.back(-1)
            },
            /*---------------   文档名称搜索框    -------------------*/
            querySearchAsync(queryString, cb) {
                var restaurants =this.getFileName;
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
            handleSelect(item) {
                let vm = this;
                vm.selectFile = item.value;
                vm.state4 = item.value;
                vm.pagenum = 1;
                vm.getData();
            },
            handleClear(){
                this.selectFile = "";
                this.pagenum = 1;
                this.getData();
            },
            /*---------------   文档上传人搜索框    -------------------*/
            queryUploader(queryString, cb) {
                var restaurants = this.uploader;
                var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 500 * Math.random());
            },

            handleUploader(item) {
                let vm = this;
                vm.selectName = item.value;
                vm.state5 = item.value;
                vm.pagenum = 1;
                vm.getData();
            },
            handleUpClear(){
              this.selectName = "";
              this.pagenum = 1;
              this.getData();

            },
            fillUpload1(path,name){
                let options={
                    category: this.$route.query.category,
                    fileName: name,
                    filePath: path,
                    projectNo: this.$route.params.id
                }
                this.uploadActive = true;
                this.upload(options)
            },
            upload(options){
                uoloadFile(options.category,options.fileName,options.filePath,options.projectNo).then(res=>{
                    if(res.code==0){
                        this.$message({
                            type:'success',
                            message:'上传成功！'
                        })
                        this.getData()
                    }
                })
            },
            //搜索按钮
            handleSearch(){
                let vm = this;
                if (this.state4=='' && this.state5==''){
                    vm.getData();
                }else{
                    vm.pagenum = 1;
                    vm.selectName = vm.state5;
                    vm.selectFile = vm.state4;
                    vm.getData();

                }


            },
            //分页-上一页
            backHandle(){
                let vm = this;
                if (vm.pagenum > 0){
                    // vm.pagenum-=1;   因点击后页面出现-负数
                     vm.pagenum=1;
                    vm.getData();
                }
            },
            //分页-下一页
            nextHandle(){
                let vm = this;
                if (vm.pagenum < vm.pageInfo.pageTotal){
                    vm.pagenum+=1;
                    vm.getData()
                }
            },
            //列表展开与缩放按钮
            handleCollapse(){
                this.isActive = !this.isActive
                this.show = !this.show
            },
            //上传成功
            uploadSuccess(res,file,fileList){
                if (res.code == 0){
                    this.$alert(file.name+'上传成功', '提示', {
                        confirmButtonText: '确定',
                        type: 'success',
                    });
                    uoloadFile({
                        filePath: res.data,
                        fileName: file.name,
                        projectNo: this.getProjectNo,
                        category: this.$route.query.category
                    }).then((res)=>{
                        console.log(res)
                        if (res.code == 0) {
                            this.getData();
                        }else{
                            this.$message({
                                type:'warning',
                                message:res.msg
                            })
                        }
                    }).catch(err=>{
                        console.log(err)
                    })

                } else{
                    this.$alert(res.msg, '提示', {
                        confirmButtonText: '确定',
                        type: 'error',
                    });
                }
            },
            //上传失败
            uploadError(err, file, fileList) {
                this.$alert('上传失败', '提示', {
                    confirmButtonText: '确定',
                    type: 'error',
                    // callback: action => {}
                });
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    .preve-wrap{
        width: 100%;
       .preve-table{
           width: 100%;
           margin-top: 20px;
           height: 48px;
           line-height: 44px;
           background: #ecf1f4;
           box-sizing: border-box;
           border: 1px solid #d0dee3;
           .preve-left{
               float: left;
             .left-title{
                  float: left;
                  /*display: flex;*/
                //   width: 570px;
                  border-right: 1px solid #d0dee3;
                  box-sizing: border-box;
                  &.active{
                    //  width: 376px;
                       width: 435px;
                  }
                  >div{
                      float: left;
                      flex-direction: column;
                      /*flex: 1;*/
                      .search-input{
                        //   width: 120px;
                          float: left;
                      }
                      >p{
                          float: left;
                          font-size: 14px;
                          color: #666666;
                          padding: 0 20px;
                      }
                  }
                  >div:last-of-type{
                      cursor: pointer;
                      >p{
                          width: 29px;
                          height: 24px;
                          background: #fff;
                          line-height: 24px;
                          text-align: center;
                          border-radius: 20px;
                          margin-top: 14px;
                          float: right;
                          margin-left: 60px;
                      }
                  }
              }
            }
           .preve-right{
               float: right;
            //    width: calc(100% - 570px );
              width: calc(100% - 707px );
               &.active{
                   width: calc(100% - 439px );
               }
               .upload{
                   color: #fff;
                   &.active{
                       color: #fff;
                   }
               }
               .right-title{
                   width: 100px;
                   background: $global-color;
                   color: #fff;
                   line-height: 30px;
                   height: 30px;
                   margin: 10px;
                   font-size: 16px;
                   text-align: center;
                   padding-bottom: 10px;
                   box-sizing: border-box;
                   border-radius: 20px;
                   float: right;
                   cursor: pointer;
                   >p{
                       float: left;
                       padding: 0 20px;
                   }
                    .uplod-btn{
                        float: right;
                        margin-right: 10px;
                        ul{
                            display: none;
                        }
                    }
               }
           }
       }
       .preve-second{
           .preve-content{
               margin-top: -2px;
               float: left;
            //    width: 570px;
                 width: 707px;
               box-sizing: border-box;
               border: 1px solid #d0dee3;
               background: #fff;
               padding: 20px;
               position: relative;
               &.active{
                //    width: 376px;
                  width: 436px;
               }
               .left-table{
                //    width: 520px;
                  width: 674px;
                   overflow: auto;
                   float: left;
                   &.active{
                    //    width: 326px;
                     width: 400px;
                   }
                   .fileName{
                       color: $global-color;
                   }
                   .footer{
                       width: 100%;
                       float: left;
                       display: flex;
                       margin-top: 20px;
                       font-size: 14px;
                       >div:nth-of-type(2){
                           flex: 1;
                           text-align: center;
                           flex-direction: column;
                           position: relative;
                           .preve-page{
                               width:0;
                               height:0;
                               float: left;
                               position: absolute;
                               left: 38%;
                               border-top:8px solid transparent;
                               border-bottom:8px solid transparent;
                               border-right:10px solid #5e6572;
                               cursor: pointer;
                               &.active{
                                   border-right:10px solid #b9b9b9;
                               }
                           }
                           .next-page{
                               width:0;
                               height:0;
                               float: right;
                               position: absolute;
                               left: 58%;
                               border-top:8px solid transparent;
                               border-bottom:8px solid transparent;
                               border-left:10px solid #5e6572;
                               margin-top: -14px;
                               cursor: pointer;
                               &.active{
                                   border-left:10px solid #b9b9b9;
                               }
                           }
                       }
                       >div:last-of-type{
                           text-align: right;
                           color: $global-color;
                           text-decoration: underline;
                           cursor: pointer;
                           margin-right: 30px;

                       }

                   }

               }
               .preve-collapse{
                   position: absolute;
                   top: 50%;
                   right: 2px;
                   float: right;
                   cursor: pointer;
                   width:0;
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
           .right-conten{
               float: right;
            //    width: calc(100% - 570px);
                width: calc(100% - 707px);
               background: #fff;
               box-sizing: border-box;
               border: 1px solid #d0dee3;
               border-top: none;
               margin-top: -1px;
               text-align: center;
               overflow:hidden;
               &.active{
                //    width: calc(100% - 376px);;
                   width: calc(100% - 436px);;
               }
               >div{
                   margin-bottom: 20px;
               }
           }
       }
    }

</style>
