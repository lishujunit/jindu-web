<template>
    <div class="system-wrap">
        <div class="model-search">
            <el-form ref="ruleForm" label-width="70px" class="form" inline>
                <el-form-item label="手机号" prop="name">
                    <el-autocomplete
                            class="search-input"
                            clearable
                            style="width: 350px;"
                            v-model="ruleForm.name"
                            @clear="handleClear"
                            @keyup.enter.native="handleSearch"
                            :fetch-suggestions="querySearchAsync"
                            @select="handleSelect"
                    ></el-autocomplete>
                    <!--<common-select :options="selectOptions"></common-select>-->
                </el-form-item>
                <el-form-item label="激活时间" prop="beginTime">
                    <el-date-picker class="date" type="date" v-model="ruleForm.startTime" value-format="yyyy-MM-dd" :picker-options="startDatePicker" @change="getstartTime"></el-date-picker>
                </el-form-item>
                <el-form-item label="至" prop="endTime" label-width="30px">
                    <el-date-picker class="date" type="date" v-model="ruleForm.endTime" value-format="yyyy-MM-dd" :picker-options="endDatePicker" @change="getendTime"></el-date-picker>
                </el-form-item>
                <!--<el-form-item label="激活时间">-->
                    <!--<el-date-picker-->
                            <!--v-model="ruleForm.time1"-->
                            <!--type="daterange"-->
                            <!--align="right"-->
                            <!--@change="handleTime2"-->
                            <!--value-format="yyyy-MM-dd"-->
                            <!--:clearable="false"-->
                            <!--unlink-panels-->
                            <!--range-separator="至"-->
                            <!--start-placeholder="开始日期"-->
                            <!--end-placeholder="结束日期"-->
                        <!--&gt;-->
                    <!--</el-date-picker>-->
                <!--</el-form-item>-->
                <div class="fr">
                    <el-button type="primary" @click="getData(1)">搜索</el-button>
                    <el-button type="danger" @click="resetForm()">重置</el-button>
                </div>
            </el-form>
        </div>
        <div class="model-table mt20">
            <el-table :data="tableData" border :max-height="getHeight">
                <el-table-column prop="index" label="序号" align="center" width="80">
                    <template slot-scope="scope">
                        {{scope.$index+(page-1)*pageSize+1}}
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号码" align="center"></el-table-column>
                <el-table-column prop="activationTime" label="激活时间" align="center"></el-table-column>
                <el-table-column prop="name" label="客户名称" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.name" maxlength="45" clearable @change="handlleName(scope.row)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="companyName" label="所属公司" align="center" width="340">
                    <template slot-scope="scope">
                        <el-select style="width: 280px;" v-model="scope.row.companyName" @change="handleCompany(scope.row)" placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="departmentName" label="所属部门" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.departmentName" maxlength="20" clearable @change="handleDepart(scope.row)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱地址" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.email" maxlength="50" clearable @change="handleEmail(scope.row)"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
        </div>
    </div>
</template>

