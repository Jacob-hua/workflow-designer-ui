import { isAttr, jsonClone } from "../utils";
import childrenItem from "./slot/index";

function dataURLBlob(base64Str) {
  let bstr = base64Str,
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return u8arr;
}
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
        self.attachmentList[0].attachmentList.forEach(
          ({ pictureData }, index) => {
            self.conf.value[index].url = `data:image/png;base64,${pictureData}`;
          }
        );
      }
      dataObject.attrs["file-list"] = self.conf.value;
    }
    dataObject.attrs["auto-upload"] = false; // 文件手动上传
    dataObject.attrs["on-preview"] = async (file) => {
      if (self.conf.value[0].type.includes("image")) {
        const imgUrl = file.url;
        const a = document.createElement("a");
        a.href = imgUrl;
        a.setAttribute("download", file.name);
        a.click();
      } else {
        if (self.downloadFun) {
          const result = await Promise.resolve(self.downloadFun(file));
          if (!result) {
            return;
          }
          downloadFile(file.name, file.type, result);
        }
      }
    };
    dataObject.attrs["on-remove"] = async (file, fileList) => {
      console.log(file, fileList);
      self.value.splice(
        self.value.findIndex((item) => item.uid === file.uid),
        1
      );
    };

    dataObject.attrs["on-change"] = async (file, fileList) => {
      console.log(file, fileList);
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
    "attachmentList",
  ],
};
