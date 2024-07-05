import Layout from '@/components/common/index.vue'
const rootPath = process.env.VUE_APP_ROOT_PATH

export const FormManage = [
  {
    path: `${rootPath}/formmanage`,
    name: 'FormManage',
    component: Layout,
    redirect: `${rootPath}/form/list`,
    meta: { title: '表单管理', icons: ['menu-icon-manage.png', 'menu-icon-manage-current.png'] },
    children: [
      {
        path: `${rootPath}/form/list`,
        name: 'BaseFormList',
        component: () => import('@/views/form/list'),
        meta: { title: '表单列表' }
      },
      {
        path: `${rootPath}/form/detail`,
        name: 'BaseFormDetail',
        hidden: true,
        component: () => import('@/views/form/detail'),
        meta: { title: '表单详情', noTab: true, highlightPath: `${rootPath}/form/list` }
      },
      {
        path: `${rootPath}/form/addOrEdit`,
        name: 'BaseFormAddOrEdit',
        hidden: true,
        component: () => import('@/views/form/addOrEdit'),
        meta: { title: '表单管理', noTab: true, highlightPath: `${rootPath}/form/list` }
      }
    ]
  }
]
