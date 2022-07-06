<template>
  <div>
    <div class="dialogVisible2-left">
      <div class="bpmn-Main">
        <ProcessInformation
          :processDisplayInfo="processDisplayInfo"
          :xml="xml"
          @loaded="onLoaded"
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
              <span class="formRemove" v-if="canRemoveForm" @click="onRemoveForm">移除表单</span>
              <div class="formShowForm">
                <preview :itemList="formContent.fields" :formConf="formContent.config"></preview>
              </div>
            </div>
            <span v-else class="noneForm"> 当前未关联表单 </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProcessInformation from '@/component/bpmnView/ProcessInformation.vue'
import { designFormDesignServiceAll } from '@/api/unit/api.js'
import preview from '@/plugin/FormDesign/component/preview'
import { mapState } from 'vuex'

export default {
  name: 'WorkflowInfo',
  components: {
    ProcessInformation,
    preview,
  },
  props: {
    workflow: {
      type: Object,
      default: () => ({}),
      required: true,
    },
    xml: {
      type: String,
      default: '',
      required: true,
    },
    processDisplayInfo: {
      type: Array,
      default: () => [],
    },
    canRemoveForm: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      iBpmn: {},
      taskInfo: {
        id: '',
        name: '',
        group: '',
        assignee: '',
      },
      formContent: {},
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
    formShow() {
      return Object.keys(this.formContent).length > 0
    },
  },
  watch: {
    form: {
      deep: true,
      immediate: true,
      handler(form) {
        if (!form) {
          return
        }
        this.formContent = { ...form }
      },
    },
  },
  methods: {
    onLoaded(iBpmn) {
      this.iBpmn = iBpmn
      this.$emit('canvasLoaded', iBpmn)
    },
    onSelectedShape(element, iBpmn) {
      this.iBpmn = iBpmn
      if (!element) {
        this.taskInfo = {
          id: '',
          name: '',
          group: '',
          assignee: '',
        }
        this.formContent = {}
        return
      }
      this.taskInfo.name = this.iBpmn.getSelectedShapeInfoByType('name')
      this.taskInfo.group = this.iBpmn.getSelectedShapeInfoByType('candidateGroups')
      this.taskInfo.assignee = this.iBpmn.getSelectedShapeInfoByType('assignee')
      this.fetchFormContent(this.iBpmn.getSelectedShapeInfoByType('formKey'))
    },
    onRemoveForm() {
      if (!this.iBpmn.getSelectedShape()) {
        return
      }
      this.iBpmn.updateSelectedShapeProperties({
        'camunda:formKey': '',
      })
      this.formContent = {}
      this.$emit('removeForm', this.workflow)
    },
    async fetchFormContent(formKey) {
      if (!formKey) {
        this.formContent = {}
        return
      }
      let docName = formKey.split(':')[2]
      const { errorInfo, result = [] } = await designFormDesignServiceAll({
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
      if (result[0]) {
        this.formContent = this.disableForm(result[0]).formContent
      } else {
        this.formContent = {}
      }
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
</style>
