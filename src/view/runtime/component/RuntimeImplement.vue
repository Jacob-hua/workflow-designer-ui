<template>
  <el-dialog title="执行工作流" :visible="visible" top="1vh" fullscreen @close="onDialogClose">
    <div class="container">
      <div>
        <bpmn-info
          :xml="workflow.processDeployResource"
          :processDisplayInfo="processDisplayInfo"
          @loaded="onBpmnInfoLoaded"
        />
        <div class="action-wrapper" v-if="activeAction">
          <el-tabs v-model="activeAction" type="border-card" @tab-click="onSelectAction">
            <el-tab-pane
              v-for="{ label, value, component: { name, events, props } } in actions"
              :label="label"
              :name="value"
              :key="value"
            >
              <div class="pane-container" v-if="!roleBoolean">
                <img :src="require('../../../assets/image/runtime/no-power.svg')" />
                <div>无权限</div>
              </div>
              <component v-else :is="name" v-on="events" v-bind="props" />
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="no-action" v-else>
          <img :src="require('../../../assets/image/common/no_data.png')" />
        </div>
      </div>
      <div>
        <div class="form-title">表单内容</div>
        <div class="form-preview">
          <preview
            :itemList="formContant.list"
            :formConf="formContant.config"
            :uploadFun="uploadFile.bind(this)"
            :downloadFun="downloadFile.bind(this)"
            v-if="formShow"
            ref="preview"
          ></preview>
        </div>
      </div>
    </div>
    <span slot="footer">
      <el-button class="submit-button" @click="onExecute" :disabled="hang">执 行</el-button>
      <el-button class="cancel-button" @click="onCancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import BpmnInfo from '@/component/BpmnInfo.vue'
import RuntimeImplementAgency from './RuntimeImplementAgency.vue'
import RuntimeImplementCirculate from './RuntimeImplementCirculate.vue'
import RuntimeImplementSignature from './RuntimeImplementSignature.vue'
import RuntimeImplementHang from './RuntimeImplementHang.vue'
import RuntimeImplementReject from './RuntimeImplementReject.vue'
import RuntimeImplementTermination from './RuntimeImplementTermination.vue'
import RuntimeImplementExecutor from './RuntimeImplementExecutor.vue'
import preview from '@/plugin/FormDesign/component/preview'
import {
  designFormDesignServiceAll,
  postCompleteTask,
  getProcessNodeInfo,
  getExecuteDetail,
  uploadTaskAttachmentFile,
  downloadTaskAttachmentFile,
} from '@/api/unit/api.js'
import { mapState } from 'vuex'

