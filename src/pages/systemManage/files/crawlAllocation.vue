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
                </el-form-item>
                <el-form-item label="状态" prop="name">
                    <el-select v-model="ruleForm.name" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="入口地址" prop="name">
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
                </el-form-item>
                <div class="fr">
                    <el-button type="primary" @click="getData(1)">搜索</el-button>
                    <el-button type="danger" @click="resetForm()">重置</el-button>
                </div>
            </el-form>
        </div>
        <div class="model-table mt20">
            <el-table :data="tableData" border>
                <el-table-column prop="index" label="序号" align="center"></el-table-column>
                <el-table-column prop="index" label="网址名称" align="center"></el-table-column>
                <el-table-column prop="index" label="入口地址" align="center"></el-table-column>
                <el-table-column prop="index" label="动态IP代理情况" align="center"> </el-table-column>
                <el-table-column prop="index" label="线程数" align="center"></el-table-column>
                <!--状态：已生效、已失效；对应操作：修改配置。-->
                <el-table-column prop="index" label="配置状态" align="center">
                    <template slot-scope="scope">
                        <div >
                            <span>待配置</span>
                            <span>已配置</span>
                            <span>已生效</span>
                            <span>已失效</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="index" label="操作" align="center">
                    <template slot-scope="scope">
                       <div class="craw-operate">
                           <span class="one" @click="handleAllocation">配置</span>
                           <span class="btns">查看</span>
                           <span class="one" @click="handleModefy">修改配置</span>
                       </div>
                    </template>
                </el-table-column>
            </el-table>
            <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
        </div>
        <!--<el-dialog :visible.sync="diaologVisible" title="配置爬虫" width="40%" :before-close="handleCancel" :close-on-click-modal="false"  top="2vh">-->
            <!--<el-form :model="ruleForm2" ref="ruleForm" label-width="100px" class="demo-ruleForm craw-dialog">-->
                <!--<h3>基本信息</h3>-->
                <!--<el-form-item label="网址名称" prop="name">-->
                    <!--<el-input v-model="ruleForm2.name"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="入口地址" prop="name">-->
                    <!--<el-input v-model="ruleForm2.name"></el-input>-->
                <!--</el-form-item>-->
                <!--<h3>通用配置</h3>-->
                <!--<el-form-item label="页面编码" prop="region">-->
                    <!--<el-select v-model="ruleForm2.region">-->
                        <!--<el-option label="自动识别" value="shanghai"></el-option>-->
                        <!--<el-option label="区域二" value="beijing"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--&lt;!&ndash;<el-form-item label="" prop="type">&ndash;&gt;-->
                   <!--<div class="dialog-check">-->
                       <!--<el-checkbox-group v-model="ruleForm2.type">-->
                           <!--<div class="dialog-second">-->
                               <!--<el-checkbox label="启用延时策略，最多等待" name="type"></el-checkbox><input v-model="ruleForm2.name" class="dialog-input"/>-->
                               <!--<el-button type="text">秒</el-button>-->
                           <!--</div>-->
                           <!--<el-checkbox label="启用HTTP代理" name="type"></el-checkbox>-->
                           <!--<el-checkbox label="仅执行一次（不勾选代表周期执行）" name="type"></el-checkbox>-->
                       <!--</el-checkbox-group>-->
                   <!--</div>-->
                <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
                <!--<el-form-item label="User-Agent" prop="name">-->
                    <!--<el-input v-model="ruleForm2.name"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="Cookies" prop="name">-->
                    <!--<el-input v-model="ruleForm2.name"></el-input>-->
                <!--</el-form-item>-->
                <!--<h3>单独网址配置</h3>-->
                <!--<el-form-item label="活动形式" prop="desc">-->
                    <!--<el-input type="textarea" v-model="ruleForm2.desc"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="开始区域" prop="name">-->
                    <!--<el-input v-model="ruleForm2.name"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="结束区域" prop="name">-->
                    <!--<el-input v-model="ruleForm2.name"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="必须包含" prop="name">-->
                    <!--<el-input v-model="ruleForm2.name"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="不得包含" prop="name">-->
                    <!--<el-input v-model="ruleForm2.name"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                    <!--<el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>-->
                    <!--<el-button @click="handleCancel('ruleForm')">重置</el-button>-->
                <!--</el-form-item>-->
            <!--</el-form>-->
        <!--</el-dialog>-->
        <el-dialog :visible.sync="diaologSecond" title="配置爬虫" width="40%" :before-close="handleCance2"  :close-on-click-modal="false"  top="5vh">
            <el-form :model="ruleForm2" ref="ruleForm" label-width="180px" class="demo-ruleForm craw-dialog" :style="'max-height:'+maxHeight">
                <h3>基本信息</h3>
                <el-form-item label="网址名称" prop="name">
                    <el-input v-model="ruleForm2.name"></el-input>
                </el-form-item>
                <el-form-item label="入口地址" prop="name">
                        <el-input v-model="ruleForm2.name">
                            <el-button @click="handleAdd" slot="append" icon="el-icon-plus plus-icon" style="padding: 0;padding-left: 10px;"></el-button>
                        </el-input>
                        <div v-for="(item,index) in addPort" :key="index" class="mt20">
                            <el-input v-model="item.id" @change="handleInputContent(item)">
                                <el-button @click="handleDelete(item)"  slot="append" icon="el-icon-minus plus-icon" style="padding: 0;padding-left: 10px;"></el-button>
                            </el-input>
                        </div>
                </el-form-item>
                <h3>通用配置</h3>
                <el-form-item label="爬虫线程数" prop="name">
                    <el-input-number v-model="ruleForm.name" controls-position="right" @change="handleChange" :min="1" :max="10" class="diaSecond-input"></el-input-number>
                </el-form-item>
                <el-form-item label="获取代理Url" prop="name">
                    <el-input v-model="ruleForm2.name"></el-input>
                </el-form-item>
                <el-form-item label="获取任务Url" prop="name">
                    <el-input v-model="ruleForm2.name"></el-input>
                </el-form-item>
                <el-form-item label="任务采集类型" prop="name">
                    <el-select v-model="ruleForm2.name" placeholder="请选择">
                        <el-option
                            v-for="item in options4"
                            :key="item.label"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!--<el-form-item label="采集站点" prop="name">-->
                    <!--<el-select v-model="ruleForm2.name" placeholder="请选择">-->
                        <!--<el-option-->
                                <!--v-for="item in options2"-->
                                <!--:key="item.value"-->
                                <!--:label="item.label"-->
                                <!--:value="item.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item label="银保监搜索页面Url" prop="name">
                    <el-input v-model="ruleForm2.name"></el-input>
                </el-form-item>
                <el-form-item label="无任务自动关闭浏览器" prop="name">
                    <el-select v-model="ruleForm2.name" placeholder="请选择">
                        <el-option
                                v-for="item in options3"
                                :key="item.label"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="自动启动采集任务" prop="name">
                    <el-select v-model="ruleForm2.name" placeholder="请选择">
                        <el-option
                                v-for="item in options3"
                                :key="item.label"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="自动清理缓存图片" prop="name">
                    <el-select v-model="ruleForm2.name" placeholder="请选择">
                        <el-option
                                v-for="item in options3"
                                :key="item.label"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                    <el-button @click="handleCance2('ruleForm')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "crawlAllocation",
        data(){
            return{
                ruleForm:{
                    name:'',
                    time1:'',
                },
                tableData:[
                    {index:'1'}
                ],
                pageTotal:0,
                total:1,
                page:1,
                pageSize:20,
                options:[
                    {value:'',label:'全部'},
                    {value:'1',label:'待配置'},
                    {value:'2',label:'已配置'},
                    {value:'3',label:'已生效'},
                    {value:'4',label:'已失效'},
                ],
                options3:[
                    {value:'1',label:'是'},
                    {value:'2',label:'否'}
                ],
                options2:[
                    {value:'1',label:'百度'},
                    {value:'2',label:'银保监'}
                ],
                options4:[
                    {value:'1',label:'动态IP站点'},
                    {value:'2',label:'银保监'}
                ],
                diaologVisible:false,
                diaologSecond:false,
                ruleForm2: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                addPort:[],
                maxHeight:window.innerHeight - 240+'px',
                getInputContent:0

            }
        },
        methods:{
            //列表数据
            getData(val){
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
            //重置
            resetForm(){
                this.ruleForm.name = ''
                this.ruleForm.time1 = ''
                this.getData(1)
            },
            handleSearch(){

            },
            querySearchAsync(){

            },
            handleClear(){

            },
            handleSelect(){

            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleCancel(formName) {
                // this.$refs[formName].resetFields();
                this.diaologVisible = false
            },
            //配置
            handleAllocation(){
                this.diaologSecond = true
            },
            //修改配置
            handleModefy(){
                this.diaologSecond = true
            },
            //计数
            handleChange(val){

            },
            handleCance2(){
                this.diaologSecond = false
            },
            handleAdd(){
                this.getInputContent++
                this.addPort.push({id:this.getInputContent})
                console.log(this.getInputContent)
            },
            handleDelete(val){
                this.addPort.splice(val.id,1)
                console.log(val)
            },
            handleInputContent(val){
                console.log(val)
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    @import "common";
</style>
<style rel="stylesheet/scss" lang="scss">
    .plus-icon{
        font-size: 18px;
        padding: 0;
    }
    .craw-dialog{
        overflow-y: scroll;
        .el-input el-input--small el-input-group el-input-group--append{
            width: 280px;
        }
        .el-input--small .el-input__inner{
            /*width: 320px;*/
        }
        .el-textarea{
            width: 340px;
        }
    }
    .dialog-second{
        .el-button--small{
            padding: 0;
            color: #383535;
            margin-left: 6px;
            margin-top: -6px;
            font-size: 14px;
        }
    }
    .diaSecond-input{
        .el-input--small .el-input__inner{
            width: 100%;
        }
    }
    .crawIcon{
        float: left;
    }
</style>
