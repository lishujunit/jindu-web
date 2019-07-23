import _this from '@/main.js';
import request from '@/utils/request';
import qs from 'qs';

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

//下载模板
export function downloadApi(url, fileName, type, inquiryIds) {
    let downloadUrl = url;
    switch (type) {
        case 'Template':
            downloadUrl = process.env.VUE_APP_BASEURL + '/templateManagement/download';
            break;
        case 'InterviewPlan':
            downloadUrl ='/templateManagement/download/{templateId}?templateId=' + inquiryIds;
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

//模板文件--列表API
export function moduleApi(options) {
    return request({
        url: '/templateManagement/list',
        method: 'get',
        params:{
            createBeginTime:options.createBeginTime,
            createEndTime:options.createEndTime,
            name:options.name,
            pageNum:options.pageNum,
            pageSize:options.pageSize,
            updateBeginTime:options.updateBeginTime,
            updateEndTime:options.updateEndTime,
        }
    })
}

//模板下载
export function moduleDownload(templateId) {
    return request({
        url: '/templateManagement/download/'+templateId,
        method: 'get',
    })
}

//模板文件--列表--更新列表
export function moduleUpdateApi(options) {
    return request({
        url: '/templateManagement/'+options.templateId,
        method: 'put',
        params:{
            fileName:options.fileName,
            filePath:options.filePath,
        }
    })
}
//模板文件--列表--模糊搜索
export function moduleSearchApi(options) {
    return request({
        url: '/templateManagement/templateNameNotices/',
        method: 'get',
        params:{
            name:options.name,
        }
    })
}

//客户管理--列表
export function customerApi(options) {
    return request({
        url: '/customers',
        method: 'get',
        params:{
            activationBeginTime:options.activationBeginTime,
            activationEndTime:options.activationEndTime,
            pageNum:options.pageNum,
            pageSize:options.pageSize,
            phone:options.phone,
            userType:options.userType,
        }
    })
}
//客户管理--列表--更新客户信息
export function customerRefreshApi(options) {
    return request({
        url: '/customers/'+options.userId,
        method: 'put',
        params:{
            name:options.name,
            userId:options.userId,
            departmentName:options.departmentName,
            deptid:options.deptid,
            email:options.email,
            companyId:options.companyId,
            companyName:options.companyName,
        }
    })
}
export function customerNameApi(options) {
    return request({
        url: '/customers/'+options.userId,
        method: 'put',
        params:{
            name:options.name,
            userId:options.userId,
        }
    })
}
export function customerSelectApi(options) {
    return request({
        url: '/customers/'+options.userId,
        method: 'put',
        params:{
            companyId:options.companyId,
            companyName:options.companyName,
            userId:options.userId,
        }
    })
}
export function customerDepartApi(options) {
    return request({
        url: '/customers/'+options.userId,
        method: 'put',
        params:{
            departmentName:options.departmentName,
            deptid:options.deptid,
            userId:options.userId,
        }
    })
}
export function customerEmailApi(options) {
    return request({
        url: '/customers/'+options.userId,
        method: 'put',
        params:{
            email:options.email,
        }
    })
}

//客户管理--列表--手机号模糊搜索
export function customerPhoneApi(options) {
    return request({
        url: '/customers/phones/?phone='+options,
        method: 'get',
    })
}

//客户管理--列表--公司下拉框
export function customerCompanyApi() {
    return request({
        url: '/clientCompany/names',
        method: 'get',
    })
}

/********************** 工作指引 **********************/
//工作指引页面数据获取
export function workGuidesList(options) {
    return request({
        url: '/workGuides/list',
        method: 'get',
        params: options
    })
}
// 查询目录树
export function treeList(options) {
    return request({
        url: '/workGuides/treeList',
        method: 'get',
        params: options
    })
}
// 新增目录树
export function addTree(options) {
    return request({
        url: '/workGuides/add',
        method: 'post',
        params: options
    })
}
// 删除目录树
export function delTree(id) {
    return request({
        url: '/workGuides/'+ id,
        method: 'delete'
    })
}
// 修改目录树名称
export function editName(options) {
    return request({
        url: '/workGuides/editName',
        method: 'post',
        params: options
    })
}
// 获取目录对应的富文本内容
export function treeContent(id) {
    return request({
        url: '/workGuides/' + id,
        method: 'get'
    })
}
// 修改富文本
export function editContent(options) {
    return request({
        url: '/workGuides/editContent',
        method: 'post',
        data: options
    })
}





/********************** 系统消息 **********************/
//列表
export function messageLitApi(options) {
    return request({
        url: '/notice/list',
        method: 'get',
        params:options
    })
}
//列表--已读
export function messageReadApi(options) {
    return request({
        url: '/notice/batch/read?noticeIds[]='+options.noticeIds,
        method: 'post',
    })
}
//列表--删除
export function messageDeleteApi(options) {
    return request({
        url: '/notice/batch/delete?noticeIds[]='+options.noticeIds,
        method: 'delete',
    })
}
//列表--title
export function messageTitleApi() {
    return request({
        url: '/notice/message',
        method: 'get',
    })
}

//列表--用户信息
export function messageUser() {
    return request({
        url: '/userinfo',
        method: 'get',
    })
}
//列表--查看事项是否已经结束
export function matterDone(workUnitId) {
    return request({
        url: '/project/onGoingByWorkUnitId',
        method: 'get',
        params:{
            workUnitId:workUnitId
        }
    })
}
/********************** 运维管理 **********************/
//运维管理 页面展示
/*
    pagenum   当前页码  必填
    pagesize  每页多少条数据 必填
    userName 运维人员姓名 选填
    userPhone 运维人员电话 选填
    beginTime 上传开始时间 年-月-日 选填
    endTime 上传结束时间 年-月-日 选填
*/
export function selectListOperationsData(pagenum,pagesize,userName,userPhone,beginTime,endTime){
    let operation = {
        pageNum:pagenum,
        pageSize:pagesize
    }
    if(userName){
        operation.userName=userName
    }
    if(userPhone){
        operation.userPhone=userPhone
    }
    if(beginTime){
        operation.beginTime=beginTime
    }
    if(endTime){
        operation.endTime=endTime
    }
    return request({
        url:'/sys-operation-user/list',
        method:'GET',
        params:operation
    })
}
//新增运维人员
export function addOperationsStaff(operation){
    console.log(operation);
    return request({
        url:'/sys-operation-user/',
        method:'POST',
        data:operation
    })
}

//修改运维人员
export function updateSysOperationUser(id,operation){
    return request({
        url:'/sys-operation-user/'+id,
        method:'PUT',
        data:operation
    })
}

//删除运维人员
export function delSysOperationUser(id){
    return request({
        url:'/sys-operation-user/'+id,
        method:'DELETE',
    })
}

//搜索所有运维人员名称
export function allSysOperationUser(userName){
    return request({
        url:'/sys-operation-user/usernames',
        method:'GET',
        params:{
            userName:userName
        }
    })
}
//搜索所有运维人员手机号码
export function allSysOperationPhone(userPhone){
    return request({
        url:'/sys-operation-user/phones',
        method:'GET',
        params:{
            userPhone:userPhone
        }
    })
}

//搜索所有可用律师
export function allAvailableLawyers(account){
    return request({
        url:'/sys-operation-user/lawyers',
        method:'GET',
        params:{
            account:account
        }
    })
}
