<template>
	<div>
		<navbar></navbar>
		<div class="register_container">
			<h2 class="register_title">激活项目权限</h2>
			<div class="register_from">
				<el-form  size="large"  autoComplete="on" :model="registerVertifyForm" ref="registerVertifyForm" :rules="registerVertifyRules"  label-width="100px">
					<el-form-item label="邀请码" prop="inviteCode">
				    	<el-input name="inviteCode" type="text" v-model="registerVertifyForm.inviteCode" autocomplete="off" placeholder="请输入项目邀请码,例如:K0117030191-458393"></el-input>
				  	</el-form-item>
				  	<!--<el-form-item label="姓名" prop="name">
				    	<el-input name="name" type="text" v-model="registerVertifyForm.name" autocomplete="off" placeholder="请输入您的真实姓名"></el-input>
				  	</el-form-item>-->
				  	<el-form-item label="手机号" prop="userName">
				    	<el-input name="userName" type="text" v-model="registerVertifyForm.userName" autocomplete="off" placeholder="请输入11位常用手机号码，后续登录时需使用"></el-input>
				  	</el-form-item>
				  	<el-form-item label="短信验证码" prop="verifyCode">
				    	<el-input name="verifyCode" type="text" class="note_verfy_text" v-model="registerVertifyForm.verifyCode" autocomplete="off" placeholder="请保存好提醒信息"></el-input>
				    	<button type="button" :disabled="verfy_btn_disabled" class="note_verfy_btn" @click="getVerificationCode">{{sendcode_txt}}</button>
				  	</el-form-item>
				  	<div class="register_submit">
				  		<el-button type="primary" style="width:70%;" class="fl"  size="large" @click="submit_validate" :loading="loading">提交验证</el-button>
				  		<span  class="a_linkbtn fr" @click="goLogin">去登录>>> </span>
				  	</div>
				</el-form>
			</div>
		</div>
	</div>
	</template>
