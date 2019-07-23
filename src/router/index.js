import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import layout from '@/pages/layout/index'
import store from '@/store'

import manageInterview from './modules/interview/manage' //管理层访谈
import partnersInterview from './modules/interview/partners' //业务伙伴访谈
import regulatoryInterview from './modules/interview/regulatory' //监管部门访谈

export const constantRouterMap = [{
  path: '',
  component: layout,
  redirect:(process.env.VUE_APP_LOGIN=='login'?'customerIndex':'myWork'),
  hidden: true,
  children: [
    /*{
    		path: 'home',
    		component: () => import('@/pages/home/index'),
    		name: 'home',
    		meta: {
    			title: '首页',
    		}
    	},*/
    {
      path: 'select',
      component: () => import('@/pages/netCheck/select'),
      name: 'select',
      meta: {
        title: '抓取项目',
      }
    }, {
      path: 'netCheck/:projectNo',
      redirect: '/netCheck/:projectNo/createMenu',
      component: () => import('@/pages/netCheck/index'),
      name: 'netCheck',
      meta: {
        title: '网络核查',
      },
      children: [{
          path: 'createMenu',
          component: () => import('@/pages/netCheck/components/createMenu'),
          name: 'createMenu',
          meta: {
            //title: '创建计划'
            pageId: '48'
          }
        }, {
          path: 'crawlFile',
          component: () => import('@/pages/netCheck/components/crawlFile'),

          name: 'crawlFile',
          meta: {
            //title: '爬取资料'
            pageId: '50'
          }
        },
        {
          path: 'calibration',
          component: () => import('@/pages/netCheck/components/calibration'),
          name: 'calibration',
          redirect: 'calibration/list',
          meta: {
            //title: '校验资料'
          },
          children: [{
            path: 'list',
            component: () => import('@/pages/netCheck/components/components/tabText'),
            name: 'calibration',
            meta: {
              //title: '校验资料'
              pageId: '51'
            }
          }, {
            path: 'viewImage/:id',
            component: () => import('@/pages/netCheck/components/components/viewImage'),
            name: 'viewImage',
            meta: {
              title: '查看图片',
              isStep: true,
              pageId: '51'
            }
          }]
        },
        {
          path: 'auditData',
          component: () => import('@/pages/netCheck/components/auditData'),
          redirect: 'auditData/list',
          meta: {
            //title: '审核资料'
          },
          name: 'auditData',
          children: [{
            path: 'list',
            component: () => import('@/pages/netCheck/components/components/auditList'),
            name: 'auditData',
            meta: {
              //title: '审核资料'
              pageId: '52'
            }
          }, {
            path: 'viewImage/:id',
            component: () => import('@/pages/netCheck/components/components/viewImage'),
            name: 'viewImage',
            meta: {
              title: '查看图片',
              isStep: true,
              pageId: '52'
            }
          }]
        },
        {
          path: 'relatedManuscript',
          component: () => import('@/pages/netCheck/components/relatedManuscript'),
          redirect: 'relatedManuscript/list',
          name: 'relatedManuscript',
          meta: {
            //title: '关联底稿'
          },
          children: [
            {
              path: 'list',
              component: () => import('@/pages/netCheck/components/components/relatedManuscriptList'),
              name: 'relatedManuscriptList',
              meta: {
                //title: '关联底稿'
                pageId: '53'
              }
            },
            {
              path: 'viewImage/:id',
              component: () => import('@/pages/netCheck/components/components/viewImage'),
              name: 'viewImage',
              meta: {
                title: '查看图片',
                isStep: true,
                pageId: '53'
              }
            }
          ]
        }
      ]
    }, {
      path: 'manualSearch/list',
        component: () => import('@/pages/netCheck/manualSearch/list'),
        name: 'manualSearch',
        meta: {
        	auth:'other',
          title: '人工检索内部截图库'
        }
    },
      {
          path: 'manualSearch/details/:id',
          component: () => import('@/pages/netCheck/manualSearch/details'),
          name: 'manualDetails',
          meta: {
          	  auth:'other',
              title: '查看图片'
          }
      },
      {
      path: 'myWork',
      component: () => import('@/pages/myWork/index'),
      redirect: '/myWork/list',
      meta: {
        title: '我的工作台',
      },
      children: [{
          path: 'list',
          name: 'myWork',
          component: () => import('@/pages/myWork/list/index'),
          meta: {
            title: '我的工作台',
            pageId: '6'
          }
        }, {
          path: 'details/:id',
          name: 'projectDetails',
          component: () => import('@/pages/myWork/project/index'),
          meta: {
            title: '项目详情页',
          }
        }, {
          path: 'manuscript/:id',
          name: 'manuscript',
          component: () => import('@/pages/myWork/manuscript/index'),
          meta: {
            title: '底稿',
          }
        },
        {
          path: 'ProcessFile/:id',
          name: 'ProcessFile',
          component: () => import('@/pages/myWork/ProcessFile/index'),
          meta: {
            title: '过程文件',
            pageId: '12'
          }
        }, {
          path: 'processList/:id',
          name: 'processList',
          component: () => import('@/pages/myWork/processFileList/processList/processList'),
          meta: {
            title: '过程文件-题目列表',
            pageId: '12'
          }
        },

        {
          path: 'preveFile/:id',
          name: 'preveFile',
          component: () => import('@/pages/preveFile/preveFile'),
          meta: {
            title: '前期文件',
            pageId: '11'
          }
        }, {
          path: 'processFileList/:id',
          name: 'processFileList',
          component: () => import('@/pages/myWork/processFileList/fileIndex'),
          meta: {
            title: '过程文件',
            pageId: '13'
          }
        }
      ]
    },
    {
      path: 'customerIndex',
      redirect: '/customerIndex/index',
      component: () => import('@/pages/myWorkCustomerList/customerIndex'),
      meta: {
        title: '我的工作台-客户项目列表'
      },
      children: [{
          path: 'index',
          name: 'customerIndex',
          component: () => import('@/pages/myWorkCustomerList/list/index'),
          // meta: {
          //   title: '我的工作台-客户项目列表'
          // }
        },
        {
          path: 'stepsList',
          name: 'stepsList',
          redirect: '/stepsList/contactor',
          component: () => import('@/pages/myWorkCustomerList/list/stepsList'),
          // meta: {
          //   title: 'stepList'
          // },
          children: [{
            path: '/stepsList/contactor',
            name: 'contactor',
            component: () => import('@/pages/myWorkCustomerList/Componets/contactor'),
            // meta: {
            //   title: '确认应答联系人'
            // }
          }, {
            path: '/stepsList/upload',
            name: 'upload',
            component: () => import('@/pages/myWorkCustomerList/Componets/upload'),
            meta: {
              title: '上传文件'
            }
          }, {
            path: '/stepsList/uploadothers',
            name: 'uploadothers',
            component: () => import('@/pages/myWorkCustomerList/Componets/uploadothers'),
            meta: {
              title: '整包上传文件'
            }
          }, ]
        },
      ]
    },
    {
      path: '/finalReport/:id',
      name: 'finalReport',
      component: () => import('@/pages/myWorkFinalReport/finalReport'),
      meta: {
        title: '我的工作台-最终底稿',
        pageId:'14'
      }
    },
    manageInterview,
    partnersInterview,
    regulatoryInterview,
    {
      path: '/workUnitInquiry',
      component: () => import('@/pages/workUnitInquiry/index'),
      redirect: '/workUnitInquiry/unitCreate',
      meta: {
        title: '询证'
      },
      children: [{
        path: 'unitCreate/:id',
        name: 'unitCreate',
        component: () => import('@/pages/workUnitInquiry/project/createPlan'),
        meta:{
            pageId:'59'
          // title:'创建计划'
        }
      }, {
        path: 'unitConfirm/:id',
        name: 'unitConfirm',
        component: () => import('@/pages/workUnitInquiry/project/confirmPlan'),
        meta:{
            pageId:'60'
        //     title:'确认计划'
        }
      }, {
        path: 'uploadRecall/:id',
        name: 'uploadRecall',
        component: () => import('@/pages/workUnitInquiry/project/uploadRecall'),
        meta:{
            pageId:'61'
        //     title:'上传回函'
        }
      }, {
        path: 'checkRecall/:id',
        name: 'checkRecall',
        component: () => import('@/pages/workUnitInquiry/project/checkRecall'),
        meta:{
            pageId:'62'
            // title:'审核回函'
        }
      }, {
        path: 'relatiopnRecall/:id',
        name: 'relatiopnRecall',
        component: () => import('@/pages/workUnitInquiry/project/relatiopnRecall'),
        meta:{
            pageId:'63'
            // title:'关联回函'
        }
      }]
    },
    {
      path: '/complianceCertification',
      component: () => import('@/pages/complianceCertification/Index'),
      name: 'complianceCertification',
      redirect: '/complianceCertification/createPlans',
      meta: {
        title: '合规证明',
      },
      children: [{
          path: 'createPlans/:id',
          component: () => import('@/pages/complianceCertification/createPlans/Index'),
          name: 'createPlans',
          meta: {
              pageId:'54'
            // title: '创建计划'
          }
        },
        {
          path: 'confirmPlans/:id',
          component: () => import('@/pages/complianceCertification/confirmPlans/Index'),
          name: 'confirmPlans',
          meta: {
              pageId:'55'
            // title: '确认计划'
          }
        },
        {
          path: 'uploadProof/:id',
          component: () => import('@/pages/complianceCertification/uploadProof/Index'),
          name: 'uploadProof',
          meta: {
              pageId:'56'
            // title: '上传证明'
          }
        },
        {
          path: 'auditCertificate/:id',
          component: () => import('@/pages/complianceCertification/auditCertificate/Index'),
          name: 'auditCertificate',
          meta: {
              pageId:'57'
            // title: '审核证明'
          }
        },
        {
          path: 'correlationProof/:id',
          component: () => import('@/pages/complianceCertification/correlationProof/Index'),
          name: 'correlationProof',
          meta: {
              pageId:'58'
            // title: '关联证明'
          }
        }
      ]
    },
    {
      path: '/selfDefine',
      redirect: '/selfDefine/uploadFiles',
      component: () => import('@/pages/selfDefine/selfDefine'),
      meta: {
        title: '自定义名称'
      },
      children: [{
        path: 'uploadFiles/:id',
        name: 'uploadFiles',
        component: () => import('@/pages/selfDefine/pages/uploadFiles'),
        meta: {
            pageId:'64'
        }
      }, {
        path: 'checkFiles/:id',
        name: 'checkFiles',
        component: () => import('@/pages/selfDefine/pages/checkFiles'),
        meta: {
            pageId:'65'
        }
      }, {
        path: 'relationDraf/:id',
        name: 'relationDraf',
        component: () => import('@/pages/selfDefine/pages/relationDraf'),
        meta: {
            pageId:'66'
        }
      }]
    },{
      path:'/inspectionPlan',
      //redirect:'/inspectionPlan/inspectionCreate',
      redirect: () => {
        return '/inspectionPlan/inspectionCreate/'+store.state.id
      },
      component:()=>import('@/pages/inspectionPlan/index'),
      meta:{
        title:'查验计划编制与实施'
      },
        children:[{
          path:'inspectionCreate/:id',
          name:'inspectionCreate',
          component:()=>import('@/pages/inspectionPlan/pages/inspectionCreate'),
          meta: {
              pageId:'16'
          }
        },{
            path:'checkPlan/:id',
            name:'checkPlan',
            component:()=>import('@/pages/inspectionPlan/pages/checkPlan'),
            meta: {
                pageId:'17'
            }
        },{
            path:'inspectPlan/:id',
            name:'inspectPlan',
            component:()=>import('@/pages/inspectionPlan/pages/inspectPlan'),
            meta: {
                pageId:'18'
            }
        },{
            path:'checkResult/:id',
            name:'checkResult',
            component:()=>import('@/pages/inspectionPlan/pages/checkResult')
        },
        ]
      },
      {
        path: '/dueDiligence',
        component: () => import('@/pages/dueDiligence/Index'),
        redirect: '/dueDiligence/createRepertoire',
        meta: {
          title: '尽调文件收集与处理',
        },
        children: [{
            path: 'createRepertoire/:id',
            component: () => import('@/pages/dueDiligence/createRepertoire/Index'),
            name: 'createRepertoire',
            meta: {
              titles: '创建清单',
              pageId:'20'
            }
          },{
            path: 'createRepertoireAddAccessory/:id',
            component: () => import('@/pages/dueDiligence/addAccessory/Index'),
            name: 'createRepertoireAddAccessory',
            meta: {
              titles: '创建清单附件',
              pageId:'21'
            }
          },{
            path: 'confirmRepertoire/:id',
            component: () => import('@/pages/dueDiligence/confirmRepertoire/Index'),
            name: 'confirmRepertoire',
            meta: {
              titles: '确认清单',
              pageId:'22'
            }
          },{
            path: 'confirmRepertoireAddAccessory/:id',
            component: () => import('@/pages/dueDiligence/addAccessory/Index'),
            name: 'confirmRepertoireAddAccessory',
            meta: {
              titles: '确认清单附件',
              pageId:'23'
            }
          },{
            path: 'confirmContacts/:id',
            component: () => import('@/pages/dueDiligence/confirmAnsweringContact/Index'),
            name: 'confirmContacts',
            meta: {
              titles: '确认应答联系人',
              pageId:'24'
            }
          },
          {
            path: 'publishedPlan/:id',
            component: () => import('@/pages/dueDiligence/publishedPlan/Index'),
            name: 'publishedPlan',
            meta: {
              titles: '发布计划',
              pageId:'25'
            }
          },{
            path: 'publishedPlanAddAccessory/:id',
            component: () => import('@/pages/dueDiligence/addAccessory/Index'),
            name: 'publishedPlanAddAccessory',
            meta: {
              titles: '发布清单附件',
              pageId:'23'
            }
          },{
            path: 'uploadingFiles/:id',
            component: () => import('@/pages/dueDiligence/uploadingFiles/Index'),
            name: 'uploadingFiles',
            meta: {
              titles: '上传资料',
              pageId:'26'
            }
          },{
            path: 'uploadingFilesAddAccessory/:id',
            component: () => import('@/pages/dueDiligence/addAccessory/Index'),
            name: 'uploadingFilesAddAccessory',
            meta: {
              titles: '上传资料附件',
              pageId:'27'
            }
          },{
            path: '/auditAndCorrelation/:id',
            component: () => import('@/pages/dueDiligence/auditAndCorrelation/Index'),
            redirect: '/dueDiligence/auditAndCorrelation/customerData/:id',
            name:'auditAndCorrelation',
            meta: {
              titles: '审核资料及关联',
            },
            children: [
              {
                path: '/dueDiligence/auditAndCorrelation/customerData/:id',
                component: () => import('@/pages/dueDiligence/auditAndCorrelation/components/customerData'),
                name: 'customerData',
                meta: {
                  titles: '客户资料',
                  pageId:'28'
                },
              },
              {
                path: '/dueDiligence/auditAndCorrelation/dueDiligenceChecklist/:id',
                component: () => import('@/pages/dueDiligence/auditAndCorrelation/components/dueDiligenceChecklist'),
                name: 'dueDiligenceChecklist',
                meta: {
                  titles: '尽调清单',
                  pageId:'29'
                },
              },
            ]
          },{
            path: 'auditAndCorrelationAddAccessory/:id',
            component: () => import('@/pages/dueDiligence/addAccessory/Index'),
            name: 'auditAndCorrelationAddAccessory',
            meta: {
              titles: '审核资料及关联附件',
              pageId:'27'
            }
          },{
            path: 'confirmRelevance/:id',
            component: () => import('@/pages/dueDiligence/confirmRelevance/Index'),
            name: 'confirmRelevance',
            meta: {
              titles: '确认关联',
              pageId:'30'
            }
          },{
            path: 'confirmInformation/:id',
            component: () => import('@/pages/dueDiligence/confirmInformation/Index'),
            name: 'confirmInformation',
            meta: {
              titles: '确认资料',
              pageId:'31'
            }
          },{
            path: 'confirmInformationAddAccessory/:id',
            component: () => import('@/pages/dueDiligence/addAccessory/Index'),
            name: 'confirmInformationAddAccessory',
            meta: {
              titles: '确认资料附件',
              pageId:'27'
            }
          },{
            path: 'relevanceManuscript/:id',
            component: () => import('@/pages/dueDiligence/relevanceManuscript/Index'),
            name: 'relevanceManuscript',
            meta: {
              titles: '关联底稿',
              pageId:'32'
            }
          }
        ]
      },
      {
        path:'systemManage',
        component:() => import('@/pages/systemManage/index'),
        name:'systemManage',
        redirect: '/systemManage/modelManage',
        children:[
            {
              path:'clientManange',
              name:'clientManange',
              component:() => import('@/pages/systemManage/files/clientManange'),
              meta:{
                title:"客户管理",
                pageId:'69'

              }
            },
            {
                path:'crawlAllocation',
                name:'crawlAllocation',
                component:() => import('@/pages/systemManage/files/crawlAllocation'),
                meta:{
                    title:"爬虫配置",
                    pageId:'70'
                }
            },
            {
                path:'operationsManage',
                name:'operationsManage',
                component:() => import('@/pages/systemManage/files/operationsManage'),
                meta:{
                    title:"爬虫配置",
                    pageId:'71'
                }
            },
            {
                path:'modelManage',
                name:'modelManage',
                component:() => import('@/pages/systemManage/files/modelManage'),
                meta:{
                    title:"模板管理",
                    pageId:'67'
                }
            },
            {
              path:'workInstruction',
              name:'workInstruction',
              component:() => import('@/pages/systemManage/files/workInstruction'),
              meta:{
                  title:"工作指引",
                  pageId: '68'
              }
            }
        ]
      },
      {
        path:'systemMessage',
        component:() =>import('@/pages/systemManage/systemMessage/systemMessage'),
        name:'systemMessage',
        meta:{
          title:'消息管理'
        }
      }
  ]

},{
  path: '/login',
  meta:{
  	auth:'login',
  	pageId: "1"
  },
  component: () => import('@/pages/login/index'),
  hidden: true
},{
	path:'/register',
	meta:{
  	auth:'login',
  	pageId:"4"
  },
  component: () => import('@/pages/login/register'),
  hidden: true
},{
  path: '/register_sec',
  meta:{
  	auth:'login',
  	pageId:'5'
  },
  component: () => import('@/pages/login/register_sec'),
  hidden: true
},{
  path: '/forgotPwd',
  meta:{
  	auth:'login',
  	pageId:'2'
  },
  component: () => import('@/pages/login/forgotPwd'),
  hidden: true
},{
  path: '/resetPwd',
  meta:{
  	auth:'login',
  	pageId:'3'
  },
  component: () => import('@/pages/login/resetPwd'),
  hidden: true
},{
  path: '/adlogin',
  meta:{
  	auth:'adlogin'
  },
  component: () => import('@/pages/login/layer_login'),
  hidden: true
}]

export default new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
