<!-- 该页面是三个访谈(管理层访谈、业务伙伴访谈和监管部门访谈)的公用“创建计划页面” -->

<template>
  <div class="manageInterviewContent">
    <el-row>
      <el-col :span="12">
        <el-row type="flex" justify="start">
          <upload
            class="operate m_r20"
            uploadType="interviewPlan"
            type="primary"
            accept=".xlsx, .xls"
            text="导入访谈计划"
            @uploadSuccess="uploadPlanSuccess"
            v-if="isShowOperating"
          ></upload>
          <el-button type="primary" @click="handleExport">导出访谈计划</el-button>
          <el-button type="text" class="btn-item" @click="handleDownload">下载访谈计划模板</el-button>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="end">
          <el-button type="primary" v-if="isShowOperating" @click="handleConfirm('confirmAll')">提交确认</el-button>
        </el-row>
      </el-col>
    </el-row>

    <el-row>
      <div class="table-box">
        <el-table
          ref="multipleTable"
          border
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          :max-height="tableHeight"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          :row-class-name="tableRowClassName"
        >
          <el-table-column align="center" type="selection" width="40"></el-table-column>
          <el-table-column align="center" prop="no" label="序号" width="50"></el-table-column>
          <slot name="header">表格头部</slot>
          <!-- 三个访谈公用的表头部分 -->
          <template v-if="$route.path.indexOf('regulatoryInterview') == -1">
            <!-- 不是监管部门访谈时才显示联系方式 -->
            <el-table-column
              align="center"
              prop="phone"
              label="联系方式"
              width="120"
              :show-overflow-tooltip="true"
            ></el-table-column>
          </template>
          <el-table-column
            align="center"
            prop="interviewTime"
            label="访谈时间"
            width="150"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="interviewAddress"
            label="访谈地点"
            width="300"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="visitingStaff"
            label="参访人员"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <template v-if="$route.path.indexOf('partnersInterview') == -1">
            <!-- 不是业务伙伴访谈时才显示备注 -->
            <el-table-column align="center" prop="remarks" label="备注" :show-overflow-tooltip="true"></el-table-column>
          </template>
          <el-table-column
            align="center"
            prop="outlineFilePath"
            label="访谈提纲"
            width="100"
            :show-overflow-tooltip="true"
          >
            <!-- createStatus——状态 0(待提交) 2(已提交) 3(合格) 4(不合格) -->
            <template slot-scope="scope">
              <template v-if="scope.row.createStatus == 2 || scope.row.createStatus == 3">
                <!-- 已提交(2)、合格(3) -->
                <template v-if="scope.row.outlineFilePath == ''">-</template>
                <!-- 如果访谈提纲文件路径为空显示‘-’，否则点击查看预览此文件 -->
                <template v-else>
                  <span
                    class="btn-item"
                    @click="handlePreview(scope.row.outlineFilePath, scope.row.outlineFileName)"
                  >查看</span>
                </template>
              </template>
              <template v-else>
                <!-- 待提交(0)、不合格(4) -->
                <template v-if="scope.row.outlineFilePath == ''">
                  <!-- 如果访谈提纲文件路径为空显示上传组件 -->
                  <upload
                    accept=".png, .bmp, .gif, .jpg, .jpeg, .doc, .docx, .xls, .xlsx, .pdf, .m4a"
                    uploadType="outline"
                    @uploadSuccess="uploadPlanSuccess"
                    v-if="isShowOperating"
                  >
                    <span class="btn-item" @click="handleUpload(scope.row, 'outline')">上传</span>
                  </upload>
                </template>
                <template v-else>
                  <!-- 如果访谈提纲文件路径不为空显示查看按钮和重传组件 -->
                  <span
                    class="btn-item"
                    @click="handlePreview(scope.row.outlineFilePath, scope.row.outlineFileName)"
                  >查看</span>
                  <upload
                    class="btn-item"
                    accept=".png, .bmp, .gif, .jpg, .jpeg, .doc, .docx, .xls, .xlsx, .pdf, .m4a"
                    uploadType="outline"
                    @uploadSuccess="uploadPlanSuccess"
                    v-if="isShowOperating"
                  >
                    <span class="btn-item" @click="handleUpload(scope.row, 'outline')">重传</span>
                  </upload>
                </template>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="createStatus"
            label="状态"
            width="80"
            :show-overflow-tooltip="true"
          >
            <!-- createStatus——状态 0(待提交) 2(已提交) 3(合格) 4(不合格) -->
            <template slot-scope="scope">
              <template v-if="scope.row.createStatus == 0">待提交</template>
              <template v-else-if="scope.row.createStatus == 2">已提交</template>
              <template v-else-if="scope.row.createStatus == 3">合格</template>
              <template v-else-if="scope.row.createStatus == 4">
                <el-popover placement="top" width="330" trigger="hover" popper-class="popover">
                  <div class="reason">
                    <div class="title">不合格</div>
                    <span>{{scope.row.nopassRemark}}</span>
                    <div
                      class="time"
                    >{{scope.row.nopassAuditName}}&nbsp;&nbsp;{{scope.row.nopassTime}}</div>
                  </div>
                  <div class="danger" slot="reference">
                    不合格
                    <i style="font-size: 14px;" class="el-icon-info"></i>
                  </div>
                </el-popover>
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" width="120" :show-overflow-tooltip="true">
            <template slot="header">操作</template>
            <!-- createStatus——状态 0(待提交) 2(已提交) 3(合格) 4(不合格) -->
            <template slot-scope="scope">
              <template v-if="scope.row.createStatus == 0">
                <span class="btn-item" v-if="isShowOperating" @click="handleDelete(scope.row.id)">删除</span>
                <span class="btn-item" v-if="isShowOperating" @click="handleConfirm(scope.row.id)">提交确认</span>
              </template>
              <template v-else-if="scope.row.createStatus == 2"></template>
              <template v-else-if="scope.row.createStatus == 3"></template>
              <template v-else-if="scope.row.createStatus == 4">
                <span class="btn-item" v-if="isShowOperating" @click="handleDelete(scope.row.id)">删除</span>
                <span class="btn-item" v-if="isShowOperating" @click="handleConfirm(scope.row.id)">提交确认</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
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
import axios from "axios";
import { previewFile } from "@/utils/api";
import upload from "@/components/upload";
import download from "@/components/download";
import { MessageBox } from "element-ui";
import {
  getInterviewPlanData,
  downloadTemplate,
  exportInterview,
  importPlan,
  uploadOutline,
  deleteInterview,
  confirmInterview,
  getUrlType,
  getWorkUnitId,
  getRoute
} from "@/api/manageInterview";
import { getMatterStatus } from "@/api/project";
import {mapMutations} from 'vuex';
export default {
  name: "createPlan",
  components: {
    upload,
    download
  },
  created(){
    this.tableHeight = window.innerHeight - (319 + 65);
    //getRoute(this.$route)
    this.pageSize = getRoute(this.$route);
  },
  mounted: function() {
    this.getUpdateInterviewPlanData();
    this.baseUrl = process.env.VUE_APP_BASEURL;
  },
  data() {
    return {
      loading: true,
      baseUrl: "", //服务器地址
      pageTotal: 0, //分页个数
      total: 0, //当前列表总条数
      page: 1, //当前分页
      pageSize: 20, //一页显示的数据条数
      tableData: [], //表格列表数据
      multipleSelection: [], //复选框选中的表格数据
      interviewId: "", //当前点击的访谈计划ID
      uploadType: "", //上传文件的类型(interviewPlan访谈计划，outline访谈提纲)
      downloadPath: "", //下载文件的地址
      downloadName: "", //下载文件名称
      tableHeight: 0, //减去页面头部高度和分页高度
      matterStatus: this.$route.query.status
    };
  },
  computed: {
    isShowOperating(){
      let status = getMatterStatus()
      return status
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      //为 Table 中的某一行添加 class
      if (row.createStatus === 4) {
        //为访谈计划状态为4(不合格)的添加 class
        return "warn";
      }
    },
    handleSizeChange(val) {
      //分页数据显示条数切换
      this.pageSize = val;
      this.interviewChangePageNum(val)
      this.pageChange(1);
    },
    pageChange(index) {
      //分页功能
      this.page = index;
      this.getUpdateInterviewPlanData();
    },
    handleSelectionChange(val) {
      //element-ui table表格复选框多选存值
      this.multipleSelection = val;
    },
    getUpdateInterviewPlanData(pageNum) {
      //获取/更新访谈计划列表数据
      getInterviewPlanData(this.page, this.pageSize).then(res => {
        if (res.code == 0) {
          if (res.result.records.length == 0 && this.page > 1) {
            //操作之后当前分页数据为空并且不是第一页时，请求上一页数据
            this.page--;
            this.getUpdateInterviewPlanData();
          } else {
            let data = res.result;
            this.tableData = data.records; //更新数据
            this.pageTotal = Number(data.pages); //分页个数
            this.total = Number(data.total); //总的数据条数
            this.pageSize = Number(data.size); //一页显示的数量
            this.page = Number(data.current); //处于第几分页
            this.loading = false;
          }
        } else {
          this.loading = false;
        }
      });
    },
    uploadPlanSuccess(resData, fileName, uploadType) {
      //上传文件组件上传成功后会调用此方法，并返回数据、上传的文件名和上传的类型。resData为服务器上文件路径如：/fdn/test.xls
      this.loading = true;
      if (uploadType == "interviewPlan") {
        // 导入访谈计划/创建计划
        importPlan(resData)
          .then(res => {
            //if (res.code == 0) {
            this.getUpdateInterviewPlanData();
            //}
          })
          .catch(() => {
            this.loading = false;
          });
      }
      if (uploadType == "outline") {
        //上传/重传访谈提纲
        uploadOutline({
          interviewId: this.interviewId,
          filePath: resData,
          fileName: fileName
        })
          .then(res => {
            //if (res.code == 0) {
            this.getUpdateInterviewPlanData();
            //}
          })
          .catch(res => {
            this.loading = false;
          });
      }
    },
    downloadDone() {
      //当有下载任务完成时会调用此方法，并将下载文件名称和下载文件地址设置为空，以便下次下载，当downloadPath改变并且不为空时，会下载文件
      this.downloadName = "";
      this.downloadPath = "";
    },
    download(url, fileName, type, interviewId) {
      //下载文件公用方法，根据传入的type定义不同的下载地址
      let downloadUrl = '';
      switch (
        type //判断下载的类型，Template（下载访谈计划模板），InterviewPlan（导出/下载访谈计划）
      ) {
        case "Template":
          downloadUrl += "/interview/" + getUrlType() + "/download";
          break;
        case "InterviewPlan":
          downloadUrl +=
            "/interview/" +
            getUrlType() +
            "/export?workUnitId=" +
            getWorkUnitId() +
            "&interviewIds=" +
            interviewId;
          break;
        default:
      }
      if (this.downloadPath != "") {
        //如果当前有下载任务给出提示
        console.log("正在下载请稍后...");
        return false;
      } else {
        //设置下载名称和下载地址，当downloadPath改变并且不为空时，会下载文件
        this.downloadName = fileName;
        this.downloadPath = downloadUrl;
      }
    },
    handleDownload() {
      //下载访谈计划模板
      const path = this.$route.path;
      const route = [
        { path: "manageInterview", fileName: "管理层访谈计划模板" },
        { path: "partnersInterview", fileName: "业务伙伴访谈计划模板" },
        { path: "regulatoryInterview", fileName: "监管部门访谈计划模板" }
      ];
      let fileName = "访谈计划模板";
      route.forEach(v => {
        if (path.indexOf(v.path) > -1) {
          fileName = v.fileName;
        }
      });
      this.download(this.baseUrl, fileName + ".xls", "Template");
    },
    handleExport() {
      //导出选中的访谈计划，.xls格式
      if (this.multipleSelection.length) {
        const path = this.$route.path;
        const route = [
          { path: "manageInterview", fileName: "管理层访谈计划" },
          { path: "partnersInterview", fileName: "业务伙伴访谈计划" },
          { path: "regulatoryInterview", fileName: "监管部门访谈计划" }
        ];
        let fileName = "访谈计划";
        route.forEach(v => {
          if (path.indexOf(v.path) > -1) {
            fileName = v.fileName;
          }
        });
        let interviewId = [];
        this.multipleSelection.forEach(v => {
          interviewId.push(v.id);
        });
        exportInterview({
          interviewIds: interviewId.toString()
        }).then(res => {
          this.download(
            this.baseUrl,
            fileName + ".xls",
            "InterviewPlan",
            interviewId.toString()
          );
        });
      } else {
        MessageBox.alert("请选择访谈计划", "提示", {
          type: "warning",
          confirmButtonText: "确定",
          callback: () => {}
        });
        return false;
      }
    },
    handleUpload(row, type) {
      //访谈提纲上传和重传
      //存储点击的访谈计划的id和上传的类型，因为本页面有多个上传并且用一个上传组件，
      //所以需要保存id和上传类型，以便上传成功后将后端返回文件路径发送到对应类型的API
      this.interviewId = row.id;
      this.uploadType = type;
    },
    handleDelete(interviewId) {
      //根据id删除访谈计划
      MessageBox.alert("是否要删除？", "提示", {
        type: "warning",
        confirmButtonText: "确定",
        callback: action => {
          if (action === "confirm") {
            this.loading = true;
            deleteInterview(interviewId, "create")
              .then(res => {
                //if (res.code == 0) {
                this.getUpdateInterviewPlanData();
                //}
              })
              .catch(res => {
                this.loading = false;
              });
          }
        }
      });
    },
    handleConfirm(interviewId) {
      //提交确认（单个和批量提交）
      if (interviewId === "confirmAll") {
        //批量提交：如果传入的参数为'confirmAll'，处理选中的数据
        if (this.multipleSelection.length) {
          //如果有选中的数据
          interviewId = [];
          this.multipleSelection.forEach(v => {
            //筛选出待提交和不合格的项
            if (v.createStatus === 0 || v.createStatus === 4) {
              //0待提交，4不合格
              interviewId.push(v.id);
            }
          });
          if (interviewId.length == 0) {
            MessageBox.alert("仅可以提交待提交或不合格状态下的选项！", "提示", {
              type: "warning",
              confirmButtonText: "确定",
              callback: () => {}
            });
            return false;
          }
        } else {
          //如果没有选中任何数据则给出提示
          MessageBox.alert("请选择访谈计划", "提示", {
            type: "warning",
            confirmButtonText: "确定",
            callback: () => {}
          });
          return false;
        }
      }
      this.loading = true;
      confirmInterview(interviewId)
        .then(res => {
          //if (res.code == 0) {
          this.getUpdateInterviewPlanData();
          //}
        })
        .catch(res => {
          this.loading = false;
        });
    },
    handlePreview(filePath, title) {
      //预览文件
      previewFile(filePath, title);
    },
    ...mapMutations('interview', ['interviewChangePageNum'])
  }
};
</script>
