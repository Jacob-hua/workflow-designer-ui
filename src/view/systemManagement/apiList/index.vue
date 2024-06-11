<template>
  <div class="api-list">
    <div class="left-content">
      <span style="color: #fff;">业务: </span>
      <el-cascader
        style="width: 150px;margin-right: 10px;"
        size="mini"
        v-model="business"
        :options="options"
        :props="{
          emitPath: true,
          checkStrictly: true,
        }"
      ></el-cascader>
      <el-button type="primary" size="mini" @click="handlerToSearch">查询</el-button>
      <div class="left-content-title">
        <span>接口列表</span>
        <i class="el-icon-plus" @click.stop="handlerToOperate($event, null, null, 'grandParent')"></i>
      </div>
      <div class="table-content">
        <div
          :class="['table-content-item']"
          v-for="(item, index) in tableData"
          :key="index"
        >
          <div
            @click="handleNodeClick(index, item)"
            :class="['table-content-item-row', hoverIdx === index ? 'active' : '']"
          >
            <i v-show="currentIdx !== index" class="el-icon-caret-right"></i>
            <i v-show="currentIdx === index" class="el-icon-caret-bottom"></i>
            <!-- <span class="inline-st">{{ item.apiGroupName }}</span> -->
            <el-tooltip v-if="item.apiGroupName.length > 12" :open-delay="300" class="inline-st" effect="dark" :content="item.apiGroupName" placement="top">
              <span>{{item.apiGroupName}}</span>
            </el-tooltip>
            <span v-else class="inline-st">{{item.apiGroupName}}</span>
            <i class="el-icon-more more-icon" @click.stop="handlerToOperate($event, index, item, 'parent')"></i>
          </div>
          <div class="inner-content" v-if="currentIdx === index">
            <div
              :class="['inner-content-item', currentInnerIdx === idx ? 'active' : '']"
              v-for="(ps, idx) in innerTableData"
              :key="idx"
              @click.stop="handleInnerNodeClick(idx, ps)"
            >
              <span>{{ ps.requestName }}</span>
              <i class="el-icon-more more-icon" @click.stop="handlerToOperate($event, idx, ps, 'children')"></i>
            </div>
            <!-- <div v-show="!innerTableData.length" class="no-data">暂无数据</div> -->
          </div>
        </div>
      </div>
    </div>
    <div class="right-content" v-if="currentInnerIdx !== null">
      <div class="top-input-method">
        <el-input placeholder="请输入内容" v-model="searchApi" class="input-with-select" size="mini">
          <el-select v-model="methodType" slot="prepend" placeholder="请选择" size="mini" class="prepend-select">
            <el-option label="GET" value="get"></el-option>
            <el-option label="POST" value="post"></el-option>
            <el-option label="PUT" value="put"></el-option>
            <el-option label="DELETE" value="delete"></el-option>
          </el-select>
        </el-input>
        <el-button size="mini" type="primary" style="margin-left: 10px;" @click="handlerToSendApi">发送</el-button>
        <el-button size="mini" type="primary" style="margin-left: 10px;" @click="handlerToSaveApi">保存</el-button>
      </div>
      <div class="tab-params-list">
        <el-tabs v-model="activeName" @tab-click="handleClick" size="mini">
          <el-tab-pane label="请求头" name="headers">
            <headers-list ref="headersCom"></headers-list>
          </el-tab-pane>
          <el-tab-pane label="参数" name="params">
            <params-list ref="paramsCom"></params-list>
          </el-tab-pane>
          <el-tab-pane label="请求体" name="body">
            <bodys-list ref="bodysCom" @changeBodyType="changeBodyType"></bodys-list>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="params-inst">
        <div class="params-inst-title">
          <span>解析参数</span>
          <i class="el-icon-circle-plus-outline" @click="handlerToAddParamsStData"></i>
        </div>
        <div class="params-inst-content">
          <div
            class="params-inst-content-item"
            v-for="(item, index) in paramsStData"
            :key="index"
          >
            <span>{{ index + 1 }}.</span>
            <span>参数key</span>
            <el-input size="mini" v-model="item.resultName" style="width: 150px;" placeholder=""></el-input>
            <span>参数value</span>
            <el-input size="mini" v-model="item.resultField" style="width: 150px;" placeholder=""></el-input>
            <i class="el-icon-remove-outline" @click="handlerToDeleteItem(index)"></i>
          </div>
        </div>
      </div>
      <div class="response-content">
        <div class="response-content-title">
          <span>返回响应</span>
        </div>
        <el-input
          class="response-content-input"
          :autosize="true"
          type="textarea"
          readonly
          v-model="response"
        />
      </div>
    </div>
    <div v-if="tooltipData.length" :style="{...tooltipStyle}" class="tooltip-at-st">
      <div class="tooltip-at-st-item" v-for="(item, index) in tooltipData" :key="index" @click="handlerToSet(item)">{{ item.key }}</div>
    </div>
    <EditDialog ref="editDom" @changeName="changeName" />
    <AddGroupDialog ref="addGroupDom" @addGroup="addGroup" />
    <AddApiDialog ref="addApiDom" @addApi="addApi" />
  </div>
