import { login ,LogOut,adLogin,autoAdLogin } from '@/api/user'
import { removeToken,getAES_values,removeCookie } from '@/utils/auth'
import axios from 'axios'
import qs from 'qs';
export default {
	//律师自动登录
	autoAdLogin({commit},options) {
			return new Promise((resolve,reject) => {
			autoAdLogin(options).then(res => {
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
	//律师用户登录
	doAdLogin({commit},options) {
		return new Promise((resolve,reject) => {
//			const options=qs.stringify({
//		      		domainUserAccount:options.domainUserAccount
//		    });
			adLogin(options).then(res => {
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
	//登录
	doLogin({commit}, options) {
		var AesValues=getAES_values(options.password);
//		console.log(options)
		let opt={
			attachCode:AesValues.attachCode,
			password:AesValues.AES_password,
			userName:options.userName,
			verifyCode:options.verifyCode
		};
		return new Promise((resolve, reject) => {
			login(opt).then(res => {
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
	//登出
	doLogOut({commit}) {
		return new Promise((resolve, reject) => {
			LogOut().then(res => {
				if(res.code==0){
					removeToken();
					removeCookie('roleName');
					removeCookie(process.env.VUE_APP_LOGIN+'_roleLink');
					if(process.env.VUE_APP_LOGIN=='adlogin'){
						removeCookie('devops_role_name'); //删除运维权限
					}
					resolve(res);
				}
				
			}).catch(error => {
				reject(error)
			})
		})

	},
	//发送短信验证码
	doSendSms({commit},options){
		const url=process.env.VUE_APP_PREVIEWURL2+'/send';
		return new Promise((resolve, reject) => {
//			axios.post(url,options).then(res=>{
//				resolve(res)
//			}).catch(err => {
//	            reject(err)
//	       })
			axios({
				method:'post',
				url:url,
			 	data:qs.stringify({
		      		phone:options.phone,
		      		type: options.type
		    	})
			}).then(res=>{
				resolve(res)
			}).catch(err => {
	            reject(err)
	       })
		})
	},
	setFirstFlag({commit},value){
		commit('setFirstFlag',value)
	},
	setActivateUserName({commit},value){
		commit('setActivateUserName',value)
	},
	setInviteCode({commit},value){
		commit('setInviteCode',value)
	},
	setUserName({commit},value){
		commit('setUserName',value)
	}
}