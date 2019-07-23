export default {
    path: '/regulatoryInterview/:id',
    component: () => import('@/pages/regulatoryInterview/Index'),
    name: 'regulatoryInterview',
    redirect: '/regulatoryInterview/:id/regulatoryCreatePlan',
    meta: {
        title: '监管部门访谈'
    },
    children: [{
        path: 'regulatoryCreatePlan',
        component: () => import('@/pages/regulatoryInterview/createPlan/Index'),
        name: 'regulatoryCreatePlan',
        meta: {
            //title: '创建计划'
            pageId: '43'
        }
    },
    {
        path: 'regulatoryConfirmPlan',
        component: () => import('@/pages/regulatoryInterview/confirmPlan/Index'),
        name: 'regulatoryConfirmPlan',
        meta: {
            //title: '确认计划'
            pageId: '44'
        }
    },
    {
        path: 'regulatoryExecutiveInterview',
        component: () => import('@/pages/regulatoryInterview/executiveInterview/Index'),
        name: 'regulatoryExecutiveInterview',
        meta: {
            //title: '执行访谈'
            pageId: '45'
        }
    },
    {
        path: 'regulatoryAuditInterview',
        component: () => import('@/pages/regulatoryInterview/auditInterview/Index'),
        name: 'regulatoryAuditInterview',
        meta: {
            //title: '审核访谈'
            pageId: '46'
        }
    },
    {
        path: 'regulatoryRelatedDraft',
        component: () => import('@/pages/regulatoryInterview/relatedDraft/Index'),
        name: 'regulatoryRelatedDraft',
        meta: {
            //title: '关联底稿'
            pageId: '47'
        }
    }
    ]
}