<script>
import { executeApi } from "@/api/globalConfig";
import formDepMonitorMixin, {
  mixinRequestFunction,
  mixinDependFunction,
} from "@/mixin/formDepMonitor";
import _ from "lodash";
import render from "../custom/previewRender";
import checkRules from "../custom/rule";
import {getSimpleId} from "../utils/IdGenerate"

function handleRequestDependChange(data, fieldInfo, isDependDiffed) {
  const {
    requestConfig: { apiMark, sourceMark, customParser, parserProp },
  } = fieldInfo;
  executeApi({
    apiMark: apiMark,
    sourceMark: sourceMark,
    data,
  }).then(({ result: options }) => {
    if (customParser) {
      options = parserOptions(options, parserProp);
    }
    fieldInfo.options = options;
    // if (isDependDiffed) {
    //   _.set(this.form, fieldInfo.valuePath, fieldInfo.value)
    // }
  });

  function parserOptions(options, { label, value, children, optionPath }) {
    options = options ?? [];
    if (optionPath) {
      options = _.get(options, optionPath, []);
    }
    return options.map(formatData);

    function formatData(domain) {
      if (Array.isArray(domain[children])) {
        domain[children] = domain[children].map(formatData);
      }
      const result = {
        label: domain[label],
        value: domain[value],
        children: domain[children],
      };
      if (domain[children].length === 0) {
        delete result.children;
      }
      return result;
    }
  }
}

function handleDependChange(data, fieldInfo) {
  if (!fieldInfo.dependValue.withLabel && !fieldInfo.dependValue.customize) {
    _.set(this.form, fieldInfo.valuePath, data[fieldInfo.id]);
    fieldInfo.text = data[fieldInfo.id];
    return;
  }

  const sourceField = this.usefulMeta[fieldInfo.dependValue.source] ?? {};

  if (sourceField.compType === "checkbox") {
    this.form[fieldInfo.id] = sourceField.options
      .filter(({ value }) => data[fieldInfo.id].includes(value))
      .map(({ label }) => label)
      .join(", ");
    fieldInfo.text = this.form[fieldInfo.id];
    return;
  }
  const targetValue = sourceField.options?.find(
    ({ value }) => value === data[fieldInfo.id]
  )
  if(fieldInfo.dependValue.customize) {
    if(fieldInfo.dependValue.targetField) {
      this.form[fieldInfo.id] = targetValue?targetValue[fieldInfo.dependValue.targetField]:'';
    } else {
      this.form[fieldInfo.id] = '';
    }
    fieldInfo.text = this.form[fieldInfo.id];
    return;
  } else {
    this.form[fieldInfo.id] = targetValue?targetValue.label:'';
    fieldInfo.text = this.form[fieldInfo.id];
  }
  // this.form[fieldInfo.id] = sourceField.options?.find(
  //   ({ value }) => value === data[fieldInfo.id]
  // )?.label;
}

function handleRowContainerDependChange(data, fieldInfo) {
  const oldVisible = fieldInfo.visible;
  fieldInfo.visible = fieldInfo.dependValue.targetValue
    ? data[fieldInfo.id] == `${fieldInfo.dependValue.targetValue}`
    : Boolean(data[fieldInfo.id]);

  if (oldVisible !== fieldInfo.visible) {
    this.$forceUpdate();
  }
}

function buildModel(model, metaData) {
  let result = { ...model };
  if (metaData.compType !== "row") {
    result[metaData.id] = metaData.value;
    result["key"] = _.uniqueId();
    return result;
  }

  if (metaData.isCopy || metaData.isFold) {
    result[metaData.id] = [];
    let tempModel = {};
    if (Array.isArray(metaData.columns)) {
      metaData.columns.forEach(({ list }) => {
        list.forEach((colMeta) => {
          tempModel = buildModel(tempModel, colMeta);
        });
      });
    }
    result[metaData.id].push(tempModel);
    return result;
  }

  metaData.columns.forEach(({ list }) => {
    list.forEach((item) => (result = buildModel(result, item)));
  });
  return result;
}

function buildColumnContainer(h, metaData, valuePath, usefulMeta = {}) {
  return metaData.columns.map(({ list, span }) => {
    const formItems = list.map((item) =>
      buildFormItem.call(this, h, item, valuePath, usefulMeta)
    );
    return <el-col span={span}>{formItems}</el-col>;
  });
}

