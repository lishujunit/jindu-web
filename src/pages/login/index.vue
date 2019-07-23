<template>
	
	<div class="login-container">
		<div class="span_tip">
			<p>金杜律师事务所</p>
			<p>KING&WOOD</p>
			<p class="letter_spacing1">MALLESONS</p>
		</div>
		<div class="login_form">
			<h1 class="login_title">欢迎来到，金杜项目管理系统</h1>
			<div class="from_box">
				<el-form size="large" class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="60">
					<h2 class="form_h2">登 录</h2>
					<el-form-item prop="userName">
						<el-input name="userName" type="text" v-model="loginForm.userName" autoComplete="on" placeholder="请输入手机号">
						</el-input>
						<span class="icon_span"><i slot="prefix" class="iconfont icon-username"></i></span>
					</el-form-item>
					<el-form-item prop="password">
						<el-input name="password" type="password" v-model="loginForm.password" autoComplete="on" placeholder="请输入密码">
						</el-input>
						<span class="icon_span"><i slot="prefix" class="iconfont icon-password"></i></span>
					</el-form-item>
					<el-form-item prop="verifyCode">
						<el-input style="width:195px" name="verifyCode" type="text" v-model="loginForm.verifyCode" autoComplete="on" placeholder="请输入验证码">
						</el-input>
						<button type="button"  class="verify_Code_span"  @click="getVerificationCode" :disabled="btn_disabled">{{sendcode_txt}}</button>
					</el-form-item>
					<div class="prompt_bar">
						<span class="fl" @click="goForgotPwd">忘记密码?</span>
						<span class="fr" @click="goRegister">去注册>>> </span>
					</div>
					<el-button type="primary" style="width:100%;border-radius: 5px;" :loading="loading" @click.native.prevent="handleLogin" size="large">登录</el-button>
				</el-form>
			</div>

		</div>

	</div>
