<template>
    <div>
        <el-table :data="expandList" :show-header="false" v-loading="expandLoading">
            <el-table-column align="center"  width="80"></el-table-column>
            <!--<el-table-column align="center"  width="80">-->
                <!--<template slot-scope="scope">-->
                    <!--{{expandPage}}-{{scope.$index+1}}-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column align="center" prop="">
                <template slot-scope="scope">{{scope.row.crawlerShowNo}}</template>
            </el-table-column>
            <el-table-column align="center" prop="createTime">
                <template slot-scope="scope">{{scope.row.createTime}}</template>
            </el-table-column>
            <el-table-column align="center" prop="createUserName">
                <template slot-scope="scope">{{scope.row.createUserName==''?'-':scope.row.createUserName}}</template>
            </el-table-column>
            <el-table-column align="center" prop="taskDesc" show-overflow-tooltip>
                <template slot-scope="scope"><div class="tabtext">{{scope.row.taskDesc}}</div></template>
            </el-table-column>
            <el-table-column align="center" prop="websiteNames"  show-overflow-tooltip>
                <template slot-scope="scope">
                    <a class='var under' :href="scope.row.websiteUrl" target="_blank" @click="goLink(scope.row.websiteUrl,$event)" show-overflow-tooltip>{{scope.row.websiteNames}}</a>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="subjectCount" >
                <template slot-scope="scope">
                    <div class="btn" v-if="scope.row.parent" @click="handleDomin(scope.row,scope.$index)" :class="{ red:changeReds == scope.$index}">{{scope.row.subjectCount}}</div>
                    <div v-else>-</div>
                </template>
            </el-table-column>
            <el-table-column align="center">
                <template slot-scope="scope">
                    <!--<div class="btn-box" :class="'var under'">-->
                    <div class="btn" v-if="scope.row.parent" @click="handleDomin(scope.row,scope.$index)" :class="{ red:changeReds == scope.$index}">
                        <p>查看主体</p>
                    </div>
                    <div class="btn" v-else="" @click="submit(scope.row,scope.$index,1)" :class="{ red:changeRed == scope.$index}">
                        <p v-if="scope.row.innerCheck" style="color: #BDBDBF;text-decoration: underline">下载清单</p>
                        <p v-else style="color: #0cb3f0 ;text-decoration: underline">下载清单</p>
                    </div>
                    <!--</div>-->
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { checkList, batchList, exportss, getSubject, bySiteName} from "@/api/project";
    import { downFile } from '@/utils/api'
    export default {
        props: {
            batchNo: '',
            details: Array
        },
        data(){
            return{
                expandList:[],
                expandLoading:false,
                changeRed:-1,
                changeReds:-1
            }
        },

        mounted(){
            this.getData()
        },
        methods:{
            getData(){
                 this.expandList = this.details;
                 this.$emit('refresh',1)
                 return false 
                batchList(this.batchNo).then((res)=>{
                    if (res.code == 0){
                        console.log(res)
                        this.expandList = res.result
                        this.$emit('refresh',1)
                    }
                })
            },
            submit(row, index,number) {
                this.changeRed = index;
                switch (number) {
                    case 1:
                        this.expandList.forEach(item=>{
                            if (item.id == row.id){
                                item.innerCheck = true
                            }
                        })
                        break;
                    default:
                        this.expandList.forEach(item=>{
                            item.innerCheck = false
                        })
                        break;
                }
                this.$confirm('确定下载清单?', '提示', {
                    type: 'warning',
                    confirmButtonText: '下载',
                    cancelButtonText: '取消'
                }).then(() => {
                    this.$emit("fileDownload", '核查主体清单.xls', process.env.VUE_APP_BASEURL + '/checkList/export?crawlerBatchId=' + row.id);
                    // this.downloadName = '核查主体清单.xls';
                    // this.downloadPath = process.env.VUE_APP_BASEURL + '/checkList/export?crawlerBatchId=' + row.id;

                    // exportss(row.id).then(res => {
                    //     let url = process.env.VUE_APP_BASEURL + '/checkList/export?crawlerBatchId=' + row.id;
                    //     var oReq = new XMLHttpRequest();
                    //     oReq.open("GET", url, true);
                    //     oReq.responseType = "blob";
                    //     oReq.onload = function (oEvent) {
                    //         var content = oReq.response;

                    //         var elink = document.createElement('a');
                    //         elink.download = '核查主体清单.xls';
                    //         elink.style.display = 'none';

                    //         var blob = new Blob([content]);
                    //         elink.href = URL.createObjectURL(blob);

                    //         document.body.appendChild(elink);
                    //         elink.click();

                    //         document.body.removeChild(elink);
                    //     };
                    //     oReq.send();
                    //     if (res.code == 0) {
                    //         this.$message({
                    //             type: 'success',
                    //             message: '下载成功！'
                    //         })

                    //         if (this.list.length == 1 && this.page > 1) this.pageChange(this.page - 1)
                    //         else if (this.list.length == 1 && this.page == 1) {
                    //             this.list = []
                    //             this.total = 0
                    //         } else {
                    //             this.pageChange(this.page)
                    //         }
                    //     }
                    // })
                }).catch(() => {
                });
            },
            goLink(address, e) {
                e.currentTarget.className = "under var isClick"
                window.open(address)
            },
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    .btn{
        >p{
            cursor: pointer;
        }
    }
    a.under.isClick {
        color: #bdbdbd !important; /*连接访问的颜色变化*/
    }
</style>
