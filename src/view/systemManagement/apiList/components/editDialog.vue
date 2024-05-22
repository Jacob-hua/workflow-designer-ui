<template>
  <el-dialog
    title="编辑"
    :visible.sync="dialogVisible"
    width="30%">
    <el-input v-model="modelVal"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
      <el-button type="primary" @click="handlerToClick" size="mini">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      modelVal: '',
      dialogVisible: false
    }
  },
  methods: {
    handlerToOpenClose() {
      this.dialogVisible = !this.dialogVisible;
    },
    handlerToClick() {
      console.log(this.modelVal)
      if (this.modelVal === '') {
        this.$message.warning('名称不能为空')
        return
      }
      this.$emit('changeName', this.modelVal)
      this.dialogVisible = false;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
