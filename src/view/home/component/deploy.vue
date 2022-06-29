<template>
  <div>
    <el-dialog title="部署工作流" :visible.sync="dialogVisible1" width="35%" custom-class="dialogVisible1">
      <el-form label-position="right" label-width="80px" ref="formData" :model="firstData">
        <el-form-item label="应用项目" prop="ascription">
          <el-col :span="24">
            <el-input
              :value="$getMappingName(firstData.ascription)"
              placeholder="请输入应用项目"
              :disabled="true"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="流程类型" prop="business">
          <el-col :span="24">
            <el-cascader
              v-model="firstData.business"
              clearable
              :style="{ width: '100%' }"
              :options="rootOrganizationChildren(firstData.ascription)"
              :props="cascaderProps"
              :disabled="true"
            ></el-cascader>
          </el-col>
        </el-form-item>
        <el-form-item label="部署类型" prop="name" v-if="options.length > 0">
          <el-col :span="24">
            <el-select v-model="firstData.systemType" placeholder="请选择部署类型">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="部署名称" prop="name">
          <el-col :span="24">
            <el-input v-model="firstData.deployName" placeholder="请输入部署名称"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="nextDiolog()" type="primary">下一步</el-button>
        <el-button @click="dialogVisible1 = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="部署工作流" :visible.sync="dialogVisible2" width="90%" custom-class="dialogVisible2">
      <div class="dialogVisible2-left">
        <div class="bpmn-Main">
          <ProcessInformation
            type="deploy2"
            ref="ProcessInformation"
            v-if="dialogVisible2"
            @selection="selection"
          ></ProcessInformation>
        </div>
        <div class="bpmn-configure">
          <div class="bpmn-configure-basic">
            <div class="bpmn-configure-title">工单分配</div>
            <div class="bpmn-configure-Main">
              <div class="bpmn-configure-Main-item">
                <span>名<span style="visibility: hidden">占位</span>称</span>: <span>{{ bpmnData.name }}</span>
              </div>
              <div class="bpmn-configure-Main-item">
                <span>绑定岗位</span>: <span>{{ bpmnData.grounp }}</span>
              </div>
              <div class="bpmn-configure-Main-item">
                <span>绑定人员</span>: <span>{{ bpmnData.assignee }}</span>
              </div>
              <div class="bpmn-configure-Main-item">
                <span>备<span style="visibility: hidden">占位</span>注</span>: <span>{{ bpmnData.document }}</span>
              </div>
            </div>
          </div>
          <div class="bpmn-configure-form">
            <div class="bpmn-configure-title">工单分配-表单内容</div>
            <div class="bpmn-configure-Main">
              <span v-if="!formShow" class="noneForm"> 当前未关联表单 </span>
              <span v-if="formShow" class="formRemove" @click="removeForm()">移除表单</span>
              <div v-if="formShow" class="formShowForm">
                <formOB
                  v-if="formShow && (formContent.docType === '.form' || formContent.docType === null)"
                  :formContant="formContent.content"
                  :key="formOBKey"
                ></formOB>
                <preview
                  :itemList="formListFun(formContent)"
                  :formConf="configFun(formContent)"
                  v-if="formShow && formContent.docType === 'json'"
                ></preview>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialogVisible2-right">
        <div class="dialogVisible2-right-title">表单筛选</div>
        <div class="dialogVisible2-right-search">
          <el-input v-model="input" placeholder="请输入内容" @keyup.native.enter="getFormList()"></el-input>
        </div>
        <div class="formList">
          <div class="listItem" v-for="(item, index) in formList" :key="index">
            <span class="listItem-title" :title="item.name">{{ item.name }}</span>
            <div class="listItem-V1">
              <el-input v-model="item.version"></el-input>
            </div>
            <div class="listItem-button">
              <el-popover placement="right" width="400" trigger="click">
                <formOB :formContant="item.content" v-if="item.docType === '.form' || item.docType === null"></formOB>
                <preview
                  :itemList="formListFun(item)"
                  :formConf="configFun(item)"
                  v-if="item.docType === 'json'"
                ></preview>
                <el-button type="text" size="small" class="listItem-button1" slot="reference">查看</el-button>
              </el-popover>

              <el-button type="text" size="small" class="listItem-button2" @click="showForm(item)"> 关联 </el-button>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="addWorkFlow()"
          v-role="{ id: 'HomeDeploy', type: 'button', business: business }"
          >部署</el-button
        >
        <el-button @click="Adddraft()">保存</el-button>
        <el-button @click="dialogVisible2 = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ProcessInformation from './ProcessInformation.vue'
