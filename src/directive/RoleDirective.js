import Vue from 'vue'

Vue.directive('role', {
  bind: function(el, binding, vnode ) {
    let type = binding.value.type
    let id = binding.value.id
    let { permissions } = JSON.parse(sessionStorage.getItem('loginData'))
    let proJectRole = permissions.filter((item) => {
      // return item.projectCode === binding.value.business
      return item.projectCode === 'XM_aff0659724a54c119ac857d4e560b47b'
    })[0].permissionSet
    switch (type){
      case 'contain':
        break;
      case 'button':
        let findEle = proJectRole.findIndex((item) => {
          return item.frontRoute === id
        })
        if (findEle === -1) {
          el.style.display = 'none'
        }
        break;
      case 'menu':
        break;
      default:
        break;
    }
  }
})