export default {
  components: {
    BpmnInfo,
    preview,
    RuntimeImplementAgency,
    RuntimeImplementCirculate,
    RuntimeImplementSignature,
    RuntimeImplementHang,
    RuntimeImplementReject,
    RuntimeImplementTermination,
    RuntimeImplementExecutor,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    processInstanceId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      workflow: {},
      formContant: {},
      formShow: false,
      roleBoolean: true,
      activeAction: undefined,
      actionsConfig: {
        Agency: {
          label: '代办',
          value: 'Agency',
          component: ({ workflow, onAgencyCompleted }) => ({
            name: 'RuntimeImplementAgency',
            props: {
              workflow,
            },
            events: {
              completed: onAgencyCompleted,
            },
          }),
        },
        Circulate: {
          label: '传阅',
          value: 'Circulate',
          component: ({ workflow, onAgencyCompleted }) => ({
            name: 'RuntimeImplementCirculate',
            props: {
              workflow,
            },
            events: {
              completed: onAgencyCompleted,
            },
          }),
        },
        Signature: {
          label: '加减签',
          value: 'Signature',
          component: ({ workflow, onAgencyCompleted }) => ({
            name: 'RuntimeImplementSignature',
            props: {
              workflow,
            },
            events: {
              completed: onAgencyCompleted,
            },
          }),
        },
        Hang: {
          label: '挂起',
          value: 'Hang',
          component: ({ workflow, onAgencyCompleted }) => ({
            name: 'RuntimeImplementHang',
            props: {
              workflow,
            },
            events: {
              completed: onAgencyCompleted,
            },
          }),
        },
        Reject: {
          label: '驳回',
          value: 'Reject',
          component: ({ workflow, onAgencyCompleted, onRejectSuccess }) => ({
            name: 'RuntimeImplementReject',
            props: {
              workflow,
            },
            events: {
              completed: onAgencyCompleted,
              rejectSuccess: onRejectSuccess,
            },
          }),
        },
        Terminate: {
          label: '终止',
          value: 'Terminate',
          component: ({ workflow, onAgencyCompleted, onRejectSuccess }) => ({
            name: 'RuntimeImplementTermination',
            props: {
              workflow,
            },
            events: {
              completed: onAgencyCompleted,
              terminateSuccess: onRejectSuccess,
            },
          }),
        },
        NoExecutor: {
          label: '指定执行人',
          value: 'NoExecutor',
          component: ({ workflow, onSelectExecutor }) => ({
            name: 'RuntimeImplementExecutor',
            props: {
              workflow,
            },
            events: {
              selectExecutor: onSelectExecutor,
            },
          }),
        },
      },
      curExecuteShape: undefined,
      noExecutor: false,
      iBpmnViewer: {},
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
    hang() {
      if (!this.workflow.curTrack) {
        return false
      }
      return this.workflow.curTrack.status.split(',').includes('hang')
    },
    actions() {
      if (!this.curExecuteShape) {
        return []
      }
      if (this.hang) {
        return [makeComponent.call(this, 'Hang')]
      }
      const temps = []
      if (this.noExecutor) {
        temps.push(makeComponent.call(this, 'NoExecutor'))
      }
      let actions = this.iBpmnViewer.getShapeInfoByType(this.curExecuteShape, 'actions')?.split(',') ?? []
      if (curTaskIsFirstTask.call(this)) {
        actions = actions.filter((action) => action !== 'Reject')
      }
      return actions.map(makeComponent.bind(this)).concat(temps)

      function curTaskIsFirstTask() {
        const curTaskIndex = this.iBpmnViewer
          .elementRegistryFilter(({ type }) => type === 'bpmn:UserTask')
          .findIndex(({ id }) => id === this.workflow.taskKey)
        return curTaskIndex === 0
      }

      function makeComponent(action) {
        const component = this.actionsConfig[action].component({
          workflow: this.workflow,
          onAgencyCompleted: this.onAgencyCompleted,
          onRejectSuccess: this.onRejectSuccess,
          onSelectExecutor: this.onSelectExecutor,
        })
        return { ...this.actionsConfig[action], component }
      }
    },
    processDisplayInfo() {
      return [
        {
          label: '流程编码',
          value: this.workflow.processNumber,
        },
        {
          label: '部署名称',
          value: this.workflow.processDeployName,
        },
        {
          label: '部署时间',
          value: this.workflow.startTime,
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
          value: this.workflow.starter,
        },
      ]
    },
  },
  watch: {
    actions(actions) {
      if (!this.activeAction) {
        this.activeAction = actions[0]?.value
      }
    },
  },
  async mounted() {
    await this.fetchExecuteDetail()
    await this.fetchProcessNodeInfo()
  },
  methods: {
    onAgencyCompleted() {
      this.fetchExecuteDetail()
    },
    onRejectSuccess() {
      this.$emit('taskSuccess')
    },
    onDialogClose() {
      this.formShow = false
      this.$emit('close')
    },
    onCancel() {
      this.$emit('close')
    },
    onSelectExecutor(value) {
      this.$set(this.workflow, 'executors', value)
    },
    onSelectAction() {
      let { permissions } = JSON.parse(sessionStorage.getItem('loginData'))
      let proJectRole =
        permissions.filter((item) => {
          return item.projectCode === this.workflow.ascription
        })[0]?.permissionSet || []
      let findEle = proJectRole.findIndex((item) => {
        return item.frontRoute === 'RunTime' + this.activeAction
      })
      if (findEle === -1 && this.activeAction !== 'NoExecutor') {
        this.roleBoolean = false
      } else {
        this.roleBoolean = true
      }
    },
    onBpmnInfoLoaded(iBpmnViewer) {
      this.iBpmnViewer = iBpmnViewer
      if (!this.workflow.trackList) {
        return
      }
      const completedTaskList = this.workflow.trackList
        .filter(({ taskKey }) => taskKey !== this.workflow.taskKey)
        .map(({ taskKey }) => taskKey)
      iBpmnViewer
        .elementRegistryFilter(({ type }) => type === 'bpmn:UserTask')
        .forEach((element) => {
          if (element.id === this.workflow.taskKey) {
            iBpmnViewer.canvasAddMarker(element, 'svgOncomplete')
            return
          }
          if (completedTaskList.includes(element.id)) {
            iBpmnViewer.canvasAddMarker(element, 'svgComplete')
            return
          }
          iBpmnViewer.canvasAddMarker(element, 'svgIncomplete')
        })
      const value = iBpmnViewer.elementRegistryFind(({ id }) => id === this.workflow.taskKey)
      this.curExecuteShape = value
      if (value) {
        this.fetchFormData(value.businessObject.formKey)
      }
    },
    async onExecute() {
      if (this.formShow) {
        const { formData, metaDataList } = await this.$refs.preview.submit()
        this.formContant.list = [...metaDataList]
        this.completeTask(this.formContant, formData)
        return
      }
      if (this.noExecutor && (!Array.isArray(this.workflow.executors) || this.workflow.executors.length === 0)) {
        this.$message.error('后续执行人为空！')
        return
      }
      this.completeTask()
    },
    async completeTask(formData = {}, data = {}) {
      const { errorInfo } = await postCompleteTask({
        assignee: this.userInfo.account,
        nextAssignee: this.workflow.executors?.[0].userId,
        commentList: [],
        formData,
        processInstanceId: this.workflow.processInstanceId,
        processKey: this.workflow.processDeployKey,
        taskId: this.workflow.newTaskId,
        taskKey: this.workflow.taskKey,
        taskName: this.workflow.processDeployName,
        variable: data,
      })
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg)
        return
      }
      this.formShow = false
      this.$message.success('执行成功')
      this.$emit('taskSuccess')
    },
    async fetchFormData(formKey) {
      if (formKey) {
        let docName = formKey.split(':')[2]
        const { errorInfo, result } = await designFormDesignServiceAll({
          status: 'enabled',
          tenantId: this.tenantId,
          ascription: this.workflow.ascription,
          business: this.workflow.business,
          numberCode: '',
          name: '',
          docName: docName,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }
        if (!Array.isArray(result)) {
          return
        }
        this.formContant = JSON.parse(result[0]?.content ?? '{}')
        this.formShow = true
      } else {
        this.formContant = {}
        this.formShow = false
      }
    },
    async uploadFile({ name, raw: file }) {
      const uploadParameters = new FormData()
      uploadParameters.append('name', name)
      uploadParameters.append('type', 'file')
      uploadParameters.append('file', file)
      uploadParameters.append('description', '')
      uploadParameters.append('processInstanceId', this.workflow.processInstanceId)
      uploadParameters.append('taskId', this.workflow.newTaskId)
      const { errorInfo, result } = await uploadTaskAttachmentFile(uploadParameters)
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg)
        return
      }
      return result
    },
    async downloadFile({ url }) {
      const { errorInfo, result } = await downloadTaskAttachmentFile({
        attachmentId: url,
      })
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg)
        return
      }
      return result
    },
    async fetchProcessNodeInfo() {
      const { errorInfo, result } = await getProcessNodeInfo({
        processInstanceId: this.workflow.processInstanceId,
      })
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg)
        return
      }
      this.noExecutor = result.some(
        ({ assignee, candidateGroup, candidateUser }) =>
          assignee === null && candidateGroup === null && candidateUser === null
      )
      if (this.noExecutor) {
        this.$message.warning('下一步无执行人')
      }
    },
    async fetchExecuteDetail() {
      try {
        const { errorInfo, result } = await getExecuteDetail({
          processInstanceId: this.processInstanceId,
          assignee: this.userInfo.account,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }
        result.curTrack = this.getCurTrack(result)
        this.workflow = { ...result, newTaskId: this.calculateNewTaskId(result, this.userInfo.account) }
      } catch (error) {}
    },
    getCurTrack(workflow) {
      if (!Array.isArray(workflow.trackList)) {
        return
      }
      return workflow.trackList.at(-1)
    },
    calculateNewTaskId(workflow, account) {
      if (assigneesInclude(workflow, account)) {
        return getTaskIdBy(workflow, account)
      }
      if (candidateUsersInclude(workflow, account)) {
        return candidateUsersInclude(workflow, account).taskId
      }

      function assigneesInclude(workflow, account) {
        if (!workflow.curTrack) {
          return
        }
        return workflow.curTrack.assignee?.split(',').includes(account)
      }

      function getTaskIdBy(workflow, account) {
        return workflow.curTrack.taskId.split(',')[workflow.curTrack.assignee?.split(',').indexOf(account)]
      }

      function candidateUsersInclude(workflow, account) {
        if (!workflow.curTrack) {
          return
        }
        return workflow.curTrack.candidateUsers?.find(({ candidateUsers = [] }) => candidateUsers.includes(account))
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import '../index.scss';

@include paneContainer;

.container {
  display: flex;

  & > div:first-child {
    flex: 3;
  }

  & > div:last-child {
    flex: 1;
    padding: 0px 20px;
  }
}

.action-wrapper {
  margin-top: 30px;
  @include runtimeContentTab;
}

.no-action {
  border: 1px solid $border-color-1;
  margin-top: 30px;
  height: 270px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-title {
  color: $font-color;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
}

.form-preview {
  height: 685px;
  overflow: scroll;
  margin-top: 15px;
  background: $card-bg-color-1;
  border: 1px solid $border-color-1;
  border-radius: 8px;
  padding: 12px 0px;
}

.submit-button {
  @include primaryBtn;
}

.cancel-button {
  @include cancelBtn;
}
</style>
