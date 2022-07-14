<template>
  <el-dialog :title="title" :visible="visible" @close="onClose" fullscreen>
    <div class="editor-wrapper">
      <bpmn-designer :projectData="projectData" v-if="visible"></bpmn-designer>
    </div>
    <div slot="footer">
      <el-button class="publish" @click="onPublish">发布</el-button>
      <el-button class="save" @click="onSave">保存</el-button>
      <el-button class="cancel" @click="onCancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateWorkFlow, createWorkFlow, publishWorkflow } from '@/api/managerWorkflow'
import bpmnDesigner from '@/component/bpmnDesigner'
import { mapState } from 'vuex'

export default {
  components: {
    bpmnDesigner,
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
    title() {
      return this.projectData.id ? '编辑流程' : '新建流程'
    },
    processFormData() {
      // TODO: 此处的文件名和文件id应该以addProject.vue中设置的参数为主
      const { name: processName, id: processId } = this.$iBpmn.getRootShapeInfo()
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

<style scoped lang="scss">
.editor-wrapper {
  height: 100%;
}

.publish {
  @include primaryBtn;
}

.save {
  @include primaryBtn;
}

.cancel {
  @include cancelBtn;
}
</style>
