<template>
  <div>
    <el-dialog title="部署工作流" :visible="visible" @close="onCancel" width="90%" custom-class="dialogVisible2">
      <div class="dialogVisible2-left">
        <div class="bpmn-Main">
          <ProcessInformation
            :processDisplayInfo="processDisplayInfo"
            :xml="workflow.content"
            @selectedShape="onSelectedShape"
          />
        </div>
        <div class="bpmn-configure">
          <div class="bpmn-configure-basic">
            <div class="bpmn-configure-title">工单分配</div>
            <div class="bpmn-configure-Main">
              <div class="bpmn-configure-Main-item">
                <span>名<span style="visibility: hidden">占位</span>称</span>: <span>{{ taskInfo.name }}</span>
              </div>
              <div class="bpmn-configure-Main-item">
                <span>绑定岗位</span>: <span>{{ taskInfo.group }}</span>
              </div>
              <div class="bpmn-configure-Main-item">
                <span>绑定人员</span>: <span>{{ taskInfo.assignee }}</span>
              </div>
            </div>
          </div>
          <div class="bpmn-configure-form">
            <div class="bpmn-configure-title">工单分配-表单内容</div>
            <div class="bpmn-configure-Main">
              <div v-if="formShow">
                <span class="formRemove" @click="onRemoveForm">移除表单</span>
                <div class="formShowForm">
                  <preview :itemList="formContent.fields" :formConf="formContent.config"></preview>
                </div>
              </div>
              <span v-else class="noneForm"> 当前未关联表单 </span>
            </div>
          </div>
        </div>
      </div>
      <div class="dialogVisible2-right">
        <div class="dialogVisible2-right-title">表单筛选</div>
        <div class="dialogVisible2-right-search">
          <el-input v-model="formName" placeholder="请输入内容" @keyup.native.enter="fetchFormList"></el-input>
        </div>
        <div class="formList">
          <div
            class="listItem"
            v-for="{ id, version, name, formContent: { list: fields, config }, docName } in formList"
            :key="id"
          >
            <span class="listItem-title" :title="name">{{ name }}</span>
            <div class="listItem-V1">
              {{ version }}
            </div>
            <div class="listItem-button">
              <el-popover placement="right" width="400" trigger="click">
                <preview :itemList="fields" :formConf="config"></preview>
                <el-button type="text" size="small" class="listItem-button1" slot="reference"> 查看 </el-button>
              </el-popover>
              <el-button
                type="text"
                size="small"
                class="listItem-button2"
                @click="onLinked({ id, docName, fields, config })"
              >
                关联
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="onDeploy"
          v-role="{ id: 'HomeDeploy', type: 'button', business: workflow.business }"
        >
          部署
        </el-button>
        <el-button @click="onSave">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ProcessInformation from '@/component/bpmnView/ProcessInformation.vue'
