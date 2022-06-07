<template>
  <div>
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
            <el-form  ref="form"  label-width="80px">
              <div class="cardBox">
                <div style="display: flex; flex-wrap: wrap">
                  <el-form-item label="api名称">
                    <el-input v-model="item.name"></el-input>
                  </el-form-item>
                  <el-form-item label="api标识">
                    <el-input v-model="item.apiMark"></el-input>
                  </el-form-item>
                  <el-form-item label="主机地址">
                    <el-input v-model="item.host"></el-input>
                  </el-form-item>
                  <el-form-item label="访问路径">
                    <el-input v-model="item.path"></el-input>
                  </el-form-item>
                  <el-form-item label="api类型">
                    <el-select v-model="item.type" placeholder="请选择api类型">
                      <el-option
                          v-for="(item,idxe) in apiOptions"
                          :key="idxe"
                          :label="item.typeName"
                          :value="item.type">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <p @click="addApiType" style="color: rgb(26, 136, 255); font-size: 14px">未找到类型点击添加</p>
                  <el-form-item label="请求类型">
                    <el-select v-model="item.method" placeholder="请选择api类型">
                      <el-option
                          v-for="item in methodsOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.label">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="请求头">
                    <el-input v-model="item.headers"></el-input>
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
                <div class="config_tit">
                  <span style="color: #1d89ff">解析参数</span> <i @click="addParseParams(index)"  class="el-icon-circle-plus-outline"></i>
                </div>
                <div v-for="(parse,idxs) in item.parseParams" :key="idxs" class="params">
                  <el-form-item label="参数key">
                    <el-input v-model="parse.key"></el-input>
                  </el-form-item>
                  <el-form-item label="参数value">
                    <el-input v-model="parse.value"></el-input>
                  </el-form-item>
                  <i @click="deleteParseParams( index,idxs)" v-if="idx!== 0" class="el-icon-remove-outline"></i>
                </div>
                <el-button @click="excuteParse(item)" class="parse" type="primary">模拟解析</el-button>
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
        <el-button  @click=" dialogVisible = false; $emit('showAddOrEidtDailog','','pre')">上一步</el-button>
        <el-button  @click="saveOrEdite">保存</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
     </span>
    </el-dialog>

    <el-dialog
        title="添加API类型"
        :visible.sync="dialogVisible2"
        width="40%"
        append-to-body
    >
      <el-form  ref="form"  label-width="80px">
        <el-form-item label="类型">
          <el-input v-model="typeForm.type"></el-input>
        </el-form-item>
        <el-form-item label="类型名称">
          <el-input v-model="typeForm.typeName"></el-input>
        </el-form-item>
      </el-form>
       <span slot="footer" class="dialog-footer">
          <el-button  @click="saveApi">保存</el-button>
          <el-button @click="dialogVisible2 = false">取 消</el-button>
       </span>
    </el-dialog>
  </div>

</template>

<script>
import {
  apiTypeList, checkApiType,
  saveOrEdite, simulationRequest
} from "@/api/globalConfig";

import ApiEnum from "@/enum/ApiTypeEnum";

