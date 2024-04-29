<template>
  <div>
    <el-dialog :title="title" :visible="visible" @close="onCloseModal" :close-on-click-modal="false" :close-on-press-escape="false">
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
import { getStartProcess, getSelectStartForm } from '@/api/unit/api.js'
import { uploadFile, downloadFile } from '@/api/globalConfig.js'
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
      attachmentIds: [],
      context: null,
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
        const { errorInfo } = await getStartProcess({
          businessKey: '',
          definitionKey: this.process.key,
          createBy: this.userInfo.account,
          startProcessId: this.process.id,
          variables: { ...formData },
          attachmentIds: this.attachmentIds,
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
        this.context = result.context
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
