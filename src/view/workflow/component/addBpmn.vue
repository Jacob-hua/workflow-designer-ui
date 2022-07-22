<template>
  <el-dialog :title="title" :visible="visible" @close="onClose" fullscreen>
    <div class="editor-wrapper">
      <bpmn-designer v-if="visible" :projectData="projectData" @loaded="onBpmnDesignerLoaded" />
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
import BpmnDesigner from '@/component/BpmnDesigner.vue'
import { mapState } from 'vuex'

export default {
  components: {
    BpmnDesigner,
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
  data() {
    return {
      iBpmnModeler: {},
    }
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId', 'currentOrganization']),
    title() {
      return this.projectData.id ? '编辑流程' : '新建流程'
    },
  },
  methods: {
    onBpmnDesignerLoaded(iBpmnModeler) {
      this.iBpmnModeler = iBpmnModeler
    },
    processFormData() {
      // TODO: 此处的文件名和文件id应该以addProject.vue中设置的参数为主
      const { name: processName, id: processId } = this.iBpmnModeler.getRootShapeInfo()
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
    async onPublish() {
      const { error } = await this.iBpmnModeler.validate()
      if (error.length > 0) {
        this.$message.error('流程设计存在错误/警告')
        return
      }
      
      try {
        const { xml } = await this.iBpmnModeler.saveXML({
          format: true,
        })
        const processFormData = this.processFormData()
        processFormData.set(
          'file',
          new File([xml], processFormData.name + '.bpmn', {
            type: 'bpmn20-xml',
          })
        )
        processFormData.set('status', 'enabled')
        let promise
        // 如果projectData存在id，则走修改的流程
        if (this.projectData.id) {
          promise = updateWorkFlow(processFormData)
        } else {
          // 如果projectData不存在id，则走发布的流程（）
          promise = publishWorkflow(processFormData)
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
      const { error } = await this.iBpmnModeler.validate()
      if (error.length > 0) {
        this.$message.error('流程设计存在错误/警告')
        return
      }
      try {
        const { xml } = await this.iBpmnModeler.saveXML({
          format: true,
        })
        const processFormData = this.processFormData()
        processFormData.set(
          'file',
          new File([xml], processFormData.name + '.bpmn', {
            type: 'bpmn20-xml',
          })
        )
        processFormData.set('status', 'drafted')
        let promise
        // 如果projectData存在id，则走修改的流程
        if (this.projectData.id) {
          promise = updateWorkFlow(processFormData)
        } else {
          promise = createWorkFlow(processFormData)
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
