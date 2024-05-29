<template>
    <el-dialog
      title="新增字典"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="formWrapper" :model="formData" class="search-wrapper" size="mini" :rules="rule">
        <el-form-item prop="business" label="业务" label-width="100px">
          <!-- <el-input v-model="formData.business" placeholder="业务"></el-input> -->
          <el-cascader
            style="width: 400px" 
            v-model="formData.business"
            :options="options"
            :props="{
              emitPath: true,
              checkStrictly: true,
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="字典名称" prop="name" label-width="100px">
          <el-input style="width: 400px" v-model="formData.name" placeholder="字典名称"></el-input>
        </el-form-item>
        <el-form-item label="字典code" prop="code" label-width="100px">
          <el-input style="width: 400px" v-model="formData.code" placeholder="字典code"></el-input>
        </el-form-item>
        <el-form-item label="字典描述" label-width="100px">
            <el-input type="textarea" style="width: 400px" v-model="formData.desc" placeholder="字典描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlerToClick" size="mini">确 定</el-button>
        <el-button @click="handlerToCancle" size="mini">取 消</el-button>
      </span>
    </el-dialog>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dialogVisible: false,
        formData: {
            business: '',
            name: '',
            code: '',
            desc: ''
        },
        options: [],
        rule: {
            name: [
                { required: true, message: '请输入名称', trigger: 'change' },
            ],
            code: [
                { required: true, message: '请输入code', trigger: 'change' },
            ],
            business: [
                { required: true, message: '请选择业务', trigger: 'change' },
            ],
        }
      }
    },
    methods: {
        openDialog() {
            this.dialogVisible = true;
            this.options = this.$store.state.config.organizations
        },
        handlerToClick() {
            this.$refs.formWrapper.validate((valid) => {
                if (valid) {
                    this.dialogVisible = false;
                    this.$emit('addOne', { ...this.formData })
                } else {
                    // console.log('error submit!!');
                    return false;
                }
            });
        },
        handlerToCancle() {
            this.$refs.formWrapper.resetFields();
            this.dialogVisible = false;
        }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  </style>
  