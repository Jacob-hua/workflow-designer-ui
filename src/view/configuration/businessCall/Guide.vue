<template>

  <el-dialog
      title="新建项目"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
  >
    <span>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="项目名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
           <el-form-item label="项目  类型">
                  <el-select v-model="form.type" placeholder="请选择api类型">
                    <el-option
                        v-for="item in projectOption"
                        :key="item.id"
                        :label="item.name"
                        :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
          <el-form-item label="项目code">
            <el-input v-model="form.code"></el-input>
          </el-form-item>
        </el-form>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button  @click="next()">下一步</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>

  </span>
  </el-dialog>
</template>

<script>
import {checkBusinessConfig} from "@/api/globalConfig";

export default {
  name: "Guide",
  data() {
    return {
      project: '',
      dialogVisible: false,
      form: {
        name: '',
        type: '',
        code: '',
        tenantId: this.$store.state.tenantId
      },
      projectOption: [
        {
          value: '1',
          label: 'POST'
        }, {
          value: '2',
          label: 'GET'
        },
      ],
    }
  },
  methods: {
    next() {
      this.checkBusinessConfig()
    },
    checkBusinessConfig() {
      checkBusinessConfig(this.form).then(res=> {
        if (res.result) {
          this.dialogVisible = false;
          this.$emit('showAddDialog', this.form)
        } else {
          this.$message({
            type:'error',
            message: '项目名称或项目类型重复'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
/deep/ .el-dialog__header {
  background-color: #e4e4e4;
  border-bottom: 1px solid #000000;
}
/deep/ .el-form-item {
  width: 80%;
}
</style>