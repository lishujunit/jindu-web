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
    import step from '@/components/step'
    import { MessageBox } from "element-ui";
    import { commonAuthApi } from "@/api/commonAuthApi";
    export default {
        name: '',
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
                title:'',
                role:'',
                list: [{
                    stepRole: true,
                    name: '创建计划',
                    icon: require('../../assets/images/myWork/create_normal.png'),
                    activeIcon: require('../../assets/images/myWork/create_select.png'),
                    path: 'unitCreate',
                    query: {
                        projectNo: this.$route.query.projectNo,
                        status: this.$route.query.status,
                        messageMatterStatus: this.$route.query.messageMatterStatus,
                        from: this.$route.query.from
                    }
                }, {
                    stepRole: true,
                    name: '确认计划',
                    icon: require('../../assets/images/myWork/confirm_normal.png'),
                    activeIcon: require('../../assets/images/myWork/confirm_select.png'),
                    path: 'unitConfirm',
                    query: {
                        projectNo: this.$route.query.projectNo,
                        from: this.$route.query.from,
                        status: this.$route.query.status,
                        messageMatterStatus: this.$route.query.messageMatterStatus,
                    }
                },{
                    stepRole: true,
                    name: '上传回函',
                    icon: require('../../assets/images/myWork/upload_normal.png'),
                    activeIcon: require('../../assets/images/myWork/upload_select.png'),
                    path: 'uploadRecall',
                    query: {
                        projectNo: this.$route.query.projectNo,
                        from: this.$route.query.from,
                        status: this.$route.query.status,
                        messageMatterStatus: this.$route.query.messageMatterStatus,
                    }
                },{
                    stepRole: true,
                    name: '审核回函',
                    icon: require('../../assets/images/myWork/check_normal.png'),
                    activeIcon: require('../../assets/images/myWork/check_select.png'),
                    path: 'checkRecall',
                    query: {
                        projectNo: this.$route.query.projectNo,
                        from: this.$route.query.from,
                        status: this.$route.query.status,
                        messageMatterStatus: this.$route.query.messageMatterStatus,
                    }
                },{
                    stepRole: true,
                    name: '关联回函',
                    icon: require('../../assets/images/myWork/relative_normal.png'),
                    activeIcon: require('../../assets/images/myWork/relative_select.png'),
                    path: 'relatiopnRecall',
                    query: {
                        projectNo: this.$route.query.projectNo,
                        from: this.$route.query.from,
                        status: this.$route.query.status,
                        messageMatterStatus: this.$route.query.messageMatterStatus,
                    }
                }
                ],
                back: 0
            }
        },
        mounted() {
            this.getRole();
            this.getMatterMessage();
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
                        name == "unitCreate" ||
                        name == "uploadRecall" ||
                        name == "relatiopnRecall"
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
                    //list
                    this.$router.go(-1);
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
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    .step-wrap{
        margin: 20px auto;
    }
</style>
