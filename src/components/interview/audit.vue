<template>
  <div class="wrap-content manageInterviewContent">
    <el-row>
      <el-button type="primary" v-if="isShowOperating" @click="handlePass">合格</el-button>
      <el-button type="danger" v-if="isShowOperating" @click="handleNoPass">不合格</el-button>
    </el-row>

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
          <el-table-column align="center" type="selection" width="40"></el-table-column>
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
            <!-- executeStatus——状态 3(待审核) 4(合格) 5(不合格) -->
            <template slot-scope="scope">
              <template v-if="scope.row.executeStatus == 5 || scope.row.executeStatus == 4">
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
              <template v-else>
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
            </template>
          </el-table-column>
          <el-table-column align="center" prop="supports" label="支持文件" width="200">
            <template slot="header">支持文件</template>
            <!-- executeStatus——状态 3(待审核) 4(合格) 5(不合格) -->
            <template slot-scope="scope">
              <template v-if="scope.row.executeStatus == 5 || scope.row.executeStatus == 4">
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
              <template v-else>
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
              <!-- executeStatus——状态 3(待审核) 4(合格) 5(不合格) -->
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
              <template v-if="scope.row.executeStatus == 3">待审核</template>
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
            <template slot="header">操作</template>
            <!-- executeStatus——状态 3(待审核) 4(合格) 5(不合格) -->
            <template slot-scope="scope">
              <template v-if="scope.row.executeStatus == 3">
                <span class="btn-item upload-authority" v-if="isShowOperating" @click="handleQualified(scope.row.id)">合格</span>
                <span
                  class="btn-item upload-unauthority"
                  @click="handleUnqualified(scope.row.id)"
                  v-if="isShowOperating"
                >不合格</span>
              </template>
              <template v-else></template>
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
import upload from "@/components/upload";
import { MessageBox } from "element-ui";
import {
  getExecuted,
  uploadRecord,
  uploadSupport,
  executePass,
  noExecutePass,
  deleteFiles,
  executeAllPass,
  executeAllNoPass
} from "@/api/manageInterview";
import { getMatterStatus } from "@/api/project";
export default {
  name: "auditInterview",
  components: {
    upload
  },
  created(){
    this.tableHeight = window.innerHeight - (319 + 65);
  },
  mounted: function() {
    this.getExecutedData();
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
      mark: "",
      tableHeight: 0, //减去页面头部高度和分页高度
      options: [
        {
          value: -1,
          label: "全部"
        },
        {
          value: 3,
          label: "待审核"
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
      this.getExecutedData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    statusChange(value) {
      this.getExecutedData();
    },
    handleUpload(row, type) {
      console.log(row);
      console.log(type);
      this.interviewId = row.id;
      this.uploadType = type;
    },
    getExecutedData(status, pageNum) {
      this.loading = true;
      getExecuted(this.value, this.page, this.pageSize).then(res => {
        if (res.code === 0) {
          if (res.result.records.length == 0 && this.page > 1) {
            //操作之后当前分页数据为空并且不是第一页时，请求上一页数据
            this.page--;
            this.getExecutedData();
          } else {
            let data = res.result;
            this.tableData = data.records;
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
    handlePreview(filePath, title) {
      previewFile(filePath, title);
    },
    handleDeleteFile(fileId) {
      deleteFiles(fileId).then(res => {
        //if (res.code == 0) {
        this.getExecutedData();
        //}
      });
    },
    uploadPlanSuccess(resData, fileName, uploadType) {
      this.loading = true;
      if (uploadType == "records") {
        // 上传访谈笔录
        uploadRecord({
          interviewId: this.interviewId,
          filePath: resData,
          fileName: fileName
        }).then(res => {
          //if (res.code == 0) {
          this.getExecutedData();
          //}
        });
      }
      if (uploadType == "supports") {
        // 上传支持文件
        uploadSupport({
          interviewId: this.interviewId,
          filePath: resData,
          fileName: fileName
        }).then(res => {
          //if (res.code == 0) {
          this.getExecutedData();
          //}
        });
      }
    },
    handleQualified(interviewId) {
      this.loading = true;
      executePass(interviewId).then(res => {
        //if (res.code === 0) {
        this.getExecutedData();
        //}
      });
    },
    handleUnqualified(interviewId) {
      const h = this.$createElement;
      this.$msgbox({
        title: "不合格原由",
        message: h("div", { class: "el-textarea el-input--small" }, [
          h("textarea", {
            class: "el-textarea__inner",
            attrs: {
              rows: "4",
              maxlength: "100",
              placeholder: "请输入不合格原由"
            },
            domProps: {
              value: ""
            },
            on: {
              input: event => {
                this.mark = event.target.value;
              }
            }
          })
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action == "confirm") {
            done();
            this.loading = true;
            noExecutePass(interviewId, this.mark).then(res => {
              //if (res.code === 0) {
              this.getExecutedData();
              //}
            });
          } else {
            done();
          }
        }
      })
        .then(action => {})
        .catch(() => {});
    },
    handlePass() {
      //批量合格操作
      let multipleSelection = this.multipleSelection;
      let interviewId = [];
      if (multipleSelection.length) {
        //判断是否有选中访谈数据
        multipleSelection.forEach(v => {
          //筛选出待审核(3)数据的ID
          if (v.executeStatus == 3) {
            interviewId.push(v.id);
          }
        });
        if (interviewId.length) {
          //如果有待审核(3)的数据
          this.loading = true;
          executeAllPass(interviewId.toString()).then(res => {
            //if (res.code == 0) {
            this.getExecutedData();
            //}
          });
        } else {
          MessageBox.alert("仅可以提交状态为待审核的选项！", "提示", {
            type: "warning",
            confirmButtonText: "确定",
            callback: () => {}
          });
        }
      } else {
        MessageBox.alert("请选择要提交审核的项！", "提示", {
          type: "warning",
          confirmButtonText: "确定",
          callback: () => {}
        });
        return false;
      }
    },
    handleNoPass() {
      //批量不合格操作
      let multipleSelection = this.multipleSelection;
      let interviewId = [];
      if (multipleSelection.length) {
        //筛选出待确认(3)的数据
        multipleSelection.forEach(v => {
          if (v.executeStatus == 3) {
            interviewId.push(v.id);
          }
        });
        if (interviewId.length) {
          //如果有待确认(3)的数据
          const h = this.$createElement;
          this.$msgbox({
            title: "不合格的原因",
            message: h("div", { class: "el-textarea el-input--small" }, [
              h("textarea", {
                class: "el-textarea__inner",
                attrs: {
                  rows: "4",
                  maxlength: "100"
                },
                domProps: {
                  value: ""
                },
                on: {
                  input: event => {
                    this.mark = event.target.value;
                  }
                }
              })
            ]),
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            beforeClose: (action, instance, done) => {
              if (action == "confirm") {
                done();
                this.loading = true;
                executeAllNoPass(interviewId.toString(), this.mark).then(
                  res => {
                    //if (res.code === 0) {
                    this.getExecutedData();
                    //}
                  }
                );
              } else {
                done();
              }
            }
          })
            .then(action => {})
            .catch(() => {});
        } else {
          MessageBox.alert("仅可以提交状态为待审核的选项！", "提示", {
            type: "warning",
            confirmButtonText: "确定",
            callback: () => {}
          });
          return false;
        }
      } else {
        MessageBox.alert("请选择要提交审核的项！", "提示", {
          type: "warning",
          confirmButtonText: "确定",
          callback: () => {}
        });
        return false;
      }
    }
  }
};
</script>
