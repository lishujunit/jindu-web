import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import titleBar from './components/titleBar'
import pageination from './components/page'
import VJstree from 'vue-jstree'

import './plugins/element.js'
import './permission'
import '@/assets/css/element-variables.scss'
import '@/assets/css/common.scss'
import '@/assets/css/style.scss'
import '@/assets/css/font.css'

import globalStatus from '@/utils/status.js'
import { getToken, getCookie } from '@/utils/auth.js'

Vue.config.productionTip = false
Vue.use(titleBar)
Vue.use(pageination)
Vue.use(VJstree)

//全局路由拦截，判断是否登录状态
router.beforeEach((to, from, next) => {
	// 	console.log(to)
	var url = process.env.VUE_APP_LOGIN
	// 	console.log(url)

	if (to.matched.some(m => m.meta.auth == url || m.meta.auth == 'other')) {
		//无需验证
		next();
	} else {
		if ((url == 'adlogin' && to.path == '/login') || (url == 'login' && to.path == '/adlogin')) {
//			next()
			next({ path: '/' + url })
			return false;
		}
		// //需要验证是否登录
		// if(getToken() && getCookie(url+'_roleLink')==url){
		// //已经登录
		// 	next();
		// }else{
		// 	//未登录,跳转到登录页面

		// 	next({ path: '/'+url})
		//  }
		if (!getToken() || !(getCookie(url + '_roleLink') == url)) {
			next({ path: '/' + url })
		} else {
			next()
		}

	}

});
Vue.prototype.globalStatus = globalStatus
new Vue({
	render: h => h(App),
	router,
	store,
}).$mount('#app')

export default {
	router
}
