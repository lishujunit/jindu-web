<template>
    <div>
        <el-dialog title="提示" :visible.sync="options.showDialog" width="20%" :close-on-click-modal="false" :show-close="false">
            <span><i class="el-icon-warning"></i>确认删除</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="options.condfirm">确 定</el-button>
                <el-button @click="options.dialogVisible = false">取 消</el-button>

              </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "commonAlert",
        props:['options']
    }
</script>

<style scoped>

</style>
