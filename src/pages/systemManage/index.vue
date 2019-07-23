<template>
    <div>
        <div class="box">
            <div class="line fl"></div>
            <div class="title fl">系统管理</div>
            <div class="menu-title">
                <p v-for="(item,index) in options" :key="index" :class="{active:isActive==index}" @click="handleTabAdd(index,item)">{{item.name}}</p>
            </div>
            <div class="fr">
                <el-button type="primary" @click="goBack">返回</el-button>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "systemIndex",
        data(){
            return{
                isActive:0,
                options:[
                    {name:'模板管理',path:'modelManage'},
                    {name:'工作指引',path:'workInstruction'},
                    {name:'运维管理',path:'operationsManage'},
                    {name:'客户管理',path:'clientManange'},
                    {name:'爬虫配置',path:'crawlAllocation'},
                ]
            }
        },
        methods:{
            //titile 返回
            goBack(){
                this.$router.push({path:'/myWork'})
            },
            handleTabAdd(val,val2){
                this.isActive = val
                this.$router.push({path:val2.path})
            }
        },
        created(){
            let routeName = this.$route.name;
            this.options.forEach((element, index) => {
                if(element.path == routeName){
                    this.isActive = index
                }
            });
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import '@/assets/css/varibles.scss';
    .box {
        overflow: hidden;
        .menu-title{
            float: left;
            margin-left: 50px;
            >p{
                float: left;
                display: inline-block;
                cursor: pointer;
                font-size: 16px;
                line-height: 28px;
                padding-right: 30px;
                color: #949494;
                &.active{
                    color: $global-color;
                    text-decoration: underline;
                }
            }
            >p:after{
                content: '';
                position: absolute;
                background: #969696;
                height: 10px;
                margin-top: 10px;
                margin-left: 10px;
                width: 2px;
            }
            >p:last-of-type:after{
                display: none;
            }
        }
        .title {
            color: $txt-color;
            font-size: 16px;
            line-height: 28px;
            position: relative;
            font-weight: 600;
        }

        .line {
            content: '';
            width: 5px;
            height: 28px;
            background-color: $global-color;
            margin-right: 8px;
        }
    }
</style>
