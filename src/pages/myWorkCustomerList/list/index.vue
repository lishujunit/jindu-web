<template>
    <div>
        <div class="my-work-wrap" v-for="(item,index) in customerList" :key="index">
            <div class="my-work-title">
                <p></p>
                <p>项目名称：{{item.projectName}}</p>
            </div>
            <div class="my-work-conten">
                <div class="content-title clearfix">
                    <span></span>
                    <span>基本信息</span>
                    <!--<span @click="toDetails" v-if="roleName ==='Client_advance'">确认应答联系人</span>-->
                    <!--<span @click="toUplod" v-else-if="roleName=='Client_normal'">上传资料</span>-->
                </div>
                <div class="content-list">
                    <div>
                        <h3>
                            <p>项目编号：</p>
                            <p>负责律师：</p>
                        </h3>
                        <h3>
                            <p>
                                <span>{{item.projectNo}}</span>
                                <span class="process" v-if="item.status=='0'">未完成</span>
                                <span class="process" v-if="item.status=='1'">准备中</span>
                                <span class="process" v-if="item.status=='2'">进行中</span>
                                <span class="process" v-if="item.status=='3'">已完成</span>
                            </p>
                            <p>
                                {{item.inChargeLawyer}}
                            </p>
                        </h3>
                    </div>
                    <div>
                        <h3>
                            <p>项目名称：</p>
                            <p>负责合伙人律师：</p>
                        </h3>
                        <h3>
                            <p>{{item.projectName}}</p>
                            <p>{{item.sponsorPartner}}</p>
                        </h3>
                    </div>
                    <div>
                        <h3>
                            <p>立项时间：</p>
                            <p></p>
                        </h3>
                        <h3>
                            <p>
                                <span>{{item.setUpTime}}</span>
                                <!--<span class="time">13点12分</span>-->
                            </p>
                            <p></p>
                        </h3>
                    </div>
                </div>
                <div class="content-title mt30 clearfix" v-show="item.customerMatterVOList">
                    <span></span>
                    <span>事项</span>
                </div>
                <div class="projectList clearfix" v-show="item.customerMatterVOList">
                  <div v-for="(item2,index) in item.customerMatterVOList" :key="index">
                    <p>{{item2.desc}}</p>
                    <p @click="toUplod(item,item2)" v-if="item2.uploadDataList.length!=0 " class="last-one"><el-button type="primary">上传资料</el-button></p>
                    <p @click="toDetails(item,item2)" v-if="item2.unconfirmedList.length!=0" class="last-one mr20"><el-button type="primary">确认应答联系人</el-button></p>
                  </div>
                </div>
                <!--<div class="projectList clearfix" v-if="item.customerMatterVOList.unconfirmedList !=''">-->
                    <!--<div v-for="(item2,index) in item.customerMatterVOList.unconfirmedList" :key="index">-->
                        <!--<p>{{item2.name}}</p>-->
                        <!--<p @click="toDetails"><el-button type="primary">确认应答联系人</el-button></p>-->
                    <!--</div>-->
                <!--</div>-->
            </div>
        </div>
        <!--提示弹框-->
        <el-dialog
                class="customer-dialog"
                :visible.sync="dialogVisible"
                width="40%"
                :close-on-click-modal="false"
                :show-close="false"
                center>
            <div class="customer-dilaog-center">
                <h3>免责声明</h3>
                <p>暂无内容</p>
            </div>
            <span slot="footer" class="dialog-footer">
                 <el-button type="primary" @click="handleConfirm">接 受</el-button>
                 <el-button @click="dialogVisible = false">不接受</el-button>
             </span>
        </el-dialog>
    </div>
</template>


