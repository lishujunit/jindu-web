<template>
    <div class="final-wrap posfix">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="报告底稿" name="first">
               <report-index></report-index>
            </el-tab-pane>
            <el-tab-pane label="过程文件" name="second">
                <process-file></process-file>
            </el-tab-pane>
            <el-tab-pane label="计划关联" name="third">
                <planAssociated :materId="this.$route.query.materId" :projectNo="this.$route.params.id" :clickBool='clickBool'></planAssociated>
            </el-tab-pane>
        </el-tabs>
        <div class="btn-rght">
                <el-button  type="primary" @click="goBack">返回</el-button>
        </div>
    </div>
</template>

<script>
    import processFile from './list/processFile'
    import reportIndex from './list/reportIndex'
    import planAssociated from './list/planAssociated'
    export default {
        name: "finalReport",
        components:{
            processFile,
            reportIndex,
            planAssociated
        },
        data(){
            return{
                activeName:'first',
                clickBool:false,//点击第三个页面改变
            }
        },
        methods:{
            handleClick(tab, event) {
                // console.log(tab.name)
                if(tab.name=='third'){
                    this.clickBool = true
                }else{
                    this.clickBool = false
                }
            },
             //返回按钮
            goBack() {
            	if(this.$route.params.id){
//          		myWork/details/:id
					this.$router.push({path:'/myWork/details/'+this.$route.params.id})
            	}
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    .final-wrap{
        margin: 20px auto;
    }
    .posfix{
    	position:relative;
    }
    .btn-rght{
    	position: absolute;
    	right: 0px;
    	top: 0px;
    }
</style>
