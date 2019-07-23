import request from '@/utils/request'
import qs from 'qs';

//时间修改成YYYY-MM-DD HH-MM-SS
export function changeTime(time){
  let changeTime = new Date(time)
  let dateTime = changeTime.toLocaleDateString('chinese')
  dateTime = dateTime.split('/')
  dateTime[1] = dateTime[1]>=10?dateTime[1]:'0'+dateTime[1]
  dateTime[2] = dateTime[2]>=10?dateTime[2]:'0'+dateTime[2]
  dateTime = dateTime.join('-')
  // console.log(dateTime)
  return `${dateTime} ${changeTime.getHours()>=10?changeTime.getHours():'0'+changeTime.getHours()}:${changeTime.getMinutes()>=10?changeTime.getMinutes():'0'+changeTime.getMinutes()}:${changeTime.getSeconds()>=10?changeTime.getSeconds():'0'+changeTime.getSeconds()}`
}

//获取当前项目中的用户角色
export function getRole(projectNo){
	return request({
		url:'/project/role/'+projectNo,
		method:'get'
	})
}

//获取公司相关信息
export function getCompany(workUnitId,companyName){
  return request({
    url:'/clientCompany/selectAllCompanyBycompanyName',
    method:'GET',
    params:{
      workUnitId:workUnitId,
      companyName:companyName
    }
  })
}

//增加个公司
export function addCompany(workUnitId,companyName){
  return request({
    url:'/clientCompany/insertCompany',
    method:'GET',
    params:{
      workUnitId:workUnitId,
      companyName:companyName
    }
  })
}
//删除公司
export function delCompany(companyId){
  return request({
    url:'/clientCompany/deleteCompany',
    method:'POST',
    params:{
      companyId:companyId
    }
  })
}

//获取表格数据(1尽调创建页面)
export function getTableData(companyId,workUnitId){
  return request({
    url: '/lawyer/selectListOrCompanyId',
    method: 'GET',
    params:{
      companyId:companyId,
      workUnitId:workUnitId
    }
  })
}

//尽职调查文件导入   workUnitId 是指进入页面时获取工作单元的ID
export function uploadinventory(companyId ,companyName ,filePath,workUnitId){
  return request({
    url:'/lawyer/import',
    method:'POST',
    data:qs.stringify({
      companyId:companyId,
      companyName:companyName,
      filePath:filePath,
      workUnitId:workUnitId
    })
  })
}

//删除一行尽调属性（第一步）
export function delinventory(id){
  return request({
    url:"/lawyer/deleteListById",
    method:'DELETE',
    params:{
      id:id
    }
  })
}

//单个提交创建状态
export function singleSubmit(attributeId,status){
  return request({
    url:'/lawyer/singleSubmitStatus',
    method:'GET',
    params:{
      attributeId :attributeId,
      status :status
    }
  })
}

//批量提交创建状态
export function singleSubmitAll(attributeIds,status){
  return request({
    url:'/lawyer/batchUpdateStatus',
    method:'GET',
    params:{
      attributeIds:attributeIds,
      status:status
    }
  })
}

//修改尽职调查(第一步)
export function updateAnswerData(optionsData){
  let operation = {
    id:optionsData.id,
    answerName:optionsData.name,
    answerPhone:optionsData.phone,
    answerMail:optionsData.email,
  }
  return request({
    url:"/lawyer/updateAnswerData",
    method:"POST",
    params:operation
  })
}

//添加附件名称
export function addAttachmentName(attachmentName,attributeId){
  return request({
    url:'/lawyer/insertattachmentName',
    method:'POST',
    params:{
      attachmentName: attachmentName,
      attributeId:attributeId
    }
  })
}

//删除附件
export function delAttchment(attachmentId){
  return request({
    url:'/lawyer/deleteAttachmentById',
    method:'DELETE',
    params:{
      attachmentId :attachmentId 
    }
  })
  
}

//获取尽调属性附件列表
export function getAttachmentList(attributeId){
  return request({
    url:'/lawyer/attachmentListByAttributeId',
    method:'GET',
    params:{
      attributeId: attributeId
    }
  })
}

//添加表头信息（第一步专用）
export function addAttachmentHeader(attachmentId,attributeId,contentTitles){
  return request({
    url:'/lawyer/insertClientuserContentTitle',
    method:'POST',
    params:{
      attachmentId :attachmentId,
      attributeId :attributeId,
      contentTitles :contentTitles 
    }
  })
}

