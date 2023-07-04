import { isAttr, jsonClone } from "../utils";
import childrenItem from "./slot/index";

async function vModel(self, dataObject) {
  dataObject.props.value = self.value;
  dataObject.on.input = (val) => {
    self.$emit("input", val);
  };
}

export default {
  render(h) {
    let dataObject = {
      attrs: {},
      props: {},
      on: {},
      style: {},
    };
    const confClone = jsonClone(this.conf);

    const children = childrenItem(h, confClone);
    Object.keys(confClone).forEach((key) => {
      const val = confClone[key];
      if (dataObject[key]) {
        dataObject[key] = val;
      } else if (key === "width") {
        dataObject.style = "width:" + val;
      } else if (!isAttr(key)) {
        dataObject.props[key] = val;
      } else {
        if (key !== "value") {
          dataObject.attrs[key] = val;
        }
      }
    });
    dataObject.props['checkStockFun'] = this.checkStockFun
    dataObject.props['cancleStockFun'] = this.cancleStockFun
    dataObject.props['checkStockAndUseFun'] = this.checkStockAndUseFun
    dataObject.props['formConf'] = this.formConf
    dataObject.props['downloadFun'] = this.downloadFun
    /*调整赋值模式，规避cascader组件赋值props会出现覆盖预制参数的bug */
    vModel(this, dataObject);
    return h(confClone.ele, dataObject, children);
  },
  props: [
    "conf",
    "value",
    "quoteOption",
    "getFileList",
    "uploadFun",
    "downloadFun",
    "checkStockFun",
    "cancleStockFun",
    "checkStockAndUseFun",
    "formConf"
  ],
};
