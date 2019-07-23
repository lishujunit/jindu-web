import request from '@/utils/request'
import qs from 'qs';

// 项目详情-前期文件
export function processList(category,pagenum,pagesize,val,selectFile,selectName) {
    return request({
        url: '/prophasefile',
        method: 'get',
        params: {
            category:category,
            pagenum: pagenum,
            pagesize: pagesize,
            projectNo: val,
            fileName:selectFile,
            category:category,
            createUserName:selectName
        }
    })
}
//上传文件
export function uoloadFile(category,fileName,filePath,projectNo) {
    return request({
        url: '/prophasefile',
        method: 'post',
        data: {
            category:category,
            fileName:fileName,
            filePath: filePath,
            projectNo:projectNo
        }
    })
}

