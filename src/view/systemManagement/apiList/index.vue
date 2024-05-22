<template>
  <div class="api-list">
    <div class="left-content">
      <div class="left-content-title">接口列表</div>
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
            <span>{{ item.apiGroupName }}</span>
            <i class="el-icon-more more-icon" @click.stop="handlerToOperate($event, index, item, 'parent')"></i>
          </div>
          <div class="inner-content" v-if="currentIdx === index">
            <div
              :class="['inner-content-item', currentInnerIdx === idx || innerHoverIdx === idx ? 'active' : '']"
              v-for="(ps, idx) in innerTableData"
              :key="idx"
              @click.stop="handleInnerNodeClick(idx, ps)"
            >
              <span>{{ ps.requestName }}</span>
              <i class="el-icon-more more-icon" @click.stop="handlerToOperate($event, idx, ps, 'children')"></i>
            </div>
          </div>
        </div>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="page.total">
      </el-pagination>
    </div>
    <div class="right-content">
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
            <el-input size="mini" v-model="item.key" style="width: 150px;" placeholder=""></el-input>
            <span>参数value</span>
            <el-input size="mini" v-model="item.value" style="width: 150px;" placeholder=""></el-input>
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
          :autosize="{ minRows: 10, maxRows: 10}"
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
  </div>
</template>

