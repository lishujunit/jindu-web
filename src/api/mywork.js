import request from '@/utils/request'
import qs from 'qs'

/*
**
	我的工作台
**
*/
//获取当前项目中的用户角色
export function getRole(projectNo){
	return request({
		url:'/project/role/'+projectNo,
		method:'get'
	})
  }

/*案件列表*/
// export function getProject(options) {
// 	return request({
// 		url: '/project/list?pagenum='+options.pagenum+'&pagesize='+options.pagesize,
// 		method: 'post',
// 		data: {
//             queryCond:{
//                 endDate:options.endDate,
//                 matterName:options.matterName,
//                 partnerLawyer:options.partnerLawyer,
//                 projectName:options.projectName,
//                 projectNo:options.projectNo,
//                 projectStatus:options.projectStatus,
//                 responsibleLawyer:options.responsibleLawyer,
//                 startDate:options.startDate,
// 			},
// 		}
// 	})
// }
export function getProject(options) {
    return request({
        url: '/project/list?pagenum='+options.pagenum+'&pagesize='+options.pagesize,
        method: 'post',
        data: options,
    })
}

/*项目类型*/
export function getProjectType(){
	return request({
		url:'/project/getProjectType',
		method:'get'
	})
}
/*机构类型*/
export function getOrganizationType(){
	return request({
		url:'/project/getOrganizationType',
		method:'get'
	})
}
/*
获取案件人员列表(用于指定负责律师和执行律师)*/
export function getComplete({projectNo,type,key}){
	return request({
		url:'/project/laywers/'+projectNo,
		method:'get',
		params:{type,key}
	})
}

/*-查询负责律师*/
export function getChargeLawyers(){
	return request({
		url:'/project/chargeLawyers',
		method:'get'
	})
}
/*获取合伙律师*/
export function getSponsorPartners(){
	return request({
		url:'/project/sponsorPartners',
		method:'get'
	})
}
/*获取案件信息*/
export function getProjectInfo(id){
	return request({
		url:'/project/info/'+id,
		method:'get'
	})
}

/*获取当前项目的统计数据*/
export function getFileStatistics(id){
	return request({
		url:'/prophasefile/statistics/'+id,
		method:'get'
	})
}
/*调整负责律师*/
export function updateResLawyer({projectNo,laywerIds }){
	return request({
		url:'/project/resLaywers/update/'+projectNo,
		method:'post',
		data:laywerIds
	})
}

/*获取负责律师*/
export function getRes(options){
	return request({
		url:'/project/laywers/res',
		method:'get',
		params:options
	})
}

/*获取合伙律师列表*/
export function getPartner(options){
	return request({
		url:'/project/laywers/sponsorPartner',
		method:'get',
		params:options
	})
}
/*获取事项列表*/
export function getMatter(options){
	return request({
		url:'/project/matterNames',
		method:'get',
		params:options
	})
}
/*获取项目名列表*/
export function getProjectNames(options){
//	console.log(options)
	return request({
		url:'/project/projectNames',
		method:'get',
		params:options
	})
}
/***
***事项***
***/
/*修改事项*/
export function editMatterInfo({projectNo,matters}){
	return request({
		url:'/project/matters/update/'+projectNo,
		method:'post',
		data:matters
	})
}


/*获取案件关联的事项信息*/
export function getMatterInfo(projectNo){
	return request({
		url:'/project/matters/'+projectNo,
		method:'get',
		parmas: {
			orderByCreateTimeAsc:'false'
		}
	})
}

/*案件进行提交准备操作*/
export function submitProject({options,projectNo}){
	return request({
		url:'/project/submit/'+projectNo,
		data:options,
		method:'post'
	})
}
/*
案件进行完成操作*/
export function complete(projectNo){
	return request({
		url:'/project/complete/'+projectNo,
		method:'post'
	})
}
/*前期文件上传文件*/
export function uploadFile(options) {
    return request({
        url: '/prophasefile',
        method: 'post',
        data:options
    })
}
/*过程文件上传文件*/
export function uploadProcessFile({titleId,filePath,fileName}) {
    return request({
        url: '/processFileDetails/'+titleId,
        method: 'post',
        data:qs.stringify({fileName,filePath})
    })
}
/**
工作单元
**/

