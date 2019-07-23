<template>
  <div v-loading="loadingDownload" element-loading-text="文件正在下载中，请稍后...">
    <div class="search">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" inline>
        <el-form-item label="核查主体" prop="subjectName">
          <el-autocomplete
            style="width: 350px"
            class="inline-input"
            clearable
            @clear="handleClear"
            @keyup.enter.native="handleSelect"
            v-model="ruleForm.subjectName"
            @select="handleSelect"
            :fetch-suggestions="querySearch"
          ></el-autocomplete>
          <!--<el-input v-model="ruleForm.subjectName" style="width: 350px"></el-input>-->
        </el-form-item>
      </el-form>
      <div class="rightBox">
        <el-button type="primary" @click="pageChange(1)">搜索</el-button>
        <el-button type="danger" @click="resetForm">重置</el-button>
      </div>
    </div>
    <div class="down">
      <el-button type="primary" @click="downloads">下载</el-button>
      <el-button type="primary" @click="downAll">下载整个表格</el-button>
      <el-button type="primary" @click="downPics(0)">下载全部图片</el-button>
      <el-button type="primary" @click="downPics(1)">仅下载被标记的图片</el-button>
    </div>
    <div class="checkTable mycheckTable">
      <el-table
        :data="list"
        :max-height="getHeight"
        border
        style="margin-top: 16px;"
        v-loading="loading"
        @selection-change="select"
        @cell-dblclick="cellDb"
        :cell-class-name="cellClass"
      >
      	<el-table-column align="center" type="selection" width="45"></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          prop="num"
          label="序号"
          width="70"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          prop="subject"
          label="网络核查主体"
          width="300"
        ></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" v-for="(item,index) in webSites">
          <template slot="header" slot-scope="scope">
            <a class="var under" @click="goLink(item.websiteAddress,$event)">{{item.websiteName}}</a>
            <el-select  @change="chickvalue(item,index)"
				                   v-model="searchValues[index].searchValue" filterable placeholder="请输入/请选择" class="h-m-select myselect_class">
				         	<el-option
				            v-for="item in options"
				            :key="item.value"
				            :label="item.label"
				            v-model="item.value"
				            >
				          </el-option>
				       </el-select>
          </template>
          <template slot-scope="scope">
            <template v-for="web in scope.row.websiteInfos" v-if="web.websiteCode==item.id">
              <div @dblclick="handleRow(scope.row, web)" class="tooll">
                <template v-if="web.status<2">
                  <div
                    class="under"
                    v-if="web.markList==''"
                    @dblclick="viewImage(web.websiteCode,web.subjectWebsiteNum,web.status)"
                  >{{status[web.status]}}</div>
                  <el-tooltip class="item" effect="light" placement="top-start" v-else>
                    <template slot="content">
                      <span style="line-height: 20px" v-for="txt,index in web.markList">
                        标记内容{{index+1}}、{{txt}}
                        <br>
                      </span>
                    </template>
                    <div
                      class="under"
                      @dblclick="viewImage(web.websiteCode,web.subjectWebsiteNum,web.status)"
                    >{{status[web.status]}}</div>
                  </el-tooltip>
                </template>
                <div v-else>
                  <div v-if="web.status == 3" style="color:#999;background: rgb(220, 220, 220);">{{status[web.status]}}</div>
                  <div v-else>{{status[web.status]}}</div>
                </div>
              </div>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pageination
      @pageChange="pageChange"
      @handleSizeChange="handleSizeChange"
      :page-total="pageTotal"
      :total="total"
      :page="page"
      :pageSize="pageSize"
    ></pageination>

    <download :path="downloadPath" :name="downloadName" @downloadDone="downloadDone"/>
    <!-- 下载文件公用组建，path和name为必传项，分别代表下载路径和下载名称(带扩展名如.xls), downloadDone方法是下载成功后的回调 -->
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { conentFormat, downFile } from "@/utils/api";
import download from "@/components/download";
import {
  downReview,
  downReviewPics,
  downReviewFlagPics,
  getReview,
  downloadAllPics,
  downloadFlagPics,
  searchCheck,
  downloadPicsBySubjectNms
} from "@/api/project";
export default {
  computed: {
    ...mapState("netCheck", ["reviewList", "webSites"])
  },
  components: {
    download
  },
  data() {
    return {
      loadingDownload: false,
      projectNo: "",
      subjectNums:'',
      ruleForm: {
        subjectName: ""
      },
      list: [],
      page: 1,
      pageSize: 20,
      loading: false,
      status: ["无", "有", "校验中", "-"],
      selections: [],
      total: 0,
      pageTotal: 0,
      restaurants: [],
      getHeight: 0,
      downloadPath: "", //下载文件的地址
      downloadName: "", //下载文件名称
      options: [{
		        value: 4,
		        label: '全部'
		      },{
		        value: 1,
		        label: '有'
		      },
		      {
		        value: 0,
		        label: '无'
		      },
		      {
		        value: 2,
		        label: '校验中'
		      },
		      {
		        value: 3,
		        label: '-'
		      }],
		    searchValues:[],
		    screeningOptions:[
//				    {
//				        "websiteId":"1",
//				        "flaged":"1"
//				    },
//				    {
//				
//				    }
				],//审核资料按列筛选接口参数
    };
  },
  methods: {
  	chickvalue(val,index){
//				console.log(val)
//				console.log(this.searchValues[index].searchValue)
				if(this.searchValues[index].searchValue==4){
					//全部
						this.backVals("",val.websiteNo)
				}else{
						this.backVals(this.searchValues[index].searchValue,val.websiteNo)
				}
					this.pageChange(1);
//				var checkedItem={
//						"websiteId":val.websiteNo,
//						"flaged":this.searchValues[index].searchValue
//				};
//				this.backVals(this.searchValues[index].searchValue,val.websiteNo)
//				this.pageChange(1);
		},
		backVals(e,id){
			//e代表flaged值 id代表websiteId
            e= e.toString();
            var target=null;
            for(var i=0;i<this.screeningOptions.length;i++){
                if(this.screeningOptions[i].websiteId===id){
                    target=this.screeningOptions[i];
                    break;
                }
            }
            if(target!==null){
                target.flaged=e;
            }else{
                this.screeningOptions.push({websiteId:id,flaged:e});
            }
//          console.log(this.screeningOptions)
           return this.screeningOptions;
        },
    downloadDone() {
      //当有下载任务完成时会调用此方法，并将下载文件名称和下载文件地址设置为空，以便下次下载，当downloadPath改变并且不为空时，会下载文件
      this.downloadName = "";
      this.downloadPath = "";
    },
    handleRow(row, column) {
      //row 每行的数据，element-ui 事件参数
      //column 根据循环传过来的每个td的数据
      console.log("row", row);
      console.log("column", column);
    },
    viewImage(code, id, status) {
      let options = {
        subjectName: this.ruleForm.subjectName,
        picType: code == 55 ? "00" : "01",
        status: status,
        matterStatus: this.$route.query.matterStatus,
        parentfullPath: this.$route.fullPath
      };
      this.$router.push({ path: `viewImage/${id}`, query: options });
    },
    pageChange(index) {
      this.page = index;
      let options = {
        pagenum: this.page,
        pagesize: this.pageSize,
        projectNo: this.projectNo,
        subjectName: this.ruleForm.subjectName,
        websiteStatusVOList:this.screeningOptions,//筛选条件
      };
//    console.log(options)
      this.loading = true;
      this.getReviewList(options)
        .then(() => {
          this.loading = false;
          this.reviewList.records.forEach(v => {});
          this.list = this.reviewList.records;
          this.total = Number(this.reviewList.total);
          this.pageTotal = Number(this.reviewList.pages);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      document.documentElement.scrollTop = -100;
      this.pageChange(1);
    },
    //下载选中的主题表格
    downloads(){
        if (this.selections.length != 0) {
        let subjectNum=[];
        this.selections.forEach(v => {
          subjectNum.push(v.subjectNum)
        });
          this.downloadName = '审核资料.xls';
          this.downloadPath = '/inspectReview/subject/'+this.projectNo+'/downloadPicsBySubjectNums?subjectNums='+subjectNum.join(",");
        
        }
        else{
            this.$alert("请选择要下载的项！", "提示", {
              type: "warning",
              confirmButtonText: "确定",
              callback: () => {}
            });
        }
    },

    //下载整个表格
    downAll() {
      this.downloadName = '审核资料.xls';
      this.downloadPath = '/inspectReview/subject/'+this.projectNo;
      // downReview(this.projectNo).then(res => {
      //   downFile(res, "审核资料.xls");
      // });
    },
    //table选项改变
    select(val) {
      this.selections = val;
    },
    //下载图片
    downPics(type) {
      //this.loadingDownload = true;
      if (type == 0) {
        //下载全部图片
        this.downloadName = 'allFiles.zip';
        this.downloadPath = '/inspectReview/subject/'+this.projectNo+'/downloadAllPics';
        // downloadAllPics(this.projectNo)
        //   .then(res => {
        //     downFile(res, "allFiles.zip");
        //     this.loadingDownload = false;
        //   })
        //   .catch(error => {
        //     this.loadingDownload = false;
        //   });
      } else {
        //下载全部被标记的图片
        this.downloadName = 'markedFiles.zip';
        this.downloadPath = '/inspectReview/subject/'+this.projectNo+'/downloadFlagPics';

        // downloadFlagPics(this.projectNo)
        //   .then(res => {
        //     downFile(res, "markedFiles.zip");
        //     this.loadingDownload = false;
        //   })
        //   .catch(error => {
        //     this.loadingDownload = false;
        //   });
      }
      // if(this.selections.length==0){
      // 	this.$alert('请选择需要下载图片的项！','提示',{
      //         type:'warning',
      //         confirmButtonText: '确定',
      //         callback: () => {
      //         }
      //     })
      //     return false
      // }
      // let ids=[]
      // this.selections.forEach(v=>{
      // 	ids.push(v.num)
      // })
      // if(type==0){
      // 	downReviewPics(ids).then(res=>{
      // 		downFile(res,'allFiles.zip')
      // 	})
      // }else{
      // 	downReviewFlagPics(ids).then(res=>{
      // 		downFile(res,'markedFiles.zip')
      // 	})
      // }
    },
    cellClass({ row, column, rowIndex, columnIndex }) {
      let index = [];
      this.webSites.forEach((v, i) => {
        if (row.websiteInfos.length) {
          row.websiteInfos.forEach((v2, i2) => {
            if (v.id == v2.websiteCode && v2.status == 1) {
              index.push(i + 3);
            }else{
            }
          });
        }
      });
      if (index.indexOf(columnIndex) >-1) return "danger";
      else return "";
    },
  
    cellDb(row, column, cell, event) {
      console.log(column);
    },
    //重置
    resetForm() {
      this.$refs["ruleForm"].resetFields();
      this.pageChange(1);
    },
    goLink(address, e) {
      e.currentTarget.className = "under var isClick";
      window.open(address);
    },
    //模糊查询
    querySearch(queryString, cb) {
      // let options = {
      //   name: this.ruleForm.subjectName,
      //   projectNo: this.$route.params.projectNo
      // };
      // searchCheck(options).then(res => {
      //   res.result.forEach(item => {
      //     this.restaurants.push({ value: item });
      //   });
      // });
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;
      cb(results);
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(val) {
      this.ruleForm.websiteName = val;
      this.pageChange(1);
    },
    handleClear() {
      this.ruleForm.websiteName = "";
      this.pageChange(1);
    },
    getTableHeight() {
      this.getHeight = window.innerHeight - 440;
    },
    ...mapActions("netCheck", ["getReviewList", "getWebSiteList"])
  },
  mounted() {
    let options = {
      name: this.ruleForm.subjectName,
      projectNo: this.$route.params.projectNo
    };
     for(var i=0;i<50;i++){
    	this.searchValues.push({
    		searchValue:''
    	})
    }
    searchCheck(options).then(res => {
      res.result.forEach(item => {
        this.restaurants.push({ value: item });
      });
    });
    this.getTableHeight();
    this.loading = true;
    this.getWebSiteList()
      .then(() => {
        this.pageChange(1);
      })
      .catch(() => {
        this.loading = false;
      });
    // this.list.forEach((v)=>{
    // 	v.name=conentFormat(v.name)
    // })
  },
  created() {
    this.projectNo = this.$route.params.projectNo;
    window.addEventListener("resize", this.getTableHeight);
    this.getTableHeight();
  },
  destroyed() {
    window.removeEventListener("resize", this.getTableHeight);
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.el-table td.danger {
  background: #ffc;
  padding: 0;
  margin: 0;
  border: 1px solid #ec395a;
}
.el-table td.tooll {
  padding: 0;
  margin: 0;
}
	.el-table td.tooll{
		padding: 0;
		margin: 0;
	}
.myselect_class{
	/*display: none !important;*/
	position: absolute;
	right: -10px;
	padding: 0px !important;
	height: 30px !important;
	line-height: 30px !important;
	top: 50%;
	margin-top: -15px;
	>div{
		width: 50px !important;
		height: 30px !important;
		line-height: 30px !important;
	}
	.el-input__suffix{
		right: 5px;
	}
	.el-input__inner{
		width: 50px !important;
		height: 0px !important;
		padding: 0px !important;
		text-indent: -99999px;
		background: transparent;
		border: none;
	}
	.el-input.is-focus .el-input__inner, .el-input__inner:focus{
		border-color: transparent !important;
	}
	
}
.el-table .cell{
    padding-left: 0px!important;
    padding-right: 0px!important;
  }
 .mycheckTable th > .cell{
 	padding-right: 20px !important;
 	padding-left: 16px !important;
 }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/assets/css/varibles.scss";
.down {
  margin: 40px 0 10px;
  overflow: hidden;
  float: right;
}

.down button {
  margin: 0 0 0 20px;
}
a.under.isClick {
  color: #bdbdbd !important; /*连接访问的颜色变化*/
}
.el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell{
    padding-left: 0px!important;
  }
  .el-table .cell, .el-table th div{
    padding-right: 0px!important;
  }
  .el-table .cell{
    padding-left: 20px!important;
    padding-right: px!important;
  }
</style>
