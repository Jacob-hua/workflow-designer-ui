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
        <el-form-item>
          <el-button @click="onClickCancel">取消</el-button>
          <el-button type="primary"
                     @click="onClickSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
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
    async onClickSubmit() {
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
  },
}
</script>

<style>
</style>