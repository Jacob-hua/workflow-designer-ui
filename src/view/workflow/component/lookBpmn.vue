<template>
  <el-dialog title="查看" :visible="visible" fullscreen @close="close">
    <div>
      <ProcessInformation :xml="projectData.content" :processDisplayInfo="processDisplayInfo"></ProcessInformation>
    </div>
    <span slot="footer">
      <el-button
        class="editor-button"
        @click="onEdit"
        v-role="{ id: 'WorkflowEdit', type: 'button', business: projectData.business }"
      >
        编辑
      </el-button>
      <el-button
        class="status-button"
        @click="onDeactivate"
        v-role="{ id: 'WorkflowStart', type: 'button', business: projectData.business }"
      >
        {{ statusButtonLabel }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import ProcessInformation from '@/component/bpmnView'
import { updateWorkFlow } from '@/api/managerWorkflow'
import { mapState } from 'vuex'

export default {
  name: 'LookBpmn',
  components: {
    ProcessInformation,
  },
  props: {
    projectData: {
      type: Object,
      default: {},
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('account', ['userInfo', 'currentOrganization']),
    statusButtonLabel() {
      return this.projectData.status === 'enabled' ? '停用' : '启用'
    },
    processDisplayInfo() {
      if (this.projectData.ascription === 'public') {
        return [
          {
            label: '流程编码',
            value: this.projectData.numberCode,
          },
          {
            label: '流程名称',
            value: this.projectData.name,
          },
          {
            label: '创建时间',
            value: this.projectData.createTime,
          },
        ]
      }
      return [
        {
          label: '项目',
          value: this.$getMappingName(this.projectData.ascription),
        },
        {
          label: '业务类型',
          value: this.$getMappingName(this.projectData.business),
        },
        {
          label: '流程编码',
          value: this.projectData.numberCode,
        },
        {
          label: '流程名称',
          value: this.projectData.name,
        },
        {
          label: '创建时间',
          value: this.projectData.createTime,
        },
      ]
    },
  },
  methods: {
    onEdit() {
      this.$emit('edit', this.projectData, '查看')
    },
    onDeactivate() {
      const file1 = new File([this.projectData.content], this.projectData.name + '.bpmn', {
        type: 'bpmn20-xml',
      })
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
        this.$message.success(this.projectData.status === 'disabled' ? '启用成功' : '停用成功')
        this.$emit('close')
      })
    },
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style scoped lang="scss">
.editor-button {
  @include primaryBtn;
}

.status-button {
  @include resetBtn;
}
</style>
