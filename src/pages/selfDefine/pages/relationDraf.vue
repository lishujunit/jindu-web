<template>
    <div class="draf-wrap">
        <div class="search">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="form" inline>
                <el-form-item label="资料名称">
                    <el-input style="width: 320px;" v-model="ruleForm.state4"  maxlength="100" clearable @change="handleInput" @keyup.enter.native="handleSearch"></el-input>
                </el-form-item>
                <el-form-item label="底稿属性">
                    <el-autocomplete
                            class="search-input"
                            clearable
                            v-model="ruleForm.state3"
                            style="width: 320px;"
                            @clear="handleClear2"
                            :fetch-suggestions="querySearchAsync2"
                            @select="handleSelect2"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="底稿状态">
                    <el-select v-model="ruleForm.Types" placeholder="请选择" class="state" @change="handleTypes">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(item,index) in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="计划属性">
                    <el-autocomplete
                            class="search-input"
                            clearable
                            v-model="ruleForm.state5"
                            style="width: 320px;"
                            @clear="handleClear3"
                            :fetch-suggestions="querySearchAsync3"
                            @select="handleSelect3"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="计划状态">
                    <el-select v-model="ruleForm.types2" placeholder="请选择" class="state" @change="handleTypes2">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(item,index) in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <div class="rightBox">
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button type="danger" @click="resetForm('ruleForm')">重置</el-button>
                </div>
            </el-form>
        </div>
        <div class="selfDefine-table">
            <el-table :data="tableData" :max-height="getHeight" :v-loading="loading" border @cell-dblclick="handle">
                <el-table-column label="序号" type="index" width="80" align="center">
                    <template slot-scope="scope">
                        {{scope.$index+(page-1)*pageSize+1}}
                    </template>
                </el-table-column>
                <el-table-column prop="fileName" label="资料名称" align="center">
                    <template slot-scope="scope">
                        <span class="item-color" @click="handleView(scope.row)">{{scope.row.fileName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="描述" align="center"></el-table-column>
                <el-table-column prop="manuscriptAttribute" label="底稿属性" align="center">
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
                            {{scope.row.manuscriptAttribute.toString()}}
                        </div>
                        <!--<span v-if="!scope.row.visible">{{scope.row.visible}}</span>-->
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <!--<template slot-scope="scope" slot="header">-->
                    <!--<div class="status-change">-->
                    <!--<div class="status-des">状态</div>-->
                    <!--<div class="status-select">-->
                    <!--<el-select  v-model="manuState1" @change="statusChange">-->
                    <!--<el-option-->
                    <!--v-for="item in options"-->
                    <!--:key="item.value"-->
                    <!--:label="item.label"-->
                    <!--:value="item.value"-->
                    <!--&gt;</el-option>-->
                    <!--</el-select>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!--</template>-->
                    <template slot-scope="scope">
                        <span v-if="scope.row.relationshipStatus==='Y'">已关联</span>
                        <span  v-if="scope.row.relationshipStatus==='N'">未关联</span>
                    </template>
                </el-table-column>
                <el-table-column prop="attribute" label="计划属性" align="center">
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
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <!--<template slot-scope="scope" slot="header">-->
                    <!--<div class="status-change">-->
                    <!--<div class="status-des">状态</div>-->
                    <!--<div class="status-select">-->
                    <!--<el-select  v-model="manuState2" @change="statusChange2">-->
                    <!--<el-option-->
                    <!--v-for="item in options"-->
                    <!--:key="item.value"-->
                    <!--:label="item.label"-->
                    <!--:value="item.value"-->
                    <!--&gt;</el-option>-->
                    <!--</el-select>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!--</template>-->
                    <template slot-scope="scope">
                        <span v-if="scope.row.planStatus==='Y'">已关联</span>
                        <span  v-if="scope.row.planStatus==='N'">未关联</span>
                    </template>
                </el-table-column>
            </el-table>
            <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange"  :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
        </div>
    </div>
</template>

<script>
    import { previewFile } from '@/utils/api'
    import { validationFormat,validationPlanFormat } from '@/utils/validate'
    import { thirdListApi,thirdSave,thirdGetManu,thirdPlanSave,thirdPlans } from '@/api/selfDefinApi'
    export default {
        name: "relationDraf",
        components: {},

        data(){
            return{
                ruleForm:{
                    state4:'',
                    state3:'',
                    state5:'',
                    Types:'',
                    types2:'',

                },
                input1:[],//底稿属性
                input2:'',//计划属性
                state4:'',
                state3:'',
                status1:'',
                loading:false,
                value4:'',
                options:[
                    {value:'Y',label:'已关联'},
                    {value:'N',label:'未关联'},
                ],
                options1:[],
                options2:[],
                tableData:[],
                total:0,
                pageTotal:0,
                page:1,
                pageSize:20,
                projectNo:'',
                workunitId:'',
                status:'',
                getHeight:0,
                getManuIds:[],
                inputId:'',
                getPlanIds:[],
                fileName:'',
                manuscriptAttribute:'',
                manuscriptStatus:'',
                planAttribute:'',
                planStatus:'',
                manuState2:'',
                manuState1:'',
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
            this.remoteMethod();
            this.remoteMethod2();
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
                this.getHeight=window.innerHeight-400;
            },
            getData(){
                let vm = this;
                vm.loading = true;
                let options = {
                    pagenum:vm.page,
                    pagesize:vm.pageSize,
                    workunitId:vm.$route.params.id,
                    fileName:vm.ruleForm.state4,
                    manuscriptAttribute:vm.ruleForm.state3,
                    manuscriptStatus:vm.ruleForm.Types,
                    planAttribute:vm.ruleForm.state5,
                    planStatus:vm.ruleForm.types2,
                }
                thirdListApi(options).then((res)=>{
                    if (res.code == 0){
                        vm.loading = false;
                        vm.tableData = res.result.records;
                        vm.pageTotal = Number(res.result.pages)
                        vm.total = Number(res.result.total)
                        vm.tableData.forEach(item=>{
                            if (item.manuscriptAttribute!=''){
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
            /*---------------   资料名称    -------------------*/
            querySearchAsync(queryString, cb) {
                let vm = this;
                let getFileName = []
                let options = {
                    name:'',
                    workunitId: this.$route.query.id
                }
                thirdGetManu(options).then((res)=>{
                    if (res.code == 0){
                        if (res.result !=''){
                            res.result.forEach(item=>{
                                getFileName.push({value:item})
                            })
                        }
                    }
                    var results = getFileName;
                    cb(results);
                })
            },
            handleSearch(val){
                this.getData()
            },
            resetForm(){
                this.ruleForm.state4 = ''
                this.ruleForm.state3 = ''
                this.ruleForm.state5 = ''
                this.ruleForm.Types = ''
                this.ruleForm.types2 = ''
                this.getData()
            },
            querySearchAsync2(queryString, cb) {
                let getFileName = []
                let options = {
                    name:'',
                    workunitId: this.$route.params.id
                }
                thirdGetManu(options).then((res)=>{
                    if (res.code == 0){
                        if (res.result !=''){
                            res.result.forEach(item=>{
                                getFileName.push({value:item})
                            })
                        }
                    }
                    var results = getFileName;
                    cb(results);
                })
            },
            querySearchAsync3(queryString, cb) {
                let getFileName = []
                let options = {
                    name:queryString,
                    workunitId: this.$route.params.id
                }
                thirdPlans(options).then((res)=>{
                    if (res.code == 0){
                        if (res.result !=''){
                            res.result.forEach(item=>{
                                getFileName.push({value:item})
                            })
                        }
                    }
                    var results = getFileName;
                    cb(results);
                })
            },
            handleClear3(){
                this.ruleForm.state5 = ''
                this.getData()
            },
            handleSelect3(val){
                this.ruleForm.state5 = val.value
                this.getData()
            },
            handleClear(){
                this.ruleForm.state4 = "";
                this.getData();
            },
            handleTypes(val){
                this.ruleForm.Types = val
                this.getData()
            },
            handleTypes2(val){
                this.ruleForm.types2 = val
                this.getData()
            },
            /*---------------   列表    -------------------*/
            //列表选取
            handleSelect(item) {
                this.ruleForm.state4 = item.value
                this.getData()
            },
            handleSelect2(item) {
                this.ruleForm.state3 = item.value
                this.getData()
            },
            handleClear2(){
                this.ruleForm.state3 = ''
                this.getData()
            },
            //详情
            handleView(val) {
                var title = val.fileName.split('.')
                previewFile(val.filePath,title[0])
            },
            statusChange(val){
                this.manuState1 = val
                this.getData()
            },
            statusChange2(val){
                this.manuState2 = val
                this.getData()
            },
            remoteMethod(){
                let options = {
                    name:'',
                    workunitId: this.$route.params.id
                }
                thirdGetManu(options).then((res)=>{
                    if (res.code == 0){
                        if (res.result !=''){
                            res.result.forEach(item=>{
                                this.options1.push({value:item,label:item})
                            })
                        }
                    }
                })
            },
            remoteMethod2(){
                let options = {
                    name:'',
                    workunitId: this.$route.params.id
                }
                thirdPlans(options).then((res)=>{
                    if (res.code == 0){
                        if (res.result !=''){
                            res.result.forEach(item=>{
                                this.options2.push({value:item,label:item})
                            })
                        }
                    }
                })
            },
            //底稿属性--选项获取
            handleBlur({id,manuscriptAttribute:attribute = []}){
                let status = attribute.length
                    ? validationFormat(attribute[attribute.length - 1])
                    : true;
                if (status){
                    if(this.getStatus){
                        this.loading = true
                        let beans = {
                            attribute:attribute.join(','),
                            id:id
                        }
                        thirdSave(beans).then((res)=>{
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
            //    if (this.getStatus){
            //        let beans = {
            //            attribute:val.manuscriptAttribute.toString(),
            //            id:val.id
            //        }
            //        thirdSave(beans).then((res)=>{
            //            if (res.code == 0){
            //                this.getData()
            //            }
            //        })
            //    }
            // },
            //计划属性
            handleBlur2({id,planAttribute:attribute = []}){
                let status = attribute.length
                    ? validationPlanFormat(attribute[attribute.length - 1])
                    : true;
                if (status){
                    if(this.getStatus){
                        this.loading = true
                       let beans = {
                           attribute:attribute.join(','),
                           id:id
                       }
                        thirdPlanSave(beans).then((res)=>{
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
            },
            // handleBlur2(val){
            //    if (this.getStatus){
            //        let beans = {
            //            attribute:val.planAttribute.toString(),
            //            id:val.id
            //        }
            //        thirdPlanSave(beans).then((res)=>{
            //            if (res.code == 0){
            //                this.getData()
            //            }
            //        })
            //    }
            // },
            //计划属性--保存
            handle(row,column,event,cell){
                switch (column.label) {
                    case  "底稿属性":
                        this.inputId = row.id
                        break;
                }
            },
            popSuccess(type,message){
                this.$message({
                    type:type,
                    message:message
                })
            },
            handleInput(val){
                this.ruleForm.state4 = val
                this.getData()
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    .draf-wrap{
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
                margin-left: 20px;
                >span{
                    margin-right: 10px;
                }
            }
            >div:last-of-type{
                float: right;
            }
        }
        .selfDefine-table{
            margin-top: 20px;
            .item-color{
                color: $global-color;
                text-decoration: underline;
                cursor: pointer;
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
