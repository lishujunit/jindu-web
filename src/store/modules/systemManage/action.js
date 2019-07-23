import { messageTitleApi } from '@/api/systemManageApi'
export default {
    setSystemMessage({ commit }, options) {
        return new Promise((resolve, reject) => {
            messageTitleApi(options).then(res => {
                if (res.code == 0) {
                    res.result=(res.result==''?[]:res.result)
                    commit('setMessage', res.result)
                    resolve()
                } else {
                    reject()
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
}
