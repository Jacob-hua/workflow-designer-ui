<template>
  <div v-show="props.compType === 'select'">
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
    <el-form-item label="提示符">
      <el-input
        class="input"
        v-model="props.placeholder"
        placeholder="请输入提示符"
      />
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
    <el-form-item label="必填">
      <el-switch v-model="props.required"></el-switch>
    </el-form-item>
    <el-form-item label="清除">
      <el-switch v-model="props.clearable"></el-switch>
    </el-form-item>
    <el-form-item label="禁用">
      <el-switch v-model="props.disabled"></el-switch>
    </el-form-item>
    <el-form-item label="多选">
      <el-switch v-model="props.multiple" @change="multipleChange"></el-switch>
    </el-form-item>
    <el-form-item label="折叠" v-show="props.multiple">
      <el-switch v-model="props['collapse-tags']"></el-switch>
    </el-form-item>
    <el-form-item label="搜索">
      <el-switch v-model="props.filterable"></el-switch>
    </el-form-item>
    <el-form-item label="允许创建">
      <el-switch v-model="props.allowCreate"></el-switch>
    </el-form-item>
    <el-form-item label="默认首选项">
      <el-switch v-model="props.defaultFirstOption"></el-switch>
    </el-form-item>
    <el-form-item label="默认值">
      <el-input
        class="input"
        :value="setValue(props.value)"
        placeholder="请输入默认值"
        @input="onValueInput"
      />
    </el-form-item>
    <depend-value :currentField="props" @dependChange="onDependChange" />
    <el-form-item label="选项配置">
      <el-radio-group v-model="props.dataType" @change="handlerChangeDataType">
        <el-radio-button label="static">静态数据</el-radio-button>
        <el-radio-button label="dynamic">动态数据</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-divider>选项</el-divider>
    <div v-show="props.dataType === 'static'">
      <draggable :list="props.options" handle=".option-drag">
        <div
          v-for="(item, index) in props.options"
          :key="index"
          class="select-item"
        >
          <div class="select-line-icon option-drag">
            <i class="el-icon-s-operation" />
          </div>
          <el-input v-model="item.label" placeholder="选项名" size="small" />
          <el-input
            placeholder="选项值"
            size="small"
            :value="item.value"
            @input="setOptionValue(item, $event)"
          />
          <div
            class="close-btn select-line-icon"
            @click="props.options.splice(index, 1)"
          >
            <i class="el-icon-remove-outline" />
          </div>
        </div>
      </draggable>
      <div style="margin-left: 20px">
        <el-button
          style="padding-bottom: 0"
          icon="el-icon-circle-plus-outline"
          type="text"
          @click="addSelectItem"
        >
          添加选项
        </el-button>
      </div>
    </div>
    <interface-parser
      v-if="props.dataType === 'dynamic'"
      :key="props._id"
      :currentField="props"
      @variableChange="onVariableChange"
      @close="close"
    />
  </div>
</template>
<script>
import { changeId } from "../mixin";
import draggable from "vuedraggable";
import { mapMutations } from "vuex";
import InterfaceParser from "./component/InterfaceParser.vue";
import DependValue from "./component/DependValue.vue";

export default {
  name: "inputConfig",
  props: ["props", "getFormId"],
  components: {
    draggable,
    InterfaceParser,
    DependValue,
  },
  mixins: [changeId],
  data() {
    return {
      tempOptions: [],
    };
  },
  methods: {
    ...mapMutations("form", ["addThirdPartyApi"]),
    onDependChange(dependValue) {
      this.props.dependValue = dependValue;
    },
    onVariableChange(requestConfig) {
      this.props.requestConfig = requestConfig;
      this.addThirdPartyApi({ id: requestConfig.id });
    },
    close() {
      delete this.props.requestConfig
    },
    handlerChangeLabel(val) {
      this.props.labelWidth = val ? "80" : "1";
    },
    setValue(val) {
      if (Array.isArray(val)) {
        return val.join(",");
      }
      if (["string", "number"].includes(typeof val)) {
        return val;
      }
      if (typeof val === "boolean") {
        return `${val}`;
      }
      return val;
    },
    onValueInput(str) {
      if (Array.isArray(this.props.value)) {
        // 数组
        this.$set(
          this.props,
          "value",
          str.split(",").map((val) => val)
        );
      } else if (["true", "false"].indexOf(str) > -1) {
        // 布尔
        this.$set(this.props, "value", JSON.parse(str));
      } else {
        // 字符串和数字
        this.$set(this.props, "value", str);
      }
    },
    setOptionValue(item, val) {
      item.value = val;
    },
    addSelectItem() {
      this.props.options.push({
        label: "",
        value: "",
      });
    },
    multipleChange(val) {
      this.$set(this.props, "value", val ? [] : "");
    },
    handlerChangeDataType(value) {
      if (value === "static") {
        this.props.options = [];
        this.props.options = this.tempOptions;
      } else {
        this.tempOptions = this.props.options;
        this.props.options = [];
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.input {
  width: 75%;
}
</style>