<script>
    import { customerProject } from '@/api/customerList'
    import { getCookie } from '@/utils/auth'
    export default {
        name: "index",
        data(){
          return{
              customerList:[],
              roleName:'',
              upload:[],
              person:[],
              clientShow:0,
              dialogVisible:false,
              dueWorkunitId:'',
              companyId:'',
              projectNo:'',
              projectName:'',
              status:'',
          }
        },
        mounted(){
          this.getData();
          this.getRole();

        },
        methods:{
            toDetails(val1,val2){
                this.$router.push({ path:'/dueDiligence/confirmContacts/'+val2.dueWorkunitId,query: { companyId:val2.unconfirmedList[0].companyId,projectNo:val1.projectNo,projectName:val1.projectName, from: 'myWorkCustomerList',status:val1.status }});
            },
            toUplod(val1,val2){
                this.dialogVisible = true
                this.dueWorkunitId=val2.dueWorkunitId
                this.companyId=val2.uploadDataList[0].companyId
                this.projectNo=val1.projectNo
                this.projectName=val1.projectName
                this.status=val1.status
            },
            //弹框确认
            handleConfirm(){
                this.$router.push({ path:'/dueDiligence/uploadingFiles/'+this.dueWorkunitId,query: { companyId:this.companyId,projectNo: this.projectNo,projectName:this.projectName, from: 'myWorkCustomerList',status:this.status }});
            },
            getData(){
                let vm = this;
                customerProject().then((res)=>{
                    if (res.code == 0){
                        vm.customerList = res.result;

                    }
                })
            },
            getRole(){
                this.roleName=getCookie("roleName")
                if (this.roleName === 'Client_normal'){
                    this.clientShow = 0
                }else{
                    this.clientShow = 1
                }
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "@/assets/css/varibles.scss";
    .my-work-wrap{
        color: $txt-color;
        font-size: 14px;
        line-height: 1.6;
        .my-work-title{
            height: 50px;
            line-height: 50px;
            font-size: 16px;
            font-weight: 600;
            >p{
                float: left;
            }
            >p:first-of-type{
                content: '';
                width: 5px;
                height: 28px;
                background-color: $global-color;
                margin-right: 8px;
                margin-top: 11px;
            }
        }
        .my-work-conten{
            background: #fff;
            padding: 20px;
            position: relative;
            .content-title{
                width: 100%;
                >span:first-of-type{
                    width: 10px;
                    height: 10px;
                    float: left;
                    padding: 0;
                    margin: 6px 10px 0 0 ;
                }
                >span:nth-of-type(2){
                    float: left;
                    background: #fff;
                    color: #000;
                    padding: 0;
                }
                >span{
                    float: right;
                    background: $global-color;
                    border-radius: 16px;
                    padding: 4px 30px;
                    color: #fff;
                    cursor: pointer;
                }
            }
            .content-list{
                display: flex;
                >div{
                    justify-content: center;
                    flex: 1;
                    margin-left: 10px;
                    color: $txt-color;
                    >h3{
                        float: left;
                        font-size: 14px;
                        line-height: 2.4;
                        .process{
                            border: 1px solid #000;
                            margin-left: 10px;
                            font-size: 12px;
                            padding: 1px 4px;
                            border-radius: 2px;
                        }
                        .time{
                            margin-left: 20px;
                        }
                        .person{
                            color: $global-color;
                        }
                    }
                    >h3:first-of-type{
                        text-align: right;
                        margin-right: 6px;
                    }

                }
            }
            .projectList{
               >div{
                   margin-top: 20px;
                   width: 51%;
                   min-width: 500px;
                   float: left;
                   line-height: 1.6;
                   border-bottom: 1px solid #bcbfcb;
                   padding-bottom: 10px;
                   >p{
                       float: left;
                       margin-top: 6px;
                   }
                   >p:first-of-type{
                       font-weight: bold;
                   }
                   .last-one{
                       float: right;
                   }
               }

            }
        }

    }
    .mt30{
        margin-top: 30px;
    }
    .mr20{
        margin-right: 20px;
    }
</style>
<style rel="stylesheet/scss" lang="scss">
    .customer-dialog{
        .el-dialog__header{
            display: none;
        }
        .customer-dilaog-center{
            >h3{
                font-size: 18px;
                font-weight: bold;
                text-align: center;
                margin: 20px 0;
            }
        }
    }
</style>
