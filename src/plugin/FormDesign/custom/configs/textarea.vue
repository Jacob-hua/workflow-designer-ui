<template>
  <div v-show="props.compType === 'textarea'">
    <el-form-item label="字段">
      <el-tooltip
        class="item"
        effect="dark"
        content="请注意,字段重复可能会导致该组件相关事件失效！"
        placement="left"
      >
        <el-input
          class="input"
          v-model="props.id"
          @change="handlerChangeId"
        ></el-input>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="标题">
      <el-input class="input" v-model="props.label"></el-input>
    </el-form-item>
    <el-form-item label="提示符">
      <el-input
        class="input"
        v-model="props.placeholder"
        placeholder="请输入提示符"
      />
    </el-form-item>
    <el-form-item label="标签宽度">
      <el-input-number
        v-model="props.labelWidth"
        :min="1"
        :max="200"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="显示标签">
      <el-switch
        v-model="props.showLabel"
        @change="handlerChangeLabel"
      ></el-switch>
    </el-form-item>
    <el-form-item label="必填">
      <el-switch v-model="props.required"></el-switch>
    </el-form-item>
    <el-form-item label="输入框行数">
      <el-input-number v-model="props.rows" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="长度限制">
      <el-input-number v-model="props.maxlength" placeholder="字符长度" />
    </el-form-item>
    <el-form-item label="输入统计">
      <el-switch v-model="props['show-word-limit']"></el-switch>
    </el-form-item>
    <el-form-item label="禁用">
      <el-switch
        v-model="props.disabled"
        @change="handlerChangeDisStatus"
      ></el-switch>
    </el-form-item>
    <el-form-item label="只读">
      <el-switch
        v-model="props.readonly"
        @change="handlerChangeReadStatus"
      ></el-switch>
    </el-form-item>
    <el-form-item label="默认值">
      <el-input class="input" v-model="props.value"></el-input>
    </el-form-item>
    <depend-value :currentField="props" @dependChange="onDependChange" />
  </div>
</template>
<script>
import { changeId } from "../mixin";
import DependValue from "./component/DependValue.vue";

export default {
  name: "inputConfig",
  props: ["props", "getFormId"],
  components: { DependValue },
  mixins: [changeId],
  methods: {
    onDependChange(dependValue) {
      this.props.dependValue = dependValue;
    },
    handlerChangeLabel(val) {
      this.props.labelWidth = val ? "80" : "1";
    },
    handlerChangeDisStatus(val) {
      this.props.readOnly = !val;
    },
    handlerChangeReadStatus(val) {
      this.props.disabled = !val;
    },
  },
};
</script>
<style scoped>
.input {
  width: 75%;
}
</style>
