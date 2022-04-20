<template>
  <el-dialog title="查看" :visible="dialogVisible" width="70%" custom-class="dialogVisible" @close="close">
    <div class="dialogVisible-main">
      <bpmnView></bpmnView>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="edit()">编辑</el-button>
      <el-button @click="Deactivate()">停用</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import bpmnView from '@/components/bpmnView/index.vue'
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        
      }
    },
    methods:{
      edit() {
        this.$emit('edit')
      },
      Deactivate() {
        
      },
      close() {
        this.$emit('close')
      }
    },
    components: {
      bpmnView
    }
  }
</script>

<style>
</style>
