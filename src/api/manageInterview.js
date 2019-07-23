import _this from '@/main.js';
import request from '@/utils/request';
import qs from 'qs';
import store from '@/store'

const interview = ['manageInterview', 'regulatoryInterview', 'partnersInterview']
export function getRoute(route) {
  let path = route.path;
  let pageSize = store.state.interview;
//   managePageSize: (...)
// partnersPageSize: (...)
// regulatoryPageSize: (...)
console.log(path, '3434')
  return pageSize.managePageSize;
  
}
export function getWorkUnitId() {
  return _this.router.history.current.params.id
}
export function getUrlType() {
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

/* ------创建计划1------ */
// 获取访谈计划数据
export function getInterviewPlanData(pageNum, pageSize) {
  return request({
    url: '/interview/' + getUrlType() + '/list',
    method: 'get',
    params: {
      workUnitId: getWorkUnitId(),
      pagenum: pageNum ? pageNum : 1,
      pagesize: pageSize ? pageSize : 10,
    }
  })
}

// 下载访谈计划模版
export function downloadTemplate(url, fileName, type, interviewId) {
  let downloadUrl = url;
  switch (type) {
    case 'Template':
      downloadUrl += '/interview/' + getUrlType() + '/download'
      break;
    case 'InterviewPlan':
      downloadUrl += '/interview/' + getUrlType() + '/export?workUnitId=' + getWorkUnitId() + '&interviewIds=' + interviewId
      break;
    default:
    //
  }
  let xhr = new XMLHttpRequest();
  xhr.open("GET", downloadUrl, true);
  xhr.responseType = "blob";
  xhr.addEventListener("progress", function (evt) {
    if (evt.lengthComputable) {
      var percentComplete = evt.loaded / evt.total;
      console.log((percentComplete * 100) + "%");
    }
  }, false)
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

// 导入访谈计划
export function importPlan(filePath) {
  return request({
    url: '/interview/' + getUrlType() + '/import',
    method: 'post',
    data: qs.stringify({
      workUnitId: getWorkUnitId(),
      filePath: filePath
    })
  })
}

// 导出访谈计划
export function exportInterview(params) {
  return request({
    url: '/interview/' + getUrlType() + '/export',
    method: 'get',
    params: Object.assign(JSON.parse(JSON.stringify({ workUnitId: getWorkUnitId() })), params)
  })
}

// 上传访谈提纲
export function uploadOutline(params) {
  return request({
    url: '/interview/' + getUrlType() + '/uploadOutline',
    method: 'get',
    params: params
  })
}

// 删除访谈计划
export function deleteInterview(interviewId, delType) {
  let url = '';
  if (delType == 'create') { //从创建计划页面删除
    url = '/interview/' + getUrlType() + '/' + interviewId
  } else if (delType == 'confirm') { //从确认计划页面删除
    url = '/interview/' + getUrlType() + '/deleteInfo/' + interviewId
  }
  return request({
    url: url,
    method: 'delete'
  })
}

// 提交确认访谈
export function confirmInterview() {
  let type = Object.prototype.toString.call(arguments[0]);
  if (type === '[object Array]') { //提交多个访谈计划
    return request({
      url: 'interview/' + getUrlType() + '/confirmAll',
      method: 'get',
      params: {
        interviewIds: arguments[0].toString()
      }
    })
  } else {
    return request({
      url: '/interview/' + getUrlType() + '/confirm/' + arguments[0],
      method: 'get'
    })
  }
}

/* ------确认计划2------ */
// 获取已提交的访谈计划
export function getAllSubmitted(status, pageNum, pageSize) {
  let param = {
    pagenum: pageNum ? pageNum : 1,
    pagesize: pageSize ? pageSize : 10
  }
  if (status >= 0) {
    param.status = status
  }
  return request({
    url: '/interview/' + getUrlType() + '/getAllSubmitted',
    method: 'get',
    params: Object.assign(JSON.parse(JSON.stringify({ workUnitId: getWorkUnitId() })), param)
  })
}

// 访谈计划合格
export function interviewQualified(interviewId) {
  return request({
    url: '/interview/' + getUrlType() + '/pass/' + interviewId,
    method: 'get'
  })
}
// 访谈计划合格(多选)
export function interviewQualifiedAll(interviewId) {
  return request({
    url: '/interview/' + getUrlType() + '/passAll',
    method: 'get',
    params: {
      interviewIds: interviewId
    }
  })
}

// 访谈计划不合格
export function interviewUnqualified(interviewId, mark) {
  return request({
    url: '/interview/' + getUrlType() + '/noPass/' + interviewId,
    method: 'get',
    params: {
      remarks: mark
    }
  })
}
// 访谈计划不合格(多选)
export function interviewUnqualifiedAll(interviewId, mark) {
  return request({
    url: '/interview/' + getUrlType() + '/noPassAll',
    method: 'get',
    params: {
      interviewIds: interviewId,
      remarks: mark
    }
  })
}

// 负责律师重新上传访谈提纲
export function reUploadOutline(params) {
  return request({
    url: '/interview/' + getUrlType() + '/reUploadOutline',
    method: 'get',
    params: params
  })
}

/* ------执行访谈3------ */
// 查询所有执行访谈计划
export function getAllExecute(status, pageNum, pageSize) {
  let param = {
    pagenum: pageNum ? pageNum : 1,
    pagesize: pageSize ? pageSize : 10
  }
  if (status >= 0) {
    param.status = status
  }
  return request({
    url: '/interview/' + getUrlType() + '/getAllExecute',
    method: 'get',
    params: Object.assign(JSON.parse(JSON.stringify({ workUnitId: getWorkUnitId() })), param)
  })
}

// 提交审核
export function submitExcute(interviewId) {
  return request({
    url: '/interview/' + getUrlType() + '/submitExcute',
    method: 'get',
    params: {
      interviewId: interviewId
    }
  })
}
// 上传访谈笔录
export function uploadVisiting(params) {
  return request({
    url: '/interview/' + getUrlType() + '/uploadRecordFiles',
    method: 'get',
    params: params
  })
}
// 上传支持文件
export function uploadSupportFiles(params) {
  return request({
    url: '/interview/' + getUrlType() + '/uploadSupportFiles',
    method: 'get',
    params: params
  })
}

// 删除文件
export function deleteFile(fileId) {
  return request({
    url: '/interview/' + getUrlType() + '/deleteFile/' + fileId,
    method: 'get'
  })
}

/* ------审核访谈4------ */
// 获取审核访谈数据
export function getExecuted(status, pageNum, pageSize) {
  let param = {
    pagenum: pageNum ? pageNum : 1,
    pagesize: pageSize ? pageSize : 10
  }
  if (status >= 0) {
    param.status = status
  }
  return request({
    url: '/interview/' + getUrlType() + '/getExecuted',
    method: 'get',
    params: Object.assign(JSON.parse(JSON.stringify({ workUnitId: getWorkUnitId() })), param)
  })
}
// 负责律师上传支持文件
export function uploadSupport(params) {
  return request({
    url: '/interview/' + getUrlType() + '/uploadSupport',
    method: 'get',
    params: params
  })
}
//负责律师上传访谈文件
export function uploadRecord(params) {
  return request({
    url: 'interview/' + getUrlType() + '/uploadRecord',
    method: 'get',
    params: params
  })
}
// 负责律师审核--合格
export function executePass(interviewId) {
  return request({
    url: '/interview/' + getUrlType() + '/executePass/' + interviewId,
    method: 'get'
  })
}
// 负责律师审核--不合格
export function noExecutePass(interviewId, mark) {
  return request({
    url: '/interview/' + getUrlType() + '/noExecutePass/' + interviewId,
    method: 'get',
    params: {
      remarks: mark
    }
  })
}
// 负责律师删除文件
export function deleteFiles(fileId) {
  return request({
    url: '/interview/' + getUrlType() + '/deleteFiles/' + fileId,
    method: 'get'
  })
}
//负责律师批量合格
export function executeAllPass(interviewId) {
  return request({
    url: '/interview/' + getUrlType() + '/executeAllPass',
    method: 'get',
    params: {
      interviewIds: interviewId
    }
  })
}
//负责律师批量不合格
export function executeAllNoPass(interviewId, mark) {
  return request({
    url: '/interview/' + getUrlType() + '/executeAllNoPass',
    method: 'get',
    params: {
      interviewIds: interviewId,
      remarks: mark
    }
  })
}

/* ------关联底稿5------ */
//关联查询-获取列表
export function getRelations(param) {
  return request({
    url: '/interview/' + getUrlType() + '/getRelations',
    method: 'get',
    params: Object.assign(JSON.parse(JSON.stringify({ workUnitId: getWorkUnitId() })), param)
  })
}
//获取底稿属性数据
export function relationshipManuscript(){
  return request({
    url: '/interview/'+ getUrlType() +'/relationship/manuscript',
    method: 'get',
    params: { workunitId: getWorkUnitId() }
  })
}
//获取计划属性数据
export function relationshipPlan(){
  return request({
    url: '/interview/'+ getUrlType() +'/relationship/plan',
    method: 'get',
    params: { workunitId: getWorkUnitId() }
  })
}
//关联底稿属性
export function relation(id, value){
  return request({
    url: '/interview/'+ getUrlType() +'/relation',
    method: 'get',
    params: { id: id, attributeValue:  value}
  })
}
//关联计划属性
export function relationPlan(id, value){
  return request({
    url: '/interview/'+ getUrlType() +'/relationPlan',
    method: 'get',
    params: { id: id, attributeValue:  value}
  })
}
