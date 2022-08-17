import Vue from 'vue'
import store from '../store'

Vue.directive('role', {
  bind: function (el, binding, vnode) {
    let type = binding.value.type
    let id = binding.value.id
    let { permissions } = JSON.parse(sessionStorage.getItem('loginData'))
    let proJectRole = permissions.filter((item) => item.projectCode === store.account.state.currentOrganization)[0]
      .permissionSet
    switch (type) {
      case 'contain':
        break
      case 'button':
        let findEle = proJectRole.findIndex((item) => {
          return item.frontRoute === id
        })
        if (findEle === -1) {
          el.style.display = 'none'
        }
        break
      case 'menu':
        break
      default:
        break
    }
  },
})
