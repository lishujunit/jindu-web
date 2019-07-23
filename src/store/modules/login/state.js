export default{
	myInfo:{},
	firstFlag:window.localStorage.getItem('firstFlag') || true,//是否是第一次激活
	activate_userName:window.localStorage.getItem('activate_userName'),
	user_name:window.localStorage.getItem('user_name'),//注册手机号
	inviteCode:window.localStorage.getItem('inviteCode'),//注册邀请码
}