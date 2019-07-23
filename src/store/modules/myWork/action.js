import { getProject, getMatterInfo, getWorkunit, getProjectType, getOrganizationType,getComplete } from '@/api/mywork'
export default {
    getProjectList({ commit }, options) {
        return new Promise((resolve, reject) => {
            getProject(options).then(res => {
                if (res.code == 0) {
                    commit('setProject', res.result)
                    resolve()
                } else {
                    reject(res)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },

    getMatterByProjectList({ commit }, options) {
        return new Promise((resolve, reject) => {
            getMatterInfo(options).then(res => {
                if (res.code == 0) {
                    res.result=(res.result==''?[]:res.result)
                    commit('setMatter', res.result)
                    resolve()
                } else {
                    reject()
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    /*工作单元*/
    getWorkunitList({ commit }, options) {
        return new Promise((resolve, reject) => {
            getWorkunit().then(res => {
                if (res.code == 0) {
                    commit('setWorkunit', res.result)
                    resolve()
                } else {
                    reject()
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    /*项目类型*/
    getProjectTypeList({ commit }, options) {
        return new Promise((resolve, reject) => {
            getProjectType().then(res => {
                if (res.code == 0) {
                    commit('setProjectType', res.result)
                    resolve()
                } else {
                    reject()
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    /*机构类型*/
    getOrganizationTypeList({ commit }, options) {
        return new Promise((resolve, reject) => {
            getOrganizationType().then(res => {
                if (res.code == 0) {
                    commit('setOrganizationType', res.result)
                    resolve()
                } else {
                    reject()
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    /*获取案件列表*/
    getCompleteList({commit},options){
        return new Promise((resolve,reject)=>{
            getComplete(options).then(res=>{
                if(res.code==0){
                    commit('setComplete',res.result)
                    resolve(res)
                }
            })
        })
    },
    setchargeLawyerList({commit},value){
		commit('setchargeLawyerList',value?value:[])
	},
	setexecLawyerList({commit},value){
		commit('setexecLawyerList',value?value:[])
	}
}
