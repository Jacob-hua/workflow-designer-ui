import {ApiEnum} from '../enum'

export function variableFactory({method, parameter, body}) {
    const variablesHandlers = {
        [ApiEnum.API_TYPE_GET]: extractVariables(parameter),
        [ApiEnum.API_TYPE_POST]: extractVariables(body),
    }
    return variablesHandlers[method]

    function extractVariables(str) {
        return String.prototype.match.call(str, /(?<=\$\{)(.+?)(?=\})/g)
    }
}

export function parameterHandlerFactory({method, parameter, body}) {
    const parameterHandlers = {
        [ApiEnum.API_TYPE_GET]: (payload) => {
            if (!variableFactory({method, parameter, body})) {
                return parameter
            }
            return variableAssignment(parameter, payload)
        },
        [ApiEnum.API_TYPE_POST]: (payload) => {
            if (!variableFactory({method, parameter, body})) {
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

const process_params_out = async ({
       oldVariables = {},
       context= () => {},
       executeFunc = () => {},
       parameterHandler = () => {},
       newFieldInfo = {}
}) => {
    const contexts = await context
    for (const variableKey in oldVariables) {
        oldVariables[variableKey]  = contexts[variableKey] ?? ''
    }
   await executeFunc(parameterHandler(oldVariables), newFieldInfo)
}

const process_params_inout = async ({
        oldVariables = {},
        context= () => {},
        newFieldInfo = {}
}) => {
    const contexts = await context
    let relationMap = newFieldInfo.relationMapping.reduce((relationMap, item) => ({ ...relationMap, ...item }), {})
    for (const key in relationMap) {
        if (relationMap[key].startsWith('$')) {
            for (const variableKey in oldVariables) {
                oldVariables[key]  = contexts[key] ?? ''
            }
        }
    }
}
const SourceFrom = {
    ALL_FROM_OUT: 'judgeValueOut',
    FROM_OUT_IN:  'middleValue',
}

const ContextOrFormLogic = {
    [ SourceFrom.ALL_FROM_OUT]:  process_params_out,
    [ SourceFrom.FROM_OUT_IN ]:  process_params_inout,
}

function judgeValueFrom({ relationMapping = [] } ) {
    let relationMap = relationMapping.reduce((relationMap, item) => ({ ...relationMap, ...item }), {})
    const judgeValueOut = Object.values(relationMap).every(item => item.startsWith('$'))
    return  judgeValueOut
                        ?
                        'judgeValueOut'
                        : 'middleValue'
}


export function mixinExecuteFunction(fieldInfo, executeFunc = () => {
}) {
    const newFieldInfo = {...fieldInfo}
    if (!newFieldInfo.requestConfig) {
        return newFieldInfo
    }

    const variables = variableFactory(newFieldInfo.requestConfig)
    const parameterHandler = parameterHandlerFactory(newFieldInfo.requestConfig)
    if (!variables) {
        executeFunc(parameterHandler(), newFieldInfo)
        return newFieldInfo
    }


    const oldVariables = variables.reduce((oldVariables, variable) => ({...oldVariables, [variable]: ''}), {})
    if (newFieldInfo.relationMapping.length) {
        ContextOrFormLogic[judgeValueFrom(newFieldInfo)]({
            oldVariables,
            context: newFieldInfo.context,
            executeFunc,
            parameterHandler,
            newFieldInfo
        })
    }

    newFieldInfo.executeFunc = (data) => {
        const isDiffed = Object.keys(data)
            .filter((key) => variables.includes(key))
            .reduce((isDiffed, key) => {
                isDiffed = isDiffed || oldVariables[key] !== data[key]
                oldVariables[key] = data[key]
                return isDiffed
            }, false)
        if (isDiffed) {
            executeFunc(parameterHandler(oldVariables), newFieldInfo)
        }
    }
    return newFieldInfo
}

function formDepMonitorMixin(props = {formData: 'formData', formFields: 'formFields'}) {
    const {formData, formFields} = props
    return {
        watch: {
            [formData]: {
                immediate: true,
                deep: true,
                handler(data) {
                    const needExecutes = this[formFields]?.filter(({executeFunc}) => executeFunc) ?? []
                    needExecutes.forEach(({executeFunc}) => {
                        executeFunc({...data})
                    })
                },
            },
        },
    }
}

export default formDepMonitorMixin
