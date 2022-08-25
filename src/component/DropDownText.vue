<template>
  <el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item[this.key]"
      :label="item[this.label]"
      :value="item[this.value]"
    >
    <long-text :content="item[this.label]" />
    </el-option>
  </el-select>
</template>

<script>
import longText from "@/component/LongText.vue";

export default {
  components: {
    longText,
  },
  props: {
    options: {
      type: Array
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    key: {
      type: String
    },
    label: {
      type: String
    },
    value: {
      type: String
    },
  },
}
</script>
