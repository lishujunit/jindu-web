import axios from 'axios'
import {logOut} from '@/utils/api'
import {getToken,removeToken} from '@/utils/auth'
import { MessageBox } from 'element-ui'
import qs from 'qs'

const service = axios.create({
    baseURL:process.env.VUE_APP_BASEURL,
    timeout:1000000,
    crossDomain: true == !(document.all)
})
service.defaults.retry = 4;
service.defaults.retryDelay = 5000;

service.interceptors.request.use(config => {
    if (getToken()) {
        config.headers['accessToken']=getToken()
        config.headers['Authorization']="Bearer "+getToken()
    }
    if(config.method === 'get'||config.method === 'post'){
        //如果是get或post请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
        config.paramsSerializer = function(params) {
            return qs.stringify(params, {arrayFormat: 'repeat'})
        }
    }
    return config
}, error => {
    Promise.reject(error)
})

service.interceptors.response.use(
    response => {
        const res = response.data
        if(!res.code){
            return res
        }else{
            if(res.code!=0){  //其他错误
                MessageBox.alert(res.msg,'提示',{
                    type:'warning',
                    confirmButtonText: '确定',
                    message:res.msg?res.msg:res.message,
                    callback: () => {
                      if(res.code == 700){ //token过期
                      	//清除失效token
						removeToken();
						//跳转登录页
                        location.reload()
                      }
                    }
                })
            }
            return res
        }


    },
    err => {
        const message = document.querySelectorAll('.el-message-box__wrapper');
        if(message.length > 0 && message[0].style.display != 'none'){
            return Promise.reject(err);
        }
        let config=err.config
        if(!config || !config.retry) {
            MessageBox.alert("网络超时",'提示',{
                type:'error',
                confirmButtonText: '确定',
                callback: () => {
                }
            })
            return Promise.reject(err);
        }
        config.__retryCount = config.__retryCount || 0;
        if(config.__retryCount >= config.retry) {
            MessageBox.alert("网络超时",'提示',{
                type:'error',
                confirmButtonText: '确定',
                callback: () => {
                }
            })
            return Promise.reject(err);
        }
        config.__retryCount += 1;

        var backoff = new Promise((resolve)=> {
            setTimeout(()=> {
                resolve();
            }, config.retryDelay || 1);
        });
        return backoff.then(()=> {
            return service(config);
        });
    }
)

export default service
