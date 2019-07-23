<template>
    <div class="contactor-wrap">
        <div class="contactor-select">
            <el-select v-model="value" placeholder="请选择">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <div class="contactor-table">
                <table>
                    <tr class="contactor-header">
                        <th>尽调属性</th>
                        <th>尽职调查内容</th>
                        <th>附件</th>
                        <th>答疑人联系方式</th>
                        <th>应答部门</th>
                        <th>应答联系人</th>
                        <th>操作</th>
                    </tr>
                    <tr>
                        <td colspan="7" class="content-title">一、公司的历史沿革文件</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>内容</td>
                        <td class="contactor-commit">
                            <p>附件一</p>
                            <p>附件二</p>
                        </td>
                        <td>联系人名称与联系方式</td>
                        <td>
                            <input class="contactor-input" type="text" placeholder="请填写">
                        </td>
                        <td>
                            <input class="contactor-input" type="text" placeholder="请填写">
                        </td>
                        <td class="contactor-commit">提交</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        name: 'contactor',
        data() {
            return {
                options:[
                    {
                        value: '选项1',
                        label: '黄金糕'
                    }
                ],
                value:''
            }
        },
        methods: {}
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    .contactor-wrap{
        .contactor-table{
            margin-top: 20px;
            table{
                width: 100%;
                tr,td,th{
                    border: 1px solid #7aa5ae;
                    padding-left: 9px;
                    height: 46px;
                    line-height: 46px;
                    font-size: 14px;
                    color: $txt-color;
                }
                th{
                    background: #cfdbe3;
                    color: #666;

                }
                td{
                    font-size: 12px;
                    line-height: 1.8;
                    color: #5e6572;
                }
                .content-title{
                    color: #5e6572;
                    font-weight: bold;
                    text-align: center;
                }
                .contactor-input{
                    padding: 6px 10px;
                    width: 90%;
                    border-radius: 2px;
                    color: #5e6572;
                }
                .contactor-commit{
                    color: $global-color;
                    cursor: pointer;
                    text-decoration: underline;
                }
            }
        }
    }
</style>