<script>
    import {customerApi,customerRefreshApi,customerPhoneApi,customerCompanyApi,customerSelectApi,customerNameApi,customerEmailApi,customerDepartApi } from '@/api/systemManageApi'
    import {validateEmail} from '@/utils/validate'
    export default {
        name: "clientManange",
        data(){
            return{
                getHeight:window.innerHeight - 290,
                ruleForm:{
                    name:'',
                    endTime:'',
                    startTime:'',
                },
                tableData:[],
                pageTotal:0,
                total:1,
                page:1,
                pageSize:20,
                value:'',
                options:[],
                startTime:'',
                endTime:'',
                name:'',
                id:'',
                deptid:'',
                email:'',
                companyName:'',
                companyId:'',
                departmentName:'',
                //创建时间
                startDatePicker: {
                    disabledDate: (time) => {
                        if (this.ruleForm.endTime != "") {
                            return time.getTime() >  new Date(this.ruleForm.endTime).getTime();

                        }
                    },
                },
                endDatePicker: {
                    disabledDate: (time) => {
                        return time.getTime() < new Date(this.ruleForm.startTime).getTime()- 1*24*60*60*1000;//减去一天的时间代表可以选择同一天;
                    },

                },
            }
        },
        mounted(){
          this.getData(1)
          this.getCompany()

        },
        watch:{
            $route(to,from){
                console.log(to.path);
            }
        },
        methods:{
            //列表数据
            getData(val){
                this.page = val
                let options = {
                    activationBeginTime:this.ruleForm.startTime,
                    activationEndTime:this.ruleForm.endTime,
                    pageNum:this.page,
                    pageSize:this.pageSize,
                    phone:this.ruleForm.name,
                }
                customerApi(options).then((res)=>{
                    if (res.code == 0){
                        this.tableData = res.result.records
                        this.total = Number(res.result.total)
                        this.pageTotal = Number(res.result.pages)
                    }
                })
            },
            //分页
            pageChange(val){
                this.getData(val)
            },
            handleSizeChange(val){
                this.pageSize = val
                this.getData(1)
            },
            //重置
            resetForm(){
                this.ruleForm.startTime = ''
                this.ruleForm.endTime = ''
                this.ruleForm.name = ''
                this.getData(1)
            },
            handleSearch(){
                this.getData(1)
            },
            querySearchAsync(queryString, cb) {
                let getFileName = []
                customerPhoneApi(queryString).then((res)=>{
                    if (res.code == 0){
                       if (res.result != ''){
                           res.result.forEach(item=>{
                               getFileName.push({value:item})
                           })
                       }
                    }
                    var results = getFileName;
                    cb(results);
                })
            },
            handleSelect(val){
                this.ruleForm.name = val.value
                this.getData(1)
            },
            handleClear(){
                this.ruleForm.name = ''
                this.getData(1)
            },
            getstartTime(val){
                this.ruleForm.startTime = val
            },
            getendTime(time) {
                this.ruleForm.endTime = time
            },
            handlleName(val){
                this.name = val.name
                this.id = val.id
                let options = {
                    name:val.name,
                    userId:val.id,
                }
                customerNameApi(options).then((res)=>{
                    if (res.code == 0){
                        this.popSuccess('success',res.msg)
                        this.getData(this.page)
                    }
                })
            },
            handleDepart(val){
                let options = {
                    departmentName:val.departmentName,
                    userId:val.id,
                    deptid:val.deptid,
                }
                customerDepartApi(options).then((res)=>{
                    if (res.code == 0){
                        this.popSuccess('success',res.msg)
                        this.getData(this.page)
                    } else{
                        this.getData(this.page)
                    }
                })
              // this.getFresh()
            },
            handleEmail(val){
                this.email = val.email
                this.id = val.id
                if (validateEmail(val.email)){
                    let options = {
                        email:val.email,
                        userId:val.id,
                    }
                    customerEmailApi(options).then((res)=>{
                        if (res.code == 0){
                            this.getData(this.page)
                            this.popSuccess('success',res.msg)
                        } else{
                            this.getData(this.page)
                        }
                    })
                }else {
                    this.$alert('邮箱地址不正确！', '提示', {
                        confirmButtonText: '确定',
                        type: 'error',
                        callback: action => {
                            this.getData(this.page)
                        }
                    });
                }
                // this.getFresh()
            },
            handleCompany(val){
                this.options.forEach(item=>{
                    if (item.label === val.companyName ){
                        this.companyName = item.label
                        this.companyId = item.companyId
                        this.id = val.id
                        let options = {
                            userId:val.id,
                            companyName:item.label,
                            companyId:item.companyId,

                        }
                        customerSelectApi(options).then((res)=>{
                            if (res.code == 0){
                                this.getData(this.page)
                                this.popSuccess('success',res.msg)
                            } else{
                                this.getData(this.page)
                            }
                        })
                    }
                })

            },
            getCompany(){
                customerCompanyApi().then((res)=>{
                    if (res.code == 0){
                        if (res.result!=''){
                            res.result.forEach(item=>{
                                this.options.push({value:item.companyName,label:item.companyName,companyId:item.id})
                            })
                        }
                    }
                })
            },
            popSuccess(type,message){
                this.$message({
                    type:type,
                    message:message
                })
            },
            getFresh(){
                let options = {
                    name:this.name,
                    userId:this.id,
                    departmentName:this.departmentName,
                    deptid:this.deptid,
                    companyName:this.companyName,
                    companyId:this.companyId,
                    email:this.email,
                }
                customerRefreshApi(options).then((res)=>{
                    if (res.code == 0){
                        this.popSuccess('success',res.msg)
                        this.name = ''
                        this.id = ''
                        this.departmentName = ''
                        this.deptid = ''
                        this.companyName = ''
                        this.companyId = ''
                        this.email = ''
                        this.getData(this.page)
                    } else{
                        this.getData(this.page)
                    }
                })
            },
        },

    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    @import "common";
</style>
