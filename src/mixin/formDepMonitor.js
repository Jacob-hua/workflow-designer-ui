import { ApiEnum } from '../enum'
import _ from 'lodash'

const defaultVariableSpace = () => ({
  const: {},
  context: {},
  form: {},
})

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

export function watchExecute(fieldInfo, executeFunc = () => {}, immediate = false) {
  const variableSpace = { ...defaultVariableSpace(), ...(fieldInfo.variableSpace ?? {}) }

  !fieldInfo.context && (fieldInfo.context = {})

  if (Object.keys(variableSpace.form).length === 0) {
    executeFunc(variableMix(variableSpace), fieldInfo)
    return fieldInfo
  }

  if (!fieldInfo.executeFuncs) {
    fieldInfo.executeFuncs = new Map()
  }

  fieldInfo.executeFuncs.set(calculateFuncKey(variableSpace), (data) => {
    if (diffeDepObj(variableSpace.form, data)) {
      executeFunc(variableMix(variableSpace), fieldInfo)
    }
  })
  return fieldInfo

  function calculateFuncKey(variableSpace) {
    return Object.keys(variableSpace).reduce(
      (funcKey, space) => {
        return Object.keys(variableSpace[space]).reduce(
          (funcKey, key) => (funcKey ? `${funcKey}/${key}` : key),
          funcKey
        )
      },
      fieldInfo.valuePath ? `${fieldInfo.valuePath}` : ''
    )
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

  function diffeDepObj(dependObj, data) {
    return Object.keys(dependObj).reduce((isDiffe, dependValuePath) => {
      const dependValue = calculateDependValue(data, fieldInfo.valuePath, dependValuePath)
      isDiffe = isDiffe || dependValue !== dependObj[dependValuePath].value
      // 如果前后的dependValue都是假值，则默认为发生变化
      if (immediate && !dependValue && !dependObj[dependValuePath].value) {
        isDiffe = true
      }
      dependObj[dependValuePath].value = dependValue
      return isDiffe
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

export function mixinDependFunction(fieldInfo, executeFunc = () => {}) {
  if (!fieldInfo.dependValue) {
    return fieldInfo
  }

  if (!fieldInfo.variableSpace) {
    const variableSpace = variableClassify({
      variable: fieldInfo.id,
      ...fieldInfo.dependValue,
    })
    fieldInfo.variableSpace = variableSpace
  }

  return watchExecute(fieldInfo, executeFunc, true)
}

export function mixinRequestFunction(fieldInfo, executeFunc = () => {}) {
  if (!fieldInfo.requestConfig) {
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

  if (!fieldInfo.variableSpace) {
    const variableSpace = variables.reduce(
      (variableSpace, metaVariable) => variableClassify(metaVariable, variableSpace),
      {
        ...defaultVariableSpace(),
      }
    )
    fieldInfo.variableSpace = variableSpace
  }

  return watchExecute(fieldInfo, (variableObj, fieldInfo) => {
    executeFunc(parameterHandler(variableObj), fieldInfo)
  })

  function makeVariables(requestConfig = [], sourceType = 'form') {
    return (variableFactory(requestConfig) ?? []).map((variable) => ({
      variable,
      sourceType,
      source: variable,
    }))
  }
}

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
