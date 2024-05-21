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
      <el-button size="mini" type="primary" style="margin-left: 10px;" @click="handlerToSendApi">保存</el-button>
    </div>
    <div class="tab-params-list">
      <el-tabs v-model="activeName" @tab-click="handleClick" size="mini">
        <el-tab-pane label="请求头" name="headers">
          <headers-list></headers-list>
        </el-tab-pane>
        <el-tab-pane label="参数" name="params">
          <params-list></params-list>
        </el-tab-pane>
        <el-tab-pane label="请求体" name="body">
          <bodys-list></bodys-list>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ParamsList from './components/paramsList.vue'
import HeadersList from './components/headersList.vue'
import BodysList from './components/bodysList.vue'
export default {
  components: {
    ParamsList,
    HeadersList,
    BodysList
  },
  data() {
    return {
      searchApi: '',
      methodType: 'GET',
      activeName: 'body'
    }
  },
  methods: {
    handlerToSendApi() {
      console.log(this.searchApi, this.methodType)
    },
    handleClick() {
      console.log(this.activeName)
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
        width: 100px;
        background-color: #212739;
        color: #fff;
      }
    }
  }
  .tab-params-list {
    overflow: hidden;
    border-top: 2px solid #333333;
    margin-top: 10px;
    ::v-deep .el-tabs__nav-wrap::after {
      background-color: #333333;
    }
    ::v-deep .el-tabs__item {
      &.is-active {
        color: #409EFF
      }
      color: #ffffff;
    }
  }
}
</style>
