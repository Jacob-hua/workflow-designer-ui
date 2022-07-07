<template>
  <div>
    <el-dialog title="部署工作流" :visible="visible" @close="onCancel">
      <workflow-info :workflow="workflow" :xml="workflow.processResource" :processDisplayInfo="processDisplayInfo" />
      <span slot="footer">
        <el-button
          @click="deleteDeployment()"
          v-role="{ id: 'HomeDelete', type: 'button', business: workflow.business }"
        >
          删除
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDeleteDeployment, getDeployAndProcessInfo } from '@/api/unit/api.js'
import { mapState } from 'vuex'
import WorkflowInfo from './WorkflowInfo.vue'

export default {
  name: 'DeployDetail',
  components: {
    WorkflowInfo,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    deployedId: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {
      workflow: {},
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
    processDisplayInfo() {
      return [
        {
          label: '流程编码',
          value: this.workflow.numberCode,
        },
        {
          label: '部署名称',
          value: this.workflow.deployName,
        },
        {
          label: '部署时间',
          value: this.workflow.createTime,
        },
        {
          label: '应用项目',
          value: this.$getMappingName(this.workflow.ascription),
        },
        {
          label: '流程类型',
          value: this.$getMappingName(this.workflow.business),
        },
        {
          label: '部署人',
          value: this.workflow.createBy,
        },
      ]
    },
  },
  watch: {
    deployedId: {
      immediate: true,
      handler(deployedId) {
        if (!deployedId) {
          return
        }
        this.fetchDeployedWorkflow()
      },
    },
  },
  methods: {
    onCancel() {
      this.$emit('cancel')
      this.$emit('update:visible', false)
    },
    deleteDeployment() {
      this.$confirm('删除后不可恢复, 请确认是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          getDeleteDeployment({
            id: this.workflow.deployRecordId,
            cascade: true,
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.dialogVisible1 = false
            this.dialogVisible2 = false
            this.$emit('deleteSuccess')
          })
        })
        .catch(() => {})
    },
    async fetchDeployedWorkflow() {
      try {
        const { errorInfo, result } = await getDeployAndProcessInfo(this.deployedId)
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }
        this.workflow = result
      } catch (error) {
        this.workflow = {}
      }
    },
  },
}
</script>

<style scoped lang="scss"></style>
