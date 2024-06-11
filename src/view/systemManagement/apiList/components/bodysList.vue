<template>
  <div>
    <div class="bodys-all">
      <el-radio-group style="margin-bottom: 10px;" @input="handlerToChange" v-model="bodyType" size="small">
        <el-radio-button label="form-data"></el-radio-button>
        <el-radio-button label="x-www-form-urlencoded"></el-radio-button>
        <el-radio-button label="json"></el-radio-button>
      </el-radio-group>
    </div>
    <div v-show="false" class="bodys-list" ref="parentDom" @click="handlerToChoose($event, 0)">
      <div class="left-index-line" :style="{ height: `${lineList * 24}px` }">
        <div class="left-index-line-item" v-for="index in lineList" :key="index">{{ index }}</div>
      </div>
      <div class="right-writable-content" :style="{ height: `${lineList * 24}px` }" ref="writableWrapper" @wheel="handlerToScroll">
        <div
          class="line-data-item"
          v-for="(item, index) in lineData"
          :key="item.id"
          @click.stop="handlerToChoose($event, index)"
          :style="{ paddingLeft: item.indentCount * 24 + 15 + 'px'}">
          <span v-for="(font, index) in formatContentAll(item.content)" :class="['mark-st', font.className, isSelectAll ? 'bg-color' : '']">{{ font.value }}</span>
        </div>
      </div>
      <el-input
        class="input-wrapper"
        ref="inputWrapper"
        v-show="isEdit"
        v-model="inputValue"
        @input="handlerToChangeInput"
        @blur="handlerToBlur"
        :style="{...styleInputData}"
        ></el-input>
    </div>
    <ParamsList v-show="true" ref="paramsComp" />
  </div>
</template>

