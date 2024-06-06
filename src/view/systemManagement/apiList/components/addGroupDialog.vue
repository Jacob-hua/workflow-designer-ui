<template>
    <el-dialog
      title="新增分组"
      :visible.sync="dialogVisible"
      width="30%">
      <label style="color: #fff">选择业务：</label>
      <el-cascader
        style="width: 400px" 
        v-model="business"
        :options="options"
        :props="{
          emitPath: true,
          checkStrictly: true,
        }"
      ></el-cascader>
      <br/>
      <br/>
      <label style="color: #fff">分组名称：</label>
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
        business: [],
        options: [],
        modelVal: '',
        dialogVisible: false
      }
    },
    created() {
      this.$store.dispatch('config/dispatchProjectOriganizations').then(() => {
        this.options = this.$store.state.config.organizations
      })
    },
    methods: {
      handlerToOpenClose() {
        this.dialogVisible = !this.dialogVisible;
        this.modelVal = ''
        this.business = []
      },
      handlerToClick() {
        if (this.modelVal === '') {
          this.$message.warning('名称不能为空')
          return
        }
        if (!this.business.length) {
          this.$message.warning('业务不能为空')
          return
        }
        this.$emit('addGroup', {val: this.modelVal, business: this.business})
        this.dialogVisible = false;
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  </style>
  