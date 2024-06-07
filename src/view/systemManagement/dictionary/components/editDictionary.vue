<template>
    <el-dialog
      title="编辑字典"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="formWrapper" :model="formData" class="search-wrapper" size="mini" :rules="rule">
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
        id: '',
        formData: {
            name: '',
            code: '',
            desc: ''
        },
        rule: {
            name: [
                { required: true, message: '请输入名称', trigger: 'change' },
                { max: 100, message: '长度不能超过100字符', trigger: 'blur' }
            ],
            code: [
                { required: true, message: '请输入code', trigger: 'change' },
                { max: 100, message: '长度不能超过100字符', trigger: 'blur' }
            ]
        }
      }
    },
    methods: {
        openDialog(data) {
            this.dialogVisible = true;
            this.formData.name = data.name
            this.formData.code = data.code
            this.formData.desc = data.remark
            this.id = data.id
        },
        handlerToClick() {
            this.$refs.formWrapper.validate((valid) => {
                if (valid) {
                    this.$emit('update', { ...this.formData, id: this.id })
                } else {
                    // console.log('error submit!!');
                    return false;
                }
            });
        },
        handlerToCancle() {
            this.$refs.formWrapper.resetFields();
            this.dialogVisible = false;
            this.id = ''
            this.formData.name = ''
            this.formData.code = ''
            this.formdata.desc = ''
        }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  </style>
  