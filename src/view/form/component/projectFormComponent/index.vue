<template>
  <div>
    <el-dialog
      :title="title"
      @close="close"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible1"
    >
      <div class="guid">
        <el-form
          ref="guideForm"
          label-width="80px"
          label-position="right"
          :rules="rules4NewFormGuide"
          :model="postData"
        >
          <div class="from-item">
            <el-form-item label="应用项目" prop="ascription">
              <el-select v-model="postData.ascription" disabled>
                <el-option
                  v-for="{ id, label, value } in rootOrganizations"
                  :key="id"
                  :label="label"
                  :value="value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="from-item">
            <el-form-item label="表单类型" prop="business">
              <el-cascader
                v-model="postData.business"
                clearable
                :style="{ width: '100%' }"
                :options="rootOrganizationChildren(postData.ascription)"
                :props="cascaderProps"
              >
              </el-cascader>
            </el-form-item>
          </div>
          <div class="from-item">
            <el-form-item label="表单名称" prop="name">
              <el-input
                v-model="postData.name"
                placeholder="请输入表单名称"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="next" @click="nextDiolog()" type="primary">下一步</div>
        <div class="cancel" @click="close">取消</div>
      </div>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible2"
      fullscreen
      @close="closeForm"
      top="1vh"
      custom-class="dialogVisibleEdit"
    >
      <div class="dialogVisible2-main">
        <el-form
          ref="newOrEditForm"
          :rules="rules4NewForm"
          :model="postData"
          label-width="100px"
          label-position="right"
        >
          <div class="form-title">
            <div class="title-item">
              <el-form-item
                label="业务类型"
                class="title-item-label"
                prop="business"
              >
                <div class="title-item-main">
                  <el-input
                    :disabled="true"
                    v-model="postData.ascName"
                  ></el-input>
                  <el-input
                    v-show="false"
                    v-model="postData.ascription"
                    placeholder=""
                    :disabled="true"
                  ></el-input>
                </div>
              </el-form-item>
            </div>
            <div class="title-item">
              <el-form-item
                label="表单名称"
                class="title-item-label"
                prop="name"
              >
                <div class="title-item-main">
                  <el-input
                    v-model="postData.name"
                    placeholder=""
                    :disabled="title !== '新建表单'"
                  ></el-input>
                </div>
              </el-form-item>
            </div>
          </div>
          <div class="form-Main">
            <form-designer v-if="dialogVisible2" ref="formDesigner"></form-designer>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="next" type="primary" @click="addEnableForm()">发布</div>
        <div class="next" @click="addDraftForm()">保存</div>
        <div class="cancel" @click="dialogVisible2 = false">取消</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import formbpmn from "../formBpmn.vue";
import {
  postFormDesignService,
  putFormDesignService,
  postFormDesignServiceRealiseProcessData,
} from "@/api/unit/api.js";
import { FormEditor } from "@bpmn-io/form-js-editor";

import { mapGetters, mapState } from "vuex";

