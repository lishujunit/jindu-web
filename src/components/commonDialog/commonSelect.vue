<template>
    <div>
        <el-select
            v-model="options.name"
            filterable
            remote
            clearable
            style="width: 350px;"
            reserve-keyword
            :remote-method="options.remoteMethod"
            placeholder=""
            @change="options.handleChange"
            @focus="options.handleFocus">
            <el-option
                v-for="item in options.listOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        name: "commonSelect",
        props:['options'],
    }
</script>

<style scoped>

</style>
