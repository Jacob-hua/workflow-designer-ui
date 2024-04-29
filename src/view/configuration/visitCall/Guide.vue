<template>
  <el-dialog
    title="第三方接口配置"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    v-if="dialogVisible"
    width="30%"
    append-to-body
    :close-on-press-escape="false"
  >
    <span>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item prop="source" label="资源类型">
          <el-input v-model="form.source"></el-input>
        </el-form-item>
        <el-form-item prop="sourceMark" label="资源标识">
          <el-input v-model="form.sourceMark"></el-input>
        </el-form-item>
      </el-form>
    </span>
    <span slot="footer" class="dialog-footer">
      <div class="next" @click="next()">下一步</div>
      <div class="cancel" @click="dialogVisible = false">取 消</div>
    </span>
  </el-dialog>
</template>

<script>
import { checkSourceSort } from "@/api/globalConfig";
import { mapState } from "vuex";

export default {
  name: "Guide",
  props: {
    business: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      rules: {
        source: [
          { required: true, message: "请输入资源名称", trigger: "blur" },
        ],
        sourceMark: [
          { required: true, message: "请输入资源标识", trigger: "blur" },
        ],
      },
      dialogVisible: false,
      form: {
        source: "",
        sourceMark: "",
      },
      editFlag: false,
    };
  },
  computed: {
    ...mapState("account", ["userInfo", "tenantId"]),
  },
  methods: {
    async checkSourceSort() {
      try {
        const { result } = await checkSourceSort({
          ...this.form,
          tenantId: this.tenantId,
          ascription: this.business,
        });
        return result;
      } catch (e) {
        console.log(e.toString());
      }
    },
    async next() {
      const result = await this.checkSourceSort();
      if (result) {
        this.$message.warning("资源或资源标识已存在");
        return;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          this.$emit("showAddDialog", this.form, this.editFlag);
        } else {
          console.log("error submit!!");
          return false;
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
