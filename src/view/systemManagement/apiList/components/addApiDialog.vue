<template>
    <el-dialog
      title="新增接口"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="30%">
      <label style="color: #fff">接口名称：</label>
      <el-input v-model="modelVal" style="width: 80%"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlerToClick" size="mini">确 定</el-button>
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
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
        if (this.modelVal === '') {
          this.$message.warning('名称不能为空')
          return
        }
        if (this.modelVal.length >= 100) {
          this.$message.warning('名称不能超过100个字符')
          return
        }
        this.$emit('addApi', this.modelVal)
        this.dialogVisible = false;
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  </style>
  