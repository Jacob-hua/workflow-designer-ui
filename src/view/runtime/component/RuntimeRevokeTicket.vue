<template>
  <div>
    <el-dialog :title="title" :visible="visible" @close="onCancel" :close-on-click-modal="false" :append-to-body="true">
      <el-skeleton v-if="isLoading" />
      <div v-else>
        <div class="form-preview">
          <preview
            :itemList="formContent.list"
            :formConf="formContent.config"
            :context="context"
            :uploadFun="uploadFileFun.bind(this)"
            :downloadFun="downloadFileFun.bind(this)"
            :beforeDeleteFileFun="beforeDeleteFileFun.bind(this)"
            ref="preview"
          ></preview>
        </div>
      </div>
      <span slot="footer">
        <el-button class="submit-button" :loading="isSubmitting" @click="onSubmit">立即创建</el-button>
        <el-button class="cancel-button" @click="onCancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getStartProcess, putRevokeTask } from '@/api/unit/api.js'
import { uploadFile, downloadFile } from '@/api/globalConfig.js'
import preview from '@/plugin/FormDesign/component/preview'

export default {
  name: 'RuntimeRevokeTicket',
  components: {
    preview,
  },
  props: {
    title: {
      type: String,
      default: '配置项',
    },
    visible: {
      type: Boolean,
      default: true,
    },
    formContent: {
      type: Object,
      default: () => {}
    },
    context: {
      type: Object,
      default: () => {}
    },
    processInstanceId: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      isSubmitting: false,
      isLoading: false,
      options: {},
      attachmentIds: [],
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
    isEmptyConfig() {
      return !Object.prototype.hasOwnProperty.call(this.formContent, 'fields')
    },
  },
  methods: {
    onCloseModal() {
      this.startConfigList = [];
      this.formContent = {};
      this.$emit('close')
    },
    async uploadFileFun({ name, raw: file }) {
      const uploadParameters = new FormData()
      uploadParameters.append('file', file)
      uploadParameters.append('fileName', name)
      const { errorInfo, result } = await uploadFile(uploadParameters)
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg)
        return
      }
      this.attachmentIds.push(result)
      return result
    },
    async downloadFileFun({ url }) {
      return await downloadFile({
        contentId: url,
      })
    },
    beforeDeleteFileFun({ attachmentId }) {
      try {
        Array.prototype.splice.call(
          this.attachmentIds,
          this.attachmentIds.findIndex((value) => value === attachmentId)
        )
        return true
      } catch (error) {
        return false
      }
    },
    async onSubmit() {
      try {
        this.isSubmitting = true
        let formData = [];
        let startFormData = JSON.stringify({list:[],data:{}});
        if(Object.keys(this.formContent).length>0){
          const preview = await this.$refs.preview.submit();
          formData = preview.formData;
          startFormData = JSON.stringify({ ...this.formContent, data: { ...formData } })
        }
        const { errorInfo } = await putRevokeTask({
          redo: true,
          userId: this.userInfo.account,
          processInstanceId: this.processInstanceId,
          variables: { ...formData },
          startFormData: startFormData,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          this.$emit('submit', false)
          return
        }
        this.$message({
          type: 'success',
          message: '创建成功',
        })
        this.$emit('submit', true)
        this.onCloseModal()
      } catch (error) {
        this.$emit('submit', false)
      } finally {
        this.isSubmitting = false
      }
    },
    onCancel() {
      this.$emit('update:visible', false)
      this.$emit('close')
    },
  },
}
</script>

<style scoped lang="scss">
/deep/ .el-dialog {
  @include formDialog;
  width: 50vw;
  max-height: 70vh;

  .el-dialog__body {
    height: 100%;
    overflow: auto;
  }
}

.dialog-message {
  margin: 20px 20px;
  font-size: 14px;
  color: $font-color;
}

.submit-button {
  @include primaryBtn;
}

.cancel-button {
  @include cancelBtn;
}
</style>
