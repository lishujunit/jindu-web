<template>
	<div>
		<navbar></navbar>
		<div class="register_container">
			<h2 class="register_title">重设密码</h2>
			<div class="register_from">
				<el-form  size="large"  autoComplete="on" :model="passwordForm" ref="passwordForm" :rules="passwordRules"  label-width="100px">
				  	<el-form-item label="设置新密码" prop="password">
				    	<el-input name="password" type="password" v-model="passwordForm.password" placeholder="8到16位之间，必须是数字和字母的组合" autocomplete="off"></el-input>
				  	</el-form-item>
				  	<el-form-item label="确认新密码" prop="confirmPassword">
				    	<el-input name="confirmPassword" type="password" v-model="passwordForm.confirmPassword" placeholder="8到16位之间，必须是数字和字母的组合" autocomplete="off"></el-input>
				  	</el-form-item>
				  	<div class="register_submit">
				  		<el-button type="primary" style="width:70%;" class="fl"  size="large" @click="submit_validate_resetpwd">提交</el-button>
				  		<span class="a_linkbtn fr" @click="goLogin">去登录>>> </span>
				  	</div>
				</el-form>
			</div>
			
		</div>
	</div>
	</template>
<script>
	import navbar from './components/navbar'
	import { mapState } from 'vuex'
	import { goResetPwd} from '@/api/user'
	export default{
		data(){
			
			const validatePass1 = (rule, value, callback) => {
				var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
				if(value === "") {
					callback(new Error("请输入密码!"));
				} else if(!reg.test(value)) {
					callback(new Error("8到16位之间，且必须是数字和字母的组合!"));
				} else {
					callback();
				}
			}
			const validatePass2 = (rule, value, callback) => {
	           if (value === ""){
	            	callback(new Error("请再次输入新密码"));
		          } else if (value !== this.passwordForm.password) {
		            callback(new Error("两次输入密码不一致!"));
		          } else {
		            callback();
		          }
	           }
			return{
				sendcode_txt:'获取短信验证码',
				btn_disabled:false,
				count_time:0,
				change_pwd_flag:false,//是否显示修改密码弹窗
				passwordForm: {
					password: '',
					confirmPassword:''
				},
				passwordRules: {
					password:[{required: true,trigger: 'blur',validator:validatePass1}],
					confirmPassword:[{required: true,trigger: 'blur',validator: validatePass2}],
				}
			}
		},
		components:{
			navbar,
			
		},
		computed: {
			...mapState('login', ['user_name'])
		},
		methods:{
			//登录跳转
			goLogin(){
				this.$router.push({
					path:'/login'
				})
			},
			//提交验证
			submit_validate_resetpwd(){
				this.$refs.passwordForm.validate(valid => {
					if(valid) {
						//发送重置密码
//						user_name
//							console.log(this.user_name, '用户名')
								this.passwordForm.userName = this.user_name;
								//再次激活
								goResetPwd(this.passwordForm).then(res => {
//									console.log(this.passwordForm)
									if(res.code == 0) {
										this.$message({
											type: 'success',
											message:res.msg
										});
										//激活成功，跳转登录
										this.$router.push({
											path: '/login'
										})
									}
								})
					}
				});
			},
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
				padding-left: 22px;
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
