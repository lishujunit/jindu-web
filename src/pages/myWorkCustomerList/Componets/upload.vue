<template>
    <div class="upload-wrap">
        <div class="upload-select">
            <el-select v-model="value" placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <div class="up-button" @click="handleAll">整包上传资料</div>
        </div>
        <div class="table">
            <el-table  :data="tableData"  border>
                <el-table-column label="尽调属性" prop="attribute" width="120"></el-table-column>
                <el-table-column label="尽职调查内容" prop="content"></el-table-column>
                <el-table-column label="附件" prop="others">
                    <template slot-scope="scope">
                        <p class="others" @click="getOthers(scope.$index, scope.row)">附件名称一</p>
                        <p class="others">附件名称一</p>
                    </template>
                </el-table-column>
                <el-table-column label="已上传资料" prop="uploads"></el-table-column>
                <el-table-column label="答疑内容" prop="answer">
                    <template slot-scope="scope">
                        <input class="table-input" type="text" placeholder="必要时请在此输入应答内容">
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div class="operate">
                            <span @click="handleUpload(scope.$index, scope.row)">上传资料</span>
                            <span @click="handleCommit(scope.$index, scope.row)">提交资料</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "upload",
        data(){
            return{
                options:[{
                    value: '选项1',
                    label: '黄金糕'
                }],
                value:'',
                tableData:[
                    {
                        attribute: '1-1',
                        content: '王小虎',
                        others: '上海市普陀区金沙江路 1518 弄',
                        uploads: '上海市弄',
                        answer: '上海市弄',
                    }
                ]
            }
        },

        methods:{
            getOthers(){

            },
            handleUpload(){

            },
            handleCommit(){

            },
            handleAll(){
                alert('to')
                this.$router.push({path:'/stepsList/uploadothers'})
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    .upload-wrap{
        .upload-select{
            .up-button{
                background:  $global-color;;
                width: 100px;
                height: 30px;
                border-radius: 15px;
                text-align: center;
                line-height: 30px;
                color: #fff;
                font-size: 14px;
                margin-top: 20px;
                padding: 0 10px;
                cursor: pointer;
            }
        }
        .table{
            margin-top: 30px;
            .table-input{
                padding: 6px;
                width: 90%;
                border: 1px solid #ccc;
            }
            .operate{
                margin: 0 auto;
                >span{
                    color: $global-color;
                    text-decoration: underline;
                    cursor: pointer;
                }
                >span:first-of-type{
                    margin-right: 10px;
                }

            }
            .others{
                color: $global-color;
                text-decoration: underline;
                cursor: pointer;
            }
        }
    }
</style>
