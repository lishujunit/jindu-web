import title from './index.vue'

const titleBar = {
    install: function(Vue){
        Vue.component('titleBar',title)
    }
}

// 导出组件
export default titleBar