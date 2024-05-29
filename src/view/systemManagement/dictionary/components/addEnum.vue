<template>
    <el-dialog
      title="新增枚举"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="formWrapper" :model="formData" class="search-wrapper" size="mini" :rules="rule">
        <el-form-item label="枚举名称" prop="name" label-width="100px">
          <el-input style="width: 400px" v-model="formData.name" placeholder="枚举名称"></el-input>
        </el-form-item>
        <el-form-item label="枚举code" prop="code" label-width="100px">
          <el-input style="width: 400px" v-model="formData.code" placeholder="枚举code"></el-input>
        </el-form-item>
        <el-form-item label="枚举序号" prop="sort" label-width="100px">
          <el-input style="width: 400px" v-model.number="formData.sort" placeholder="枚举序号"></el-input>
        </el-form-item>
        <el-form-item label="枚举描述" label-width="100px">
          <el-input type="textarea" style="width: 400px" v-model="formData.desc" placeholder="枚举描述"></el-input>
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
          desc: '',
          name: '',
          code: '',
          sort: ''
        },
        options: [],
        rule: {
            name: [
                { required: true, message: '请输入名称', trigger: 'blur' },
            ],
            code: [
                { required: true, message: '请输入code', trigger: 'blur' },
            ],
            sort: [
              { required: true, message: '请输入序号', trigger: 'blur' },
              { type: 'number', message: '排序必须为数字值', trigger: 'blur' }
            ]
        }
      }
    },
    methods: {
        openDialog() {
            this.dialogVisible = true;
        },
        handlerToClick() {
            this.$refs.formWrapper.validate((valid) => {
                if (valid) {
                    this.dialogVisible = false;
                    this.$emit('addOne', { ...this.formData })
                    this.formData = {
                      desc: '',
                      name: '',
                      code: '',
                      sort: ''
                    }
                } else {
                    // console.log('error submit!!');
                    return false;
                }
            });
        },
        handlerToCancle() {
            this.$refs.formWrapper.resetFields();
            this.dialogVisible = false;
            this.formData = {
              desc: '',
              name: '',
              code: '',
              sort: ''
            }
        }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  </style>
  