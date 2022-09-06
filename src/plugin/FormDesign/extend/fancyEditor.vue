<template>
  <div class="edit_container" :class="{ warn_edit_container: warnTextLength }">
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    >
    </quill-editor>
    <div
      class="text_number_tips"
      :class="{ warn_text_number_tips: warnTextLength }"
    >
      {{ currentLength }}/{{ maxTextLength }}
    </div>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor,
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    max: {
      type: Number,
      default: 0,
    },
    validateMaxText: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      content: this.value,
      currentLength: 0,
      defaultMaxLength: 2000,
      editorOption: {
        placeholder: "请输入文本",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // 切换按钮
            ["blockquote", "code-block"],

            [{ header: 1 }, { header: 2 }], // 用户自定义按钮值
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }], // 上标/下标
            [{ indent: "-1" }, { indent: "+1" }], // 减少缩进/缩进
            [{ direction: "rtl" }], // 文本下划线

            [{ size: ["small", false, "large", "huge"] }], // 用户自定义下拉
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }], // 主题默认下拉，使用主题提供的值
            [{ font: [] }],
            [{ align: [] }],

            ["clean"], // 清除格式
          ],
        },
      },
    };
  },
  methods: {
    onEditorBlur(editor) {}, // 失去焦点事件
    onEditorFocus(v) {}, // 获得焦点事件
    onEditorChange(v) {
      this.currentLength = v.text.length - 1;
      this.$emit("input", this.content);
    }, // 内容改变事件
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
    maxTextLength() {
      let len = this.defaultMaxLength;
      if (this.max >= 1) {
        len = this.max;
      }
      return len;
    },
    warnTextLength() {
      const warn =
        this.validateMaxText && this.currentLength > this.maxTextLength;
      return warn;
    },
  },
  watch: {
    value(newVal) {
      this.content = newVal;
    },
  },
};
</script>

<style lang="scss">
.ql-editor {
  height: 400px;
  color: #fff;
}
.ql-snow .ql-stroke {
  stroke: #fff;
}
.ql-snow .ql-fill,
.ql-snow .ql-stroke.ql-fill {
  fill: #fff;
}
.ql-picker-label {
  color: #fff;
}
.ql-editor.ql-blank::before {
  color: #fff !important;
}
.edit_container .text_number_tips {
  float: right;
  margin-top: -30px;
  padding-right: 10px;
}
.warn_edit_container {
  border: solid 1px #f56c6c;
}
.warn_text_number_tips {
  color: #f56c6c;
}
</style>