//下载清单模板(没有用，调到前面的页面去了)
export function downloadTemplate(url, fileName,type,Ids) {
  let downloadUrl = url
  switch (type) {
    case 'POST':
      downloadUrl += '/lawyer/download'
      break;
    case 'GET':
      downloadUrl += '/lawyer/export?&ids=' + Ids
      break;
    default:
  }
  console.log(downloadUrl);
  let xhr = new XMLHttpRequest();
  xhr.open(type, downloadUrl, true);
  xhr.responseType = "blob";
  xhr.onload = function () {
    var response = xhr.response;
    var fileLink = document.createElement("a");
    fileLink.download = fileName ? fileName : "file_test.xlsx";
    fileLink.style.display = "none";

    var blob = new Blob([response]);
    fileLink.href = URL.createObjectURL(blob);

    document.body.appendChild(fileLink);
    fileLink.click();

    document.body.removeChild(fileLink);
  };
  xhr.send();
}

//获取表格相关信息（2尽调确认页面）
export function getTableDataComPage(companyId,workUnitId){
  return request({
    url:'/lawyer/selectListOrCompanyIdOrStatus',
    method:'GET',
    params:{
      companyId:companyId,
      workUnitId:workUnitId
    }
  })
}

//单个提交合格或不合格信息
export function commitStatus(attributeId,auditorContent,status){
  return request({
    url:'/lawyer/singleSubmit',
    method:'GET',
    params:{
      attributeId:attributeId,
      auditorContent:auditorContent,
      status:status
    }
  })
}

//批量提交合格和不合格信息
export function batchcommitStatus(attributeIds,auditorContent,status){
  return request({
    url:'/lawyer/batchSubmit',
    method:'GET',
    params:{
      attributeIds:attributeIds,
      auditorContent:auditorContent,
      status:status
    }
  })
}

//修改尽职调查(第二步)
export function updateAnswerDataTwo(optionsData){
  let operation = {
    id:optionsData.id,
    answerName:optionsData.name,
    answerPhone:optionsData.phone,
    answerMail:optionsData.email,
  }
  return request({
    url:"/lawyer/updateAnswerDataTwo",
    method:"POST",
    params:operation
  })
}

//删除单行尽调（第二步）
export function deleteListByIdTwo(id){
  return request({
    url:'/lawyer/deleteListByIdTwo',
    method:'DELETE',
    params:{
      id:id
    }
  })
}

//添加附件（第二步专用）
export function insertAttachmentNameTwo(attachmentName,attributeId){
  return request({
    url:'/lawyer/insertattachmentNameTwo',
    method:'POST',
    params:{
      attachmentName:attachmentName,
      attributeId:attributeId,
    }
  })
}
//添加表头信息（第二步专用）
export function addAttachmentHeaderOnTow(attachmentId,attributeId,contentTitles){
  return request({
    url:'/lawyer/insertClientuserContentTitleTwo',
    method:'POST',
    params:{
      attachmentId:attachmentId,
      attributeId:attributeId,
      contentTitles:contentTitles 
    }
  })
}
//删除附件（第二步专用）
export function deleteAttachmentByIdTwo(attachmentId){
  return request({
    url:'/lawyer/deleteAttachmentByIdTwo',
    method:'DELETE',
    params:{
      attachmentId:attachmentId
    }
  })
}


//获取表格相关信息（3确认应答联系人页面）
export function getTableDataAnswering(companyId,workUnitId){
  return request({
    url:'/customer/selectListOrCompanyIdOrStatus',
    method:'GET',
    params:{
      companyId:companyId,
      workUnitId:workUnitId
    }
  })
}

//提交应答联系人
export function submitContact(attributeId,dept,respondName,respondPhone){
  return request({
    url:'/customer/insertClientuserInfo',
    method:'POST',
    params:{
      attributeId:attributeId,
      dept:dept,
      respondName:respondName,
      respondPhone:respondPhone
    }
  })
}

//获取表格相关信息（4发布清单）
export function getTablePublishedPlan(companyId,workUnitId){
  return request({
    url:'/lawyer/selectReleaseListOrCompanyId',
    method:'GET',
    params:{
      companyId:companyId,
      workUnitId:workUnitId
    }
  })
}

