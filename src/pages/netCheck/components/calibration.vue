<template>
    <div>
        <router-view></router-view>
    </div>
</template>
<script>

export default {

    watch: {
        '$parent.back'() {
            this.$router.go(-1)
        }
    },
    data() {
        return {
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>