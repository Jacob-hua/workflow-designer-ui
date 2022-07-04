<template>
  <div>
    <el-dialog title="部署工作流" :visible="visible" width="70%" @close="onCancel" custom-class="dialogVisible1">
      <workflow-info :workflow="workflow" :xml="workflow.processResource" :processDisplayInfo="processDisplayInfo" />
      <span slot="footer" class="dialog-footer">
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

<style scoped="scoped">
::v-deep .el-dialog__body {
  max-height: 90vh;
  word-break: normal;
}
.details-header {
  margin-top: 20px;
}
.inputSelect {
  margin-right: 20px;
  display: inline-block;
  margin-left: 20px;
}
.inputSelect /deep/ .el-input__inner {
  width: 180px;
  height: 43px;
  line-height: 43px;
  padding: 0px 10px;
  border: 1px solid black;
}
.frequency {
  color: #0066cc;
  font-weight: 700;
}
.detail-list {
  margin-top: 30px;
  /* display: flex; */
  width: 1312px;
  padding-bottom: 10px;
  margin-bottom: 20px;
  /* height: 200px; */
  overflow: auto;
  white-space: nowrap;
}
.detail-list::-webkit-scrollbar {
  width: 0px;
  /* height: 2px; */
}
.detail-list-item {
  position: relative;
  display: inline-block;
  width: 290px;
  height: 165px;
  border: 1px solid black;
  padding: 20px 20px;
  margin-right: 40px;
}
.detailsWord {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #0066cc;
  cursor: pointer;
}

.detail-list-item .item-item {
  line-height: 35px;
  color: black;
}

::v-deep .el-dialog__footer {
  text-align: center;
}

.bpmn-configure {
  display: flex;
}

.noneForm {
  display: inline-block;
  height: 160px;
  width: 100%;
  text-align: center;
  line-height: 160px;
}

.details-footer-height {
  height: 248px;
}

.bpmn-configure-title {
  height: 40px;
  line-height: 40px;
}

.bpmn-configure-basic {
  flex: 1;
}

.bpmn-configure-form {
  flex: 3;
  margin-left: 20px;
}

.bpmn-configure-Main {
  height: 200px;
  border: 1px solid #000000;
  padding: 20px 10px;
  overflow: auto;
}

.bpmn-configure-Main-item {
  margin-bottom: 20px;
  color: black;
}

.formShowForm {
  position: relative;
}

.formRemove {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
