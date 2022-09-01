<template>
  <el-select
    v-model="selected"
    @change="changeProduct"
    placeholder="请选择"
    clearable
  >
    <el-option
      v-for="item in options"
      :key="item[key]"
      :label="item[label]"
      :value="item[value]"
    >
      <long-text :content="item[label]" />
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
      type: Array,
    },
    key: {
      type: String,
    },
    label: {
      type: String,
    },
    value: {
      type: String,
    },
    requestConfig: {
      type: Object,
    },
  },
  data() {
    return {
      selected: "",
    };
  },
  mounted() {
    if (this.requestConfig.id) {
      this.selected = this.requestConfig.id;
    }
  },
  methods: {
    changeProduct() {
      this.$emit("selectedChange", this.selected);
    },
  },
};
</script>
