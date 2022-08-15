import { isAttr, jsonClone } from "../utils";
import childrenItem from "./slot/index";

function downloadFile(fileName, fileType, content, charset = "utf-8") {
  if (!document || !document instanceof Document) {
    throw new Error("This is not a browser environment");
  }
  const blob = new Blob([content], {
    type: `${fileType};charset=${charset}`,
  });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = `${fileName}`;
  link.click();
  window.URL.revokeObjectURL(link.href);
}

async function vModel(self, dataObject) {
  dataObject.props.value = self.value;
  dataObject.on.input = (val) => {
    self.$emit("input", val);
  };
  //判断是否为上传组件
  if (self.conf.compType === "upload") {
    if (self.value.length) {
      if (self.conf.value[0].type.includes("image")) {
        const result = await Promise.resolve(
          self.downloadFun({ url: self.value[0].url })
        );
        const blob = new Blob([result], {
          type: `${self.value[0].type};charset=utf-8`,
        });
        const fileReader = new FileReader();
        fileReader.readAsDataURL(blob);
        self.conf.value[0].url = fileReader.result;
      }
      dataObject.attrs["file-list"] = self.conf.value;
    }
    dataObject.attrs["auto-upload"] = false; // 文件手动上传
    dataObject.attrs["on-preview"] = async (file) => {
      if (self.downloadFun) {
        const result = await Promise.resolve(self.downloadFun(file));
        if (!result) {
          return;
        }
        console.log(result);
        downloadFile(file.name, file.type, result);
      }
    };
    dataObject.attrs["on-remove"] = async (file, fileList) => {
      self.conf.value.splice(
        self.conf.value.findIndex((item) => item.uid === file.uid),
        1
      );
    };
    dataObject.attrs["on-change"] = async (file, fileList) => {
      // 文件变换 钩子
      self.conf["fileList"] = fileList;
      if (self.uploadFun) {
        const result = await Promise.resolve(self.uploadFun(file));
        self.value.push({
          name: file.name,
          url: result,
          type: file.raw.type,
        });
      }
      self.$emit("input", fileList);
    };
    dataObject.attrs["before-upload"] = (file) => {
      //非限定后缀不允许上传

      const fileName = file.name;
      const suffixName = fileName.split(".").pop();

      if (!self.conf.accept.includes(suffixName)) {
        self.$message.error("该后缀文件不允许上传");
        return false;
      }
      const fileSize = file.size;
      if (fileSize > dataObject.props.fileSize * 1024 * 1024) {
        self.$message.error("文件大小超出限制，请检查！");
        return false;
      }
    };
  }
}

export default {
  // inject: ['quoteOption'],
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
  ],
};
