<template>
  <el-select v-model="value" filterable clearable :multiple="multiple" :disabled="disabled" :placeholder="placeholder">
    <el-option v-for="({ label, value }, index) in options" :key="index" :label="label" :value="value"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'map',
  props: {
    value: Object,
    multiple: Boolean,
    disabled: Boolean,
    placeholder: String,
  },
  data() {
    return {
      options: [
        {
          label: '选项一',
          value: 1,
        },
        {
          label: '选项2',
          value: 2,
        },
      ],
    }
  },
}
</script>
