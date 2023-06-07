<template>
  <div v-show="props.compType === 'formList'">
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
      <el-input size="small" v-model="props.title" />
    </el-form-item>
    <el-form-item label="左边距">
      <el-input-number
        v-model="props.labelWidth"
        :min="1"
        :max="200"
      ></el-input-number>
    </el-form-item>
    <interface-parser :key="props._id" :currentField="props" @variableChange="onVariableChange" />
    <el-form-item label="显示序号">
      <el-switch v-model="props.showIndex"></el-switch>
    </el-form-item>
    <!-- <el-form-item label="多选">
      <el-switch v-model="props.multi"></el-switch>
    </el-form-item> -->
    <el-form-item label="最大高度">
      <el-input v-model="props.height"></el-input>
    </el-form-item>
    <depend-value :currentField="props" @dependChange="onDependChange" />
    <el-divider>列配置项</el-divider>
    <div
      v-for="(item, index) in props.tableColumn"
      :key="index"
      class="select-item"
    >
      <!-- <div class="select-line-icon">
        <el-checkbox v-model="item.checked"></el-checkbox>
      </div> -->
      <!-- <el-input-number size="normal" v-model="item.span" :min="1" :max="24" /> -->
      <el-input v-model="item.label" size="small" placeholder="列名"></el-input>
      <el-input v-model="item.prop" size="small" placeholder="属性" required></el-input>
      <div
        class="close-btn select-line-icon"
        @click="props.tableColumn.splice(index, 1)"
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
        添加列
      </el-button>
    </div>
  </div>
</template>
<script>
import { changeId } from "../mixin";
import { mapMutations } from 'vuex'
import InterfaceParser from './component/InterfaceParser.vue'
import DependValue from './component/DependValue.vue'
export default {
  name: "rowConfig",
  props: ["props", "getFormId"],
  components: {
    InterfaceParser,
    DependValue
  },
  mixins: [changeId],
  methods: {
    ...mapMutations('form', ['addThirdPartyApi']),
    onDependChange(dependValue) {
      this.props.dependValue = dependValue
    },
    onVariableChange(requestConfig) {
      this.props.requestConfig = requestConfig
      this.addThirdPartyApi({ id: requestConfig.id })
    },
    handlerAddCol() {
      this.props.tableColumn.push({
        label: '',
        prop: '',
        checked:false
      });
    },
    handlerChangeLabel(val) {
      this.props.labelWidth = val ? "80" : "1";
    },
  },
};
</script>
<style lang="scss">
.el-input-number__decrease,
.el-input-number__increase {
  background-color: transparent;
}
</style>
