<template>
  <div v-show="props.compType === 'upload'">
    <el-form-item label="字段">
      <el-tooltip
        class="item"
        effect="dark"
        content="请注意,ID的修改可能会导致该组件相关事件失效！"
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
    <el-form-item label="宽度%">
      <el-input-number v-model="props.width" :min="1" :max="100" />
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
    <el-form-item v-show="false" label="请求地址">
      <el-input v-model="props.action"></el-input>
    </el-form-item>
    <el-form-item label="大小(MB)">
      <el-input-number
        v-model="props.fileSize"
        :min="1"
        :max="100"
        :step="10"
      />
    </el-form-item>
    <el-form-item label="允许文件类型">
      <el-input v-model="props.accept"></el-input>
    </el-form-item>
    <el-form-item label="必填">
      <el-switch v-model="props.required"></el-switch>
    </el-form-item>
    <el-form-item label="选多文件上传">
      <el-switch v-model="props.multiple"></el-switch>
    </el-form-item>
    <el-form-item label="显示文件列表">
      <el-switch v-model="props['show-file-list']"></el-switch>
    </el-form-item>
    <el-form-item label="显示类型">
      <el-radio-group @change="onSelectChange" v-model="props['list-type']">
        <el-radio-button label="text">普通</el-radio-button>
        <!-- <el-radio-button label="picture">照片</el-radio-button> -->
        <el-radio-button label="picture-card">照片</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="按钮文字">
      <el-input v-model="props.buttonText"></el-input>
    </el-form-item>
    <el-form-item label="显示提示">
      <el-switch v-model="props.showTip"></el-switch>
    </el-form-item>
    <el-form-item label="提示内容" v-show="props.showTip">
      <el-input v-model="props.tips"></el-input>
    </el-form-item>
  </div>
</template>
<script>
import { changeId } from "../mixin";
export default {
  name: "uploadConfig",
  props: ["props"],
  components: {},
  mixins: [changeId],
  data() {
    return {};
  },
  methods: {
    onSelectChange(val) {
      console.log(val);
      if (val === "text") {
        this.props.accept = ".pdf, .doc, .docx, .xls, .xlsx";
      } else {
        this.props.accept = ".png, .jpg, .jpeg, .gif, .webp";
      }
    },
    handlerChangeLabel(val) {
      this.props.labelWidth = val ? "80" : "1";
    },
  },
  mounted() {},
  watch: {},
};
</script>
<style scoped>
.input {
  width: 75%;
}
</style>
