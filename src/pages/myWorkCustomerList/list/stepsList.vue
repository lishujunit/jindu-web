<template>
    <div class="step-wrap">
        <title-bar @goBack="goBack"></title-bar>
        <div style="margin: 15px 0 26px;">
            <step :list="list"></step>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
    import step from '@/components/step'

    export default {
        name:'stepsList',
        components: {
            step
        },
        data() {
            return {
                title:'',
                list: [{
                }, {
                    name: '确认应答联系人',
                    icon: require('../../../assets/images/myWork/custom_normal.png'),
                    activeIcon: require('../../../assets/images/myWork/custom_select.png'),
                    path: 'contactor',
                    query:{}
                }, {
                    name: '上传资料',
                    icon: require('../../../assets/images/myWork/upload_normal.png'),
                    activeIcon: require('../../../assets/images/myWork/upload_select.png'),
                    path: 'upload',
                    query:{}
                }, {
                }],
                back: 0
            }
        },

        methods: {
            goBack() {
                this.back++
            }
        },
        created(){
            this.list.forEach(v=>{
                v.query=this.$route.params
            })
        },
        // beforeRouteEnter(to, from, next) {
        //     if(to.params.projectNo) next()
        //     else next('/select')
        // }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    .step-wrap{
        margin: 20px auto;
    }
</style>
