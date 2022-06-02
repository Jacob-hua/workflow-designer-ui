<template>
  <div>
    <section v-for="({title, type, parameters}, index) in parameterTypes"
             :key="index">
      <div>
        <span><i class="el-icon-menu"></i>{{title}}</span>
        <el-button size="mini"
                   type="primary"
                   icon="el-icon-plus"
                   @click="onAddParameter(type)">新建参数</el-button>
      </div>
      <el-table :data="parameters">
        <el-table-column prop="name"
                         label="变量名" />
        <el-table-column prop="type"
                         label="变量类型"
                         :formatter="variableTypeLabel" />
        <el-table-column label="操作"
                         width="90px">
          <template slot-scope="{ $index }">
            <el-button size="mini"
                       type="text"
                       @click="onEditParameter(type, $index)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button size="mini"
                       type="text"
                       style="color: #ff4d4f"
                       @click="onRemoveParameter(type, $index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <input-output-drawer :parameter="parameter"
                         :visible="drawerVisible"
                         :onClose="onDrawerClose"
                         :onSubmit="onDrawerSubmit" />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import InputOutputDrawer from './InputOutputDrawer.vue'

export default {
  components: { InputOutputDrawer },
  name: 'InputOutputPanel',
  data() {
    return {
      type: '',
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
            script: '',
            resource: '',
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
            script: '',
            resource: '',
            listValues: [],
            mapValues: [],
          },
        },
      },
    }
  },
  computed: {
    ...mapState('bpmn/panel', ['inputParameters', 'outputParameters']),
    ...mapGetters('bpmn/panel', [
      'findInputParameterByIndex',
      'findOutputParameterByIndex',
    ]),
    ...mapGetters('bpmn/config', ['variableTypeLabel']),
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
    ...mapMutations('bpmn/panel', [
      'addInputParameter',
      'updateInputParameter',
      'removeInputParameter',
      'addOutputParameter',
      'updateOutputParameter',
      'removeOutputParameter',
    ]),
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
      if (this.editIndex !== null) {
        this.updateParameter({
          index: this.editIndex,
          newParameter: parameter,
        })
      } else {
        this.addParameter({ parameter })
      }
    },
  },
}
</script>

<style>
</style>