function buildRowContainer(h, metaData, valuePath, usefulMeta = {}) {
  let fieldInfo = metaData;
  if (metaData.dependValue) {
    const _valuePath = valuePath ? `${valuePath}.${metaData.id}` : metaData.id;
    !usefulMeta[_valuePath] && (usefulMeta[_valuePath] = _.cloneDeep(metaData));
    this.flatFields = Object.values(usefulMeta ?? {});
    fieldInfo = usefulMeta[_valuePath];
    fieldInfo.context = this.context;
    fieldInfo.valuePath = _valuePath;
    mixinDependFunction(fieldInfo, handleRowContainerDependChange.bind(this));
  }

  if (!fieldInfo.isCopy && !fieldInfo.isFold) {
    if (!fieldInfo.visible) {
      return <div></div>;
    }
    return (
      <el-row>
        {buildColumnContainer.call(this, h, fieldInfo, valuePath, usefulMeta)}
      </el-row>
    );
  }

  if (!fieldInfo.visible) {
    return <div></div>;
  }

  valuePath = valuePath ? `${valuePath}.${fieldInfo.id}` : `${fieldInfo.id}`;

  const onCopy = (index) => {
    // 从初始的form对象中找到对应的对象进行复制
    let cloneObj = _.cloneDeep(
      _.get(this.initForm, `${valuePath}[0]`.replace(/\[(.*?)\]/g, "[0]"))
    );
    // const newObj = Object.keys(cloneObj).reduce((newData,key) => {
    //   if(key.startsWith("fd")){
    //     let newKey = "fd_"+getSimpleId();
    //     newData[newKey] = cloneObj[key];
    //   }else {
    //     newData[key] = cloneObj[key];
    //   }
    //   return newData;
    // },{})
    // setKey(newObj);
    // _.get(this.form, `${valuePath}`, []).splice(index + 1, 0, newObj);
    setKey(cloneObj);
    _.get(this.form, `${valuePath}`, []).splice(index + 1, 0, cloneObj);
  };
  const setKey = (childObj) => {
    childObj.key = _.uniqueId();
    for (let k in childObj) {
      if (
        childObj[k] instanceof Array &&
        childObj[k].length > 0 &&
        childObj[k][0] instanceof Object
      ) {
        childObj = childObj[k][0];
        setKey(childObj);
      }
    }
  };
  const onDelete = (item, index) => {
    const value = _.get(this.form, `${valuePath}`, []);
    if (value.length <= 1) {
      return;
    }
    Object.keys(usefulMeta)
      .filter((key) => key.startsWith(`${valuePath}[${value.length - 1}]`))
      .forEach((key) => {
        this.$delete(this.usefulMeta, key);
      });
    this.folded[`${item.key}`] = false;
    _.get(this.form, `${valuePath}`, []).splice(index, 1);
    // this.$forceUpdate();
  };

  const doFolded = (value) => {
    this.folded[`${value.key}`] = !this.folded[`${value.key}`];
    this.$forceUpdate();
  };
  const multipleDisabled = this.formConf.disabled || fieldInfo.disabled;
  const multipleRows = _.get(this.form, valuePath, []);
  const multipleRowElements = multipleRows.map((value, index) => {
    return (
      <el-card
        body-style={{ padding: "0px" }}
        style={{ margin: "10px 3px" }}
        shadow="always"
        key={`${value.key}`}
      >
        <div slot="header" class="clearfix">
          {`#${index + 1}.${fieldInfo.title}`}
          <el-button
            style="float: right; padding: 3px 0; margin: 0 10px;"
            icon="el-icon-delete"
            type="text"
            onClick={() => onDelete(value, index)}
            disabled={multipleDisabled}
          ></el-button>
          {fieldInfo.isCopy ? (
            <el-button
              style="float: right; padding: 3px 0; margin: 0 10px;"
              icon="el-icon-plus"
              type="text"
              onClick={() => onCopy(index)}
              disabled={multipleDisabled}
            ></el-button>
          ) : (
            ""
          )}
          {fieldInfo.isFold ? (
            <el-button
              onClick={() => doFolded(value)}
              type="text"
              icon={
                !this.folded[`${value.key}`]
                  ? "el-icon-arrow-up"
                  : "el-icon-arrow-down"
              }
            ></el-button>
          ) : (
            ""
          )}
        </div>
        <el-collapse-transition>
          <el-row
            gutter={fieldInfo.gutter}
            v-show={!this.folded[`${value.key}`]}
            style={{ padding: "10px 0px" }}
            key={value.key}
          >
            <div>
              {buildColumnContainer.call(
                this,
                h,
                fieldInfo,
                `${valuePath}[${index}]`,
                usefulMeta,
                value.key
              )}
            </div>
          </el-row>
        </el-collapse-transition>
      </el-card>
    );
  });

  return <div>{multipleRowElements}</div>;
}

