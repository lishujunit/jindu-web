import Cookies from 'js-cookie'
const MD5 = require('md5.js')
import CryptoJS from 'crypto-js'
import { JSEncrypt } from 'jsencrypt'
//const accessToken = 'accessToken'
const accessToken = process.env.VUE_APP_LOGIN+'Token'
const RSA_publickey1='MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCcpX5r0t7QrBXV4C6P/qjx4anhipICfq+lLtQdSBGrP96k7hMZx3kxxt6IobPo+XYnqFsapAVxIzyhWG4ldm9K6ERXbB2XrqjU+f2SxeXISI2LrgAzEvJ50QvaV2IXI5vNqzIYs3pzpOpwinw7AyQLwgUcnDSlGFT9w5S/phMIWwIDAQAB'

export function getToken(status) {
	return Cookies.get(status ? status : accessToken)
}

export function setToken(token) {
	return Cookies.set(accessToken, token)
}

export function removeToken() {
	return Cookies.remove(accessToken)
}

export function CalcuMD5(pwd) {
	pwd = new MD5().update(pwd+'*DgxyoueData87@x#4%').digest('hex');
	return pwd;

}

export function getCookie(cname) {
	return Cookies.get(cname)
}

export function setCookie (cname,value) {
	return Cookies.set(cname, value)
}
export function removeCookie(cname) {
	return Cookies.remove(cname)
}

export function getAESkey_RSAencrypt(keyStr) {
	
	//3、前端使用RSA算法，用公钥RSA_publickey1，对AESkey1进行加密，得到字符串，AESkey1_RSAencrypt1
	let AESkey1_RSAencrypt1=getRSAvalue(keyStr);
	
	return AESkey1_RSAencrypt1;
	
}
//获取AES加密后的密码
/* @param
 * 第一个参数pwd是待加密的密码,第二个参数keyStr是aes加密需要用到的16位字符串的key
 * 返回加密后的密码和密钥参数
*/
export function getAES_values(pwd,keyStr) {
	keyStr = keyStr ? keyStr : getRandomStr(16);
	var key  = CryptoJS.enc.Utf8.parse(keyStr);
	var srcs = CryptoJS.enc.Utf8.parse(pwd);
	var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    var AES_password1=encrypted.toString();
    var yuanPWD=getDecrypt(AES_password1,keyStr);
//  console.log(yuanPWD)
	return {
		AES_password:AES_password1,//加密后的密码
		attachCode:getAESkey_RSAencrypt(keyStr),//密钥参数
		yuanPWD:yuanPWD,//解密后的密码
		key:key,
		keyStr:keyStr,//aes加密需要用到的16位字符串
		pwd:pwd//需要加密的密码
	}
}
//AES解密
export function getDecrypt(word, keyStr){  
//	console.log(word,keyStr)
    var key  = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
 }
//获取RSA加密后的值
export function getRSAvalue(val) {
	//实例化一个JSEncrypt对象
	let jse = new JSEncrypt();
	jse.setPublicKey(RSA_publickey1);
	//设置需要加密的字符串
	let encrypted=jse.encrypt(val);
	return encrypted;
}
export function getRandomStr(length) {
    var str = Math.random().toString(36).substr(2);
    if (str.length>=length) {
        return str.substr(0, length);
    }
    str += getRandomStr(length-str.length);
    return str;
}