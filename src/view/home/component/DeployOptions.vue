<template>
  <div>
    <el-dialog title="部署工作流" :visible="visible" @close="onCancel" fullscreen>
      <div class="deploy-wrapper">
        <div>
          <workflow-info
            :form="formContent"
            :xml="workflow.content"
            :workflow="workflow"
            :processDisplayInfo="processDisplayInfo"
            canRemoveForm
            @canvasLoaded="onCanvasLoaded"
            @selectedShape="onSelectedShape"
          />
        </div>
        <div class="form-list-wrapper">
          <div class="title">表单筛选</div>
          <div class="search-form">
            <el-input v-model="formName" placeholder="请输入内容" @keyup.native.enter="fetchFormList"></el-input>
          </div>
          <div class="content-wrapper">
            <div v-for="{ id, version, name, formContent: { list: fields, config }, docName } in formList" :key="id">
              <div class="info">
                <div>{{ name }}</div>
                <div>
                  {{ version }}
                </div>
              </div>
              <div class="operations">
                <el-popover placement="right" width="400" trigger="click">
                  <preview :itemList="fields" :formConf="config"></preview>
                  <span class="preview-button" slot="reference"> 查看 </span>
                </el-popover>
                <span class="link-button" v-if="canLink" @click="onLinked({ id, docName, fields, config })">
                  关联
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button
          class="deploy-button"
          @click="onDeploy"
          v-role="{ id: 'HomeDeploy', type: 'button', business: workflow.business }"
        >
          部署
        </el-button>
        <el-button class="save-button" @click="onSave">保存</el-button>
        <el-button class="cancel-button" @click="onCancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import WorkflowInfo from './WorkflowInfo.vue'
import { postProcessDraft, putProcessDraft, designFormDesignServiceAll, postDeployForOnline } from '@/api/unit/api.js'
import preview from '@/plugin/FormDesign/component/preview'
import { mapState } from 'vuex'
import BpmnShapeType from '../../../plugin/Bpmn/enum/shapeType'

