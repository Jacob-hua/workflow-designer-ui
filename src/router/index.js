import Vue from "vue";
import VueRouter from "vue-router";
import layout from "@/layout/index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "login",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/view/login/login"),
    hidden: true,
  },
  {
    path: "/home",
    name: "index",
    component: layout,
    // redirect: "/home/Workflow",
    children: [
      {
        path: "/home/Workflow",
        // name: "bpmn",
        name: "Workflow",
        component: () => import("@/view/workflow/index"),
        meta: {
          title: "bpmn",
          icon: "dashboard",
        },
      },
      {
        path: "/home/Form",
        // name: "form",
        name: "Form",
        component: () => import("@/view/form/index"),
        meta: {
          title: "bpmn",
          icon: "dashboard",
        },
      },
      {
        path: "/home/Home",
        // name: "home",
        name: "Home",
        component: () => import("@/view/home/index"),
        meta: {
          title: "bpmn",
          icon: "dashboard",
        },
      },
      {
        path: "/home/History",
        // name: "history",
        name: "History",
        component: () => import("@/view/historyWorkflow/HistoryWorkflow"),
        meta: {
          title: "history",
          icon: "dashboard",
        },
      },
      {
        path: "/home/RunTime",
        // name: "runTime",
        name: "RunTime",
        component: () => import("@/view/runtime/index"),
        hidden: true,
      },
      {
        path: "/home/noPermission",
        name: "noPermission",
        component: () => import("@/component/permission/index"),
        hidden: true,
      },
      {
        path: "/home/Configuration",
        // name: "all",
        name: "Configuration",
        component: () => import("@/view/configuration"),
        hidden: true,
      },
      {
        path: "/home/Power",
        // name: "power",
        name: "Power",
        component: () => import("@/view/power"),
        hidden: true,
      },
      {
        path: "/home/debugBpmn",
        name: "debugBpmn",
        component: () => import("@/view/debugBpmn"),
        meta: {
          title: "bpmn",
          icon: "dashboard",
        },
      },
      {
        path: "/home/designer",
        name: "designer",
        component: () => import("@/plugin/FormDesign/component/formDesigner"),
      },
    ],
  },
];

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const router = new VueRouter({
  routes,
});

// router.beforeEach((to, from, next) => {
//   try {
//     if (to.name === "login") {
//       next();
//       return;
//     }

//     if (to.name === "noPermission") {
//       next();
//       return;
//     }

//     let routerMapping = {
//       bpmn: "Workflow",
//       form: "Form",
//       home: "Home",
//       runTime: "RunTime",
//       history: "History",
//       all: "Configuration",
//       power: "Power",
//     };
//     let routerName = to.name;

//     let { permissions } = JSON.parse(sessionStorage.getItem("loginData"));

//     let proJectRole =
//       permissions.filter((item) => {
//         // TODO: 此处应该判断项目角色
//         // return item.projectCode === this.business
//         return item.projectCode === "XM_aff0659724a54c119ac857d4e560b47b";
//       })[0]?.permissionSet || [];
//     let findEle = proJectRole.findIndex((item) => {
//       return item.frontRoute === routerMapping[routerName];
//     });
//     if (findEle === -1) {
//       // TODO: 在没有权限的时候应该抛出响应的无权限提示
//       // next('/home/noPermission')
//       next();
//     } else {
//       next();
//     }
//   } catch (error) {
//     next("/login");
//   }
// });

export default router;
