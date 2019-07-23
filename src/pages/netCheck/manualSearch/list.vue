<template>
  <div>
    <div class="box">
      <p class="line"></p>
      <p class="title">人工检索内部截图库</p>
    </div>

    <div class="search" style="margin-top: 26px;">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="form" inline>
        <!-- <el-form-item label="站点名称">
	                    <el-input v-model="ruleForm.websiteName"></el-input>
        </el-form-item>-->
        <el-form-item label="核查主体">
          <el-input v-model="ruleForm.subjectName" style="width: 350px"></el-input>
        </el-form-item>
        <div class="rightBox">
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="danger" @click="resetForm">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="bg shadow" style="height: 42px;margin-bottom: 15px;">
      <el-tabs class="tabText" v-model="activeName" @tab-click="pageChange(1)">
        <el-tab-pane
          v-for="item,index in webSites2"
          :label="item.websiteName"
          :name="item.websiteName"
        >
          <span
            class="dbl"
            slot="label"
            :class="{'has':item.isClick}"
            @dblclick="gotoLink(item,index)"
          >{{item.websiteName}}</span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-table v-loading="loading" :data="list" border :max-height="getHeight">
      <el-table-column align="center" label="序号" width="75">
        <template slot-scope="scope">
          {{scope.$index+1+pageSize*(page-1)}}
          <input type="hidden" :value="scope.row.filePath">
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        prop="subjectName"
        :label="id=='26'?'个人姓名':'当事人'"
        width="120px"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        prop="companyName"
        label="单位名称"
        v-if="id==26"
      >
        <template
          slot-scope="scope"
        >{{scope.row.companyName==''||!scope.row.companyName?'-':scope.row.companyName}}</template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        prop="subjectCode"
        label="身份证号"
        v-else
      >
        <template
          slot-scope="scope"
        >{{scope.row.subjectCode==''||!scope.row.subjectCode?'-':scope.row.subjectCode}}</template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        prop="corporate"
        label="法人代表"
        width="120px"
      >
        <template
          slot-scope="scope"
        >{{scope.row.corporate==''||!scope.row.corporate?'-':scope.row.corporate}}</template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="punishName" label="处罚机关"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        prop="punishTime"
        label="处罚日期"
        width="160px"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="fileNo" label="文号"></el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <div class="btn-box">
            <div class="btn" @click="viewDetails(scope.row)">查看</div>
            <div class="btn" @click="handleEdit(scope.row)"  v-if="isShowOperating">编辑</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="编辑爬取内容"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-row :gutter="0">
        <el-col :span="22" :offset="1">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item :label="id=='26'?'个人姓名':'当事人'">
              <el-input v-model="form.subjectName"></el-input>
            </el-form-item>
            <el-form-item :label="id=='26'?'单位名称':'身份证号'">
              <template v-if="id == '26'">
                <el-input v-model="form.companyName"></el-input>
              </template>
              <template v-else>
                <el-input v-model="form.subjectCode"></el-input>
              </template>
            </el-form-item>
            <el-form-item label="法人代表">
              <el-input v-model="form.corporate"></el-input>
            </el-form-item>
            <el-form-item label="处罚机关">
              <el-input v-model="form.punishName"></el-input>
            </el-form-item>
            <el-form-item label="处罚日期">
              <el-input v-model="form.punishTime"></el-input>
            </el-form-item>
            <el-form-item label="文号">
              <el-input v-model="form.fileNo"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">提 交</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <pageination
      @pageChange="pageChange"
      @handleSizeChange="handleSizeChange"
      :page-total="pageTotal"
      :total="total"
      :page="page"
      :pageSize="pageSize"
    ></pageination>
    <!--<pageination @pageChange="pageChange" :total="total" :page="page" :pageSize="pageSize"></pageination>-->
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { getManualCate, getManualById, dataEditor } from "@/api/project";
export default {
  computed: {
    isShowOperating(){
      let status = true;
      if(this.matterStatus == 2){ //事项已完成
        status = false;
      }
      return status;
    },
    id() {
      //当前网址的id
      let id = "";
      this.webSites.forEach((v, i) => {
        if (v.websiteName == this.activeName) id = v.id;
      });
      return id;
    },
    
    ...mapState("netCheck", ["manualList"])
  },
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        subjectName: ""
        //websiteName:''
      }, //表单
      page: 1,
      pageSize: 20,
      total: 0,
      pageTotal: 0,
      list: [], //表格数据
      webSites: [],
      activeName: "",
      loading: false, //表格请求数据的加载
      view: false,
      webSites2: [],
      getHeight: 0,
      form: {
        companyName: "",
        corporate: "",
        fileNo: "",
        id: "",
        punishName: "",
        punishTime: "",
        subjectCode: "",
        subjectName: ""
      },
      matterStatus: this.$route.query.status
    };
  },
  methods: {
	handleSubmit(){
	  dataEditor(this.form).then((res)=>{
		this.pageChange(this.page)
		this.dialogVisible = false;
	  })
	},
    handleEdit(row) {
      let formArr = [
        "companyName",
        "corporate",
        "fileNo",
        "id",
        "punishName",
        "punishTime",
        "subjectCode",
        "subjectName"
	  ];
	  let formData = {};
      formArr.forEach(v=>{
		formData[v] = row[v]
	  })
	  this.form = formData;
	  this.dialogVisible = true;
    },
    getTableHeight() {
      this.getHeight = window.innerHeight - 360;
    },
    //请求列表
    pageChange(index) {
      sessionStorage.setItem("activeName", this.activeName);
      this.webSites2 = JSON.parse(JSON.stringify(this.webSites));
      this.page = index;
      let options = {
        pagenum: this.page,
        pagesize: this.pageSize,
        subjectName: this.ruleForm.subjectName,
        websiteName: this.activeName
      };
      this.loading = true;
      this.getManualList(options)
        .then(() => {
          //console.log(options,'tab切换')

          this.total = Number(this.manualList.total);
          this.pageTotal = Number(this.manualList.pages);
          this.list = this.manualList.records;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageChange(1);
    },
    //查看
    viewDetails(row) {
      this.$router.push({
        path: `/manualSearch/details/${row.id}`,
        query: {
          subjectName: this.ruleForm.subjectName,
          websiteName: this.activeName
        }
      });
    },
    //重置
    resetForm() {
      this.ruleForm = {
        subjectName: ""
      };
      this.pageChange(1);
    },
    search() {
      if (this.ruleForm.subjectName.trim().length == 0) {
        this.pageChange(1);
        return false;
      }
      let options = {
        pagenum: 1,
        pagesize: this.pageSize,
        subjectName: this.ruleForm.subjectName,
        websiteName: this.webSites[0].websiteName
      };
      this.loading = true;
      let list1 = [],
        list2 = [],
        total1 = 1,
        total2 = 1;
      this.getManualList(options)
        .then(() => {
          //console.log(options,'search')
          options.websiteName = this.webSites2[1].websiteName;
          total1 = Number(this.manualList.total);
          // alert(total1)
          list1 = this.manualList.records;
          // console.log(list1,'list1')
          this.getManualList(options)
            .then(() => {
              //console.log(options,)
              this.loading = false;
              total2 = Number(this.manualList.total);
              list2 = this.manualList.records;
              if (total1 == 1 && total2 == 1) {
                // this.$alert('该主体下没有内容！', '提示', {
                // 	type: 'warning',
                // 	confirmButtonText: '确定',
                // 	callback: () => {

                // 	}
                // })
                this.list = [];
                this.total = 0;
                this.webSites2 = [];
              } else {
                if (total1 == 1) {
                  this.list = list1;
                  this.total = total1;
                  // this.webSites2 = [this.webSites[1]]
                  this.webSites2 = JSON.parse(JSON.stringify(this.webSites));
                } else {
                  this.list = list1;
                  this.total = total1;
                  // if (total2 ==1 ) this.webSites2 = [this.webSites[0]]
                  this.webSites2 = JSON.parse(JSON.stringify(this.webSites));
                }
                this.activeName = this.webSites2[0].websiteName;
              }
            })
            .catch(() => {
              this.loading = false;
            });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    gotoLink(item, i) {
      //console.log(item,'gotolink')
      item.isClick = true;
      this.$forceUpdate();
      // window.setTimeout(() => {
      // 	window.open(item.websiteAddress)
      // }, 300)
    },
    ...mapActions("netCheck", ["getManualList"])
  },
  mounted() {
    this.getTableHeight();
    getManualCate().then(res => {
      //console.log(res,'getManualCate')
      if (res.code == 0) {
        res.result.forEach(v => {
          v.isClick = false;
        });
        this.webSites = res.result;
        // if (!this.$route.params.websiteName) this.activeName = this.webSites[0].websiteName
        // else this.activeName = this.$route.params.websiteName
        this.activeName = sessionStorage.getItem("activeName")
          ? sessionStorage.getItem("activeName")
          : this.webSites[0].websiteName;
        this.pageChange(1);
      }
    });
  },
  created() {
    window.addEventListener("resize", this.getTableHeight);
    this.getTableHeight();
  },
  destroyed() {
    window.removeEventListener("resize", this.getTableHeight);
  }
};
</script>
<style>
.el-tooltip__popper.is-dark {
  max-width: 60% !important;
  line-height: 180%;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/assets/css/varibles.scss";
.box {
  overflow: hidden;
  > div {
    float: left;
  }
  .fr {
    float: right;
  }
  .title {
    float: left;
    color: $txt-color;
    font-size: 16px;
    line-height: 28px;
    position: relative;
    font-weight: 600;
  }

  .line {
    float: left;
    content: "";
    width: 5px;
    height: 28px;
    background-color: $global-color;
    margin-right: 8px;
  }
}
</style>
