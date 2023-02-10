<template>
  <div v-show="props.compType === 'amap'">
    <el-form-item label="字段">
      <el-tooltip class="item" effect="dark" content="请注意,字段重复可能会导致该组件相关事件失效！" placement="left">
        <el-input class="input" v-model="props.id" @change="handlerChangeId"></el-input>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="标题">
      <el-input class="input" v-model="props.label"></el-input>
    </el-form-item>
    <el-form-item label="提示符">
      <el-input class="input" v-model="props.placeholder" placeholder="请输入提示符" />
    </el-form-item>
    <el-form-item label="标签宽度">
      <el-input-number v-model="props.labelWidth" :min="1" :max="200"></el-input-number>
    </el-form-item>
    <el-form-item label="显示标签">
      <el-switch v-model="props.showLabel" @change="handlerChangeLabel"></el-switch>
    </el-form-item>
    <el-form-item label="必填">
      <el-switch v-model="props.required"></el-switch>
    </el-form-item>
    <el-form-item label="清除">
      <el-switch v-model="props.clearable"></el-switch>
    </el-form-item>
    <el-form-item label="禁用">
      <el-switch v-model="props.disabled"></el-switch>
    </el-form-item>
    <el-form-item label="多选">
      <el-switch v-model="props.multiple" @change="multipleChange"></el-switch>
    </el-form-item>
  </div>
</template>
<script>
import { changeId } from '../mixin'

export default {
  name: 'mapConfig',
  props: ['props', 'getFormId'],
  mixins: [changeId],
  data() {
    return {
      tempOptions: [],
    }
  },
  methods: {
    close() {
      delete this.props.requestConfig
    },
    handlerChangeLabel(val) {
      this.props.labelWidth = val ? '80' : '1'
    },
    multipleChange(val) {
      this.$set(this.props, 'value', val ? [] : '')
    },
  },
}
</script>
<style lang="scss" scoped>
.input {
  width: 75%;
}
</style>
