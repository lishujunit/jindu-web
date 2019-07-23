import page from './index.vue'

const pageination = {
    install: function(Vue){
        Vue.component('pageination',page)
    }
}

// 导出组件
export default pageination