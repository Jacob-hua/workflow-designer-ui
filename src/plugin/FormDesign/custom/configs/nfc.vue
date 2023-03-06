<template>
  <div v-show="props.compType === 'nfc'">
    <el-form-item label="字段">
      <el-tooltip class="item" effect="dark" content="请注意,字段重复可能会导致该组件相关事件失效！" placement="left">
        <el-input class="input" v-model="props.id" @change="handlerChangeId"></el-input>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="标题">
      <el-input class="input" v-model="props.label"></el-input>
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
    <el-form-item label="禁用">
      <el-switch v-model="props.disabled"></el-switch>
    </el-form-item>
    <el-divider>NFC目标</el-divider>
    <div v-for="(item,index) in props.targetNFCs" :key="index">
      <el-input v-model="props.targetNFCs[index]" placeholder="NFC目标值" size="small" />
      <div
        class="close-btn select-line-icon"
        @click="props.targetNFCs.splice(index, 1)"
      >
        <i class="el-icon-remove-outline close-icon" />
      </div>
    </div>
    <div style="margin-left: 20px">
      <el-button
        style="padding-bottom: 0"
        icon="el-icon-circle-plus-outline"
        type="text"
        @click="addRuleItem"
      >
        添加NFC目标
      </el-button>
    </div>
  </div>
</template>
<script>
import { changeId } from '../mixin'

/**
 * nfc的配置项
 */
export default {
  name: 'inputConfig',
  props: ['props', 'getFormId'],
  mixins: [changeId],
  data() {
    return {
      val: '',
    }
  },
  methods: {
    handlerChangeLabel(val) {
      this.props.labelWidth = val ? '80' : '1'
    },

    addRuleItem(){
      this.props.targetNFCs.push('');
    }
  },
}
</script>
<style scoped>
.input {
  width: 75%;
}
.rule-item {
  padding-top: 5px;
  padding-bottom: 5px;
}
.close-btn {
  text-align: center;
}
.close-icon:hover {
  cursor: pointer;
}
.close-btn >>> .el-icon-remove-outline {
  color: 'red';
}
</style>
