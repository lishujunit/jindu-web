<template>
  <div>
    <myTitleBar v-if="colAboutBtn||tabViewBtn||loginStatus||onlyReadHeader||onlyReadContent||rowAboutBtn" @goBack="goBack"></myTitleBar>
    <title-bar v-else @goBack="goBack"></title-bar>
    <div style="margin: 15px 0 26px">
      <step :list="list" @handleLink="handleLink"></step>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import step from "@/components/step";
import myTitleBar from './components/MyTitleBar'
import { commonAuthApi } from "@/api/commonAuthApi";
import { getRole } from "@/api/dueDiligence";

import { mapActions,mapState } from 'vuex'
export default {
  name:"dueDiligence",
  components: {
      step,
      myTitleBar
  },
  computed: {
    ...mapState('dueDiligence', ['colAboutBtn','tabViewBtn','loginStatus','uploadJumpIn','onlyReadHeader','onlyReadContent','rowAboutBtn']),
  },
  watch:{
    loginStatus:function(val,oldval){
      if(val){
        this.list = [
          {
            name: "",
            icon: "",
            activeIcon: "",
            path: "",
            query: {}
          },
          {
            stepRole: true,
            name: "确认应答联系人",
            icon: require("@/assets/images/dueDiligence/custom_normal.png"),
            activeIcon: require("@/assets/images/dueDiligence/custom_select.png"),
            path: "confirmContacts",
            query: {
              companyId: this.$route.query.companyId,
              projectNo: this.$route.query.projectNo,
              projectName:this.$route.query.projectName,
              from: this.$route.query.from,
              status:this.$route.query.status||this.$route.query.messageMatterStatus,
            }
          },
          {
            stepRole: true,
            name: "上传资料",
            icon: require("@/assets/images/dueDiligence/upload_normal.png"),
            activeIcon: require("@/assets/images/dueDiligence/upload_select.png"),
            path: "uploadingFiles",
            query: {
              companyId: this.$route.query.companyId,
              projectNo: this.$route.query.projectNo,
              projectName:this.$route.query.projectName,
              from: this.$route.query.from,
              status:this.$route.query.status||this.$route.query.messageMatterStatus,
            }
          },
          {
            name: "",
            icon: "",
            activeIcon: "",
            path: "",
            query: {}
          },
        ]
      }else{
        this.list =[
          {
            stepRole: true,
            name: "创建清单",
            icon: require("@/assets/images/dueDiligence/create_normal.png"),
            activeIcon: require("@/assets/images/dueDiligence/create_select.png"),
            path: "createRepertoire",
            query: {
              projectNo: this.$route.query.projectNo,
              from: this.$route.query.from,
              matterNo:this.$route.query.matterNo,
              status:this.$route.query.status||this.$route.query.messageMatterStatus,
            }
          },
          {
            stepRole: true,
            name: "确认清单",
            icon: require("@/assets/images/dueDiligence/confirm_normal.png"),
            activeIcon: require("@/assets/images/dueDiligence/confirm_select.png"),
            path: "confirmRepertoire",
            query: {
              projectNo: this.$route.query.projectNo,
              from: this.$route.query.from,
              matterNo:this.$route.query.matterNo,
              status:this.$route.query.status||this.$route.query.messageMatterStatus,
            }
          },
          {
            stepRole: true,
            name: "确认应答联系人",
            icon: require("@/assets/images/dueDiligence/custom_normal.png"),
            activeIcon: require("@/assets/images/dueDiligence/custom_select.png"),
            path: "confirmContacts",
            query: {
              companyId: this.$route.query.companyId,
              projectNo: this.$route.query.projectNo,
              projectName:this.$route.query.projectName,
              from: this.$route.query.from,
              status:this.$route.query.status||this.$route.query.messageMatterStatus,
            }
          },
          {
            stepRole: true,
            name: "发布清单",
            icon: require("@/assets/images/dueDiligence/relative_normal.png"),
            activeIcon: require("@/assets/images/dueDiligence/relative_select.png"),
            path: "publishedPlan",
            query: {
              projectNo: this.$route.query.projectNo,
              from: this.$route.query.from,
              matterNo:this.$route.query.matterNo,
              status:this.$route.query.status||this.$route.query.messageMatterStatus,
            }
          },
          {
            stepRole: true,
            name: "上传资料",
            icon: require("@/assets/images/dueDiligence/upload_normal.png"),
            activeIcon: require("@/assets/images/dueDiligence/upload_select.png"),
            path: "uploadingFiles",
            query: {
              companyId: this.$route.query.companyId,
              projectNo: this.$route.query.projectNo,
              projectName:this.$route.query.projectName,
              from: this.$route.query.from,
              status:this.$route.query.status||this.$route.query.messageMatterStatus,
            }
          },
          {
            stepRole: true,
            name: "资料审核及关联",
            icon: require("@/assets/images/dueDiligence/check_normal.png"),
            activeIcon: require("@/assets/images/dueDiligence/check_select.png"),
            path: "auditAndCorrelation",
            query: {
              projectNo: this.$route.query.projectNo,
              from: this.$route.query.from,
              matterNo:this.$route.query.matterNo,
              status:this.$route.query.status||this.$route.query.messageMatterStatus,
            }
          },
          {
            stepRole: true,
            name: "确认关联",
            icon: require("@/assets/images/dueDiligence/relative_normal.png"),
            activeIcon: require("@/assets/images/dueDiligence/relative_select.png"),
            path: "confirmRelevance",
            query: {
              projectNo: this.$route.query.projectNo,
              from: this.$route.query.from,
              matterNo:this.$route.query.matterNo,
              status:this.$route.query.status||this.$route.query.messageMatterStatus,
            }
          },
          {
            stepRole: true,
            name: "确认资料",
            icon: require("@/assets/images/dueDiligence/relative_normal.png"),
            activeIcon: require("@/assets/images/dueDiligence/relative_select.png"),
            path: "confirmInformation",
            query: {
              projectNo: this.$route.query.projectNo,
              from: this.$route.query.from,
              matterNo:this.$route.query.matterNo,
              status:this.$route.query.status||this.$route.query.messageMatterStatus,
            }
          },
          {
            stepRole: true,
            name: "关联底稿",
            icon: require("@/assets/images/dueDiligence/relative_normal.png"),
            activeIcon: require("@/assets/images/dueDiligence/relative_select.png"),
            path: "relevanceManuscript",
            query: {
              projectNo: this.$route.query.projectNo,
              from: this.$route.query.from,
              matterNo:this.$route.query.matterNo,
              status:this.$route.query.status||this.$route.query.messageMatterStatus,
            }
          }
        ]
      }
      // this.list.forEach(v=>{
      //     v.query.id=this.$route.params.id
      // })
    }

  },
  data() {
    return {
      title: "",//标题
      list: [
        {
          stepRole: true,
          name: "创建清单",
          icon: require("@/assets/images/dueDiligence/create_normal.png"),
          activeIcon: require("@/assets/images/dueDiligence/create_select.png"),
          path: "createRepertoire",
          query: {
            projectNo: this.$route.query.projectNo,
            from: this.$route.query.from,
            matterNo:this.$route.query.matterNo,
            status:this.$route.query.status||this.$route.query.messageMatterStatus,
          }
        },
        {
          stepRole: true,
          name: "确认清单",
          icon: require("@/assets/images/dueDiligence/confirm_normal.png"),
          activeIcon: require("@/assets/images/dueDiligence/confirm_select.png"),
          path: "confirmRepertoire",
          query: {
            projectNo: this.$route.query.projectNo,
            from: this.$route.query.from,
            matterNo:this.$route.query.matterNo,
            status:this.$route.query.status||this.$route.query.messageMatterStatus,
          }
        },
        {
          stepRole: true,
          name: "确认应答联系人",
          icon: require("@/assets/images/dueDiligence/custom_normal.png"),
          activeIcon: require("@/assets/images/dueDiligence/custom_select.png"),
          path: "confirmContacts",
          query: {
            companyId: this.$route.query.companyId,
            projectNo: this.$route.query.projectNo,
            projectName:this.$route.query.projectName,
            from: this.$route.query.from,
            status:this.$route.query.status||this.$route.query.messageMatterStatus,
          }
        },
        {
          stepRole: true,
          name: "发布清单",
          icon: require("@/assets/images/dueDiligence/relative_normal.png"),
          activeIcon: require("@/assets/images/dueDiligence/relative_select.png"),
          path: "publishedPlan",
          query: {
            projectNo: this.$route.query.projectNo,
            from: this.$route.query.from,
            matterNo:this.$route.query.matterNo,
            status:this.$route.query.status||this.$route.query.messageMatterStatus,
          }
        },
        {
          stepRole: true,
          name: "上传资料",
          icon: require("@/assets/images/dueDiligence/upload_normal.png"),
          activeIcon: require("@/assets/images/dueDiligence/upload_select.png"),
          path: "uploadingFiles",
          query: {
            companyId: this.$route.query.companyId,
            projectNo: this.$route.query.projectNo,
            projectName:this.$route.query.projectName,
            from: this.$route.query.from,
            status:this.$route.query.status||this.$route.query.messageMatterStatus,
          }
        },
        {
          stepRole: true,
          name: "资料审核及关联",
          icon: require("@/assets/images/dueDiligence/check_normal.png"),
          activeIcon: require("@/assets/images/dueDiligence/check_select.png"),
          path: "auditAndCorrelation",
          query: {
            projectNo: this.$route.query.projectNo,
            from: this.$route.query.from,
            matterNo:this.$route.query.matterNo,
            status:this.$route.query.status||this.$route.query.messageMatterStatus,
          }
        },
        {
          stepRole: true,
          name: "确认关联",
          icon: require("@/assets/images/dueDiligence/relative_normal.png"),
          activeIcon: require("@/assets/images/dueDiligence/relative_select.png"),
          path: "confirmRelevance",
          query: {
            projectNo: this.$route.query.projectNo,
            from: this.$route.query.from,
            matterNo:this.$route.query.matterNo,
            status:this.$route.query.status||this.$route.query.messageMatterStatus,
          }
        },
        {
          stepRole: true,
          name: "确认资料",
          icon: require("@/assets/images/dueDiligence/relative_normal.png"),
          activeIcon: require("@/assets/images/dueDiligence/relative_select.png"),
          path: "confirmInformation",
          query: {
            projectNo: this.$route.query.projectNo,
            from: this.$route.query.from,
            matterNo:this.$route.query.matterNo,
            status:this.$route.query.status||this.$route.query.messageMatterStatus,
          }
        },
        {
          stepRole: true,
          name: "关联底稿",
          icon: require("@/assets/images/dueDiligence/relative_normal.png"),
          activeIcon: require("@/assets/images/dueDiligence/relative_select.png"),
          path: "relevanceManuscript",
          query: {
            projectNo: this.$route.query.projectNo,
            from: this.$route.query.from,
            matterNo:this.$route.query.matterNo,
            status:this.$route.query.status||this.$route.query.messageMatterStatus,
          }
        }
      ],//公共路径样式图的数据
      role:"",//权限 Partnership(大律师)  Resp(负责律师)  Exec(执行律师) Client_Advance(保密客户) Client_Normal(普通客户)
    };
  },
  methods: {
    //拥有权限进入的页面资格
    handleLink(route) {
        let name = route.path;
        let query = route.query;
        let userRole = this.role;
        console.log(userRole)
        //Partnership(大律师)  Resp(负责律师)  Exec(执行律师) Client_Advance(保密客户) Client_Normal(普通客户)
        if (userRole == "Partnership" || userRole == "Resp") {
          if(name == 'uploadingFiles'||name=="confirmContacts"){
            this.$alert('无权限', '提示', {confirmButtonText: '确定',type: "warning"});
          }else{
            this.$router.push({name: name, query: query});
          }
        } else if(userRole=='Exec') {
            if (
                name == "createRepertoire" ||
                name == "publishedPlan" ||
                name == "auditAndCorrelation"||
                name == "relevanceManuscript"
            ) {  //执行律师能进入的页面 尽调第1,4,6,9步
                this.$router.push({name: name, query: query});
            } else {
                this.$alert('无权限', '提示', {confirmButtonText: '确定',type: "warning"});
            }
        }else{
          if(name == 'uploadingFiles'||name=="confirmContacts"){
            this.$router.push({name: name, query: query});
          }else{
            this.$alert('无权限', '提示', {confirmButtonText: '确定',type: "warning"});
          }
        }
    },
    //点击返回按钮
    goBack(){ 
      const from = this.$route.query.from;
      const projectNo = this.$route.query.projectNo;
      // /myWork/list (工作台列表)
      // /myWork/details/K201905240000000003 (项目详情页)
      if (from == "details") {
        this.setCompanyAboutData({id:''})
        sessionStorage.setItem('getInto','')
        this.$router.push({ path: "/myWork/details/"+projectNo});
      } else if(from == "list"){
        //list
        this.setCompanyAboutData({id:''})
        sessionStorage.setItem('getInto','')
        this.$router.push({ path: "/myWork/list" });
      }else if(from == "myWorkCustomerList"){
        sessionStorage.setItem('getInto','')
        this.$router.push({ path: "/customerIndex/index" });
      }else if(from=='dueDiligence'){
        sessionStorage.setItem('getInto','')
        this.$router.go(-1)
      }else if(from=='message'){
        sessionStorage.setItem('getInto','')
        this.$router.go(-1);
      }else{
        this.setCompanyAboutData({id:''})
        sessionStorage.setItem('getInto','')
        this.$router.push({ path: "/myWork/list" });
      }
    },
    //获取该用户在该页面的权限
    getRole() {
      let name = this.$route.path.split('/')[2];
      console.log(name);
      if(name != 'uploadingFiles'&&name!="confirmContacts"&&name.indexOf('AddAccessory')=='-1'){
        commonAuthApi(this.$route.query.projectNo).then(res => {
          this.role = this.setRole(res.result)
          console.log(this.role);
          let getInto = sessionStorage.getItem('getInto')
          if((this.role == "Partnership" ||this.role == 'Resp')&&!getInto){
            this.$router.push({name: 'confirmRepertoire', query: this.list[1].query});
            sessionStorage.setItem('getInto','IntoStatus')
          }
        });
      }else if(name == 'uploadingFiles'||name =="confirmContacts"){
        getRole(this.$route.query.projectNo).then(res=>{
          this.role = this.setRole(res.result)
          console.log(res.result)
        })
      }
    },
    //获取改用户最大权限
    setRole(str) {
      if (str.indexOf("Partnership") > -1) {
        //Partnership(大律师)
        return "Partnership";
      }
      if (str.indexOf("Resp") > -1) {
        //Resp(负责律师)
        return "Resp";
      }
      if (str.indexOf("Exec") > -1) {
        //Exec(执行律师)
        return "Exec";
      }
      // if (str.indexOf("Client") > -1) {
      //   //Client(普通客户)
      //   return "Client";
      // }
      if (str.indexOf("Client_Advance") > -1) {
        //Client_Advance(保密客户)
        return "Client_Advance";
      }
      if (str.indexOf("Client_Normal") > -1) {
        //Client_Normal(普通客户)
        return "Client_Normal";
      }
    },
    ...mapActions('dueDiligence',['setCompanyAboutData'])
  },
  created(){
    if(this.$route.query.messageMatterStatus==2){
      this.$alert('该项目已完成', '提示', {confirmButtonText: '确定',type: "warning"});
    }
    // this.$route.query.messageMatterStatus
    this.getRole()
  },
};
</script>
