import request from '@/utils/request'
import qs from 'qs'
import router from '@/router'
/*网络核查*/
/*共用接口*/
//获取网站
export function getWebSite(){
	return request({
        url:'/webSites',
        method:'get'
    })
}
//主体列表
export function getSubjectTemplate(){
	return request({
		url:'/subjectTemplate',
		method:'get'
	})
}
export function getSubject(batchNo,pagenum,pagesize){
	console.log(batchNo,pagenum,pagesize)
	return request({
		url:'/subjectTemplate',
		method:'get',
		params:{
			batchNo:batchNo,
			pagenum:pagenum,
			pagesize:pagesize
		}
	})
}

//删除并重传
export function delandupload(options){
	return request({
		url:'/netInspect/subject/website/crawlinfo/delandupload',
		method:"post",
		data:qs.stringify(options),
	})
}
//补充上传
export function upload(options){
	return request({
		url:'/netInspect/subject/website/crawlinfo/upload',
		method:"post",
		data:qs.stringify(options),
	})
}
//主体下爬取的图片进行标记
export function markPic({picId,remark,isMark}){
	return request({
		url:'/netInspect/subject/website/pic/mark/'+picId,
		method:'post',
		params:{isMark},
		data:{remark}
	})
}
//主体下爬取的图片进行删除
export function deletePic({picId,picType,subjectWebsiteNum}){
	return request({
		url:'/netInspect/subject/website/pic/'+picId,
		method:'delete',
		params:{picType,subjectWebsiteNum}
	})
}
//重新爬取
export function recollect({projectId ,subjectWebsiteNum }){
	return request({
		url:'/netInspect/subject/website/reCrawler/'+projectId+'/'+subjectWebsiteNum,
		method:'post'
	})
}

//查询主体对应的网站爬取图片信息
export function crawlinfo({source,data,projectNo}){
	let url=''
	if(source==0) url='/netCheck/detail/'+projectNo +'/'+data.subjectWebsiteNum
	else url='/inspectReview/subject/website/crawlinfo/'+projectNo
	return request({
		url:url,
		method:'get',
		params:data
	})
}

//查询（上一个|下一个）主体对应的网站爬取图片信息
export function crawlinfoByCurrent({source,data,projectNo}){
	let url=''
	if(source==0) url='/netCheck/subject/website/crawlnfo/'+projectNo +'/'+data.subjectWebsiteNum
  else url='/inspectReview/subject/prev/website/crawlinfo/'+projectNo
  // if(source==0){
  //   url='/inspectReview/subject/prev/website/crawlinfo/'+projectNo
  // }else{
  //   url='/inspectReview/subject/prev/website/crawlinfo'
  // }
	return request({
		url: url,
		method:'get',
		params:data
	})
}
// 案件管理

// 项目列表
export function project(projectNo,projectName){
	return request({
		url:'/project',
		method:'get',
		params:{
			projectNo: projectNo,
			projectName: projectName
		}
	})
}
// 项目列表模糊查询
export function projectAll(projectNo,projectName){
	return request({
		url:'/project/all',
		method:'get',
		params:{
			projectNo: projectNo,
			projectName: projectName
		}
	})
}
// 确认选取项目
export function submission(projectNo,projectName){
	return request({
		url:'/project/submission',
		method:'get',
		params:{
			projectNo: projectNo,
			projectName: projectName
		}
	})
}


/*校验资料*/
//列表
export function getCheck(options){
	return request({
		url:'/netCheck/list/'+options.projectNo,
		method:'get',
		params:options
	})
}
//提交审核
export function reviewCheck(id){
	return request({
		url:'/netCheck/submitForReview/'+id,
		method:'post'
	})
}
//根据爬取结果获取站点标签
export function getWebSiteByCrawl(id){
	return request({
		url:'/webSites/getWebSitesByCrawlerResult',
		method:'get',
		params:{projectNo:id}
	})
}


//取消审核
export function cancelReview(id) {
	return request({
		url:'/netCheck/cancelReview/'+id,
		method:'post'
	})
}
// 核查清单列表/checkList/list
export function checkList(paramsObj){
	return request({
		url:'/checkList/list',
		method:'get',
		params:paramsObj
	})
}
//搜索框模糊查询webSites/bySiteName
export function bySiteName(webName){
	return request({
		url:'/webSites/bySiteName',
		method:'get',
		params:{
			webName:webName
		}
	})
}
//爬取批次/checkList/batchList
export function batchList(batchNo){
	return request({
		url:'/checkList/batchList',
		method:'get',
		params:{
			batchNo:batchNo
		}
	})
}
// 配置核查清单/checkList/check
export function Detailed(options){

	return request({
		url:'/checkList/check',
		method:'POST',
		data:qs.stringify(options),
		headers:{'Content-Type':'application/x-www-form-urlencoded'}
	})
}
export function config(options){
	return request({
		url:'/checkList/configSure',
		method:'POST',
		data:qs.stringify(options)
	})
}
// 下载主題模板 /subjectTemplate/download
export function download(){
	return request({
		url:'/subjectTemplate/download',
		method:'get',
		params:{
		}
	})
}
// 下载清单 /checkList/export
export function exportss(crawlerBatchId){
	return request({
		url:'/checkList/export',
		method:'get',
		params:{
			crawlerBatchId:crawlerBatchId
		}
	})
}