export default {
  name: "AddOrEidtDailog",
  props: {
    guideForm: Object,
    business: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible2: false,
      typeForm: {
        type: '',
        typeName: ''
      },
      jsonData: [],
      value: '',
      apiBoxList: [
        {
            ...this.guideForm,
            name: '', //api名称
            apiMark: '', // api标识
            type: '', // api类型,
            typeName: '', //api类型名称
            host: '',// 系统host
            path: '',// 请求路径
            method: '', //请求方式
            headers: '', //请求头信息
            parameter: '', // GET请求参数 eg: ?id=${id}&&name=${name}
            body: '', //POST请求参数 eg: {\"id\":\"${id}\",\"name\":\"${name}\"}
            dataParse: '', //解析配置
            isUse: 1, // 是否使用 1 使用 0禁用 2删除
            createTime: '', //创建时间
            createBy: this.$store.state.userInfo.name, //创建人
            tenantId: +this.$store.state.tenantId, //租户id
            configParams: [
              {
                key: '',
                value: ''
              }
            ],
            parseParams: [
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
      apiOptions: [],
      dialogVisible: false
    }
  },
  mounted() {
    this.apiTypeList()
  },
  methods: {
    saveApi() {
      // get(`/config/global/checkApiType?typeName=${params.typeName}&type=user&tenantId=18`);
      checkApiType({
        ...this.typeForm,
        tenantId: this.$store.state.tenantId,
        ascription: this.business
      }).then(res => {
        if (res.result) {
          this.apiOptions.push(this.typeForm)
          this.dialogVisible2 = false
        } else {
          this.$message({
            type: 'error',
            message: 'Api类型或类型名称重复'
          })
        }
      })

    },
    addApiType() {
      this.dialogVisible2 = true
      this.typeForm =  {
        type: '',
        typeName: ''
      }
    },

    excuteParse(api) {
      if (api.method === ApiEnum.API_TYPE_POST) {
        simulationRequest({
          "body": api.body,
          "headers": api.headers,
          "method": api.method,
          "url": api.url
        }).then(res => {
          this.jsonData = res
        })
      } else {
        if (api.parameter) {
          simulationRequest({
            "headers": api.headers,
            "method": api.method,
            "url": api.host + api.path + api.parameter
          }).then(res => {
            console.log(res)
            this.jsonData = res
          })
        } else {
          api.configParams.forEach((config,index) => {
            if (index === 0) {
              api.parameter = `?${config.key}=${config.value}`
            } else  {
              api.parameter += `&${config.key}=${config.value}`
            }
          })
          simulationRequest({
            "headers": api.headers,
            "method": api.method,
            "url": api.host + api.path + api.parameter
          }).then(res => {
            console.log(res)
            this.jsonData = res
          })
        }

      }

    },
    apiTypeList() {
      apiTypeList({
        tenantId: this.$store.state.tenantId,
        ascription: this.business
      }).then(res => {
          this.apiOptions = res.result
      })
    },
    saveOrEdite() {
      // dataParse {"userId":"$.result.account","userName":"$.result.name"}
      let pars = {}
      this.apiBoxList.forEach(apibox => {
        apibox.parseParams.forEach(parse => {
            pars[parse.key] =  parse.value
        })
        apibox.dataParse = JSON.stringify(pars)
        if (apibox.method === ApiEnum.API_TYPE_POST) {
          let obj = {}
            apibox.configParams.forEach(item=> {
              obj[item.key] = item.value
            })
          apibox.body = JSON.stringify(obj)
        } else {
          // ?id=${id}&&name=${name}
            apibox.configParams.forEach((config,index) => {
              if (index === 0) {
                apibox.parameter = `?${config.key}=${config.value}`
              } else  {
                apibox.parameter += `&${config.key}=${config.value}`
              }
            })
        }
      })


      let parameterMap = {}
      this.apiBoxList.forEach(apiBox => {
        apiBox.configParams.forEach(con => {
          parameterMap[con.key] = con.value? con.value : null
        })
        apiBox.parameterMap = parameterMap
      })
      this.apiBoxList.forEach(apiBox => {
        delete apiBox.configParams
        apiBox.ascription = this.business
      })
      saveOrEdite(this.apiBoxList).then(res => {
        this.dialogVisible = false
        this.$message({
          type:'success',
          message: '保存成功'
        })
        this.$parent.GetGlobalList(this.$parent.pageInfo)
      })
    },
    addApiBox() {

        this.apiBoxList.push(
            {
              source: this.apiBoxList[0].source, //系统名称
              sourceMark: this.apiBoxList[0].sourceMark, // 系统标识
              name: '', //api名称
              apiMark: '', // api标识
              type: '', // api类型,
              typeName: '', //api类型名称
              host: '',// 系统host
              path: '',// 请求路径
              method: '', //请求方式
              headers: '', //请求头信息
              parameter: '', // GET请求参数 eg: ?id=${id}&&name=${name}
              body: '', //POST请求参数 eg: {\"id\":\"${id}\",\"name\":\"${name}\"}
              dataParse: '', //解析配置
              isUse: 1, // 是否使用 1 使用 0禁用 2删除
              createTime: '', //创建时间
              createBy: this.$store.state.userInfo.name, //创建人
              tenantId: +this.$store.state.tenantId, //租户id
              configParams: [
                {
                  key: '',
                  value: ''
                }
              ],
              parseParams: [
                {
                  key: '',
                  value: ''
                }
              ]
            }
        )
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
    addParseParams(index) {
      this.apiBoxList[index].parseParams.push({
        key: '',
        value: ''
      })
    },
    deleteParseParams(parentIdx,idx) {
      this.apiBoxList[parentIdx].parseParams.splice(idx,1)
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