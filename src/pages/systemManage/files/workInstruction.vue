<template>
  <div class="system-wrap">
    <div class="model-search">
      <el-form class="form" inline>
        <el-form-item label="页面及步骤名称" prop="name">
          <el-input v-model="name" placeholder="请输入页面及步骤名称"></el-input>
        </el-form-item>
        <div class="fr">
          <el-button type="primary" @click="getWorkGuidesList()">搜索</el-button>
          <el-button type="danger" @click="name = ''; getWorkGuidesList()">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="table-box">
      <el-table
        ref="Table"
        border
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        :height="tableHeight"
        :max-height="tableHeight"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" width="50" align="center">
          <template slot-scope="scope">{{(tableData.indexOf(scope.row)+1) + (page-1) * pageSize}}</template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="页面及步骤名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column align="center" prop="fatherName" label="父页面" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column align="center" label="操作" :show-overflow-tooltip="true" width="200">
          <template slot-scope="scope">
            <p class="btns">
              <span @click="editTree(scope.row)">编辑</span>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="编辑工作指引"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleClose"
      width="70%"
    >
      <el-row :gutter="0" class="instruction-content">
        <el-col :span="6">
          <div
            class="tree-box"
            v-loading="treeloading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
          >
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="handleAddTree"
              style="margin-bottom: 15px"
            >新增目录树</el-button>
            <v-jstree :data="treeData" @item-click="itemClick" v-if="treeData.length">
              <template slot-scope="_">
                <span class="nameText" :title="_.model.text">{{_.model.text}}</span>
                <span class="treeBtn" @click.stop="addChildren(_)">
                  <i class="el-icon-circle-plus-outline"></i>
                </span>
                <span class="treeBtn" @click.stop="handleEditName(_)">
                  <i class="el-icon-edit"></i>
                </span>
                <span
                  class="treeBtn"
                  @click.stop="handleDelTree(_)"
                  v-if="_.model.children.length == 0"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </template>
            </v-jstree>
            <!-- <p v-if="treeData.length == 0">暂无数据</p> -->
          </div>
        </el-col>
        <el-col :span="18">
          <div class="editor-box">
            <quill-editor
              v-if="editingItem"
              v-model="content"
              ref="myQuillEditor"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)"
              @change="onEditorChange($event)"
            ></quill-editor>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveContent" v-if="editingItem">提 交</el-button>
        <el-button @click="dialogVisible = false">关 闭</el-button>
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
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import {
  workGuidesList,
  treeList,
  addTree,
  delTree,
  editName,
  treeContent,
  editContent
} from "@/api/systemManageApi";
import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      tableHeight: window.innerHeight - (195 + 65), //减去页面头部高度和分页高度
      loading: true,
      treeloading: true,
      tableData: [],
      editingItem: {},
      editingNode: null,
      treeData: [],
      name: "",
      pageTotal: 0, //分页个数
      total: 0, //当前列表总条数
      page: 1, //当前分页
      pageSize: 20, //一页显示的数据条数
      dialogVisible: false,
      pageId: "",
      content: "",
      editorOption: {}
    };
  },
  mounted() {
    this.getWorkGuidesList();
  },
  methods: {
    onEditorBlur(quill) {
      console.log("editor blur!", quill);
    },
    onEditorFocus(quill) {
      console.log("editor focus!", quill);
    },
    onEditorReady(quill) {
      console.log("editor ready!", quill);
    },
    onEditorChange({ quill, html, text }) {
      console.log("editor change!", quill, html, text);
      this.content = html;
    },
    pageChange(index) {
      //分页功能
      this.page = index;
      this.getWorkGuidesList();
    },
    handleSizeChange(val) {
      //分页数据显示条数切换
      this.pageSize = val;
      this.pageChange(1);
    },
    getWorkGuidesList() {
      this.loading = true;
      let option = {
        name: this.name,
        pagenum: this.page,
        pagesize: this.pageSize
      };
      workGuidesList(option).then(res => {
        let data = res.result;
        this.tableData = data.records;
        this.loading = false;
        this.pageTotal = Number(data.pages); //分页个数
        this.total = Number(data.total); //总的数据条数
        this.pageSize = Number(data.size); //一页显示的数量
        this.page = Number(data.current); //处于第几分页
      });
    },
    handleClose(done) {
      this.dialogVisible = false;
      this.editingNode = null;
      this.content = "";
      // this.$confirm("确认关闭？")
      //   .then(_ => {
      //     done();
      //     this.editingNode = null;
      //     this.content = '';
      //   })
      //   .catch(_ => {});
    },
    chuliObj(obj) {
      let self = this;
      obj.forEach(v => {
        Object.keys(v).forEach(function(key) {
          if (v.children && v.children.length > 0) {
            self.chuliObj(v.children);
            v.opened = true;
          } else {
            v.opened = true;
          }
        });
      });
    },
    getTreeData() {
      this.treeloading = true;
      this.editingItem = null;
      this.content = "";
      //this.treeData = [];
      let option = {
        pageId: this.pageId
      };
      treeList(option)
        .then(res => {
          console.log(res, "treeData");
          let obj = res.result;
          this.chuliObj(obj);
          obj.forEach((element, index) => {
            this.$set(this.treeData, index, obj[index]);
          });
          this.treeData = obj;
          this.treeloading = false;
          //this.editingItem.openChildren()
        })
        .catch(res => {
          this.treeloading = false;
        });
    },
    editTree(row) {
      this.treeloading = true;
      this.treeData = [];
      this.pageId = row.id;
      this.getTreeData();
      this.dialogVisible = true;
    },
    itemClick(node, item, e) {
      let div = document.getElementsByClassName("tree-selected");
      if (div.length) {
        for (let i = 0; i < div.length; i++) {
          div[i].setAttribute("class", "tree-anchor");
        }
      }

      console.log(div, "div");
      this.treeloading = true;
      // node : 当前节点的 vue 对象
      // item : 当前节点的数据对象
      // e : 事件参数
      this.editingNode = node;
      this.editingItem = node.model;
      treeContent(this.editingItem.id)
        .then(res => {
          this.content = res.result.content;
          this.treeloading = false;
        })
        .catch(res => {
          this.treeloading = false;
        });
    },
    handleAddTree() {
      this.treeloading = true;
      let options = {
        fatherId: 0,
        name: "目录树",
        pageId: this.pageId
      };
      addTree(options).then(res => {
        console.log(res);
        this.getTreeData();
      });

      // if (this.treeData.length == 0) {
      //   this.treeData.push({
      //     text: "newTree",
      //     value: "newTree",
      //     selected: false,
      //     children: []
      //   });
      // } else {
      //   let oldTreeData = this.treeData;
      //   this.treeData = [];
      //   oldTreeData.push({
      //     text: "newTree",
      //     value: "newTree",
      //     children: [],
      //     selected: false
      //   });
      //   setTimeout(res => {
      //     this.treeData = oldTreeData;
      //   }, 0);
      // }
    },
    addChildren(node) {
      this.treeloading = true;
      console.log(node.model.id);
      let options = {
        fatherId: node.model.id,
        name: "目录树",
        pageId: this.pageId
      };
      addTree(options).then(res => {
        console.log(res);
        this.getTreeData();
      });

      // setTimeout(res => {
      //   if (this.editingItem.id !== undefined) {
      //     console.log(this.editingNode.parentItem, "parent");
      //     this.editingItem.addChild({
      //       text: "newTree",
      //       selected: false
      //     });
      //   }
      //   console.log(this.treeData, "treedata");
      // }, 0);
    },
    handleDelTree(node) {
      this.$confirm("确定要删除此目录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.treeloading = true;
          console.log("del", node.model.id);
          delTree(node.model.id).then(res => {
            this.getTreeData();
            // if (this.editingItem.id !== undefined) {
            //   let index = this.editingNode.parentItem.indexOf(this.editingItem);
            //   this.editingNode.parentItem.splice(index, 1);
            // }
          });
        })
        .catch(() => {});

      // setTimeout(res => {
      //   if (this.editingItem.id !== undefined) {
      //     let index = this.editingNode.parentItem.indexOf(this.editingItem);
      //     this.editingNode.parentItem.splice(index, 1);
      //   }
      // }, 0);
    },
    handleEditName(node) {
      //node.model.edit = true
      this.$prompt("请输入名称", "修改名称", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "名称不能为空",
        inputPlaceholder: node.model.text
      })
        .then(({ value }) => {
          this.treeloading = true;
          let option = {
            id: node.model.id,
            name: value
          };
          editName(option).then(res => {
            this.getTreeData();
          });
        })
        .catch(() => {});
    },
    saveContent() {
      let options = {
        content: this.content,
        id: this.editingItem.id
      };
      console.log(options);
      editContent(options).then(res => {
        this.$message({
          message: "修改成功",
          type: "success"
        });
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import "@/assets/css/varibles.scss";
@import "common";
.ql-snow {
  s {
    text-decoration: line-through;
  }
  u {
    text-decoration: underline;
  }
}
.nameText {
  display: inline-block;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  float: left;
}
.treeBtn {
  display: inline-block;
  margin: 0 3px;
}
</style>
