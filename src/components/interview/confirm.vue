<!-- 该页面是三个访谈(管理层访谈、业务伙伴访谈和监管部门访谈)的公用“确认计划页面” -->

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
          class="warnResult"
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
            <!-- createStatus——状态 2(待确认) 3(合格) 4(不合格) -->
            <template slot-scope="scope">
              <template v-if="scope.row.createStatus == 2">
                <!-- 2待确认 -->
                <template v-if="scope.row.outlineFilePath == ''">
                  <!-- 如果访谈提纲文件路径为空显示上传 -->
                  <upload
                    accept=".png, .bmp, .gif, .jpg, .jpeg, .doc, .docx, .xls, .xlsx, .pdf, .m4a"
                    uploadType="outline"
                    @uploadSuccess="uploadPlanSuccess"
                  >
                    <span class="btn-item" v-if="isShowOperating" @click="handleUpload(scope.row, 'outline')">上传</span>
                  </upload>
                </template>
                <template v-else>
                  <!-- 否则显示查看和重传按钮 -->
                  <span
                    class="btn-item"
                    @click="handlePreview(scope.row.outlineFilePath, scope.row.outlineFileName)"
                  >查看</span>
                  <upload
                    class="btn-item"
                    accept=".png, .bmp, .gif, .jpg, .jpeg, .doc, .docx, .xls, .xlsx, .pdf, .m4a"
                    uploadType="outline"
                    @uploadSuccess="uploadPlanSuccess"
                  >
                    <span class="btn-item" v-if="isShowOperating" @click="handleUpload(scope.row, 'outline')">重传</span>
                  </upload>
                </template>
              </template>
              <template v-else>
                <!-- 合格3 不合格4 -->
                <template v-if="scope.row.outlineFilePath == ''">-</template>
                <template v-else>
                  <span
                    class="btn-item"
                    @click="handlePreview(scope.row.outlineFilePath, scope.row.outlineFileName)"
                  >查看</span>
                </template>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="createStatus"
            label="状态"
            width="190"
            :show-overflow-tooltip="true"
          >
            <!-- createStatus——状态 2(待确认) 3(合格) 4(不合格) -->
            <template slot-scope="scope" slot="header">
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
              <template v-if="scope.row.createStatus == 2">待确认</template>
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
            <!-- createStatus——状态 2(待确认) 3(合格) 4(不合格) -->
            <template slot="header">操作</template>
            <template slot-scope="scope">
              <template v-if="scope.row.createStatus == 2">
                <!-- 待确认(2) -->
                <span class="btn-item upload-authority" v-if="isShowOperating" @click="handleQualified(scope.row.id)">合格</span>
                <span
                  class="btn-item upload-unauthority"
                  v-if="isShowOperating"
                  @click="handleUnqualified(scope.row.id)"
                >不合格</span>
              </template>
              <template v-else-if="scope.row.createStatus == 3">
                <!-- 合格(3) -->
              </template>
              <template v-else-if="scope.row.createStatus == 4">
                <!-- 不合格(4) -->
                <span class="btn-item" v-if="isShowOperating" @click="handleDelete(scope.row.id)">删除</span>
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
import upload from "@/components/upload";
import { MessageBox } from "element-ui";
import {
  getAllSubmitted,
  interviewQualified,
  interviewUnqualified,
  reUploadOutline,
  deleteInterview,
  interviewQualifiedAll,
  interviewUnqualifiedAll
} from "@/api/manageInterview";
import { getMatterStatus } from "@/api/project";
export default {
  name: "confirmPlan",
  components: {
    upload
  },
  created(){
    this.tableHeight = window.innerHeight - (319 + 65);
    this.pageSize = this.$store.state.interview.managePageSize;
  },
  mounted: function() {
    this.getAllSubmittedData();
  },
  data() {
    return {
      loading: true,
      pageTotal: 0, //分页个数
      total: 0, //当前列表总条数
      page: 1, //当前分页
      pageSize: 20, //一页显示的数据条数
      tableData: [], //表格列表数据
      multipleSelection: [], //复选框选中的表格数据
      tableHeight: 0, //减去页面头部高度和分页高度
      mark: "", //不合格操作理由
      options: [
        //状态筛选下拉框数据
        {
          value: -1,
          label: "全部"
        },
        {
          value: 2,
          label: "待确认"
        },
        {
          value: 3,
          label: "合格"
        },
        {
          value: 4,
          label: "不合格"
        }
      ],
      value: -1, //当前状态选中的值
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
      this.pageChange(1);
    },
    pageChange(index) {
      //分页功能
      this.page = index;
      this.getAllSubmittedData();
    },
    statusChange(value) {
      //根据状态请求数据
      this.loading = true;
      this.getAllSubmittedData();
    },
    handleSelectionChange(val) {
      //element-ui table表格复选框多选存值
      this.multipleSelection = val;
    },
    getAllSubmittedData(status, pageNum) {
      //获取/更新访谈计划列表数据
      getAllSubmitted(this.value, this.page, this.pageSize).then(res => {
        if (res.code === 0) {
          if (res.result.records.length == 0 && this.page > 1) {
            //操作之后当前分页数据为空并且不是第一页时，请求上一页数据
            this.page--;
            this.getAllSubmittedData();
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
    uploadPlanSuccess(resData, fileName, uploadType) {
      //上传文件组件上传成功后会调用此方法，并返回数据、上传的文件名和上传的类型。resData为服务器上文件路径如：/fdn/test.xls
      this.loading = true;
      if (uploadType == "outline") {
        // 上传访谈提纲
        reUploadOutline({
          interviewId: this.interviewId,
          filePath: resData,
          fileName: fileName
        })
          .then(res => {
            //if (res.code == 0) {
            this.getAllSubmittedData();
            //}
          })
          .catch(res => {
            this.loading = false;
          });
      }
    },
    handleUpload(row, type) {
      //访谈提纲上传和重传
      //存储点击的访谈计划的id和上传的类型，因为本页面有多个上传并且用一个上传组件，
      //所以需要保存id和上传类型，以便上传成功后将后端返回文件路径发送到对应类型的API
      this.interviewId = row.id;
      this.uploadType = type;
    },
    handlePreview(filePath, title) {
      //预览文件
      previewFile(filePath, title);
    },
    handleDelete(interviewId) {
      //根据id删除访谈计划
      MessageBox.alert("是否要删除？", "提示", {
        type: "warning",
        confirmButtonText: "确定",
        callback: action => {
          if (action === "confirm") {
            this.loading = true;
            deleteInterview(interviewId, "confirm")
              .then(res => {
                //if (res.code == 0) {
                this.getAllSubmittedData();
                //}
              })
              .catch(res => {
                this.loading = false;
              });
          }
        }
      });
    },
    handleQualified(interviewId) {
      //访谈合格操作
      this.loading = true;
      interviewQualified(interviewId).then(res => {
        //if (res.code === 0) {
        this.getAllSubmittedData();
        //}
      });
    },
    handleUnqualified(interviewId) {
      //访谈不合格操作
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
            interviewUnqualified(interviewId, this.mark).then(res => {
              //if (res.code === 0) {
              this.getAllSubmittedData();
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
          //筛选出待确认(2)数据的ID
          if (v.createStatus == 2) {
            interviewId.push(v.id);
          }
        });
        if (interviewId.length) {
          //如果有待确认(2)的数据
          this.loading = true;
          interviewQualifiedAll(interviewId.toString()).then(res => {
            //if (res.code == 0) {
            this.getAllSubmittedData();
            //}
          });
        } else {
          MessageBox.alert("仅可以提交状态为待确认的选项！", "提示", {
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
        //筛选出待确认(2)的数据
        multipleSelection.forEach(v => {
          if (v.createStatus == 2) {
            interviewId.push(v.id);
          }
        });
        if (interviewId.length) {
          //如果有待确认(2)的数据
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
                interviewUnqualifiedAll(interviewId.toString(), this.mark).then(
                  res => {
                    //if (res.code === 0) {
                    this.getAllSubmittedData();
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
          MessageBox.alert("仅可以提交状态为待确认的选项！", "提示", {
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
