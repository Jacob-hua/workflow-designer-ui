<template>
  <div class="api-list">
    <div class="top-input-method">
      <el-input placeholder="请输入内容" v-model="searchApi" class="input-with-select" size="mini">
        <el-select v-model="methodType" slot="prepend" placeholder="请选择" size="mini" class="prepend-select">
          <el-option label="GET" value="GET"></el-option>
          <el-option label="POST" value="POST"></el-option>
          <el-option label="PUT" value="PUT"></el-option>
          <el-option label="DELETE" value="DELETE"></el-option>
        </el-select>
      </el-input>
      <el-button size="mini" type="primary" style="margin-left: 10px;" @click="handlerToSendApi">发送</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchApi: '',
      methodType: 'GET'
    }
  },
  methods: {
    handlerToSendApi() {
      console.log(this.searchApi, this.methodType)
    }
  }
}
</script>

<style lang="scss" scoped>
.api-list {
    width: 100%;
    height: 640px;
    .top-input-method {
      width: 100%;
      .input-with-select {
        width: 85%;
        .prepend-select {
          width: 80px;
          background-color: #212739;
        }
      }
    }
}
</style>
