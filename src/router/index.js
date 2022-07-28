import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from '@/layout/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '/',
    redirect: 'login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/view/login/login'),
    hidden: true,
  },
  {
    path: '/home',
    name: 'index',
    component: layout,
    children: [
      {
        path: '/home/Workflow',
        name: 'Workflow',
        component: () => import('@/view/workflow/index'),
      },
      {
        path: '/home/Form',
        name: 'Form',
        component: () => import('@/view/form/index'),
      },
      {
        path: '/home/Home',
        name: 'Home',
        component: () => import('@/view/home/index'),
      },
      {
        path: '/home/History',
        name: 'History',
        component: () => import('@/view/historyWorkflow/HistoryWorkflow'),
      },
      {
        path: '/home/RunTime',
        name: 'RunTime',
        component: () => import('@/view/runtime/index'),
        hidden: true,
      },
      {
        path: '/home/noPermission',
        name: 'noPermission',
        component: () => import('@/component/permission/index'),
        hidden: true,
      },
      {
        path: '/home/Configuration',
        name: 'Configuration',
        component: () => import('@/view/configuration'),
        hidden: true,
      },
      {
        path: '/home/Power',
        name: 'Power',
        component: () => import('@/view/power'),
        hidden: true,
      },
    ],
  },
  {
    path: '/workflow-viewer/:processInstanceId',
    name: 'WorkflowViewer',
    component: () => import('@/view/workflowViewer'),
    hidden: true,
  },
]

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

const router = new VueRouter({
  routes,
})

router.beforeEach((to, from, next) => {
  try {
    if (to.name === 'login') {
      next()
      return
    }

    if (to.name === 'noPermission') {
      next()
      return
    }

    if (to.name === 'WorkflowViewer') {
      next()
      return
    }
    let routerName = to.name

    let { menuProjectList } = JSON.parse(sessionStorage.getItem('loginData'))

    if (!menuProjectList) {
      next('/home/noPermission')
      return
    }

    let menuList = menuProjectList.filter((item) => {
      return item.projectList.length > 0
    })

    let findEle = menuList.findIndex((item) => {
      return item.menuRoute === routerName
    })
    if (findEle === -1) {
      // TODO: 在没有权限的时候应该抛出响应的无权限提示
      // next('/home/noPermission')
      next('/home/noPermission')
    } else {
      next()
    }
  } catch (error) {
    next('/login')
  }
})

export default router
