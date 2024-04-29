<template>
  <div>
    <div>
      <span><i class="el-icon-menu"></i>消息列表</span>
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="onCreateMessage">创建新消息</el-button>
    </div>
    <el-table :data="messages" size="mini" border>
      <el-table-column type="index" label="序号" width="60px" />
      <el-table-column label="消息ID" prop="id" max-width="300px" show-overflow-tooltip />
      <el-table-column label="消息名称" prop="name" max-width="300px" show-overflow-tooltip />
      <el-table-column label="操作" width="90px">
        <template slot-scope="{ $index }">
          <el-button size="mini" type="text" @click="onEditMessage($index)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button size="mini" type="text" style="color: #ff4d4f" @click="onRemoveMessage($index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <span><i class="el-icon-menu"></i>信号列表</span>
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="onCreateSignal">创建新信号</el-button>
    </div>
    <el-table :data="signals" size="mini" border>
      <el-table-column type="index" label="序号" width="60px" />
      <el-table-column label="信号ID" prop="id" max-width="300px" show-overflow-tooltip />
      <el-table-column label="信号名称" prop="name" max-width="300px" show-overflow-tooltip />
      <el-table-column label="操作" width="90px">
        <template slot-scope="{ $index }">
          <el-button size="mini" type="text" @click="onEditSignal($index)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button size="mini" type="text" style="color: #ff4d4f" @click="onRemoveSignal($index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="modalVisible"
      :title="modalInfo.title"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="400px"
      append-to-body
      :close-on-press-escape="false"
    >
      <el-form :model="modalForm" ref="modalForm" size="mini" label-width="90px" @submit.native.prevent>
        <el-form-item
          v-for="({ label, rules, name }, index) in modalForm"
          :key="index"
          :label="label"
          :rules="rules"
          :prop="name"
        >
          <el-input v-model="modalForm[name].value" clearable />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button size="mini" type="primary" @click="onModalFormSubmit">保 存</el-button>
        <el-button size="mini" @click="onModalFormCancel">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
function requiredRule(message) {
  function validator({ message }, { value }, callback) {
    if (!value) {
      callback(new Error(message))
    } else {
      callback()
    }
  }
  return [{ required: true, validator, trigger: ['blur'], message }]
}

export default {
  name: 'SignalMessagePanel',
  props: {
    namespace: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      modalVisible: false,
      modalType: 'signal',
      modalConfig: {
        signal: {
          title: '创建新信号',
          fields: {
            id: {
              name: 'id',
              label: '信号ID',
              value: undefined,
              rules: [...requiredRule('请输入信号ID')],
            },
            name: {
              name: 'name',
              label: '信号名称',
              value: undefined,
              rules: [...requiredRule('请输入信号名称')],
            },
          },
          submit: (data, index) => {
            if (!index) {
              this.addSignal({ signal: { ...data } })
            } else {
              this.updateSignal({ index, newSignal: { ...data } })
            }
          },
          remove: (index) => {
            this.removeSignal({ index })
          },
        },
        message: {
          title: '创建新消息',
          fields: {
            id: {
              name: 'id',
              label: '消息ID',
              value: undefined,
              rules: [...requiredRule('请输入消息ID')],
            },
            name: {
              name: 'name',
              label: '消息名称',
              value: undefined,
              rules: [...requiredRule('请输入消息名称')],
            },
          },
          submit: (data, index) => {
            if (!index) {
              this.addMessage({ message: { ...data } })
            } else {
              this.updateMessage({ index, newMessage: { ...data } })
            }
          },
          remove: (index) => {
            this.removeMessage({ index })
          },
        },
      },
    }
  },
  computed: {
    messages() {
      return this.$store.state[this.namespace].panel.messages
    },
    signals() {
      return this.$store.state[this.namespace].panel.signals
    },
    findSignalByIndex() {
      return this.$store.getters[`${this.namespace}/panel/findSignalByIndex`]
    },
    findMessageByIndex() {
      return this.$store.getters[`${this.namespace}/panel/findMessageByIndex`]
    },
    modalInfo() {
      return this.modalConfig[this.modalType] ?? {}
    },
    modalForm() {
      return this.modalConfig[this.modalType].fields
    },
    modalFormData() {
      return Object.keys(this.modalForm).reduce(
        (data, formItem) => ({
          ...data,
          [formItem]: this.modalForm[formItem].value,
        }),
        {}
      )
    },
    modalFormSubmit() {
      return this.modalInfo['submit'] ?? (() => {})
    },
    removeData() {
      return this.modalInfo['remove'] ?? (() => {})
    },
  },
  methods: {
    addSignal(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/addSignal`,
        ...payload,
      })
    },
    updateSignal(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/updateSignal`,
        ...payload,
      })
    },
    removeSignal(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/removeSignal`,
        ...payload,
      })
    },
    addMessage(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/addMessage`,
        ...payload,
      })
    },
    updateMessage(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/updateMessage`,
        ...payload,
      })
    },
    removeMessage(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/removeMessage`,
        ...payload,
      })
    },
    onCreateMessage() {
      this.modalVisible = true
      this.modalType = 'message'
      this.resetModalForm()
    },
    onCreateSignal() {
      this.modalVisible = true
      this.modalType = 'signal'
      this.resetModalForm()
    },
    onModalFormCancel() {
      this.modalVisible = false
    },
    onModalFormSubmit() {
      this.$refs.modalForm['validate'] &&
        this.$refs.modalForm['validate']((valid) => {
          if (!valid) {
            return
          }
          this.modalFormSubmit(this.modalFormData)
          this.modalVisible = false
        })
    },
    resetModalForm() {
      Object.keys(this.modalForm).forEach((formItem) => {
        this.modalForm[formItem].value = undefined
      })
    },
    onEditMessage(index) {
      this.modalType = 'message'
      this.patchModalForm(this.findMessageByIndex(index))
      this.modalVisible = true
    },
    onRemoveMessage(index) {
      this.modalType = 'message'
      this.removeData(index)
    },
    onEditSignal(index) {
      this.modalType = 'signal'
      this.patchModalForm(this.findSignalByIndex(index))
      this.modalVisible = true
    },
    onRemoveSignal(index) {
      this.modalType = 'signal'
      this.removeData(index)
    },
    patchModalForm(data) {
      Object.keys(data).forEach((key) => {
        this.modalForm[key].value = data[key]
      })
    },
  },
}
</script>

<style></style>
