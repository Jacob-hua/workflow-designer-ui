<template>
  <el-select v-model="value" placeholder="请选择" >
    <el-option
      v-for=" item in options"
      :key="item[dropDownKey]"
      :label="item[dropDownLabel]"
      :value="item[dropDownValue]"
    >
       <long-text :content="item[dropDownLabel]" />
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
    dropDownKey: {
      type: String,
       default: 'id'
    },
    dropDownLabel: {
      type: String,
      default: 'name'
    },
    dropDownValue: {
      type: String,
       default: 'id'
    },
  },
  data() {
    return {}
  },
}
</script>
