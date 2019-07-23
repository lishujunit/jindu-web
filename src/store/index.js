import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import mutations from './mutations'
import login from './modules/login'
import netCheck from './modules/netCheck'
import myWork from './modules/myWork'
import dueDiligence from './modules/dueDiligence'
import inspectPlan from './modules/inspectPlan'
import systemManage from './modules/inspectPlan'
import interview from './modules/interview'

Vue.use(Vuex);

export default new Vuex.Store({
	state,
	mutations,
	modules:{
		login,
		netCheck,
		myWork,
		dueDiligence,
        inspectPlan,
		systemManage,
		interview
	}
})
