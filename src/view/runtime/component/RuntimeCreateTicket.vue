<template>
  <div>
    <el-dialog :title="title" :visible="visible" top="5vh" @close="onCloseModal" :close-on-click-modal="false">
      <el-skeleton v-if="isLoading" />
      <div v-else>
        <div class="form-preview">
          <preview
            :itemList="formContent.list"
            :formConf="formContent.config"
            :uploadFun="uploadFile.bind(this)"
            :downloadFun="downloadFile.bind(this)"
            v-if="formShow"
            ref="preview"
          ></preview>
        </div>
        <div v-if="!formShow" class="dialog-message">创建的操作会进入操作列表并开始操作流程,是否继续？</div>
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
import { getStartProcess, downloadTaskAttachmentFile, getSelectStartForm } from '@/api/unit/api.js'
import { uploadFile } from '@/api/globalConfig.js'
import preview from '@/plugin/FormDesign/component/preview'

export default {
  name: 'RuntimeCreateTicket',
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
    process: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      formContent: {},
      formShow: false,
      isSubmitting: false,
      isLoading: false,
      options: {},
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
    isEmptyConfig() {
      return !Object.prototype.hasOwnProperty.call(this.formContent, 'fields')
    },
  },
  watch: {
    process: {
      immediate: true,
      async handler(process) {
        if (!process.business) {
          return
        }
        this.isLoading = true
        this.fetchStartFrom()
        this.isLoading = false
      },
    },
  },
  methods: {
    onCloseModal() {
      this.startConfigList = []
      this.formContent = {}
      this.formShow = false
      this.$emit('close')
    },
    async uploadFile({ name, raw: file }) {
      const uploadParameters = new FormData()
      uploadParameters.append('file', file)
      uploadParameters.append('fileName', name)
      const { errorInfo, result } = await uploadFile(uploadParameters)
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg)
        return
      }
      return result
    },
    async downloadFile({ url }) {
      // TODO: 缺少文件下载接口
      return await downloadTaskAttachmentFile({
        attachmentId: url,
      })
    },
    async onSubmit() {
      try {
        this.isSubmitting = true
        const { formData } = await this.$refs.preview.submit()
        const { errorInfo } = await getStartProcess({
          businessKey: '',
          definitionKey: this.process.key,
          createBy: this.userInfo.account,
          startProcessId: this.process.id,
          variables: { ...formData },
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
      this.onCloseModal()
    },
    async fetchStartFrom() {
      try {
        const { errorInfo, result } = await getSelectStartForm({
          noDraftDeployId: this.process.id,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }
        if (!result || !result.content) {
          this.formContent = {}
          this.formShow = false
          return
        }
        this.formContent = JSON.parse(result.content ?? '{}')
        this.formShow = true
      } catch (error) {
        this.fromContent = {}
        this.formShow = false
      }
    },
  },
}
</script>

<style scoped lang="scss">
/deep/ .el-dialog {
  @include formDialog;
  width: 600px;
  height: auto;
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