/*人工检索*/
//获取分类标签数据
export function getManualCate(){
	return request({
		url:'/manualsearch/category',
		method:'get'
	})
}
//获取列表数据
export function getManual(options){
	return request({
		url:'/manualsearch',
		method:'get',
		params:options
	})
}
//获取详细数据
export function getManualById({id,params}){
	return request({
		url:'/manualsearch/'+id,
		method:'get',
		params:params
	})
}
//查询（上一个|下一个）对应的主体信息
export function getManualUpOrDown(options){
	return request({
		url:'/manualsearch/upOrdown',
		method:'get',
		params:options
	})
}
// 爬取资料
//爬取列表/crawler/list
export function crawler(optionss){
	optionss.webName = optionss.websiteName;
	return request({
		url:'/crawler/listFirst',
		method:'get',
		params:optionss
	})
}
//爬取列表/crawler/list---二级列表
export function crawlerSecond(optionss){
    // optionss.webName = optionss.websiteName;
    return request({
        url:'/crawler/listSecend',
        method:'get',
        params:optionss
    })
}
// export function crawler(optionss){
// 	optionss.webName = optionss.websiteName;
// 	return request({
// 		url:'/crawler/list',
// 		method:'get',
// 		params:optionss
// 	})
// }
//删除 /crawler/
export function crawlerDE(crawlerNo){
	return request({
		url:'/crawler/'+crawlerNo,
		method:'delete',
		// params:{
		// 	crawlerNo:crawlerNo
		// }
	})
}
//实时状态数据
export function realTimeData(crawlerBatchNo){
	return request({
		url:'/crawler/realTimeData',
		method:'get',
		params: {
			crawerNos: crawlerBatchNo
		}
	})
}
//实时状态数据--列表日期
export function realListTime(batchNos){
    return request({
        url:'/crawler/realTimeDataFirst',
        method:'get',
        params: {
            batchNos: batchNos
        }
    })
}
//人工检索爬取资料编辑
export function dataEditor(data){
    return request({
        url:'/manualsearch/update',
        method:'post',
        data:data,
    })
}

/*审核资料*/
//列表
export function getReview({projectNo,pagenum,pagesize,subjectName,websiteStatusVOList}) {
	return request({
		url:'/inspectReview/list/'+projectNo,
		method:'post',
		params:{pagenum,pagesize,subjectName},
		data:websiteStatusVOList
	})
}
//下载整个表格
export function downReview(id) {
	return request({
		url:'/inspectReview/subject/'+id,
		method:'get',
		responseType: 'blob'
	})
}
//下载全部图片
export function downloadAllPics(projectNo) {
	return request({
		url:'/inspectReview/subject/'+projectNo+'/downloadAllPics',
		method:'post',
		responseType: 'blob'
		//data: {projectNo:projectNo}
	})
}
//下载选中的主题表格
export function downloadPicsBySubjectNms(projectNo) {
	return request({
		url:'/inspectReview/subject/'+projectNo+'/downloadPicsBySubjectNms',
		method:'get',
		responseType: 'blob',
		// data: {
		// 	subjectNums:subjectNums
		// },
	})
}
//下载全部标记图片
export function downloadFlagPics(projectNo) {
	return request({
		url:'/inspectReview/subject/'+projectNo+'/downloadFlagPics',
		method:'post',
		responseType: 'blob'
		//data: {projectNo:projectNo}
	})
}
//根据ID下载全部图片
export function downReviewPics(ids) {
	return request({
		url:'/inspectReview/subject/downloadAllPics',
		method:'post',
		responseType: 'blob',
		data:ids
	})
}
//根据ID下载被标记的图片
export function downReviewFlagPics(ids) {
	return request({
		url:'/inspectReview/subject/downloadFlagPics',
		method:'post',
		responseType: 'blob',
		data:ids
	})
}
//审批不合格
export function reviewFailure(options) {
	return request({
		url:'/inspectReview/subject/website/failure',
		method:'post',
		data:qs.stringify(options),
	})
}
//校验资料+审核资料--核查主体模糊搜索框
export function searchCheck(options) {
    return request({
        url:'/subjectTemplate/findByName',
        method:'get',
        params:{
            name:options.name,
            projectNo :options.projectNo ,
        }
    })
}
/*关联底稿*/
// 获取底稿列表数据
export function relationship(options){
	return request({
		url:'/netCheck/relationship/list/'+options.projectNo,
		method:'get',
		params:options
	})
}
//获取底稿属性数据
export function relationshipManuscript(option){
	return request({
	  url: '/netCheck/relationship/relationship/manuscript',
	  method: 'get',
	  params: option
	})
}
//获取计划属性数据
export function relationshipPlan(option){
	return request({
	  url: '/netCheck/relationship/relationship/plan',
	  method: 'get',
	  params: option
	})
}
//保存底稿属性
export function saveManuscript(data) {
	return request({
		url:'/netCheck/relationship/relationship/manuscript',
		method:'post',
		data: data
	})
}
//保存计划属性
export function savePlan(data) {
	return request({
		url:'/netCheck/relationship/relationship/plan',
		method:'post',
		data: data
	})
}
//判断事项是否已经完成
export function getMatterStatus(){
	let hash = location.hash;
	let status;
	if(hash.includes('?')){
		status = hash.split('?')[1].split('&').find((n) => n === 'matterStatus=2' || n === 'messageMatterStatus=2');
	}
	return !status
}