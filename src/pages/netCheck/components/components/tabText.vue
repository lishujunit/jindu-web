<template>
  <div>
    <div class="search">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="form" inline>
        <!-- <el-form-item label="站点名称">
                    <el-input v-model="ruleForm.websiteName"></el-input>
        </el-form-item>-->
        <el-form-item label="核查主体">
          <el-autocomplete
            style="width: 350px"
            class="inline-input"
            @keyup.enter.native="handleSelect"
            clearable
            @clear="handleClear"
            v-model="ruleForm.subjectName"
            @select="handleSelect"
            :fetch-suggestions="querySearch"
          ></el-autocomplete>
          <!--<el-input v-model="ruleForm.subjectName" style="width: 350px"></el-input>-->
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            @change="pageChange(1)"
            v-model="ruleForm.status"
            placeholder="全部"
            class="state"
          >
            <el-option label="全部" value></el-option>
            <el-option v-for="item in status" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <div class="rightBox">
          <el-button type="primary" @click="pageChange(1)">搜索</el-button>
          <el-button type="danger" @click="resetForm">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="bg tab-box">
      <el-button type="primary" class="fr" @click="mulCheck" v-if="isShowOperating">提交审核</el-button>
      <el-tabs class="tabText" v-model="activeId" @tab-click="changeTab">
        <el-tab-pane
          v-for="item,index in webSites"
          :label="item.websiteName"
          :name="item.id"
          :key="item.id"
        >
          <span
            class="dbl"
            :class="{'has':item.isClick}"
            slot="label"
            @dblclick="gotoLink(item,index)"
          >{{item.websiteName}}</span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-table
      ref="table"
      v-loading="loading"
      :max-height="getHeight"
      :data="list"
      border
      @selection-change="select"
      :row-class-name="rowClass"
    >
      <el-table-column align="center" type="selection" width="45"></el-table-column>
      <el-table-column align="center" label="序号" width="70" prop="subjectNo"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        prop="subjectName"
        :label="type<3?'核查主体':(type==3?'个人姓名':'当事人')"
      >
        <template
          slot-scope="scope"
        >{{scope.row.subjectName==''||!scope.row.subjectName?'-':scope.row.subjectName}}</template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        prop="subjectCode"
        :label="type==0?'身份证号/组织机构代码':'身份证号'"
        v-if="type==0||type==4"
      >
        <template
          slot-scope="scope"
        >{{scope.row.subjectCode==''||!scope.row.subjectCode?'-':scope.row.subjectCode}}</template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        prop="subjectShortname"
        label="核查主体简称"
        v-if="type==1"
      >
        <template
          slot-scope="scope"
        >{{scope.row.subjectShortname==''||!scope.row.subjectShortname?'-':scope.row.subjectShortname}}</template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        prop="companyName"
        label="单位名称"
        v-if="type==3"
      >
        <template
          slot-scope="scope"
        >{{scope.row.companyName==''||!scope.row.companyName?'-':scope.row.companyName}}</template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        prop="corporate"
        label="法人代表"
        v-if="type>2"
      >
        <template
          slot-scope="scope"
        >{{scope.row.corporate==''||!scope.row.corporate?'-':scope.row.corporate}}</template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        prop="punishName"
        label="处罚机关"
        v-if="type>2"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        prop="punishTime"
        width="180"
        label="处罚日期"
        v-if="type>2"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        prop="createTime"
        width="180"
        label="完成时间"
        v-if="type<3"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        prop="picNum"
        label="截图数量"
        width="100"
      >
        <template slot-scope="scope">
          <!-- <div class="var under" @click="view(scope.row)" v-if="scope.row.status!=4&&scope.row.picNum>0&&scope.row.status!=2">{{scope.row.picNum}}</div>
          <div v-else>{{scope.row.picNum==0?'-':scope.row.picNum}}</div>-->

          <!-- @click="view(scope.row)"   scope.row.picNum>0 -->
          <div v-if="scope.row.status==2">-</div>
          <div v-if="scope.row.status==4">
            <template v-if="scope.row.picNum>0">
              <span>{{scope.row.picNum}}</span>
            </template>
            <template v-else>-</template>
          </div>
          <div v-if="scope.row.status!=2 && scope.row.status!=4">
            <template v-if="scope.row.picNum>0">
              <span @click="view(scope.row)" class="var under">{{scope.row.picNum}}</span>
            </template>
            <template v-else>-</template>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop label="状态" width="150">
        <template slot-scope="scope">
          <template v-if="scope.row.status=='05'">
            <el-popover placement="top" width="330" trigger="hover" popper-class="popover">
              <div class="reason">
                <div class="title">不合格</div>
                <span>{{scope.row.remark}}</span>
                <div class="time">{{scope.row.reviewer}}&nbsp;&nbsp;{{scope.row.reviewTime}}</div>
              </div>
              <div class="danger" slot="reference">
                不合格
                <i style="font-size: 14px;" class="el-icon-info"></i>
              </div>
            </el-popover>
          </template>
          <template v-else>
            <div v-for="item in status" v-if="scope.row.status==item.value">{{item.name}}</div>
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <div class="btn-box">
            <div
              v-if="scope.row.status!=4&&scope.row.picNum>0&&scope.row.status!=2"
              class="btn"
              @click="view(scope.row)"
            >查看</div>
            <!-- <div class="btn" @click="viewFile(scope.row)" v-if="scope.row.status!=4&&type==1">查看正文清单</div> -->
            <div class="btn n_btn" v-if="scope.row.status!='01'&&(type==1 || scope.row.websiteId == '25')">
              <template v-if="scope.row.status == '02' && (scope.row.websiteId == '55' || scope.row.websiteId == '25')"></template>
              <template v-else>
                <span v-if="scope.row.excelFilePath == ''" style="color:#999">查看正文清单</span>
                <span v-else @click="viewFile(scope.row)" style="text-decoration: underline;">查看正文清单</span>
              </template>
            </div>
            <template v-if="scope.row.status==1">
              <div class="btn" @click="reCrawl(scope.row)" v-if="isShowOperating">重新爬取</div>
              <!-- <div class="btn" @click="view(scope.row)">查看</div> -->
            </template>
            <div
              class="btn"
              v-if="(scope.row.status==3||scope.row.status==5) && isShowOperating"
              @click="submitCheck(scope.row.batchNo+'-'+scope.row.websiteId+'-'+scope.row.subjectNo)"
            >提交审核</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pageination
      @pageChange="pageChange"
      @handleSizeChange="handleSizeChange"
      :page-total="pageTotal"
      :total="total"
      :page="page"
      :pageSize="pageSize"
    ></pageination>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import {
  getWebSiteByCrawl,
  recollect,
  reviewCheck,
  searchCheck,
  getMatterStatus
} from "@/api/project";
import { previewFile } from "@/utils/api";
export default {
  watch: {
    list() {
      // console.log(this.$refs.table)
      // this.$refs.table.$children.forEach((v,i)=>{
      // 	console.log(v)
      // })
    }
  },
  computed: {
    isShowOperating(){
      let status = getMatterStatus()
      return status
    },
    ...mapState("netCheck", ["checkList"])
  },
  data() {
    return {
      restaurants: [],
      status: [
        { name: "未校验", value: "00" },
        { name: "无法校验", value: "01" },
        { name: "重新爬取", value: "02" },
        { name: "已校验", value: "03" },
        { name: "已提交", value: "04" },
        { name: "不合格", value: "05" }
      ],
      projectNo: "",
      /*表单*/
      ruleForm: {
        status: "",
        subjectName: ""
        //websiteName: ''
      },
      list: [], //数据
      page: 1,
      pageSize: 20,
      total: 0,
      pageTotal: 0,
      activeId: "",
      type: 1, //当前table 的类型
      loading: false,
      selections: [],
      getHeight: 0,
      webSites: [],// 网站列表
      matterStatus: this.$route.query.status
    };
  },
  methods: {
    //请求列表
    pageChange(index) {
      this.page = index;
      let options = {
        pagenum: this.page,
        pagesize: this.pageSize,
        projectNo: this.projectNo,
        websiteId: sessionStorage.getItem("activeId")
          ? sessionStorage.getItem("activeId")
          : this.activeId,
        status: this.ruleForm.status,
        subjectName: this.ruleForm.subjectName,
        websiteResultType: "0" + this.type
      };
      this.loading = true;
      this.getCheckList(options)
        .then(() => {
          this.loading = false;
          this.list = [];
          setTimeout(res => {
            this.list = this.checkList.records;
            this.total = Number(this.checkList.total);
            this.pageTotal = Number(this.checkList.pages);
          }, 0);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      let vm = this;
      document.body.scrollTop = 0;
      vm.pageSize = val;
      vm.pageChange(1);
    },
    //重新爬取
    reCrawl(v) {
      recollect({
        projectId: this.projectNo,
        subjectWebsiteNum: v.batchNo + "-" + v.websiteId + "-" + v.subjectNo
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "操作成功！"
          });
          this.pageChange(1);
        }
      });
    },
    view(row) {
      let options = {
        picType: row.textPicNum > 0 ? "01" : "00",
        status: this.ruleForm.status,
        subjectName: this.ruleForm.subjectName,
        websiteId: this.activeId,
        matterStatus: this.$route.query.matterStatus,
        parentfullPath: this.$route.fullPath
      };
      this.$router.push({
        path: `viewImage/${row.batchNo +
          "-" +
          row.websiteId +
          "-" +
          row.subjectNo}`,
        query: options,
      });
    },
    //切换网址
    changeTab() {
      sessionStorage.setItem("activeId", this.activeId);
      this.webSites.forEach((v, i) => {
        if (v.id == this.activeId) {
          this.type = Number(v.resultType);
          this.pageChange(1);
          return;
        }
      });
    },
    //重置表单
    resetForm() {
      this.ruleForm = {
        status: "",
        subjectName: ""
      };
      this.pageChange(1);
    },
    //多选
    mulCheck() {
      let i = [];
      if (this.selections.length != 0) {
        this.selections.forEach(v => {
          if (v.status == "03" || v.status == "05")
            i.push(v.batchNo + "-" + v.websiteId + "-" + v.subjectNo);
        });
        if (i.length == 0) {
          this.$alert("仅可以提交已检验或不合格状态下的选项！", "提示", {
            type: "warning",
            confirmButtonText: "确定",
            callback: () => {}
          });
          return false;
        }
        this.submitCheck(i.join(","));
      } else {
        this.$alert("请选择要提交审核的项！", "提示", {
          type: "warning",
          confirmButtonText: "确定",
          callback: () => {}
        });
      }
      // this.selections.forEach(v => {
      // 	if (v.status =='03') i.push(v.batchNo + '-' + v.websiteId + '-' + v.subjectNo)
      // })
      // if (i.length == 0) {
      // 	this.$alert('请选择要提交审核的项！', '提示', {
      // 		type: 'warning',
      // 		confirmButtonText: '确定',
      // 		callback: () => {}
      // 	})
      // 	return false
      // }
      // this.submitCheck(i.join(','))
    },
    //table选项改变
    select(val) {
      this.selections = val;
    },
    //重新爬取
    // reCrawl(v) {
    // 	recollect({ projectId: this.projectNo, subjectWebsiteNum: v.batchNo + '-' + v.websiteId + '-' + v.subjectNo }).then(res => {
    // 		if (res.code == 0) {
    // 			this.$message({
    // 				type: 'success',
    // 				message: '操作成功！'
    // 			})
    // 			this.pageChange(1)
    // 		}
    // 	})
    // },

    //提交审核
    submitCheck(v) {
      this.$confirm("确认提交审核?", "提示", {
        confirmButtonText: "提交",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          reviewCheck(v).then(res => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: "提交成功！"
              });
              this.pageChange(this.page);
            }
          });
        })
        .catch(() => {});
    },
    rowClass({ row, rowIndex }) {
      if (row.status == 5) {return "warn";}
      else{
        if(row.status == "00" && row.exceptionReason != ""){
          return "warn1"
        }else{
          return "";
        }
      }
    },

    gotoLink(item, i) {
      item.isClick = true;
      //this.webSites.splice(i,1,item)
      this.$forceUpdate();
      window.setTimeout(() => {
        if (this.type >= 3) {
          window.open(
            this.$router.resolve({
              path: "/manualSearch/list?status="+this.$route.query.status,
              params: { id: item.websiteName, parentPath: this.$route.path},
              from: this.$route.query.from,
              status: this.$route.query.status,
            }).href,
            "_blank"
          );
          // this.$router.push({ name: 'manualSearch', params: { id: item.websiteName, parentPath:this.$route.path } })
        } else window.open(item.websiteAddress);
      }, 300);
    },
    //预览文件
    viewFile(row) {
      //var title = row.excelFileName.splice('.')
      previewFile(row.excelFilePath);
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
      this.ruleForm.subjectName = val.value;
      console.log(val);
      this.pageChange(1);
    },
    handleClear() {
      this.ruleForm.subjectName = "";
      this.pageChange(1);
    },
    getTableHeight() {
      this.getHeight = window.innerHeight - 440;
    },
    ...mapActions("netCheck", ["getCheckList"])
  },
  mounted() {
    let options = {
      name: this.ruleForm.subjectName,
      projectNo: this.$route.params.projectNo
    };
    searchCheck(options).then(res => {
      res.result.forEach(item => {
        this.restaurants.push({ value: item });
      });
    });
    this.getTableHeight();
    getWebSiteByCrawl(this.projectNo).then(res => {
      if (res.code == 0) {
        res.result.forEach((v, i) => {
          let is = false;
          this.webSites.forEach((v2, i2) => {
            if (v.websiteName == v2.websiteName) is = true;
          });
          if (!is) {
            this.webSites.push(v);
          }
          this.webSites.forEach(v => {
            v.isClick = false;
          });
        });
        //this.webSites = res.result
        if (!this.$route.query.websiteId) {
          if (sessionStorage.getItem("activeId")) {
            let state = false;
            this.webSites.forEach(v => {
              if (v.id == sessionStorage.getItem("activeId")) {
                this.activeId = sessionStorage.getItem("activeId");
                state = true;
              }
            });
            if (state == false) {
              this.activeId = this.webSites[0].id;
            }
          } else {
            this.activeId = this.webSites[0].id;
          }
          // this.activeId = sessionStorage.getItem("activeId")
          //   ? sessionStorage.getItem("activeId")
          //   : this.webSites[0].id;
        } else this.activeId = this.$route.query.websiteId;
        this.changeTab();
      }
    });
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
@import "@/assets/css/varibles.scss";

// .has {
// 		color: #BDBDBF;
// 		border-color: #BDBDBF;
// 	}
.el-table tr.warn1{
  .cell{
    color: #c00;
  }
}
.el-table tr.warn {
  background: #ffc;
  position: relative;

  td {
    border-bottom-color: #ec395a;
    border-top: 1px solid #ec395a;

    &:first-child {
      border-left: 1px solid #ec395a;
    }

    &:last-child {
      border-right: 1px solid #ec395a;
    }
  }
}

.tab-box {
  margin-top: 20px;
  margin-bottom: 15px;
  height: 42px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);

  .tabText {
    margin-right: 160px;
    margin-top: 0;

    .el-tabs__header {
      margin: 0;
    }
  }

  .el-button--small {
    margin-top: 6px;
    margin-right: 20px;
  }
}

.reason {
  padding-bottom: 10px;
  word-wrap: break-word;
  > span {
    display: block;
    margin: 30px 40px 20px;
  }

  > .time {
    color: #62656c;
    text-align: right;
    font-size: 12px;
    padding-right: 16px;
  }

  > .title {
    position: relative;
    font-size: 16px;
    font-weight: 600;
    color: #424242;
    background: #ecf1f4;
    padding: 6px 28px;

    &::before {
      content: "";
      height: 16px;
      width: 4px;
      position: absolute;
      top: 50%;
      margin-top: -8px;
      left: 15px;
      background: $global-color;
    }
  }
}
.btn-box {
  .n_btn {
    text-decoration: none;
  }
}
</style>