//发布清单
export function publishedAllPlan(clientuserInfoIds){
  return request({
    url:"/lawyer/updateReleaseList",
    method:'POST',
    params:{
      clientuserInfoIds:clientuserInfoIds
    }
  })
}

//修改应答联系人
export function updateClientuserInfoById(clientuserInfoId,dept,respondName,respondPhone){
  return request({
    url:'/lawyer/updateClientuserInfoById',
    method:'POST',
    params:{
      clientuserInfoId:clientuserInfoId,
      dept:dept,
      respondName:respondName,
      respondPhone:respondPhone
    }
  })
}

//获取表格相关信息（5上传资料）
export function getTableUploadFiles(companyId,workUnitId){
  return request({
    url:'/customer/selectFileAllListOrCompanyId',
    method:'GET',
    params:{
      companyId:companyId,
      workUnitId:workUnitId,
    }
  })
}

//上传资料
export function uploadDueDiligenceData(attributeId,dataDescribe,fileName,filePath,flag,companyId,workUnitId){
  return request({
    url:'/customer/uploadFile',
    method:'POST',
    params:{
      attributeId:attributeId,
      fileName:fileName,
      filePath:filePath,
      dataDescribe:dataDescribe,
      flag:flag,
      companyId:companyId,
      workUnitId:workUnitId
    }
  })
}

//提交应答内容
export function respondentContent(clientuserInfoId,content){
  return request({
    url:'/customer/insertRespondentContent',
    method:'POST',
    params:{
      clientuserInfoId:clientuserInfoId,
      content:content
    }
  })
}
//提交资料
export function submitFiles(attributeId,status){
  return request({
    url:'/customer/submitFile',
    method:'POST',
    params:{
      attributeId:attributeId,
      status:status
    }
  })
}

//整包上传
export function allFileDataUpload(relativeFileUrl,relativeFileName,dataDescribe,type,flag,workUnitId,companyId){
  return request({
    url:'/customer/dataUpload',
    method:'POST',
    params:{
      companyId:companyId,//公司ID
      dataDescribe:dataDescribe,//文件描述
      flag:flag, //是否加密boolean
      relativeFileName:relativeFileName,//文件全称
      relativeFileUrl:relativeFileUrl,//文件路径
      type:type,//文件类型
      workUnitId:workUnitId //工作单元ID,暂为1
    }
  })
}


//获取附件内容(第五步,和前面不同)
export function getRowContent(attachmentId){
  return request({
    url:'/customer/selectListOrAttachmentId',
    method:'GET',
    params:{
      attachmentId:attachmentId
    }
  })
}

//添加附件内容
export function clientuserContent(attributeContents,headerId){
  return request({
    url:'/customer/insertClientuserContent',
    method:'POST',
    params:{
      attributeContents:attributeContents,//以逗号上传
      headerId:headerId//这个表头ID，进入页面会给 
    }
  })
}

//修改附件内容
export function modifyAttachmentContent(attributeContent,contentId){
  return request({
    url:'/customer/updateClientuserContent',
    method:'POST',
    params:{
      attributeContent:attributeContent,
      contentId:contentId
    }
  })
}

//附件上传（第五、六步使用）
export function uploadAttachment(attachmentId,dataDescribe,fileName,filePath,companyId,workUnitId,flag){
  return request({
    url:'/customer/uploadAttachment',
    method:'POST',
    params:{
      attachmentId:attachmentId,
      fileName:fileName,
      filePath:filePath,
      dataDescribe:dataDescribe,
      companyId:companyId,
      workUnitId:workUnitId,
      flag:flag
    }
  })
}

//附件上传（第八步使用）
export function uploadAttachmentFile(attachmentId,dataDescribe,fileName,filePath,companyId,workUnitId,flag){
  return request({
    url:'/lawyer/uploadAttachmentFile',
    method:'POST',
    params:{
      attachmentId:attachmentId,
      fileName:fileName,
      filePath:filePath,
      dataDescribe:dataDescribe,
      companyId:companyId,
      workUnitId:workUnitId,
      flag:flag
    }
  })
}

//附件删除
export function delAttachmentContentId(attachmentContentId){
  return request({
    url:'/customer/attachmentContentId',
    method:'DELETE',
    params:{
      attachmentContentId:attachmentContentId
    }
  })
}

//附件加密
export function attachmentEncryptionFlag(fileIds){
  return request({
    url:"/customer/attachmentEncryptionFlag",
    method:"POST",
    params:{
      fileIds:fileIds
    }
  })
}

