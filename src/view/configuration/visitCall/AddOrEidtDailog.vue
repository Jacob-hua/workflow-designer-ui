<template>
  <div>
    <el-dialog
      title="第三方接口配置"
      :visible.sync="visible"
      width="80%"
      @close="close"
      fullscreen
      top="1vh"
      append-to-body
    >
      <div style="display: flex">
        <div class="container">
          <div v-for="(item, index) in apiBoxList" :key="index">
            <p>
              API{{ index + 1 }}
              <i
                @click="addApiBox"
                v-if="index === 0"
                class="el-icon-circle-plus-outline"
              ></i>
              <span
                @click="deleteApiBox(index, item)"
                v-else
                class="el-icon-delete"
              ></span>
            </p>
            <el-form :ref="`form${index}`" :model="item" label-width="80px">
              <div class="cardBox">
                <div style="display: flex; flex-wrap: wrap">
                  <el-form-item
                    label="api名称"
                    prop="name"
                    :rules="[
                      {
                        required: true,
                        trigger: ['blur', 'change'],
                        message: '请填写api名称',
                      },
                      {
                        min: 1,
                        max: 100,
                        message: '长度在 1 到 100 个字符',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input v-model="item.name"></el-input>
                  </el-form-item>
                  <el-form-item
                    label="api标识"
                    prop="apiMark"
                    :rules="[
                      {
                        required: true,
                        trigger: ['blur', 'change'],
                        message: '请填写api标识',
                      },
                      {
                        min: 1,
                        max: 100,
                        message: '长度在 1 到 100 个字符',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input v-model="item.apiMark"></el-input>
                  </el-form-item>
                  <el-form-item
                    label="主机地址"
                    prop="host"
                    :rules="[
                      {
                        required: true,
                        trigger: ['blur', 'change'],
                        message: '请填写主机地址',
                      },
                    ]"
                  >
                    <el-input v-model="item.host"></el-input>
                  </el-form-item>
                  <el-form-item
                    label="访问路径"
                    prop="path"
                    :rules="[
                      {
                        required: true,
                        trigger: ['blur', 'change'],
                        message: '请填写访问路径',
                      },
                    ]"
                  >
                    <el-input v-model="item.path"></el-input>
                  </el-form-item>
                  <el-form-item
                    label="api类型"
                    prop="type"
                    :rules="[
                      {
                        required: true,
                        trigger: ['blur', 'change'],
                        message: '请选择api类型',
                      },
                    ]"
                  >
                    <el-select v-model="item.type" placeholder="请选择api类型">
                      <el-option
                        v-for="(apiItem, apiIndex) in apiOptions "
                        :key="apiIndex"
                        @click.native="apiTypeChange(item, apiItem.typeName)"
                        :label="apiItem.typeName"
                        :value="apiItem.type"
                      >
                      </el-option>
                    </el-select>
                    <p
                      @click="addApiType"
                      style="
                        color: rgb(26, 136, 255);
                        font-size: 14px;
                        cursor: pointer;
                      "
                    >
                      未找到类型点击添加
                    </p>
                  </el-form-item>

                  <el-form-item
                    label="请求类型"
                    prop="method"
                    :rules="[
                      {
                        required: true,
                        trigger: ['blur', 'change'],
                        message: '请选择请求类型',
                      },
                    ]"
                  >
                    <el-select
                      v-model="item.method"
                      placeholder="请选择请求类型"
                    >
                      <el-option
                        v-for="item in methodsOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="请求头"
                    prop="headers"
                    :rules="[
                      {
                        required: true,
                        trigger: ['blur', 'change'],
                        message: '请填写请求头',
                      },
                    ]"
                  >
                    <el-input v-model="item.headers"></el-input>
                  </el-form-item>
                </div>

                <div class="config_tit">
                  <span>配置参数</span>
                  <i
                    @click="addParams(index)"
                    class="el-icon-circle-plus-outline"
                  ></i>
                </div>
                <div
                  v-for="(params, paramsIndex) in item.configParams"
                  :key="paramsIndex"
                  class="params"
                >
                  <el-form-item label="参数key">
                    <el-input v-model="params.key"></el-input>
                  </el-form-item>
                  <el-form-item label="参数value">
                    <el-input v-model="params.value"></el-input>
                  </el-form-item>
                  <i
                    @click="deleteParams(index, paramsIndex)"
                    class="el-icon-remove-outline"
                  ></i>
                </div>
                <el-button
                  @click="executeParse(item)"
                  class="parse"
                  type="primary"
                  >模拟请求</el-button
                >
                <el-divider></el-divider>
                <div class="config_tit">
                  <span style="color: #1d89ff">解析参数</span>
                  <i
                    @click="addParseParams(index)"
                    class="el-icon-circle-plus-outline"
                  ></i>
                </div>
                <div
                  v-for="(parse, parseIndex) in item.parseParams"
                  :key="parseIndex"
                  class="params"
                >
                  <el-form-item label="参数key">
                    <el-input v-model="parse.key"></el-input>
                  </el-form-item>
                  <el-form-item label="参数value">
                    <el-input v-model="parse.value"></el-input>
                  </el-form-item>
                  <i
                    @click="deleteParseParams(index, parseIndex)"
                    class="el-icon-remove-outline"
                  ></i>
                </div>
                <el-button class="save" @click="saveConfig(item, `form${index}`)" type="primary">保存</el-button>
              </div>
            </el-form>

          </div>
        </div>
        <div class="right">
          <p>请求结果</p>
          <div class="jsonViewer">
            <json-viewer :value="jsonData"></json-viewer>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="添加API类型"
      :visible.sync="apiTypeVisible"
      :close-on-click-modal="false"
      width="40%"
      append-to-body
    >
      <el-form ref="formMethod" label-width="80px">
        <el-form-item label="类型">
          <el-input v-model="typeForm.type"></el-input>
        </el-form-item>
        <el-form-item label="类型名称">
          <el-input v-model="typeForm.typeName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="next" @click="saveApiType">保存</div>
        <div class="cancel" @click="apiTypeVisible = false">取 消</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  apiTypeList,
  checkApiType,
  postSaveOrEdite,
  simulationRequest,
  putSaveOrEdite,
  deleteApi,
} from "@/api/globalConfig";
import { mapState } from "vuex";

