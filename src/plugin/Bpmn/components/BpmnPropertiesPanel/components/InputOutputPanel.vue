<template>
  <div>
    <section>
      <div>
        <span>输入参数</span>
        <el-button size="small"
                   @click="onAddInputParameter">添加</el-button>
      </div>
      <el-collapse v-if="inputParametersIsNotEmpty"
                   accordion>
        <el-collapse-item v-for="(parameter, index) in inputParameters"
                          :key="index">
          <template slot="title">
            {{parameter.name}}
            <el-button size="small"
                       @click.stop="onRevmoveInputParameter(index)">删除</el-button>
          </template>
          <input-output-form :parameter="parameter"
                             :index="index"
                             type="inputParameter" />
        </el-collapse-item>
      </el-collapse>
    </section>
    <section>
      <div>
        <span>输出参数</span>
        <el-button size="small"
                   @click="onAddOutputParameter">添加</el-button>
      </div>
      <el-collapse v-if="outputParametersIsNotEmpty"
                   accordion>
        <el-collapse-item v-for="(parameter, index) in outputParameters"
                          :key="index">
          <template slot="title">
            {{parameter.name}}
            <el-button size="small"
                       @click.stop="onRemoveOutputParameter(index)">删除</el-button>
          </template>
          <input-output-form :parameter="parameter"
                             :index="index"
                             type="outputParameter" />
        </el-collapse-item>
      </el-collapse>
    </section>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import InputOutputForm from './InputOutputForm.vue'

export default {
  components: { InputOutputForm },
  name: 'InputOutputPanel',
  data() {
    return {
      defaultInputParameter: {
        name: 'Input',
        type: '',
        value: null,
        scriptFormat: '',
        scriptType: '',
        script: '',
        resource: '',
        listValues: [],
        mapValues: [],
      },
      defaultOutputParameter: {
        name: 'Output',
        type: '',
        value: null,
        scriptFormat: '',
        scriptType: '',
        script: '',
        resource: '',
        listValues: [],
        mapValues: [],
      },
    }
  },
  computed: {
    ...mapState('bpmn/panel', ['inputParameters', 'outputParameters']),
    inputParametersIsNotEmpty() {
      return this.inputParameters.length > 0
    },
    outputParametersIsNotEmpty() {
      return this.outputParameters.length > 0
    },
  },
  methods: {
    ...mapMutations('bpmn/panel', [
      'addInputParameter',
      'removeInputParameter',
      'addOutputParameter',
      'removeOutputParameter',
    ]),
    onAddInputParameter() {
      this.addInputParameter({
        inputParameter: { ...this.defaultInputParameter },
      })
    },
    onRevmoveInputParameter(index) {
      this.removeInputParameter({ index })
    },
    onAddOutputParameter() {
      this.addOutputParameter({
        outputParameter: { ...this.defaultOutputParameter },
      })
    },
    onRemoveOutputParameter(index) {
      this.removeOutputParameter({ index })
    },
  },
}
</script>

<style>
</style>