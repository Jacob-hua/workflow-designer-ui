<template>
  <div>
    <el-drawer :title="title"
               :visible="visible"
               :before-close="onCloseDrawer"
               direction="rtl">
      <el-form :model="listenerForm"
               :rules="listenerRules"
               ref="listenerForm">
        <el-form-item label="事件类型"
                      prop="eventType">
          <el-select v-model="listenerForm.eventType">
            <el-option v-for="({label, value}, index) in eventTypeOptions"
                       :key="index"
                       :label="label"
                       :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监听器类型"
                      prop="listenerType">
          <el-select v-model="listenerForm.listenerType">
            <el-option v-for="({label, value}, index) in listenerTypeOptions"
                       :key="index"
                       :label="label"
                       :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="listenerTypeIs('class')"
                      label="Java类"
                      prop="class">
          <el-input v-model="listenerForm.class" />
        </el-form-item>
        <el-form-item v-if="listenerTypeIs('expression')"
                      label="表达式"
                      prop="expression">
          <el-input v-model="listenerForm.expression" />
        </el-form-item>
        <el-form-item v-if="listenerTypeIs('delegateExpression')"
                      label="代理表达式"
                      prop="delegateExpression">
          <el-input v-model="listenerForm.delegateExpression" />
        </el-form-item>
        <template v-if="listenerTypeIs('script')">
          <el-form-item label="脚本格式"
                        prop="scriptFormat">
            <el-input v-model="listenerForm.scriptFormat" />
          </el-form-item>
          <el-form-item label="脚本类型"
                        prop="scriptType">
            <el-select v-model="listenerForm.scriptType">
              <el-option v-for="({label, value}, index) in scriptTypeOptions"
                         :key="index"
                         :label="label"
                         :value="value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="scriptTypeIs('inline')"
                        label="脚本内容"
                        prop="scriptValue">
            <el-input v-model="listenerForm.scriptValue" />
          </el-form-item>
          <el-form-item v-if="scriptTypeIs('outside')"
                        label="资源地址"
                        prop="resource">
            <el-input v-model="listenerForm.resource" />
          </el-form-item>
        </template>
        <template v-if="eventTypeIs('timeout')">
          <el-form-item label="定时器类型"
                        prop="timerType">
            <el-select v-model="listenerForm.timerType">
              <el-option v-for="({label, value}, index) in timerTypeOptions"
                         :key="index"
                         :label="label"
                         :value="value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="timerTypeIsNotNull()"
                        label="定时器"
                        prop="timer">
            <el-input v-model="listenerForm.timer" />
          </el-form-item>
        </template>
        <template>
          <div>
            <span>注入字段</span>
            <el-button size="mini"
                       type="primary"
                       @click="openListenerFieldForm(null)">添加字段</el-button>
          </div>
          <el-table size="mini"
                    max-height="240"
                    border
                    fit
                    style="flex: none">
            <el-table-column label="序号"
                             width="50px"
                             type="index" />
            <el-table-column label="字段名称"
                             min-width="100px"
                             prop="name" />
            <el-table-column label="字段类型"
                             min-width="80px"
                             show-overflow-tooltip
                             :formatter="row => fieldTypeObject[row.fieldType]" />
            <el-table-column label="字段值/表达式"
                             min-width="100px"
                             show-overflow-tooltip
                             :formatter="row => row.string || row.expression" />
            <el-table-column label="操作"
                             width="100px">
              <template slot-scope="{ row, $index }">
                <el-button size="mini"
                           type="text"
                           @click="openListenerFieldForm(row, $index)">编辑</el-button>
                <el-divider direction="vertical" />
                <el-button size="mini"
                           type="text"
                           style="color: #ff4d4f"
                           @click="removeListenerField(row, $index)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-form-item>
          <el-button @click="onClickCancel">取消</el-button>
          <el-button type="primary"
                     @click="onClickSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <el-dialog title="字段配置"
               :visible.sync="listenerFieldFormModelVisible"
               width="600px"
               append-to-body
               destroy-on-close>
      <el-form :model="listenerFieldForm"
               size="mini"
               label-width="96px"
               ref="listenerFieldFormRef"
               style="height: 136px"
               @submit.native.prevent>
        <el-form-item label="字段名称："
                      prop="name"
                      :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-input v-model="listenerFieldForm.name"
                    clearable />
        </el-form-item>
        <el-form-item label="字段类型："
                      prop="fieldType"
                      :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-select v-model="listenerFieldForm.fieldType">
            <el-option v-for="({label, value}, index) in fieldTypeOptions"
                       :key="index"
                       :label="label"
                       :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="listenerFieldForm.fieldType === 'string'"
                      label="字段值："
                      prop="string"
                      key="field-string"
                      :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-input v-model="listenerFieldForm.string"
                    clearable />
        </el-form-item>
        <el-form-item v-if="listenerFieldForm.fieldType === 'expression'"
                      label="表达式："
                      prop="expression"
                      key="field-expression"
                      :rules="{ required: true, trigger: ['blur', 'change'] }">
          <el-input v-model="listenerFieldForm.expression"
                    clearable />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button size="mini"
                   @click="listenerFieldFormModelVisible = false">取 消</el-button>
        <el-button size="mini"
                   type="primary"
                   @click="saveListenerFiled">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