//获取表格内容及搜索功能（6步客户资料）
/* 
  companyId 公司ID    必填
  pagenum   当前页码  必填
  pagesize  每页多少条数据 必填
  workUnitId 工作单元id 必填
  attributeInfoName 尽调清单属性 选填
  beginTime 上传开始时间 年-月-日 选填
  endTime 上传结束时间 年-月-日 选填
  fileName 解压资料名称 选填
  oldFileName 原始资料名称 选填
*/
export function getAuditCustomerData(companyId,pagenum,pagesize,workUnitId,attributeInfoName,beginTime,endTime,fileName,oldFileName){
  let operation = {
    companyId:companyId,
    pagenum:pagenum,
    pagesize:pagesize,
    workUnitId:workUnitId,
  }
  if(attributeInfoName) operation.attributeInfoName=attributeInfoName
  if(beginTime) operation.beginTime=beginTime
  if(endTime) operation.endTime=endTime
  if(fileName) operation.fileName=fileName
  if(oldFileName) operation.oldFileName=oldFileName
  return request({
    url:'/lawyer/selectCustomerFileAllList',
    method:'GET',
    params:operation
  })
}

//客户资料-增加或修改尽调属性
export function setAttributeInfoName(attributeInfoName,id,attributeId,fileType){
  return request({
    url:'lawyer/updateByIdAndAttributeInfoName',
    method:'POST',
    params:{
      attributeInfoName:attributeInfoName,
      id:id,
      attributeId:attributeId,
      fileType:fileType
    }
  })
}

//客户资料-上传资料部分
export function uploadFileOnCustomer(companyId,dataDescribe,fileName,filePath,workUnitId){
  return request({
    url:'/lawyer/insertUploadFile',
    method:'POST',
    params:{
      companyId:companyId,
      dataDescribe:dataDescribe,
      fileName:fileName,
      filePath:filePath,
      workUnitId:workUnitId
    }
  })
}

//客户资料 尽调清单属性 模糊查询(第六步专用，暂时不和其他查询通用)
export function selectDueDiligenceListByAttribute(companyId,workUnitId,attribute){
  return request({
    url:'/lawyer/selectDueDiligenceListByAttribute',
    method:'GET',
    params:{
      companyId:companyId,
      workUnitId:workUnitId,
      attribute:attribute
    }
  })
}

//获取尽调表格的内容（6尽调清单）
export function getSelectListByCompanyId(companyId,workUnitId){
  return request({
    url:'/lawyer/selectListByCompanyId',
    method:'GET',
    params:{
      companyId:companyId,
      workUnitId:workUnitId
    }
  })
}

//修改清单应答
export function setUpdateContent(content,contentId){
  return request({
    url:'/lawyer/updateContentByContentId',
    method:'POST',
    params:{
      content:content,
      contentId:contentId
    }
  })
}

//客尽调清单 确认使用
export function ConfirmToUse(id,isOperation){
  return request({
    url:'/lawyer/isOperationById',
    method:'POST',
    params:{
      id:id,
      isOperation:isOperation
    }
  })
}

//删除资料
export function delAttachmentFile(attachmentId,attributeId){
  return request({
    url:"/lawyer/deleteAttachmentFileById",
    method:"DELETE",
    params:{
      attachmentId:attachmentId,
      attributeId:attributeId
    }
  })
}

//上传资料
export function uploadFileInAttachment(attributeId,dataDescribe,fileName,filePath,type,companyId,workUnitId){
  return request({
    url:'/lawyer/uploadAttributeFileById',
    method:'POST',
    params:{
      attributeId:attributeId,
      dataDescribe:dataDescribe,
      fileName:fileName,
      filePath:filePath,
      type:type,
      companyId:companyId,
      workUnitId:workUnitId
    }
  })
}


