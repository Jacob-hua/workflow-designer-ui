<template>
  <el-dialog
    title="新建项目"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="30%"
    append-to-body
  >
    <span>
      <el-form ref="form" :model="form" :rules="rules" label-width="84px">
        <el-form-item prop="name" label="项目名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item prop="type" label="项目类型">
          <el-select v-model="form.type" placeholder="请选择项目类型">
            <el-option
              v-for="item in projectOption"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="code" label="项目code">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
      </el-form>
    </span>
    <div slot="footer" class="dialog-footer">
      <div class="next" @click="next()">下一步</div>
      <div class="cancel" @click="dialogVisible = false">取 消</div>
    </div>
  </el-dialog>
</template>

<script>
import { checkBusinessConfig } from "@/api/globalConfig";
import { mapState } from "vuex";
export default {
  name: "Guide",
  data() {
    return {
      rules: {
        name: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
            trigger: "blur",
          },
        ],
        type: [{ required: true, message: "请选择项目类型", trigger: "blur" }],
        code: [
          { required: true, message: "请输入项目code", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
            trigger: "blur",
          },
        ],
      },
      project: "",
      dialogVisible: false,
      form: {
        name: "",
        type: "",
        code: "",
        tenantId: "",
      },
      projectOption: [
        {
          value: "1",
          label: "POST",
        },
        {
          value: "2",
          label: "GET",
        },
      ],
    };
  },
  computed: {
    ...mapState("account", ["userInfo", "tenantId"]),
  },
  mounted() {
    this.form.tenantId = this.tenantId;
  },
  methods: {
    next() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.checkBusinessConfig();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    checkBusinessConfig() {
      checkBusinessConfig(this.form).then((res) => {
        if (res.result) {
          this.dialogVisible = false;
          this.$emit("showAddDialog", this.form);
        } else {
          this.$message({
            type: "error",
            message: "项目名称或项目类型重复",
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .el-dialog {
  @include formDialog;
}
.next {
  @include primaryBtn;
}
.cancel {
  @include cancelBtn;
}
</style>