<script>
	import navbar from './components/navbar'
	import { mapState,mapActions } from 'vuex'
	import { goRegister,confirmfirst,confirm } from '@/api/user'
	export default{
		data(){
			const validateName = (rule, value, callback) => {
				if(value.trim().length == 0) {
					callback(new Error('请输入姓名'))
				} else if(value.trim().length>50){
					callback(new Error('姓名长度不超过50个字符'))
				}else {
					callback()
				}
			}
			const validatePhone=(rule,value,callback) => {
				var reg=11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
				if(value.trim().length == 0){
					callback(new Error("请输入手机号!"))
				} else if(!reg.test(value)){
					callback(new Error("手机格式不正确!"))
				}else {
					callback();
				}
			}
			return{
				loading:false,
//				register_activate:false,//是否激活
				register_submit_text:"提交验证",
				verfy_btn_disabled:false,
				count_time:0,
				sendcode_txt:'获取短信验证码',
//				firstFlag:true,//是否是第一次激活
				userName:'',
				sendOptions:{
					phone:'',
					type:''
				},
				//提交验证
				registerVertifyForm: {
					inviteCode: '',//邀请码
//					name:'',//姓名
					userName:'',
					verifyCode:''//验证码
				},
				registerVertifyRules: {
					inviteCode: [{required: true,message:'请输入邀请码',trigger: 'blur'}],
//					name:[{required: true,trigger: ['blur','change'],validator:validateName}],
					userName:[{required: true,trigger: 'blur',validator:validatePhone}],
					verifyCode:[{required: true,message:'请输入验证码',trigger: 'blur'}]
				},
			}
		},
		components:{
			navbar,
			
		},
		computed: {
	        ...mapState('login', ['firstFlag'])
	    },
	    created (){
//	    	alert('11111')
	    },
	    destroyed() {
//	    	alert('2222')
//	    	this.setRegisterActivate(false);
//			 window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
		},
		methods:{
			//登录跳转
			goLogin(){
				this.$router.push({
					path:'/login'
				})
			},
			//提交验证
			submit_validate(){
				const that=this;
				this.$refs.registerVertifyForm.validate(valid => {
					if(valid) {
						this.loading=true;
						//提交验证   是否是第一次激活
//						console.log(this.registerVertifyForm)
						goRegister(this.registerVertifyForm).then(res=>{
							console.log(this.registerVertifyForm)
							this.loading=false;
							if(res.code==0){
								const flag=res.result.firstFlag=="Y"?true:false;
								this.setFirstFlag(flag);
								//存储用户名及手机号
								this.setActivateUserName(this.registerVertifyForm.userName);
								//存储用邀请码
								this.setInviteCode(this.registerVertifyForm.inviteCode);
								//跳转到下一步
								that.$router.push({path:'/register_sec'})
							}
							
						}).catch(error => {});
					}
				});
			},
			//判断第几次激活
			submit_validate_next(flag,userName){
				if(flag){
					//第一次激活
					confirmfirst()
				}else{
					//再次激活
					confirm()
				}
			},
			//获取短信验证码
			getVerificationCode(){
				var reg=11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
				if(this.registerVertifyForm.userName.trim().length != 0 && reg.test(this.registerVertifyForm.userName)){
						//手机号格式正确，发送短信验证请求
//						alert("短信发送了");
						this.count_time=60;
						this.verfy_btn_disabled=true;
						this.count_down_timer();
						//发送验证码请求
						this.sendOptions.phone=this.registerVertifyForm.userName;
						this.sendOptions.type="CLIENT_REGEDIT";
						this.doSendSms(this.sendOptions).then(res => {
							const that=this;
							
							if(res.data.code==501){
								this.$alert(res.data.msg,'提示',{}).then(()=>{
									 that.count_time=0;
				                     that.sendcode_txt="获取验证码";
				                     that.verfy_btn_disabled=false;
								},()=>{})
								return false;
							}
							if(res.data.code==0){
								//发送成功
								this.$message({
									type: 'success',
									message:res.data.msg+ ',请注意查收手机短信验证码！'
								});	
							}
							
						});
				}else if(this.registerVertifyForm.userName.trim().length == 0){
//					alert("手机号不能为空!")
					this.$alert('手机号不能为空！','提示',{}).then(()=>{},()=>{})
				}else{
//					alert("请输入正确的手机号!")
					this.$alert('请输入正确的手机号！','提示',{}).then(()=>{},()=>{})
				}
			},
			//验证码倒计时效果
			count_down_timer() {
                if (this.count_time > 0) {
                     this.count_time--;
                     this.sendcode_txt=this.count_time+"s后重新获取";
                     setTimeout(this.count_down_timer, 1000);
                } else{
                     this.count_time=0;
                     this.sendcode_txt="获取验证码";
                     this.verfy_btn_disabled=false;
                }
            },
            ...mapActions('login',['doSendSms','setFirstFlag','setActivateUserName','setInviteCode'])
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	$main_color:#009fe8;
	$text_color:#1f212d;
	$border_color:#d5d5d5;
	.register_container{
		min-width: 500px;
		width: 40%;
		border-top: 2px solid $main_color;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		-webkit-transform: translate(-50%,-50%);
		-moz-transform: translate(-50%,-50%);
		-ms-transform: translate(-50%,-50%);
		-o-transform: translate(-50%,-50%);
		background: #fff;
		.register_title{
			padding: 25px 0px;
			text-align: center;
			font-size: 30px;
			color: $text_color;
			border-bottom: 1px solid $border_color;
		}
		.register_from{
			padding: 30px;
			.register_submit{
				height: 40px;
				padding-left:22px;
				.a_linkbtn{
					/*float: right;*/
					height: 40px;
					line-height: 40px;
					display: block;
					color: #09b4ee;
					cursor: pointer;
				}
			}
			.note_verfy_text{
				width: 60%;
				/*margin-right: 20px;*/
			}
			.note_verfy_btn{
				cursor: pointer;
				background: #666666;
				color: #fff;
				height:40px;
				width: 120px;
				display: inline-block;
				padding: 0 10px;
				float: right;
			}
			
		}
	}
</style>
