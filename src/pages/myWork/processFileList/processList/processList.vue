<template>
   <div class="process-wrap">
       <div class="step-wrap">
           <title-bar @goBack="goBack"></title-bar>
       </div>
       <div class="search-list">
           <p>题目名称</p>
           <el-autocomplete
               class="search-input"
                v-model="state4"
                clearable
                :fetch-suggestions="querySearchAsync"
                @select="handleSelect"
           ></el-autocomplete>
           <el-button type="primary" @click="handleSearch">搜索</el-button>
       </div>
       <div class="table">
           <el-table :data="tableData" border>
               	<el-table-column align="center" prop="index" label="题目" width="75">
				 <template slot-scope="scope"><span>题目</span>{{scope.$index+1+pageSize*(page-1)}}</template>
				</el-table-column>
               <!-- <el-table-column type="index" width="50" align="center"> </el-table-column> -->
               <el-table-column label="题目名称" prop="titleName" align="center"></el-table-column>
               <el-table-column label="确认文档名称" prop="fileConfirmedName" align="center">
	            <template slot-scope="scope">{{scope.row.fileConfirmedName?scope.row.fileConfirmedName:'-'}}</template>
               </el-table-column>
               <el-table-column label="最终确认时间" prop="confirmedTime" align="center">
	                <template slot-scope="scope">{{scope.row.confirmedTime?scope.row.confirmedTime:'-'}}</template>
               </el-table-column>
               <el-table-column align="center" prop="confirmedUser" label="最终确认人">
					<template slot-scope="scope">{{scope.row.confirmedUser?scope.row.confirmedUser:'-'}}</template>
				</el-table-column>
               <el-table-column label="文档个数" prop="fileCounts" align="center"></el-table-column>
               <el-table-column label="操作" align="center">
                   <template slot-scope="scope">
                       <el-button type="text" size="small" @click="handleDetails(scope.row)" style="text-decoration: underline;">查看详情</el-button>
                   </template>
               </el-table-column>
           </el-table>
           <!-- <pageination @pageChange="pageChange" :total="total" :page="page" :pageSize="pageSize"></pageination> -->
           <pageination @pageChange="pageChange" @handleSizeChange="handleSizeChange" :page-total="pageTotal" :total="total" :page="page" :pageSize="pageSize"></pageination>
       </div>
   </div>
</template>

<script>
    import { processList } from '@/api/finalReport'
    export default {
        name: "processList",
        data(){
          return{
              state4:'',
              tableData:[
                  {
                      titleName:'',
                      fileConfirmedName:'',
                      confirmedTime:'',
                      fileCounts:'',

                  }
              ],
              page:1,
              total:10,
              pageSize:20,
              getProjectNo:'',
              getFileName:[],
              pageTotal: 0,
			  tableHeight:0,
          }
        },
        mounted(){
          this.getProjectNo=this.$route.params.id
          this.getData();
          this.getSearch();
          this.getTableHeight();
        },
        created() {
            window.addEventListener('resize', this.getTableHeight);
            this.getTableHeight()
        },
        destroyed(){
            window.removeEventListener('resize', this.getTableHeight)
        },
        watch:{
          state4(val){
              if (val == ''){
                  this.getData()
              }
            }
        },
        methods:{
            	handleSizeChange(val){
                    this.pageSize = val
                    this.pageChange(1)
                },
                getTableHeight(){
                    this.tableHeight=window.innerHeight-320;
                },
            goBack(){
             this.$router.push({path:'/myWork/details/'+this.$route.params.id})
            },
            getData(){
                let vm = this;
                processList(vm.getProjectNo,vm.page,vm.pageSize,vm.state4).then((res)=>{
                    if (res.code == 0){
                        vm.tableData = res.result.records;
                        vm.page = res.result.current;
                        vm.pageSize = Number(res.result.size);
                        vm.total = Number(res.result.total);

                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            getSearch(){
                let vm = this;
                var getFileName1 = [];
                processList(vm.getProjectNo,vm.page,vm.pageSize,vm.state4).then((res)=>{
                    if (res.code == 0){
                        vm.tableData = res.result.records;
                        vm.page = Number(res.result.pages);
                        vm.pageSize = Number(res.result.size);
                        vm.total = Number(res.result.total);
                        for (let i = 0;i<res.result.records.length;i++){
                            getFileName1.push(res.result.records[i].titleName)
                        }
                        var newArray = Array.from(new Set(getFileName1))
                        vm.getFileName = [];
                        for(let j = 0; j<newArray.length;j++){
                            vm.getFileName.push({'value':newArray[j]});
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            //搜索框
            querySearchAsync(queryString, cb) {
                var restaurants =this.getFileName;
                // console.log(restaurants)
                var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 500 * Math.random());
            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item) {
                let vm = this;
                vm.state4 = item.value;
                vm.getData();
            },
            handleSearch(){
                this.page = 1;
                this.getData();
            },
            pageChange(val){
                this.page = val;
                this.getData();
            },
            handleDetails(val){
                // console.log(val)
                this.$router.push({path:'/myWork/processFileList/'+val.id,query:{id:val.id, projectNo: val.projectNo}})
            }

        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "@/assets/css/varibles.scss";
    @import "processList.scss";

</style>
