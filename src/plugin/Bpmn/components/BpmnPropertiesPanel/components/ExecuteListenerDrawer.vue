<template>
  <div>
    <el-drawer :title="title"
               :visible="visible"
               @close="onCloseDrawer"
               direction="rtl">
      <el-form :model="listenerForm"
               :rules="listenerFormRules"
               ref="listenerForm">
        <el-form-item label="事件类型"
                      prop="event">
          <el-select v-model="listenerForm.event">
            <el-option v-for="({label, value}, index) in eventOptions"
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
          <el-form-item label="脚本类型"
                        prop="scriptType">
            <el-select v-model="listenerForm.scriptType">
              <el-option v-for="({label, value}, index) in scriptTypeOptions"
                         :key="index"
                         :label="label"
                         :value="value" />
            </el-select>
          </el-form-item>
          <el-form-item label="脚本格式"
                        prop="scriptFormat">
            <el-input v-model="listenerForm.scriptFormat" />
          </el-form-item>
          <el-form-item v-if="scriptTypeIs('inline')"
                        label="脚本内容"
                        prop="scriptValue">
            <el-input v-model="listenerForm.scriptValue" />
          </el-form-item>
          <el-form-item v-if="scriptTypeIs('outside')"
                        label="资源地址"
                        prop="scriptResource">
            <el-input v-model="listenerForm.scriptResource" />
          </el-form-item>
        </template>
        <template v-if="eventIs('timeout')">
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
                       @click="onAddField">添加字段</el-button>
          </div>
          <el-table :data="listenerForm.fields"
                    size="mini"
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
                             prop="fieldType"
                             :formatter="fieldTypeLabel" />
            <el-table-column label="字段值"
                             min-width="100px"
                             show-overflow-tooltip
                             prop="value" />
            <el-table-column label="操作"
                             width="100px">
              <template slot-scope="{ $index }">
                <el-button size="mini"
                           type="text"
                           @click="onEditField($index)">编辑</el-button>
                <el-divider direction="vertical" />
                <el-button size="mini"
                           type="text"
                           style="color: #ff4d4f"
                           @click="onRemoveField($index)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-form-item>
          <el-button @click="onListenerFormCancel">取消</el-button>
          <el-button type="primary"
                     @click="onListenerFormSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <el-dialog title="字段配置"
               :visible.sync="fieldModalVisible"
               @close="onCloseFieldModal"
               width="600px"
               append-to-body
               destroy-on-close>
      <el-form :model="fieldForm"
               :rules="fieldFormRules"
               size="mini"
               label-width="96px"
               ref="fieldForm"
               style="height: 136px">
        <el-form-item label="字段名称"
                      prop="name">
          <el-input v-model="fieldForm.name"
                    clearable />
        </el-form-item>
        <el-form-item label="字段类型"
                      prop="fieldType">
          <el-select v-model="fieldForm.fieldType">
            <el-option v-for="({label, value}, index) in fieldTypeOptions"
                       :key="index"
                       :label="label"
                       :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="fieldTypeIs('string')"
                      label="字段值"
                      prop="value">
          <el-input v-model="fieldForm.value"
                    clearable />
        </el-form-item>
        <el-form-item v-if="fieldTypeIs('expression')"
                      label="表达式"
                      prop="value">
          <el-input v-model="fieldForm.value"
                    clearable />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button size="mini"
                   @click="onFieldFormCancel">取 消</el-button>
        <el-button size="mini"
                   type="primary"
                   @click="onFieldFormSubmit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { deepCopy } from '../../../utils/object'

function requiredRule(message) {
  return [{ required: true, trigger: ['blur', 'change'], message }]
}

export default {
  name: 'ExecuteListenerDrawer',
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
      listenerFormRules: {
        event: [...requiredRule('请选择事件类型')],
        listenerType: [...requiredRule('请选择监听器类型')],
        class: [...requiredRule('请输入Java类名')],
        expression: [...requiredRule('请输入表达式')],
        delegateExpression: [...requiredRule('请输入代理表达式')],
        scriptFormat: [...requiredRule('请填写脚本格式')],
        scriptType: [...requiredRule('请选择脚本类型')],
        scriptValue: [...requiredRule('请填写脚本内容')],
        scriptResource: [...requiredRule('请填写资源地址')],
        timer: [...requiredRule('请填写定时器配置')],
      },
      fieldModalVisible: false,
      fieldForm: {},
      fieldFormRules: {
        name: [...requiredRule('请填写字段名称')],
        fieldType: [...requiredRule('请选择字段类型')],
        value: [...requiredRule('请输入字段值')],
      },
    }
  },
  computed: {
    ...mapState('bpmn/config', [
      'listenerTypeOptions',
      'eventOptions',
      'scriptTypeOptions',
      'timerTypeOptions',
      'fieldTypeOptions',
    ]),
    ...mapGetters('bpmn/config', ['fieldTypeLabel']),
  },
  watch: {
    listener(value) {
      this.listenerForm = { ...value }
    },
  },
  methods: {
    eventIs(event) {
      return this.listenerForm['event'] && this.listenerForm['event'] === event
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
    fieldTypeIs(fieldType) {
      return (
        this.fieldForm['fieldType'] && this.fieldForm['fieldType'] === fieldType
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
    onListenerFormCancel() {
      this.onCloseDrawer()
    },
    onListenerFormSubmit() {
      this.$refs.listenerForm['validate'] &&
        this.$refs.listenerForm['validate']((valid) => {
          if (!valid) {
            return
          }
          // 由于Vue的数据响应原理，当清空listenerForm时传递给onSubmit(..)的数据也会被清空
          // 所以此处拷贝this.listenerForm为新的对象，再向onSubmit传递，保证传递出去的数据不受this.listenerForm的影响
          this.onSubmit(deepCopy(this.listenerForm))
          this.onCloseDrawer()
        })
    },
    onAddField() {
      this.fieldModalVisible = true
    },
    onCloseFieldModal() {
      this.fieldModalVisible = false
      this.fieldForm = {}
    },
    onFieldFormCancel() {
      this.onCloseFieldModal()
    },
    onFieldFormSubmit() {
      this.$refs.fieldForm['validate'] &&
        this.$refs.fieldForm['validate']((valid) => {
          if (!valid) {
            return
          }
          if (!this.listenerForm['fields']) {
            this.listenerForm['fields'] = []
          }
          // 由于Vue的数据响应原理，当清空fieldForm时传递给listenerForm的对象也会被清空
          // 所以此处拷贝this.fieldForm为新的对象，再向listenerForm中添加，保证不受到this.fieldForm的影响
          this.listenerForm['fields'].push(deepCopy(this.fieldForm))
          this.onCloseFieldModal()
        })
    },
    onEditField(index) {
      this.fieldForm =
        this.listenerForm['fields'] && this.listenerForm['fields'][index]
      this.fieldModalVisible = true
    },
    onRemoveField(index) {
      if (this.listenerForm['fields'] && this.listenerForm['fields'][index]) {
        this.listenerForm['fields'].splice(index, 1)
      }
    },
  },
}
</script>

<style>
</style>