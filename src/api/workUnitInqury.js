import _this from '@/main.js';
import request from '@/utils/request';
import qs from 'qs';


//列表1
export function unitInqueryApi(workUnitId,pagenum,pagesize) {
    return request({
        url: '/inquiryInfo/list',
        method: 'get',
        params:{
            pagenum:pagenum,
            pagesize:pagesize,
            workUnitId:workUnitId,
        }
    })
}

//列表1 --上传
export function importApi(filePath,workUnitId ) {
    return request({
        url: '/inquiryInfo/import',
        method: 'post',
        params:{
            filePath:filePath,
            workUnitId  :workUnitId,
        }
    })
}
//列表1 --删除
export function deleteApi(inquiryId) {
    return request({
        url: '/inquiryInfo/'+inquiryId,
        method: 'delete',
        // params:{
        //     inquiryId:filePath,
        //     workUnitId  :workUnitId,
        // }
    })
}

//下载询证计划模板1 + 导出询证计划
export function downloadApi(url, fileName, type, inquiryIds) {
    let downloadUrl = url;
    switch (type) {
        case 'Template':
            downloadUrl = process.env.VUE_APP_BASEURL + '/inquiryInfo/download';
            break;
        case 'InterviewPlan':
            downloadUrl = process.env.VUE_APP_BASEURL+'/inquiryInfo/export?inquiryIds=' + inquiryIds;
            break;
        default:
        //
    }
    let xhr = new XMLHttpRequest();
    xhr.open("get", downloadUrl, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        var response = xhr.response;
        var fileLink = document.createElement("a");
        fileLink.download = fileName ? fileName : "询证计划模板.xls";
        fileLink.style.display = "none";

        var blob = new Blob([response]);
        fileLink.href = URL.createObjectURL(blob);

        document.body.appendChild(fileLink);
        fileLink.click();

        document.body.removeChild(fileLink);
    };
    xhr.send();
}

//列表1 --单个确认
export function oneCertify(inquiryId) {
    return request({
        url: '/inquiryInfo/confirm/'+inquiryId,
        method: 'get',
        // params:{
        //     pagenum:pagenum,
        //     pagesize  :pagesize  ,
        //     workUnitId  :workUnitId,
        // }
    })
}

//列表1 --多个确认
export function moreCertify(inquiryIds) {
    return request({
        url: '/inquiryInfo/confirmAll?inquiryIds='+inquiryIds,
        method: 'get',
        // params:{
        //     inquiryIds:inquiryIds
        // }
    })
}

//列表2
export function certifyList(name,pagenum,pagesize,status,workUnitId) {
    return request({
        url: '/inquiryInfo/getAllSubmitted',
        method: 'get',
        params:{
            name:name,
            pagenum:pagenum,
            pagesize:pagesize,
            status:status,
            workUnitId:workUnitId,
        }
    })
}
//列表2 --合格(多个）
export function moreQulified(inquiryIds) {
    return request({
        url: '/inquiryInfo/passAll?inquiryIds='+inquiryIds,
        method: 'get',
        // params:{
        //     inquiryIds:inquiryIds,
        // }
    })
}
//列表2 --合格(一个）
export function oneQulified(inquiryId ) {
    return request({
        url: '/inquiryInfo/pass/'+inquiryId ,
        method: 'get',
        params:{
            inquiryId :inquiryId ,
        }
    })
}

//列表2 --不合格(多个）
export function moreUnqulified(inquiryIds,remarks  ) {
    return request({
        url: '/inquiryInfo/noPassAll?inquiryIds='+inquiryIds,
        method: 'get',
        params:{
            remarks :remarks ,
        }
    })
}

//列表2 --不合格(一个）
export function oneUnqulified(inquiryId ,remarks) {
    return request({
        url: '/inquiryInfo/noPass/'+inquiryId,
        method: 'get',
        params:{
            remarks :remarks ,
        }
    })
}
//列表2 --提交审核
export function handleAudit(inquiryId ) {
    return request({
        url: '/inquiryInfo/submitExcute',
        method: 'get',
        params:{
            inquiryId :inquiryId ,
        }
    })
}
//列表2 -- 删除
export function deleteItem(inquiryId) {
    return request({
        url: '/inquiryInfo/deleteInfo/'+inquiryId,
        method: 'delete',
        // params:{
        //     inquiryId :inquiryId ,
        // }
    })
}
//列表3 -- 列表
export function threeList(name,pagenum ,pagesize ,status,workUnitId) {
    return request({
        url: '/inquiryInfo/getAllExecute',
        method: 'get',
        params:{
            name :name ,
            pagenum :pagenum ,
            pagesize :pagesize ,
            status :status ,
            workUnitId :workUnitId ,
        }
    })
}
//列表3 --证明上传
export function threeUpload(fileName,filePath,inquiryId) {
    return request({
        url: '/inquiryInfo/uploadOutline',
        method: 'get',
        params:{
            fileName :fileName ,
            filePath :filePath ,
            inquiryId :inquiryId ,
        }
    })
}
//列表3 --提交审核
export function threeAudit(inquiryId) {
    return request({
        url: '/inquiryInfo/submitExcute',
        method: 'get',
        params:{
            inquiryId :inquiryId ,
        }
    })
}
//列表3 -- 删除
export function threeDelete(fileId ) {
    return request({
        url: '/inquiryInfo/deleteFile/'+fileId ,
        method: 'delete',
        // params:{
        //     inquiryId :inquiryId ,
        // }
    })
}

