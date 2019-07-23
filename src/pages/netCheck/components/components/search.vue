<template>
    <div class="search">
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="form" inline>
            <el-form-item label="站点名称" prop="webName">
                <el-input v-model="ruleForm.webName" style="width: 350px"></el-input>
            </el-form-item>
            <div style="display: inline-block;">
                <el-form-item label="创建时间" prop="beginTime">
                    <el-date-picker class="date" type="date" v-model="ruleForm.beginTime"></el-date-picker>
                </el-form-item>
                <el-form-item label="至" prop="endTime" label-width="30px">
                    <el-date-picker class="date" type="date" v-model="ruleForm.endTime"></el-date-picker>
                </el-form-item>
            </div>
            <el-form-item label="创建人" prop="createBy">
                <el-input v-model="ruleForm.createBy"></el-input>
            </el-form-item>
        </el-form>
        <div class="rightBox">
            <el-button type="primary" @click="submitForm('ruleForm')">搜索</el-button>
            <el-button type="danger" @click="resetForm('ruleForm')">重置</el-button>
        </div>
    </div>
</template>
<script>
import { checkList } from '@/api/project'
export default {
    name: 'search',
    data() {
        return {
            ruleForm: {
                webName: '',
                beginTime: '',
                endTime: '',
                createBy: '',
            },
        }
    },
    methods: {
        submitForm(ruleForm) {
            this.$refs[ruleForm].validate((valid) => {
                if (valid) {
                    // alert('submit!');
                    new Promise((resolve, reject) => {
                        checkList(this.ruleForm.webName,this.ruleForm.beginTime,this.ruleForm.endTime,this.ruleForm.createBy).then(res => {
                            resolve(res)
                        }).catch(error => {
                            reject(error)
                        })
				})
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }

}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/assets/css/varibles.scss';

</style>