import ApiEnum from "@/enum/ApiTypeEnum";

import _ from "lodash";
export default {
  props: {
    guideForm: Object,
    business: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "edit",
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      apiTypeVisible: false,
      typeForm: {
        type: "",
        typeName: "",
      },
      jsonData: [],
      value: "",
      apiBoxList: [

      ],
      methodsOptions: [
        {
          value: "1",
          label: "POST",
        },
        {
          value: "2",
          label: "GET",
        },
      ],
      apiOptions: [],
    };
  },
  mounted() {
    this.initApiBoxList()
    this.loadApiOptionList()
  },
  computed: {
    ...mapState("account", ["userInfo", "tenantId"]),
  },
  methods: {
    initApiBoxList() {
      this.apiBoxList = [
        {
          ascription: this.business,
          ...this.guideForm,
          name: "", //api名称
          apiMark: "", // api标识
          type: "", // api类型,
          typeName: "", //api类型名称
          host: "", // 系统host
          path: "", // 请求路径
          method: "", //请求方式
          headers: "", //请求头信息
          parameter: "", // GET请求参数 eg: ?id=${id}&&name=${name}
          body: "", //POST请求参数 eg: {\"id\":\"${id}\",\"name\":\"${name}\"}
          dataParse: "", //解析配置
          isUse: 1, // 是否使用 1 使用 0禁用 2删除
          createTime: "", //创建时间
          createBy: this.userInfo.account, //创建人
          tenantId: this.tenantId, //租户id
          configParams: [

          ],
          parseParams: [

          ],
        },
      ]
    },
    async getApiTypeList({ tenantId, ascription }) {
      try {
        const { errorInfo, result = [] } = await apiTypeList({
          tenantId,
          ascription

        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }
        return result
      } catch (e) {
        return []
      }

    },
    async loadApiOptionList() {
      this.apiOptions = await this.getApiTypeList({
        tenantId: this.tenantId,
        ascription: this.business,
      })
    },
    addApiType() {
      this.apiTypeVisible = true;
      this.typeForm = {
        type: "",
        typeName: "",
      };
    },
    async saveApi( { tenantId, ascription}) {
        const { errorInfo, result } = await checkApiType({
          ...this.typeForm,
          tenantId,
          ascription,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }
        return result
    },
    async saveApiType() {
     const result = await this.saveApi({
        tenantId: this.tenantId,
        ascription: this.business,
      })
      if (!result) {
        this.$message.error('Api类型或类型名称重复')
      }
      this.apiOptions.push(this.typeForm)
      this.apiTypeVisible = false
    },
    apiTypeChange(currentApi, typeName) {
      currentApi.typeName = typeName;
    },
    close() {
      this.$emit('update:visible', false)
    },
    handlerPostParams(config) {
      const body = config.parameterMap = config.configParams?.reduce((body = {}, parameter) => {
        body[parameter.key] = parameter.value
        return body
      }, {})
      config.body = JSON.stringify(body)
      config.parameterMap = body
    },
    handlerGetParams(config) {
      config.parameterMap = {}
       config.parameter = config.configParams?.reduce((parameters ={}, params, index) => {
        if (index === 0) {
          parameters = `?${params.key}=${params.value}`;
        } else {
          parameters += `&${params.key}=${params.value}`;
        }
         config.parameterMap[params.key] = params.value
          return parameters
      }, '')
    },
    handleSaveParameter(config) {
     const dataParse  =  config.parseParams?.reduce((dataParse = {}, params) => {
        dataParse[params.key] = params.value
        return dataParse
      }, {})
      config.dataParse = JSON.stringify(dataParse)
      const variableFactory = {
       [ApiEnum.API_TYPE_POST]: this.handlerPostParams,
        [ApiEnum.API_TYPE_GET]: this.handlerGetParams
      }
      variableFactory[config.method](config)
    },
    checkKeyIsEmpty( { parameterMap,  dataParse } ,isEmpty = true) {
      if (typeof dataParse === 'string') {
        dataParse = JSON.parse(dataParse)
      }
      if (
          Object.keys(parameterMap).includes("") ||
          Object.keys(dataParse).includes("")) {
        isEmpty = false
      }
      return isEmpty
    },
    async saveConfig(config, formIndex) {
      console.log(config)
      const [formInstance] = this.$refs[formIndex]
      await formInstance.validate()
      this.handleSaveParameter(config)
      if (!this.checkKeyIsEmpty(config)) {
        this.$message.warning(
            "参数或解析参数配置中存在key为空, 请修改后保存"
        );
        return
      }
      await postSaveOrEdite([config])
      this.$message.success('保存成功')
      this.close()
      if(this.type === 'edit') {
        this.$parent.DetailFlag = false
      }
      this.$emit('refreshList', this.business)
    },
    processPost( { method, configParams, body, url, headers } ) {
     body = configParams.reduce(( requestBody = {}, params ) => {
       requestBody[params.key] = params.value
       return requestBody
      },{})
      return {
        body,
        headers,
        method,
        url
      }
    },
    processGet( { method, headers, host, path, parameter, configParams } ) {
      parameter = configParams.reduce((parameters, config, index) => {
        if (index === 0) {
          parameters = `?${config.key}=${config.value}`;
        } else {
          parameters += `&${config.key}=${config.value}`;
        }
        return parameters
      }, '')
      return {
        headers,
        method,
        url: `${host}${path}${parameter}`
      }
    },
    parameterFactory({ method, body = '{}', configParams = [], headers, url, host, path,  parameter }) {
      const processParameterMap = {
        [ApiEnum.API_TYPE_POST]: this.processPost,
        [ApiEnum.API_TYPE_GET]: this.processGet
      }
     return processParameterMap[method]( { method, body, configParams, headers, url, host, path,  parameter } )
    },
    async executeParse(api){
      this.jsonData =  await simulationRequest(this.parameterFactory(api))
    },
    addApiBox() {
      this.apiBoxList.push({
        source: this.apiBoxList[0].source, //系统名称
        sourceMark: this.apiBoxList[0].sourceMark, // 系统标识
        name: "", //api名称
        apiMark: "", // api标识
        type: "", // api类型,
        typeName: "", //api类型名称
        host: "", // 系统host
        path: "", // 请求路径
        method: "", //请求方式
        headers: "", //请求头信息
        parameter: "", // GET请求参数 eg: ?id=${id}&&name=${name}
        body: "", //POST请求参数 eg: {\"id\":\"${id}\",\"name\":\"${name}\"}
        dataParse: "", //解析配置
        isUse: 1, // 是否使用 1 使用 0禁用 2删除
        createTime: "", //创建时间
        createBy: this.userInfo.account, //创建人
        tenantId: +this.tenantId, //租户id
        configParams: [
          {
            key: "",
            value: "",
          },
        ],
        parseParams: [
          {
            key: "",
            value: "",
          },
        ],
      });
    },
    deleteApiBox(index, item) {
      this.$confirm("此操作将删除当前选中api,是否继续?", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
        beforeClose: (action, instance, done) => {
          // 取消回车确认事件
          if (action === "confirm") {
            (instance.$refs["confirm"].$el.onclick = function (e) {
              e = e || window.event;
              if (e.detail !== 0) {
                done();
              }
            })();
          } else {
            done();
          }
        },
      }).then(() => {
        if (item.id) {
          deleteApi(item.id).then((res) => {
            this.apiBoxList.splice(index, 1);
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.$parent.GetGlobalList(this.business);
          });
        }
        this.apiBoxList.splice(index, 1);
      });
    },
    addParams(index) {
      this.apiBoxList[index].configParams.push({
        key: "",
        value: "",
      });
    },
    addParseParams(index) {
      this.apiBoxList[index].parseParams.push({
        key: "",
        value: "",
      });
    },
    deleteParseParams(parentIdx, idx) {
      this.apiBoxList[parentIdx].parseParams.splice(idx, 1);
    },
    deleteParams(parentIdx, idx) {
      this.apiBoxList[parentIdx].configParams.splice(idx, 1);
    },
  },
};
</script>

