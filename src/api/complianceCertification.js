import _this from '@/main.js';
import request from '@/utils/request';
import qs from 'qs';


export function getInterviewPlanData(workUnitId,pagenum,pagesize) {
    return request({
        url: '/proofCertification/list',
        method: 'get',
        params:{
            pagenum:pagenum,
            pagesize:pagesize,
            workUnitId:workUnitId,
        }
    })
}
  // 导入证明计划
export function importPlan(filePath,workUnitId ) {
  return request({
      url: '/proofCertification/import',
      method: 'post',
      params:{
          filePath:filePath,
          workUnitId  :workUnitId,
      }
  })
}
// 导出证明计划
// export function exportInterview(params) {
//   return request({
//     url: '/proofCertification/export',
//     method: 'get',
//     params: params
//   })
// }
export function exportInterview(params) {
    return request({
        url: '/proofCertification/export',
        method: 'get',
        params: {
            proofIds:params.proofCertification
        }
    })
}
// 下载证明计划模版
export function downloadTemplate(url, fileName, type, proofIds) {
  //console.log(url)
  let downloadUrl = url;
  switch (type) {
    case 'Template':
      downloadUrl += process.env.VUE_APP_BASEURL+'/proofCertification/download'
      break;
    case 'InterviewPlan':
      downloadUrl += process.env.VUE_APP_BASEURL+'/proofCertification/export?&proofIds=' + proofIds
      break;
    default:
      //
  }
  let xhr = new XMLHttpRequest();
  xhr.open("GET", downloadUrl, true);
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
// 删除证明
export function deleteInterview(params) {
  return request({
    url: '/proofCertification/' + params,
    method: 'delete'
  })
}
// 提交确认
export function confirmInterview() {
  let type = Object.prototype.toString.call(arguments[0]);
  if (type === '[object Array]') {
    return request({
      url: 'proofCertification/confirmAll',
      method: 'get',
      params: {
        proofIds: arguments[0].toString()
      }
    })
  } else {
    return request({
      url: '/proofCertification/confirm/' + arguments[0],
      method: 'get'
    })
  }
}
/* ------确认计划------ */
// 获取已提交的证明计划
// export function getAllSubmitted(options){
//   let type = typeof options;
// 	return request({
// 		url:'/proofCertification/getAllSubmitted',
// 		method:'get',
//     params: type == 'string' ? {name: options, workUnitId: this.$route.params.id} : options
// //params: Object.assign(JSON.parse(JSON.stringify(workUnitId)))
// 	})
// }
export function getAllSubmitted(name,status,type,workUnitId,pagenum,pagesize) {
  return request({
      url: '/proofCertification/getAllSubmitted',
      method: 'get',
      params:{
          name:name,
          status:status,
          type:type,
          pagenum:pagenum,
          pagesize:pagesize,
          workUnitId:workUnitId,
      }
  })
}
//模糊查询确认计划
export function getNames(name ,stept,workUnitId) {
  return request({
    url: '/proofCertification/getNames',
    method: 'get',
    params:{
      name:name,
      stept:stept,
      workUnitId:workUnitId
    }
  })
}
// 证明计划合格
export function interviewQualified(proofId) {
  return request({
    url: '/proofCertification/pass/' + proofId,
    method: 'get'
  })
}
// 证明计划合格(多选)
export function interviewQualifiedAll(proofId) {
  return request({
    url: '/proofCertification/passAll',
    method: 'get',
    params: {
      proofIds: proofId
    }
  })
}

// 证明计划不合格(多选)
export function interviewUnqualifiedAll(proofIds, value) {
  return request({
    url: '/proofCertification/noPassAll?proofIds='+proofIds,
    method: 'get',
    params: {
      // proofIds: proofIds,
      remarks: value
    }
  })
}

// 证明计划不合格
export function interviewUnqualified(proofId, value) {
  return request({
    url: '/proofCertification/noPass/' + proofId,
    method: 'get',
    params: {
      remarks: value
    }
  })
}
// 负责律师删除
export function deleteInterviews(params) {
  return request({
    url: '/proofCertification/deleteInfo/' + params,
    method: 'delete'
  })
}


/* ------上传证明------ */
// 分页查询所有合规证明
// export function getAllSubmitteds(options){
//   let type = typeof options;
// 	return request({
// 		url:'/proofCertification/getAllExecute',
// 		method:'get',
// 		params: type == 'string' ? {name: options, workUnitId: 1} : options
// 	})
// }
export function getAllSubmitteds(name,status,type,workUnitId,pagenum,pagesize) {
  return request({
      url: '/proofCertification/getAllExecute',
      method: 'get',
      params:{
          name:name,
          status:status,
          type:type,
          pagenum:pagenum,
          pagesize:pagesize,
          workUnitId:workUnitId,
      }
  })
}
//上传证明
export function uploadOutline(params) {
  return request({
    url: '/proofCertification/uploadOutline',
    method: 'get',
    params:params
  })
}
// 提交审核
export function submitExcute(proofId) {
  return request({
    url: '/proofCertification/submitExcute',
    method: 'get',
    params: {
      proofId: proofId
    }
  })
}
/* ------审核证明证明------ */
// 分页查询所有合规证明
// export function getAllSubmittedss(options){
//   let type = typeof options;
// 	return request({
// 		url:'/proofCertification/getExecuted',
// 		method:'get',
// 		params: type == 'string' ? {name: options, workUnitId: 1} : options
// 	})
// }
export function getAllSubmittedss(name,status,type,workUnitId,pagenum,pagesize) {
  return request({
      url: '/proofCertification/getExecuted',
      method: 'get',
      params:{
          name:name,
          status:status,
          type:type,
          pagenum:pagenum,
          pagesize:pagesize,
          workUnitId:workUnitId,
      }
  })
}
//重传证明
export function uploadOutlines(params) {
  return request({
    url: '/proofCertification/upload',
    method: 'get',
    params:params
  })
}
//不合格
export function interviewUnqualifieds(proofId, value) {
  return request({
    url: '/proofCertification/noExecutePass/' + proofId,
    method: 'get',
    params: {
      remarks: value
    }
  })
}
//合格
export function interviewQualifieds(proofId) {
  return request({
    url: '/proofCertification/executePass/' + proofId,
    method: 'get'
  })
}
//4-多选-不合格
export function noPassAll(proofIds,remarks) {
    console.log(proofIds)
    return request({
        url: '/proofCertification/noPassExcuteAll' ,
        method: 'get',
        params:{
            proofIds:proofIds,
            remarks:remarks,
        }
    })
}
//4-多选-合格
export function passAll(proofIds) {
    return request({
        url: '/proofCertification/passExcuteAll?proofIds='+proofIds ,
        method: 'get',
        // params:{
        //     proofIds:proofIds,
        // }
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
//5-列表
export function fiveList(options) {
    return request({
        url: '/proofCertification/relation/getRelationList',
        method: 'get',
        params:{
            name:options.name,
            pagenum:options.pagenum,
            pagesize :options.pagesize ,
            type:options.type,
            workUnitId :options.workUnitId ,
            manuscriptStatus:options.manuscriptStatus,
            manuscriptAttri:options.manuscriptAttri,
            planAttri:options.planAttri,
            planStatus:options.planStatus,
        }
    })
}

//5-底稿属性
export function fiveMaunApi(options) {
    return request({
        url: '/proofCertification/relation/getManuscriptList',
        method: 'get',
        params:{
            manuscriptAttribute:options.manuscriptAttribute,
            workUnitId:options.workUnitId  ,
        }
    })
}
//5-底稿属性--提交
export function fiveMaunSave(options) {
    return request({
        url: '/proofCertification/relation/manuscript/{proofId}',
        method: 'post',
        params:{
            manuscript:options.manuscript,
            proofId:options.proofId,
        }
    })
}
//5-计划属性
export function fivePlanApi(options) {
    return request({
        url: '/proofCertification/relation/getPlanList',
        method: 'get',
        params:{
            planAttribute:options.planAttribute,
            workUnitId:options.matterNo ,
        }
    })
}
//5-计划属性--提交
export function fivePlanSaveApi(options) {
    return request({
        url: '/proofCertification/relation/plan/{proofId}' ,
        method: 'post',
        params:{
            plan:options.plan,
            proofId:options.proofId,
        }
    })
}
//5-列表模糊搜索
export function fiveSearchApi(options) {
    return request({
        url: 'proofCertification/getNames' ,
        method: 'get',
        params:{
            name:options.name,
            stept:options.stept,
            workUnitId :options.workUnitId ,
        }
    })
}
//2-列表类型下拉框
export function secondSelectApi(options) {
    return request({
        url: 'proofCertification/getTypes' ,
        method: 'get',
        params:{
            name:options.name,
        }
    })
}
// 3,4列表查看
export function certifyView(options) {
    return request({
        url: 'proofCertification/fileList' ,
        method: 'get',
        params:{
            proofId:options,
        }
    })
}