import formOB from './formOB.vue'
import { postProcessDraft, putProcessDraft, designFormDesignServiceAll, postDeployForOnline } from '@/api/unit/api.js'
import X2JS from 'x2js'
import preview from '@/plugin/FormDesign/component/preview'
import { mapState, mapGetters } from 'vuex'

export default {
  props: {
    editData: {
      type: Object,
    },
    dataType: {
      type: String,
      default: '',
    },
    business: {
      type: String,
      default: '',
    },
    ascription: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialogVisible1: false,
      dialogVisible2: false,
      bpmnData: {
        name: '',
        grounp: '',
        assignee: '',
        document: '',
        id: '',
      },
      firstData: {
        ascription: '',
        business: '',
        systemType: '',
        deployName: '',
      },
      bpmnModeler: null,
      formContent: '',
      formOBKey: 0,
      formList: [],
      formShow: false,
      input: '',
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
  watch: {
    'firstData.business': {
      handler() {
        this.changeOptions()
      }
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
    ...mapState('uiConfig', ['cascaderProps']),
    ...mapGetters('config', ['rootOrganizations', 'rootOrganizationChildren']),
  },
  methods: {
    initData() {
      this.bpmnData = {
        name: '',
        grounp: '',
        assignee: '',
        document: '',
        id: '',
      }
      this.formShow = false
      this.formContent = ''
    },
    changeOptions() {
      let manyValue = this.rootOrganizationChildren(this.firstData.ascription)
      let systemOption = manyValue.filter((item) => {
        return item.value === this.firstData.business
      })
      if (systemOption.length > 0) {
        this.options = systemOption[0].children || []
      }
    },
    addWorkFlow() {
      const newConvert = new X2JS()
      let formIds = ''
      this.bpmnModeler
        .saveXML({
          format: true,
        })
        .then(({ xml }) => {
          let a = xml.replaceAll(this.$refs.ProcessInformation.postData.code, `Process_${new Date().getTime()}`)
          const { definitions } = newConvert.xml2js(a)

          var file1 = new File([a], definitions.process._name + '.bpmn', {
            type: 'bpmn20-xml',
          })
          if (definitions.process.userTask) {
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
          }
          let formData = new FormData()
          switch (this.dataType) {
            case 'enabled':
              formData.append('processId', this.$refs.ProcessInformation.postData.id)
              break
            case 'drafted':
              formData.append('processId', this.$refs.ProcessInformation.postData.processId)
              formData.append('id', this.$refs.ProcessInformation.postData.id)
              break
            default:
              break
          }
          // formData.append('createTime', new Date())
          formData.append('createBy', this.userInfo.account)
          formData.append('deployKey', definitions.process['_id'])
          formData.append('deployName', this.$refs.ProcessInformation.postData.deployName)
          formData.append('draftId', this.$refs.ProcessInformation.postData.id)
          formData.append('formIds', formIds)
          formData.append('operatorId', '1')
          formData.append('operatorName', this.userInfo.account)
          formData.append('processResource', file1)
          if (this.$refs.ProcessInformation.postData.systemType) {
            formData.append('systemType', this.$refs.ProcessInformation.postData.systemType)
          } else {
            formData.append('systemType', this.$refs.ProcessInformation.postData.business)
          }
          formData.append('updateBy', this.userInfo.account)
          // formData.append('processResource', '')
          formData.append('tenantId', this.tenantId)
          postDeployForOnline(formData).then((res) => {
            this.$message.success('部署成功')
            this.dialogVisible2 = false
            this.$emit('addWorkSuccess')
          })
        })
    },
    getFormList() {
      designFormDesignServiceAll({
        status: 'enabled',
        tenantId: this.tenantId,
        ascription: this.$refs.ProcessInformation.postData.ascription,
        business: this.firstData.business,
        createBy: '',
        numberCode: '',
        name: this.input,
        docName: '',
      }).then((res) => {
        this.formList = res.result
      })
    },
    nextDiolog() {
      this.dialogVisible1 = false
      this.dialogVisible2 = true
      this.$nextTick(() => {
        this.$refs.ProcessInformation.postData = this.editData
        this.$refs.ProcessInformation.postData.ascription = this.firstData.ascription
        this.$refs.ProcessInformation.postData.business = this.firstData.business
        this.$refs.ProcessInformation.postData.systemType = this.firstData.systemType
        this.$refs.ProcessInformation.postData.deployName = this.firstData.deployName
        this.getFormList()
        this.$refs.ProcessInformation.createNewDiagram(this.editData.content)
      })
    },
    selection(element, bpmn) {
      this.bpmnModeler = bpmn
      if (element) {
        window.bpmnInstances.modeler = element
        this.bpmnData.name = element.businessObject.name
        this.bpmnData.grounp = element.businessObject.$attrs['camunda:' + 'candidateGroups']
        this.bpmnData.assignee = element.businessObject.$attrs['camunda:' + 'assignee']
        this.bpmnData.document = element.businessObject.documentation && element.businessObject.documentation[0].text
        // window.bpmnInstances.elementRegistry.forEach((item) => {
        //   window.bpmnInstances.modeling.setColor(item, { 'fill': '#ffffff' } )
        // })
        // window.bpmnInstances.modeling.setColor(window.bpmnInstances.modeler, { 'fill': '#cccccc', 'stroke': '#1890ff' } )
        this.getFormData(element.businessObject.$attrs['camunda:' + 'formKey'])
      } else {
        this.initData()
      }
    },
    showForm(item) {
      if (window.bpmnInstances.modeler) {
        window.bpmnInstances.modeling.updateProperties(window.bpmnInstances.modeler, {
          'camunda:formKey': 'camunda-forms:deployment:' + item.docName,
        })
        this.formShow = true
        this.formContent = item
      }
    },
    Adddraft() {
      const newConvert = new X2JS()
      let formIds = ''
      this.bpmnModeler
        .saveXML({
          format: true,
        })
        .then(({ xml }) => {
          const { definitions } = newConvert.xml2js(xml)
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
          switch (this.dataType) {
            case 'enabled':
              // formData.append('id', this.$refs.ProcessInformation.postData.id)
              formData.append('processId', this.$refs.ProcessInformation.postData.id)
              break
            case 'drafted':
              formData.append('processId', this.$refs.ProcessInformation.postData.processId)
              formData.append('id', this.$refs.ProcessInformation.postData.id)
              break
            default:
              break
          }
          // formData.append('createTime', new Date())
          formData.append('createBy', this.userInfo.account)
          formData.append('deployKey', Date.parse(new Date()))
          formData.append('deployName', this.$refs.ProcessInformation.postData.deployName)
          formData.append('formIds', formIds)
          formData.append('operatorId', '1')
          formData.append('operatorName', 'admin')
          formData.append('processFile', file1)
          if (this.$refs.ProcessInformation.postData.systemType) {
            formData.append('systemType', this.$refs.ProcessInformation.postData.systemType)
          } else {
            formData.append('systemType', this.$refs.ProcessInformation.postData.business)
          }

          // formData.append('processResource', '')
          formData.append('tenantId', this.tenantId)
          if (this.dataType === 'enabled') {
            postProcessDraft(formData).then((res) => {
              this.$message.success('保存成功')
              this.dialogVisible2 = false
              this.$emit('addDraftSuccess')
            })
          } else {
            putProcessDraft(formData).then((res) => {
              this.$message.success('保存成功')
              this.dialogVisible2 = false
              this.$emit('addDraftSuccess')
            })
          }
        })
    },
    getFormData(formKey) {
      if (formKey) {
        let docName = formKey.split(':')[2]
        designFormDesignServiceAll({
          status: 'enabled',
          tenantId: this.tenantId,
          ascription: this.$refs.ProcessInformation.postData.ascription,
          business: this.firstData.business,
          createBy: '',
          numberCode: '',
          name: '',
          docName: docName,
        }).then((res) => {
          this.formContent = res.result[0]
          this.formOBKey++
          this.formShow = true
        })
      } else {
        this.formContent = ''
        this.formShow = false
      }
    },
    removeForm() {
      if (window.bpmnInstances.modeler) {
        window.bpmnInstances.modeling.updateProperties(window.bpmnInstances.modeler, {
          'camunda:formKey': '',
        })
        this.formShow = false
        this.formContent = ''
      }
    },
    formListFun(item) {
      let content = JSON.parse(item.content)
      let list = content.list
      for (const formItem of list) {
        if (formItem.columns && formItem.columns.length) {
          for (const formItemElement of formItem.columns) {
            for (const formItemElementElement of formItemElement.list) {
              formItemElementElement.disabled = true
            }
          }
        } else {
          if (Object.keys(formItem).includes('disabled')) {
            formItem.disabled = true
          } else {
          }
        }
      }
      return list
    },
    configFun(item) {
      return JSON.parse(item.content).config
    },
  },
  components: {
    ProcessInformation,
    formOB,
    preview,
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
