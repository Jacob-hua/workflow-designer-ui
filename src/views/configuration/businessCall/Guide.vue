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
            <el-input v-model="form.srcName"></el-input>
          </el-form-item>
          <el-form-item label="项目类型">
            <el-input v-model="form.srcMark"></el-input>
          </el-form-item>
        </el-form>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button  @click="dialogVisible = false; $emit('showAddDialog')">下一步</el-button>
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
        srcName: '',
        srcMark: ''
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