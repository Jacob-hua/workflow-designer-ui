<template>
  <el-dialog
      title="第三方接口配置"
      :visible.sync="dialogVisible"
      width="80%"
      append-to-body
  >
    <div style="display: flex">
      <div class="container">
        <div v-for="(item,index)  in apiBoxList " :key="index">
          <p>API{{index+1}}
            <i @click="addApiBox" v-if="index === 0" class="el-icon-circle-plus-outline"></i>
            <span @click="deleteApiBox(index)" v-else class="el-icon-delete"></span>
          </p>
          <el-form  ref="form" :model="form" label-width="80px">
            <div class="cardBox">
              <div style="display: flex; flex-wrap: wrap">
                <el-form-item label="api名称">
                  <el-input v-model="form.srcName"></el-input>
                </el-form-item>
                <el-form-item label="api标识">
                  <el-input v-model="form.srcMark"></el-input>
                </el-form-item>
                <el-form-item label="主机地址">
                  <el-input v-model="form.srcName"></el-input>
                </el-form-item>
                <el-form-item label="访问路径">
                  <el-input v-model="form.srcMark"></el-input>
                </el-form-item>
                <el-form-item label="api类型">
                  <el-select v-model="value" placeholder="请选择api类型">
                    <el-option
                        v-for="item in apiOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="请求类型">
                  <el-select v-model="value" placeholder="请选择api类型">
                    <el-option
                        v-for="item in methodsOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="请求头">
                  <el-input v-model="form.srcMark"></el-input>
                </el-form-item>
              </div>

              <div class="config_tit">
                <span>配置参数</span> <i @click="addParams(index)"  class="el-icon-circle-plus-outline"></i>
              </div>
              <div v-for="(params,idx) in item.configParams" :key="idx" class="params">
                <el-form-item label="参数key">
                  <el-input v-model="params.key"></el-input>
                </el-form-item>
                <el-form-item label="参数value">
                  <el-input v-model="params.value"></el-input>
                </el-form-item>
                <i @click="deleteParams( index,idx)" v-if="idx!== 0" class="el-icon-remove-outline"></i>
              </div>
              <el-button class="parse" type="primary">模拟解析</el-button>
            </div>
          </el-form>
        </div>

      </div>
      <div>
        <p>解析结果 API1</p>
        <div class="jsonViewer">
          <json-viewer :value="jsonData"></json-viewer>
        </div>
      </div>

    </div>

    <span slot="footer" class="dialog-footer">
      <el-button  @click="dialogVisible = false; $emit('showAddOrEidtDailog','pre')">上一步</el-button>
      <el-button  @click="dialogVisible = false">保存</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>

  </span>
  </el-dialog>
</template>

<script>
export default {
  name: "AddOrEidtDailog",
  data() {
    return {
      jsonData: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      },
        {
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        },
      ],
      value: '',
      apiBoxList: [
        {
          configParams: [
            {
              key: '',
              value: ''
            }
          ]
        }
      ],
      methodsOptions: [
        {
          value: '1',
          label: 'POST'
        }, {
          value: '2',
          label: 'GET'
        },
      ],
      apiOptions: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }],
      dialogVisible: false,
      form: {
        srcName: '',
        srcMark: ''
      }
    }
  },
  methods: {
    addApiBox() {
      this.apiBoxList.push({
        configParams: [
          {
            key: '',
            value: ''
          }
        ]
      })
    },
    deleteApiBox(index) {
      this.apiBoxList.splice(index,1)
    },
    addParams(index) {
      this.apiBoxList[index].configParams.push({
        key: '',
        value: ''
      })
    },
    deleteParams(parentIdx,idx) {
      this.apiBoxList[parentIdx].configParams.splice(idx,1)
    },

  }
}
</script>

<style scoped>
/deep/ .el-dialog__header {
  background-color: #e4e4e4;
  border-bottom: 1px solid #000000;
}
/deep/ .el-form-item {
  width: 40%;
  margin-right: 30px;
}
/deep/ .jsonViewer .jv-code {
  background-color: rgb(204, 204, 204);
  width: 600px;
  height: 600px;
  overflow-y: auto;
}
.parse {
 margin-left: 40%;
}
.config_tit {
  display: flex;
  align-items: center;
  padding-left: 10px;
}
.config_tit i {
  color: #409eff;
  font-size: 20px;
  margin-left: 10px;
}
.params {
  width: 100%;
  display: flex;
  margin-top: 15px;
}
.params i {
  color: red;
  font-size: 20px;
}
.container {
  padding: 0 15px 0 10px;
  width: 60%;
  height: 600px;
  overflow-y: auto;
}
.container .cardBox {
  padding: 10px 0 10px 10px;
  box-sizing: border-box;
  border-radius: 0px;
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(204, 204, 204);
}
p {
  white-space: nowrap;
  text-align: left;
  font-size: 16px;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  color: rgb(0, 102, 204);
}
p i , p span{
  font-size: 22px;
}
p span {
  color: red;
}
</style>