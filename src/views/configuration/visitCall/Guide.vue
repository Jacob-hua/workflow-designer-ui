<template>

  <el-dialog
      title="第三方接口配置"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      width="30%"
      append-to-body
      >
    <span>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="资源名称">
            <el-input v-model="form.source"></el-input>
          </el-form-item>
          <el-form-item label="资源标识">
            <el-input v-model="form.sourceMark"></el-input>
          </el-form-item>
        </el-form>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button  @click="dialogVisible = false; $emit('showAddDialog', form)">下一步</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>

  </span>
  </el-dialog>
</template>

<script>
export default {
  name: "Guide",
  data() {
    return {
      dialogVisible: false,
      form: {
        source: '',
        sourceMark: ''
      }
    }
  },
   methods: {

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