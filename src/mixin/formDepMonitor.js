import { ApiEnum } from '../enum'
import _ from 'lodash'

/**
 * 默认的变量空间
 */
const defaultVariableSpace = () => ({
  const: {},
  context: {},
  form: {},
})

/**
 * 变量处理工厂
 *
 * @param {*} param0
 * @returns
 */
export function variableFactory({ method, parameter, body }) {
  const variablesHandlers = {
    [ApiEnum.API_TYPE_GET]: extractVariables(parameter),
    [ApiEnum.API_TYPE_POST]: extractVariables(body),
  }
  return variablesHandlers[method]

  function extractVariables(str) {
    return String.prototype.match.call(str, /(?<=\$\{)(.+?)(?=\})/g)
  }
}

/**
 * 请求参数处理
 *
 * @param {*} param0
 * @returns
 */
export function parameterHandlerFactory({ method, parameter, body }) {
  const parameterHandlers = {
    [ApiEnum.API_TYPE_GET]: (payload) => {
      if (!variableFactory({ method, parameter, body })) {
        return parameter
      }
      return variableAssignment(parameter, payload)
    },
    [ApiEnum.API_TYPE_POST]: (payload) => {
      if (!variableFactory({ method, parameter, body })) {
        return JSON.parse(body)
      }
      return JSON.parse(variableAssignment(body, payload))
    },
  }
  return parameterHandlers[method]

  function variableAssignment(str, payload) {
    return Object.keys(payload).reduce((parameter, key) => {
      return parameter.replace(`\$\{${key}\}`, payload[key])
    }, str)
  }
}

/**
 * 变量分类器
 *
 * @param {*} param0
 * @param {*} variableSpace
 * @returns
 */
export function variableClassify({ variable, sourceType, source }, variableSpace = {}) {
  const result = { ...defaultVariableSpace(), ...variableSpace }
  const classifier = {
    context: ({ variable, source }) => {
      result.context[variable] = (context = {}) => ({
        [variable]: context[source],
      })
    },
    const: ({ variable, source }) => {
      result.const[variable] = source
    },
    form: ({ variable, source }) => {
      result.form[source] = {
        variable,
        value: '',
      }
    },
  }
  classifier[sourceType]({ variable, source })
  return result
}

/**
 * 监听执行
 *
 * @param {*} prefix
 * @param {*} fieldInfo
 * @param {*} executeFunc
 * @returns
 */
export function watchExecute(prefix, fieldInfo, executeFunc = () => {}) {
  const variableSpace = { ...defaultVariableSpace(), ...(fieldInfo[`${prefix}VariableSpace`] ?? {}) }

  !fieldInfo.context && (fieldInfo.context = {})

  if (Object.keys(variableSpace.form).length === 0) {
    executeFunc(variableMix(variableSpace), fieldInfo, false)
    return fieldInfo
  }

  if (!fieldInfo.executeFuncs) {
    fieldInfo.executeFuncs = new Map()
  }

  fieldInfo.executeFuncs.set(calculateFuncKey(variableSpace), (data) => {
    if (diffDepObj(variableSpace.form, data)) {
      executeFunc(variableMix(variableSpace), fieldInfo, true)
    }
  })
  return fieldInfo

  function calculateFuncKey(variableSpace) {
    const key = Object.keys(variableSpace).reduce(
      (funcKey, space) => {
        return Object.keys(variableSpace[space]).reduce(
          (funcKey, key) => (funcKey ? `${funcKey}/${key}` : key),
          funcKey
        )
      },
      fieldInfo.valuePath ? `${fieldInfo.valuePath}` : ''
    )
    return `${prefix}::${key}`
  }

  function calculateDependValue(data, fieldValuePath, dependValuePath) {
    fieldValuePath = fieldValuePath ?? ''
    const pathLastIndex = fieldValuePath.lastIndexOf('.')
    const domainPath = fieldValuePath.substring(0, pathLastIndex)
    const domain = _.get(data, domainPath, undefined)
    if (Object.prototype.toString.call(domain) !== '[object Object]') {
      return _.get(data, dependValuePath)
    }
    if (!_.has(domain, dependValuePath)) {
      return calculateDependValue(data, domainPath, dependValuePath)
    }
    return _.get(domain, dependValuePath)
  }

  function diffDepObj(dependObj, data) {
    return Object.keys(dependObj).reduce((isDiffed, dependValuePath) => {
      const dependValue = calculateDependValue(data, fieldInfo.valuePath, dependValuePath)
      isDiffed = isDiffed || dependValue !== dependObj[dependValuePath].value
      // 如果前后的dependValue都是假值，则默认为发生变化
      if (prefix === 'depend' && !dependValue && !dependObj[dependValuePath].value) {
        isDiffed = true
      }
      dependObj[dependValuePath].value = dependValue
      return isDiffed
    }, false)
  }

  function variableMix(variableSpace) {
    const formVariables = Object.values(variableSpace.form).reduce(
      (formVariables, { variable, value }) => ({
        ...formVariables,
        [variable]: value,
      }),
      {}
    )
    const contextVariables = Object.values(variableSpace.context).reduce(
      (contextVariables, contextFunc) => ({
        ...contextVariables,
        ...contextFunc(fieldInfo.context),
      }),
      {}
    )
    return { ...variableSpace.const, ...contextVariables, ...formVariables }
  }
}

