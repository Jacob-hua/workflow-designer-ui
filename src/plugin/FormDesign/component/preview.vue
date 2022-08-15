<script>
import { executeApi, processVariable } from '@/api/globalConfig'
import formDepMonitorMixin, { mixinRequestFunction, mixinDependFunction } from '@/mixin/formDepMonitor'
import _ from 'lodash'
import render from '../custom/previewRender'
import checkRules from '../custom/rule'

function handleRequestDependChange(data, fieldInfo) {
  if (fieldInfo.disabled || this.formConf.disabled) {
    return
  }
  executeApi({
    apiMark: fieldInfo.requestConfig.apiMark,
    sourceMark: fieldInfo.requestConfig.sourceMark,
    data,
  }).then(({ result: options }) => {
    if (fieldInfo.compType === 'cascader') {
      this.deleteEmptyChildren(options.result)
      fieldInfo.options = options.result
    } else {
      fieldInfo.options = options
    }
  })
}

function handleDependChange(data, fieldInfo) {
  if (!fieldInfo.dependValue.withLabel) {
    _.set(this.form, fieldInfo.valuePath, data[fieldInfo.id])
    return
  }

  const sourceKeys = (fieldInfo.dependValue.source ?? '').split('.')
  const sourceField = this.usefulMeta[sourceKeys[sourceKeys.length - 1]] ?? {}

  if (sourceField.compType === 'checkbox') {
    this.form[fieldInfo.id] = sourceField.options
      .filter(({ value }) => data[fieldInfo.id].includes(value))
      .map(({ label }) => label)
      .join(', ')
    return
  }

  this.form[fieldInfo.id] = sourceField.options?.find(({ value }) => value === data[fieldInfo.id])?.label
}

function handleRowContainerDependChange(data, fieldInfo) {
  fieldInfo.visible = fieldInfo.dependValue.targetValue
    ? data[fieldInfo.id] == `${fieldInfo.dependValue.targetValue}`
    : Boolean(data[fieldInfo.id])
  this.$forceUpdate()
}

function buildModel(model, metaData) {
  let result = { ...model }
  if (metaData.compType !== 'row') {
    result[metaData.id] = metaData.value
    return result
  }

  if (metaData.isCopy) {
    result[metaData.id] = []
    let tempModel = {}
    if (Array.isArray(metaData.columns)) {
      metaData.columns.forEach(({ list }) => {
        list.forEach((colMeta) => {
          tempModel = buildModel(tempModel, colMeta)
        })
      })
    }
    result[metaData.id].push(tempModel)
    return result
  }

  metaData.columns.forEach(({ list }) => {
    list.forEach((item) => (result = buildModel(result, item)))
  })
  return result
}

function buildColumnContainer(h, metaData, valuePath, usefulMeta = {}) {
  return metaData.columns.map(({ list, span }) => {
    const formItems = list.map((item) => buildFormItem.call(this, h, item, valuePath, usefulMeta))
    return <el-col span={span}>{formItems}</el-col>
  })
}

function buildRowContainer(h, metaData, valuePath, usefulMeta = {}) {
  let fieldInfo = metaData
  if (metaData.dependValue) {
    const _valuePath = valuePath ? `${valuePath}.${metaData.id}` : metaData.id
    !usefulMeta[_valuePath] && (usefulMeta[_valuePath] = _.cloneDeep(metaData))
    this.flatFields = Object.values(usefulMeta ?? {})
    fieldInfo = usefulMeta[_valuePath]
    fieldInfo.context = this.context
    fieldInfo.valuePath = _valuePath
    mixinDependFunction(fieldInfo, handleRowContainerDependChange.bind(this))
  }

  if (!fieldInfo.isCopy) {
    if (!fieldInfo.visible) {
      return <div></div>
    }
    return <el-row>{buildColumnContainer.call(this, h, fieldInfo, valuePath, usefulMeta)}</el-row>
  }

  if (Object.prototype.hasOwnProperty.call(fieldInfo, 'visible') && !fieldInfo.visible) {
    return <div></div>
  }

  valuePath = valuePath ? `${valuePath}.${fieldInfo.id}` : `${fieldInfo.id}`

  const onCopy = (index) => {
    const cloneObj = _.cloneDeep(_.get(this.form, `${valuePath}[${index}]`))
    _.get(this.form, `${valuePath}`, []).splice(index, 0, cloneObj)
  }
  const onDelete = (index) => {
    const value = _.get(this.form, `${valuePath}`, [])
    if (value.length <= 1) {
      return
    }
    _.get(this.form, `${valuePath}`, []).splice(index, 1)
  }

  const isMultipleShow = !this.formConf.disabled
  const multipleRows = _.get(this.form, valuePath, [])

  const multipleRowElements = multipleRows.map((value, index) => {
    return (
      <el-card>
        <div slot="header" class="clearfix">
          <el-button
            style="float: right; padding: 3px 0"
            icon="el-icon-delete"
            type="text"
            onClick={() => onDelete(index)}
            disabled={!isMultipleShow}
          ></el-button>
          <el-button
            style="float: right; padding: 3px 0"
            icon="el-icon-plus"
            type="text"
            onClick={() => onCopy(index)}
            disabled={!isMultipleShow}
          ></el-button>
        </div>
        <el-row>
          <div>{buildColumnContainer.call(this, h, fieldInfo, `${valuePath}[${index}]`, usefulMeta)}</div>
        </el-row>
      </el-card>
    )
  })

  return <div>{multipleRowElements}</div>
}

