<template>
    <div class="complianceCertification">
        <div class="search">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="form" inline>
                <el-form-item label="主体名称">
                    <el-autocomplete
                            class="search-input"
                            clearable
                            v-model="ruleForm.state4"
                            style="width: 320px;"
                            @clear="handleClear"
                            :fetch-suggestions="querySearchAsync"
                            @select="handleSelect"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="底稿属性">
                    <el-autocomplete
                            class="search-input"
                            clearable
                            v-model="ruleForm.state5"
                            style="width: 320px;"
                            @clear="handleClear2"
                            :fetch-suggestions="querySearchAsync2"
                            @select="handleSelect2"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="底稿状态">
                    <el-select v-model="ruleForm.Types" placeholder="请选择" class="state" @change="handleTypes">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(item,index) in optionss" :key="item.value" :label="item" :value="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="计划属性">
                    <el-autocomplete
                            class="search-input"
                            clearable
                            v-model="ruleForm.state6"
                            style="width: 320px;"
                            @clear="handleClear3"
                            :fetch-suggestions="querySearchAsync3"
                            @select="handleSelect3"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="计划状态">
                    <el-select v-model="ruleForm.Types2" placeholder="请选择" class="state" @change="handleTypes2">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(item,index) in optionss" :key="item.value" :label="item" :value="index"></el-option>
                    </el-select>
                </el-form-item>
                <div class="rightBox">
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button type="danger" @click="resetForm('ruleForm')">重置</el-button>
                </div>
            </el-form>
        </div>
        <el-row>
            <div class="corre-table">
                <el-table
                        ref="multipleTable"
                        border
                        :data="tableData3"
                        tooltip-effect="dark"
                        style="width: 100%"
                        :max-height="getHeight"
                        @selection-change="handleSelectionChange"
                        :v-loading="loading"
                >
                    <el-table-column align="center" type="index" label="序号" width="80">
                        <template slot-scope="scope">
                            {{scope.$index+(page-1)*pageSize+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="主体名称" align="center"></el-table-column>
                    <el-table-column prop="name" label="扫描件" align="center" width="100">
                        <template slot-scope="scope"><span class="handle-view" @click="handleView(scope.row)">查看</span></template>
                    </el-table-column>
                    <el-table-column prop="name" label="底稿属性" align="center">
                        <template slot-scope="scope">
                          <div v-if="getStatus">
                              <el-select
                                      v-model="scope.row.manuscriptAttribute"
                                      multiple
                                      filterable
                                      allow-create
                                      default-first-option
                                      placeholder="请选择底稿属性"
                                      @change="handleBlur(scope.row)"
                              >
                                  <el-option
                                          v-for="item in options1"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                  </el-option>
                              </el-select>
                          </div>
                            <div v-else>
                                {{scope.row.manuscriptAttribute}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" align="center" width="200">
                        <template slot-scope="scope">
                            <span v-if="scope.row.manuscriptStatus==0">未关联</span>
                            <span  v-if="scope.row.manuscriptStatus===1">已关联</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="计划属性" align="center">
                        <template slot-scope="scope">
                           <div v-if="getStatus">
                               <el-select
                                       v-model="scope.row.planAttribute"
                                       multiple
                                       filterable
                                       allow-create
                                       default-first-option
                                       placeholder="请选择底稿属性"
                                       @change="handleBlur2(scope.row)"
                               >
                                   <el-option
                                           v-for="item in options2"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.value">
                                   </el-option>
                               </el-select>
                           </div>
                            <div v-else>
                                {{scope.row.planAttribute.toString()}}
                            </div>
                            <!--<span v-if="!scope.row.visible">{{scope.row.visible}}</span>-->
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" align="center" width="200">
                        <template slot-scope="scope">
                            <span v-if="scope.row.planStatus==0">未关联</span>
                            <span  v-if="scope.row.planStatus==1">已关联</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange"  :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
            </div>
        </el-row>
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
                        <!--<p v-if="showCancel===4 || showCancel === 1 ||getStatus"  class="recal" @click="handleDelete(item,index)"><i class="el-icon-remove"></i></p>-->
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { previewFile } from '@/utils/api'
    import { validationFormat,validationPlanFormat } from '@/utils/validate'
    import { fiveListApi,fiveSearchOneApi,fiveSearchTwoApi,fiveSaveOneApi,fiveSaveTwoApi,viewApi,searchApi } from "@/api/workUnitInqury";
    export default {
        name: "confirmPlan",
        filters: {
            cutTime: function (value) {
                if (!value) return '';
                value = value.toString();
                let str = value.split(" ");
                let str1 = str[0].split("-")
                return str1.join('.')
            },
        },
        data() {
            return {
                ruleForm:{
                    state5:'',
                    Types:'',
                    Types2:'',
                    state4:'',
                    state6:''
                },
                loading:true,
                getHeight:window.innerHeight - 400,
                options: [
                    {value:'',label:'全部'},
                    {value:'0',label:'未关联'},
                    {value:'1',label:'已关联'},
                ],
                optionsPlan:[
                    {value:'',label:'全部'},
                    {value:'0',label:'未关联'},
                    {value:'1',label:'已关联'},
                ],
                optionss: ["未关联","已关联"],
                tableData3: [],
                multipleSelection: [],
                status:'',
                status2:'',
                pageTotal:0,
                total:0,
                page:1,
                pageSize:20,
                options1:[],
                options2:[],
                type:'',
                state4:'',
                manuscriptAttribute:'',
                name:'',
                dialogTableVisible:false,
                recalList:[],
                secondList:0,
                showCancel:0,
                getFileName:[],
                getmanuList:[]
            };
        },
        mounted(){
            this.getData()
            this.remoteMethod()
            this.remoteMethod2()
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
        methods: {
            //获取列表数据
            getData(){
                let vm = this;
                let options = {
                    name:vm.ruleForm.state4,
                    pagenum:vm.page,
                    pagesize:vm.pageSize,
                    workUnitId:vm.$route.params.id,
                    manuscriptStatus:vm.ruleForm.Types,
                    planStatus:vm.ruleForm.Types2,
                    manuscriptAttribute:vm.ruleForm.state5,
                    planAttribute:vm.ruleForm.state6,
                }
                vm.loading = false
                fiveListApi(options).then((res)=>{
                    if (res.code == 0){
                        this.loading = false
                        vm.total=Number(res.result.total)
                        vm.pageTotal = Number(res.result.current)
                        vm.tableData3 = res.result.records
                        vm.tableData3.forEach(item=>{
                            if (item.manuscriptAttribute !=''){
                                item.manuscriptAttribute = item.manuscriptAttribute.split(',')
                            }else{
                                item.manuscriptAttribute = []
                            }
                            if (item.planAttribute != ''){
                                item.planAttribute = item.planAttribute.split(',')
                            }else{
                                item.planAttribute = []
                            }
                        })
                    }
                })
            },
            //重置
            resetForm(){
                this.ruleForm.state5 = ''
                this.ruleForm.Types = ''
                this.ruleForm.state4 = ''
                this.ruleForm.Types2 = ''
                this.ruleForm.state5 = ''
                this.ruleForm.state6 = ''
                this.getData()
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
            },
            //查看
            handleView(val){
                // this.viewId = val.id
                this.dialogTableVisible = true
                viewApi(val.id).then((res)=>{
                    if (res.code == 0){
                        this.recalList = res.result
                        this.secondList = res.result.length
                    }
                })

            },
            handleFileView(val){
                var title = val.fileName.split('.')
                previewFile(val.filePath,title[0])
            },
            showVisible(){
                this.dialogTableVisible = false
            },
            //列表显示
            handleSizeChange(val){
                this.pageSize = val
                this.getData()
            },
            //列表分页跳转
            pageChange(val){
                this.page = val
                this.getData()
            },
            remoteMethod(query){
                let options = {
                    manuscriptAttribute:query,
                    workunitId:this.$route.params.id,
                    planAttribute:''
                }
                fiveSearchOneApi(options).then((res)=>{
                    if (res.code == 0){
                        res.result.forEach(item=>{
                            this.options1.push({value:item,label:item})
                        })
                    }
                })
            },
            handleBlur({id,manuscriptAttribute:attribute = []}){
                let status = attribute.length
                    ? validationFormat(attribute[attribute.length - 1])
                    : true;
                if (status){
                    if(this.getStatus){
                        this.loading = true
                        let options = {
                            manuscriptAttribute:attribute.join(','),
                            busId:id,
                            planAttribute:''
                        }
                        fiveSaveOneApi(options).then((res)=>{
                            if (res.code == 0){
                                this.loading = false
                                this.getData()
                            }
                        })
                    }
                } else{
                    attribute.pop()
                    this.$alert(
                        "请按照x.x，x.x-x，x.x-x-x的格式填写该属性(x为数字)",
                        "提示",
                        { confirmButtonText: "确定", type: "warning" }
                    );
                }
            },
            // handleBlur(val){
            //     if (this.getStatus){
            //         this.loading = true
            //         let options = {
            //             manuscriptAttribute:val.manuscriptAttribute.toString(),
            //             busId:val.id,
            //             planAttribute:''
            //         }
            //         fiveSaveOneApi(options).then((res)=>{
            //             if (res.code == 0){
            //                 this.loading = false
            //                 this.getData()
            //
            //             }
            //         })
            //     }
            // },
            remoteMethod2(query){
                let vm = this;
                let options = {
                    manuscriptAttribute:'',
                    workunitId:vm.$route.params.id,
                    planAttribute:query
                }
                fiveSearchTwoApi(options).then((res)=>{
                    if (res.code == 0){
                        res.result.forEach(item=>{
                            this.options2.push({value:item,label:item})
                        })
                        // this.popSuccess('success',res.msg)
                    }
                })
            },
            handleBlur2({id,planAttribute:attribute = []}){
                let status = attribute.length
                    ? validationPlanFormat(attribute[attribute.length - 1])
                    : true;
                if (status){
                    if(this.getStatus){
                        this.loading = true
                        let options = {
                            planAttribute:attribute.join(','),
                            busId:id,
                            manuscriptAttribute:''
                        }
                        fiveSaveTwoApi(options).then((res)=>{
                            if (res.code == 0){
                                this.loading = false
                                this.getData()
                            }
                        })
                    }
                } else{
                    attribute.pop()
                    this.$alert(
                        "请按照 x-x-x，x-x-x-x，x-x-x-x-x 的格式填写该属性(x为数字)",
                        "提示",
                        { confirmButtonText: "确定", type: "warning" }
                    );
                }
               // if (this.getStatus) {
               //     this.loading = true
               //     let options = {
               //         planAttribute:val.planAttribute.toString(),
               //         busId:val.id,
               //         manuscriptAttribute:''
               //     }
               //     fiveSaveTwoApi(options).then((res)=>{
               //         if (res.code == 0){
               //             this.loading = false
               //             this.getData()
               //             // this.popSuccess('success',res.msg)
               //         }
               //     })
               // }
            },
            //计划属性--状态选择
            planStatus(val){
                this.status = val
            },
            handleOneStatus(val){
                this.ruleForm.status = val
                this.getData()
            },
            handleSearch(){
                this.getData()
            },
            handleTypes(val){
                this.ruleForm.Types = val
                this.getData()
            },
            handleTypes2(val){
                this.ruleForm.Types2 = val
                this.getData()
            },
            //主体名称搜索
            querySearchAsync(queryString, cb) {
                let vm = this;
                vm.getFileName = []
                searchApi(vm.state4,4,vm.$route.params.id).then((res)=>{
                    if (res.code == 0){
                        res.result.forEach(item=>{
                            vm.getFileName.push({value:item})
                        })
                    }
                    var results = vm.getFileName;
                    cb(results);
                })
            },

            handleSelect(item) {
                let vm = this;
                vm.ruleForm.state4 = item.value;
                vm.getData();
            },
            handleClear(){
                this.ruleForm.state4 = '';
                this.getData();
            },
            querySearchAsync2(queryString, cb) {
                let getmanuList = []
                let options = {
                    manuscriptAttribute:queryString,
                    workunitId:this.$route.params.id,
                    planAttribute:''
                }
                fiveSearchOneApi(options).then((res)=>{
                    if (res.code == 0){
                        res.result.forEach(item=>{
                            getmanuList.push({value:item})
                        })
                    }
                    var results = getmanuList;
                    cb(results);
                })
            },
            querySearchAsync3(queryString, cb) {
                let getmanuList = []
                let options = {
                    manuscriptAttribute:'',
                    workunitId:this.$route.params.id,
                    planAttribute:queryString
                }
                fiveSearchTwoApi(options).then((res)=>{
                    if (res.code == 0){
                        res.result.forEach(item=>{
                            getmanuList.push({value:item})
                        })
                    }
                    var results = getmanuList;
                    cb(results);
                })
            },

            handleSelect2(item) {
                let vm = this;
                vm.ruleForm.state5 = item.value;
                vm.getData();
            },
            handleClear2(){
                this.ruleForm.state5 = "";
                this.getData();
            },
            handleSelect3(item) {
                let vm = this;
                vm.ruleForm.state6 = item.value;
                vm.getData();
            },
            handleClear3(){
                this.ruleForm.state6 = "";
                this.getData();
            },
            popSuccess(type,message){
                this.$message({
                    type:type,
                    message:message
                })
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    .search{
        margin-top: 20px;
    }
    .corre-table {
        margin: 20px 0;
        .el-table th.is-leaf{
            padding: 0;
        }
    }
    .handle-view{
        color: $global-color;
        text-decoration: underline;
        cursor: pointer;
    }
</style>
<style lang="scss">
    @import "@/assets/css/varibles.scss";
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
                    text-decoration: underline;
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
</style>
