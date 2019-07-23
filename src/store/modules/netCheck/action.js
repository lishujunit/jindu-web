import { getWebSite,getCheck,getManual,getReview } from '@/api/project'
export default{
    getWebSiteList({ commit }, options) {
        return new Promise((resolve, reject) => {
            getWebSite().then(res => {
                if (res.code == 0) {
                    commit('setWebSites', res.result)
                    resolve()
                } else {
                    reject(res)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    //获取校验资料列表
    getCheckList({commit},options){
        return new Promise((resolve,reject) =>{
            getCheck(options).then(res=>{
                if(res.code==0){
                    commit('setCheckList',res.result)
                    resolve()
                }else{
                    reject(res)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    //获取人工检索列表
    getManualList({commit},options){
        return new Promise((resolve,reject) =>{
            getManual(options).then(res=>{
                if(res.code==0){
                    commit('setManualList',res.result)
                    resolve()
                }else{
                    reject(res)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    //获取审核资料列表
    getReviewList({commit},options){
        return new Promise((resolve,reject) =>{
            getReview(options).then(res=>{
                if(res.code==0){
                    commit('setReviewList',res.result)
                    resolve()
                }else{
                    reject(res)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    getExpandList({commit},ids){
        commit('getSecond',ids)
        // console.log(ids)
    }
}
