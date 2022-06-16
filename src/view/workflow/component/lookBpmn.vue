<template>
  <el-dialog title="查看"
             :visible="dialogVisible"
             width="70%"
             custom-class="dialogVisible"
             @close="close">
    <div class="dialogVisible-main">
      <bpmnView ref="bpmnView"
                :valueType="valueType"
                @edit="onEdit"></bpmnView>
    </div>
    <span v-if="valueType === 'project'"
          slot="footer"
          class="dialog-footer">
      <el-button @click="onEdit"
                 type="primary"
                 v-role="{ id: 'WorkflowEdit', type: 'button', business: projectData.business }">编辑</el-button>
      <el-button @click="onDeactivate"
                 v-role="{ id: 'WorkflowStart', type: 'button', business: projectData.business }">{{statusButtonLabel}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import bpmnView from '@/component/bpmnView/index.vue'
import { updateWorkFlow } from '@/api/managerWorkflow'
import { mapState } from 'vuex'

export default {
  name: 'LookBpmn',
  components: {
    bpmnView,
  },
  props: {
    projectData: {
      type: Object,
      default: {},
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    valueType: {
      type: String,
      default: 'project',
    },
  },
  computed: {
    ...mapState('account', ['userInfo', 'currentOrganization']),
    statusButtonLabel() {
      return this.projectData.status === 'enabled' ? '停用' : '启用'
    },
  },
  methods: {
    onEdit() {
      this.$emit('edit', this.projectData, '查看')
    },
    onDeactivate() {
      const file1 = new File(
        [this.projectData.content],
        this.projectData.name + '.bpmn',
        {
          type: 'bpmn20-xml',
        }
      )
      let formData = new FormData()
      formData.set('id', this.projectData.id)
      formData.set('name', this.projectData.name)
      formData.set('docName', this.projectData.name + '.bpmn')
      if (this.projectData.ascription) {
        formData.set('ascription', this.projectData.ascription)
      } else {
        formData.set('ascription', this.currentOrganization)
      }
      formData.set('code', this.projectData.code)
      formData.set('business', this.projectData.business)
      if (this.projectData.status === 'disabled') {
        formData.set('status', 'enabled')
      } else {
        formData.set('status', 'disabled')
      }
      formData.set('createBy', this.userInfo.account)
      formData.set('updateBy', this.userInfo.account)
      formData.set('tenantId', '18')
      formData.set('file', file1)
      updateWorkFlow(formData).then(() => {
        this.$message.success(
          this.projectData.status === 'disabled' ? '启用成功' : '停用成功'
        )
        this.$emit('close')
      })
    },
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style>
</style>
