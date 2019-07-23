<template>
  <div class="wrap-content manageInterviewContent">
    <el-row>
      <div class="table-box tables" id="table-box">
        <el-table
          ref="multipleTable"
          border
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          :max-height="tableHeight"
          v-loading="loading"
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
            <el-table-column align="center" prop="remarks" label="备注" :show-overflow-tooltip="true"></el-table-column>
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
          <el-table-column align="center" width="200">
            <template slot-scope="scope" slot="header">底稿属性</template>
            <template slot-scope="scope">
              <template v-if="isShowOperating">
                <el-select
                  name="attributeSelect"
                  v-model="scope.row.manuscriptAttribute"
                  multiple
                  allow-create
                  filterable
                  placeholder="请选择底稿属性"
                  @change="manuscriptChange(scope.row)"
                >
                  <el-option
                    v-for="(item, index) in manuscriptOptions"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </template>
              <template v-else>{{scope.row.manuscriptAttribute.join(',')}}</template>
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
                v-model="manuscriptStatusValue"
                size="mini"
                @change="statusChange"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in manuscriptStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
            <template slot-scope="scope">
              <template v-if="scope.row.manuscriptStatus == 1">已关联</template>
              <template v-else>未关联</template>
            </template>
          </el-table-column>
          <el-table-column align="center" width="200">
            <template slot-scope="scope" slot="header">计划属性</template>
            <template slot-scope="scope">
              <template v-if="isShowOperating">
                <el-select
                  name="attributeSelect"
                  v-model="scope.row.planAttribute"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择计划属性"
                  @change="planChange(scope.row)"
                >
                  <el-option
                    v-for="(item, index) in planOptions"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </template>
              <template v-else>{{scope.row.planAttribute.join(',')}}</template>
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
                v-model="planStatusValue"
                size="mini"
                @change="statusChange"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in planStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
            <template slot-scope="scope">
              <template v-if="scope.row.planStatus == 1">已关联</template>
              <template v-else>未关联</template>
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
  deleteFile,
  getRelations,
  relationshipManuscript,
  relationshipPlan,
  relation,
  relationPlan
} from "@/api/manageInterview";
import { validationFormat, validationPlanFormat } from "@/utils/validate";
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
    this.getRelationsData();
    this.getRelationshipManuscript();
    this.getRelationshipPlan();
  },
  data() {
    return {
      manuscriptOptions: [],
      planOptions: [],
      tableData: [],
      loading: false,
      pageTotal: 0, //分页个数
      total: 0,
      page: 1,
      pageSize: 20,
      tableHeight: 0, //减去页面头部高度和分页高度
      manuscriptStatusOptions: [
        {
          value: -1,
          label: "全部"
        },
        {
          value: 1,
          label: "已关联"
        },
        {
          value: 0,
          label: "未关联"
        }
      ],
      manuscriptStatusValue: -1,
      planStatusOptions: [
        {
          value: -1,
          label: "全部"
        },
        {
          value: 1,
          label: "已关联"
        },
        {
          value: 0,
          label: "未关联"
        }
      ],
      planStatusValue: -1,
      options: [
        {
          value: -1,
          label: "全部"
        },
        {
          value: 0,
          label: "已关联"
        },
        {
          value: 3,
          label: "未关联"
        }
      ],
      value: -1,
      matterStatus: this.$route.query.status
    };
  },
  computed: {
    isShowOperating() {
      let status = getMatterStatus()
      return status
    }
  },
  methods: {
    handleSizeChange(val) {
      //分页数据显示条数切换
      this.pageSize = val;
      this.pageChange(1);
    },
    pageChange(index) {
      this.page = index;
      this.getRelationsData();
    },
    statusChange(value) {
      this.getRelationsData();
    },
    manuscriptChange({ id, manuscriptAttribute: attribute = [] }) {
      let status = attribute.length
        ? validationFormat(attribute[attribute.length - 1])
        : true;
      if (status) {
        this.loading = true;
        relation(id, attribute.join(",")).then(res => {
          this.getRelationsData();
        });
      } else {
        attribute.pop();
        this.$alert(
          "请按照x.x，x.x-x，x.x-x-x的格式填写该属性(x为数字)",
          "提示",
          { confirmButtonText: "确定", type: "warning" }
        );
      }
    },
    planChange({ id, planAttribute: attribute = [] }) {
      let status = attribute.length
        ? validationPlanFormat(attribute[attribute.length - 1])
        : true;
      if (status) {
        this.loading = true;
        relationPlan(id, attribute.join(",")).then(res => {
          this.getRelationsData();
        });
      } else {
        attribute.pop();
        this.$alert("请按照 x-x-x，x-x-x-x，x-x-x-x-x 的格式填写该属性(x为数字)", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
      }
    },
    getRelationshipManuscript() {
      //获取底稿属性
      relationshipManuscript().then(res => {
        console.log("Manuscript", res);
        this.manuscriptOptions = res.result;
      });
    },
    getRelationshipPlan() {
      relationshipPlan().then(res => {
        console.log("Plan", res);
        this.planOptions = res.result;
      });
    },
    getRelationsData(status, pageNum) {
      this.loading = true;
      let param = {
        pagenum: this.page ? this.page : 1,
        pagesize: this.pageSize ? this.pageSize : 10
      };
      // if (status >= 0) {
      //   param.status = status
      // }
      if (this.manuscriptStatusValue >= 0) {
        param.manuscriptStatus = this.manuscriptStatusValue;
      }
      if (this.planStatusValue >= 0) {
        param.planStatus = this.planStatusValue;
      }
      getRelations(param).then(res => {
        if (res.code === 0) {
          if (res.result.records.length == 0 && this.page > 1) {
            //操作之后当前分页数据为空并且不是第一页时，请求上一页数据
            this.page--;
            this.getRelationsData();
          } else {
            let data = res.result;
            data.records.forEach(v => {
              if (v.manuscriptAttribute == "") {
                v.manuscriptAttribute = [];
              } else {
                v.manuscriptAttribute = v.manuscriptAttribute.split(",");
              }
              if (v.planAttribute == "") {
                v.planAttribute = [];
              } else {
                v.planAttribute = v.planAttribute.split(",");
              }
            });
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
    handlePreview(filePath, title) {
      previewFile(filePath, title);
    }
  }
};
</script>
