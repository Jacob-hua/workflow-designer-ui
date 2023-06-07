<template>
  <el-select
    v-model="selected"
    @change="changeProduct"
    placeholder="请选择"
    clearable
    @clear="clear"
  >
    <el-option
      v-for="item in options"
      :key="item[index]"
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
    index: {
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
  watch: {
    options: {
      handler(newValue) {
          if (this.requestConfig?.id) {
           if (!this.isHit(newValue)) {
             return
           }
            this.selected = this.requestConfig.id
          }
      },
      deep:true,
      immediate: true
    }
  },
  methods: {
    isHit(options) {
      return options.some(option => option.id ===String(this.requestConfig?.id))
    },
    clear() {
      this.$emit('clear')
    },
    changeProduct() {
      this.$emit("selectedChange", this.selected);
    },
  },
};
</script>
