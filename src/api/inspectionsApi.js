import _this from '@/main.js';
import request from '@/utils/request';
import qs from 'qs';

//标签 --- 通用
export function markApi(id) {
    return request({
        url: '/checkPlanInfo/bookMarks',
        method: 'get',
        params:{
            workUnitId:id
        }
    })
}
// 导出计划
export function exportInterview(params) {
    return request({
        url: '/checkPlanInfo/export',
        method: 'get',
        params: {
            ids:params.ids,
        }
    })
}
// 导出计划--二级
export function exportSecond(params) {
    return request({
        url: '/checkPlanInfo/exportSecond',
        method: 'get',
        params: {
            bookMarkId:params.bookMarkId,
            sortNos:params.sortNos,
            stept :params.stept ,
            workUnitId:params.workUnitId,
        }
    })
}
//列表页签导入
export function importMarkApi(options) {
    return request({
        url: '/checkPlanInfo/importBookMarks',
        method: 'post',
        params: {
            filePath:options.filePath,
            flag:options.flag,
            workUnitId:options.workUnitId,
        }
    })
}
//列表1、2 - 一级列表
export function bookMarksList(options) {
    return request({
        url: '/checkPlanInfo/create/list',
        method: 'get',
        params: {
            bookMarkId:options.bookMarkId,
            status:options.status,
            stept:options.stept,
            workUnitId:options.workUnitId,
        }
    })
}
//列表一二--二级列表
export function scondLevelList(options) {
    return request({
        url: '/checkPlanInfo/create/listSecond',
        method: 'get',
        params: {
            bookMarkId:options.bookMarkId,
            stept:options.stept,
            workUnitId:options.workUnitId,
        }
    })
}
//列表一二--删除
export function delteApi(options) {
    return request({
        url: '/checkPlanInfo/'+options.id,
        method: 'delete',
        params: {
            stept :options.stept,
        }
    })
}
//列表1  提交查验计划
export function oneCertifyApi(ids) {
    return request({
        url: '/checkPlanInfo/create/submitForConfirm/'+ids,
        method: 'post',

    })
}

//创建计划-导入
export function importApi(options) {
    return request({
        url: '/checkPlanInfo/import',
        method: 'post',
        params: {
            // bookmarkId:options.bookmarkId,
            filePath:options.filePath,
            workUnitId:options.workUnitId,
        }
    })
}

//列表2--合格/不合格公用
export function checkApi(options) {
    return request({
        url: '/checkPlanInfo/confirm/'+options.ids,
        method: 'put',
        params: {
            isPass:options.isPass,
            remark:options.remark,
        }
    })
}

// 文件下载
export function downloadApi(url, fileName, type, interviewId) {
    let downloadUrl = url;
    switch (type) {
        case 'Template':
            downloadUrl = process.env.VUE_APP_BASEURL + '/download?filePath='+downloadUrl
            break;
        case 'InterviewPlan':
            downloadUrl += '/interview/manage/export?workUnitId=1&interviewIds=' + interviewId
            break;
        default:
        //
    }
    let xhr = new XMLHttpRequest();
    xhr.open("POST", downloadUrl, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        var response = xhr.response;
        var fileLink = document.createElement("a");
        fileLink.download = fileName ? fileName : ".xls";
        fileLink.style.display = "none";

        var blob = new Blob([response]);
        fileLink.href = URL.createObjectURL(blob);

        document.body.appendChild(fileLink);
        fileLink.click();

        document.body.removeChild(fileLink);
    };
    xhr.send();
}

//列表2 - 列表
export function secondList(bookMarkId,checkLevel,status) {
    return request({
        url: '/checkPlanInfo/confirm/list',
        method: 'get',
        params: {
            bookMarkId: bookMarkId,
            checkLevel:checkLevel,
            status:status,
        }
    })
}
//列表2 - 合格/不合格
export function secondQulify(ids,isPass,remark) {
    return request({
        url: '/checkPlanInfo/confirm/'+ids,
        method: 'put',
        params: {
            isPass: isPass,
            remark:remark,
        }
    })
}
export function getUrlType() {
    let interview = ['manageInterview', 'regulatoryInterview', 'partnersInterview']
    let locationUrl = window.location.hash
    let urlType = ''
    interview.forEach((v) => {
        if (locationUrl.indexOf(v) != -1) {
            if (v == 'manageInterview') { urlType = 'manage'; }
            if (v == 'regulatoryInterview') { urlType = 'supervise'; }
            if (v == 'partnersInterview') { urlType = 'busPartners'; }
            return
        }
    })
    return urlType
}

export function getWorkUnitId() {
    return _this.router.history.current.params.id
}

//列表3、4--页签
export function thirdMarksApi(options) {
    return request({
        url: '/checkPlanExcute/bookMarks',
        method: 'get',
        params: {
            step: options.step,
            workUnitId:options.workUnitId,
        }
    })
}
//列表3--一级列表
export function thirdOneList(options) {
    return request({
        url: '/checkPlanExcute/getExecuteList',
        method: 'get',
        params: {
            firstName: options.firstName,
            status: options.status,
            twoName: options.twoName,
            workUnitId: options.workUnitId,
            bookmarkId:options.bookmarkId,
        }
    })
}
//列表3--一级二级删除
export function thirdDeleteApi(options) {
    return request({
        url: '/checkPlanExcute/deleteExecute/'+options.id+'/'+options.level,
        method: 'delete',
    })
}
//列表3--填写操作
export function orpFlagApi(options) {
    return request({
        url: '/checkPlanExcute/oprFlag',
        method: 'get',
        params:{
            id:options.id,
            level:options.level,
            type:options.type,
            typeComment:options.typeComment,
            typeValue:options.typeValue,
        }
    })
}
//列表3--提交审核
export function threeAuth(options) {
    return request({
        url: '/checkPlanExcute/commitPlan',
        method: 'get',
        params:{
            ids:options.ids,
            level:options.level,
        }
    })
}
//列表3--二级列表
export function threeSecondList(options) {
    return request({
        url: '/checkPlanExcute/getSecondList',
        method: 'get',
        params:{
            firstId :options.firstId ,
            status:options.status,
            twoName:options.twoName,
        }
    })
}

