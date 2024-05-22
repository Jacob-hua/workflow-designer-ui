<template>
    <div class="params-list">
      <div class="params-table">
        <div class="table-title">
          <div v-for="item in tableTitle" :key="item.value" class="table-title-item" :style="{ width: item.width }">{{ item.label }}</div>
        </div>
        <div class="table-data-list">
          <div v-for="(tb, index) in tableData" :key="tb.index" class="table-data-item">
            <div
              v-for="col in tableTitle.slice(0, 5)"
              :key="col.value"
              class="table-data-item-col"
              :style="{ width: col.width }"
              @click="handlerToClick($event, tb, col.value)"
              >{{ tb[col.value] }}</div>
            <div class="operation-table-item" style="width: 10%">
              <i class="el-icon-remove-outline" @click="handerToDelete(index)"></i>
            </div>
          </div>
          <div class="add-table-item">
            <el-button type="success" icon="el-icon-plus" size="mini" @click="handlerToAdd">添加</el-button>
          </div>
        </div>
        <el-input
          class="input-wrapper"
          ref="inputWrapper"
          v-show="['paramsName', 'paramsValue', 'paramsDes'].includes(currentType)"
          v-model="inputValue"
          @change="handlerToChangeInput"
          @blur="handlerToBlur"
          :style="{...styleData}"
        ></el-input>
        <el-select
          class="input-wrapper"
          v-show="['paramsType', 'valueType'].includes(currentType)"
          @blur="handlerToBlur"
          @change="handlerToChangeSelect"
          :style="{...styleData}"
          v-model="selectValue">
          <el-option
            v-for="item in getOptions(currentType)"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        paramsList: [],
        currentType: '',
        currentRow: {},
        tableTitle: [
          { label: '参数名', value: 'paramsName', width: '20%' },
          { label: '类型', value: 'paramsType', width: '10%' },
          { label: '参数值', value: 'paramsValue', width: '20%' },
          { label: '说明', value: 'paramsDes', width: '25%' },
          { label: '取值方式', value: 'valueType', width: '15%' },
          { label: '操作', value: 'paramsOperation', width: '10%' },
        ],
        tableData: [
          { paramsName: '', paramsValue: '', paramsType: '', paramsDes: '', valueType: '' }
        ],
        styleData: {
          width: '',
          height: '30px',
          left: '',
          top: ''
        },
        inputValue: '',
        selectValue: '',
        options: [
          { label: '字符串', value: '字符串' },
          { label: '数字', value: '数字' },
          { label: '布尔', value: '布尔' }
        ]
      }
    },
    computed: {
      getOptions: () => (val) => {
        if (val === 'paramsType') {
          return [
            { label: '字符串', value: '字符串' },
            { label: '数字', value: '数字' },
            { label: '布尔', value: '布尔' }
          ]
        }
        if (val === 'valueType') {
          return [
            { label: '固定值', value: 'fixed' },
            { label: '变量', value: 'variable' }
          ]
        }
      }
    },
    methods: {
      inputFocus() {
        const input = this.$refs.inputWrapper.$el.getElementsByTagName('input')[0]
        if (input) {
            setTimeout(() => {
            input.focus()
            }, 20)
        }
      },
      handlerToClick(e, value, key) {
        const { width, left, top } = e.target.getBoundingClientRect()
        this.currentRow = value
        this.currentType = key
        if (key === 'paramsType') {
          this.selectValue = value[key]
        } else {
          this.inputValue = value[key]
        }
        this.styleData = {
          width: width + 'px',
          height: '30px',
          left: left + 'px',
          top: top + 'px'
        }
        const input = this.$refs.inputWrapper.$el.getElementsByTagName('input')[0]
        this.inputFocus()
      },
      handlerToChangeInput() {
        this.currentRow[this.currentType] = this.inputValue
      },
      handlerToChangeSelect() {
        this.currentRow[this.currentType] = this.selectValue
      },
      handlerToBlur() {
        setTimeout(() => {
          this.inputValue = ''
          this.selectValue = ''
          this.currentType = ''
          // this.currentRow = {}
        }, 50)
      },
      handerToDelete(index) {
        this.tableData.splice(index, 1)
      },
      handlerToAdd() {
        this.tableData.push({ paramsName: '', paramsValue: '', paramsType: '', paramsDes: '', valueType: '' })
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .params-list {
    overflow: hidden;
    .params-table {
      width: 100%;
      min-height: 100px;
      max-height: 200px;
      border: 1px solid #333333;
      box-sizing: border-box;
      overflow: hidden;
      overflow-y: auto;
      .input-wrapper {
        position: fixed;
        ::v-deep .el-input__inner {
          height: 30px;
        }
      }
      .table-title {
        width: 100%;
        height: 30px;
        border-bottom: 1px solid #333333;
        box-sizing: border-box;
        display: flex;
        .table-title-item {
          height: inherit;
          line-height: 30px;
          text-align: center;
          color: #fff;
          border-right: 1px solid #333333;
          &:last-child {
            border-right: hidden;
          }
        }
      }
      .table-data-list {
        width: 100%;
        height: calc(100% - 30px);
        .table-data-item {
          width: 100%;
          height: 30px;
          border-bottom: 1px solid #333333;
          box-sizing: border-box;
          display: flex;
          &:last-child {
            border-bottom: hidden;
          }
          .table-data-item-col {
            height: 30px;
            line-height: 30px;
            text-align: center;
            color: #fff;
            border-right: 1px solid #333333;
            &:hover {
              border: 1px solid #409EFF;
            }
          }
          .operation-table-item {
            text-align: center;
            color: #fff;
            font-size: 20px;
          }
        }
        .add-table-item {
          height: 40px;
          padding: 5px 0 0 45%;
        }
      }
    }
  }
  </style>
  