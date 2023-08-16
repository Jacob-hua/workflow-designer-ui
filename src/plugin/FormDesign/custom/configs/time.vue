<template>
  <div v-show="props.compType === 'time'">
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
      <el-input class="input" v-model="props.placeholder"></el-input>
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
    <el-form-item label="清空">
      <el-switch v-model="props.clearable"></el-switch>
    </el-form-item>
    <el-form-item label="只读">
      <el-switch v-model="props.readonly"></el-switch>
    </el-form-item>
    <el-form-item label="禁用">
      <el-switch v-model="props.disabled"></el-switch>
    </el-form-item>
    <el-form-item label="时间类型">
      <el-select
        class="input"
        v-model="props['picker-options'].format"
        @change="handlerFormatChange"
      >
        <el-option
          v-for="item in timeType"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="范围选择">
      <el-switch @change="rangeChange" v-model="props['is-range']"></el-switch>
    </el-form-item>
    <el-form-item label="分隔符" v-show="props['is-range']">
      <el-input  class="input" v-model="props['range-separator']"></el-input>
    </el-form-item>
    <el-form-item label="默认值">
      <el-time-picker
        :key="Math.random()*10"
        placeholder="选择默认时间"
        :is-range="props['is-range']"
        class="input"
        v-model="props.value"
        :editable="false"
        :value-format="props['value-format']"
        :picker-options="props['picker-options']"
        :popper-class="props['popper-class']"
      />
    </el-form-item>
  </div>
</template>
<script>
import { changeId } from "../mixin";
export default {
  name: "timeConfig",
  components: {},
  mixins: [changeId],
  props: ["props", "getFormId"],
  data() {
    return {
      timeType: [
        {
          label: '时',
          value: 'HH'
        },
        {
          label: '时分',
          value: 'HH:mm'
        },
        {
          label: '时分秒',
          value: 'HH:mm:ss'
        }
      ],
    };
  },

  methods: {
    rangeChange(isRange) {
      if(!isRange){
        this.props.value = "";
      }
      // if (isRange) {
      //   this.props.value = ["00", "23"];
      // } else {
      //   this.props.value = "";
      // }
    },
    handlerFormatChange(val){
      this.props['value-format'] = val;
      this.props['picker-options'].format = val;
      if(val === 'HH'){
        this.props['popper-class'] = 'hour-time'
      }else{
        this.props['popper-class'] = ''
      }
    }
  },
  mounted() {},
};
</script>
<style scoped lang="scss">
.input {
  width: 75%;
}

.hour-time .el-scrollbar {
  width:100% !important;
}
.hour-time .el-scrollbar:nth-of-type(2) {
  display: none !important;
}

.hour-time .el-time-spinner__wrapper {
  width:100% !important;
}
.hour-time .el-time-spinner__wrapper:nth-of-type(2) {
  display: none !important;
}
</style>
