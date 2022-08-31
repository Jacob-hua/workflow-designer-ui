<template>
  <div v-show="props.compType === 'cascader'">
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
    <el-form-item label="栅格">
      <el-input-number v-model="props.span" :min="1" :max="24" />
    </el-form-item>
    <el-form-item label="宽度">
      <el-input-number v-model="props.width" :min="0" :max="100" />%
    </el-form-item>
    <el-form-item label="提示符">
      <el-input
        class="input"
        v-model="props.placeholder"
        placeholder="请输入提示符"
      />
    </el-form-item>
    <el-form-item label="栅格间隔">
      <el-input-number v-model="props.gutter" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="标签宽度">
      <el-input-number
        v-model="props.labelWidth"
        :min="0"
        :max="200"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="显示标签">
      <el-switch
        v-model="props.showLabel"
        @change="handlerChangeLabel"
      ></el-switch>
    </el-form-item>
    <el-form-item label="大小">
      <el-radio-group v-model="props.size">
        <el-radio-button label="medium">正常</el-radio-button>
        <el-radio-button label="small">略小</el-radio-button>
        <el-radio-button label="mini">迷你</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="清除">
      <el-switch v-model="props.clearable"></el-switch>
    </el-form-item>
    <el-form-item label="禁用">
      <el-switch v-model="props.disabled"></el-switch>
    </el-form-item>
    <el-form-item label="完整路径">
      <el-switch v-model="props.props['show-all-levels']"></el-switch>
    </el-form-item>
    <el-form-item label="分隔符">
      <el-input v-model="props.props.separator"></el-input>
    </el-form-item>
    <el-form-item label="搜索">
      <el-switch v-model="props.props.filterable"></el-switch>
    </el-form-item>
    <el-form-item label="展开方式">
      <el-radio-group v-model="props.props.props.expandTrigger">
        <el-radio-button label="click">点击</el-radio-button>
        <el-radio-button label="hover">悬停</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="多选">
      <el-switch v-model="props.props.props.multiple"></el-switch>
    </el-form-item>
    <el-form-item label="任一级可选">
      <el-switch v-model="props.props.props.checkStrictly"></el-switch>
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
      <el-form-item label="静态数据">
        <el-button
          icon="el-icon-edit-outline"
          circle
          @click="handlerStaticData"
        ></el-button>
      </el-form-item>
      <el-form-item label="省市区">
        <el-checkbox
          v-model="props['china-area-data']"
          @change="handlerSetAreaData"
        />
      </el-form-item>
    </div>
    <interface-parser
      v-if="props.dataType === 'dynamic'"
      :currentField="props"
      :hasChildren="true"
      @variableChange="onVariableChange"
    />
    <el-dialog
      :visible.sync="staticDataVisible"
      width="70%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :center="true"
      top="20px"
      append-to-body
    >
      <codemirror v-model="staticOptions" :options="codeMirror" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlerSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { changeId } from "../mixin";
//引入 省市区 数据
import { areaData } from "../../utils/chinaAreaData";
import { codemirror } from "vue-codemirror";
// 核心样式
import "codemirror/lib/codemirror.css";
// 引入主题后还需要在 options 中指定主题才会生效
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import { mapMutations } from "vuex";
import InterfaceParser from "./component/InterfaceParser.vue";
import DependValue from "./component/DependValue.vue";

const options = {
  tabSize: 2, // 缩进格式
  theme: "dracula", // 主题，对应主题库 JS 需要提前引入
  lineNumbers: true, // 显示行号
  line: true,
  styleActiveLine: true, // 高亮选中行
  hintOptions: {
    completeSingle: true, // 当匹配只有一项的时候是否自动补全
  },
};
/**
 * input的配置项
 */
export default {
  name: "cascaderConfig",
  props: ["props", "itemList", "getFormId"],
  components: {
    codemirror,
    InterfaceParser,
    DependValue,
  },
  mixins: [changeId],
  data() {
    return {
      staticDataVisible: false,
      codeMirror: options,
      staticOptions: "",
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
    handlerChangeLabel(val) {
      this.props.labelWidth = val ? "80" : "1";
    },
    handlerStaticData() {
      this.staticOptions = JSON.stringify(this.props.options, null, 4);
      this.staticDataVisible = true;
    },
    handlerSave() {
      try {
        this.props.options = JSON.parse(this.staticOptions);
        this.staticDataVisible = false;
      } catch (e) {
        this.$message.warning("JSON格式有错误,请修改");
      }
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
    handlerSetAreaData(val) {
      if (val) {
        const areaoptions = areaData();
        this.tempOptions = this.props.options;
        this.props.options = areaoptions;
      } else {
        this.props.options = this.tempOptions;
      }
    },
  },
};
</script>
<style scoped></style>
