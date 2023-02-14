<template>
  <el-form-item :label-width="fieldInfo.labelWidth + 'px'" :prop="fieldInfo.valuePath" :rules="rules">
    <template slot="label">
      <el-tooltip
        class="item"
        effect="light"
        :content="fieldInfo.showLabel ? fieldInfo.label : ''"
        placement="top-start"
      >
        <span>{{ fieldInfo.showLabel ? fieldInfo.label : '' }}</span>
      </el-tooltip>
    </template>
    <el-upload
      v-if="isShowTextUpload"
      class="upload-demo"
      action="#"
      :auto-upload="false"
      :show-file-list="false"
      :on-preview="handlePreview"
      :on-change="fileChange"
      :multiple="fieldInfo.multiple"
      :limit="30"
      :on-exceed="handleExceed"
      :file-list="value"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <el-upload
      v-else
      action="#"
      list-type="picture-card"
      :file-list="displayList"
      :on-change="imgChange"
      :multiple="fieldInfo.multiple"
      :auto-upload="false"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="previewImage(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleDownload(file)">
            <i class="el-icon-download"></i>
          </span>
          <span v-show="!readOnly" class="el-upload-list__item-delete" @click="delFile(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <ul v-if="isShowTextUpload">
      <li v-for="(file, key) in value" :key="key">
        <long-text contentStyle="width: 200px;color: #fff" :content="file.name" />
        <p>
          <span @click="handlePreview(file)" v-show="isTypeAnImage(file)" class="preview el-icon-zoom-in"></span>
          <span @click="download(file)" class="preview el-icon-download"></span>
          <span v-show="!readOnly" @click="delFile(file)" class="preview el-icon-delete"> </span>
        </p>
      </li>
    </ul>
  </el-form-item>
</template>

<script>
import _ from 'lodash'
import LongText from '@/component/LongText'
export default {
  name: 'upload',
  components: {
    LongText,
  },
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
    readOnly: {
      type: Boolean,
    },
  },
  data() {
    return {
      displayList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      listType: 'text',
    }
  },
  computed: {
    isShowTextUpload() {
      return this.fieldInfo['list-type'] === this.listType
    },
  },
  mounted() {
    if (this.readOnly) {
      this.displayNoneDom()
      this.mappingProcess()
    } else {
      this.value.forEach(async (file) => {
        if (this.isTypeAnImage(file)) {
          const result = await Promise.resolve(this.downloadFun(file))
          if (!result) {
            return
          }
          const file2 = _.cloneDeep(file)
          const reader = new FileReader()
          reader.readAsDataURL(result)
          reader.onload = () => {
            file2.url = reader.result
          }
          this.displayList.push(file2)
        }
      })
    }
  },
  methods: {
    displayNoneDom() {
      Array.from(document.getElementsByClassName('el-upload--picture-card')).forEach((upload) => {
        upload.style.display = 'none'
      })
    },
    mappingProcess() {
      this.value.forEach(async (file) => {
        const result = await Promise.resolve(this.downloadFun(file))
        if (!result) {
          return
        }
        const reader = new FileReader()
        reader.readAsDataURL(result)
        reader.onload = () => {
          file.url = reader.result
        }
      })
      this.displayList = this.value
    },
    delFile(file) {
      this.value.splice(
        this.value.findIndex(({ uid }) => uid === file.uid),
        1
      )
      this.displayList.splice(
        this.displayList.findIndex(({ uid }) => uid === file.uid),
        1
      )
    },
    isBase64(file) {
      return file.url.indexOf('data:') !== -1 && file.url.indexOf('base64') !== -1
    },
    async download(file) {
      if (this.isBase64(file)) {
        this.newDownload(file)
      } else {
        const result = await Promise.resolve(this.downloadFun(file))
        if (!result) {
          return
        }
        const reader = new FileReader()
        reader.readAsDataURL(result)
        reader.onload = () => {
          this.handleDownload({ name: file.name, url: reader.result })
        }
      }
    },
    newDownload(file) {
      const a = document.createElement('a')
      a.href = file.url
      a.setAttribute('download', file.name)
      a.click()
    },
    handleDownload(file) {
      this.newDownload(file)
    },
    async previewImage(file) {
      this.dialogVisible = true
      this.dialogImageUrl = file.url
    },
    fileListDel(fileList, file) {
      fileList.splice(
        fileList.findIndex(({ uid }) => uid === file.uid),
        1
      )
    },
    checkFileFormat(file, fileList) {
      const fileName = file.name
      const suffixName = fileName.split('.').pop()
      if (!this.fieldInfo.accept.includes(suffixName)) {
        this.fileListDel(fileList, file)
        this.$message.error(`该后缀文件不允许上传, 正确格式为${this.fieldInfo.accept}`)
        return false
      }
      const fileSize = file.size
      if (fileSize > this.fieldInfo.fileSize * 1024 * 1024) {
        this.fileListDel(fileList, file)
        this.$message.error(`
        文件大小超出限制，请检查！最大上传大小为
          ${this.fieldInfo.fileSize}MB
        `)
        return false
      }
      return true
    },
    async imgChange(file, fileList) {
      if (!this.checkFileFormat(file, fileList)) {
        return false
      }
      const attachmentId = await Promise.resolve(this.uploadFun(file))
      const result = await Promise.resolve(this.downloadFun({ url: attachmentId }))
      file.url = attachmentId
      this.value.push(file)

      this.$emit('input', this.value)
      const reader = new FileReader()
      const file2 = _.cloneDeep(file)
      reader.readAsDataURL(result)
      reader.onload = (e) => {
        file2.url = e.target.result
      }
      this.displayList.push(file2)
    },
    async fileChange(file, fileList) {
      if (!this.checkFileFormat(file, fileList)) {
        return false
      }
      file.url = await Promise.resolve(this.uploadFun(file))
      this.value.push(file)
      this.$emit('input', this.value)
    },
    isTypeAnImage(file) {
      let patternFileExtension = /\.([0-9a-z]+)(?:[\?#]|$)/i
      let ext = file.name.match(patternFileExtension)[1]
      return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'psd', 'tiff'].indexOf(ext.toLowerCase()) !== -1
    },
    blobToBase64(blob) {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = (e) => {
        this.dialogVisible = true
        this.dialogImageUrl = e.target.result
      }
    },
    async handlePreview(file) {
      if (this.isTypeAnImage(file)) {
        if (this.isBase64(file)) {
          this.dialogVisible = true
          this.dialogImageUrl = file.url
        } else {
          this.blobToBase64(await Promise.resolve(this.downloadFun(file)))
        }
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 30 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
  },
}
</script>

<style scoped lang="scss">
/deep/ {
  .el-form-item__content {
    margin-left: 60px !important;
  }
}
/deep/ .el-form-item__label {
  width: 100px !important;
  overflow: hidden;

  white-space: nowrap;

  text-overflow: ellipsis;

  -o-text-overflow: ellipsis;
}
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
