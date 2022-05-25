import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from'@/layout/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '/',
    redirect: 'login',
    // redirect: 'home',
  },
  {
  	path: '/login',
    name: 'login',
  	component: () => import('@/view/login/login'),
  	hidden: true
  },
  {
    path: '/home',
    name: 'first',
    component: layout,
    redirect: '/home/bpmn',
    children: [
      {
        path: '/home/bpmn',
        name: 'bpmn',
        component: () => import('@/view/workflow/index'),
        meta: { title: 'bpmn', icon: 'dashboard' }
      },
      {
        path: '/home/form',
        name: 'form',
        component: () => import('@/view/form/index'),
        meta: { title: 'bpmn', icon: 'dashboard' }
      },
      {
        path: '/home/home',
        name: 'home',
        component: () => import('@/view/home/index'),
        meta: { title: 'bpmn', icon: 'dashboard' }
      },
      {
        path: '/home/history',
        name: 'history',
        component: () => import('@/view/historyWorkflow/HistoryWorkflow'),
        meta: { title: 'history', icon: 'dashboard' }
      },
      {
        path: '/home/runTime',
        name: 'runTime',
        component: () => import('@/view/runtime/index'),
        hidden: true
      },
      {
        path: '5',
        name: '5',
        component: () => import('@/layout/404'),
        hidden: true
      },
      {
        path: '/home/all',
        name: 'all',
        component: () => import('@/view/configuration'),
        hidden: true,
      },
      {
        path: '/home/power',
        name: 'power',
        component: () => import('@/view/power'),
        hidden: true,
      }
      // {
      //    path: '6-1',
      //    name: '6-1',
      //    component: () => import('@/views/configuration'),
      // },
      // {
      //    path: '6-2',
      //    name: '6-2',
      //    component: () => import('@/views/404'),
      // }
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
