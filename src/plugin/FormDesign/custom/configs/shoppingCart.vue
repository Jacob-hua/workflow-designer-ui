<template>
  <div v-show="props.compType === 'shoppingCart'">
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
      <el-switch
        v-model="props.showLabel"
        @change="handlerChangeLabel"
      ></el-switch>
    </el-form-item>
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
    return {};
  },
  methods: {
    handlerChangeLabel(val) {
      this.props.labelWidth = val ? "80" : "1";
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