//列表3--搜索框1
export function selectOneApi(checkPlanRequest) {
    return request({
        url: '/checkPlanExcute/getFirstNames',
        method: 'post',
        data:{
            firstname:checkPlanRequest.firstname,
            name:checkPlanRequest.name,
            step:checkPlanRequest.step,
            workUnitId:checkPlanRequest.workUnitId,
        }
    })
}

//列表3--搜索框2
export function selectSecondApi(checkPlanRequest) {
    return request({
        url: '/checkPlanExcute/getSecondNames',
        method: 'post',
        data:{
            firstname:checkPlanRequest.firstname,
            name:checkPlanRequest.name,
            step:checkPlanRequest.step,
            workUnitId:checkPlanRequest.workUnitId,
        }
    })
}

//列表4--列表
export function forthList(options) {
    return request({
        url: '/checkPlanExcute/getExecuteAll',
        method: 'get',
        params:{
            bookmarkId:options.bookmarkId,
            workUnitId:options.workUnitId,
            firstName:options.firstName,
            status:options.status,
            twoName:options.twoName,
        }
    })
}
//列表4--列表填写操作
export function forthFilled(options) {
    return request({
        url: '/checkPlanExcute/auditOprFlag',
        method: 'get',
        params:{
            id:options.id,
            level:options.level,
            type:options.type,
            typeComment:options.typeComment,
            typeValue:options.typeValue,
        }
    })
}
//列表4--合格-不合格接口
export function forthAuditApi(options) {
    return request({
        url: '/checkPlanExcute/auditPlan',
        method: 'get',
        params:{
            ids:options.ids,
            level:options.level,
            remarks:options.remarks,
            status:options.status,
        }
    })
}
//列表4--二级列表
export function forthSecondList(options) {
    return request({
        url: '/checkPlanExcute/getSecondAll',
        method: 'get',
        params:{
            firstId:options.firstId,
            status:options.status,
            twoName:options.twoName,
        }
    })
}
//列表3--批量审核
export function forthThreeAuth(options) {
    return request({
        url: '/checkPlanExcute/commitPlanAll',
        method: 'get',
        params:{
            idlevels:options.idlevels,
        }
    })
}
//列表4--批量审核
export function forthForthAuth(options) {
    return request({
        url: '/checkPlanExcute/auditPlanAll',
        method: 'get',
        params:{
            idlevels:options.idlevels,
            remarks:options.remarks,
            status:options.status,
        }
    })
}
//列表4--整表下载--获取结论
export function forthDownloadResult(options) {
    return request({
        url: '/checkPlanInfo/result',
        method: 'get',
        params:{
            bookMarkId:options.bookMarkId,
        }
    })
}

//列表4--整表下载--提交结论
export function forthDownloadPut(options) {
    return request({
        url: '/checkPlanInfo/result',
        method: 'post',
        data:{
            bookMarkId:options.bookMarkId,
            remark1:options.remark1,
            remark2:options.remark2,
            remark3:options.remark3,
            remark4:options.remark4,
            remark5:options.remark5,
            result:options.result,
        }
    })
}

//列表4-- 新需求列表
export function forthNewList(options) {
    return request({
        url: '/checkPlanExcute/getAuditList',
        method: 'get',
        params:{
            bookMarkId:options.bookMarkId,
            workUnitId:options.workUnitId,
            firstName:options.firstName,
            status:options.status,
            twoName:options.twoName,
        }
    })
}
//列表3-- 新需求列表
export function thirdNewList(options) {
    return request({
        url: '/checkPlanExcute/getExecuteAllList',
        method: 'get',
        params:{
            bookMarkId:options.bookMarkId,
            workUnitId:options.workUnitId,
            firstName:options.firstName,
            status:options.status,
            twoName:options.twoName,
        }
    })
}

//列表1,2 -- 页签删除
export function bookMarkDelete(options) {
    return request({
        url: '/checkPlanInfo/deleteBookMarks',
        method: 'post',
        params:{
            bookMarkId:options.bookMarkId,
            workUnitId:options.workUnitId,
        }
    })
}

//列表1 --- 根据id修改名称
export function modifyOne(options) {
    return request({
        url: '/checkPlanInfo/create/updateName',
        method: 'get',
        params:{
            id:options.id,
            level:options.level,
            name:options.name ,
        }
    })
}

//列表2 --- 根据id修改名称
export function modifySecond(options) {
    return request({
        url: '/checkPlanInfo/confirm/updateName',
        method: 'get',
        params:{
            id:options.id,
            level:options.level,
            name:options.name ,
        }
    })
}


//列表1.2 --- 根据id获取列表
export function getModify(options) {
    return request({
        url: '/checkPlanInfo/nameList',
        method: 'get',
        params:{
            id:options.id,
            level:options.level,
        }
    })
}

//列表3--- 获取已关联文件
export function getRelatedFileThree(options ) {
    return request({
        url: '/checkPlanExcute/getExecuteRelationFile?workUnitId='+options.workUnitId,
        method: 'get',
    })
}

//列表4--- 获取已关联文件
export function getRelatedFileForth(options ) {
    return request({
        url: '/checkPlanExcute/getAuditRelationFile',
        method: 'get',
        params:{
            workUnitId:options.workUnitId
        }
    })
}



