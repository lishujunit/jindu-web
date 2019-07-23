<template>
    <div class="up-others-wrap">
        <div class="up-other-title">
            <h3>
                <span>母公司名称 > </span>
                <span>尽调清单1010 > </span>
                <span>附件名称</span>
            </h3>
        </div>
        <div class="up-other-encryption" @click="handleEncryption">
            <p>加密</p>
        </div>
        <div class="up-other-table">
            <el-table :data="tableData" border>
                <el-table-column label="序号" prop="number">
                    <!--<template slot-scope="scope">-->
                       <!--<el-checkbox></el-checkbox>-->
                    <!--</template>-->
                </el-table-column>
                <el-table-column label="内容一" prop="content1"></el-table-column>
                <el-table-column label="内容二" prop="content2"></el-table-column>
                <el-table-column label="内容三" prop="content3"></el-table-column>
                <el-table-column label="内容四" prop="content4"></el-table-column>
                <el-table-column label="内容五" prop="content5"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <p class="operate">
                            <span  @click="handleTableAdd(scope.row)">添加</span>
                            <span  @click="handleTableView(scope.row)">查看</span>
                        </p>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="up-other-add" @click="handleAdd">
            <p>+添加行</p>
        </div>

        <!-- 添加资料上传弹窗 -->
        <el-dialog class="up-dialog" title="资料上传" :visible.sync="dialogAdd"  :before-close="handleClose">
            <el-row>
                <el-col :span="3">
                    <span class="up-file-select">文件选择</span>
                </el-col>
                <el-col :span="21">
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        multiple
                        :limit="3"
                        :on-exceed="handleExceed"
                        :file-list="fileList">
                        <el-button size="small" type="primary">浏览</el-button>
                    </el-upload>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3">
                    <el-checkbox>加密</el-checkbox>
                </el-col>
                <el-col :span="21">
                    <span style="line-height: 16px"><i>*</i>请谨慎选取！</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3">
                    <span class="up-file-select">文件描述</span>
                </el-col>
                <el-col :span="21">
                    <el-input ></el-input>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAdd = false">取 消</el-button>
                <el-button type="primary" @click="dialogAdd = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: "uploadothers",
        data(){
            return{
                tableData:[
                    {
                        number:'1',
                        content1:'1',
                        content2:'1',
                        content3:'1',
                        content4:'1',
                        content5:'1',
                    },
                    {
                        number:'1',
                        content1:'1',
                        content2:'1',
                        content3:'1',
                        content4:'1',
                        content5:'1',
                    }
                ],
                dialogAdd:false,
                fileList:[],
            }
        },
        mounted(){
          this.getData();
        },
        methods:{
            //获得列表
            getData(){

            },
            //列表点击
            handleTableAdd(){
                let vm = this;
                vm.dialogAdd = true;
            },

            handleTableView(){

            },

            //加密
            handleEncryption(){

            },

            //添加行
            handleAdd(){

            },

            //列表添加弹框
            handleClose(){

            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    .up-others-wrap{
        .up-other-title{
            background: #fff;
            height: 46px;
            line-height: 46px;
            padding-left: 10px;
            h3{
                font-size: 16px;
                font-weight: bold;
                color: $txt-color;
            }
        }
        .up-other-encryption{
            width: 150px;
            height: 36px;
            border-radius: 20px;
            line-height: 36px;
            text-align: center;
            color: #fff;
            background: $global-color;
            margin: 20px 0;
            p{
                font-size: 16px;
            }
        }
        .up-other-table{
            .operate{
                >span{
                    cursor: pointer;
                    color: $global-color;
                    text-decoration: underline;
                    margin-right: 10px;
                }
            }
        }
        .up-other-add{
            margin-top: 20px;
            width: 150px;
            height: 36px;
            background: #fff;
            line-height: 36px;
            text-align: center;
            font-size: 14px;
            color: $global-color;
        }
        .up-file-select{
            line-height: 32px;
        }
        .up-dialog{
            .el-dialog__body{
                box-sizing: border-box;
                padding: 0 30px;
            }
        }
        .el-row{
            margin: 20px 0;
            .el-input{
                width: 40%;
            }
        }
    }

</style>
