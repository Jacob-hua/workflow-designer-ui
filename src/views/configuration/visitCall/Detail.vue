<template>
  <el-dialog
      title="第三方接口配置"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      width="65%"
      append-to-body
  >
    <el-form  ref="form" :model="form" label-width="80px">
    <div class="top">
      <el-form-item label="资源名称">
        <el-input disabled></el-input>
      </el-form-item>

      <el-form-item label="资源名称">
        <el-input disabled></el-input>
      </el-form-item>
      <div>
        <el-button @click="$emit('showAddOrEidtDailog',currentRow)" type="primary">编辑</el-button>
        <el-button type="primary">删除</el-button>
      </div>
    </div>
    <div style="display: flex">
      <div class="container">
        <div class="cardBox">
          <el-tabs v-model="editableTabsValue" type="card" @tab-remove="removeTab">
            <el-tab-pane
                v-for="(item, index) in editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
            >
              <el-form-item label="api名称">
                <el-input disabled></el-input>
              </el-form-item>
              <el-form-item label="api标识">
                <el-input disabled></el-input>
              </el-form-item>
              <el-form-item label="主机地址">
                <el-input disabled></el-input>
              </el-form-item>
              <el-form-item label="访问路径">
                <el-input disabled></el-input>
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
              <div class="params">
                <el-form-item label="参数key">
                  <el-input v-model="form.srcMark"></el-input>
                </el-form-item>
                <el-form-item label="参数value">
                  <el-input v-model="form.srcMark"></el-input>
                </el-form-item>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

      </div>
      <div class="cardBox">
        <p> 解析参数</p>
        <div class="jsonViewer">
          <div class="params">
            <el-form-item label="参数key">
              <el-input v-model="form.srcMark"></el-input>
            </el-form-item>
            <el-form-item label="参数value">
              <el-input v-model="form.srcMark"></el-input>
            </el-form-item>

          </div><div class="params">
          <el-form-item label="参数key">
            <el-input v-model="form.srcMark"></el-input>
          </el-form-item>
          <el-form-item label="参数value">
            <el-input v-model="form.srcMark"></el-input>
          </el-form-item>

        </div>
          <div class="params">
            <el-form-item label="参数key">
              <el-input v-model="form.srcMark"></el-input>
            </el-form-item>
            <el-form-item label="参数value">
              <el-input v-model="form.srcMark"></el-input>
            </el-form-item>

          </div><div class="params">
          <el-form-item label="参数key">
            <el-input v-model="form.srcMark"></el-input>
          </el-form-item>
          <el-form-item label="参数value">
            <el-input v-model="form.srcMark"></el-input>
          </el-form-item>

        </div>
          <div class="params">
            <el-form-item label="参数key">
              <el-input v-model="form.srcMark"></el-input>
            </el-form-item>
            <el-form-item label="参数value">
              <el-input v-model="form.srcMark"></el-input>
            </el-form-item>

          </div>


        </div>
      </div>

    </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: "AddOrEidtDailog",
  data() {
    return {
      currentRow: {
        id: 2
      },
      form: {},
      editableTabsValue: '1',
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
      editableTabs: [
        {
        title: 'API 1',
        name: '1',
        content: 'Tab 1 content'
      },
        {
          title: 'API 2',
          name: '2',
          content: 'Tab 1 content'
        },
        {
          title: 'API 3',
          name: '3',
          content: 'Tab 1 content'
        },  {
          title: 'API 4',
          name: '4',
          content: 'Tab 1 content'
        },  {
          title: 'API 5',
          name: '5',
          content: 'Tab 1 content'
        },  {
          title: 'API 6',
          name: '6',
          content: 'Tab 1 content'
        },
        {
          title: 'API 7',
          name: '7',
          content: 'Tab 1 content'
        },
        {
          title: 'API 8',
          name: '8',
          content: 'Tab 1 content'
        },



      ],
      tabIndex: 2,

      dialogVisible: false,

    }
  },
  methods: {}
}
</script>

<style scoped>
/deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  background-color: #000;
}
/deep/ .is-active {
  color: #fff;
}
/deep/ .el-dialog__header {
  background-color: #e4e4e4;
  border-bottom: 1px solid #000000;
}
/deep/ .el-form-item {
  width: 80%;
  margin-right: 30px;
}
.top {
  display: flex;
}
.top /deep/ .el-form-item {
  width: 40%;
  /*margin-right: 30px;*/
}
/*.container  /deep/ .el-form-item {*/
/*  width: 60%;*/
/*  margin-right: 30px;*/
/*}*/
/deep/ .jsonViewer .jv-code {
  background-color: rgb(204, 204, 204);
  width: 600px;
  height: 600px;
}
.parse {
  margin-left: 40%;
}
.config_tit i {
  color: #409eff;
  font-size: 20px;
  margin-left: 10px;
}
.params {
  width: 100%;
  margin-top: 15px;
}
.params i {
  color: red;
  font-size: 20px;
}
.container {
  padding: 0 15px 0 10px;
  width: 50%;
  height: 600px;
  overflow-y: auto;
}
.jsonViewer .params {
  width: 600px;
}
.jsonViewer{
  height:550px;
  overflow-y: auto;
  overflow-x: hidden;
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