<script>
import { getSimpleId } from '@/plugin/FormDesign/utils/IdGenerate'
import previewItem from '@/plugin/FormDesign/component/previewItem'
import { processVariable } from '@/api/globalConfig'
import formDepMonitorMixin from '@/mixin/formDepMonitor'
import _ from 'lodash'
import render from '../custom/previewRender'
import checkRules from '../custom/rule'

const copyComp = (comp = {}) => {
  const clone = _.cloneDeep(comp)
  const uId = `${comp.compType}_${getSimpleId()}`
  clone._id = uId
  clone.columns.forEach((columns) => {
    if (columns.list.length) {
      columns.list.forEach((item) => {
        item._id = `${item.compType}_${getSimpleId()}`
      })
    }
  })
   return clone
}

function buildModel(model, meta) {
  const result = { ...model }
  if (meta.isCopy) {
    result[meta.id] = []
    let tempModel = {}
    if (Array.isArray(meta.columns)) {
      meta.columns.forEach(({ list }) => {
        list.forEach((colMeta) => {
          tempModel = buildModel(tempModel, colMeta)
        })
      })
    }
    result[meta.id].push(tempModel)
    return result
  }

  result[meta.id] = meta.value
  return result
}

function buildForm(h, metaList) {
  return metaList.map((metaData) => buildFormItem.call(this, h, metaData, metaList))
}

function buildCopyContainer(h, children, metaData, parent) {
  return (
    <div>
      <i
        v-show={this.iconFlag}
        onClick={() => {
          parent.push(copyComp(metaData))
        }}
        class="copy el-icon-circle-plus-outline"
      ></i>
      <i
        v-show={this.iconFlag}
        onClick={() => {
          parent.splice(parent.findIndex((item) => item.id === metaData.id))
        }}
        class="del el-icon-remove-outline"
      ></i>
      {children}
    </div>
  )
}

function buildFormItem(h, metaData, parent) {
  if (metaData.compType === 'row') {
    const columns = metaData.columns.map(({ list, span }) => {
      const formItems = list.map((item) => buildFormItem.call(this, h, item, list))
      return <el-col span={span}>{formItems}</el-col>
    })
    return (
      <el-row
        class={metaData.isCopy ? 'rows' : ''}
        nativeOnMousemove={metaData.isCopy ? this.move : () => {}}
        nativeOnMouseleave={metaData.isCopy ? this.leave : () => {}}
      >
        {metaData.isCopy ? buildCopyContainer.call(this, h, columns, metaData, parent) : columns}
      </el-row>
    )
  }

  const { valChange } = this.$listeners
  const rules = checkRules(metaData)
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
        value={metaData.value}
        uploadFun={this.uploadFun}
        downloadFun={this.downloadFun}
        onInput={(event) => {
          this.$set(metaData, 'value', event)
          valChange(metaData.id, event)
        }}
      />
    </el-form-item>
  )
}

let mixin = []

export default {
  name: 'preview',
  props: ['itemList', 'formConf', 'uploadFun', 'downloadFun', 'processInstanceId'],
  components: { previewItem, render },
  data() {
    if (!this.formConf.disabled) {
      mixin.push(
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
      metaDataList: [],
    }
  },
  created() {
    this.metaDataList = this.itemList
  },
  mixins: mixin,
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
        {/*buildRowItem(this, h, this.metaDataList)*/}
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
        console.log(
          _.cloneDeep({
            metaDataList: this.metaDataList,
            formData: this.form,
          })
        )
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
        // processInstanceId: 'c4ace818-01a9-11ed-8113-b215cd163104'
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
