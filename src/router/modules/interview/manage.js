export default {

    path: '/manageInterview/:id',
    component: () => import('@/pages/manageInterview/Index'),
    name: 'manageInterview',
    redirect: '/manageInterview/:id/createPlan',
    meta: {
        title: '管理层访谈',
    },
    children: [{
        path: 'createPlan',
        component: () => import('@/pages/manageInterview/createPlan/Index'),
        name: 'createPlan',
        meta: {
            //title: '创建计划'
            pageId: "33"
        }
    },
    {
        path: 'confirmPlan',
        component: () => import('@/pages/manageInterview/confirmPlan/Index'),
        name: 'confirmPlan',
        meta: {
            //title: '确认计划'
            pageId: "34"
        }
    },
    {
        path: 'executiveInterview',
        component: () => import('@/pages/manageInterview/executiveInterview/Index'),
        name: 'executiveInterview',
        meta: {
            //title: '执行访谈'
            pageId: "35"
        }
    },
    {
        path: 'auditInterview',
        component: () => import('@/pages/manageInterview/auditInterview/Index'),
        name: 'auditInterview',
        meta: {
            //title: '审核访谈'
            pageId: "36"
        }
    },
    {
        path: 'relatedDraft',
        component: () => import('@/pages/manageInterview/relatedDraft/Index'),
        name: 'relatedDraft',
        meta: {
            //title: '关联底稿'
            pageId: "37"
        }
    }
    ]

}