//页面展示（7确认关联）
/* 
  companyId 公司ID    必填
  pagenum   当前页码  必填
  pagesize  每页多少条数据 必填
  workUnitId 工作单元id 必填
  attributeInfoName 尽调清单属性 选填
  beginTime 上传开始时间 年-月-日 选填
  endTime 上传结束时间 年-月-日 选填
  fileName 解压资料名称 选填
  oldFileName 原始资料名称 选填
  watchOrUse 00未浏览 01 浏览未使用 02已使用 选填
*/
export function comfirmRespondent(companyId,pagenum,pagesize,workUnitId,attributeInfoName,beginTime,endTime,fileName,oldFileName,watchOrUse){
  let operation = {
    companyId:companyId,
    pagenum:pagenum,
    pagesize:pagesize,
    workUnitId:workUnitId,
  }
  if(attributeInfoName) operation.attributeInfoName=attributeInfoName
  if(beginTime) operation.beginTime=beginTime
  if(endTime) operation.endTime=endTime
  if(fileName) operation.fileName=fileName
  if(oldFileName) operation.oldFileName=oldFileName
  if(watchOrUse) operation.watchOrUse=watchOrUse
  return request({
    url:'/lawyer/selectCustomerFileAllListBy',
    method:'GET',
    params:operation
  })
}

//文件浏览情况
export function fileBrowseAbout(fileId,fileType,watchOrUse){
  return request({
    url:'/lawyer/updateFileBywatchOrUse',
    method:'POST',
    params:{
      fileId:fileId,
      fileType:fileType,
      watchOrUse:watchOrUse
    }
  })
}

//单个提交
export function singleUpdateFile(fileId,fileType,status,workUnitId,auditorContent){
  return request({
    url:'/lawyer/updateFileByStatus',
    method:'POST',
    params:{
      fileId:fileId,
      fileType:fileType,
      status:status,
      auditorContent:auditorContent,
      workUnitId:workUnitId
    }
  })
}

//批量提交
export function batchUpdateFile(fileIds,fileTypes,status,workUnitId,auditorContent){
  return request({
    url:'/lawyer/updateBatchFileByStatus',
    method:'POST',
    params:{
      fileIds:fileIds,
      fileTypes:fileTypes,
      status:status,
      auditorContent:auditorContent,
      workUnitId:workUnitId
    }
  })
}

//不合格文件删除
export function delFileData(fileType,fileId){
  return request({
    url:'/lawyer/deleteDueDiligenceEntiretyDataById',
    method:'DELETE',
    params:{
      fileType:fileType,
      fileId:fileId
    }
  })
}

//确认关联 尽调清单属性 模糊查询(第七步专用，暂时不和其他查询通用)
export function selectIsOperationByAttribute(companyId,workUnitId,attribute){
  return request({
    url:'/lawyer/selectIsOperationByAttribute',
    method:'GET',
    params:{
      companyId:companyId,
      workUnitId:workUnitId,
      attribute:attribute
    }
  })
}



//页面展示（8确认资料）
export function selectGetAllListByCompanyId(companyId,workUnitId){
  return request({
    url:'/lawyer/selectGetAllListByCompanyId',
    method:'GET',
    params:{
      companyId:companyId,
      workUnitId:workUnitId
    }
  })
}

//添加反馈内容(暂时不用，直接会返回，不需要添加)
export function respondentFeedbackContent(clientuserInfoId,fedbackContent){
  return request({
    url:'/lawyer/insertRespondentFeedbackContent',
    method:'POST',
    params:{
      clientuserInfoId:clientuserInfoId,
      fedbackContent:fedbackContent
    }
  })
}

//修改反馈内容
export function updateFeedbackContent(feedbackId,feedbackContent){
  return request({
    url:'lawer/updateRespondentFeedbackContent',
    method:'POST',
    params:{
      feedbackId:feedbackId,
      feedbackContent:feedbackContent
    }
  })
}

//上传文件 第8步
export function uploadDueDiligenceDataFile(attributeId,companyId,workUnitId,dataDescribe,fileName,filePath,type){
  return request({
    url:'/lawyer/uploadDueDiligenceDataFile',
    method:'POST',
    params:{
      attributeId:attributeId,
      companyId:companyId,
      workUnitId:workUnitId,
      dataDescribe:dataDescribe,
      fileName:fileName,
      filePath:filePath,
      type:type
    }
  })
}