export function getWorkunit(){
	return request({
		url:'/workunit',
		method:'get'
	})
}


/*过程文件列表*/

/*过程文件*/
export function getProcessList(projectNo){
	return request({
		url:'/processFileTitles/titleNames/'+projectNo,
		method:'get'
	})
}

/*获取当前案件的统计数据*/
export function getProcessStatistic(projectNo){
	return request({
		url:'/processFileDetails/statistics/'+projectNo,
		method:'get'
	})
}
//  过程文件【负责】
export function file(params){
	return request({
		url:'/processFileTitles/infos/'+params.projectNo,
		method:'get',
		params:params
	})
}
//删除/processFileTitles/titleNames/{id}
export function deletes(id){
	return request({
		url:'/processFileTitles/titleNames/'+id,
		method:'delete',
	})
}
//修改题目文件/processFileTitles/titleNames/
export function modify(id,titleName){
	return request({
		url:'/processFileTitles/titleNames/'+id,
		method:'put',
		params:{
			titleName:titleName
		}
	})
}
//新增过程文件/processFileTitles/titleNames/{projectNo}/{titleName}
export function Newfile(projectNo,titleName){
	return request({
		url:'/processFileTitles/titleNames/'+projectNo,
		method:'post',
		params:{
			titleName:titleName
		}
	})
}
//查看详情/processFileDetails/{titleId}
export function See(params){
	return request({
		url:'/processFileTitles/titleNames/'+params.titleId,
		method:'get',
		params:params
	})
}

//获取客户邀请码
export function cutomerCode(projectNo){
    return request({
        url:'/project/getInviteCode/'+projectNo,
        method:'get',
		pamrams:projectNo

    })
}
//调整负责律师
export function updateResLaywers(projectNo,laywerIds){
    return request({
        url:'/project/details/resLaywers/update/'+projectNo,
        method:'post',
		data:laywerIds 

    })
}
//调整执行律师
export function updateExeLaywers(projectNo,laywerIds){
    return request({
        url:'/project/details/execLaywers/update/'+projectNo,
        method:'post',
		data:laywerIds 

    })
}
//获取案件下面的所有事项
export function getManuscriptByProjectNo(projectNo){
	return request({
        url:'/manuscript/getByProjectNo',
        method:'get',
		params:{projectNo}
    })
}
//获取案件下面的所有事项
export function getManusListByMatterNo(options){
	return request({
        url:'/manuscript/list',
        method:'get',
		params:options
    })
}
//大律师确认
export function manuscript_confirm(options){
	return request({
        url:'/manuscript/confirm',
        method:'get',
		params:options
    })
}
//标记有问题的底稿
export function remarkManuscript(options){
	return request({
        url:'/manuscript/hasQuestionAll',
        method:'get',
		params:options
    })
}
//获取律师权限
export function authApi(projectNo) {
    return request({
        url: '/project/role/'+projectNo,
        method: 'get',
        // data: {
        //     projectNo:projectNo
        // }
    })
}
//获取事项下面的所有底稿
export function getMatterAttributes(options) {
    return request({
        url: '/manuscript/getAttributes',
        method: 'get',
        params:options
    })
}
//获取事项下面的文件描述
export function getMatterNames(options) {
    return request({
        url: '/manuscript/getNames',
        method: 'get',
        params:options
    })
}
//查询过程文件题目列表/processFileTitles/titleNames/{projectNo}
// export function See(projectNo){
// 	return request({
// 		url:'/processFileTitles/titleNames/'+projectNo,
// 		method:'get',
// 	})
// }



/*************** 计划关联 ********************/
export function bookMarksByMatterNo(matterNo){
	return request({
		url:'/checkPlanInfo/bookMarksByMatterNo',
		method:'GET',
		params:{
			matterNo:matterNo
		}
	})
}

export function takeFirstTable(bookMarkId,matterNo){
	return request({
		url:'/checkPlanInfo/getRelationA',
		method:'GET',
		params:{
			bookMarkId:bookMarkId,
			matterNo:matterNo
		}
	})
}

export function takeSecondTable(id,matterNo){
	return request({
		url:'/checkPlanInfo/getRelationB',
		method:'GET',
		params:{
			id:id,
			matterNo:matterNo
		}
	})
}
