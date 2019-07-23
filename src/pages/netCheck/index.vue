<template>
  <div>
    <keep-alive>
      <title-bar @goBack="goBack"></title-bar>
    </keep-alive>
    <div style="margin: 15px 0 26px">
      <step :list="list" @handleLink="handleLink"></step>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { commonAuthApi } from "@/api/commonAuthApi";
import step from "@/components/step";
import { MessageBox } from "element-ui";

export default {
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
      projectNoDefault: '',
      title: "",
      list: [
        {
          stepRole: true,
          name: "创建计划",
          icon: require("@/assets/images/netCheck/menu.png"),
          activeIcon: require("@/assets/images/netCheck/menu-active.png"),
          path: "createMenu",
          from: this.$route.query.from,
          status: this.$route.query.status,
          query: {}
        },
        {
          stepRole: true,
          name: "爬取资料",
          icon: require("@/assets/images/netCheck/crawl.png"),
          activeIcon: require("@/assets/images/netCheck/crawl-active.png"),
          path: "crawlFile",
          from: this.$route.query.from,
          status: this.$route.query.status,
          query: {}
        },
        {
          stepRole: true,
          name: "校验资料",
          icon: require("@/assets/images/netCheck/check.png"),
          activeIcon: require("@/assets/images/netCheck/check-active.png"),
          path: "calibration",
          from: this.$route.query.from,
          status: this.$route.query.status,
          query: {}
        },
        {
          stepRole: true,
          name: "审核资料",
          icon: require("@/assets/images/netCheck/examine.png"),
          activeIcon: require("@/assets/images/netCheck/examine-active.png"),
          path: "auditData",
          from: this.$route.query.from,
          status: this.$route.query.status,
          query: {}
        },
        {
          stepRole: true,
          name: "关联底稿",
          icon: require("@/assets/images/netCheck/relate.png"),
          activeIcon: require("@/assets/images/netCheck/relate-active.png"),
          path: "relatedManuscript",
          from: this.$route.query.from,
          status: this.$route.query.status,
          query: {}
        }
      ],
      back: 0
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
          name == "createMenu" ||
          name == "crawlFile" ||
          name == "calibration" ||
          name == "relatedManuscript"
        ) {
          //执行律师只有权限访问创建计划、爬取资料、校验资料、关联底稿
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
      commonAuthApi(this.projectNoDefault).then(res => {
        this.role = res.result;
      });
    },
    goBack() {
      const from = this.$route.query.from;
      const route = this.$route;
      const name = route.name;
      const path = route.path;
      if (name === "viewImage") {
        console.log(route)
        this.$router.push(
          route.query.parentfullPath
        );
        // //查看图片页面
        // const parentName = route.matched[route.matched.length - 2].name;
        // if (parentName === "calibration") {
        //   //校验资料
        //   this.$router.push(
        //     "/netCheck/" + route.params.projectNo + "/calibration"
        //   );
        // } else if (parentName === "auditData") {
        //   //审核资料
        //   this.$router.push(
        //     "/netCheck/" + route.params.projectNo + "/auditData"
        //   );
        // } else if (parentName === "relatedManuscript") {
        //   //关联底稿
        //   this.$router.push(
        //     route.query.parentfullPath
        //   );
        // }
      } else {
        // /myWork/list (工作台列表)
        // /myWork/details/K201905240000000003 (项目详情页)
        if (from == "details") {
          this.$router.push({ path: "/myWork/details/" + this.projectNoDefault });
        } else if (from =="message") {
          //list
          this.$router.go(-1)
          //this.$router.go(-1);
        }else{
            this.$router.push({ path: "/myWork/list" });
        }
      }
      //this.back++
    }
  },
  created() {
    let self = this;
    if(this.list[0].query.projectNoDefault) return
    this.list.forEach(v => {
      v.query = Object.assign(this.$route.params, this.$route.query);
    });
  },
  mounted() {
    this.projectNoDefault = this.$route.query.projectNoDefault;
    this.getRole();
  }
};
</script>
