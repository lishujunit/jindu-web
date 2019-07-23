import request from '@/utils/request'
import qs from 'qs';
import { getAES_values } from '@/utils/auth'
//登陆
//export function login(options){
//  return request({
//      url:'/login',
//      method:'post',
//      data:options
//  })
//}
export function autoAdLogin(tokenKey){
	return request({
		url:'/adauth/'+tokenKey,
		method:'post',
		params:{
			tokenKey:tokenKey
		}
	})
}
export function adLogin(options){
	return request({
		url:'/adauth',
		method:'post',
		data:qs.stringify({
		      		domainUserAccount:options.domainUserAccount
		    })
	})
}
export function login(options){
    return request({
        url:'/auth',
        method:'post',
        data:options
    })
}
export function LogOut(options){
    return request({
        url:'/logout',
        method:'post',
        data:options
    })
}
export function goRegister(options){
    return request({
        url:'/register',
        method:'post',
        data:options
    })
}
export function confirmfirst(options){
	var AesValues=getAES_values(options.password);
//		options.password=AesValues.AES_password;
//		options.confirmPassword=AesValues.AES_password;
//		options.attachCode=AesValues.attachCode;
//console.log(options)
		let opt={
			attachCode:AesValues.attachCode,
			companyId:options.companyId,
			departmentName:options.departmentName,
			email:options.email,
			inviteCode:options.inviteCode,
			name:options.name,
			password:AesValues.AES_password,
			confirmPassword:AesValues.AES_password,
			userName:options.userName
		};
		
    return request({
        url:'/confirmfirst',
        method:'post',
        data:opt
    })
}
export function confirm(options){
//	console.log(options)
    return request({
        url:'/confirm',
        method:'post',
        data:options
    })
}
export function getUserMessage(path){
	return request({
		url:'detail/'+path,
		method:'get',
	})
}
export function goForgotPwd(options){
	 return request({
        url:'/forgetpwd',
        method:'post',
        data:options
    })
}
export function goResetPwd(options){
var AesValues=getAES_values(options.password);
//		options.password=AesValues.AES_password;
//		options.confirmPassword=AesValues.AES_password;
//		options.attachCode=AesValues.attachCode;
//		console.log(options)
		let opt={
			attachCode:AesValues.attachCode,
			password:AesValues.AES_password,
			confirmPassword:AesValues.AES_password,
			userName:options.userName
		};
//		console.log(opt)
	 return request({
        url:'/resetpwd',
        method:'post',
        data:opt
    })
}
//获取公司列表
export function GetcompanyList(options){
	 return request({
        url:'/company',
        method:'get',
       params:options
    })
}