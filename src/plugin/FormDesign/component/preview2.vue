<script>

import {getSimpleId} from "@/plugin/FormDesign/utils/IdGenerate";

import previewItem from "@/plugin/FormDesign/component/previewItem";

import { executeApi, processVariable } from "@/api/globalConfig"

import formDepMonitorMixin, {mixinExecuteFunction} from "@/mixin/formDepMonitor";

import _ from 'lodash'

const copyComp = ( originList = [], comp = {}) => {
  const clone = _.cloneDeep(comp)
  const uId = "row_"+getSimpleId();
  clone.id = uId;
  clone._id = uId;
  clone.columns.forEach((columns)=>{
    let itemList = [];
    if (columns.list.length) {
      columns.list.forEach((item)=>{
        const cloneChild = _.cloneDeep(item)
        cloneChild.id = `${cloneChild.id}_${getSimpleId()}`;
        cloneChild._id = cloneChild.id;
        itemList.push(cloneChild);
      })
      columns.list = [];
      columns.list = itemList;
    }
  })
  // originList.splice( originList.findIndex((item) => item.id === comp.id ) + 1, 0, clone)
  originList.push(clone)
}

const deleteComp = (originList = [], comp = {} ) => {
  originList.splice(originList.findIndex((item) => item.id === comp.id), 1)
}

const buildRows = (_this, h, element = {}) => {
  return element.columns.map(column => (
        <el-col span={column.span}>
          <el-row>
            <div className="drag-wrapper">
              {
                buildColumn?.(_this, h, column, element)
              }
            </div>
          </el-row>
        </el-col>
  ))
}

const buildColumn = (_this, h, column = {}, parent) => {
  return column.list.map(comp => {
    if (comp.compType === 'row') {
    return(
        <el-row
            class={comp.isCopy? 'rows': ''}
            nativeOnMousemove={ comp.isCopy? _this.move: () => {} }
            nativeOnMouseleave={ comp.isCopy? _this.leave: () => {} }
        >
          <i v-show={ _this.iconFlag && comp.isCopy } class="copy el-icon-circle-plus-outline"  onClick={() => {
            copyComp?.(column.list ,comp)
          }}></i>
          <i v-show={ _this.iconFlag && comp.isCopy } class="del el-icon-remove-outline" onClick={() => {
            deleteComp(column.list, comp)
          }}></i>

          {buildRows?.( _this, h, comp )}
        </el-row>
        )
    } else {
      return (
          <previewItem
              models={comp}
              v-model={_this.form[comp.id]}
              onvalChange={_this.handlerValChange}
              quoteOption={_this.quoteOption}
              getFileList={_this.getFileList}
              uploadFun={_this.uploadFun}
              downloadFun={_this.downloadFunc}
          />
      )
    }
  })
}

