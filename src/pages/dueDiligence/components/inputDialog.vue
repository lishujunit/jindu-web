<template>
    <div>
        <el-dialog :title="options.title" :visible.sync="options.dialogFormVisible" width="30%" :before-close="options.handleClose" :close-on-click-modal="false">
            <el-input placeholder="输入长度为20个字符" type="text" v-model="options.reasonInput" rows="4" maxlength="20"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="options.handleCommit">确 定</el-button>
                <el-button @click="options.handleClose">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "commonDialog",
        props:['options']
    }
</script>

<style>
	.el-dialog{
		min-width: 350px !important;
	}
</style>
