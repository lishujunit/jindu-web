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
					<h2 class="form_h2">律 师 登 录</h2>
					<el-form-item prop="domainUserAccount">
						<el-input name="domainUserAccount" type="text" v-model="loginForm.domainUserAccount" autoComplete="on" placeholder="请输入用户名">
						</el-input>
						<span class="icon_span"><i slot="prefix" class="iconfont icon-username"></i></span>
					</el-form-item>


					<el-button type="primary" style="width:100%;border-radius: 5px;" :loading="loading" @click.native.prevent="handleLogin" size="large">登录</el-button>
				</el-form>
			</div>

		</div>

	</div>
</template>
<script>
	import { setToken ,removeToken,setCookie,removeCookie } from '@/utils/auth'
	import { mapActions } from 'vuex'
	export default {
		name: 'login',
		data() {
			return {
				loading:false,
				loginForm: {
					domainUserAccount: ''
				},
				loginRules: {
					domainUserAccount: [{
						required: true,
						trigger: 'blur',
						message: "请输入用户名"
					}],
					
				}
			}
		},
		methods: {
			//自动登录
			automaticLogin(tokenKey){
//				alert(1)
				this.autoAdLogin(tokenKey).then(res => {
					console.log(res)
							this.loading = false;
							if(res.code==0){
								this.$message({
									type: 'success',
									message: '登录成功！'
								});
								// sessionStorage.setItem('userName',res.result.name)
								setCookie("roleName",res.result.roleName);
								setCookie("adlogin_roleLink",'adlogin');
								setCookie("devops_role_name",res.result.devopsRoleName); //保存运维权限
								setToken(res.result.token)
								this.$router.push({
									path: '/myWork'
								})
							}else{
								removeCookie('roleName');
							}
				}).catch(error => {
							this.loading = false;
						});
			},
			handleLogin() {
        console.log('handleLogin')
				this.$refs.loginForm.validate(valid => {
					if(valid) {
						this.loading = true;
						console.log(this.loginForm)
						this.doAdLogin(this.loginForm).then(res => {
							console.log(res)
							this.loading = false;
							if(res.code==0){
								this.$message({
									type: 'success',
									message: '登录成功！'
								});
								sessionStorage.setItem('userName',res.result.name)
								setCookie("roleName",res.result.roleName);
								setCookie("adlogin_roleLink",'adlogin');
								setCookie("devops_role_name",res.result.devopsRoleName); //保存运维权限
								setToken(res.result.token)
								this.$router.push({
									path: '/myWork'
								})
							}else{
								removeCookie('roleName');
							}
							
						}).catch(error => {
							this.loading = false;
						});
					}
				})
			},
			
			...mapActions('login', [
				'doAdLogin','autoAdLogin'
			])
		},
		mounted() {
			//判断url中是否有tokenKey参数，有的话进行自动登录
			const tokenKey=this.$route.query.tokenKey;
//			console.log(tokenKey)
			if(tokenKey){
				this.automaticLogin(tokenKey);
			}
		}
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