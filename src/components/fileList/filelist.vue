<template>
    <div class="file-wrap">
        <div class="table">
            <table>
                <tr>
                    <th v-for="(item,index) in options.titleList" :key="index">{{item.name}}</th>
                </tr>
                <tr v-for="(getItem,index) in options.tdList" :key="index">
                    <td>{{getItem.name}}</td>
                    <td>{{getItem.id}}</td>
                    <td>{{getItem.category}}</td>
                    <td>{{getItem.time}}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "filelist",
        props:['options']
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    /*@import "@/assets/css/varibles.scss";*/

</style>
