export default {
    path: '/partnersInterview/:id',
    component: () => import('@/pages/partnersInterview/Index'),
    name: 'partnersInterview',
    redirect: '/partnersInterview/:id/partnersCreatePlan',
    meta: {
        title: '业务伙伴访谈',
    },
    children: [{
        path: 'partnersCreatePlan',
        component: () => import('@/pages/partnersInterview/createPlan/Index'),
        name: 'partnersCreatePlan',
        meta: {
            //title: '创建计划'
            pageId: '38'
        }
    },
    {
        path: 'partnersConfirmPlan',
        component: () => import('@/pages/partnersInterview/confirmPlan/Index'),
        name: 'partnersConfirmPlan',
        meta: {
            //title: '确认计划'
            pageId: '39'
        }
    },
    {
        path: 'partnersExecutiveInterview',
        component: () => import('@/pages/partnersInterview/executiveInterview/Index'),
        name: 'partnersExecutiveInterview',
        meta: {
            //title: '执行访谈'
            pageId: '40'
        }
    },
    {
        path: 'partnersAuditInterview',
        component: () => import('@/pages/partnersInterview/auditInterview/Index'),
        name: 'partnersAuditInterview',
        meta: {
            //title: '审核访谈'
            pageId: '41'
        }
    },
    {
        path: 'partnersRelatedDraft',
        component: () => import('@/pages/partnersInterview/relatedDraft/Index'),
        name: 'partnersRelatedDraft',
        meta: {
            //title: '关联底稿'
            pageId: '42'
        }
    }
    ]
}