import { vuexNamespace } from "../../config";
import { deepCopy } from "../../utils/object";

const requireModule = require.context(".", false, /\.js$/);
const modules = requireModule.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  if (moduleName === "index") {
    return modules;
  }
  modules[moduleName] = requireModule(modulePath).default;
  return modules;
}, {});

// 用于记录bpmn模块的初始状态
const initialModuleState = {};

// 所有bpmn模块都有的mutation方法
const commonMutations = {
  refreshState() {
    return function (state, payload = {}) {
      Object.keys(payload).forEach((key) => {
        state[key] = payload[key];
      });
    };
  },
  initState(moduleName) {
    return function () {
      this.commit(`${vuexNamespace}/${moduleName}/refreshState`, initialModuleState[moduleName]);
    };
  },
};

// 遍历所有模块，执行初始状态记录和公共mutation添加
Object.keys(modules).forEach((moduleName) => {
  const module = modules[moduleName];
  initialModuleState[moduleName] = deepCopy(module.state ?? {});
  if (!module["mutations"]) {
    module["mutations"] = {};
  }
  Object.keys(commonMutations)
    .filter((mutationKey) => !module.mutations.hasOwnProperty(mutationKey))
    .forEach((mutationKey) => {
      module.mutations[mutationKey] = commonMutations[mutationKey](moduleName);
    });
});

export default modules;