const buildRowItem = (_this, h, metaDataList = []) => {
  return metaDataList.map((element, index) => {
    if (element.compType === 'row') {
      return (
          <el-row
              class={element.isCopy? 'rows': ''}
              nativeOnMousemove={ element.isCopy? _this.move: () => {} }
              nativeOnMouseleave={ element.isCopy? _this.leave: () => {} }
          >
            <i v-show={ _this.iconFlag && element.isCopy  }
                onClick={() => {
                    copyComp?.(metaDataList ,element)
                }}
               class="copy el-icon-circle-plus-outline"></i>
            <i v-show={(_this.iconFlag &&  element.isCopy)  }
               onClick={() => {
                  deleteComp(metaDataList, element)
               }}
               class="del el-icon-remove-outline"></i>
          <div>
            {
              buildRows?.(_this, h, element)
            }
          </div>
          </el-row>
      )
    } else {
      return (
          <previewItem
              models={element}
              v-model={_this.form[element.id]}
              onvalChange={_this.handlerValChange}
              quoteOption={_this.quoteOption}
              getFileList={_this.getFileList}
              uploadFun={_this.uploadFun}
              downloadFun={_this.downloadFunc}
          />
      )
    }
  })
}
let mixin = []
export default {
  name: 'preview',
  props: ['itemList', 'formConf', 'uploadFun', 'downloadFun', 'processInstanceId'],
  components: { previewItem },
  data() {
    if (!this.formConf.disabled) {
      mixin.push(
          formDepMonitorMixin({
            formData: 'form',
            formFields: 'metaDataList',
          }),
      )
    }

    return {
      form: {},
      rules: {},
      quoteOption: [],
      fileList: [],
      file: {},
      iconFlag: false,
      delFlag: false,
      metaDataList: []
    }
  },
  created() {
    let that = this
    function calculation(fieldInfo) {
      if (fieldInfo.compType === 'row') {
        fieldInfo.columns = fieldInfo.columns.map(col => {
          col.list = col.list.map(cl => calculation(cl))
          return col
        })
        return fieldInfo
      } else {
        if (fieldInfo.relationMapping && fieldInfo.relationMapping.length) {
          if (!fieldInfo.disabled && !that.formConf.disabled) {
            fieldInfo.context = that.getContext()
          }
        }
        return mixinExecuteFunction(fieldInfo, (data, fieldInfo) => {
          if (!fieldInfo.disabled && !that.formConf.disabled) {
            executeApi({
              apiMark: fieldInfo.requestConfig.apiMark,
              sourceMark: fieldInfo.requestConfig.sourceMark,
              data,
            }).then(({result: options}) => {
              if (fieldInfo.compType === 'select' || fieldInfo.compType === 'radio' || fieldInfo.compType === 'checkbox') {
                that.quoteOption = options
              } else if (fieldInfo.compType === 'cascader') { // 处理级联
                that.deleteEmptyChildren(options.result)
                that.quoteOption = options.result
              } else { // 处理选择列表
              }
            })
          }
        })
      }
    }
    this.metaDataList = this.itemList.map((fieldInfo) => calculation(fieldInfo)
    )
  },
  mixins: mixin,
  // computed: {
  //   metaDataList: function () {
  //     let that = this
  //     function calculation(fieldInfo) {
  //       if (fieldInfo.compType === 'row') {
  //         fieldInfo.columns = fieldInfo.columns.map(col => {
  //           col.list = col.list.map(cl => calculation(cl))
  //           return col
  //         })
  //         return fieldInfo
  //       } else {
  //         if (fieldInfo.relationMapping && fieldInfo.relationMapping.length) {
  //           if (!fieldInfo.disabled && !that.formConf.disabled) {
  //             fieldInfo.context = that.getContext()
  //           }
  //         }
  //         return mixinExecuteFunction(fieldInfo, (data, fieldInfo) => {
  //           if (!fieldInfo.disabled && !that.formConf.disabled) {
  //             executeApi({
  //               apiMark: fieldInfo.requestConfig.apiMark,
  //               sourceMark: fieldInfo.requestConfig.sourceMark,
  //               data,
  //             }).then(({result: options}) => {
  //               if (fieldInfo.compType === 'select' || fieldInfo.compType === 'radio' || fieldInfo.compType === 'checkbox') {
  //                 that.quoteOption = options
  //               } else if (fieldInfo.compType === 'cascader') { // 处理级联
  //                 that.deleteEmptyChildren(options.result)
  //                 that.quoteOption = options.result
  //               } else { // 处理选择列表
  //               }
  //             })
  //           }
  //         })
  //       }
  //     }
  //     return this.itemList.map((fieldInfo) => calculation(fieldInfo)
  //     )
  //   }
  // },
  render(h) {
    return (
        <el-form
            rules={this.rules}
            ref={this.formConf.formModel}
            size={this.formConf.size}
            model={this.form}
            label-position={this.formConf.labelPosition}
            disabled={this.formConf.disabled}
            validate-on-rule-change={false}
            label-width={this.formConf.labelWidth + 'px'}
            nativeOnSubmit={this.submit}
        >
              {
                buildRowItem?.(this, h, this.metaDataList)
              }

        </el-form>
    )
  },
  methods: {
    move() {
          this.iconFlag = true
    },
    leave() {
      this.iconFlag = false
    },
    async submit() {
      this.itemList.forEach(metaData => {
        Object.keys(this.form).forEach(form => {
          if (form === metaData.id) {
            metaData.value = this.form[form]
          }
        })
      })
      try {
        await this.$refs[this.formConf.formModel].validate()
        console.log(_.cloneDeep(
            {
              metaDataList: this.metaDataList,
              formData: this.form
            }
        ))
        return _.cloneDeep(
            {
              metaDataList: this.metaDataList,
              formData: this.form
            }
        )
      } catch (e) {
        throw  new Error(e.toString())
      }
    },
    handlerValChange(key, origin) {
      this.$set(this.form, key, origin);
    },
    async getContext() {
      const {result} = await processVariable({
        // processInstanceId: 'c4ace818-01a9-11ed-8113-b215cd163104'
        processInstanceId: this.processInstanceId ?? ''
      })
      return result
    },

  }
}
</script>

<style lang="scss" scoped>
.rows:hover {
  border: 1px dashed #fff;
  padding: 30px 0;
  padding-right: 10px;
}

.del {
  cursor: pointer;
  font-size: 30px !important;
  color: red;
  margin-left: 10px;
  position: absolute;
  right: 0;
  top: -15px;
}

.copy {
  position: absolute;
  right: 40px;
  top: -15px;
  cursor: pointer;
  font-size: 30px !important;
  color: #409eff;
  margin-left: 10px;
}
</style>