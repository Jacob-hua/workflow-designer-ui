import Vue from "vue";
import store from "../store";

Vue.directive("role", {
  bind: function (el, binding, vnode) {
    const type = binding.value.type;
    const id = binding.value.id;
    const { permissions } = JSON.parse(sessionStorage.getItem("loginData"));
    if (!permissions) {
      return;
    }
    const proJectRole = permissions.find(
      (item) => item.projectCode === store.account.state.currentOrganization
    )?.permissionSet;
    console.log(proJectRole);
    if (!proJectRole) {
      return;
    }

    switch (type) {
      case "contain":
        break;
      case "button":
        const findEle = proJectRole.findIndex((item) => {
          return item.frontRoute === id;
        });
        if (findEle === -1) {
          el.style.display = "none";
        }
        break;
      case "menu":
        break;
      default:
        break;
    }
  },
});