<script>
import ParamsList from './paramsList.vue'
export default {
  components: {
    ParamsList
  },
  data() {
    return {
      bodyType: 'form-data',
      rptOptions: [':', ','],
      lineList: 1,
      lineData: [],
      currentLineData: {},
      inputValue: '',
      isEdit: false,
      isShowFormat: false,
      isEmptyLine: false,
      indentCount: 0,
      formatContent: [],
      semicolonList: [],
      commaList: [],
      isControl: false,
      isCopy: false,
      isSelectAll: false,
      styleInputData: {
        width: '',
        height: '30px',
        left: '',
        top: ''
      },
      styleFormatData: {
        left: '',
        top: ''
      },
      bodyParams: {}
    }
  },
  mounted() {
    document.addEventListener('click', this.initClick)
    document.addEventListener('keydown', this.setListner)
    this.initLineData();
  },
  beforeDestroy() {
    document.removeEventListener('click', this.initClick)
    document.removeEventListener('keyup', this.keyUpListener)
    document.removeEventListener('keydown', this.setListner)
  },
  computed: {
    formatContentAll: () => (content) => {
      const len = content.length;
      const newContent = []
      const semicolon = content.indexOf(':')
      const comma = content[len - 1] === ',' ? len : null
      if (semicolon <= 0) return [{ className: 'color1', value: content }]
      if (semicolon > 0) {
        const font1 = content.substring(0, semicolon);
        const font2 = content[semicolon]
        newContent.push({
          className: 'color1', value: font1
        }, {
          className: 'color2', value: font2
        })
      }
      if (comma > 0) {
        const font1 = content.substring(semicolon + 1, comma - 1);
        const font2 = content[comma - 1]
        newContent.push({
          className: 'color3', value: font1
        }, {
          className: 'color4', value: font2
        })
      } else {
        const font1 = content.substring(semicolon + 1)
        newContent.push({
          className: 'color3', value: font1
        })
      }
      return newContent
    }
  },
  watch: {
    indentCount: {
      handler(newV) {
        if (this.currentLineData.id) {
          const element = this.$refs.inputWrapper.$el.getElementsByTagName('input')[0];
          element.style.paddingLeft = 15 + newV * 24 + 'px'
          this.currentLineData.indentCount = newV;
        }
      }
    }
  },
  methods: {
    initLineData() {
      this.lineData = [{
        id: this.getId(),
        indentCount: 0,
        content: ''
      }]
    },
    getId() {
      return Math.random().toString(16).substring(3, 30);
    },
    initClick(e) {
      const list = ['right-writable-content', 'line-data-item', 'el-input__inner', 'bodys-list']
      const className = e.target.className
      const isHav = list.some(item => item === className)
      if (!isHav) {
        this.isEdit = false;
        document.removeEventListener('keyup', this.keyUpListener)
      }
    },
    inputFocus() {
      const input = this.$refs.inputWrapper.$el.getElementsByTagName('input')[0]
      if (input) {
        input.selectionStart = input.selectionEnd = 0;
        setTimeout(() => {
          input.focus()
          // console.log(input.selectionStart, input.selectionEnd)
        }, 20)
      }
    },
    getCursorPos() {
      let cursorPos = 0;
      const element = this.$refs.inputWrapper.$el.getElementsByTagName('input')[0];
      if (document.selection) {
        var selectRange = document.selection.createRange();
        selectRange.moveStart('character', -element.value.length);
        cursorPos = selectRange.text.length;
      } else if (element.selectionStart || element.selectionStart == '0') {
        cursorPos = element.selectionStart;
      }
      return cursorPos;
    },
    setListner(e) {
      return;
      this.isEmptyLine = (this.currentLineData.content === "" || !this.currentLineData.content) && (!this.currentLineData.indentCount || this.currentLineData.indentCount === 0)
      if (e.code === 'AltLeft') {
        this.isEdit = false
        this.indentCount = 0
        document.removeEventListener('keyup', this.keyUpListener)
      }
      if (e.code === 'Tab') {
        e.preventDefault();
      }
      if (e.code === 'ControlLeft') {
        e.preventDefault();
        this.isControl = true
      }
      if (this.isControl && e.code === 'KeyA') {
        e.preventDefault();
      }
    },
    addLine() {
      const lineIdx = this.getCursorPos()
      const content = this.currentLineData.content
      const newContent = [content.substring(0, lineIdx), content.substring(lineIdx)]
      this.currentLineData.content = newContent[0]
      const contentIdx = this.lineData.findIndex(item => item.id === this.currentLineData.id)
      if (this.lineData.length === 1 || this.lineData.length === contentIdx - 1) {
        this.lineData.push({ id: this.getId(), content: newContent[1], indentCount: this.currentLineData.indentCount})
      } else {
        const beforeLineData = this.lineData.filter((_, index) => index <= contentIdx)
        const afterLineData = this.lineData.filter((_, index) => index > contentIdx)
        this.lineData = [...beforeLineData, { id: this.getId(), content: newContent[1], indentCount: this.currentLineData.indentCount}, ...afterLineData]
      }
      this.lineList += 1;
      this.currentLineData = this.lineData[contentIdx + 1]
      setTimeout(() => {
        if (contentIdx > 7) {
          this.$refs.parentDom.scrollTop = (contentIdx - 7) * 24
        } else {
          this.$refs.parentDom.scrollTop = 0
        }
        const input = this.$refs.inputWrapper.$el.getElementsByTagName('input')[0]
        const domList = this.$refs.writableWrapper.getElementsByClassName('line-data-item');
        const { left, top, width } = domList[contentIdx + 1].getBoundingClientRect()
        this.styleInputData = {
          width: width + 'px',
          height: '20px',
          left: left + 'px',
          top: top + 2 + 'px'
        }
        this.inputValue = this.currentLineData.content
        this.indentCount = this.currentLineData.indentCount
        setTimeout(() => {
          input.setSelectionRange(0, 0)
        }, 20)
      }, 20)
    },
    getToPrevLine() {
      if (this.lineData.length === 1) return;
      const contentIdx = this.lineData.findIndex(item => item.id === this.currentLineData.id) - 1;
      if (contentIdx < 0) return;
      if (contentIdx >= 9) {
        this.$refs.parentDom.scrollTop = (contentIdx - 9) * 24
      } else {
        this.$refs.parentDom.scrollTop = 0
      }
      this.currentLineData = this.lineData[contentIdx]
      setTimeout(() => {
        const domList = this.$refs.writableWrapper.getElementsByClassName('line-data-item');
        const { left, top, width } = domList[contentIdx].getBoundingClientRect()
        this.styleInputData = {
          width: width + 'px',
          height: '20px',
          left: left + 'px',
          top: top + 2 + 'px'
        }
        this.inputValue = this.currentLineData.content
        this.indentCount = this.currentLineData.indentCount
      }, 20)
    },
    getToNextLine() {
      if (this.lineData.length === 1) return;
      const contentIdx = this.lineData.findIndex(item => item.id === this.currentLineData?.id) + 1;
      if (contentIdx === this.lineData.length) return;
      if (contentIdx >= 9) {
        this.$refs.parentDom.scrollTop = (contentIdx - 9) * 24
      } else {
        this.$refs.parentDom.scrollTop = 0
      }
      this.currentLineData = this.lineData[contentIdx]
      setTimeout(() => {
        const domList = this.$refs.writableWrapper.getElementsByClassName('line-data-item');
        const { left, top, width } = domList[contentIdx].getBoundingClientRect()
        this.styleInputData = {
          width: width + 'px',
          height: '20px',
          left: left + 'px',
          top: top + 2 + 'px'
        }
        this.inputValue = this.currentLineData.content
        this.indentCount = this.currentLineData.indentCount
      }, 20)
    },
    addlineEmpty() {
      this.indentCount += 1;
      this.currentLineData.indentCount = this.indentCount
    },
    deletelineData() {
      const idx = this.getCursorPos()
      // 全选删除  
      if (this.isSelectAll) {
        this.isSelectAll = false;
        this.isControl = false;
        this.initLineData();
        this.indentCount = 0
        this.lineList = 1
        setTimeout(() => {
          const domList = this.$refs.writableWrapper.getElementsByClassName('line-data-item');
          const { left, top, width } = domList[0].getBoundingClientRect()
          this.styleInputData = {
            width: width + 'px',
            height: '20px',
            left: left + 'px',
            top: top + 2 + 'px'
          }
          this.inputValue = ''
          this.indentCount = 0
          this.currentLineData = this.lineData[0]
        }, 20)
        return;
      }
      if (idx === 0 && this.indentCount > 0) {
        this.indentCount -= 1
      }
      if (this.lineData.length === 1 && this.indentCount === 0) {
        return
      };
      const contentIdx = this.lineData.findIndex(item => item.id === this.currentLineData?.id)
      if (this.inputValue !== '' && contentIdx > 0 && this.indentCount === 0 && idx === 0) {
        const content = this.currentLineData.content
        this.currentLineData = this.lineData[contentIdx - 1]
        this.currentLineData.content += content
        this.lineList -= 1;
        this.lineData.splice(contentIdx, 1)
        setTimeout(() => {
          const domList = this.$refs.writableWrapper.getElementsByClassName('line-data-item');
          const { left, top, width } = domList[contentIdx - 1].getBoundingClientRect()
          this.styleInputData = {
            width: width + 'px',
            height: '20px',
            left: left + 'px',
            top: top + 2 + 'px'
          }
          this.inputValue = this.currentLineData.content
          this.indentCount = this.currentLineData.indentCount
        }, 20)
      }
      if (this.inputValue === '' && contentIdx > 0 && this.indentCount === 0 && this.isEmptyLine) {
        this.currentLineData = this.lineData[contentIdx - 1]
        this.lineList -= 1;
        this.lineData.splice(contentIdx, 1)
        setTimeout(() => {
          const domList = this.$refs.writableWrapper.getElementsByClassName('line-data-item');
          const { left, top, width } = domList[contentIdx - 1].getBoundingClientRect()
          this.styleInputData = {
            width: width + 'px',
            height: '20px',
            left: left + 'px',
            top: top + 2 + 'px'
          }
          this.inputValue = this.currentLineData.content
          this.indentCount = this.currentLineData.indentCount
        }, 20)
      }
    },
    formaterDataType(data) {
      if (typeof data === 'object') return JSON.stringify(data)
      if (typeof data === 'string') return `"${data}"`
      if (typeof data === 'number') return data
      if (typeof data === 'boolean') return data
    },
    formatterJSONData(data, currentLineData, newData = []) {
      currentLineData.content += "{"
      const keysList = Object.keys(data);
      const len = keysList.length
      keysList.forEach((item, index) => {
        // if () {}
        newData.push({
          id: this.getId(),
          indentCount: currentLineData.indentCount + 1,
          content: `"${item}": ${ this.formaterDataType(data[item]) }${index < len - 1 ? ',' : ''}`
        })
      })
      newData.push({
        id: this.getId(),
        indentCount: currentLineData.indentCount,
        content: "}"
      })
      return newData
    },
    async copyData() {
      this.isCopy = true
      const text = await navigator.clipboard.readText()
      let lineData = []
      const contentIdx = this.lineData.findIndex(item => item.id === this.currentLineData.id);
      let len = text.length;
      let str = ''
      for (let i = 0; i < len; i++) {
        const txt= text[i];
        if (['[', '{'].includes(txt)) {
          const newStr = str.replaceAll(' ', '')
          lineData.push({
            id: this.getId(),
            content: str.replaceAll('\n', '').replaceAll(' ', '') + txt,
            indentCount: Math.ceil((str.length - newStr.length - 1) / 2) + this.currentLineData.indentCount
          })
          str = ''
        } else if ([']', '}'].includes(txt)) {
          const newStr = str.replaceAll(' ', '')
          lineData.push({
            id: this.getId(),
            content: str.replaceAll('\n', '').replaceAll(' ', ''),
            indentCount: ['}', ']', ']\r', '}\r'].includes(lineData[lineData.length - 1].content) ? lineData[lineData.length - 1].indentCount - 1 : lineData[lineData.length - 1].indentCount
          })
          str = txt
          if (i === len - 1) {
            lineData.push({
              id: this.getId(),
              content: txt,
              indentCount: this.currentLineData.indentCount
            })
          }
        } else if ([','].includes(txt)) {
          if (str !== '') {
            const newStr = str.replaceAll(' ', '')
            lineData.push({
              id: this.getId(),
              content: str.replaceAll('\n', '').replaceAll(' ', '') + txt,
              indentCount: ['}', ']'].includes(str) ? lineData[lineData.length - 1].indentCount - 1 : (str.length - newStr.length - 1) / 2 + this.currentLineData.indentCount
            })
          }
          str = ''
        } else {
          str += txt
        }
      }
      lineData = lineData.filter(itm => itm.content !== '' && itm.content !== ',')
      if (this.lineData.length > 1) {
        const beforeLineData = this.lineData.filter((_, index) => index <= contentIdx)
        const afterLineData = this.lineData.filter((_, index) => index > contentIdx)
        this.lineData = [...beforeLineData, ...lineData, ...afterLineData]
      } else {
        this.lineData = lineData
      }
        this.lineList = this.lineData.length
        this.isControl = false
        this.isCopy = false
        this.isEdit = false
    },
    selectAllData() {
      this.isSelectAll = true
    },
    keyUpListener(e) {
      console.log(e)
      e.preventDefault();
      if (e.code === 'Enter') {
        this.addLine()
      } else if (e.code === 'ArrowUp') {
        this.getToPrevLine()
      } else if (e.code === 'ArrowDown') {
        this.getToNextLine()
      } else if (e.code === 'Tab') {
        this.addlineEmpty()
      } else if (e.code === 'Backspace') {
        this.deletelineData()
      } else if (e.code === 'Semicolon') {
        const idx = this.getCursorPos()
        this.semicolonList.push(idx)
      } else if (e.code === 'Comma') {
        const idx = this.getCursorPos()
        this.commaList.push(idx)
      } else if (e.code === "KeyV" && this.isControl) {
        this.isCopy = true
        this.copyData()
      } else if (e.code === "KeyA" && this.isControl) {
        this.selectAllData()
      }
    },
    handlerToScroll(e) {
      this.isEdit = false;
      this.inputValue = ''
    },
    handlerToChoose(e, index) {
      const ctIdx = index ? index : 0
      const domList = this.$refs.writableWrapper.getElementsByClassName('line-data-item');
      const { left, top, width } = domList[ctIdx].getBoundingClientRect()
      this.styleInputData = {
        width: width + 'px',
        height: '20px',
        left: left + 'px',
        top: top + 2 + 'px'
      }
      this.currentLineData = this.lineData[ctIdx]
      this.inputValue = this.currentLineData.content
      this.indentCount = this.currentLineData.indentCount
      this.isEdit = true;
      this.inputFocus();
      document.addEventListener('keyup', this.keyUpListener)
    },
    handlerToChangeInput() {
      // this.isShowFormat = true;
      const idx = this.getCursorPos()
      const {left, top} = this.styleInputData
      this.styleFormatData = {
        left: Number(left.replace('px', '')) + this.indentCount * 24 + 'px',
        top: Number(top.replace('px', '')) + 24 + 'px'
      }
      this.formatContent = [];
      // setTimeout(() => {
      if (!this.isControl) {
        this.currentLineData.content = this.inputValue
      }
      // }, 100);
      // this.formatContentByInput(this.inputValue)
    },
    handlerToBlur() {
      console.log(this.getJSONData())
      // this.currentLineData = {}
    },
    getJSONData() {
      let stringData = ''
      let jsonData
      this.lineData.forEach(itm => {
        stringData += itm.content
      })
      if (stringData === '') return {};
      try {
        jsonData = JSON.parse(stringData)
      } catch (error) {
        console.log(this.lineData)
        this.$message.warning('JSON格式有错：' + error)
      }
      return jsonData
    },
    getBodyData(params) {
      this.$refs.paramsComp.tableData = params.bodyParams;
      this.bodyType = params.bodyType;
    },
    handlerToChange(val) {
      this.$emit('changeBodyType', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.bodys-list {
  width: 100%;
  height: 300px;
  overflow: hidden;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 6px 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  color: #fff;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  .left-index-line {
    width: 60px;
    height: inherit;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
    user-select: none;
    .left-index-line-item {
      width: 100%;
      height: 24px;
      text-align: center;
      line-height: 24px;
      font-size: 16px;
    }
  }
  .right-writable-content {
    width: calc(100% - 60px);
    .line-data-item {
      width: 100%;
      height: 24px;
      padding: 0 15px;
      line-height: 24px;
      font-size: 16px;
      .bg-color {
        background-color: #f00;
      }
      .color1 {
        color: #a31515;
      }
      .color2 {
        color: #ffffff;
      }
      .color3 {
        color: #098658;
      }
      .color4 {
        color: #ffffff
      }
    }
  }
  .input-wrapper {
    position: fixed;
    ::v-deep .el-input__inner {
      height: 20px;
      outline: none;
      border: hidden;
      font-size: 16px;
    }
  }
  .format-item-content {
    position: fixed;
    width: 500px;
    min-height: 16px;
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.2);
    padding: 10px 10px;
    box-sizing: border-box;
  }
}
</style>
