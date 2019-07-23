<template>
  <div id="app">
    <drag-resize
      :class="{'workGuidesWrap': true, workGuidesOpen: isOpen}"
      :isActive="true"
      :parentLimitation="false"
      :isDraggable="false"
      :w="w"
      :h="h"
      :x="x"
      :y="y"
      :z="10000"
      @resizing="resize"
    >
      <div class="workGuidesBtn" @click="openWorkGuides">
        <i class="el-icon-warning icon-workGuidesBtn"></i>工作指引
      </div>

      <div class="workGuidesModal">
        <el-row :gutter="0" class="workGuidesBody">
          <el-col :span="6" class="tree-box" v-loading="treeloading">
            <v-jstree :data="treeData" @item-click="itemClick" v-if="treeData.length">
              <template slot-scope="_">{{_.model.text}}</template>
            </v-jstree>
            <template v-else>暂无数据</template>
          </el-col>
          <el-col :span="18" v-loading="contentloading">
            <div class="workGuidesContent ql-snow">
              <div class="ql-editor" v-html="content" v-if="!!content && !!this.editingItem"></div>
              <!-- <p v-else>暂无数据</p> -->
            </div>
          </el-col>
        </el-row>
      </div>
    </drag-resize>

    <router-view></router-view>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "@/assets/css/workGuides.scss";
import dragResize from "@/components/drag-resize";
import { treeContent, treeList } from "@/api/systemManageApi";
import { getProjectInfo } from "@/api/mywork";
const bodyW = window.innerWidth;
const bodyH = window.innerHeight;
export default {
  name: "app",
  components: {
    dragResize
  },
  data() {
    return {
      isOpen: false,
      contentloading: false,
      treeloading: false,
      content: "",
      editingItem: {},
      editingNode: null,
      treeData: [],
      pageId: "",
      w: (bodyW / 100) * 70,
      h: (bodyH / 100) * 70,
      x: ~((bodyW / 100) * 70) + -2,
      y: (bodyH - (bodyH / 100) * 70) / 2
    };
  },
  watch: {
    $route(to) {
      this.pageId = "";
      this.isOpen = false;
      this.content = "";
      this.treeData = [];
      this.w = (bodyW / 100) * 70;
      this.h = (bodyH / 100) * 70;
      this.x = ~((bodyW / 100) * 70) + -2;
      this.y = (bodyH - (bodyH / 100) * 70) / 2;
      if (!!to.meta.pageId) {
        console.log("pageId is " + to.meta.pageId);
        this.pageId = to.meta.pageId;
        this.getTreeData(to.meta.pageId);
      } else if (to.name == "projectDetails") {
        //我的工作台>项目详情页 判断路由名称
        getProjectInfo(to.params.id).then(res => {
          const statusArr = [
            { status: 0, pageId: "8" },
            { status: 1, pageId: "9" },
            { status: 2, pageId: "10" }
          ];
          let status = res.result.status; //获取项目状态 0未开始 1准备种 2进行中
          let proStatus = statusArr.filter(v => {
            return v.status == status;
          });
          if (proStatus.length) {
            this.pageId = proStatus[0].pageId;
            this.getTreeData(proStatus[0].pageId);
          }
        });
      }
    }
  },
  methods: {
    resize(newRect) {
      this.w = newRect.width;
      this.h = newRect.height;
      this.x = newRect.left;
      this.y = newRect.top;
    },
    itemClick(node, item, e) {
      this.contentloading = true;
      // node : 当前节点的 vue 对象
      // item : 当前节点的数据对象
      // e : 事件参数
      this.editingNode = node;
      this.editingItem = node.model;
      treeContent(this.editingItem.id)
        .then(res => {
          this.content = res.result.content;
          this.contentloading = false;
        })
        .catch(res => {
          this.contentloading = false;
        });
    },
    openWorkGuides() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.x = 0;
      } else {
        this.x = ~this.w + -2;
      }
    },
    getTreeData(pageId) {
      this.treeloading = true;
      (this.editingItem = null), (this.editingNode = null), (this.content = "");
      this.treeData = [];
      let option = {
        pageId: pageId
      };
      treeList(option)
        .then(res => {
          console.log(res, "treeData");
          let data = res.result;
          this.treeData = data;
          this.treeloading = false;
        })
        .catch(res => {
          this.treeloading = false;
        });
    }
  }
};
</script>

<style rel="stylesheet/scss" scoped lang="scss">
#app {
  overflow-y: auto;
  overflow-x: auto;
}
</style>
