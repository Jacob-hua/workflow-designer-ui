<template>
  <div v-show="props.compType === 'slider'">
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
    <el-form-item label="标签宽度">
      <el-input-number
        v-model="props.labelWidth"
        :min="1"
        :max="200"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="显示标签">
      <el-switch v-model="props.showLabel"></el-switch>
    </el-form-item>
    <el-form-item label="必填">
      <el-switch v-model="props.required"></el-switch>
    </el-form-item>

    <el-form-item label="最小值">
      <el-input-number
        @change="minChange"
        v-model="props.min"
        :min="0"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="最大值">
      <el-input-number v-model="props.max" placeholder="字符长度" />
    </el-form-item>
    <el-form-item label="步长">
      <el-input-number v-model="props.step"></el-input-number>
    </el-form-item>
    <el-form-item label="范围选择">
      <el-switch @change="rangeChange" v-model="props.range"></el-switch>
    </el-form-item>
    <el-form-item label="显示断点">
      <el-switch v-model="props['show-stops']"></el-switch>
    </el-form-item>
    <el-form-item label="显示提示消息">
      <el-switch v-model="props['show-tooltip']"></el-switch>
    </el-form-item>
    <el-form-item label="禁用">
      <el-switch v-model="props.disabled"></el-switch>
    </el-form-item>
    <el-form-item v-if="!props.range" label="默认值">
      <el-input-number :min="props.min" :max="props.max" class="input" v-model="props.value"></el-input-number>
    </el-form-item>
    <template v-else>
      <el-form-item label="默认起始值">
        <el-input-number class="input" v-model="props.value[0]"></el-input-number>
      </el-form-item>
      <el-form-item label="默认值终止值">
        <el-input-number class="input" v-model="props.value[1]"></el-input-number>
      </el-form-item>
    </template>
  </div>
</template>
<script>
import { changeId } from "../mixin";
export default {
  name: "inputConfig",
  props: ["props", "getFormId"],
  components: {},
  mixins: [changeId],
  data() {
    return {
      defaultValue: [],
    };
  },
  watch: {
   'props.value': function (value) {
      this.checkDefaultValue(value);
    },
  },
  methods: {
    checkDefaultValue(defaultValue) {
      if (defaultValue[0] < this.props.min || defaultValue[0] > this.props.max)
        defaultValue[0] = this.props.min;
      if (defaultValue[1] > this.props.max) defaultValue[1] = this.props.max;
      this.props.value = defaultValue;
    },
    minChange(minValue) {
      if (this.props.range) {
        this.defaultValue[0] = minValue;
      }
    },
    rangeChange(isRange) {
      if (isRange) {
        this.props.value = [this.props.min, this.props.max];
      } else {
        this.props.value = this.props.min;
      }
    },
  },
  mounted() {},
};
</script>
<style scoped>
.input {
  width: 75%;
}
</style>
