import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from'@/views/layout/index.vue'

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
  	component: () => import('@/views/login/login'),
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
        component: () => import('@/views/workflow/index'),
        meta: { title: 'bpmn', icon: 'dashboard' }
      },
      {
        path: '/home/form',
        name: 'form',
        component: () => import('@/views/form/index'),
        meta: { title: 'bpmn', icon: 'dashboard' }
      },
      {
        path: '/home/home',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: { title: 'bpmn', icon: 'dashboard' }
      },
      {
        path: '/home/history',
        name: 'history',
        component: () => import('@/views/historyWorkflow/HistoryWorkflow'),
        meta: { title: 'history', icon: 'dashboard' }
      },
      {
        path: '/home/runTime',
        name: 'runTime',
        component: () => import('@/views/runtime/index'),
        hidden: true
      },
      {
        path: '5',
        name: '5',
        component: () => import('@/views/404'),
        hidden: true
      },
      {
        path: '/home/all',
        name: '/home/all',
        component: () => import('@/views/configuration'),
        hidden: true,
      },
      {
        path: '/home/power',
        name: '/home/power',
        component: () => import('@/views/power'),
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
