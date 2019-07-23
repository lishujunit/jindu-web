import request from '@/utils/request'


export function processApi(id,pagenum,pagesize,selectFile) {
    return request({
        url: '/processFileTitles/infos/confirmed/'+id,
        method: 'get',
        params: {
            pagenum: pagenum,
            pagesize:pagesize,
            fileName:selectFile,
        }
    })
}

// 项目详情-一级列表
export function processList(id,pageNum,pageSize,selectFile) {
    return request({
        url: '/processFileTitles/infos/'+id,
        method: 'get',
        params: {
            pageNum: pageNum,
            pageSize:pageSize,
            titleName:selectFile,
        }
    })
}

// 项目详情-二级详情
export function processDetails(id,pagenum,pagesize,fileName,uploadUserName) {
    return request({
        url: '/processFileDetails/'+id,
        method: 'get',
        params: {
            pagenum: pagenum,
            pagesize:pagesize,
            titleId:id,
            uploadUserName:uploadUserName,
            fileName:fileName,
        }
    })
}

export function  uploadApi(fileName,filePath,titleId) {
    return request({
        url:'/processFileDetails/'+titleId,
        method:'post',
        params:{
            fileName:fileName,
            filePath:filePath,
            titleId:titleId
        }
    })
}

//下拉选择项
export function  selectApi(selectId) {
    return request({
        url:'/processFileTitles/titleNames/'+selectId,
        method:'get',
        params:{
            projectNo:selectId
        }
    })
}

// 项目详情-批注过程文件
export function annotionApi(id,remark) {
    return request({
        url: '/processFileTitles/titleNames/remark/',
        method: 'put',
        params: {
            remark:remark,
            id:id
        }
    })
}

//标记
export function  remarkApi(id,isMark,titleId) {
    return request({
        url:'/processFileDetails/mark/'+id,
        method:'put',
        params:{
            id:id,
            isMark:isMark,
            titleId:titleId
        }
    })
}

//确认
export function  confirmApi(id,isPass,remark) {
    return request({
        url:'/processFileDetails/review/'+id+'?isPass='+isPass,
        method:'put',
        data:{
            remark:remark
        }
    })
}
//大律师确认文件
export function  lawyerAuthory(id,remark) {
    return request({
        url:'/processFileTitles/titleNames/remark/'+id,
        method:'put',
        params:{
            id:id,
            remark:'tes'
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
        fileLink.download = fileName ? fileName : "file_test.xls";
        fileLink.style.display = "none";

        var blob = new Blob([response]);
        fileLink.href = URL.createObjectURL(blob);

        document.body.appendChild(fileLink);
        fileLink.click();

        document.body.removeChild(fileLink);
    };
    xhr.send();
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
