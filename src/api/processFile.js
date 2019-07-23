import request from '@/utils/request'

//过程文件列表
export function processFileList(options) {
    return request({
        url: '/processFileTitles/infos/confirmed/'+options.projectNo,
        method: 'get',
        params:{
            pagenum:options.pagenum,
            pagesize :options.pagesize ,
            titleName:options.titleName,
            uploadUserName:options.uploadUserName,
        }
    })
}

//大律师批注
export function processFileRemark(options) {
    return request({
        url: '/processFileTitles/titleNames/remark/'+options.id,
        method: 'put',
        data:{
            remark:options.remark,
        }
    })
}

//模糊搜索--过程文件
export function processSearch(options) {
    return request({
        url: '/processFileTitles/infos/confirmed/fileNamesNotices/'+options.projectNo,
        method: 'get',
        params:{
            fileName:options.fileName,
        }
    })
}

