import layout from '@/layout/index.vue'
import NotFound from '@/layout/404.vue'

const routes = [
  // {
  //   path: '/',
  //   name: '/',
  //   redirect: '',
  // },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/view/login/login'),
    hidden: true,
  },
  {
    path: '/',
    name: 'index',
    component: layout,
    children: [
      {
        path: '/Workflow',
        name: 'Workflow',
        component: () => import('@/view/workflow/index'),
      },
      {
        path: '/Form',
        name: 'Form',
        component: () => import('@/view/form/index'),
      },
      {
        path: '/Home',
        name: 'Home',
        component: () => import('@/view/home/index'),
      },
      // {
      //   path: '/home/History',
      //   name: 'History',
      //   component: () => import('@/view/historyWorkflow/HistoryWorkflow'),
      // },
      // {
      //   path: '/home/RunTime',
      //   name: 'RunTime',
      //   component: () => import('@/view/runtime/index'),
      //   hidden: true,
      // },
      // {
      //   path: '/home/noPermission',
      //   name: 'noPermission',
      //   component: () => import('@/component/permission/index'),
      //   hidden: true,
      // },
      // {
      //   path: '/home/Configuration',
      //   name: 'Configuration',
      //   component: () => import('@/view/configuration'),
      //   hidden: true,
      // },
      // {
      //   path: '/home/Power',
      //   name: 'Power',
      //   component: () => import('@/view/power'),
      //   hidden: true,
      // },
    ],
  },
  {
    path: '*',
    component: NotFound
  },
  {
    path: '/workflow-viewer/:processInstanceId',
    name: 'WorkflowViewer',
    component: () => import('@/view/workflowViewer'),
    hidden: true,
  },
]

export default routes
