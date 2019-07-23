<template>
	<div class="login-container">
		<el-form size="large" class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="60">
			<div class="title-container">
				<h1>后台管理系统</h1>
			</div>
			<el-form-item class="border" prop="username">
				<el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名">
					<i slot="prefix" class="iconfont icon-username"></i>
				</el-input>
			</el-form-item>
			<el-form-item prop="password" class="border">
				<el-input name="password" type="password" v-model="loginForm.password" autoComplete="on" placeholder="密码">
					<i slot="prefix" class="iconfont icon-password"></i>
				</el-input>
			</el-form-item>
			<el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin" size="large">登录</el-button>
		</el-form>
	</div>
</template>
<script>
import { setToken } from '@/utils/auth'
import { mapActions } from 'vuex'
export default {
	name: 'login',
	data() {
		const validateUsername = (rule, value, callback) => {
			if (value.trim().length == 0) {
				callback(new Error('请输入用户名'))
			} else {
				callback()
			}
		}
		const validatePassword = (rule, value, callback) => {
			if (value.length < 6 || value.length > 23) {
				callback(new Error('密码必须在6~22位之间'))
			} else {
				callback()
			}
		}

		return {
			loginForm: {
				username: '',
				password: '',
				code: ''
			},
			loginRules: {
				username: [{ required: true, trigger: 'blur', validator: validateUsername }],
				password: [{ required: true, trigger: 'blur', validator: validatePassword }]
			},
			loading: false,
			checked: false,
			identifyCode: ""
		}
	},
	methods: {
		handleLogin() {
			this.$refs.loginForm.validate(valid => {
				if (valid) {
					this.loading = true
					this.doLogin(this.loginForm).then(res => {
						this.loading = false
						this.$message({
							type: 'success',
							message: '登录成功！'
						});
						setToken("123456")
						this.$router.push({ path: '/' })
					})
				}
			})
		},
		...mapActions('login', [
			'doLogin'
		])
	},
	mounted() {},
}
</script>
<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
	.el-input {
		input {
			background: transparent;
			border: 0px;
			-webkit-appearance: none;
			border-radius: 0px;
			padding: 0 5px 0 35px;
			color: $light_gray;

			&:-webkit-autofill {
				-webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
				-webkit-text-fill-color: #fff !important;
			}

		}

		.el-input__prefix {
			left: 10px;
		}
	}

	.border.el-form-item {
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: #454545;
		margin-bottom: 30px;
	}

}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
h1 {

	color: rgba(255, 255, 255, 0.8);
	font-size: 25px;
	text-align: center;
	font-weight: 400;
	margin:0 0 30px;
	letter-spacing: 2px;
}

$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
	background-color: $bg;
	background-position: center bottom;
	background-size: 70% auto;
	background-repeat: no-repeat;
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;

	.login-form {
		padding: 40px;
		width: 482px;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.1);
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -241px;
		margin-top: -200px;

		.title-container {
			margin: 0 auto;
			line-height: 30px;
			color: $light-gray;
			position: relative;
			text-align: center;

			.title {
				margin-top: 0;
				letter-spacing: 5px;
			}

		}


		.el-form-item.el-form-item--medium {
			.el-form-item__content {
				height: 40px;

				.el-input {
					height: 100%;
					width: 358px;
					display: block;
					float: left;
				}
			}

			.el-form-item__error {
				padding-top: 8px;
			}
		}

		.iconfont {
			color: $light_gray;
		}
	}
}
</style>