<template>
  <div>
    <el-dialog
      title="第三方接口配置"
      :visible.sync="dialogVisible"
      width="80%"
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
                @click="deleteApiBox(index)"
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
                        v-for="(apiItem, idxe) in apiOptions"
                        :key="idxe"
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
                        :key="Math.random()"
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
                      {
                        min: 1,
                        max: 100,
                        message: '长度在 1 到 100 个字符',
                        trigger: 'blur',
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
                  v-for="(params, indexs) in item.configParams"
                  :key="indexs"
                  class="params"
                >
                  <el-form-item label="参数key">
                    <el-input v-model="params.key"></el-input>
                  </el-form-item>
                  <el-form-item label="参数value">
                    <el-input v-model="params.value"></el-input>
                  </el-form-item>
                  <i
                    @click="deleteParams(index, indexs)"
                    v-if="indexs !== 0"
                    class="el-icon-remove-outline"
                  ></i>
                </div>
                <el-button
                  @click="excuteParse(item)"
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
                  v-for="(parse, idxs) in item.parseParams"
                  :key="idxs"
                  class="params"
                >
                  <el-form-item label="参数key">
                    <el-input v-model="parse.key"></el-input>
                  </el-form-item>
                  <el-form-item label="参数value">
                    <el-input v-model="parse.value"></el-input>
                  </el-form-item>
                  <i
                    @click="deleteParseParams(index, idxs)"
                    v-if="idxs !== 0"
                    class="el-icon-remove-outline"
                  ></i>
                </div>
              </div>
            </el-form>
          </div>
        </div>
        <div>
          <p>请求结果</p>
          <div class="jsonViewer">
            <json-viewer :value="jsonData"></json-viewer>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <!--        <div-->
        <!--          class="next"-->
        <!--          @click="-->
        <!--            dialogVisible = false;-->
        <!--            $emit('showAddOrEidtDailog', '', 'pre');-->
        <!--          "-->
        <!--        >-->
        <!--          上一步-->
        <!--        </div>-->
        <div class="next" @click="saveOrEdite">保存</div>
        <div class="cancel" @click="dialogVisible = false">取 消</div>
      </div>
    </el-dialog>

    <el-dialog
      title="添加API类型"
      :visible.sync="dialogVisible2"
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
        <div class="next" @click="saveApi">保存</div>
        <div class="cancel" @click="dialogVisible2 = false">取 消</div>
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
} from "@/api/globalConfig";
import { mapState } from "vuex";

import ApiEnum from "@/enum/ApiTypeEnum";

export default {
  name: "AddOrEidtDailog",
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
  },
  data() {
    return {
      dialogVisible2: false,
      typeForm: {
        type: "",
        typeName: "",
      },
      jsonData: [],
      value: "",
      apiBoxList: [
        {
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
          createBy: "", //创建人
          tenantId: "", //租户id
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
        },
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
      dialogVisible: false,
    };
  },
  mounted() {
    this.apiBoxList[0].createBy = this.userInfo.account;
    this.apiBoxList[0].tenantId = this.tenantId;
    this.apiTypeList();
  },
  computed: {
    ...mapState("account", ["userInfo", "tenantId"]),
  },
  methods: {
    apiTypeChange(currentApi, typeName) {
      currentApi.typeName = typeName;
    },
    saveApi() {
      // get(`/config/global/checkApiType?typeName=${params.typeName}&type=user&tenantId=18`);
      checkApiType({
        ...this.typeForm,
        tenantId: this.tenantId,
        ascription: this.business,
      }).then((res) => {
        if (res.result) {
          this.apiOptions.push(this.typeForm);
          this.dialogVisible2 = false;
        } else {
          this.$message({
            type: "error",
            message: "Api类型或类型名称重复",
          });
        }
      });
    },
    addApiType() {
      this.dialogVisible2 = true;
      this.typeForm = {
        type: "",
        typeName: "",
      };
    },

    excuteParse(api) {
      if (api.method === ApiEnum.API_TYPE_POST) {
        let body = JSON.parse(api.body) ?? {};
        api.configParams.forEach((config, index) => {
          body[config.key] = config.value;
        });
        simulationRequest({
          body: body,
          headers: api.headers,
          method: api.method,
          url: api.url,
        }).then((res) => {
          this.jsonData = res;
        });
      } else {
        api.configParams.forEach((config, index) => {
          if (index === 0) {
            api.parameter = `?${config.key}=${config.value}`;
          } else {
            api.parameter += `&${config.key}=${config.value}`;
          }
        });
        simulationRequest({
          headers: api.headers,
          method: api.method,
          url: api.host + api.path + api.parameter,
        }).then((res) => {
          this.jsonData = res;
        });
      }
    },
    apiTypeList() {
      apiTypeList({
        tenantId: this.tenantId,
        ascription: this.business,
      }).then((res) => {
        this.apiOptions = res.result;
      });
    },
    saveOrEdite() {
      let flag = false;
      this.apiBoxList.forEach((apiBox, index) => {
        let refName = `form${index}`;
        try {
          this.$refs[refName][0].validate((valid) => {
            flag = !!valid;
          });
        } catch (e) {
          flag = false;
          throw new Error(e.toString());
        }
      });
      if (flag) {
        this.apiBoxList.forEach((apibox) => {
          let pars = {};
          apibox.parseParams.forEach((parse) => {
            pars[parse.key] = parse.value;
          });
          apibox.dataParse = JSON.stringify(pars);
          if (apibox.method === ApiEnum.API_TYPE_POST) {
            let obj = {};
            apibox.configParams.forEach((item) => {
              obj[item.key] = item.value;
            });
            apibox.body = JSON.stringify(obj);
          } else {
            // ?id=${id}&&name=${name}
            apibox.configParams.forEach((config, index) => {
              if (index === 0) {
                apibox.parameter = `?${config.key}=${config.value}`;
              } else {
                apibox.parameter += `&${config.key}=${config.value}`;
              }
            });
          }
        });

        this.apiBoxList.forEach((apiBox) => {
          let parameterMap = {};
          apiBox.configParams.forEach((con) => {
            parameterMap[con.key] = con.value ? con.value : null;
          });
          apiBox.parameterMap = parameterMap;
        });
        this.apiBoxList.forEach((apiBox) => {
          delete apiBox.configParams;
          apiBox.ascription = this.business;
        });

        if (this.type === "see") {
          postSaveOrEdite(this.apiBoxList).then((res) => {
            this.dialogVisible = false;
            this.$message({
              type: "success",
              message: "保存成功",
            });
            this.$parent.GetGlobalList(this.$parent.pageInfo);
          });
        } else {
          putSaveOrEdite(this.apiBoxList).then((res) => {
            this.dialogVisible = false;
            this.$message({
              type: "success",
              message: "保存成功",
            });
            this.$parent.DetailFlag = false;
            this.$parent.GetGlobalList(this.$parent.pageInfo);
          });
        }
      }
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
    deleteApiBox(index) {
      this.apiBoxList.splice(index, 1);
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
.next {
  @include primaryBtn;
}
.cancel {
  @include cancelBtn;
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
.el-form-item {
  margin-right: 20px;
}
.el-select {
  width: 215px;
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
