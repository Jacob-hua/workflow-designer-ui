<template>
  <el-form-item
    :label="fieldInfo.showLabel ? fieldInfo.label : ''"
    :label-width="fieldInfo.labelWidth"
    :prop="fieldInfo.id"
    :rules="rules"
  >
    <el-upload
      v-if="isShowTextUpload"
      class="upload-demo"
      action="#"
      :auto-upload="false"
      :show-file-list="false"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :on-change="fileChange"
      :multiple="fieldInfo.multiple"
      :limit="20"
      :on-exceed="handleExceed"
      :file-list="this.value"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <el-upload
      v-else
      action="#"
      list-type="picture-card"
      :file-list="this.value"
      :on-change="imgChange"
      :multiple="fieldInfo.multiple"
      :auto-upload="false"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="previewImage(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <ul v-if="isShowTextUpload">
      <li @mousemove="fileMove(file)" v-for="(file, key) in value" :key="key">
        <span> {{ file.name }}</span>
        <p>
          <span
            @click="handlePreview(file)"
            v-show="isTypeAnImage(file.name.split('.')[1])"
            class="preview el-icon-zoom-in"
          ></span>
          <span @click="download(file)" class="preview el-icon-download"></span>
          <span
            v-show="flag"
            @click="delFile(file)"
            class="preview el-icon-delete"
          >
          </span>
        </p>
      </li>
    </ul>
  </el-form-item>
</template>

<script>
export default {
  name: "upload",
  props: {
    fieldInfo: {
      type: Object,
      default: {},
    },
    rules: {
      type: Array,
      default: [],
    },
    uploadFun: {
      type: Function,
      default: () => {},
    },
    downloadFun: {
      type: Function,
      default: () => {},
    },
    value: {
      type: Array,
      default: [],
    },
    flag: {
      type: Boolean,
    },
  },
  data() {
    return {
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: "",
      listType: "text",
    };
  },
  computed: {
    isShowTextUpload() {
      return this.fieldInfo["list-type"] === this.listType;
    },
  },
  mounted() {
    if (!this.flag) {
      this.displayNoneDom();
      this.mappingProcess();
    }
  },
  methods: {
    displayNoneDom() {
      let uploadCollection = Array.from(
        document.getElementsByClassName("el-upload--picture-card")
      );
      uploadCollection.forEach((upload) => {
        upload.style.display = "none";
      });
    },
    mappingProcess() {
      this.value.forEach(async (file) => {
        const result = await Promise.resolve(
          this.downloadFun({ url: file.blobMappingUrl[file.url] })
        );
        if (!result) {
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onload = () => {
          file.url = reader.result;
        };
      });
    },
    fileMove(file) {},
    delFile(file) {
      this.value.splice(
        this.value.findIndex(({ uid }) => uid === file.uid),
        1
      );
    },
    async download(file) {
      const [, ext] = file.name.split(".");
      const result = await Promise.resolve(this.downloadFun(file));
      if (!result) {
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(result);
      reader.onload = () => {
        this.handleDownload({ name: file.name, url: reader.result });
      };
    },
    handleDownload(file) {
      const imgUrl = file.url;
      const a = document.createElement("a");
      a.href = imgUrl;
      a.setAttribute("download", file.name);
      a.click();
    },
    async previewImage(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
    },
    downloadFile(fileName, fileType, content, charset = "utf-8") {
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
    },
    checkFileFormat(file) {
      const fileName = file.name;
      const suffixName = fileName.split(".").pop();
      if (!this.fieldInfo.accept.includes(suffixName)) {
        this.delFile(file);
        this.$message.error("该后缀文件不允许上传");
        return false;
      }
      const fileSize = file.size;
      if (fileSize > this.fieldInfo.fileSize * 1024 * 1024) {
        this.delFile(file);
        this.$message.error("文件大小超出限制，请检查！");
        return false;
      }
      return true;
    },
    async imgChange(file) {
      if (!this.checkFileFormat(file)) {
        return false;
      }
      const blobMappingUrl = {};
      blobMappingUrl[file.url] = await Promise.resolve(this.uploadFun(file));
      file["blobMappingUrl"] = blobMappingUrl;
      this.value.push(file);
      this.$emit("input", this.value);
    },
    async fileChange(file) {
      if (!this.checkFileFormat(file)) {
        return false;
      }
      file.url = await Promise.resolve(this.uploadFun(file));
      this.value.push(file);
      this.$emit("input", this.value);
    },
    async beforeUpload(file) {},
    handleRemove(file, fileList) {},
    isTypeAnImage(ext) {
      return (
        ["png", "jpg", "jpeg", "gif", "webp", "psd", "tiff"].indexOf(
          ext.toLowerCase()
        ) !== -1
      );
    },
    blobToBase64(blob) {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = (e) => {
        this.dialogVisible = true;
        this.dialogImageUrl = e.target.result;
      };
    },
    async handlePreview(file) {
      try {
        const [, ext] = file.name.split(".");
        const result = await Promise.resolve(this.downloadFun(file));
        if (!result) {
          return;
        }
        if (!this.isTypeAnImage(ext)) {
          this.downloadFile(file.name, file.type, result);
        } else {
          this.blobToBase64(result);
        }
      } catch (e) {
        throw new Error(e.toString());
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 20 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
  },
};
</script>

<style scoped lang="scss">
ul {
  li {
    height: 40px;
    list-style: none;
    align-items: center;
    display: flex;
    justify-content: space-between;
    span {
      color: #ffffff;
    }
    &:hover {
      background-color: skyblue;
    }
    .preview {
      cursor: pointer;
      font-size: 20px;
      margin-right: 10px;
    }
  }
}
</style>
