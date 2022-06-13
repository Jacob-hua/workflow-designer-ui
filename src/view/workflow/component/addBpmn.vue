<template>
  <el-dialog title="新建流程"
             :visible="dialogVisible"
             width="90%"
             custom-class="dialogVisible"
             @close="onClose">
    <div class="dialogVisible-main">
      <bpmnJsELe :xmlString="xmlString"
                 :name="formData.name"
                 v-if="dialogVisible"></bpmnJsELe>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="onPublish">发布</el-button>
      <el-button @click="onSave">保存</el-button>
      <el-button @click="onCancel">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  workFlowSaveDraft,
  workFlowSave,
  publishWorkflow,
} from '@/api/managerWorkflow'
import bpmnJsELe from '@/view/bpmnJsELe/index.vue'
import { mapState } from 'vuex'

export default {
  components: {
    bpmnJsELe,
  },
  props: {
    flag: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    publick: {
      type: String,
      default: '',
    },
    currentRowData: {
      type: Object,
      default: () => ({
        name: '',
        id: '',
      }),
    },
    xmlString: {
      type: String,
      default: '',
    },
    pubFlag: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modeler: null,
      postData: {
        name: '',
      },
    }
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId', 'currentOrganization']),
    processFormData() {
      const { name: processName, id: processId } =
        this.$iBpmn.getRootShapeInfo()
      let processFormData = new FormData()
      if (this.currentRowData?.id) {
        processFormData.set('id', this.currentRowData.id)
      }
      processFormData.set('name', processName)
      processFormData.set('docName', processName + '.bpmn')
      if (this.publick) {
        processFormData.set('ascription', 'public')
      } else {
        processFormData.set('ascription', this.currentOrganization)
      }
      processFormData.set('code', processId)
      processFormData.set('business', this.formData.business)
      processFormData.set('status', 'enabled')
      processFormData.set('createBy', this.userInfo.name)
      processFormData.set('updateBy', this.userInfo.name)
      processFormData.set('tenantId', this.tenantId)
      return processFormData
    },
  },
  methods: {
    async onPublish() {
      try {
        await this.$iBpmn.validate()
        const { xml } = await this.$iBpmn.saveXML({
          format: true,
        })
        this.processFormData.set(
          'file',
          new File([xml], this.processFormData.name + '.bpmn', {
            type: 'bpmn20-xml',
          })
        )
        // 已发布的 走修改的流程
        if (this.pubFlag) {
          this.processFormData.set('id', this.currentRowData.id)
          workFlowSaveDraft(this.processFormData)
            .then(() => {
              this.$message.success('保存成功')
              this.$emit('close')
            })
            .catch(({ errorMsg }) => {
              this.$message.error(errorMsg)
            })
        } else {
          publishWorkflow(this.processFormData)
            .then(() => {
              this.$message.success('发布成功')
              this.$emit('close')
            })
            .catch(({ errorMsg }) => {
              this.$message.error(errorMsg)
            })
        }
        this.$emit('submit', 'enabled,disabled')
      } catch (e) {
        this.$message.error('流程设计存在错误/警告')
      }
    },
    onCancel() {
      this.$emit('close')
    },
    onClose() {
      this.$emit('close')
    },
    async onSave() {
      try {
        await this.$iBpmn.validate()
        const { xml } = await this.$iBpmn.saveXML({
          format: true,
        })
        this.processFormData.set(
          'file',
          new File([xml], this.processFormData.name + '.bpmn', {
            type: 'bpmn20-xml',
          })
        )
        if (this.flag) {
          workFlowSave(this.processFormData)
            .then(() => {
              this.$message.success('保存成功')
              this.$emit('close')
            })
            .catch(({ errorMsg }) => {
              this.$message.error(errorMsg)
            })
        } else {
          workFlowSaveDraft(this.processFormData)
            .then(() => {
              this.$message.success('保存成功')
              this.$emit('close')
            })
            .catch(({ errorMsg }) => {
              this.$message.error(errorMsg)
            })
        }
        this.$emit('submit', 'drafted')
      } catch (error) {
        this.$message.error('流程设计存在错误/警告')
      }
    },
  },
}
</script>

<style scoped>
.dialogVisible-main {
  height: 80vh;
}
</style>
