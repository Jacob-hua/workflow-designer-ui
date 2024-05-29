<template>
    <el-dialog
      style="z-index: 9999"
      title="编辑枚举"
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
          <el-input style="width: 400px" v-model="formData.sort" placeholder="枚举序号"></el-input>
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
        id: '',
        formData: {
          desc: '',
          name: '',
          code: '',
          sort: null
        },
        options: [],
        rule: {
            name: [
                { required: true, message: '请输入名称', trigger: 'change' },
            ],
            code: [
                { required: true, message: '请输入code', trigger: 'change' },
            ],
            sort: [
              { required: true, message: '请输入序号', trigger: 'change' },
            ]
        }
      }
    },
    methods: {
        openDialog(row) {
            this.formData.name = row.name
            this.formData.code = row.code
            this.formData.desc = row.remark
            this.formData.sort = row.sortNum
            this.id = row.id
            this.dialogVisible = true;
        },
        handlerToClick() {
            this.$refs.formWrapper.validate((valid) => {
                if (valid) {
                  this.$emit('update', { ...this.formData, id: this.id })
                    this.dialogVisible = false;
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
  