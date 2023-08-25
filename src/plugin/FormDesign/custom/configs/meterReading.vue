<template>
  <div v-show="props.compType === 'meterReading'">
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
    <el-form-item label="显示标签">
      <el-switch
        v-model="props.showLabel"
        @change="handlerChangeLabel"
      ></el-switch>
    </el-form-item>
    <interface-parser
      :key="props._id"
      labelName="表计API"
      :currentField="props"
      @variableChange="onMeterChange"
    />
    <el-button type="primary" @click="handleParse">解析</el-button>
    <el-divider>选择抄表范围</el-divider>
    <el-card>
      <el-tree
        :data="meterTree"
        :props="{ label: 'insName', children: 'children' }"
        show-checkbox
        @check="handleChecked"
      ></el-tree>
    </el-card>
    <el-divider>抄表内容设置</el-divider>
    <el-card>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="上次抄表数" name="previous">
          <el-form-item label="禁用">
            <el-switch v-model="props.preDisable"></el-switch>
          </el-form-item>
          <interface-parser
            :key="props._id"
            :currentField="props"
            @variableChange="onVariableChange"
          />
        </el-tab-pane>
        <el-tab-pane label="本次抄表数" name="current">
          <el-form-item label="必填">
            <el-switch v-model="props.curRequired"></el-switch>
          </el-form-item>
          <el-form-item label="必填">
            <el-switch v-model="props.curRequired"></el-switch>
          </el-form-item>
          <el-form-item label="必填">
            <el-switch v-model="props.curRequired"></el-switch>
          </el-form-item>
          <el-form-item label="时间标记">
            <el-switch v-model="props.timeFlag"></el-switch>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import { changeId } from "../mixin";
import { mapMutations } from "vuex";
import InterfaceParser from "./component/InterfaceParser.vue";
import DependValue from "./component/DependValue.vue";
import { executeApi } from "@/api/globalConfig";
export default {
  name: "meterReading",
  props: ["props", "getFormId"],
  components: {
    InterfaceParser,
    DependValue,
  },
  mixins: [changeId],
  data() {
    return {
      requestConfig: {},
      meterTree: [],
      activeName: "previous",
    };
  },
  methods: {
    ...mapMutations("form", ["addThirdPartyApi"]),
    onVariableChange(requestConfig) {
      this.props.requestConfig = requestConfig;
      this.addThirdPartyApi({ id: requestConfig.id });
    },
    handlerChangeLabel(val) {
      this.props.labelWidth = val ? "80" : "1";
    },
    onMeterChange(requestConfig) {
      this.requestConfig = requestConfig;
    },
    async handleParse() {
      const { result } = await executeApi({
        apiMark: this.requestConfig.apiMark,
        sourceMark: this.requestConfig.sourceMark,
        data: this.requestConfig.parameter,
      });
      const res = result.result;
      this.meterTree = res.DeviceTree;
    },
    handleChecked(data, checked) {
      console.log(data, "treedata");
      console.log(checked, "treecheck");
    },
  },
};
</script>
<style lang="scss">
.el-input-number__decrease,
.el-input-number__increase {
  background-color: transparent;
}
/deep/ .el-tree-node:focus > .el-tree-node__content {
  background-color: transparent !important;
}

:deep(.el-tabs__item) {
  color: #fff;
}
</style>
