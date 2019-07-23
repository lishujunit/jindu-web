<template>
    <header>
        <img class="fl" :src="require('@/assets/images/logo.png')">
        <span class="fl title">金杜项目管理系统</span>
    </header>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
header {
    background-color: #1f212d;
    height: 50px;
    padding: 0 50px 0 15px;

    >img {
        height: 50px;
        display: block;
    }

    .title {
        font-weight: 700;
        font-size: 16px;
        color: #fff;
        line-height: 50px;
        margin-left: 4px;
        display: block;
    }

    .item {
        color: #fff;
        line-height: 50px;
        margin-left: 25px;
        cursor: pointer;

        .iconfont {
            margin-right: 5px;
            font-size: 18px;
            display: block;
            float: left;
        }
    }
}
</style>