//9 关联底稿 列表显示
/* 
  companyId 公司ID    必填
  pagenum   当前页码  必填
  pagesize  每页多少条数据 必填
  workUnitId 工作单元id 必填
  attributeInfoName 尽调清单属性 选填
  beginTime 上传开始时间 年-月-日 选填
  endTime 上传结束时间 年-月-日 选填
  fileName 解压资料名称 选填
  oldFileName 原始资料名称 选填
  manuscriptInfoName 底稿属性 选填
*/
export function selectRelationFileAllList(companyId,pagenum,pagesize,workUnitId,beginTime,endTime,fileName,oldFileName,manuscriptInfoName,planInfoName){
  let operation = {
    companyId:companyId,
    pagenum:pagenum,
    pagesize:pagesize,
    workUnitId:workUnitId,
  }
  if(beginTime) operation.beginTime = beginTime
  if(endTime) operation.endTime = endTime
  if(fileName) operation.fileName = fileName
  if(oldFileName) operation.oldFileName = oldFileName
  if(manuscriptInfoName) operation.manuscriptInfoName = manuscriptInfoName
  if(planInfoName) operation.planInfoName = planInfoName
  return request({
    url:'/lawyer/selectRelationFileAllList',
    method:'GET',
    params:operation
  })
}

//9 关联底稿 添加底稿属性
export function insertRelationManuscripts(fileId,manuscriptInfoName){
  return request({
    url:'/lawyer/insertRelationManuscripts',
    method:'POST',
    params:{
      fileId:fileId,
      manuscriptInfoName:manuscriptInfoName
    }
  })
}
//9 关联底稿 添加计划属性
export function insertRelationPlanInfoName(fileId,planInfoName){
  return request({
    url:'/lawyer/insertRelationPlanInfoName',
    method:'POST',
    params:{
      fileId:fileId,
      planInfoName:planInfoName
    }
  })
}

//9 关联底稿 模糊查询底稿属性 
export function selectListByAttributeAndMatterNo(companyId,workUnitId,attribute){
  return request({
    url:'/lawyer/selectListAttributes',
    method:'POST',
    params:{
      companyId:companyId,
      workUnitId:workUnitId,
      attribute:attribute
    }
  })
}

//9关联底稿 模糊查询底稿属性（搜索框）
export function selectListByManuscriptInfoName(companyId,workUnitId,manuscriptInfoName){
  return request({
    url:'/lawyer/selectListByManuscriptInfoName',
    method:'POST',
    params:{
      companyId:companyId,
      workUnitId:workUnitId,
      manuscriptInfoName:manuscriptInfoName
    }
  })
}

//9 关联底稿 计划属性 
export function relationPlanInfo(matterNo,no){
  return request({
    url:'/lawyer/relationPlanInfo',
    method:'POST',
    params:{
      matterNo:matterNo,
      no:no
    }
  })
}
//9 关联底稿 计划属性 (搜索框)
export function selectListByPlanInfoName(companyId,workUnitId,planInfoName){
  return request({
    url:'/lawyer/selectListByPlanInfoName',
    method:'POST',
    params:{
      companyId:companyId,
      workUnitId:workUnitId,
      planInfoName:planInfoName
    }
  })
}

//搜索里的解压文件名称搜索 模糊搜索 文件名称 （第九步）
export function getAllFileName(companyId,workUnitId,fileName){
  return request({
    url:'/lawyer/getAllFileNameByFeedbackContent',
    method:'GET',
    params:{
      companyId:companyId,
      workUnitId:workUnitId,
      fileName:fileName
    }
  })
}

//搜索里的原始资料名称搜索 （第九步）
export function getAllOldFileName(companyId,workUnitId,oldFileName){
  return request({
    url:'/lawyer/getAllOldFileNameByFeedbackContent',
    method:'GET',
    params:{
      companyId:companyId,
      workUnitId:workUnitId,
      oldFileName:oldFileName
    }
  })
}

//模糊搜索 尽调属性（搜索框）
export function getSelectFileData(companyId,workUnitId,attributeInfoName){
  return request({
    url:"/lawyer/selectDueligenceAllFileData",
    method:'POST',
    params:{
      companyId:companyId,
      workUnitId:workUnitId,
      attributeInfoName:attributeInfoName
    }
  })
}

//模糊搜索 文件名称（第六七步）
export function getAllFileNameforSix(companyId,workUnitId,fileName){
  return request({
    url:'/lawyer/getAllFileName',
    method:'GET',
    params:{
      companyId:companyId,
      workUnitId:workUnitId,
      fileName:fileName
    }
  })
}

//模糊搜索 原始资料名称搜索(第六七步)
export function getAllOldFileNameforSix(companyId,workUnitId,oldFileName){
  return request({
    url:'/lawyer/getAllOldFileName',
    method:'GET',
    params:{
      companyId:companyId,
      workUnitId:workUnitId,
      oldFileName:oldFileName
    }
  })
}