<script>
import ParamsList from './components/paramsList.vue'
import HeadersList from './components/headersList.vue'
import BodysList from './components/bodysList.vue'
import EditDialog from './components/editDialog.vue'
export default {
  components: {
    ParamsList,
    HeadersList,
    BodysList,
    EditDialog
  },
  data() {
    return {
      searchApi: '',
      methodType: 'GET',
      activeName: 'headers',
      tableData: [
        { apiGroupName: '123', apiGroupId: '11111', apiGroupParentId: '-1', children: [] },
        { apiGroupName: '1234', apiGroupId: '111111', apiGroupParentId: '-1', children: [] },
        { apiGroupName: '1235', apiGroupId: '111111', apiGroupParentId: '-1', children: [] }
      ],
      innerTableData: [
        { requestName: '测试接口1' },
        { requestName: '测试接口2' }
      ],
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
      page: {
        size: 10,
        number: 1,
        total: 10
      },
      response: `
      {
        "code": "200",
        "msg": "操作成功",
        "data": {
          "id": "2",
          "name": "康明斯项目-智慧运维",
          "parentId": "-1",
          "sortNum": null,
          "remark": "智慧运维",
          "abbre": "zhyw",
          "bindRelId": "",
          "startFormVersionId": "",
          "businessType": "2",
          "childrenList": [
            {
              "id": "3",
              "name": "周期性",
              "parentId": "2",
              "sortNum": null,
              "remark": "周期性",
              "abbre": "zq",
              "bindRelId": "",
              "startFormVersionId": "",
              "businessType": "1",
              "childrenList": [
                {
                  "id": "1771340944120758274",
                  "name": "巡检",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "1783387044411396098",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1773166998625198081",
                  "name": "测试周期性",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "1782313793161625601",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1773174390427492353",
                  "name": "测试01",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "1783387252016861186",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1778588481265401858",
                  "name": "测试03-03",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "1783011704405049346",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1782972990186340353",
                  "name": "测试知识库组件",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "1783316731447271426",
                  "startFormVersionId": "1773183641199841282",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1782972990119231490",
                  "name": "12",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "1783766173212332034",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1782972990186340354",
                  "name": "12",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1782972990370889730",
                  "name": "12",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "1783317417127895042",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1782972990307975170",
                  "name": "21",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1782972990245060610",
                  "name": "12",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1782972990119231491",
                  "name": "12",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "1782977365558509569",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1782972990186340355",
                  "name": "1212",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "1784413319406116865",
                  "startFormVersionId": "1773183641199841282",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1782972990370889731",
                  "name": "12",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1782972990307975171",
                  "name": "12",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1782972990245060611",
                  "name": "12",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1782972990119231492",
                  "name": "1212",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1782972990186340356",
                  "name": "21",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1782972990370889732",
                  "name": "211",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1782972990307975172",
                  "name": "21",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1782972990245060612",
                  "name": "12",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1782972990119231493",
                  "name": "12",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1782972990370889733",
                  "name": "21",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1782972990245060613",
                  "name": "12",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                },
                {
                  "id": "1782972990370889734",
                  "name": "2",
                  "parentId": "3",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "1783299425384071175",
                  "startFormVersionId": "",
                  "businessType": "1",
                  "childrenList": []
                }
              ]
            },
            {
              "id": "4",
              "name": "非周期性",
              "parentId": "2",
              "sortNum": null,
              "remark": "非周期性",
              "abbre": "fzq",
              "bindRelId": "",
              "startFormVersionId": "",
              "businessType": "2",
              "childrenList": [
                {
                  "id": "1771412698545549314",
                  "name": "抢修",
                  "parentId": "4",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "",
                  "startFormVersionId": "",
                  "businessType": "2",
                  "childrenList": [
                    {
                      "id": "1771412789113131009",
                      "name": "抢修车间1",
                      "parentId": "1771412698545549314",
                      "sortNum": null,
                      "remark": "",
                      "abbre": "",
                      "bindRelId": "1783374159664705537",
                      "startFormVersionId": "",
                      "businessType": "2",
                      "childrenList": []
                    },
                    {
                      "id": "1783762947788361729",
                      "name": "抢修车间2",
                      "parentId": "1771412698545549314",
                      "sortNum": null,
                      "remark": "",
                      "abbre": "",
                      "bindRelId": "1784750484111564802",
                      "startFormVersionId": "1783755971612172291",
                      "businessType": "2",
                      "childrenList": []
                    },
                    {
                      "id": "1785132742262968322",
                      "name": "抢修车间3",
                      "parentId": "1771412698545549314",
                      "sortNum": null,
                      "remark": "",
                      "abbre": "",
                      "bindRelId": "1785133618511794178",
                      "startFormVersionId": "1785129773756878849",
                      "businessType": "2",
                      "childrenList": []
                    }
                  ]
                },
                {
                  "id": "1773166998654558209",
                  "name": "测试非周期性",
                  "parentId": "4",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "1782313828733517826",
                  "startFormVersionId": "",
                  "businessType": "2",
                  "childrenList": []
                },
                {
                  "id": "1780480896189636609",
                  "name": "测试串并行条件",
                  "parentId": "4",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "1782966745991852034",
                  "startFormVersionId": "",
                  "businessType": "2",
                  "childrenList": []
                },
                {
                  "id": "1782973245036445697",
                  "name": "测试一下",
                  "parentId": "4",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "",
                  "startFormVersionId": "",
                  "businessType": "2",
                  "childrenList": []
                },
                {
                  "id": "1782973245036445698",
                  "name": "121",
                  "parentId": "4",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "1784488397682589698",
                  "startFormVersionId": "",
                  "businessType": "2",
                  "childrenList": [
                    {
                      "id": "1785188106681503746",
                      "name": "抢修1",
                      "parentId": "1782973245036445698",
                      "sortNum": null,
                      "remark": "",
                      "abbre": "",
                      "bindRelId": "",
                      "startFormVersionId": "",
                      "businessType": "2",
                      "childrenList": []
                    }
                  ]
                },
                {
                  "id": "1782978931631931393",
                  "name": "测试打卡",
                  "parentId": "4",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "1783049560699801602",
                  "startFormVersionId": "1777169089000374274",
                  "businessType": "2",
                  "childrenList": []
                },
                {
                  "id": "1783757788609892353",
                  "name": "H-测试-H",
                  "parentId": "4",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "1784414604050128897",
                  "startFormVersionId": "",
                  "businessType": "2",
                  "childrenList": []
                },
                {
                  "id": "1788089495311953922",
                  "name": "陕汽",
                  "parentId": "4",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "",
                  "startFormVersionId": "",
                  "businessType": "2",
                  "childrenList": [
                    {
                      "id": "1788090846209191937",
                      "name": "蒸汽系统",
                      "parentId": "1788089495311953922",
                      "sortNum": null,
                      "remark": "",
                      "abbre": "",
                      "bindRelId": "",
                      "startFormVersionId": "",
                      "businessType": "2",
                      "childrenList": []
                    },
                    {
                      "id": "1788090846146277377",
                      "name": "天然气系统",
                      "parentId": "1788089495311953922",
                      "sortNum": null,
                      "remark": "",
                      "abbre": "",
                      "bindRelId": "",
                      "startFormVersionId": "",
                      "businessType": "2",
                      "childrenList": []
                    },
                    {
                      "id": "1788090846272106498",
                      "name": "配电系统",
                      "parentId": "1788089495311953922",
                      "sortNum": null,
                      "remark": "",
                      "abbre": "",
                      "bindRelId": "",
                      "startFormVersionId": "",
                      "businessType": "2",
                      "childrenList": []
                    },
                    {
                      "id": "1788090846209191938",
                      "name": "空压系统",
                      "parentId": "1788089495311953922",
                      "sortNum": null,
                      "remark": "",
                      "abbre": "",
                      "bindRelId": "",
                      "startFormVersionId": "",
                      "businessType": "2",
                      "childrenList": []
                    },
                    {
                      "id": "1788090846146277378",
                      "name": "污水系统",
                      "parentId": "1788089495311953922",
                      "sortNum": null,
                      "remark": "",
                      "abbre": "",
                      "bindRelId": "",
                      "startFormVersionId": "",
                      "businessType": "2",
                      "childrenList": []
                    },
                    {
                      "id": "1788090846146277379",
                      "name": "自来水系统",
                      "parentId": "1788089495311953922",
                      "sortNum": null,
                      "remark": "",
                      "abbre": "",
                      "bindRelId": "",
                      "startFormVersionId": "",
                      "businessType": "2",
                      "childrenList": []
                    },
                    {
                      "id": "1788090846146277380",
                      "name": "空调/采暖系统",
                      "parentId": "1788089495311953922",
                      "sortNum": null,
                      "remark": "",
                      "abbre": "",
                      "bindRelId": "",
                      "startFormVersionId": "",
                      "businessType": "2",
                      "childrenList": []
                    }
                  ]
                },
                {
                  "id": "1788089495311953923",
                  "name": "test1",
                  "parentId": "4",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "",
                  "startFormVersionId": "",
                  "businessType": "2",
                  "childrenList": []
                },
                {
                  "id": "1791277036761800706",
                  "name": "测试组件",
                  "parentId": "4",
                  "sortNum": null,
                  "remark": "",
                  "abbre": "",
                  "bindRelId": "",
                  "startFormVersionId": "",
                  "businessType": "2",
                  "childrenList": []
                }
              ]
            }
          ]
        }
      }
      `
    }
  },
  mounted() {
    window.addEventListener('click', this.initClick)
  },
  beforeDestroy() {
    window.removeEventListener('click', this.initClick)
  },
  methods: {
    initClick(e) {
      const list = ['el-icon-more more-icon', 'tooltip-at-st-item']
      if (!list.includes(e.target.className)) {
        this.tooltipStyle = { left: 0, top: 0 }
        this.tooltipData = []
        // this.hoverIdx = null
        // this.innerHoverIdx = null
      }
    },
    handlerToSendApi() {
      console.log(this.searchApi, this.methodType)
    },
    handleClick() {
      console.log(this.activeName)
    },
    handleNodeClick(index, data) {
      this.currentInnerIdx = null
      this.currentIdx = index
    },
    handleInnerNodeClick(index, data) {
      console.log(data)
      this.currentInnerIdx = index
    },
    handlerToOperate(e, index, data, type) {
      const { left, top } = e.target.getBoundingClientRect();
      this.tooltipStyle.top = top + 20 + 'px'
      this.tooltipStyle.left = left + 'px'
      this.hoverIdx = null
      this.innerHoverIdx = null
      if (type === 'parent') {
        this.tooltipData = [
          { key: '编辑', value: 'edit' },
          { key: '增加', value: 'add' },
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
      console.log(data)
      if (data.value === 'edit') {
        this.$refs.editDom.handlerToOpenClose();
      }
      this.tooltipData = []
      
    },
    changeName(val) {
      if (this.hoverIdx !== null) {
        this.tableData[this.hoverIdx].apiGroupName = val
      }
      if (this.innerHoverIdx !== null) {
        this.innerTableData[this.innerHoverIdx].requestName = val
      }
      this.hoverIdx = null
      this.innerHoverIdx = null
    },
    handlerToAddParamsStData() {
      this.paramsStData.push({
        key: '',
        value: ''
      })
    },
    handlerToDeleteItem(index) {
      this.paramsStData.splice(index, 1)
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
      color: #fff;
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
          .inner-content-item {
            width: 100%;
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            color: #fff;
            box-sizing: border-box;
            padding-left: 10px;
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
