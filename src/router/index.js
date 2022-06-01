import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from '@/views/layout/index.vue'

Vue.use(VueRouter)

const routes = [{
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
    children: [{
        path: '/home/bpmn',
        name: 'bpmn',
        component: () => import('@/views/workflow/index'),
        meta: {
          title: 'bpmn',
          icon: 'dashboard'
        }
      },
      {
        path: '/home/form',
        name: 'form',
        component: () => import('@/views/form/index'),
        meta: {
          title: 'bpmn',
          icon: 'dashboard'
        }
      },
      {
        path: '/home/home',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: {
          title: 'bpmn',
          icon: 'dashboard'
        }
      },
      {
        path: '/home/history',
        name: 'history',
        component: () => import('@/views/historyWorkflow/HistoryWorkflow'),
        meta: {
          title: 'history',
          icon: 'dashboard'
        }
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
        path: '/home/noPermission',
        name: 'noPermission',
        component: () => import('@/components/permission/index'),
        hidden: true
      },
      {
        path: '/home/all',
        name: 'all',
        component: () => import('@/views/configuration'),
        hidden: true,
      },
      {
        path: '/home/power',
        name: 'power',
        component: () => import('@/views/power'),
        hidden: true,
      }
    ]
  },
]


const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  
  if(to.name === 'login') {
    next()
    return
  }
  
  if(to.name === 'noPermission') {
    next()
    return
  }
  
  let routerMapping = {
    'bpmn': 'Workflow',
    'form': 'Form',
    'home': 'Home',
    'runTime': 'RunTime',
    'history': 'History',
    'all': 'Configuration',
    'power': 'Power'
  }
  let routerName = to.name
  let {
    permissions
  } = JSON.parse(sessionStorage.getItem('loginData'))
  
  let proJectRole = permissions.filter((item) => {
    // return item.projectCode === this.business
    return item.projectCode === 'XM_aff0659724a54c119ac857d4e560b47b'
  })[0].permissionSet
  let findEle = proJectRole.findIndex((item) => {
    return item.frontRoute === routerMapping[routerName]
  })
  if (findEle === -1) {
    console.log('无权限')
    next('/home/noPermission')
    // next()
  } else {
    console.log('有权限')
    next()
  }
})

export default router