function buildFormItem(h, metaData, valuePath, usefulMeta = {}) {
  if (metaData.compType === 'row') {
    return buildRowContainer.call(this, h, metaData, valuePath, usefulMeta)
  }

  valuePath = valuePath ? `${valuePath}.${metaData.id}` : `${metaData.id}`

  !usefulMeta[valuePath] && (usefulMeta[valuePath] = _.cloneDeep(metaData))
  this.flatFields = Object.values(usefulMeta ?? {})
  const fieldInfo = usefulMeta[valuePath]
  fieldInfo.context = this.context
  fieldInfo.valuePath = valuePath
  const rules = checkRules(fieldInfo)
  if (fieldInfo.dependValue) {
    mixinDependFunction(fieldInfo, handleDependChange.bind(this))
  }
  if (fieldInfo.requestConfig) {
    mixinRequestFunction(fieldInfo, handleRequestDependChange.bind(this))
  }

  return (
    <el-form-item
      label={fieldInfo.showLabel ? fieldInfo.label : ''}
      label-width={`${fieldInfo.labelWidth}`}
      prop={fieldInfo.id}
      rules={rules}
    >
      <render
        key={fieldInfo.id}
        conf={fieldInfo}
        value={_.get(this.form, fieldInfo.valuePath)}
        uploadFun={this.uploadFun}
        downloadFun={this.downloadFun}
        onInput={(event) => {
          _.set(this.form, fieldInfo.valuePath, event)
        }}
      />
    </el-form-item>
  )
}

export default {
  name: 'preview',
  props: ['itemList', 'formData', 'formConf', 'uploadFun', 'downloadFun', 'processInstanceId'],
  components: { render },
  data() {
    const metaDataList = _.cloneDeep(this.itemList)
    let form = {}
    if (this.formData) {
      form = _.cloneDeep(this.formData)
    } else {
      form = metaDataList.reduce(buildModel, {})
    }
    return {
      form,
      usefulMeta: {},
      metaDataList,
      rules: {},
      context: {},
      flatFields: [],
    }
  },
  watch: {
    itemList(itemList) {
      this.metaDataList = _.cloneDeep(itemList)
      if (this.formData) {
        this.form = _.cloneDeep(this.formData)
      } else {
        this.form = this.metaDataList.reduce(buildModel, {})
      }
      this.flatFields = []
      this.usefulMeta = {}
    },
  },
  async created() {
    this.context = await this.getContext()
  },
  mixins: [
    formDepMonitorMixin({
      formData: 'form',
      formFields: 'flatFields',
    }),
  ],
  render(h) {
    return (
      <el-form
        rules={this.rules}
        ref={this.formConf.formModel}
        size={this.formConf.size}
        props={{
          model: this.form,
        }}
        label-position={this.formConf.labelPosition}
        disabled={this.formConf.disabled}
        validate-on-rule-change={false}
        label-width={this.formConf.labelWidth + 'px'}
        nativeOnSubmit={this.submit}
      >
        {this.metaDataList.map((metaData) => buildFormItem.call(this, h, metaData, '', this.usefulMeta))}
      </el-form>
    )
  },
  methods: {
    deleteEmptyChildren(arr) {
      for (let i = 0; i < arr.length; i++) {
        const arrElement = arr[i]
        if (!arrElement.children.length) {
          delete arrElement.children
          continue
        }
        if (arrElement.children) {
          this.deleteEmptyChildren(arrElement.children)
        }
      }
    },
    async submit() {
      this.itemList.forEach((metaData) => {
        Object.keys(this.form).forEach((form) => {
          if (form === metaData.id) {
            metaData.value = this.form[form]
          }
        })
      })
      try {
        await this.$refs[this.formConf.formModel].validate()
        return _.cloneDeep({
          metaDataList: this.metaDataList,
          formData: this.form,
        })
      } catch (e) {
        throw new Error(e.toString())
      }
    },
    handlerValChange(key, origin) {
      this.$set(this.form, key, origin)
    },
    async getContext() {
      const { result } = await processVariable({
        processInstanceId: this.processInstanceId ?? '',
      })
      return result
    },
  },
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

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
</style>
