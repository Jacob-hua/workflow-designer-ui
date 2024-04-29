<template>
  <div>
    <el-dialog
      :title="title"
      :visible="visible"
      @close="onCancel"
      :close-on-click-modal="false"
      :append-to-body="true"
      :close-on-press-escape="false"
    >
      <el-skeleton v-if="isLoading" />
      <div v-else>
        <div class="form-preview">
          <preview
            v-if="formShow"
            :itemList="formContent.list"
            :formConf="formContent.config"
            :context="context"
            :processInstanceId="processInstanceId"
            :uploadFun="uploadFileFun.bind(this)"
            :downloadFun="downloadFileFun.bind(this)"
            :beforeDeleteFileFun="beforeDeleteFileFun.bind(this)"
            ref="preview"
          ></preview>
        </div>
        <div v-if="!formShow" class="dialog-message">
          当前流程无启动项,是否继续？
        </div>
      </div>
      <span slot="footer">
        <el-button
          class="submit-button"
          :loading="isSubmitting"
          @click="onSubmit"
          >立即撤回</el-button
        >
        <el-button class="cancel-button" @click="onCancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { putRevokeTask } from "@/api/unit/api.js";
import { uploadFile, downloadFile } from "@/api/globalConfig.js";
import preview from "@/plugin/FormDesign/component/preview";

export default {
  name: "RuntimeRevokeTicket",
  components: {
    preview,
  },
  props: {
    title: {
      type: String,
      default: "配置项",
    },
    visible: {
      type: Boolean,
      default: true,
    },
    startFormContent: {
      type: Object,
      default: () => {},
    },
    context: {
      type: Object,
      default: () => {},
    },
    processInstanceId: {
      type: String,
      required: true,
    },
    revokeReason: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isSubmitting: false,
      isLoading: false,
      attachmentIds: [],
      formContent: {
        list: [],
        data: {},
        config: {},
      },
      formShow: false,
    };
  },
  computed: {
    ...mapState("account", ["tenantId", "userInfo"]),
    isEmptyConfig() {
      return !Object.prototype.hasOwnProperty.call(this.formContent, "fields");
    },
  },
  watch: {
    startFormContent(startForm) {
      if (startForm.list.length) {
        this.formShow = true;
      } else {
        this.formShow = false;
      }
    },
    visible(visible) {
      if (!visible) return;
      const config = {
        ...this.startFormContent.config,
        disabled: false,
        readOnly: false,
      };
      this.formContent = { ...this.startFormContent, config };
    },
  },
  methods: {
    onCloseModal() {
      if (this.formShow) {
        this.startConfigList = [];
        this.$refs.preview.resetFields();
      }
      this.$emit("close");
    },
    async uploadFileFun({ name, raw: file }) {
      const uploadParameters = new FormData();
      uploadParameters.append("file", file);
      uploadParameters.append("fileName", name);
      const { errorInfo, result } = await uploadFile(uploadParameters);
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg);
        return;
      }
      this.attachmentIds.push(result);
      return result;
    },
    async downloadFileFun({ url }) {
      return await downloadFile({
        contentId: url,
      });
    },
    beforeDeleteFileFun({ attachmentId }) {
      try {
        Array.prototype.splice.call(
          this.attachmentIds,
          this.attachmentIds.findIndex((value) => value === attachmentId)
        );
        return true;
      } catch (error) {
        return false;
      }
    },
    async onSubmit() {
      let _this = this;
      try {
        _this.isSubmitting = true;
        let formData = [];
        let startFormData = JSON.stringify({ list: [], data: {} });
        if (this.formShow) {
          const preview = await _this.$refs.preview.submit();
          formData = preview.formData;
          startFormData = JSON.stringify({
            ..._this.formContent,
            data: { ...formData },
          });
        }
        const { errorInfo } = await putRevokeTask({
          redo: true,
          userId: _this.userInfo.account,
          processInstanceId: _this.processInstanceId,
          message: _this.revokeReason,
          variables: { ...formData },
          startFormData: startFormData,
        });
        if (errorInfo.errorCode) {
          _this.$message.error(errorInfo.errorMsg);
          _this.$emit("submit", false);
          return;
        }
        _this.$message({
          type: "success",
          message: "撤回成功",
        });
        _this.$emit("submit", true);
        _this.onCloseModal();
      } catch (error) {
        _this.$emit("submit", false);
      } finally {
        _this.isSubmitting = false;
      }
    },
    onCancel() {
      this.onCloseModal();
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .el-dialog {
  @include formDialog;
  width: 50vw;
  max-height: 70vh;

  .el-dialog__body {
    height: 100%;
    overflow: auto;
  }
}

.dialog-message {
  margin: 20px 20px;
  font-size: 14px;
  color: $font-color;
}

.submit-button {
  @include primaryBtn;
}

.cancel-button {
  @include cancelBtn;
}
</style>