</template>
<script>
	import { setToken ,removeToken,setCookie } from '@/utils/auth'
	import { mapActions } from 'vuex'
	export default {
		name: 'login',
		data() {
			const validatePassword = (rule, value, callback) => {
				var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
				if(value === "") {
					callback(new Error("请输入密码!"));
				} else if(!reg.test(value)) {
					callback(new Error("8到16位之间，且必须是数字和字母的组合!"));
				} else {
					callback();
				}
			}
			return {
				sendcode_txt:'获取短信验证码',
				btn_disabled:false,
				count_time:0,
				sendUrl:'',//短信验证码url
				sendOptions:{
					phone:'',
					type:''
				},
				loginForm: {
					userName: '',
					password: '',
					verifyCode:'',
				},
				loginRules: {
					userName: [{
						required: true,
						trigger: 'blur',
						message: "请输入手机号"
					}],
					password: [{required: true,trigger: 'blur',validator: validatePassword}],
					verifyCode: [{required: true,trigger: 'blur',message:'请输入验证码!'}],
					
				},
				loading: false,
				checked: false,
				identifyCode: ""
			}
		},
		methods: {
			handleLogin() {
				this.$refs.loginForm.validate(valid => {
					if(valid) {
						this.loading = true;
//						console.log(this.loginForm)
						this.doLogin(this.loginForm).then(res => {
							console.log(res)
							this.loading = false;
							if(res.code==0){
								this.$message({
									type: 'success',
									message: '登录成功！'
								});
								// sessionStorage.setItem('userName',res.result.name)
								setToken(res.result.token);
								setCookie("roleName",res.result.roleName);
								setCookie("login_roleLink",'login');
								this.$router.push({
									path: '/customerIndex'
								})
							}else{
//								this.loginForm.userName='';
//								this.loginForm.password='';
//								this.loginForm.verifyCode='';
								removeToken();
								this.count_time=0;
								this.loading = false;
							}
							
						}).catch(error => {
							this.loading = false;
						});
					}
				})
			},
			//获取短信验证码
			getVerificationCode(){
				var reg=11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
				if(this.loginForm.userName.trim().length != 0 && reg.test(this.loginForm.userName)){
						//手机号格式正确，发送短信验证请求
						this.count_time=60;
						this.btn_disabled=true;
						this.count_down_timer();
						//发送验证码请求
						//process.env.VUE_APP_PREVIEWURL
						this.sendOptions.phone=this.loginForm.userName;
						this.sendOptions.type="CLIENT_LOGIN";
						this.doSendSms(this.sendOptions).then(res => {
							const that=this;
							
							if(res.data.code==501){
								this.$alert(res.data.msg,'提示',{}).then(()=>{
									that.count_time=0;
				                     that.sendcode_txt="获取验证码";
				                     that.btn_disabled=false;
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
						
				}else if(this.loginForm.userName.trim().length == 0){
//					alert("手机号不能为空!")
					this.$alert('手机号不能为空!','提示',{}).then(()=>{},()=>{})
				}else{
//					alert("请输入正确的手机号!")
					this.$alert('请输入正确的手机号!','提示',{}).then(()=>{},()=>{})
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
                     this.btn_disabled=false;
                }
            }, 
			//跳转注册页
			goRegister(){
				this.$router.push({path: '/register'})
			},
			//跳转找回密码页
			goForgotPwd(){
				this.$router.push({
								path: '/forgotPwd'
							})
			},
			...mapActions('login', [
				'doLogin',"doSendSms"
			])
		},
		mounted() {},
	}
</script>
<style rel="stylesheet/scss" lang="scss">
	.login-container {
		.el-input__inner {
			background: transparent;
			color: #fff;
			border: none;
			&:focus{
				background: rgba(63,106,174,0.5);
				color: #fff;
			}
			&:-webkit-autofill {
				-webkit-box-shadow: 0 0 0px 1000px rgba(63,106,174,0.9) inset !important;
				-webkit-text-fill-color:#fff;
				background: rgba(63,106,174,0.5);
			}
			&:focus{
				border-color: transparent;
			}
		}
	}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
	$bg:#e9eaef;
	$login_bg:#b3b2ae;
	$title_color:#009fe8;
	$inputbg:#3f6aae;
	h1 {
		color: $title_color;
		font-size: 24px;
		font-weight: 400;
		margin: 0 0 30px;
		letter-spacing: 2px;
	}
	
	.login-container {
		background: $bg;
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		.span_tip {
			position: absolute;
			right:5%;
			top: 0px;
			padding: 50px 10px 10px 10px;
			background: $title_color;
			color: rgba(255, 255, 255, 0.8);
			p {
				line-height: 14px;
			}
			.letter_spacing1 {
				letter-spacing: 1px;
			}
		}
		.login_form {
			position: absolute;
			top: 50%;
			left:5%;
			right: 5%;
			margin-top: -200px;
			.login_title {}
			.from_box {
				background: url('../../assets/images/login/loginbg.jpg') no-repeat left top;
				background-size: cover;
			}
			.login-form {
				padding: 0px 40px 20px 40px;
				width: 365px;
				background: rgba(0, 0, 0, 0.7);
				border-top: 4px solid $title_color;
				.form_h2 {
					font-size: 26px;
					color: #fff;
					text-align: center;
					height: 45px;
					line-height: 45px;
					padding-bottom: 20px;
					padding-top: 10px;
				}
				.el-input {
					height: 100%;
					width: 305px;
					display: inline-block;
					/*float: left;*/
					border-radius: 5px;
					margin-right: 15px;
					border: 1px solid $title_color;
					
					&:after {
						content: '';
						display: block;
						height: 2px;
						background: $inputbg;
						position: absolute;
						left: 5px;
						right: 5px;
						bottom: -5px;
					}
				}
				.icon_span {
					background: rgba(63, 106, 174, 0.7);
					width: 40px;
					text-align: center;
					color: #fff;
					border-radius: 5px;
					height: 100%;
					display: inline-block;
					border: 1px solid $title_color;
				}
				.verify_Code_span{
					background: rgba(63, 106, 174, 0.9);
					/*padding: 0 20px;*/
					width:150px;
					text-align: center;
					color: #fff;
					border-radius: 5px;
					height: 100%;
					display: inline-block;
					cursor: pointer;
					height:40px;
					cursor: pointer;
					float: right;
				
				}
				.prompt_bar{
					height: 40px;
					span{
						color: #fff;
						text-decoration: underline;
						cursor: pointer;
					}
				}
			}
		}
	}
</style>