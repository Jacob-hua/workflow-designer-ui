import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from'@/views/layout/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'first',
    component: layout,
    redirect: 'bpmn',
    children: [
      {
        path: 'bpmn',
        name: 'bpmn',
        component: () => import('@/views/workflow/index'),
        meta: { title: 'bpmn', icon: 'dashboard' }
      },
      {
        path: 'form',
        name: 'form',
        component: () => import('@/views/form/index'),
        meta: { title: 'bpmn', icon: 'dashboard' }
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: { title: 'bpmn', icon: 'dashboard' }
      },
      {
        path: 'history',
        name: 'history',
        component: () => import('@/views/historyWorkflow/HistoryWorkflow'),
        meta: { title: 'history', icon: 'dashboard' }
      },
      {
        path: 'runTime',
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
        path: 'all',
        name: 'all',
        component: () => import('@/views/configuration'),
        hidden: true,
      },
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
