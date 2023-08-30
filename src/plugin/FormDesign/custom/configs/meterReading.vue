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
      :currentField="props.meterApiConfig"
      @variableChange="onMeterChange"
    />
    <el-button type="primary" @click="handleParse">解析</el-button>
    <el-divider>选择抄表范围</el-divider>
    <el-card>
      <el-tree
        :data="props.meterTree"
        :props="{ label: 'insName', children: 'children', id: 'insCode' }"
        show-checkbox
        :default-checked-keys="props.defaultCheckedKeys"
        node-key="id"
        @check="handleChecked"
        @check-change="handleCheckChange"
      ></el-tree>
    </el-card>
    <el-divider>抄表内容设置</el-divider>
    <el-card class="setting-box">
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
          <el-form-item label="数据格式校验">
            <el-select v-model="props.datatypeRule" @change="handlerChangeRulesType">
              <el-option label="无" value="default" />
              <el-option label="数字" value="number" />
              <el-option label="数字+字母" value="numAndStr" />
            </el-select>
          </el-form-item>
          <el-form-item label="数值校验">
            <el-select v-model="props.dataRule">
              <el-option label="无" value="default" />
              <el-option label="大于" value="phone" />
              <el-option label="大于等于" value="email" />
            </el-select>
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
const datatypeRules = {
  number: { rule: "^[0-9]*$", msg: "您输入的内容不符合纯数字规则" },
  numAndStr: { rule: "^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{1,50}$", msg: "您输入的内容不符合数字+字母规则"}
};
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
    };
  },
  watch: {
    'props.value': {
      deep: true,
      handler(value){
        this.props.deviceInstanceCodeList = [];
        value.forEach(({devList}) => {
          devList.forEach(({insCode}) => this.props.deviceInstanceCodeList.push(insCode))
        });
      }
    }
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
      this.props.meterApiConfig.requestConfig = requestConfig;
    },
    async handleParse() {
      const { result } = await executeApi({
        apiMark: this.props.meterApiConfig.requestConfig.apiMark,
        sourceMark: this.props.meterApiConfig.requestConfig.sourceMark,
        data: this.props.meterApiConfig.requestConfig.parameter,
      });
      const res = result.result;
      this.props.meterTree = res.DeviceTree;
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
      
      this.props.value.push({
        flagId: this.flagId,
        nameString: nameStr + this.nameString,
        devList: this.devList,
      });
      // this.$set(this.props, 'value', this.props.meterList)
      this.flagId = null;
      (this.nameString = ""), (this.devList = []);
    },
    handleCheckChange(data, checked, immediate) {
      console.log(data, checked, immediate);
      if (checked) {
        this.props.defaultCheckedKeys.push(data.id);
        if (data.type === "dev") {
          let index = this.props.value.findIndex(
            ({ flagId }) => flagId === data.parentId
          );
          if (index !== -1) {
            this.hasIn = true;
            this.props.value[index].devList.push(data);
            return;
          }
          this.flagId = data.parentId;
          this.devList.push(data);
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
        let value = this.props.value;
        let index = value.findIndex(({ flagId }) => flagId === data.parentId);
        // console.log(index);
        let deviceList = value[index].devList;
        let deviceIndex = deviceList.findIndex(({ id }) => id === data.id);
        this.props.value[index].devList.splice(deviceIndex, 1);
        this.hasIn = true;
        if(this.props.value[index].devList.length<=0){
          this.props.value.splice(index,1)
        }
      }
    },
    handlerChangeRulesType(val) {
      // const obj = datatypeRules[val];
      // this.props.rules.push({
      //   rule: obj.rule,
      //   msg: obj.msg,
      // });
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
  .el-tabs__item {
    color: #fff;

    &:hover {
      color: #409eff;
    }
  }
  .is-active {
    color: #409eff;
  }
  .el-tabs__content {
    padding: 10px !important;
  }
}
</style>
