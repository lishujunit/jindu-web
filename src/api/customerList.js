import request from '@/utils/request'
import qs from 'qs';


export function customerProject() {
    return request({
        url: '/project/customerList',
        method: 'POST',

    })
}
//上传文件
export function uoloadFile() {
    return request({
        url: '/interview/manage/import',
        method: 'post',
        data: qs.stringify({
            workUnitId: '1',
            filePath: 'group1/M00/00/22/wKgK0FyKFB6AbjJkAABKAC5Z6R4788.xls'
        })
    })
}
