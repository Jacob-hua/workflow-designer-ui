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
        path: '/bpmn',
        name: 'bpmn',
        component: () => import('@/views/bpmnJsELe/index'),
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
        path: '3',
        name: '3',
        component: () => import('@/views/404'),
        hidden: true
      },
      {
        path: '4',
        name: '4',
        component: () => import('@/views/404'),
        hidden: true
      },
      {
        path: '5',
        name: '5',
        component: () => import('@/views/404'),
        hidden: true
      },
      {
        path: '6',
        name: '6',
        component: () => import('@/views/404'),
        hidden: true
      },
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