<style scoped lang="scss">
.save {
  margin-left: 455px
}
.save::-webkit-scrollbar {
  width: 20px;
}
.save::-webkit-scrollbar-thumb {
  border-radius: 20px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background-color: rgba(0,0,0,0.1);
}
.save::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 0;
  background-color: rgba(255,255,255,0.1);
}
.container::-webkit-scrollbar {
  width: 20px;
}
.container::-webkit-scrollbar-thumb {
  border-radius: 20px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background-color: rgba(0,0,0,0.1);
}
.container::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 0;
  background-color: rgba(255,255,255,0.1);
}
.next {
  @include primaryBtn;
}
.cancel {
  @include cancelBtn;
}
.container {
  height:85vh;
  overflow-y: auto;
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
.el-form-item {
  margin-right: 20px;
}
.el-select {
  width: 203px;
}
/deep/ .jv-container.jv-light .jv-item.jv-array {
  color: #fff;
}
/deep/ .jsonViewer .jv-code {
  background-color: #212739;
  width: 600px;
  height: 600px;
  overflow-y: auto;
  color: #fff;
}
/deep/ .el-divider {
  background-color: #333333;
}
/deep/ .jv-container.jv-light .jv-key {
  color: #fff;
}
/deep/ .jv-container.jv-light .jv-item.jv-object {
  color: #fff;
}
.parse {
  margin-left: 40%;
}
.config_tit {
  display: flex;
  align-items: center;
  padding-left: 10px;
  color: #fff;
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
  overflow-y: auto;
}
.container .cardBox {
  padding: 10px 0 10px 10px;
  box-sizing: border-box;
  border-radius: 0px;
  border: 1px solid #333333;
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
p i,
p span {
  font-size: 22px;
}
p span {
  color: red;
}
</style>
