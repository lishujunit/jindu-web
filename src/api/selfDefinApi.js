import request from '@/utils/request'

//页面1- 列表
export function selfDefineApi(pagenum,pagesize,workunitId ) {
    return request({
        url: '/workunit/custom/prepare',
        method: 'get',
        params: {
            pagenum: pagenum,
            pagesize:pagesize,
            workunitId:workunitId
        }
    })
}

//页面1 -- 上传
export function uploadZipApi(bean) {
    return request({
        url: '/workunit/custom/prepare/batch',
        method: 'post',
        data: {
            filePath: bean.filePath,
            remark:bean.remark,
            workunitId:bean.workunitId,
        }
    })
}

//页面1 -- 重传
export function reUploadApi(bean) {
    return request({
        url: '/workunit/custom/prepare',
        method: 'put',
        data: {
            fileName: bean.fileName,
            filePath: bean.filePath,
            id:bean.id,
            remark:bean.remark,
        }
    })
}

//页面1 -- 删除
export function deleteApi(id) {
    return request({
        url: '/workunit/custom/prepare/'+id,
        method: 'delete',
    })
}

//页面1 -- 提交审核
export function oneCheckApi(ids) {
    return request({
        url: '/workunit/custom/prepare/'+ids+'/submit',
        method: 'post',
    })
}

//页面2- 列表
export function secondListApi(pagenum,pagesize,status,workunitId ) {
    return request({
        url: '/workunit/custom/audit',
        method: 'get',
        params: {
            pagenum: pagenum,
            pagesize:pagesize,
            status:status,
            workunitId:workunitId
        }
    })
}

//页面2- 合格
export function secondAuthApi(bean) {
    return request({
        url: '/workunit/custom/audit/pass',
        method: 'post',
        data: {
           ids:bean
        }
    })
}
//页面2- 不合格
export function secondUnauthApi(bean) {
    console.log(bean)
    return request({
        url: '/workunit/custom/audit/fail',
        method: 'post',
        data: {
            ids:bean.ids,
            auditNote:bean.auditNote
        }
    })
}


//页面3- 列表
export function thirdListApi(options) {
    return request({
        url: '/workunit/custom/relationship',
        method: 'get',
        params: {
            pagenum:options.pagenum,
            pagesize:options.pagesize,
            workunitId:options.workunitId,
            fileName:options.fileName,
            manuscriptAttribute:options.manuscriptAttribute,
            manuscriptStatus:options.manuscriptStatus,
            planAttribute:options.planAttribute,
            planStatus:options.planStatus,
        }
    })
}
//页面3- 保存底稿属性
export function thirdSave(bean) {
    return request({
        url: '/workunit/custom/relationship/manuscript',
        method: 'post',
        data: {
            id:bean.id,
            attribute:bean.attribute,
        }
    })
}
//页面3- 底稿数据获取
export function thirdGetManu(options) {
    return request({
        url: '/workunit/custom/relationship/manuscript',
        method: 'get',
        params: {
            name:options.name,
            workunitId:options.workunitId,
        }
    })
}
//页面3- 保存计划属性
export function thirdPlanSave(bean) {
    return request({
        url: '/workunit/custom/relationship/plan',
        method: 'post',
        data: {
            id:bean.id,
            attribute:bean.attribute,
        }
    })
}

//页面3- 计划属性
export function thirdPlans(options) {
    return request({
        url: '/workunit/custom/relationship/plan',
        method: 'get',
        params: {
            name:options.name,
            workunitId:options.workunitId,
        }
    })
}