function requiredRule(message) {
  return [{ required: true, trigger: ['blur', 'change'], message }]
}

export default {
  name: 'executeListenerDrawer',
  props: {
    listener: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: '标题',
    },
    visible: {
      type: Boolean,
      required: true,
    },
    onClose: {
      type: Function,
      required: true,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      listenerFieldFormModelVisible: false,
      listenerFieldForm: {},
      listenerForm: {},
      listenerRules: {
        eventType: [...requiredRule('请选择事件类型')],
        listenerType: [...requiredRule('请选择监听器类型')],
        class: [...requiredRule('请输入Java类名')],
        expression: [...requiredRule('请输入表达式')],
        delegateExpression: [...requiredRule('请输入代理表达式')],
        scriptFormat: [...requiredRule('请填写脚本格式')],
        scriptType: [...requiredRule('请选择脚本类型')],
        scriptValue: [...requiredRule('请填写脚本内容')],
        resource: [...requiredRule('请填写资源地址')],
        timer: [...requiredRule('请填写定时器配置')],
      },
    }
  },
  computed: {
    ...mapState('bpmn/config', [
      'listenerTypeOptions',
      'eventTypeOptions',
      'scriptTypeOptions',
      'timerTypeOptions',
      'fieldTypeOptions',
    ]),
  },
  watch: {
    listener(value) {
      this.listenerForm = { ...value }
    },
  },
  methods: {
    eventTypeIs(eventType) {
      return (
        this.listenerForm['eventType'] &&
        this.listenerForm['eventType'] === eventType
      )
    },
    listenerTypeIs(listenerType) {
      return (
        this.listenerForm['listenerType'] &&
        this.listenerForm['listenerType'] === listenerType
      )
    },
    scriptTypeIs(scriptType) {
      return (
        this.listenerForm['scriptType'] &&
        this.listenerForm['scriptType'] === scriptType
      )
    },
    timerTypeIsNotNull() {
      return (
        this.listenerForm['timerType'] &&
        this.listenerForm['timerType'] !== 'null'
      )
    },
    onCloseDrawer() {
      this.onClose()
      this.$refs.listenerForm['resetFields'] &&
        this.$refs.listenerForm['resetFields']()
    },
    onClickCancel() {
      this.onCloseDrawer()
    },
    onClickSubmit() {
      this.$refs.listenerForm['validate'] &&
        this.$refs.listenerForm['validate']((valid) => {
          if (!valid) {
            return
          }
          // 由于Vue的数据响应原理，当在抽屉中清空listenerForm时，传递给onSubmit的数据也会被清空
          // 所以此处必须解构this.listenerForm为新的对象，再向onSubmit传递，保证传递出去的数据不被清空
          this.onSubmit({ ...this.listenerForm })
          this.onCloseDrawer()
        })
    },
    saveListenerFiled() {},
    openListenerFieldForm(field, index) {
      this.listenerFieldFormModelVisible = true
    },
  },
}
</script>

<style>
</style>