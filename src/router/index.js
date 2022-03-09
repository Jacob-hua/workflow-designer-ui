import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from'@/views/layout/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: layout,
    redirect: '/bpmn',
    children: [
      {
        path: 'bpmn',
        name: 'bpmn',
        component: () => import('@/views/bpmnJsELe/index'),
        meta: { title: 'bpmn', icon: 'dashboard' }
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
