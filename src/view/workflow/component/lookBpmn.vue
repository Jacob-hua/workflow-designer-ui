<template>
  <el-dialog title="查看"
             :visible="dialogVisible"
             width="70%"
             custom-class="dialogVisible"
             @close="close">
    <div class="dialogVisible-main">
      <bpmnView ref="bpmnView"
                :valueType="valueType"
                @edit="onEdit"
                @quote="onQuote"></bpmnView>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button v-if="isEdit"
                 @click="onEdit"
                 v-role="{ id: 'WorkflowEdit', type: 'button', business: business }">编辑</el-button>
      <el-button v-if="isEdit"
                 @click="onDeactivate"
                 v-role="{ id: 'WorkflowStart', type: 'button', business: business }">{{statusButtonLabel}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import bpmnView from '@/component/bpmnView/index.vue'
import { workFlowSaveDraft } from '@/api/managerWorkflow'
import { mapState } from 'vuex'

export default {
  name: 'LookBpmn',
  components: {
    bpmnView,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    dep: {
      type: String,
      default: '',
    },
    rowData: {
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
    business: {
      type: String,
      default: '',
    },
    showFlag: Boolean,
  },
  computed: {
    ...mapState('account', ['userInfo', 'currentOrganization']),
    statusButtonLabel() {
      return this.rowData.status === 'enabled' ? '停用' : '启用'
    },
  },
  methods: {
    onEdit() {
      window.oneBpmnInstances = true
      this.$emit('edit', this.rowData, '查看')
    },
    onDeactivate() {
      const file1 = new File(
        [this.rowData.content],
        this.rowData.name + '.bpmn',
        {
          type: 'bpmn20-xml',
        }
      )
      let formData = new FormData()
      formData.set('id', this.rowData.id)
      formData.set('name', this.rowData.name)
      formData.set('docName', this.rowData.name + '.bpmn')
      if (this.rowData.ascription) {
        formData.set('ascription', this.rowData.ascription)
      } else {
        formData.set('ascription', this.currentOrganization)
      }
      formData.set('code', this.rowData.code)
      formData.set('business', this.rowData.business)
      if (this.rowData.status === 'disabled') {
        formData.set('status', 'enabled')
      } else {
        formData.set('status', 'disabled')
      }
      formData.set('createBy', this.userInfo.account)
      formData.set('updateBy', this.userInfo.account)
      formData.set('tenantId', '18')
      formData.set('file', file1)
      workFlowSaveDraft(formData).then(() => {
        this.$message.success(
          this.rowData.status === 'disabled' ? '启用成功' : '停用成功'
        )
        this.$emit('close')
        this.$parent.findWorkFlowRecord('disabled,enabled')
      })
    },
    onQuote() {
      this.$emit('quote')
    },
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style>
</style>