</template>

<script>
import {
  getGroupList,
  addGroupItem,
  editGroupItem,
  deleteGroupItem,
  getApiList,
  getApiResponse,
  updateApiItem,
  addApiList,
  deleteApiItem } from '@/api/systemManagement.js';
import ParamsList from './components/paramsList.vue'
import HeadersList from './components/headersList.vue'
import BodysList from './components/bodysList.vue'
import EditDialog from './components/editDialog.vue'
import AddGroupDialog from './components/addGroupDialog.vue'
import AddApiDialog from './components/addApiDialog.vue'
export default {
  components: {
    ParamsList,
    HeadersList,
    BodysList,
    EditDialog,
    AddGroupDialog,
    AddApiDialog
  },
  data() {
    return {
      business: [],
      options: [],
      searchApi: '',
      methodType: 'get',
      activeName: 'headers',
      tableData: [],
      innerTableData: [],
      currentIdx: null,
      hoverIdx: null,
      innerHoverIdx: null,
      currentInnerIdx: null,
      tooltipData: [],
      paramsStData: [],
      tooltipStyle: {
        top: 0,
        left: 0
      },
      response: ''
    }
  },
  created() {
    this.$store.dispatch('config/dispatchProjectOriganizations').then(() => {
      this.options = this.$store.state.config.organizations
    })
    this._getGroupList()
  },
  mounted() {
    window.addEventListener('click', this.initClick)
  },
  beforeDestroy() {
    window.removeEventListener('click', this.initClick)
  },
  watch: {
    searchApi(newV) {
      this.innerTableData[this.currentInnerIdx].requestAddr = newV
    },
    methodType(newV) {
      this.innerTableData[this.currentInnerIdx].requestWay = newV
    }
  },
  methods: {
    async _getGroupList() {
      const result = await getGroupList({
        limit: 10000,
        page: 1,
        applicationId: this.business[2] ?? '',
        tenantId: this.business[0] ?? '',
        projectId: this.business[1] ?? ''
      }).catch(err => {
        this.$message.error(err.msg)
      })
      if (result?.code === '200') {
        this.tableData = result.data.dataList
      }
    },
    async _addGroupItem(params) {
      const result = await addGroupItem(params).catch(err => { this.$message.error(err.msg) })
      if (result?.code === '200') {
        this.$message.success('分组添加成功')
        this.currentIdx += 1
        this._getGroupList()
        this.$refs.addGroupDom.dialogVisible = false;
      } else {
        this.$message.error(result.msg)
      }
    },
    async _editGroupItem(params, val) {
      const result = await editGroupItem(params).catch(err => { this.$message.error(err.msg) })
      if (result?.code === '200') {
        this.$message.success('分组编辑成功')
        this.tableData[this.hoverIdx].apiGroupName = val
        this.$refs.editDom.dialogVisible = false;
      } else {
        this.$message.error(result.msg)
      }
    },
    async _deleteGroupItem(params) {
      const result = await deleteGroupItem(params).catch(err => { this.$message.error(err.msg) })
      if (result?.code === '200') {
        this.$message.success('分组删除成功')
        this.currentIdx -= 1
        this._getGroupList()
      } else {
        this.$message.error(result.msg)
      }
    },
    async _getApiList(params) {
      this.innerTableData = [];
      const result = await getApiList(params).catch(err => {
        this.$message.error(err.msg)
      })
      if (result?.code === '200') {
        this.innerTableData = result.data.dataList
      }
    },
    async _addApiList(params) {
      const result = await addApiList(params).catch(err => {
        this.$message.error(err.msg)
      })
      if (result?.code === '200') {
        this.$message.success('接口保存成功')
      } else {
        this.$message.error(result.msg)
      }
    },
    async _updateApiItem(params, val = undefined) {
      if (val) {
        params.requestName = val
      }
      const result = await updateApiItem(params).catch(err => {
        this.$message.error(err.msg)
      })
      if (result?.code === '200') {
        this.$message.success('接口编辑成功')
        if (val) {
          this.innerTableData[this.innerHoverIdx].requestName = val
        }
        this.$refs.editDom.dialogVisible = false;
      } else {
        this.$message.error(result.msg)
      }
    },
    async _deleteApiItem(params) {
      const result = await deleteApiItem(params).catch(err => {
        this.$message.error(err.msg)
      })
      if (result?.code === '200') {
        this.$message.success('接口删除成功')
        this._getApiList({
          limit: 10000,
          page: 1,
          requestGroup: this.tableData[this.currentIdx].apiGroupId
        })
      } else {
        this.$message.error(result.msg)
      }
    },
    async _getApiResponse(params) {
      const result = await getApiResponse(params)
      let newRes = ''
      if (result.code === '200') {
        newRes = result.data ?? ''
      } else {
        newRes = result.msg ?? '接口报错'
      }
      let jsonStr = JSON.stringify(newRes, null, 4)
      this.response = jsonStr
    },
    handlerToSearch() {
      this._getGroupList()
    },
    initClick(e) {
      const list = ['tooltip-at-st-item']
      if (!list.includes(e.target.className)) {
        this.tooltipStyle = { left: 0, top: 0 }
        this.tooltipData = []
      }
    },
    handlerToSendApi() {
      const datas = this.innerTableData[this.currentInnerIdx]
      const bodyData = {}
      const headerData = {}
      const paramData = {}
      datas.requestParams.bodyParams.forEach(item => {
        if (item.paramType === 'string') {
          bodyData[item.paramName] = typeof item.paramValue === 'object' ? item.paramValue[0] : item.paramValue
        } else if (item.paramType === 'number') {
          bodyData[item.paramName] = typeof item.paramValue === 'object' ? Number(item.paramValue[0]) : Number(item.paramValue)
        } else if (item.paramType === 'bool') {
          bodyData[item.paramName] = typeof item.paramValue === 'object' ? (item.paramValue[0] === 'true') : (item.paramValue === 'true')
        } else {
          bodyData[item.paramName] = item.paramValue
        }
      })
      datas.requestHeaders.forEach(item => {
        if (item.headerType === 'string') {
          headerData[item.headerName] = item.headerValue
        } else if (item.headerType === 'number') {
          headerData[item.headerName] = Number(item.headerValue)
        } else if (item.headerType === 'bool') {
          headerData[item.headerName] = item.headerValue === 'true'
        }
      })
      datas.requestParams.queryStringParams.forEach(item => {
        if (item.paramType === 'string') {
          paramData[item.paramName] = typeof item.paramValue === 'object' ? item.paramValue[0] : item.paramValue
        } else if (item.paramType === 'number') {
          paramData[item.paramName] = typeof item.paramValue === 'object' ? Number(item.paramValue[0]) : Number(item.paramValue)
        } else if (item.paramType === 'bool') {
          paramData[item.paramName] = typeof item.paramValue === 'object' ? (item.paramValue[0] === 'true') : (item.paramValue === 'true')
        } else {
          paramData[item.paramName] = item.paramValue
        }
      })
      this._getApiResponse({
        "bodyType": datas.requestParams.bodyType,
        "requestAddr": datas.requestAddr,
        "requestBodyData": bodyData,
        "requestHeaderData": headerData,
        "requestQueryData": paramData,
        "requestWay": datas.requestWay
      })
    },
    handlerToSaveApi() {
      const data = this.innerTableData[this.currentInnerIdx]
      if (data.apiId === '') {
        this._addApiList({
          ...data
        })
      } else {
        this._updateApiItem({
          ...data
        }, data.requestName) 
      }
    },
    handleClick() {
      console.log(this.activeName)
    },
    handleNodeClick(index, data) {
      if (index === this.currentIdx) return;
      this.currentInnerIdx = null
      this.currentIdx = index
      this.tooltipStyle = { left: 0, top: 0 }
      this.tooltipData = []
      this.hoverIdx = null
      this.innerHoverIdx = null
      this._getApiList({
        limit: 10000,
        page: 1,
        requestGroup: data.apiGroupId
      })
      this.response = ''
    },
    handleInnerNodeClick(index, data) {
      this.currentInnerIdx = index
      this.tooltipStyle = { left: 0, top: 0 }
      this.tooltipData = []
      this.hoverIdx = null
      this.innerHoverIdx = null
      this.methodType = this.innerTableData[this.currentInnerIdx].requestWay
      this.searchApi = this.innerTableData[this.currentInnerIdx].requestAddr
      setTimeout(() => {
        this.$refs.headersCom.tableData = this.innerTableData[this.currentInnerIdx].requestHeaders
        this.$refs.paramsCom.tableData = this.innerTableData[this.currentInnerIdx].requestParams.queryStringParams
        this.paramsStData = this.innerTableData[this.currentInnerIdx].requestResults
        this.$refs.bodysCom.getBodyData({
          bodyParams: this.innerTableData[this.currentInnerIdx].requestParams.bodyParams,
          bodyType: this.innerTableData[this.currentInnerIdx].requestParams.bodyType
        })
        this.response = ''
      }, 20);
    },
    handlerToOperate(e, index, data, type) {
      e.stopPropagation();
      if (type === 'grandParent') {
        this.$refs.addGroupDom.handlerToOpenClose();
        return;
      }
      const { left, top } = e.target.getBoundingClientRect();
      this.tooltipStyle.top = top + 20 + 'px'
      this.tooltipStyle.left = left + 'px'
      this.hoverIdx = null
      this.innerHoverIdx = null
      if (type === 'parent') {
        this.tooltipData = [
          { key: '编辑', value: 'edit' },
          { key: '新增', value: 'add' },
          { key: '删除', value: 'delete' },
        ]
        this.hoverIdx = index
      } else {
        this.tooltipData = [
          { key: '编辑', value: 'edit' },
          { key: '删除', value: 'delete' },
        ]
        this.innerHoverIdx = index
      }
    },
    handlerToSet(data) {
      if (data.value === 'edit') {
        this.$refs.editDom.handlerToOpenClose();
        if (this.hoverIdx !== null) {
          this.$refs.editDom.modelVal = this.tableData[this.hoverIdx].apiGroupName
        }
        if (this.innerHoverIdx !== null) {
          this.$refs.editDom.modelVal = this.innerTableData[this.innerHoverIdx].requestName
        }
      } else if (data.value === 'delete') {
        if (this.hoverIdx !== null) {
          this.$confirm(`是否确定删除${this.tableData[this.hoverIdx].apiGroupName}?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this._deleteGroupItem({
              apiGroupId: this.tableData[this.hoverIdx].apiGroupId
            })
          })
        }
        if (this.innerHoverIdx !== null) {
          this.$confirm(`是否确定删除${this.innerTableData[this.innerHoverIdx].requestName}?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this._deleteApiItem({
                apiId: this.innerTableData[this.innerHoverIdx].apiId
              })
          })
        }
      } else if (data.value === 'add') {
        if (this.hoverIdx !== null) {
          this.$refs.addApiDom.handlerToOpenClose();
          this.currentIdx = this.hoverIdx
          this.$refs.addApiDom.modelVal = ''
          // this.innerTableData = []
        }
      }
      // else if (data.value === 'add' && this.hoverIdx !== null) {
      // }
      this.tooltipData = []
    },
    changeName(val) {
      if (this.hoverIdx !== null) {
        this._editGroupItem({
          "apiGroupId": this.tableData[this.hoverIdx].apiGroupId,
          "apiGroupName": val,
          "apiGroupParentId": "",
          "applicationId": "-1",
          "projectId": "",
          "tenantId": ""
        }, val)
        // this.tableData[this.hoverIdx].apiGroupName = val
      }
      if (this.innerHoverIdx !== null) {
        // this._updateApiItem({
        //   ...this.innerTableData[this.innerHoverIdx]
        // }, val)
        this.$refs.editDom.dialogVisible = false;
        this.innerTableData[this.innerHoverIdx].requestName = val
      }
      setTimeout(() => {
        this.hoverIdx = null
        this.innerHoverIdx = null
      }, 1000)
    },
    addGroup(obj) {
      const params = {
        apiGroupName: obj.val,
        apiGroupParentId: '-1',
        applicationId: obj.business[2] ?? '',
        tenantId: obj.business[0] ?? '',
        projectId: obj.business[1] ?? ''
      }
      this._addGroupItem(params)
    },
    addApi(val) {
      this.innerTableData.push({
        "apiId": "",
        "applicationId": "",
        "projectId": "",
        "requestAddr": "",
        "requestGroup": this.tableData[this.currentIdx].apiGroupId,
        "requestHeaders": [],
        "requestName": val,
        "requestParams": {
          "bodyParams": [],
          "bodyType": "",
          "queryStringParams": []
        },
        "requestResults": [],
        "requestWay": "",
        "tenantId": ""
      })
      setTimeout(() => {
        this.currentInnerIdx = this.innerTableData.length - 1
        this.handleInnerNodeClick(this.currentInnerIdx, this.innerTableData[this.currentInnerIdx])
      }, 20)
    },
    handlerToAddParamsStData() {
      this.paramsStData.push({
        resultName: '',
        resultField: ''
      })
    },
    handlerToDeleteItem(index) {
      this.paramsStData.splice(index, 1)
    },
    changeBodyType(val) {
      this.innerTableData[this.currentInnerIdx].requestParams.bodyType = val
    }
  }
}
</script>

