export default {
	//获取网站列表
	setWebSites(state,list){
        state.webSites=list
    },
    //校验资料列表
    setCheckList(state,list){
    	state.checkList=list
    },
    //人工检索列表
    setManualList(state,list){
    	state.manualList=list
    },
    //审核资料列表
    setReviewList(state,list){
        state.reviewList=list
    },
    BackBtn(state,list){
	    state.backBtn = list
},
    //爬取资料二级列表
    getSecond(state,list){
        for (let i=0;i<list.length;i++){
            state.crawSecondList.push(list[i])
        }
	    // state.getSecondList.push(list)
    }
}
