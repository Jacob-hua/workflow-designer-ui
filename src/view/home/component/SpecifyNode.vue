<template>
  <el-dialog title="执行人员选择" :visible.sync="nodeDialogVisible" ></el-dialog>
</template>
<script>

export default{
  name: 'SpecifyNode',
  props: {
    nodeDialogVisible: {
      type: Boolean,
      default: false
    }
  }
}
</script>