<template>
  <div>
    <title-bar @goBack="goBack"></title-bar>
    <div style="margin: 15px 0 26px">
      <step :list="list" @handleLink="handleLink"></step>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import step from "@/components/step";
import { MessageBox } from "element-ui";
import { commonAuthApi } from "@/api/commonAuthApi";
export default {
  name: "manageInterview",
  components: {
    step
  },
  computed: {
    userRole() {
      if (this.role.indexOf("Partnership") > -1) {
        //Partnership(大律师)
        return "Partnership";
      }
      if (this.role.indexOf("Resp") > -1) {
        //Resp(负责律师)
        return "Resp";
      }
      if (this.role.indexOf("Exec") > -1) {
        //Exec(执行律师)
        return "Exec";
      }
      if (this.role.indexOf("Client") > -1) {
        //Client(客户)
        return "Client";
      }
    }
  },
  data() {
    return {
      role: "", //Partnership(大律师)  Resp(负责律师)  Exec(执行律师)  Client(客户)
      title: "",
      list: [
        {
          stepRole: true,
          name: "创建计划",
          icon: require("@/assets/images/manageInterview/jihua.png"),
          activeIcon: require("@/assets/images/manageInterview/jihua-act.png"),
          path: "createPlan",
          query: {
            projectNo: this.$route.query.projectNo,
            from: this.$route.query.from,
            matterStatus: this.$route.query.matterStatus ? this.$route.query.matterStatus : this.$route.query.messageMatterStatus
          }
        },
        {
          stepRole: true,
          name: "确认计划",
          icon: require("@/assets/images/manageInterview/queren.png"),
          activeIcon: require("@/assets/images/manageInterview/queren-act.png"),
          path: "confirmPlan",
          query: {
            projectNo: this.$route.query.projectNo,
            from: this.$route.query.from,
            matterStatus: this.$route.query.matterStatus ? this.$route.query.matterStatus : this.$route.query.messageMatterStatus
          }
        },
        {
          stepRole: true,
          name: "执行访谈",
          icon: require("@/assets/images/manageInterview/zhixing.png"),
          activeIcon: require("@/assets/images/manageInterview/zhixing-act.png"),
          path: "executiveInterview",
          query: {
            projectNo: this.$route.query.projectNo,
            from: this.$route.query.from,
            matterStatus: this.$route.query.matterStatus ? this.$route.query.matterStatus : this.$route.query.messageMatterStatus
          }
        },
        {
          stepRole: true,
          name: "审核访谈",
          icon: require("@/assets/images/manageInterview/jieguo.png"),
          activeIcon: require("@/assets/images/manageInterview/jieguo-act.png"),
          path: "auditInterview",
          query: {
            projectNo: this.$route.query.projectNo,
            from: this.$route.query.from,
            matterStatus: this.$route.query.matterStatus ? this.$route.query.matterStatus : this.$route.query.messageMatterStatus
          }
        },
        {
          stepRole: true,
          name: "关联底稿",
          icon: require("@/assets/images/manageInterview/guanlian.png"),
          activeIcon: require("@/assets/images/manageInterview/guanlian-act.png"),
          path: "relatedDraft",
          query: {
            projectNo: this.$route.query.projectNo,
            from: this.$route.query.from,
            matterStatus: this.$route.query.matterStatus ? this.$route.query.matterStatus : this.$route.query.messageMatterStatus
          }
        }
      ]
    };
  },
  methods: {
    handleLink(route) {
      let name = route.path;
      let query = route.query;
      let userRole = this.userRole;
      //Partnership(大律师)  Resp(负责律师)  Exec(执行律师)  Client(客户)
      if (userRole == "Partnership" || userRole == "Resp") {
        this.$router.push({ name: name, query: query });
      } else {
        if (
          name == "createPlan" ||
          name == "executiveInterview" ||
          name == "relatedDraft"
        ) {
          //执行律师只有权限访问创建、执行访谈页面和关联底稿页面
          this.$router.push({ name: name, query: query });
        } else {
          MessageBox.alert("无权限", "提示", {
            type: "warning",
            confirmButtonText: "确定",
            callback: () => {}
          });
        }
      }
    },
    getRole() {
      commonAuthApi(this.$route.query.projectNo).then(res => {
        this.role = res.result;
      });
    },
    goBack() {
      const from = this.$route.query.from;
      const projectNo = this.$route.query.projectNo;
      // /myWork/list (工作台列表)
      // /myWork/details/K201905240000000003 (项目详情页)
      if (from == "details") {
        this.$router.push({ path: "/myWork/details/" + projectNo });
      } else if (from == "message") {
          //list
          this.$router.go(-1);
      }else{
          this.$router.push({ path: "/myWork/list" });
      }
    }
  },
  mounted() {
    this.getRole();
  }
};
</script>

<style lang="scss">
@import "~@/assets/css/interview/style";
</style>
