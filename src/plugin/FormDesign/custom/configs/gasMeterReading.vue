<template>
  <div v-show="props.compType === 'gasMeterReading'">
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
      <el-input size="small" v-model="props.label" />
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
      :currentField="props.meterTreeConfig"
      @variableChange="onMeterChange"
    />
    <el-button type="primary" @click="handleParse">解析</el-button>
    <el-divider>选择抄表范围</el-divider>
    <el-card>
      <el-tree
        :data="meterTree"
        :props="{ label: 'insName', children: 'children', id: 'insCode' }"
        show-checkbox
        :default-checked-keys="props.defaultCheckedKeys"
        node-key="id"
        @check="handleChecked"
        @check-change="handleCheckChange"
      ></el-tree>
    </el-card>
    <el-divider>单价API设置</el-divider>
    <el-card class="setting-box">
      <interface-parser
            :key="props._id"
            :currentField="props"
            @variableChange="onVariableChange"
          />
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
      activeName: "previous",
      flagId: null,
      devList: [],
      nameString: "",
      hasIn: false,
      meterTree: []
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
      this.props.meterTreeConfig.requestConfig = requestConfig;
    },
    async handleParse() {
      const { result } = await executeApi({
        apiMark: this.props.meterTreeConfig.requestConfig.apiMark,
        sourceMark: this.props.meterTreeConfig.requestConfig.sourceMark,
        data: this.props.meterTreeConfig.requestConfig.parameter,
      });
      const res = result.result;
      this.meterTree = res.DeviceTree;
    },
    handleChecked(data, checked) {
      if (this.hasIn) {
        this.hasIn = false;
        return;
      }
      const halfCheckedNodes = checked.halfCheckedNodes;
      let nameStr = halfCheckedNodes[0].insName;
      for (let i = 1; i < halfCheckedNodes.length; i++) {
        nameStr = `${nameStr}-${halfCheckedNodes[i].insName}`;
      }
      
      this.props.value.meterList.push({
        flagId: this.flagId,
        nameString: nameStr + this.nameString,
        devList: this.devList,
      });
      this.flagId = null;
      (this.nameString = ""), (this.devList = []);
    },
    handleCheckChange(data, checked, immediate) {
      if (checked) {
        this.props.defaultCheckedKeys.push(data.id);
        if (data.type === "dev") {
          let index = this.props.value.meterList.findIndex(
            ({ flagId }) => flagId === data.parentId
          );
          if (index !== -1) {
            this.hasIn = true;
            this.props.value.meterList[index].devList.push(data);
            this.props.deviceInstanceCodeList.push(data.insCode);
            return;
          }
          this.flagId = data.parentId;
          this.devList.push(data);
          this.props.deviceInstanceCodeList.push(data.insCode);
        } else {
          this.nameString = `${this.nameString}-${data.insName}`;
        }
      } else {
        if (immediate) {
          let cancleIndex = this.props.defaultCheckedKeys.findIndex(id => id === data.id);
          if(cancleIndex !== -1){
            this.props.defaultCheckedKeys.splice(cancleIndex,1);
          }
          return;
        };
        if(data.type !== 'dev') return;
        let value = this.props.value.meterList;
        let index = value.findIndex(({ flagId }) => flagId === data.parentId);
        // console.log(index);
        let deviceList = value[index].devList;
        let deviceIndex = deviceList.findIndex(({ id }) => id === data.id);
        this.props.value.meterList[index].devList.splice(deviceIndex, 1);
        let insCodeIndex = this.props.deviceInstanceCodeList.findIndex((code) => code === data.insCode);
        if(insCodeIndex !== -1) this.props.deviceInstanceCodeList.splice(insCodeIndex,1);
        this.hasIn = true;
        if(this.props.value.meterList[index].devList.length<=0){
          this.props.value.meterList.splice(index,1)
        }
      }
    },
    handlerChangeRulesType(val) {
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

.setting-box {
  /deep/ .el-tabs__item {
    color: #fff;

    &:hover {
      color: #409eff;
    }
  }
  .is-active {
    color: #409eff;
  }
  /deep/ .el-tabs__content {
    padding: 10px !important;
  }
}
</style>