<style lang="scss" scoped>
.api-list {
  width: 100%;
  height: 640px;
  display: flex;
  justify-content: space-between;
  .tooltip-at-st {
    position: fixed;
    width: 100px;
    z-index: 999;
    height: auto;
    background-color: rgba(255, 255, 255, 1);
    .tooltip-at-st-item {
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #000;
      cursor: pointer;
      &:hover {
        background-color: #409EFF;
        color: #fff;
      }
    }
  }
  .left-content {
    width: 18%;
    height: 100%;
    border-right: 1px solid rgba(255, 255, 255, 0.3);
    .left-content-title {
      width: 100%;
      height: 30px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      font-size: 16px;
      margin-top: 10px;
      color: #fff;
      .el-icon-plus {
        float: right;
        margin-top: 5px;
        margin-right: 10px;
        font-size: 18px;
        cursor: pointer;
      }
    }
    .table-content {
      width: 100%;
      height: calc(100% - 30px - 50px);
      padding: 10px 10px;
      box-sizing: border-box;
      overflow: hidden;
      overflow-y: auto;
      .table-content-item {
        width: 100%;
        min-height: 30px;
        line-height: 30px;
        font-size: 14px;
        color: #fff;
        overflow: hidden;
        cursor: pointer;
        .table-content-item-row {
          .el-icon-caret-right, .el-icon-caret-bottom {
            margin-right: 5px;
            vertical-align: middle;
          }
          .inline-st {
            display: inline-block;
            width: 70%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            vertical-align: middle;
          }
          &.active {
            background-color: rgba(255, 255, 255, 0.15);
            .more-icon {
              display: inline-block;
            }
          }
          &:hover {
            background-color: rgba(255, 255, 255, 0.15);
            .more-icon {
              display: inline-block;
            }
          }
          .more-icon {
            float: right;
            margin-top: 10px;
            margin-right: 10px;
            display: none;
            &:hover {
              color: #fff;
            }
          }
        }
        .inner-content {
          width: 100%;
          height: auto;
          overflow: hidden;
          padding-left: 10px;
          box-sizing: border-box;
          .no-data {
            width: 100%;
            padding: 0px 0px;
            text-align: center;
            font-size: 14px;
            box-sizing: border-box;
            color: rgba(255, 255, 255, 0.5);
          }
          .inner-content-item {
            width: 100%;
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            color: #fff;
            box-sizing: border-box;
            padding-left: 10px;
            span {
              display: inline-block;
              width: 80%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            &:hover {
              background-color: rgba(255, 255, 255, 0.15);
              .more-icon {
                display: inline-block;
              }
            }
            .more-icon {
              float: right;
              margin-top: 10px;
              margin-right: 10px;
              display: none;
              &:hover {
                color: #fff;
              }
            }
            &.active {
              background-color: #409EFF;
            }
          }
        }
      }
    }
  }
  .right-content {
    width: 80%;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    .top-input-method {
      .input-with-select {
        width: 85%;
        .prepend-select {
          width: 100px;
          background-color: #212739;
          color: #fff;
        }
        ::v-deep .el-input-group__prepend {
          background-color: #212739 !important;
          border: 1px solid #333333;
          box-sizing: border-box;
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
    .params-inst {
      width: 100%;
      height: 180px;
      margin-top: 20px;
      .params-inst-title {
        width: 100%;
        height: 30px;
        line-height: 30px;
        color: #fff;
        font-size: 16px;
        .el-icon-circle-plus-outline {
          margin-left: 10px;
          font-size: 20px;
          vertical-align: middle;
          cursor: pointer;
        }
      }
      .params-inst-content {
        width: 100%;
        height: 150px;
        overflow: hidden;
        overflow-y: auto;
        color: #fff;
        .params-inst-content-item {
          margin-bottom: 10px;
          span {
            display: inline-block;
            margin: 0 20px;
          }
          .el-icon-remove-outline {
            font-size: 20px;
            color: #f00;
            margin-left: 10px;
            vertical-align: middle;
          }
        }
      }
    }
    .response-content {
      width: 100%;
      height: 300px;
      .response-content-title {
        width: 100%;
        height: 30px;
        line-height: 30px;
        color: #fff;
        font-size: 16px;
      }
      .response-content-input {
        margin-top: 10px;
      }
    }
  }
}
</style>