export default {
  props: {
    formStatus: {
      type: String,
      default: "enabled",
    },
    title: {
      type: String,
      default: "新建表单",
    },
    projectOption: {
      type: Array,
      default: () => {
        [];
      },
    },
    systemOption: {
      type: Array,
      default: () => {
        [];
      },
    },
    sysProps: {
      type: Object,
      default: () => {
        {
        }
      },
    },
  },
  computed: {
    isNewDraftProjectForm() {
      return this.title && this.title === "新建表单";
    },
    ...mapState("account", ["tenantId", "userInfo", "currentOrganization"]),
    ...mapState("uiConfig", ["cascaderProps"]),
    ...mapGetters("config", [
      "rootOrganizations",
      "rootOrganizationChildren",
      "rootOrganizationChildrenAndAll",
    ]),
  },
  watch: {
    "postData.ascription"(value) {
      if (value === this.currentOrganization) {
        return;
      }
      this.updateCurrentOrganization({ currentOrganization: value });
    },
    currentOrganization: {
      immediate: true,
      handler(value) {
        this.postData.ascription = value;
      },
    },
  },
  data() {
    return {
      rules4NewFormGuide: {
        ascription: [
          { required: true, message: "请选择应用项目", trigger: "blur" },
        ],
        business: [
          { required: true, message: "请选择表单类型", trigger: "change" },
        ],
        name: [
          { required: true, message: "请输入表单名称", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "表单名称长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
      },
      rules4NewForm: {
        business: [
          { required: true, message: "业务类型不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入表单名称", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "表单名称长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
      },
      dialogVisible1: false,
      dialogVisible2: false,
      postData: {
        ascriptionName: "",
        ascName: "",
        ascription: "",
        business: "",
        energy: "",
        name: "",
      },
      options: [],
      options1: [],
      formEditor: null,
      schema: {
        schemaVersion: 1,
        type: "default",
        exporter: {
          name: "form-js",
          version: "0.7.0",
        },
      },
    };
  },

  methods: {
    close() {
      this.dialogVisible1 = false;
      this.$refs.guideForm.clearValidate();
    },
    closeForm() {
      this.dialogVisible2 = false;
      this.$refs.newOrEditForm.clearValidate();
    },
    nextDiolog() {
      this.$refs["guideForm"].validate((valid) => {
        if (valid) {
          this.dialogVisible1 = false;
          this.dialogVisible2 = true;
          this.postData.ascName = this.$getMappingName(this.postData.business);
          this.$nextTick(() => {
            this.title = "新建表单";
            this.$refs.formDesigner.clear();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    addEnableForm() {
      this.$refs["newOrEditForm"].validate((valid) => {
        if (valid) {
          let formDatas = {
            list: this.$refs.formDesigner.designList,
            config: this.$refs.formDesigner.formConfig,
          };
          if (formDatas.list.length === 0) {
            this.$message.error("不允许提交空表单");
            return;
          }
          const id = "form_" + Date.parse(new Date());
          const formFile = new File([JSON.stringify(formDatas)], "form.json", {
            type: "text/json",
          });
          let formData = new FormData();
          switch (this.formStatus) {
            case "enabled":
              break;
            case "drafted":
              break;
            case "enabled-edit":
              formData.append("sourceId", this.postData.sourceId);
              break;
            case "drafted-edit":
              formData.append("id", this.postData.id);
              formData.append("sourceId", this.postData.sourceId);
              break;
            default:
              break;
          }
          if (this.postData.id) {
            formData.append("sourceId", this.postData.sourceId);
            if (this.postData.status !== "enabled") {
              formData.append("id", this.postData.id);
            }
          }
          formData.append("name", this.postData.name);
          formData.append("docName", this.postData.name + ".json");
          formData.append("docType", "json");
          formData.append("ascription", this.postData.ascription);
          formData.append("code", id);
          formData.append("business", this.postData.business);
          formData.append("status", "enabled");
          formData.append("createBy", this.userInfo.account);
          formData.append("createName", this.userInfo.name);
          formData.append("tenantId", this.tenantId);
          formData.append("file", formFile);
          postFormDesignServiceRealiseProcessData(formData).then((res) => {
            this.$message.success("发布至可用表单成功");
            this.$emit("addSuccess", "enabled");
            this.dialogVisible2 = false;
          });
        } else {
          return false;
        }
      });
    },

    addDraftForm() {
      this.$refs["newOrEditForm"].validate((valid) => {
        if (valid) {
          const formFile = new File(
            [this.$refs.formDesigner.getFormData()],
            "form.json",
            { type: "text/json" }
          );
          let formData = new FormData();
          switch (this.formStatus) {
            case "enabled":
              break;
            case "drafted":
              break;
            case "enabled-edit":
              formData.append("sourceId", this.postData.sourceId);
              break;
            case "drafted-edit":
              formData.append("id", this.postData.id);
              formData.append("sourceId", this.postData.sourceId);
              break;
            default:
              break;
          }
          if (this.postData.id) {
            formData.append("sourceId", this.postData.sourceId);
          }
          formData.append("name", this.postData.name);
          formData.append("docName", this.postData.name + ".json");
          formData.append("docType", "json");
          formData.append("ascription", this.postData.ascription);

          formData.append("business", this.postData.business);
          formData.append("status", "drafted");
          formData.append("tenantId", this.tenantId);
          formData.append("file", formFile);

          if (this.isNewDraftProjectForm || this.formStatus === "enabled") {
            formData.append("createBy", this.userInfo.account);
            const code = "form_" + Date.parse(new Date());
            formData.append("code", code);
            postFormDesignService(formData).then((res) => {
              this.$message.success("保存成功");
              this.$emit("addSuccess", "drafted");
              this.dialogVisible2 = false;
            });
          } else {
            formData.append("id", this.postData.id);
            formData.append("code", this.postData.code);
            formData.append("updateBy", this.userInfo.account);
            putFormDesignService(formData).then((res) => {
              this.$message.success("更新成功");
              this.$emit("addSuccess", "drafted");
              this.dialogVisible2 = false;
            });
          }
        } else {
          return false;
        }
      });
    },
  },
  components: {
    formbpmn,
  },
};
</script>

<style scoped lang="scss">
.next {
  @include primaryBtn;
}
.cancel {
  @include cancelBtn;
}
/deep/.dialogVisibleEdit {
  width: 100% !important;
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
.el-dialog__body {
  padding: 30px 80px;
}
.el-select,
.el-cascader {
  width: 100%;
}
.title-item {
  display: inline-block;
  margin-bottom: 20px;
}

.title-item-label {
  margin-right: 15px;
  color: white;
}

.title-item-main {
  display: inline-block;
}

.marginLeft40 {
  margin-left: 70px;
}

.form-Main {
  height: 630px;
}

.form-title #form {
  height: 100%;
  background-color: aliceblue;
}
</style>
