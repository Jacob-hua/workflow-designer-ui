<template>
  <div v-show="props.compType === 'input'">
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
    <el-form-item label="只读">
      <el-switch v-model="props.readonly"></el-switch>
    </el-form-item>
    <el-form-item label="前置图标">
      <el-input
        placeholder="请选择图标"
        readonly
        v-model="props['prefix-icon']"
      >
        <template slot="append">
          <i
            class="el-icon-picture"
            style="cursor: pointer"
            @click="handlerPrefixSelectIcon"
          />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="后置图标">
      <el-input
        placeholder="请选择图标"
        readonly
        v-model="props['suffix-icon']"
      >
        <template slot="append">
          <i
            class="el-icon-picture"
            style="cursor: pointer"
            @click="handlerSuffixSelectIcon"
          />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="前缀">
      <el-input v-model="props.prepend"> </el-input>
    </el-form-item>
    <el-form-item label="后缀">
      <el-input v-model="props.append"> </el-input>
    </el-form-item>
    <el-form-item label="默认值">
      <el-input class="input" v-model="props.value"></el-input>
    </el-form-item>
    <depend-value :currentField="props" @dependChange="onDependChange" />
    <el-divider>校验</el-divider>
    <el-form-item label="验证类型">
      <el-select v-model="props.rulesType" @change="handlerChangeRulesType">
        <el-option label="无" value="default" />
        <el-option label="电话" value="phone" />
        <el-option label="座机" value="landline"></el-option>
        <el-option label="邮箱" value="email" />
        <el-option label="纯数字" value="number" />
        <el-option label="身份证" value="idcard" />
      </el-select>
    </el-form-item>
    <div v-for="(item, index) in props.rules" :key="index" class="rule-item">
      <el-input v-model="item.rule" placeholder="正则" size="small" />
      <p />
      <el-input v-model="item.msg" placeholder="自定义提示" size="small" />
      <div
        class="close-btn select-line-icon"
        @click="() => {props.rules.splice(index, 1); props.rulesType = 'default'}"
      >
        <i class="el-icon-remove-outline close-icon" />
      </div>
    </div>
    <!-- <div style="margin-left: 20px">
      <el-button
        style="padding-bottom: 0"
        icon="el-icon-circle-plus-outline"
        type="text"
        @click="addRuleItem"
      >
        添加选项
      </el-button>
    </div> -->
    <icon-dialog
      v-model="props['suffix-icon']"
      :visible.sync="iconDialogVisible_suffix"
    />
    <icon-dialog
      v-model="props['prefix-icon']"
      :visible.sync="iconDialogVisible_prefix"
    />
  </div>
</template>
<script>
import { changeId } from "../mixin";
import iconDialog from "../../component/iconDialog";
import DependValue from "./component/DependValue.vue";
const defaultRules = {
  phone: {
    rule: "^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\\d{8}$",
    msg: "您输入的电话号码不符合规则",
  },
  email: {
    rule: "\\w[-\\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\\.)+[A-Za-z]{2,14}",
    msg: "您输入的邮件地址不符合规则",
  },
  number: { rule: "^[0-9]*$", msg: "您输入的内容不符合纯数字规则" },
  idcard: {
    rule: "\\d{17}[\\d|x]|\\d{15}",
    msg: "您输入的身份证号码不符合规则",
  },
  landline: {
    rule: "^\\d{4}$|^\\d{8}$|^\\d{11}$",
    msg: "您输入的座机号码不符合规则"
  }
};
/**
 * input的配置项
 */
export default {
  name: "inputConfig",
  props: ["props", "getFormId"],
  components: {
    iconDialog,
    DependValue,
  },
  mixins: [changeId],
  data() {
    return {
      val: "",
      iconDialogVisible_suffix: false,
      iconDialogVisible_prefix: false,
    };
  },
  methods: {
    onDependChange(dependValue) {
      this.props.dependValue = dependValue;
    },
    handlerChangeLabel(val) {
      this.props.labelWidth = val ? "80" : "1";
    },
    handlerSuffixSelectIcon() {
      this.iconDialogVisible_suffix = true;
    },
    handlerPrefixSelectIcon() {
      this.iconDialogVisible_prefix = true;
    },
    // addRuleItem() {
    //   this.props.rules.push({
    //     rule: "",
    //     msg: "",
    //   });
    // },
    handlerChangeRulesType(val) {
      const obj = defaultRules[val];
      if(!obj){
        this.props.rules.splice(0,1);
        return;
      }
      this.props.rules.splice(0,1,{...obj});
    },
  },
};
</script>
<style scoped>
.input {
  width: 75%;
}
.rule-item {
  padding-top: 5px;
  padding-bottom: 5px;
}
.close-btn {
  text-align: center;
}
.close-icon:hover {
  cursor: pointer;
}
.close-btn >>> .el-icon-remove-outline {
  color: "red";
}
</style>
