<template>
  <div>
    <el-dialog
      title="关联表单"
      :visible="dialogVisible"
      width="70%"
      fullscreen
      custom-class="dialogVisibleEdit"
      top="1vh"
      :before-close="handleClose"
    >
      <div class="diologMain">
        <div class="diologMain-right">
          <div class="processList">
            <div
              class="processList-item"
              v-for="(item, index) in formList"
              :key="index"
            >
              <div class="processList-item-word">
                <p>表单名称:</p>
                <span>{{ item.name }}</span>
              </div>
              <div class="processList-item-word">
                <p>版本:</p>
                <span>{{ item.version }}</span>
              </div>
              <div class="processList-item-word">
                <p>创建人:</p>
                <span>{{ item.createBy == -1 ? "系统" : item.createBy }}</span>
              </div>
              <div class="processList-item-word">
                <p>创建时间:</p>
                <span>{{ item.createTime }}</span>
              </div>
              <div class="processList-item-button">
                <div class="refence" @click="open(item)">关联</div>
              </div>
            </div>
          </div>
          <el-dialog
            @close="close"
            title="表单"
            :visible.sync="dialogVisibleModal"
            :close-on-click-modal="false"
            width="35%"
            custom-class="dialogVisible1"
            append-to-body
          >
            <div class="container">
              <el-form
                ref="form"
                :rules="rules"
                label-width="80px"
                label-position="right"
                :model="postData"
              >
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
              <div class="next" @click="onSure()" type="primary">确定</div>
              <div class="cancel" @click="close">取消</div>
            </div>
          </el-dialog>
          <div class="process-page">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="getData.page"
              :page-size="getData.limit"
              layout="prev, pager, next, jumper"
              :total="getData.total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  designFormDesignServiceAll,
  postFormDesignServiceRealiseProcessData,
  associationForm,
} from "@/api/unit/api.js";
import { mapGetters, mapState } from "vuex";
import { getProjectList } from "@/api/globalConfig";
import router from "@/router";

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    projectCode: {
      type: String,
      default: "",
    },
    projectValue: {
      default: "",
    },
  },
  data() {
    return {
      rules: {
        ascription: [
          { required: true, message: "请输入资源名称", trigger: "blur" },
        ],
        business: [
          { required: true, message: "请输入资源标识", trigger: "change" },
        ],
        name: [
          { required: true, message: "请输入表单名称", trigger: "blur" },
          {
            min: 0,
            max: 100,
            message: "长度在 0 到 100 个字符",
            trigger: "blur",
          },
        ],
      },
      sysProps: {
        label: "name",
        value: "code",
        checkStrictly: true,
        emitPath: false,
      },
      dialogVisibleModal: false,
      projectOption: [],
      systemOption: [],
      postData: {
        ascription: "",
        business: "",
        name: "",
      },
      input: "",
      getData: {
        page: 1,
        limit: 10,
        total: 1,
      },
      formList: [],
    };
  },
  computed: {
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
  methods: {
    close() {
      this.dialogVisibleModal = false;
      this.$refs.form.clearValidate();
      this.$refs.form.resetFields();
    },
    deleteEmptyChildren(arr) {
      for (let i = 0; i < arr.length; i++) {
        const arrElement = arr[i];
        if (!arrElement.children.length) {
          delete arrElement.children;
          continue;
        }
        if (arrElement.children) {
          this.deleteEmptyChildren(arrElement.children);
        }
      }
    },
    handleClose() {
      this.$emit("close");
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    getFormList() {
      designFormDesignServiceAll({
        status: "enabled",
        tenantId: this.tenantId,
        currentData: {},
        ascription: "public",
        business: "",
        numberCode: "",
        name: "",
        docName: "",
      }).then((res) => {
        this.formList = res.result;
      });
    },
    onSure() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let _this = this;
          const id = "form_" + Date.parse(new Date());
          var file1 = new File([_this.currentData.content], "test.json", {
            type: "text/xml",
          });
          if (this.postData.id) {
            formData.append("sourceId", this.postData.sourceId);
            if (this.postData.status !== "enabled") {
              formData.append("id", this.postData.id);
            }
          }
          let formData = new FormData();
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
          formData.append("file", file1);
          associationForm(formData).then((res) => {
            this.$message.success("应用至项目表单成功");
            this.dialogVisibleModal = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    open(item) {
      this.currentData = item;
      this.dialogVisibleModal = true;
      this.postData.name = "";
      this.postData.business = "";
    },
  },
  mounted() {
    this.getFormList();
  },
};
</script>

<style scoped lang="scss">
/deep/ .dialogVisibleEdit {
  width: 100% !important;
}
/deep/ .el-dialog {
  @include formDialog;
}
.next {
  @include primaryBtn;
}
.cancel {
  @include cancelBtn;
}
.diologMain {
  display: flex;
}
.refence {
  cursor: pointer;
  color: #0dd5ef;
  padding-top: 15px;
  padding-left: 180px;
}
.diologMain-left {
  flex: 2;
  text-align: center;
  height: 695px;
}

.diologMain-right {
  flex: 8;
  margin-left: 20px;
  height: 695px;
  padding: 0px 20px;
}
.energyList {
  margin-top: 30px;
}
.energyList-item {
  width: 220px;
  height: 44px;
  line-height: 44px;
  border: 1px solid #000000;
  margin: 0 auto;
  cursor: pointer;
}
.checkPro {
  border-color: #0066cc;
  color: #0066cc;
}
.processList {
  height: 590px;
  overflow-y: auto;
}
.processList-item {
  width: 312px;
  height: 224px;
  background-color: #212739;
  padding: 20px 0px 0px 20px;
  position: relative;
  margin-right: 20px;
  display: inline-block;
  margin-top: 30px;
  padding-bottom: 10px;
}
.processList-item p {
  display: inline-block;
  color: #999999;
  width: 80px;
  margin-right: 15px;
}
.processList-item span {
  color: #fff;
}
.processList-item-detail {
  position: absolute;
  right: 20px;
  top: 10px;
  color: #1890ff;
  cursor: pointer;
}

.processList-item-word {
  font-size: 14px;
  color: #000000;
}
.processList-item-button {
  text-align: center;
}
.process-page {
  text-align: right;
  margin-top: 20px;
  margin-right: 20px;
}
</style>
