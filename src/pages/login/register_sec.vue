<template>
	<div>
		<navbar></navbar>
		<div class="register_container">
			<h2 class="register_title">激活项目权限</h2>
			<div v-if="firstFlag2" >
				<register_first></register_first>
			</div>
			<div v-else>
				<register_tow></register_tow>
			</div>
		</div>
	</div>
</template>
<script>
	import navbar from './components/navbar'
	import register_first from './components/registerFirst'
	import register_tow from './components/registerTow'
	import { mapState, mapActions } from 'vuex'
	import { goRegister, confirmfirst, confirm,getUserMessage,GetcompanyList} from '@/api/user'
	export default {
		data() {
			const validateName = (rule, value, callback) => {
				if(value.trim().length == 0) {
					callback(new Error('请输入姓名'))
				} else if(value.trim().length>50){
					callback(new Error('姓名长度不超过50个字符'))
				}else {
					callback()
				}
			}
			const validatePass1 = (rule, value, callback) => {
				var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
				if(value === "") {
					callback(new Error("请输入新密码"));
				} else if(!reg.test(value)) {
					callback(new Error("8到16位之间，且必须是数字和字母的组合!"));
				} else {
					callback();
				}
			}
			const validatePass2 = (rule, value, callback) => {
	           if (value === ""){
	            	callback(new Error("请再次输入新密码"));
		          } else if (value !== this.registerForm.password) {
		            callback(new Error("两次输入密码不一致!"));
		          } else {
		            callback();
		          }
	           }
			return {
				firstFlag2:this.firstFlag,
				loading: false,
				register_submit_text: "提交验证",
				verfy_btn_disabled: false,
				count_time: 0,
				sendcode_txt: '获取短信验证码',
				userName: '',
				sendOptions: {
					phone: '',
					type: ''
				},
				//激活===注册
				registerForm: {
					name:"",//姓名
					companyName:"", //所在公司
					companyId:"", //所在公司id
					departmentName:"", //部门
					email:"", //邮箱
					password: "", //密码
					confirmPassword: "" //确认密码
				},
				registerRules: {
					name:[{required: true,trigger:'blur',validator:validateName}],
					companyName: [{required: true,message: '请选择公司名称',trigger: ['blur','change']}], 
					departmentName: [{required: true,message: '请输入部门全称,多级用"-"分隔，例如，集团-财务部',trigger:'blur'}], 
					email: [{required: true,message: '请输入邮箱地址'},
							{type: 'email',message: '请输入正确的邮箱地址'}
					], //邮箱
					password: [{required: true,validator: validatePass1,trigger: ['blur']}], //密码
					confirmPassword: [{required: true,validator: validatePass2,trigger: ['blur','change']}], //密码
				},
				//再次激活
				registerForm2: {
					companyId2:"",
					companyName2: "", //所在公司
					departmentName2: "", //部门
					email2: "", //邮箱
					name2:""
				},
				registerRules2: {
					name2:[{required: true,trigger:'blur',validator:validateName}],
					companyName2: [{required: true,message: '请选择公司名称',trigger: ['blur','change']}], 
					departmentName2: [{required: true,message: '请输入部门全称,多级用"-"分隔，例如，集团-财务部',trigger: 'blur'}], 
					email2: [{
							required: true,
							message: '请输入邮箱地址',
						},
						{
							type: 'email',
							message: '请输入正确的邮箱地址',
						}
					], //邮箱
				},
			}
		},
		components: {
			navbar,
			register_first,
			register_tow

		},
		destroyed(){
			//清除localStorage数据
//			localStorage.removeItem('firstFlag')
//			localStorage.removeItem('activate_userName')
		},
		computed: {
			...mapState('login', ['firstFlag', 'activate_userName','inviteCode'])
		},
		mounted(){
//			console.log(this.firstFlag)
			if(typeof(this.firstFlag)=='string'){
				
				this.firstFlag2=this.firstFlag=='true'?true:false
			}else if(typeof(this.firstFlag)=='boolean'){
				this.firstFlag2=this.firstFlag
			}
			this.getUserMsg();
		},
		methods: {
			//清除搜索框内容
        	clearPro(item){
	        },
	        /*所在公司下拉查询*/
	        querySearch(queryString, cb) {
	            GetcompanyList({companyName:this.registerForm.companyName,inviteCode:this.inviteCode}).then(res => {
	                let selectList=[]
	                if(res.code==0){
	                    res.result.forEach(v=>{
	                        selectList.push({value:v.companyName,companyId:v.id})
	                    })
	                }
	                var results = queryString ? selectList.filter(this.createStateFilter(queryString)) : selectList;
	                cb(results);
	
	            }).catch(error => {});
	        },
	         querySearch2(queryString, cb) {
	            GetcompanyList({companyName:this.registerForm2.companyName2}).then(res => {
	                let selectList=[]
	                if(res.code==0){
//	                	console.log(res)
	                    res.result.forEach(v=>{
	                        selectList.push({value:v.companyName,companyId:v.id})
	                    })
	                }
//	                console.log(selectList)
	                var results = queryString ? selectList.filter(this.createStateFilter(queryString)) : selectList;
	                cb(results);
	
	            }).catch(error => {});
	        },
	        createStateFilter(queryString) {
	            return (state) => {
	                return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
	            }
	        },
	        handleSelect(val){
//	        	console.log(val)
				this.registerForm.companyName = val.value;
				this.registerForm.companyId = val.companyId;
	        },
	        handleSelect2(val){
				this.registerForm2.companyName2 = val.value;
				this.registerForm2.companyId2 = val.companyId;
	        },
			//登录跳转
			goLogin() {
				this.$router.push({
					path: '/login'
				})
			},
			//获取客户信息
			getUserMsg(){
//				console.log(this.firstFlag2,this.firstFlag)
				if(!this.firstFlag2 && this.activate_userName){
//					console.log("hahahaahah",this.activate_userName)
					getUserMessage(this.activate_userName).then(res => {
//						console.log(res)
						if(res.code==0){
							//获取成功，设置客户信息
							//获取用户列表，通过拿到的公司id匹配公司名称
							const companyId=res.result.companyId;
							this.registerForm2.companyId2=companyId;
							const opt={
								companyName:this.registerForm2.companyName2,
								inviteCode:this.inviteCode
							}
							GetcompanyList(opt).then(res => {
				                if(res.code==0){
				                    res.result.forEach(v=>{
				                        if(companyId==v.id){
				                        	this.registerForm2.companyName2=v.companyName;
				                        	return false;
				                        }
				                    })
				                }
				               
				            }).catch(error => {});
							
						}
						
							this.registerForm2.departmentName2=res.result.departmentName;
							this.registerForm2.email2=res.result.email;
					})
				}
				
			},
			//判断第几次激活
			submit_validate_next() {
//				console.log(typeof(this.firstFlag2),this.firstFlag2)
					if(this.firstFlag2) {//activate_userName
						this.$refs.registerForm.validate(valid => {
//							console.log('this.registerForm')
							if(valid) {
//								console.log(this.activate_userName, '第一次激活')
								if(!this.activate_userName) return;
								//第一次激活
								this.registerForm.userName = this.activate_userName;
								this.registerForm.inviteCode = this.inviteCode;
								confirmfirst(this.registerForm).then(res => {
//									console.log(this.registerForm)
									if(res.code == 0) {
										this.$message({
											type: 'success',
											message:res.msg
										});
										//激活成功，跳转登录
										this.$router.push({
											path: '/login'
										});
													//清除localStorage数据
//			localStorage.removeItem('firstFlag')
//			localStorage.removeItem('activate_userName')
									}
								})
							}
						})

					} else {
						this.$refs.registerForm2.validate(valid => {
							if(valid){
//								console.log(this.activate_userName, '再次激活')
//								this.registerForm2.userName = this.activate_userName;
								var registerFormvalues={
									companyId:this.registerForm2.companyId2,
									departmentName:this.registerForm2.departmentName2,
									email:this.registerForm2.email2,
									userName:this.activate_userName,
									inviteCode:this.inviteCode,
									name:this.registerForm2.name2,
								}
								//再次激活
								confirm(registerFormvalues).then(res => {
//									console.log(this.registerForm2)
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
						
						
					}

				
			},
			clearValidate(formName) {
			      this.$refs[formName].clearValidate();
			},
			//获取短信验证码
			getVerificationCode() {
				var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
				if(this.registerVertifyForm.userName.trim().length != 0 && reg.test(this.registerVertifyForm.userName)) {
					//手机号格式正确，发送短信验证请求
					//						alert("短信发送了");
					this.count_time = 60;
					this.verfy_btn_disabled = true;
					this.count_down_timer();
					//发送验证码请求
					this.sendOptions.phone = this.registerVertifyForm.userName;
					this.sendOptions.type = "CLIENT_REGEDIT";
					this.doSendSms(this.sendOptions).then(res => {
						if(res.data.code == 0) {
							//发送成功
							this.$message({
								type: 'success',
								message: res.data.msg + ',请注意查收手机短信验证码！'
							});
						}

					});
				} else if(this.registerVertifyForm.userName.trim().length == 0) {
//					alert("手机号不能为空!")
					this.$alert('手机号不能为空!','提示',{}).then(()=>{},()=>{})
				} else {
//					alert("请输入正确的手机号!")
					this.$alert('请输入正确的手机号!','提示',{}).then(()=>{},()=>{})
				}
			},
			//验证码倒计时效果
			count_down_timer() {
				if(this.count_time > 0) {
					this.count_time--;
					this.sendcode_txt = this.count_time + "s后重新获取";
					setTimeout(this.count_down_timer, 1000);
				} else {
					this.count_time = 0;
					this.sendcode_txt = "获取验证码";
					this.verfy_btn_disabled = false;
				}
			},
			...mapActions('login', ['doSendSms','setFirstFlag'])
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	$main_color:#009fe8;
	$text_color:#1f212d;
	$border_color:#d5d5d5;
	.register_container {
		min-width: 500px;
		width: 40%;
		border-top: 2px solid $main_color;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		-webkit-transform: translate(-50%, -50%);
		-moz-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		-o-transform: translate(-50%, -50%);
		background: #fff;
		.register_title {
			padding: 25px 0px;
			text-align: center;
			font-size: 30px;
			color: $text_color;
			border-bottom: 1px solid $border_color;
		}
		.register_from,.register_from2 {
			padding: 30px;
			.register_submit {
				height: 40px;
				padding-left: 22px;
				padding-top:20px;
				.a_linkbtn {
					/*float: right;*/
					height: 40px;
					line-height: 40px;
					display: block;
					color: #09b4ee;
					cursor: pointer;
				}
			}
			.note_verfy_text {
				width: 60%;
				/*margin-right: 20px;*/
			}
			.note_verfy_btn {
				cursor: pointer;
				background: #666666;
				color: #fff;
				height: 40px;
				width: 120px;
				display: inline-block;
				padding: 0 10px;
				float: right;
			}
		}
	}
</style>