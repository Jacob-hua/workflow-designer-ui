<template>
  <div>
    <el-drawer :title="title"
               :visible="visible"
               :before-close="onClose"
               direction="rtl">
      <el-form :model="listener"
               :rules="listenerRules"
               ref="listener">
        <el-form-item label="事件类型"
                      prop="eventType">
          <el-select v-model="listener.eventType">
            <el-option v-for="({label, value}, index) in eventTypeOptions"
                       :key="index"
                       :label="label"
                       :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监听器类型"
                      prop="listenerType">
          <el-select v-model="listener.listenerType">
            <el-option v-for="({label, value}, index) in listenerTypeOptions"
                       :key="index"
                       :label="label"
                       :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="listenerTypeIs('class')"
                      label="Java类"
                      prop="class">
          <el-input v-model="listener.class" />
        </el-form-item>
        <el-form-item v-if="listenerTypeIs('expression')"
                      label="表达式"
                      prop="expression">
          <el-input v-model="listener.expression" />
        </el-form-item>
        <el-form-item v-if="listenerTypeIs('delegateExpression')"
                      label="代理表达式"
                      prop="delegateExpression">
          <el-input v-model="listener.delegateExpression" />
        </el-form-item>
        <template v-if="listenerTypeIs('script')">
          <el-form-item label="脚本格式"
                        prop="scriptFormat">
            <el-input v-model="listener.scriptFormat" />
          </el-form-item>
          <el-form-item label="脚本类型"
                        prop="scriptType">
            <el-select v-model="listener.scriptType">
              <el-option v-for="({label, value}, index) in scriptTypeOptions"
                         :key="index"
                         :label="label"
                         :value="value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="scriptTypeIs('inline')"
                        label="脚本内容"
                        prop="scriptValue">
            <el-input v-model="listener.scriptValue" />
          </el-form-item>
          <el-form-item v-if="scriptTypeIs('outside')"
                        label="资源地址"
                        prop="resource">
            <el-input v-model="listener.resource" />
          </el-form-item>
        </template>
        <template v-if="eventTypeIs('timeout')">
          <el-form-item label="定时器类型"
                        prop="timerType">
            <el-select v-model="listener.timerType">
              <el-option v-for="({label, value}, index) in timerTypeOptions"
                         :key="index"
                         :label="label"
                         :value="value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="timerTypeIsNotNull()"
                        label="定时器"
                        prop="timer">
            <el-input v-model="listener.timer" />
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
import { mapMutations, mapState } from 'vuex'
function requiredRule(message) {
  return [{ required: true, trigger: ['blur', 'change'], message }]
}

export default {
  name: 'executeListenerDrawer',
  props: {
    id: {
      type: Number,
      default: undefined,
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
  },
  data() {
    return {
      listener: {
        id: this.id,
        eventType: '',
        listenerType: '',
        class: '',
        expression: '',
        delegateExpression: '',
        scriptFormat: '',
        scriptType: '',
        scriptValue: '',
        resource: '',
        timerType: '',
        timer: '',
      },
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
  methods: {
    ...mapMutations('bpmn', ['updateListener', 'addListener']),
    eventTypeIs(eventType) {
      return this.listener.eventType && this.listener.eventType === eventType
    },
    listenerTypeIs(listenerType) {
      return (
        this.listener.listenerType &&
        this.listener.listenerType === listenerType
      )
    },
    scriptTypeIs(scriptType) {
      return this.listener.scriptType && this.listener.scriptType === scriptType
    },
    timerTypeIsNotNull() {
      return this.listener.timerType && this.listener.timerType !== 'null'
    },
    onClickCancel() {
      this.onClose()
    },
    async onClickSubmit() {
      try {
        await this.$refs.listener.validate()
        if (this.listener.id) {
          this.updateListener(this.listener)
        } else {
          this.addListener(this.listener)
        }
        this.onClose()
      } catch (validFail) {
        return
      }
    },
  },
}
</script>

<style>
</style>