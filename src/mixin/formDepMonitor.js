import { ApiEnum } from '../enum'

const defaultVariableSpace = {
  const: {},
  context: {},
  form: {},
}

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
  const result = { ...defaultVariableSpace, ...variableSpace }
  const classifier = {
    context: ({ variable, source }) => {
      result.context[variable] = (context = {}) => ({ [variable]: context[source] })
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

export function watchExecute(fieldInfo, variableSpace = {}, executeFunc = () => {}) {
  variableSpace = { ...defaultVariableSpace, ...variableSpace }

  !fieldInfo.context && (fieldInfo.context = {})

  if (Object.keys(variableSpace.form).length === 0) {
    executeFunc(variableMix(variableSpace), fieldInfo)
    return fieldInfo
  }

  if (!fieldInfo.executeFuncs) {
    fieldInfo.executeFuncs = []
  }
  const depObj = buildDepObj(variableSpace)
  fieldInfo.executeFuncs.push((data) => {
    const isDiffed = Object.keys(data)
      .filter((key) => Object.keys(depObj).includes(key))
      .reduce((isDiffed, key) => {
        isDiffed = isDiffed || depObj[key] !== data[key]
        depObj[key] = data[key]
        return isDiffed
      }, false)
    if (isDiffed) {
      executeFunc(variableMix(variableSpace, depObj), fieldInfo)
    }
  })
  return fieldInfo

  function buildDepObj(variableSpace) {
    return Object.keys(variableSpace.form).reduce((depObj, fieldName) => ({ ...depObj, [fieldName]: '' }), {})
  }

  function variableMix(variableSpace, depObj = {}) {
    Object.keys(depObj).forEach((key) => {
      variableSpace.form[key]['value'] = depObj[key]
    })
    const formVariables = Object.values(variableSpace.form).reduce(
      (formVariables, { variable, value }) => ({ ...formVariables, [variable]: value }),
      {}
    )
    const contextVariables = Object.values(variableSpace.context).reduce(
      (contextVariables, contextFunc) => ({ ...contextVariables, ...contextFunc(fieldInfo.context) }),
      {}
    )
    return { ...variableSpace.const, ...contextVariables, ...formVariables }
  }
}

export function mixinDependFunction(fieldInfo, executeFunc = () => {}) {
  if (!fieldInfo.dependValue) {
    return fieldInfo
  }

  const variableSpace = variableClassify({
    variable: fieldInfo.id,
    ...fieldInfo.dependValue,
  })

  return watchExecute(fieldInfo, variableSpace, executeFunc)
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

  const variableSpace = variables.reduce(
    (variableSpace, metaVariable) => variableClassify(metaVariable, variableSpace),
    {
      ...defaultVariableSpace,
    }
  )

  return watchExecute(fieldInfo, variableSpace, (variableObj, fieldInfo) => {
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
          const needExecutes = this[formFields]?.filter(({ executeFuncs }) => executeFuncs) ?? []
          needExecutes.forEach(({ executeFuncs }) => {
            executeFuncs.forEach((execute) => execute({ ...data }))
          })
        },
      },
    },
  }
}

export default formDepMonitorMixin
