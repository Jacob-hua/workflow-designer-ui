<template>
  <div class="input-output-wrapper">
    <section v-for="({ title, type, parameters }, index) in parameterTypes" :key="index">
      <div class="title-wrapper">
        <div class="title-mark"></div>
        <span>{{ title }}</span>
        <el-button type="primary" @click="onAddParameter(type)">新建参数</el-button>
      </div>
      <el-table :data="parameters">
        <el-table-column prop="name" label="变量名" />
        <el-table-column prop="type" label="变量类型" :formatter="variableTypeLabel" />
        <el-table-column label="操作" width="90px">
          <template slot-scope="{ $index }">
            <el-button size="mini" type="text" @click="onEditParameter(type, $index)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button size="mini" type="text" style="color: #ff4d4f" @click="onRemoveParameter(type, $index)"
              >移除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </section>
    <input-output-drawer
      :namespace="namespace"
      :title="drawerTitle"
      :parameter="parameter"
      :visible="drawerVisible"
      :onClose="onDrawerClose"
      :onSubmit="onDrawerSubmit"
    />
  </div>
</template>

<script>
import InputOutputDrawer from './InputOutputDrawer.vue'

export default {
  name: 'InputOutputPanel',
  components: { InputOutputDrawer },
  props: {
    namespace: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      type: 'inputParameter',
      drawerVisible: false,
      editIndex: null,
      parameter: {},
      parameterConfig: {
        inputParameter: {
          type: 'inputParameter',
          title: '输入参数',
          defaultParameter: {
            name: '',
            type: '',
            value: null,
            scriptFormat: '',
            scriptType: '',
            scriptValue: '',
            scriptResource: '',
            listValues: [],
            mapValues: [],
          },
        },
        outputParameter: {
          type: 'outputParameter',
          title: '输出参数',
          defaultParameter: {
            name: '',
            type: '',
            value: null,
            scriptFormat: '',
            scriptType: '',
            scriptValue: '',
            scriptResource: '',
            listValues: [],
            mapValues: [],
          },
        },
      },
    }
  },
  computed: {
    inputParameters() {
      return this.$store.state[this.namespace].panel.inputParameters
    },
    outputParameters() {
      return this.$store.state[this.namespace].panel.outputParameters
    },
    findInputParameterByIndex() {
      return this.$store.getters[`${this.namespace}/panel/findInputParameterByIndex`]
    },
    findOutputParameterByIndex() {
      return this.$store.getters[`${this.namespace}/panel/findOutputParameterByIndex`]
    },
    variableTypeLabel() {
      return this.$store.getters[`${this.namespace}/config/variableTypeLabel`]
    },
    parameterTypes() {
      const parameters = {
        inputParameter: this.inputParameters,
        outputParameter: this.outputParameters,
      }
      Object.values(this.parameterConfig).forEach((parameter) => {
        parameter.parameters = parameters[parameter.type]
      })
      return Object.values(this.parameterConfig)
    },
    drawerTitle() {
      return this.parameterConfig[this.type].title
    },
    defaultParameter() {
      return this.parameterConfig[this.type]['defaultParameter']
    },
    addParameter() {
      const addParameters = {
        inputParameter: this.addInputParameter,
        outputParameter: this.addOutputParameter,
      }
      return addParameters[this.type]
    },
    updateParameter() {
      const updateParameters = {
        inputParameter: this.updateInputParameter,
        outputParameter: this.updateOutputParameter,
      }
      return updateParameters[this.type]
    },
    removeParameter() {
      const removeParameters = {
        inputParameter: this.removeInputParameter,
        outputParameter: this.removeOutputParameter,
      }
      return removeParameters[this.type]
    },
    findParameterByIndex() {
      const findParameters = {
        inputParameter: this.findInputParameterByIndex,
        outputParameter: this.findOutputParameterByIndex,
      }
      return findParameters[this.type]
    },
  },
  methods: {
    addInputParameter(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/addInputParameter`,
        ...payload,
      })
    },
    updateInputParameter(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/updateInputParameter`,
        ...payload,
      })
    },
    removeInputParameter(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/removeInputParameter`,
        ...payload,
      })
    },
    addOutputParameter(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/addOutputParameter`,
        ...payload,
      })
    },
    updateOutputParameter(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/updateOutputParameter`,
        ...payload,
      })
    },
    removeOutputParameter(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/removeOutputParameter`,
        ...payload,
      })
    },
    onEditParameter(type, index) {
      this.type = type
      this.editIndex = index
      this.parameter = this.findParameterByIndex(index)
      this.drawerVisible = true
    },
    onRemoveParameter(type, index) {
      this.type = type
      this.removeParameter({ index })
    },
    onAddParameter(type) {
      this.type = type
      this.editIndex = null
      this.drawerVisible = true
    },
    onDrawerClose() {
      this.parameter = this.defaultParameter
      this.drawerVisible = false
    },
    onDrawerSubmit(parameter) {
      if (this.editIndex === null) {
        this.addParameter({ parameter })
      } else {
        this.updateParameter({
          index: this.editIndex,
          newParameter: parameter,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../index.scss';

.input-output-wrapper {
  & > section {
    margin-bottom: 20px;
  }
}
</style>
