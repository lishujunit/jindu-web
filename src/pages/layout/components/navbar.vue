<template>
    <header>
        <img class="fl" :src="require('@/assets/images/logo.png')">
        <span class="fl title">金杜项目管理系统</span>
        <div class="fr">
            <div class="item fl" @click="myMessage">
                <i class="iconfont icon-news" ></i>
                <span class="badge" v-show="number > 0">new</span>
                <span class="message-text" :class="{active:isActive}">消息</span>
            </div>
            <!-- <div class="item fl">
                <i class="iconfont icon-account"></i>
                账户管理
            </div> -->
            <div class="item fl" @click="logout">
                <i class="iconfont icon-exit"></i>
                退出
            </div>
        </div>
    </header>
</template>
<script>
import { mapActions } from 'vuex'
import { messageTitleApi,messageUser } from '@/api/systemManageApi'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
export default {
    name:'',
    data() {
        return {
            number:0,
            isActive:true,
            timer:'',
            stompClient:'',
            userId:'',
        }
    },
    mounted(){
        this.connect()
        this.showBadge()
    },
    created(){
        this.getUser()
    },
    methods: {
        getUser(){
            messageUser().then((res)=>{
                if (res.code == 0){
                    this.userId = res.result.id
                    window.localStorage.setItem('messageId',this.userId)
                }
            })
        },
        connect() {
            let _this = this;
            var sock = new SockJS(process.env.VUE_APP_BASEURL + "/websocketServer");
            var stomp = Stomp.over(sock);
            stomp.connect('guest', 'guest', function (frame) {
                // console.log(frame)
                stomp.subscribe('/user/' + window.localStorage.getItem('messageId') + '/queue/notice', function (response) {
                    // console.log(response.body)
                    _this.showBadge();
                });

            });
        },
        showBadge(){
            messageTitleApi().then((res)=>{
                if (res.code == 0){
                    this.number = Number(res.result)
                    // console.log(res)
                    if (this.number != 0){
                        this.isActive = false
                    }
                }
            })
        },
        logout() {
            this.$confirm('是否确定退出系统?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
            	this.doLogOut().then(res=>{
            		if(res.code==0){
            			//跳转到登录页面
  						this.$router.push('/'+process.env.VUE_APP_LOGIN);
            		}
            	})
            }).catch(() => {
            });
        },
        myMessage(){
            this.$router.push('/systemMessage')
        },

        ...mapActions('login', [
				'doLogOut'
			])
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
header {
    background-color: #1f212d;
    height: 50px;
    padding: 0 50px 0 15px;
    position: relative;
    >img {
        height: 50px;
        display: block;
    }

    .title {
        font-weight: 700;
        font-size: 16px;
        color: #fff;
        line-height: 50px;
        margin-left: 4px;
        display: block;
    }

    .item {
        color: #fff;
        line-height: 50px;
        margin-left: 25px;
        cursor: pointer;

        .iconfont {
            margin-right: 5px;
            font-size: 18px;
            display: block;
            float: left;
        }
    }
    .badge{
        position: absolute;
        border-radius: 10px;
        background: red;
        line-height: 0;
        top: 4px;
        width: 20px;
        text-align: center;
        margin-left: -14px;
        padding: 10px;
        -webkit-box-sizing: content-box;
        box-sizing: content-box;
    }
    .message-text{
        margin-left: 20px;
        &.active{
            margin-left: 0px;
        }
    }
}
</style>
