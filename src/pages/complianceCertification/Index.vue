<template>
  <div class="step-wrap">
    <title-bar @goBack="goBack"></title-bar>
    <div style="margin: 15px 0 26px;">
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
        name: "complianceCertification",
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
                title: "",
                list: [
                    {
                        stepRole: true,
                        name: "创建计划",
                        icon: require("@/assets/images/complianceCertification/jihua.png"),
                        activeIcon: require("@/assets/images/complianceCertification/jihua-act.png"),
                        path: "createPlans",
                        query: {
                            projectNo: this.$route.query.projectNo,
                            from: this.$route.query.from,
                            status: this.$route.query.status,
                            messageMatterStatus: this.$route.query.messageMatterStatus,
                        }
                    },
                    {
                        stepRole: true,
                        name: "确认计划",
                        icon: require("@/assets/images/complianceCertification/queren.png"),
                        activeIcon: require("@/assets/images/complianceCertification/queren-act.png"),
                        path: "confirmPlans",
                        query: {
                            projectNo: this.$route.query.projectNo,
                            status: this.$route.query.status,
                            messageMatterStatus: this.$route.query.messageMatterStatus,
                            from: this.$route.query.from,
                        }
                    },
                    {
                        stepRole: true,
                        name: "上传证明",
                        icon: require("@/assets/images/complianceCertification/zhixing.png"),
                        activeIcon: require("@/assets/images/complianceCertification/zhixing-act.png"),
                        path: "uploadProof",
                        query: {
                            projectNo: this.$route.query.projectNo,
                            status: this.$route.query.status,
                            messageMatterStatus: this.$route.query.messageMatterStatus,
                            from: this.$route.query.from
                        }
                    },
                    {
                        stepRole: true,
                        name: "审核证明",
                        icon: require("@/assets/images/complianceCertification/jieguo.png"),
                        activeIcon: require("@/assets/images/complianceCertification/jieguo-act.png"),
                        path: "auditCertificate",
                        query: {
                            projectNo: this.$route.query.projectNo,
                            status: this.$route.query.status,
                            messageMatterStatus: this.$route.query.messageMatterStatus,
                            from: this.$route.query.from
                        }
                    },
                    {
                        stepRole: true,
                        name: "关联证明",
                        icon: require("@/assets/images/complianceCertification/guanlian.png"),
                        activeIcon: require("@/assets/images/complianceCertification/guanlian-act.png"),
                        path: "correlationProof",
                        query: {
                            projectNo: this.$route.query.projectNo,
                            status: this.$route.query.status,
                            messageMatterStatus: this.$route.query.messageMatterStatus,
                            from: this.$route.query.from
                        }
                    }
                ],
                back:0,
            };
        },
        methods: {
            handleLink(route) {
                this.back = 1
                let name = route.path;
                let query = route.query;
                let userRole = this.userRole;
                //Partnership(大律师)  Resp(负责律师)  Exec(执行律师)  Client(客户)
                if (userRole == "Partnership" || userRole == "Resp") {
                    this.$router.push({name: name, query: query});
                } else {
                    if (
                        name == "createPlans" ||
                        name == "uploadProof" ||
                        name == "correlationProof"
                    ) {  //执行律师只有权限访问创建和执行访谈页面
                        this.$router.push({name: name, query: query});
                    } else {
                        MessageBox.alert("无权限", "提示", {
                            type: "warning",
                            confirmButtonText: "确定",
                            callback: () => {
                            }
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
                    this.$router.go(-1);
                    //list
                }else{
                    this.$router.push({ path: "/myWork/list" });
                }
            },
            getMatterMessage(){
                const messageMatterStatus = this.$route.query.messageMatterStatus;
                if (messageMatterStatus == 2){
                    MessageBox.alert("已完成", "提示", {
                        type: "warning",
                        confirmButtonText: "确定",
                        callback: () => {
                        }
                    });
                }
            }
        },
        mounted() {
            this.getRole();
            this.getMatterMessage();
        }
    };
</script>