import { postProcessDraft, putProcessDraft, designFormDesignServiceAll, postDeployForOnline } from '@/api/unit/api.js'
import preview from '@/plugin/FormDesign/component/preview'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'DeployOptions',
  components: {
    ProcessInformation,
    preview,
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
      taskInfo: {
        id: '',
        name: '',
        group: '',
        assignee: '',
      },
      bpmnModeler: null,
      formContent: {},
      formList: [],
      formShow: false,
      formName: '',
      options: [],
      valueV: '1.0',
      optionsV: [
        {
          value: '1.0',
          label: 'V1.0',
        },
      ],
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
    ...mapState('uiConfig', ['cascaderProps']),
    ...mapGetters('config', ['rootOrganizations', 'rootOrganizationChildren']),
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
  mounted() {
    this.fetchFormList()
  },
  methods: {
    resetData() {
      this.taskInfo = {
        id: '',
        name: '',
        group: '',
        assignee: '',
      }
      this.formShow = false
      this.formContent = {}
    },
    onCancel() {
      this.$emit('cancel')
      this.$emit('update:visible', false)
    },
    async onDeploy() {
      const formIds = this.$iBpmn
        .elementRegistryFilter(({ type }) => type === 'bpmn:UserTask')
        .map((element) => this.$iBpmn.getShapeInfoByType(element, 'formId'))
        .filter((formId) => formId)
        .join(',')
      const { xml } = await this.$iBpmn.saveXML({ format: true })
      const shapeInfo = this.$iBpmn.getRootShapeInfo()

      this.bpmnModeler
        .saveXML({
          format: true,
        })
        .then(({ xml }) => {
          var file1 = new File([xml], definitions.process._name + '.bpmn', {
            type: 'bpmn20-xml',
          })

          let formData = new FormData()
          switch (this.workflow.status) {
            case 'enabled':
              formData.append('processId', this.workflow.id)
              break
            case 'drafted':
              formData.append('processId', this.workflow.processId)
              formData.append('id', this.workflow.id)
              break
            default:
              break
          }
          formData.append('createBy', this.userInfo.account)
          formData.append('deployKey', definitions.process['_id'])
          formData.append('deployName', this.workflow.deployName)
          formData.append('draftId', this.workflow.id)
          formData.append('formIds', formIds)
          formData.append('operatorId', '1')
          formData.append('operatorName', this.userInfo.account)
          formData.append('processResource', file1)
          if (this.workflow.systemType) {
            formData.append('systemType', this.workflow.systemType)
          } else {
            formData.append('systemType', this.workflow.business)
          }
          formData.append('updateBy', this.userInfo.account)
          formData.append('tenantId', this.tenantId)
          postDeployForOnline(formData).then((res) => {
            this.$message.success('部署成功')
            this.$emit('addWorkSuccess')
          })
        })
    },
    onSelectedShape(element) {
      if (!element) {
        this.resetData()
        return
      }
      this.taskInfo.name = this.$iBpmn.getSelectedShapeInfoByType('name')
      this.taskInfo.group = this.$iBpmn.getSelectedShapeInfoByType('candidateGroups')
      this.taskInfo.assignee = this.$iBpmn.getSelectedShapeInfoByType('assignee')
      this.fetchFormContent(this.$iBpmn.getSelectedShapeInfoByType('formKey'))
    },
    onLinked({ id, docName, fields, config }) {
      if (!this.$iBpmn.getSelectedShape()) {
        return
      }
      this.$iBpmn.updateSelectedShapeProperties({
        'camunda:formKey': 'camunda-forms:deployment:' + docName,
      })
      this.$iBpmn.updateSelectedShapeProperties({
        'camunda:formId': id,
      })
      this.formShow = true
      this.formContent = {
        fields,
        config,
      }
    },
    onRemoveForm() {
      if (!this.$iBpmn.getSelectedShape()) {
        return
      }
      this.$iBpmn.updateSelectedShapeProperties({
        'camunda:formKey': '',
      })
      this.formShow = false
      this.formContent = ''
    },
    onSave() {
      let formIds = ''
      this.bpmnModeler
        .saveXML({
          format: true,
        })
        .then(({ xml }) => {
          var file1 = new File([xml], definitions.process._name + '.bpmn', {
            type: 'bpmn20-xml',
          })
          if (Array.isArray(definitions.process.userTask)) {
            definitions.process.userTask.forEach((item, index) => {
              if (item['_camunda:formKey']) {
                formIds = formIds + item['_camunda:formKey'].split('.')[1].split('_')[1] + ','
              }
            })
          } else {
            formIds =
              (definitions.process.userTask['_camunda:formKey'] &&
                definitions.process.userTask['_camunda:formKey'].split('.')[1].split('_')[1]) ||
              ''
          }
          let formData = new FormData()
          switch (this.workflow.status) {
            case 'enabled':
              formData.append('processId', this.workflow.id)
              break
            case 'drafted':
              formData.append('processId', this.workflow.processId)
              formData.append('id', this.workflow.id)
              break
            default:
              break
          }
          formData.append('createBy', this.userInfo.account)
          formData.append('deployKey', Date.parse(new Date()))
          formData.append('deployName', this.workflow.deployName)
          formData.append('formIds', formIds)
          formData.append('operatorId', '1')
          formData.append('operatorName', 'admin')
          formData.append('processFile', file1)
          if (this.workflow.systemType) {
            formData.append('systemType', this.workflow.systemType)
          } else {
            formData.append('systemType', this.workflow.business)
          }

          // formData.append('processResource', '')
          formData.append('tenantId', this.tenantId)
          if (this.workflow.status === 'enabled') {
            postProcessDraft(formData).then((res) => {
              this.$message.success('保存成功')
              this.visible = false
              this.$emit('addDraftSuccess')
            })
          } else {
            putProcessDraft(formData).then((res) => {
              this.$message.success('保存成功')
              this.visible = false
              this.$emit('addDraftSuccess')
            })
          }
        })
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
    async fetchFormContent(formKey) {
      if (!formKey) {
        this.formContent = ''
        this.formShow = false
        return
      }
      let docName = formKey.split(':')[2]
      const { errorInfo, result = [] } = await designFormDesignServiceAll({
        status: 'enabled',
        tenantId: this.tenantId,
        ascription: this.workflow.ascription,
        business: this.workflow.business,
        createBy: '',
        numberCode: '',
        name: '',
        docName: docName,
      })
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg)
        return
      }
      if (result[0]) {
        this.formContent = this.disableForm(result[0]).formContent
      } else {
        this.formContent = {}
      }
      this.formShow = true
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

<style scoped="scoped">
::v-deep .dialogVisible1 .el-dialog__body {
  padding: 16px 180px 0px 100px;
}

::v-deep .dialogVisible1 .el-dialog__header .el-dialog__title {
  font-size: 14px;
}

::v-deep .dialogVisible1 .el-dialog__header {
  background-color: #e4e4e4;
  border-bottom: 1px solid #000000;
}

.from-item {
  display: flex;
  margin-bottom: 20px;
  text-align: center;
}

.from-item > span {
  width: 100px;
  height: 40px;
  line-height: 40px;
}

::v-deep .el-input__inner {
  color: black;
}

::v-deep .el-dialog__footer {
  text-align: center;
}

::v-deep .dialogVisible2 .el-dialog__header .el-dialog__title {
  font-size: 14px;
}

::v-deep .dialogVisible2 .el-dialog__header {
  background-color: #e4e4e4;
  border-bottom: 1px solid #000000;
}

::v-deep .dialogVisible2 .el-dialog__body {
  display: flex;
  height: 994px;
  max-height: 86vh;
}

::v-deep .dialogVisible2 .dialogVisible2-left {
  flex: 3;
  padding: 10px 20px 0px 40px;
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

.bpmn-configure-title {
  height: 40px;
  line-height: 40px;
}

.bpmn-configure-basic {
  flex: 1;
}

.bpmn-configure-Main {
  height: 200px;
  border: 1px solid #000000;
  padding: 20px 10px;
  overflow: auto;
  position: relative;
}

.bpmn-configure-Main-item {
  margin-bottom: 20px;
  color: black;
}

.bpmn-configure-form {
  flex: 3;
  margin-left: 20px;
}

::v-deep .dialogVisible2 .dialogVisible2-right {
  /* flex: 1; */
  border-left: 1px solid #cccccc;
  padding: 0px 0px 0px 30px;
  box-sizing: border-box;
  width: 375px;
}

.dialogVisible2-right-title {
  color: black;
  margin-bottom: 20px;
}

.dialogVisible2-right-search {
  margin-bottom: 30px;
}

.dialogVisible2-right-search ::v-deep .el-input__inner {
  border-radius: 20px;
  border-color: black;
  color: #000000;
}

.formList {
  height: 690px;
  overflow: auto;
}

::v-deep .formList::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

.listItem {
  display: flex;
  border: 1px solid #666666;
  margin-bottom: 20px;
  height: 46px;
}

.listItem .listItem-title {
  width: 120px;
  margin-left: 10px;
  text-align: left;
  height: 46px;
  display: inline-block;
  line-height: 46px;
  color: black;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.listItem .listItem-V1 ::v-deep .el-input__inner {
  width: 60px;
  border: none;
  height: 35px;
  margin-top: 5px;
  padding: 0px;
  line-height: 35px;
  background-color: transparent;
}

.listItem .listItem-V1 ::v-deep .el-input__icon {
  line-height: 20px;
  color: black;
}

.listItem .listItem-button {
  text-align: left;
  line-height: 46px;
  margin-left: 60px;
  color: #0368cd;
}

.listItem .listItem-button1 {
  color: #0368cd;
  font-size: 14px;
  margin-right: 10px;
}

.listItem .listItem-button2 {
  color: #0368cd;
  font-size: 14px;
}

.formShowForm {
  position: relative;
}

.formRemove {
  position: absolute;
  right: 10px;
  top: 2px;
  z-index: 9;
  cursor: pointer;
}
</style>