//列表4 -- 列表
export function forthList(name,pagenum ,pagesize ,status,workUnitId) {
    return request({
        url: '/inquiryInfo/getExecuted',
        method: 'get',
        params:{
            name :name ,
            pagenum :pagenum ,
            pagesize :pagesize ,
            status :status ,
            workUnitId :workUnitId ,
        }
    })
}

//列表4 --证明上传
export function forthUpload(fileName,filePath,inquiryId) {
    return request({
        url: '/inquiryInfo/upload',
        method: 'get',
        params:{
            fileName :fileName ,
            filePath :filePath ,
            inquiryId :inquiryId ,
        }
    })
}
//列表4 -- 合格
export function forthAuth(inquiryId) {
    return request({
        url: '/inquiryInfo/executePass/'+inquiryId,
        method: 'get',
        // params:{
        //     inquiryId :inquiryId ,
        // }
    })
}
//列表4-合格-多选
export function forthMoreAuth(interviewIds) {
    return request({
        url: '/inquiryInfo/executeAllPass?interviewIds='+interviewIds,
        method: 'get',
        // params:{
        //     interviewIds :interviewIds ,
        // }
    })
}
//列表4-不合格-多选
export function forthMoreUnauth(interviewIds,remarks) {
    return request({
        url: '/inquiryInfo/executeAllNoPass?interviewIds='+interviewIds,
        method: 'get',
        params:{
            remarks :remarks ,
        }
    })
}
//列表4 -- 不合格
export function forthUnauth(inquiryId ,remarks ) {
    return request({
        url: '/inquiryInfo/noExecutePass/'+inquiryId,
        method: 'get',
        params:{
            remarks :remarks ,
        }
    })
}
//列表4 -- 删除
export function forthDelete(fileId) {
    return request({
        url: '/inquiryInfo/deleteFileInfo/'+fileId,
        method: 'delete',
        // params:{
        //     remarks :remarks ,
        // }
    })
}

//列表搜索--通用
export function searchApi(name ,stept,workUnitId  ) {
    return request({
        url: '/inquiryInfo/getNames',
        method: 'get',
        params:{
            name :name ,
            stept :stept ,
            workUnitId :workUnitId ,
        }
    })
}
//3、4步查看
export function viewApi(inquiryId) {
    return request({
        url: '/inquiryInfo/getFiles',
        method: 'get',
        params:{
            inquiryId:inquiryId ,
        }
    })
}

export function getWorkUnitId() {
    return _this.router.history.current.params.id
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

// 导出访谈计划
export function exportInterview(params) {
    return request({
        url: '/inquiryInfo/export',
        method: 'get',
        params: {
            inquiryIds:params.inquiryIds
        }
    })
}


// 列表5--列表
export function fiveListApi(options) {
    return request({
        url: '/inquiryInfo/relatedReply',
        method: 'get',
        params: {
            name:options.name,
            pagenum :options.pagenum ,
            pagesize :options.pagesize ,
            status:options.status,
            workUnitId :options.workUnitId ,
            manuscriptAttribute :options.manuscriptAttribute ,
            manuscriptStatus :options.manuscriptStatus ,
            planAttribute :options.planAttribute ,
            planStatus :options.planStatus ,
        }
    })
}
// 列表5--列表--底稿属性-模糊搜索
export function fiveSearchOneApi(query) {
    return request({
        url: '/inquiryInfo/manuscript',
        method: 'post',
        data: {
            manuscriptAttribute :query.manuscriptAttribute,
            workunitId:query.workunitId,
            planAttribute :query.planAttribute ,
        }
    })
}
// 列表5--列表--计划属性-模糊搜索
export function fiveSearchTwoApi(query) {
    return request({
        url: '/inquiryInfo/plan',
        method: 'post',
        data: {
            manuscriptAttribute :query.manuscriptAttribute,
            workunitId:query.workunitId,
            planAttribute :query.planAttribute ,
        }
    })
}

// 列表5--列表--底稿属性-保存
export function fiveSaveOneApi(inquiryInfoRelatedReplyRequest ) {
    return request({
        url: '/inquiryInfo/relatedManuscript',
        method: 'post',
        data: {
            busId :inquiryInfoRelatedReplyRequest .busId,
            manuscriptAttribute:inquiryInfoRelatedReplyRequest .manuscriptAttribute,
            planAttribute :inquiryInfoRelatedReplyRequest .planAttribute ,
        }
    })
}
// 列表5--列表--计划属性-保存
export function fiveSaveTwoApi(inquiryInfoRelatedReplyRequest ) {
    return request({
        url: '/inquiryInfo/relatedPlan',
        method: 'post',
        data: {
            busId :inquiryInfoRelatedReplyRequest .busId,
            manuscriptAttribute:inquiryInfoRelatedReplyRequest .manuscriptAttribute,
            planAttribute :inquiryInfoRelatedReplyRequest .planAttribute ,
        }
    })
}
// 列表5--列表--主体名称模糊搜索
export function fiveSearchApi(options) {
    return request({
        url: '/inquiryInfo/getNames',
        method: 'get',
        params: {
            name:options.name,
            stept:options.stept ,
            workUnitId:options.workUnitId ,
        }
    })
}
