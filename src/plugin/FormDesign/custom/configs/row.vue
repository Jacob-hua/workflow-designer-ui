<template>
  <div v-show="props.compType === 'row'">
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
      <el-input
          size="small"
          v-model="props.title"
      />
    </el-form-item>
    <el-form-item label="栅格间隔">
      <el-input-number
        size="small"
        v-model="props.gutter"
        :min="0"
        :max="100"
      />
    </el-form-item>
    <el-form-item label="是否可折叠">
      <el-switch v-model="props.isFold"></el-switch>
    </el-form-item>
    <el-divider>列配置项</el-divider>
    <depend-value
      :currentField="props"
      needTargetValue
      @dependChange="onDependChange"
    />
    <el-form-item label="是否可复制">
      <el-switch v-model="props.isCopy"></el-switch>
    </el-form-item>
    <div
      v-for="(item, index) in props.columns"
      :key="index"
      class="select-item"
    >
      <div class="select-line-icon">
        <i class="el-icon-s-operation" />
      </div>
      <el-input-number size="normal" v-model="item.span" :min="1" :max="24" />
      <div
        class="close-btn select-line-icon"
        @click="props.columns.splice(index, 1)"
      >
        <i class="el-icon-remove-outline" />
      </div>
    </div>
    <div style="margin-left: 30px">
      <el-button
        style="padding-bottom: 0"
        icon="el-icon-circle-plus-outline"
        type="text"
        @click="handlerAddCol"
      >
        添加选项
      </el-button>
    </div>
  </div>
</template>
<script>
import { changeId } from "../mixin";
import DependValue from "./component/DependValue.vue";
export default {
  name: "rowConfig",
  props: ["props", "getFormId"],
  mixins: [changeId],
  methods: {
    onDependChange(dependValue) {
      this.props.dependValue = dependValue;
    },
    handlerAddCol() {
      const colIndex = this.props.columns + 1;
      this.props.columns.push({
        index: colIndex,
        span: 12,
        list: [],
      });
    },
  },
  components: { DependValue },
};
</script>
<style lang="scss">
.el-input-number__decrease,
.el-input-number__increase {
  background-color: transparent;
}
</style>
