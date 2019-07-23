import request from '@/utils/request'

//用户查看权限
export function commonAuthApi(projectNo) {
    return request({
        url: '/project/role/'+projectNo,
        method: 'get',
    })
}

