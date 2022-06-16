<template>
  <el-dialog :title="title"
             :visible="visible"
             width="90%"
             @close="onClose">
    <div class="visible-main">
      <bpmnJsELe :xmlString="projectData.content"
                 :name="projectData.name"
                 v-if="visible"></bpmnJsELe>
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
  updateWorkFlow,
  createWorkFlow,
  publishWorkflow,
} from '@/api/managerWorkflow'
import bpmnJsELe from '@/view/bpmnJsELe/index.vue'
import { mapState } from 'vuex'

export default {
  components: {
    bpmnJsELe,
  },
  props: {
    projectData: {
      type: Object,
      default: () => ({}),
    },
    visible: {
      type: Boolean,
      default: false,
    },
    publick: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId', 'currentOrganization']),
    ...mapState('bpmn/panel', ['baseInfo']),
    title() {
      return this.projectData.id ? '编辑流程' : '新建流程'
    },
    processFormData() {
      const { name: processName, id: processId } = this.baseInfo
      let processFormData = new FormData()
      if (this.projectData.id) {
        processFormData.set('id', this.projectData.id)
      }
      processFormData.set('name', processName)
      processFormData.set('docName', processName + '.bpmn')
      if (this.publick) {
        processFormData.set('ascription', 'public')
      } else {
        processFormData.set('ascription', this.currentOrganization)
        processFormData.set('business', this.projectData.business)
      }
      processFormData.set('code', processId)
      processFormData.set('createBy', this.userInfo.account)
      processFormData.set('updateBy', this.userInfo.account)
      processFormData.set('tenantId', this.tenantId)
      return processFormData
    },
  },
  methods: {
    async onPublish() {
      try {
        await this.$iBpmn.validate()
      } catch (error) {
        this.$message.error('流程设计存在错误/警告')
        return
      }
      try {
        const { xml } = await this.$iBpmn.saveXML({
          format: true,
        })
        this.processFormData.set(
          'file',
          new File([xml], this.processFormData.name + '.bpmn', {
            type: 'bpmn20-xml',
          })
        )
        this.processFormData.set('status', 'enabled')
        let promise
        // 如果projectData存在id，则走修改的流程
        if (this.projectData.id) {
          promise = updateWorkFlow(this.processFormData)
        } else {
        // 如果projectData不存在id，则走发布的流程（）
          promise = publishWorkflow(this.processFormData)
        }
        const { errorInfo } = await Promise.resolve(promise)
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }
        this.$message.success('发布成功')
        this.$emit('submit', 'enabled,disabled')
        this.onClose()
      } catch (e) {}
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
      } catch (error) {
        this.$message.error('流程设计存在错误/警告')
        return
      }
      try {
        const { xml } = await this.$iBpmn.saveXML({
          format: true,
        })
        this.processFormData.set(
          'file',
          new File([xml], this.processFormData.name + '.bpmn', {
            type: 'bpmn20-xml',
          })
        )
        this.processFormData.set('status', 'drafted')
        let promise
        // 如果projectData存在id，则走修改的流程
        if (this.projectData.id) {
          promise = updateWorkFlow(this.processFormData)
        } else {
          promise = createWorkFlow(this.processFormData)
        }
        const { errorInfo } = await Promise.resolve(promise)
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }
        this.$message.success('保存成功')
        this.$emit('submit', 'drafted')
        this.onClose()
      } catch (error) {}
    },
  },
}
</script>

<style scoped>
.visible-main {
  height: 80vh;
}
</style>
