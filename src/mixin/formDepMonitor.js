import { ApiEnum } from '../enum'

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

export function mixinExecuteFunction(fieldInfo, executeFunc = () => {}) {
  const newFieldInfo = { ...fieldInfo }
  if (!newFieldInfo.requestConfig) {
    return newFieldInfo
  }

  !newFieldInfo.context && (newFieldInfo.context = {})

  let variables = newFieldInfo.requestConfig.variables
  if (!variables) {
    variables = makeVariables(newFieldInfo.requestConfig)
  }

  const parameterHandler = parameterHandlerFactory(newFieldInfo.requestConfig)
  if (!variables || variables.length === 0) {
    executeFunc(parameterHandler(), newFieldInfo)
    return newFieldInfo
  }

  const variableSpace = variables.reduce(variableClassify, {
    context: {},
    const: {},
    form: {},
  })

  const depObj = buildDepObj(variableSpace)

  newFieldInfo.executeFunc = (data) => {
    const isDiffed = Object.keys(data)
      .filter((key) => Object.keys(depObj).includes(key))
      .reduce((isDiffed, key) => {
        isDiffed = isDiffed || depObj[key] !== data[key]
        depObj[key] = data[key]
        return isDiffed
      }, false)
    if (isDiffed) {
      executeFunc(parameterHandler(variableMix(variableSpace, depObj)), newFieldInfo)
    }
  }
  return newFieldInfo

  function makeVariables(requestConfig = [], sourceType = 'form') {
    return (variableFactory(requestConfig) ?? []).map((variable) => ({
      variable,
      sourceType,
      source: variable,
    }))
  }

  function variableClassify(variableSpace, { variable, sourceType, source }) {
    const result = { context: {}, const: {}, form: {}, ...variableSpace }
    const classifier = {
      context: ({ variable, source }) => {
        result.context[variable] = newFieldInfo.context[source]
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

  function buildDepObj(variableSpace) {
    return Object.keys(variableSpace.form).reduce((depObj, fieldName) => ({ ...depObj, [fieldName]: '' }), {})
  }

  function variableMix(variableSpace, depObj) {
    Object.keys(depObj).forEach((key) => {
      variableSpace.form[key]['value'] = depObj[key]
    })
    const formVariables = Object.values(variableSpace.form).reduce(
      (formVariables, { variable, value }) => ({ ...formVariables, [variable]: value }),
      {}
    )
    return { ...variableSpace.const, ...variableSpace.context, ...formVariables }
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
          const needExecutes = this[formFields]?.filter(({ executeFunc }) => executeFunc) ?? []
          needExecutes.forEach(({ executeFunc }) => {
            executeFunc({ ...data })
          })
        },
      },
    },
  }
}

export default formDepMonitorMixin