function buildFormItem(h, metaData, valuePath, usefulMeta = {}) {
  if (metaData.compType === "row") {
    return buildRowContainer.call(this, h, metaData, valuePath, usefulMeta);
  }

  valuePath = valuePath ? `${valuePath}.${metaData.id}` : `${metaData.id}`;

  !usefulMeta[valuePath] && (usefulMeta[valuePath] = _.cloneDeep(metaData));
  this.flatFields = Object.values(usefulMeta ?? {});
  const fieldInfo = usefulMeta[valuePath];
  // TODO: 这里是引发多次调用render的关键，需要将context设置为非响应式数据
  fieldInfo.context = this.context;
  fieldInfo.valuePath = valuePath;
  const rules = checkRules(fieldInfo);

  if(this.processInstanceId){
    fieldInfo.processInstanceId = this.processInstanceId;
  }

  const needDependFunction = !this.formConf.disabled && fieldInfo.dependValue;
  if (needDependFunction) {
    mixinDependFunction(fieldInfo, handleDependChange.bind(this));
  }

  const needRequestFunction =
    (this.formConf.readOnly || !this.formConf.disabled) &&
    fieldInfo.requestConfig;
  if (needRequestFunction) {
    mixinRequestFunction(fieldInfo, handleRequestDependChange.bind(this));
  }
  if (
    fieldInfo["list-type"] === "text" ||
    fieldInfo["list-type"] === "picture-card"
  ) {
    return (
      <upload
        formConf={this.formConf}
        uploadFun={this.uploadFun}
        downloadFun={this.downloadFun}
        beforeDeleteFileFun={this.beforeDeleteFileFun}
        fieldInfo={fieldInfo}
        readOnly={this.formConf.readOnly}
        onInput={(event) => {
          _.set(this.form, fieldInfo.valuePath, event);
        }}
        rules={rules}
        value={_.get(this.form, fieldInfo.valuePath)}
      />
    );
  } else {
    return (
      <el-form-item
        label={fieldInfo.showLabel ? fieldInfo.label : ""}
        label-width={`${fieldInfo.labelWidth}px`}
        prop={fieldInfo.valuePath}
        rules={rules}
      >
        <render
          key={fieldInfo.id}
          conf={fieldInfo}
          formConf={this.formConf}
          value={_.get(this.form, fieldInfo.valuePath)}
          uploadFun={this.uploadFun}
          downloadFun={this.downloadFun}
          onInput={(event) => {
            _.set(this.form, fieldInfo.valuePath, event);
          }}
        />
      </el-form-item>
    );
  }
}
import upload from "@/plugin/FormDesign/component/upload";
export default {
  name: "preview",
  props: [
    "itemList",
    "formData",
    "formConf",
    "uploadFun",
    "downloadFun",
    "beforeDeleteFileFun",
    "context",
    "processInstanceId"
  ],
  components: { render, upload },
  data() {
    const metaDataList = _.cloneDeep(this.itemList) ?? [];
    let form = {};
    const initForm = metaDataList.reduce(buildModel, {});
    if (this.formData) {
      form = _.cloneDeep(this.formData);
    } else {
      form = _.cloneDeep(initForm);
    }
    return {
      initForm,
      form,
      usefulMeta: {},
      metaDataList,
      flatFields: [],
      folded: {},
    };
  },
  watch: {
    itemList(itemList) {
      this.metaDataList = _.cloneDeep(itemList);
      if (this.formData) {
        this.form = _.cloneDeep(this.formData);
      } else {
        this.form = this.metaDataList.reduce(buildModel, {});
      }
      this.flatFields = [];
      this.usefulMeta = {};
    },
  },
  mixins: [
    formDepMonitorMixin({
      formData: "form",
      formFields: "flatFields",
    }),
  ],
  render(h) {
    return (
      <el-form
        ref={this.formConf.formModel}
        size={this.formConf.size}
        props={{
          model: this.form,
        }}
        label-position={this.formConf.labelPosition}
        disabled={this.formConf.disabled}
        validate-on-rule-change={false}
        label-width={this.formConf.labelWidth + "px"}
        nativeOnSubmit={this.submit}
        style={{ width: "100%" }}
      >
        {this.metaDataList.map((metaData) =>
          buildFormItem.call(this, h, metaData, "", this.usefulMeta)
        )}
      </el-form>
    );
  },
  methods: {
    async submit() {
      try {
        await this.$refs[this.formConf.formModel].validate();
        return _.cloneDeep({
          metaDataList: this.metaDataList,
          formData: this.form,
        });
      } catch (e) {
        throw new Error(e.toString());
      }
    },
    resetFields() {
      this.$refs[this.formConf.formModel].resetFields();
    }
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-select {
  width: 100% !important;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
