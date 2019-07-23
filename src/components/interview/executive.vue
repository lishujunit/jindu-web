<template>
  <div class="wrap-content manageInterviewContent">
    <el-row>
      <div class="table-box tables">
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
          <el-table-column align="center" prop="no" label="序号" width="50"></el-table-column>
          <slot name="header">表格头部</slot>
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
            <el-table-column
              align="center"
              prop="remarks"
              label="备注"
              :show-overflow-tooltip="true"
            ></el-table-column>
          </template>
          <el-table-column
            align="center"
            prop="outlineFilePath"
            label="访谈提纲"
            width="100"
            :show-overflow-tooltip="true"
          >
            <template slot="header">访谈提纲</template>
            <template slot-scope="scope">
              <template v-if="scope.row.outlineFilePath">
                <span
                  class="btn-item"
                  @click="handlePreview(scope.row.outlineFilePath, scope.row.outlineFileName)"
                >查看</span>
              </template>
              <template v-else>-</template>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="records" label="访谈笔录" width="200">
            <template slot="header">访谈笔录</template>
            <!-- executeStatus——状态 0(待审核) 3(已提交) 4(合格) 5(不合格) -->
            <template slot-scope="scope">
              <template v-if="scope.row.executeStatus == 0 || scope.row.executeStatus == 5">
                <!-- 待审核、不合格 -->
                <template v-if="scope.row.records.length">
                  <template v-for="file in scope.row.records">
                    <el-tag class="fileItem">
                      <span
                        :title="file.fileName"
                        class="btn-item fileName"
                        @click="handlePreview(file.filePath, file.fileName)"
                      >{{file.fileName}}</span>
                      <i class="el-icon-close" @click="handleDeleteFile(file.id)"></i>
                    </el-tag>
                  </template>
                  <upload
                    accept=".png, .bmp, .gif, .jpg, .jpeg, .doc, .docx, .xls, .xlsx, .pdf, .m4a"
                    uploadType="records"
                    @uploadSuccess="uploadPlanSuccess"
                    v-if="isShowOperating"
                  >
                    <span class="upload-btn" @click="handleUpload(scope.row, 'records')">继续导入</span>
                  </upload>
                </template>
                <template v-else>
                  <upload
                    accept=".png, .bmp, .gif, .jpg, .jpeg, .doc, .docx, .xls, .xlsx, .pdf, .m4a"
                    uploadType="records"
                    @uploadSuccess="uploadPlanSuccess"
                    v-if="isShowOperating"
                  >
                    <span class="upload-btn" @click="handleUpload(scope.row, 'records')">导入</span>
                  </upload>
                </template>
              </template>
              <template v-else>
                <!-- 已提交 3、合格 4 -->
                <template v-if="scope.row.records.length">
                  <template v-for="file in scope.row.records">
                    <el-tag class="fileItem">
                      <span
                        :title="file.fileName"
                        class="btn-item fileName"
                        @click="handlePreview(file.filePath, file.fileName)"
                      >{{file.fileName}}</span>
                    </el-tag>
                  </template>
                </template>
                <template v-else>-</template>
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="supports" label="支持文件" width="200">
            <template slot="header">支持文件</template>
            <!-- executeStatus——状态 0(待审核) 3(已提交) 4(合格) 5(不合格) -->
            <template slot-scope="scope">
              <template v-if="scope.row.executeStatus == 0 || scope.row.executeStatus == 5">
                <!-- 待审核、不合格 -->
                <template v-if="scope.row.supports.length">
                  <template v-for="file in scope.row.supports">
                    <el-tag class="fileItem">
                      <span
                        :title="file.fileName"
                        class="btn-item fileName"
                        @click="handlePreview(file.filePath, file.fileName)"
                      >{{file.fileName}}</span>
                      <i class="el-icon-close" @click="handleDeleteFile(file.id)"></i>
                    </el-tag>
                  </template>
                  <upload
                    accept=".png, .bmp, .gif, .jpg, .jpeg, .doc, .docx, .xls, .xlsx, .pdf, .m4a"
                    uploadType="supports"
                    @uploadSuccess="uploadPlanSuccess"
                    v-if="isShowOperating"
                  >
                    <span class="upload-btn" @click="handleUpload(scope.row, 'supports')">继续导入</span>
                  </upload>
                </template>
                <template v-else>
                  <upload
                    accept=".png, .bmp, .gif, .jpg, .jpeg, .doc, .docx, .xls, .xlsx, .pdf, .m4a"
                    uploadType="supports"
                    @uploadSuccess="uploadPlanSuccess"
                    v-if="isShowOperating"
                  >
                    <span class="upload-btn" @click="handleUpload(scope.row, 'supports')">导入</span>
                  </upload>
                </template>
              </template>
              <template v-else>
                <!-- 已提交 3、合格 4 -->
                <template v-if="scope.row.supports.length">
                  <template v-for="file in scope.row.supports">
                    <el-tag class="fileItem">
                      <span
                        :title="file.fileName"
                        class="btn-item fileName"
                        @click="handlePreview(file.filePath, file.fileName)"
                      >{{file.fileName}}</span>
                    </el-tag>
                  </template>
                </template>
                <template v-else>-</template>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="executeStatus"
            label="状态"
            width="190"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope" slot="header">
              <!-- executeStatus——状态 0(待审核) 3(已提交) 4(合格) 5(不合格) -->
              <div class="check-title">状态</div>
              <!-- 根据状态筛选 -->
              <el-select
                class="check-status"
                v-model="value"
                size="mini"
                @change="statusChange"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
            <template slot-scope="scope">
              <template v-if="scope.row.executeStatus == 0">待审核</template>
              <template v-else-if="scope.row.executeStatus == 3">已提交</template>
              <template v-else-if="scope.row.executeStatus == 4">合格</template>
              <template v-else-if="scope.row.executeStatus == 5">
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
            <!-- executeStatus——状态 0(待审核) 3(已提交) 4(合格) 5(不合格) -->
            <template slot="header">操作</template>
            <template slot-scope="scope">
              <template v-if="scope.row.executeStatus == 3 || scope.row.executeStatus == 4"></template>
              <template v-else>
                <span class="btn-item" v-if="isShowOperating" @click="handleSubmit(scope.row.id)">提交审核</span>
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
  </div>
