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
            >
            <div class="table-data-item-value-st" v-if="!getList(tb[col.value])" @click="handlerToClick($event, tb, col.value)">{{ tb[col.value] }}</div>
            <div v-if="col.value === 'paramValue' && getList(tb[col.value])" class="table-item-params-value">
              <div class="table-item-params-value-item" @click="handlerToClickValue($event, tb, vl, vlIdx)" v-for="(vl, vlIdx) in tb[col.value]">
                {{ vl }}
                <span class="right-opt" v-if="tb['paramType'] === 'list'">
                  <i class="el-icon-plus" @click.stop="handlerToAddValueData(tb[col.value], index)"></i>
                  <i class="el-icon-minus" @click.stop="handlerToDeleteValueData(tb[col.value], index)"></i>
                </span>
              </div>
            </div>
          </div>
          <div class="operation-table-item" style="width: 10%">
            <!-- <i class="el-icon-circle-plus-outline"></i> -->
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
        v-show="['paramName', 'paramValue', 'paramsDes'].includes(currentType)"
        v-model="inputValue"
        @change="handlerToChangeInput"
        @blur="handlerToBlur"
        :style="{...styleData}"
      ></el-input>
      <el-select
        class="input-wrapper"
        v-show="['paramType', 'paramSource'].includes(currentType)"
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
      currentIndex: null,
      tableTitle: [
        { label: '参数名', value: 'paramName', width: '20%' },
        { label: '类型', value: 'paramType', width: '10%' },
        { label: '参数值', value: 'paramValue', width: '20%' },
        { label: '说明', value: 'paramsDes', width: '25%' },
        { label: '取值方式', value: 'paramSource', width: '15%' },
        { label: '操作', value: 'paramsOperation', width: '10%' },
      ],
      tableData: [],
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
        { label: '布尔', value: '布尔' },
        { label: '数组', value: '数组' },
      ]
    }
  },
  computed: {
    getOptions: () => (val) => {
      if (val === 'paramType') {
        return [
          { label: 'string', value: 'string' },
          { label: 'number', value: 'number' },
          { label: 'bool', value: 'bool' },
          { label: 'list', value: 'list' },
        ]
      }
      if (val === 'paramSource') {
        return [
          { label: 'fixed', value: 'fixed' },
          { label: 'variable', value: 'variable' }
        ]
      }
    },
    getList: () => (val) => {
      return Object.prototype.toString.call(val) === '[object Array]'
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
      const { width, left, top, height } = e.target.getBoundingClientRect()
      this.currentRow = value
      this.currentType = key
      if (key === 'paramsType') {
        this.selectValue = value[key]
      } else {
        this.inputValue = value[key]
      }
      if (height <= 30) {
        this.styleData = {
          width: width + 'px',
          height: '30px',
          left: left + 'px',
          top: top + 'px'
        }
      } else {
        const heightPer = (height - 30) / 2;
        this.styleData = {
          width: width + 'px',
          height: '30px',
          left: left + 'px',
          top: top + heightPer + 'px'
        }
      }
      this.inputFocus();
    },
    handlerToClickValue(e, row, value, index) {
      if (e.target) {}
      console.log(e)
      const { width, left, top } = e.target.getBoundingClientRect()
      this.currentType = 'paramValue'
      this.currentRow = row
      this.inputValue = value
      this.currentIndex = index
      this.styleData = {
        width: width + 'px',
        height: '30px',
        left: left + 'px',
        top: top + 'px'
      }
      this.inputFocus();
    },
    handlerToChangeInput() {
      if (typeof this.currentRow[this.currentType] === 'string') {
        this.currentRow[this.currentType] = this.inputValue
      } else {
        this.currentRow[this.currentType][this.currentIndex] = this.inputValue
      }
    },
    handlerToChangeSelect() {
      this.currentRow[this.currentType] = this.selectValue
      this.currentRow.paramValue = ['']
    },
    handlerToBlur() {
      setTimeout(() => {
        this.inputValue = ''
        this.selectValue = ''
        this.currentType = ''
        // this.currentRow = {}
        this.currentIndex = null
      }, 50)
    },
    handerToDelete(index) {
      this.tableData.splice(index, 1)
    },
    handlerToAdd() {
      this.tableData.push({ paramName: '', paramValue: [''], paramType: '', paramsDes: '', paramSource: '' })
    },
    handlerToAddValueData(arr, index) {
      arr.push('')
      console.log(arr)
    },
    handlerToDeleteValueData(arr, index) {
      if (arr.length === 1) return;
      arr.splice(index, 1)
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
        height: 30px;
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
        min-height: 30px;
        height: inherit;
        border-bottom: 1px solid #333333;
        box-sizing: border-box;
        display: flex;
        &:last-child {
          border-bottom: hidden;
        }
        .table-data-item-col {
          min-height: 30px;
          border-right: 1px solid #333333;
          box-sizing: border-box;
          &:hover {
            border: 1px solid #409EFF;
          }
          .table-data-item-value-st {
            min-height: 30px;
            line-height: 30px;
            height: 100%;
            display: flex;
            align-items: center;
            text-align: center;
            justify-content: center;
            overflow: hidden;
            color: #fff;
            box-sizing: border-box;
          }
          .table-item-params-value {
            width: 100%;
            min-height: 30px;
            height: auto;
            box-sizing: border-box;
            .table-item-params-value-item {
              width: 100%;
              height: 30px;
              line-height: 30px;
              text-align: center;
              color: #fff;
              border-bottom: 1px solid #333333;
              overflow: hidden;
              box-sizing: border-box;
              &:last-child {
                border-bottom: hidden;
              }
              &:hover {
                border: 1px solid #409EFF;
                .right-opt {
                  display: inline-block;
                }
              }
              .right-opt {
                float: right;
                display: none;
                i {
                  margin-right: 10px;
                }
              }
            }
          }
        }
        .operation-table-item {
          text-align: center;
          color: #fff;
          font-size: 20px;
          display: flex;
          align-items: center;
          text-align: center;
          justify-content: center;
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
