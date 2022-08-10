<script>
import previewItem from '@/plugin/FormDesign/component/previewItem'
import { processVariable } from '@/api/globalConfig'
import formDepMonitorMixin, { mixinRequestFunction, mixinDependFunction } from '@/mixin/formDepMonitor'
import _ from 'lodash'
import render from '../custom/previewRender'
import checkRules from '../custom/rule'

function mixinExecuteFunctions(metaData) {
  if (metaData.compType !== 'row') {
    mixinRequestFunction(metaData, (data, fiedlInfo) => {})
    mixinDependFunction(metaData, (data, fieldInfo) => {
      this.form[fieldInfo.id] = data[fieldInfo.id]
    })
    return
  }

  if (metaData.isCopy) {
    if (Array.isArray(metaData.columns)) {
      metaData.columns.forEach(({ list }) => {
        list.forEach((colMeta) => mixinExecuteFunctions.call(this, colMeta))
      })
    }
    return
  }

  metaData.columns.forEach(({ list }) => {
    list.forEach((colMeta) => mixinExecuteFunctions.call(this, colMeta))
  })
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

function buildForm(h, metaList) {
  return metaList.map((metaData) => buildFormItem.call(this, h, metaData))
}

function buildColumnContainer(h, metaData, valuePath) {
  return metaData.columns.map(({ list, span }) => {
    const formItems = list.map((item) => buildFormItem.call(this, h, item, valuePath))
    return <el-col span={span}>{formItems}</el-col>
  })
}

function buildRowContainer(h, metaData, valuePath) {
  if (!metaData.isCopy) {
    return <el-row>{buildColumnContainer.call(this, h, metaData, valuePath)}</el-row>
  }

  valuePath = valuePath ? `${valuePath}.${metaData.id}` : `${metaData.id}`

  const onCopy = (index) => {
    const cloneObj = _.cloneDeep(_.get(this.form, `${valuePath}[${index}]`))
    _.get(this.form, `${valuePath}`, []).splice(index, 0, cloneObj)
  }
  const onDelete = (index) => {
    if (index === 0) {
      return
    }
    _.get(this.form, `${valuePath}`, []).splice(index, 1)
  }

  const isMultipleShow = this.iconFlag
  const multipleRows = _.get(this.form, valuePath, [])

  return multipleRows.map((_, index) => {
    return (
      <el-row
        class={metaData.isCopy ? 'rows' : ''}
        nativeOnMousemove={metaData.isCopy ? this.move : () => {}}
        nativeOnMouseleave={metaData.isCopy ? this.leave : () => {}}
      >
        <div>
          <i v-show={isMultipleShow} onClick={() => onCopy(index)} class="copy el-icon-circle-plus-outline"></i>
          <i v-show={isMultipleShow} onClick={() => onDelete(index)} class="del el-icon-remove-outline"></i>
          {buildColumnContainer.call(this, h, metaData, `${valuePath}[${index}]`)}
        </div>
      </el-row>
    )
  })
}

function buildFormItem(h, metaData, valuePath) {
  if (metaData.compType === 'row') {
    return buildRowContainer.call(this, h, metaData, valuePath)
  }

  const rules = checkRules(metaData)
  valuePath = valuePath ? `${valuePath}.${metaData.id}` : `${metaData.id}`

  return (
    <el-form-item
      label={metaData.showLabel ? metaData.label : ''}
      label-width={`${metaData.labelWidth}`}
      prop={metaData.id}
      rules={rules}
    >
      <render
        key={metaData.id}
        conf={metaData}
        value={_.get(this.form, valuePath)}
        uploadFun={this.uploadFun}
        downloadFun={this.downloadFun}
        onInput={(event) => {
          _.set(this.form, valuePath, event)
        }}
      />
    </el-form-item>
  )
}

let mixins = []

export default {
  name: 'preview',
  props: ['itemList', 'formConf', 'uploadFun', 'downloadFun', 'processInstanceId'],
  components: { previewItem, render },
  data() {
    if (!this.formConf.disabled) {
      mixins.push(
        formDepMonitorMixin({
          formData: 'form',
          formFields: 'metaDataList',
        })
      )
    }
    const form = this.itemList.reduce(buildModel, {})
    return {
      form,
      rules: {},
      quoteOption: [],
      fileList: [],
      file: {},
      iconFlag: false,
      delFlag: false,
    }
  },
  computed: {
    metaDataList() {
      this.itemList.forEach(mixinExecuteFunctions.bind(this))
      return this.itemList
    },
  },
  mixins: [
    formDepMonitorMixin({
      formData: 'form',
      formFields: 'metaDataList',
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
        {buildForm.call(this, h, this.metaDataList)}
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
</style>