</template>

<script>
import { previewFile } from "@/utils/api";
import { MessageBox } from "element-ui";
import upload from "@/components/upload";
import {
  getAllExecute,
  submitExcute,
  uploadVisiting,
  uploadSupportFiles,
  deleteFile
} from "@/api/manageInterview";
import { getMatterStatus } from "@/api/project";
export default {
  name: "executiveInterview",
  components: {
    upload
  },
  created(){
    this.tableHeight = window.innerHeight - (319 + 65);
  },
  mounted: function() {
    this.getAllExecuteData();
    this.baseUrl = process.env.VUE_APP_BASEURL;
    this.uploadAction = process.env.VUE_APP_UPLOAD;
  },
  data() {
    return {
      tableData: [],
      loading: false,
      pageTotal: 0, //分页个数
      total: 0,
      page: 1,
      pageSize: 20,
      multipleSelection: [],
      interviewId: "",
      uploadType: "",
      tableHeight: 0, //减去页面头部高度和分页高度
      options: [
        {
          value: -1,
          label: "全部"
        },
        {
          value: 0,
          label: "待审核"
        },
        {
          value: 3,
          label: "已提交"
        },
        {
          value: 4,
          label: "合格"
        },
        {
          value: 5,
          label: "不合格"
        }
      ],
      value: -1,
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
      if (row.executeStatus === 5) {
        //为访谈计划状态为5(不合格)的添加 class
        return "warn";
      }
    },
    handleSizeChange(val) {
      //分页数据显示条数切换
      this.pageSize = val;
      this.pageChange(1);
    },
    pageChange(index) {
      this.page = index;
      this.getAllExecuteData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    statusChange(value) {
      this.getAllExecuteData();
    },
    handleUpload(row, type) {
      console.log(row);
      console.log(type);
      this.interviewId = row.id;
      this.uploadType = type;
    },
    getAllExecuteData(status, pageNum) {
      this.loading = true;
      getAllExecute(this.value, this.page, this.pageSize).then(res => {
        if (res.code === 0) {
          if (res.result.records.length == 0 && this.page > 1) {
            //操作之后当前分页数据为空并且不是第一页时，请求上一页数据
            this.page--;
            this.getAllExecuteData();
          } else {
            let data = res.result;
            this.tableData = data.records;
            this.pageTotal = Number(data.pages);
            this.total = Number(data.total);
            this.pageSize = Number(data.size);
            this.page = Number(data.current);
            this.loading = false;
          }
        } else {
          this.loading = false;
        }
      });
    },
    handleSubmit(interviewId) {
      this.loading = true;
      submitExcute(interviewId).then(res => {
        //if (res.code == 0) {
        this.getAllExecuteData();
        //}
      });
    },
    handlePreview(filePath, title) {
      previewFile(filePath, title);
    },
    handleDeleteFile(fileId) {
      deleteFile(fileId).then(res => {
        //if (res.code == 0) {
        this.getAllExecuteData();
        //}
      });
    },
    uploadPlanSuccess(resData, fileName, uploadType) {
      this.loading = true;
      if (uploadType == "records") {
        // 上传访谈笔记
        uploadVisiting({
          interviewId: this.interviewId,
          filePath: resData,
          fileName: fileName
        }).then(res => {
          //if (res.code == 0) {
          this.getAllExecuteData();
          //}
        });
      }
      if (uploadType == "supports") {
        // 上传支持文件
        uploadSupportFiles({
          interviewId: this.interviewId,
          filePath: resData,
          fileName: fileName
        }).then(res => {
          //if (res.code == 0) {
          this.getAllExecuteData();
          //}
        });
      }
    }
  }
};
</script>
