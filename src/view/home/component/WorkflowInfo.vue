<template>
  <div>
    <ProcessInformation
      :processDisplayInfo="processDisplayInfo"
      :xml="xml"
      @loaded="onLoaded"
      @selectedShape="onSelectedShape"
    />
    <div class="ticket-wrapper">
      <div class="ticket-info">
        <div class="title">工单分配</div>
        <div class="content-wrapper info">
          <div>
            <span>节点名称:</span><span>{{ taskInfo.name }}</span>
          </div>
          <div>
            <span>绑定岗位:</span><span>{{ taskInfo.group }}</span>
          </div>
          <div>
            <span>绑定人员:</span><span>{{ taskInfo.assignee }}</span>
          </div>
        </div>
      </div>
      <div class="ticket-form">
        <div class="title">
          <div>工单分配-表单内容</div>
          <el-button class="remove-button" v-if="formShow && canRemoveForm" @click="onRemoveForm">移除表单</el-button>
        </div>
        <div class="content-wrapper form">
          <div v-if="formShow">
            <preview :itemList="formContent.fields" :formConf="formContent.config"></preview>
          </div>
          <span v-else> 当前未关联表单 </span>
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

<style scoped lang="scss">
.ticket-wrapper {
  display: flex;
  color: $font-color;

  .title {
    line-height: 40px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .content-wrapper {
    height: 200px;
    padding: 2px 30px;
    overflow: auto;
    border: 1px solid $border-color;
  }
}

.ticket-info {
  flex: 1;
  margin: 20px 0px 0px 20px;
}

.ticket-form {
  flex: 3;
  margin: 20px 0px 0px 20px;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: #999999;

  & > div {
    font-size: 14px;
    margin-top: 26px;
    display: flex;
    flex-direction: row;
  }

  & > div > span:first-child {
    text-align: end;
    width: 60px;
    margin-right: 20px;
  }
}

.form {
  padding: 20px 0px !important;
}

.remove-button {
  @include resetBtn;
}
</style>
