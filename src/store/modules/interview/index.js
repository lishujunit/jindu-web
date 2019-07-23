export default {
  namespaced: true,
  state: {
    managePageSize: 20,
    partnersPageSize: 30,
    regulatoryPageSize: 40
  },
  mutations: {
    interviewChangePageNum(state, num){
      state.managePageSize = num
    }
  }
}