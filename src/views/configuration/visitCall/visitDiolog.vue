<template>
  <div>
    <el-dialog title="部署工作流" :visible.sync="dialogVisible2" width="70%" custom-class="dialogVisible2">
      <el-form ref="form" :model="form" label-width="80px">
        <div class="form-diys">
          <el-form-item label="资源名称">
            <el-input v-model="form.source"></el-input>
          </el-form-item>
          <el-form-item label="资源标识">
            <el-input v-model="form.sourceMark"></el-input>
          </el-form-item>
        </div>
        <div class="form-diys">
          <el-form-item label="api名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="api标识">
            <el-input v-model="form.apiMark"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="api类型">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="form-diys">
          <el-form-item label="主机地址">
            <el-input v-model="form.host"></el-input>
          </el-form-item>
          <el-form-item label="访问路径">
            <el-input v-model="form.path"></el-input>
          </el-form-item>
        </div>
        <div class="form-diys">
          <el-form-item label="请求类型">
            <el-select v-model="form.type" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="请求头">
            <el-input v-model="form.headers"></el-input>
          </el-form-item>
        </div>
        <div class="form-diys">
          <div style="width: 600px;">
            <div class="bodyData" v-for="(item, index) in bodyData" :key="index">
              <el-form-item label="参数key">
                <el-input v-model="item.key"></el-input>
              </el-form-item>
              <el-form-item label="参数Value">
                <el-input v-model="item.value"></el-input>
              </el-form-item>
              <span v-if="index === 0" class="el-icon-circle-plus-outline addLop" @click="addBodyData()"></span>
              <span v-if="index !== 0" class="el-icon-remove-outline addLop" @click="deleteBodyData(index)"></span>
            </div>
            <div style="text-align: center;">
              <el-button type="primary">执行</el-button>
            </div>
          </div>
          <div>
            <el-form-item label="请求结果">
              <div class="jsonViewer">
                <json-viewer :value="jsonData"></json-viewer>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">保存</el-button>
        <el-button @click="dialogVisible2 = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible2: false,
        options: [],
        jsonData: {
          tatol: 25,
          limit: 10,
          skip: 0,
          all: 'uuuuaaa',
          links: {
            provice: [1, 2, 3, 4, 5],
            account: {
              a: 1,
              b: 2,
              c: 3
            }
          }
        },
        form: {
          source: '',
          sourceMark: '',
          name: '',
          apiMark: '',
          type: '',
          host: '',
          path: '',
          method: '',
          headers: ''
        },
        bodyData: [
          {
            key: '',
            value: ''
          }
        ]
      }
    },
    methods: {
      addBodyData() {
        this.bodyData.push({
          key: '',
          values: ''
        })
      },
      deleteBodyData(index) {
        this.bodyData.splice(index, 1)
      }
    }
  }
</script>

<style scoped="scoped">
  /deep/ .dialogVisible2 .el-dialog__header .el-dialog__title {
    font-size: 14px;
  }

  /deep/ .dialogVisible2 .el-dialog__header {
    background-color: #e4e4e4;
    border-bottom: 1px solid #000000;
  }

  /deep/ .dialogVisible2 .el-dialog__body {
    display: flex;
    height: 700px;
    max-height: 86vh;
  }

  /deep/ .el-form {
    width: 100%;
    padding: 0px 100px;
  }

  /deep/ .el-select {
    width: 500px;
  }
  
  /deep/ .el-input__inner {
    width: 500px;
  }
  
  .bodyData {
    display: flex;
  }
  
  .bodyData /deep/ .el-input__inner {
    width: 200px;
  }
  
  .addLop {
    font-size: 20px;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    margin-left: 10px;
  }
  
  .form-diys {
    width: 100%;
    display: flex;
  }

  /deep/ .jv-container .jv-code {
    padding: 0px;
    height: 300px;
    overflow: auto;
    background-color: #333333;
    width: 500px;
    margin-top: 15px;
  }

  /deep/ .jv-container.jv-light .jv-key {
    color: white;
  }

  /deep/ .jv-container.jv-light .jv-item.jv-object {
    color: white;
  }

  /deep/ .jv-container.jv-light .jv-item.jv-array {
    color: white;
  }
</style>