/**
 * 关联处理函数
 *
 * @param {*} fieldInfo
 * @param {*} executeFunc
 * @returns
 */
export function mixinDependFunction(fieldInfo, executeFunc = () => {}) {
  if (!fieldInfo.dependValue) {
    return fieldInfo
  }

  if (!fieldInfo.dependVariableSpace) {
    fieldInfo.dependVariableSpace = variableClassify({
      variable: fieldInfo.id,
      ...fieldInfo.dependValue,
    })
  }

  return watchExecute('depend', fieldInfo, executeFunc)
}

/**
 * 请求处理函数
 *
 * @param {*} fieldInfo
 * @param {*} executeFunc
 * @returns
 */
export function mixinRequestFunction(fieldInfo, executeFunc = () => {}) {
  if (!fieldInfo.requestConfig) {
    return fieldInfo
  }
  if (fieldInfo.dataType === 'static') {
    return fieldInfo
  }
  let variables = fieldInfo.requestConfig.variables
  if (!variables) {
    variables = makeVariables(fieldInfo.requestConfig)
  }

  const parameterHandler = parameterHandlerFactory(fieldInfo.requestConfig)
  if (!variables || variables.length === 0) {
    executeFunc(parameterHandler(), fieldInfo)
    return fieldInfo
  }

  if (!fieldInfo.requestVariableSpace) {
    fieldInfo.requestVariableSpace = variables.reduce(
      (variableSpace, metaVariable) => variableClassify(metaVariable, variableSpace),
      {}
    )
  }

  return watchExecute('request', fieldInfo, (variableObj, fieldInfo, isDependDiffed) => {
    executeFunc(parameterHandler(variableObj), fieldInfo, isDependDiffed)
  })
}

/**
 * 获取请求参数
 *
 * @param {*} requestConfig
 * @param {*} sourceType
 * @returns
 */
function makeVariables(requestConfig = [], sourceType = 'form') {
  return (variableFactory(requestConfig) ?? []).map((variable) => ({
    variable,
    sourceType,
    source: variable,
  }))
}

/**
 * 表单依赖处理器
 *
 * @param {*} props
 * @returns
 */
function formDepMonitorMixin(props = { formData: 'formData', formFields: 'formFields' }) {
  const { formData, formFields } = props
  return {
    watch: {
      [formData]: {
        immediate: true,
        deep: true,
        handler(data) {
          this.$nextTick(() => {
            const needExecutes = this[formFields]?.filter(({ executeFuncs }) => executeFuncs) ?? []
            needExecutes.forEach(({ executeFuncs }) => {
              executeFuncs.forEach((execute) => execute({ ...data }))
            })
          })
        },
      },
    },
  }
}

export default formDepMonitorMixin
