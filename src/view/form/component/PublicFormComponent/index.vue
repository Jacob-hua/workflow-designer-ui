<template>
  <div>
    <el-dialog
      :title="tit"
      fullscreen
      :visible.sync="dialogVisible2"
      width="90%"
      custom-class="dialogVisible2"
    >
    <el-form
          ref="form"
          label-width="100px"
          label-position="right"
          :rules="rules"
          :model="postData">
          <div class="dialogVisible2-main">
            <div class="form-title">
              <div class="title-item">
                <el-form-item label=" 表单名称" class="title-item-label" prop="name">
                    <div class="title-item-main">
                      <el-input
                        v-model="postData.name"
                        :disabled="tit !== '新建表单'"
                        placeholder=""
                        :rules="rules"
                      ></el-input>
                    </div>
                </el-form-item>
              </div>
            </div>
            <div class="form-Main">
              <form-designer
                ref="formDesigner"
                v-if="dialogVisible2"
              ></form-designer>
            </div>
          </div>
      </el-form>
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
import { mapState } from "vuex";
export default {
  props: {
    formStatus: {
      type: String,
      default: "enabled",
    },
  },
  data() {
    return {
       rules: {
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
      tit: "新建表单",
      dialogVisible2: false,
      input: "",
      options: [],
      postData: {
        name: "",
      },
    };
  },
  computed: {
    ...mapState("account", ["userInfo", "tenantId"]),
    isNewDraftPublicForm() {
      return this.tit && this.tit === '新建表单' ;
    },
  },
  methods: {
    nextDiolog() {
      this.dialogVisible2 = true;
    },
    addEnableForm() {
      if (!this.postData.name) {
        this.$message.error("请填写表单名称");
        return;
      }

      if (this.postData.name.length <= 2) {
        this.$message.error("表单名称的长度必须大于两个字符");
        return;
      }

      let formDatas = {
        list: this.$refs.formDesigner.designList,
        config: this.$refs.formDesigner.formConfig,
      };
      if (formDatas.list.length === 0) {
        this.$message.error("不允许提交空表单");
        return;
      }
      const id = "form_" + Date.parse(new Date());
      var file1 = new File([JSON.stringify(formDatas)], "form.json", {
        type: "text/json",
      });
      let formData = new FormData();
      switch (this.formStatus) {
        case "enabled":
          break;
        case "":
          break;
        case "enabled-edit":
          formData.append("sourceId", this.postData.sourceId);
          break;
        case "-edit":
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
      formData.append("ascription", "public");
      formData.append("code", id);
      formData.append("business", "");
      formData.append("status", "enabled");
      formData.append("createBy", this.userInfo.account);
      formData.append("createName", this.userInfo.name);
      formData.append("tenantId", this.tenantId);
      formData.append("file", file1);
      postFormDesignServiceRealiseProcessData(formData).then((res) => {
        this.$message.success("发布至可用表单成功");
        this.$emit("addSuccess", "enabled");
        this.dialogVisible2 = false;
      });
    },
    
    addDraftForm() {
      if (!this.postData.name) {
        this.$message.error("请填写表单名称");
        return;
      }
      let formData = new FormData();
      if (this.postData.id) {
        formData.append("sourceId", this.postData.sourceId);
      }
      formData.append("name", this.postData.name);
      formData.append("docName", this.postData.name + ".json");
      formData.append("docType", "json");
      formData.append("ascription", "public");
   
      formData.append("business", "");
      formData.append("status", "drafted");
      formData.append("tenantId", this.tenantId);

      const formFile = new File(
        [this.$refs.formDesigner.getFormData()],
        "form.json",
        { type: "text/json" }
      );
      formData.append("file", formFile);

      if(this.isNewDraftPublicForm || this.formStatus==='enabled' ){
        formData.append("createBy", this.userInfo.account);
        const code = "form_" + Date.parse(new Date());
        formData.append("code", code);
        
        postFormDesignService(formData).then((res) => {
          this.$message.success("保存成功");
          this.$emit("addSuccess", "drafted");
          this.dialogVisible2 = false;
        }); 

      }else{
        formData.append("id", this.postData.id);
        formData.append("code", this.postData.code);
        formData.append("updateBy", this.userInfo.account);
        putFormDesignService(formData).then((res) => {
          this.$message.success("更新成功");
          this.$emit("addSuccess", "drafted");
          this.dialogVisible2 = false;
        }); 
        }
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
.dialog-footer {
  display: flex;
  justify-content: center;
}
.from-item {
  display: flex;
  margin-bottom: 20px;
  text-align: center;
}

.from-item > span {
  width: 100px;
  height: 40px;
  line-height: 40px;
}

.form-title {
  border-bottom: 1px solid #cccccc;
  margin-bottom: 40px;
}
.title-item {
  display: inline-block;
  margin-bottom: 20px;
}
.title-item-label {
  color: white;
  margin-right: 15px;
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
#form {
  height: 100%;
  background-color: aliceblue;
}
</style>