export default {
  name: 'DeployOptions',
  components: {
    preview,
    WorkflowInfo,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    workflow: {
      type: Object,
      default: () => ({}),
      required: true,
    },
  },
  data() {
    return {
      iBpmn: {},
      formContent: {},
      formList: [],
      formName: '',
      canLink: false,
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
    workflow() {
      this.fetchFormList()
    },
  },
  methods: {
    onCancel() {
      this.$emit('cancel')
      this.onClose()
    },
    onLinked({ id, docName, fields, config }) {
      if (!this.iBpmn.getSelectedShape()) {
        return
      }
      this.iBpmn.updateSelectedShapeProperties({
        'camunda:formKey': 'camunda-forms:deployment:' + docName,
      })
      this.iBpmn.updateSelectedShapeProperties({
        'camunda:formId': id,
      })
      this.formContent = {
        fields,
        config,
      }
    },
    onSelectedShape(element) {
      if (!element || this.iBpmn.getShapeType(element) !== BpmnShapeType.USER_TASK) {
        this.canLink = false
        return
      }
      this.canLink = true
    },
    onCanvasLoaded(iBpmn) {
      this.iBpmn = iBpmn
    },
    onClose() {
      this.$emit('update:visible', false)
    },
    generateWorkflowFormData() {
      const formIds = this.iBpmn
        .elementRegistryFilter(({ type }) => type === 'bpmn:UserTask')
        .map((element) => this.iBpmn.getShapeInfoByType(element, 'formId'))
        .filter((formId) => formId)
        .join(',')

      const formData = new FormData()
      const formDataFactory = {
        enabled: (formData) => {
          formData.append('processId', this.workflow.id)
        },
        drafted: (formData) => {
          formData.append('processId', this.workflow.processId)
          formData.append('id', this.workflow.id)
        },
      }
      formDataFactory[this.workflow.status](formData)
      formData.append('createBy', this.userInfo.account)
      formData.append('deployName', this.workflow.deployName)
      formData.append('draftId', this.workflow.id)
      formData.append('operatorId', '1')
      formData.append('operatorName', this.userInfo.account)
      formData.append('systemType', this.workflow.systemType || this.workflow.business)
      formData.append('updateBy', this.userInfo.account)
      formData.append('tenantId', this.tenantId)
      formData.append('formIds', formIds)
      return formData
    },
    async getXMLInfo() {
      const newProcessId = await this.$generateUUID()
      this.iBpmn.updateRootShapeId(`process_${newProcessId}`)
      const { xml } = await this.iBpmn.saveXML({ format: true })
      const { name: processName, id: processId } = this.iBpmn.getRootShapeInfo()
      const file = new File([xml], processName + '.bpmn', {
        type: 'bpmn20-xml',
      })
      return {
        file,
        processId,
      }
    },
    async onDeploy() {
      try {
        const { file, processId } = await this.getXMLInfo()
        const workflowFormData = this.generateWorkflowFormData()
        workflowFormData.append('deployKey', processId)
        workflowFormData.append('processResource', file)

        const { errorInfo } = await postDeployForOnline(workflowFormData)
        if (errorInfo.errorCode) {
          this.$message.error(this.errorInfo.errorMsg)
          return
        }
        this.$message.success('部署成功')
        this.$emit('deployed')
        this.onClose()
      } catch (error) {
        console.log(error)
      }
    },
    async onSave() {
      try {
        const { file, processId } = await this.getXMLInfo()
        const workflowFormData = this.generateWorkflowFormData()
        workflowFormData.append('deployKey', processId)
        workflowFormData.append('processFile', file)

        if (this.workflow.status === 'enabled') {
          postProcessDraft(workflowFormData).then(() => {
            this.$message.success('保存成功')
          })
        } else {
          putProcessDraft(workflowFormData).then(() => {
            this.$message.success('保存成功')
          })
        }
        this.$emit('saved')
        this.onClose()
      } catch (error) {}
    },
    async fetchFormList() {
      const { errorInfo, result: formList = [] } = await designFormDesignServiceAll({
        status: 'enabled',
        tenantId: this.tenantId,
        ascription: this.workflow.ascription,
        business: this.workflow.business,
        name: this.formName,
      })
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg)
      }
      this.formList = formList.map(this.disableForm)
    },
    disableForm(form) {
      const newForm = { ...form }
      newForm.formContent = JSON.parse(newForm.content)
      newForm.formContent.fields = newForm.formContent.list
      newForm.formContent.config && (newForm.formContent.config.disabled = true)
      return newForm
    },
  },
}
</script>

<style scoped lang="scss">
.deploy-wrapper {
  display: flex;
  flex-direction: row;

  & > div:first-child {
    flex-grow: 1;
  }

  & > div:last-child {
    color: $font-color;
    width: 510px;
  }
}

.form-list-wrapper {
  width: 468px;
  height: 680px;
  padding: 0 38px;

  .title {
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
  }

  .search-form {
    margin-top: 25px;
  }

  .content-wrapper {
    height: 650px;
    overflow: scroll;
    margin: 10px 0;

    & > div {
      border: 1px solid $border-color;
      background-color: $card-bg-color-1;
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 6px 20px;
      font-size: 14px;

      .info {
        display: flex;
        flex-direction: row;
        color: #999999;

        & > div:first-child {
          width: 150px;
        }
      }

      .operations {
        display: flex;
        flex-direction: row;
      }
    }
  }
}

.preview-button {
  margin-right: 20px;
  color: #0199f3;
  cursor: pointer;
}

.link-button {
  color: #0dd5ef;
  cursor: pointer;
}

.deploy-button {
  @include primaryBtn;
}

.save-button {
  @include primaryBtn;
}

.cancel-button {
  @include cancelBtn;
}
</style>
