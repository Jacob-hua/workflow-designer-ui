import IBpmnModeler from '../../../../IBpmnModeler'
import BpmnShapeType, { getShapeType } from '../../../../enum/shapeType'
import { typeAssert } from '../../../../utils/object'

function listenersParameter2State(iBpmnModeler = new IBpmnModeler()) {
  const listeners = iBpmnModeler.getSelectedShapeInfoByDefaultLocalName('ExecutionListener') ?? []
  return listeners.map(listener2State)

  function listener2State(listener) {
    const state = {}
    state.event = listener.event
    if (listener.class) {
      state.listenerType = 'class'
      state.class = listener.class
    } else if (listener.expression) {
      state.listenerType = 'expression'
      state.expression = listener.expression
    } else if (listener.delegateExpression) {
      state.listenerType = 'delegateExpression'
      state.delegateExpression = listener.delegateExpression
    } else if (listener.script) {
      if (listener.script.value) {
        state.scriptType = 'inline'
        state.scriptValue = listener.script.value
      } else {
        state.scriptType = 'outside'
        state.scriptResource = listener.script.resource
      }
    }
    state.fields = listener.fields?.map(listenerField2State)
    return state
  }

  function listenerField2State(field) {
    const state = {}
    state.name = field.name
    if (field.string) {
      state.fieldType = 'string'
      state.value = field.string
    } else if (field.expression) {
      state.fieldType = 'expression'
      state.value = field.expression
    }
    return state
  }
}

function inputOutputParameter2State(iBpmnModeler = new IBpmnModeler()) {
  const state = {}
  const inputOutputParameters = iBpmnModeler.getSelectedShapeInfoByDefaultLocalName('InputOutput') ?? []
  const inputOutputParameter = inputOutputParameters[0] ?? {}
  if (inputOutputParameter['outputParameters']) {
    state.outputParameters = inputOutputParameter.outputParameters.map(parameter2State)
  } else {
    state.outputParameters = []
  }
  if (inputOutputParameter['inputParameters']) {
    state.inputParameters = inputOutputParameter.inputParameters.map(parameter2State)
  } else {
    state.inputParameters = []
  }
  return state

  function parameter2State(parameter) {
    let state = {}
    state.name = parameter.name
    if (parameter['definition']) {
      state = { ...state, ...parameterDefinition2State(parameter.definition) }
    } else {
      state.type = 'string/expression'
      state.value = parameter.value
    }
    return state
  }

  function parameterDefinition2State(definition) {
    const parameter = {}
    if (definition['scriptFormat']) {
      parameter.type = 'script'
      parameter.scriptFormat = definition.scriptFormat
      if (definition['value']) {
        parameter.scriptType = 'inline'
        parameter.scriptValue = definition.value
      } else {
        parameter.scriptType = 'outside'
        parameter.scriptResource = definition.resource
      }
    } else if (definition['items']) {
      parameter.type = 'list'
      parameter.listValues = definition.items?.map(({ value }) => value) ?? []
    } else if (definition['entries']) {
      parameter.type = 'map'
      parameter.mapValues = definition.entries?.map(({ key, value }) => ({ key, value })) ?? []
    }
    return parameter
  }
}

function baseInfoParameter2State(iBpmnModeler = new IBpmnModeler()) {
  const baseInfo = {}
  const shapeInfo = iBpmnModeler.getSelectedShapeInfo()
  baseInfo.name = shapeInfo.name
  baseInfo.id = shapeInfo.id
  shapeInfo.sourceRef && (baseInfo.sourceRefType = getShapeType(shapeInfo.sourceRef.$type))
  shapeInfo.targetRef && (baseInfo.targetRefType = getShapeType(shapeInfo.targetRef.$type))
  return baseInfo
}

function documentationParameter2State(iBpmnModeler = new IBpmnModeler()) {
  let documentation = ''
  if (
    Array.isArray(iBpmnModeler.getSelectedShapeInfoByType('documentation')) &&
    iBpmnModeler.getSelectedShapeInfoByType('documentation').length === 1
  ) {
    documentation = iBpmnModeler.getSelectedShapeInfoByType('documentation')[0].text
  }
  return documentation
}

function userTaskParameter2State(iBpmnModeler = new IBpmnModeler()) {
  const userTask = {
    displayAssignee: {},
    displayCandidateUsers: [],
    displayCandidateGroups: [],
  }
  const shapeInfo = iBpmnModeler.getSelectedShapeInfo()
  userTask.displayAssignee = JSON.parse(shapeInfo['displayAssignee'] ?? '{}')
  userTask.displayCandidateUsers = JSON.parse(shapeInfo['displayCandidateUsers'] ?? '[]')
  userTask.displayCandidateGroups = JSON.parse(shapeInfo['displayCandidateGroups'] ?? '[]')
  return userTask
}

function actionsParameter2State(iBpmnModeler = new IBpmnModeler()) {
  const shapeInfo = iBpmnModeler.getSelectedShapeInfo()
  if (typeAssert(shapeInfo['actions'], String)) {
    return shapeInfo['actions'].split(',').map((action) => action.trim())
  }
  return [...(shapeInfo['actions'] ?? [])]
}

function shapeType2State(iBpmnModeler = new IBpmnModeler()) {
  return iBpmnModeler.getSelectedShapeType()
}

function multiInstance2State(iBpmnModeler = new IBpmnModeler()) {
  const multiInstance = {
    loopCharacteristics: '',
    loopCardinality: '',
    collection: '',
    elementVariable: '',
    completionCondition: '',
  }
  const shapeInfo = iBpmnModeler.getSelectedShapeInfo()
  if (!shapeInfo.loopCharacteristics) {
    return multiInstance
  }
  const loopCharacteristics = shapeInfo.loopCharacteristics
  if (loopCharacteristics.isSequential) {
    multiInstance.loopCharacteristics = 'SequentialMultiInstance'
  } else {
    multiInstance.loopCharacteristics = 'ParallelMultiInstance'
  }
  multiInstance.loopCardinality = loopCharacteristics.loopCardinality?.body
  multiInstance.completionCondition = loopCharacteristics.completionCondition?.body
  multiInstance.collection = loopCharacteristics.collection
  multiInstance.elementVariable = loopCharacteristics.elementVariable
  return multiInstance
}

function timer2State(iBpmnModeler = new IBpmnModeler()) {
  const state = {
    timerType: 'null',
  }
  if (iBpmnModeler.getSelectedShapeType() !== BpmnShapeType.TIMER_START_EVENT) {
    return state
  }
  const [moddleElement = {}] = iBpmnModeler.getSelectedShapeInfoByType('eventDefinitions')
  if (moddleElement['timeDate']) {
    state.timerType = 'date'
    state.timer = moddleElement['timeDate']?.body
  } else if (moddleElement['timeDuration']) {
    state.timerType = 'duration'
    state.timer = moddleElement['timeDuration']?.body
  } else if (moddleElement['timeCycle']) {
    state.timerType = 'cycle'
    state.timer = moddleElement['timeCycle']?.body
  }
  return state
}

function condition2State(iBpmnModeler = new IBpmnModeler()) {
  const state = {
    type: 'null',
    expression: '',
    scriptFormat: '',
    scriptType: '',
    scriptResource: '',
    script: '',
  }

  const conditionExpression = iBpmnModeler.getSelectedShapeInfoByType('conditionExpression')
  if (!conditionExpression) {
    return state
  }

  if (conditionExpression.language) {
    state.type = 'script'
    state.scriptFormat = conditionExpression.language
    conditionExpression.resource && (state.scriptResource = conditionExpression.resource)
    conditionExpression.body && (state.script = conditionExpression.body)
  } else {
    state.type = 'expression'
    state.expression = conditionExpression.body
  }

  return state
}

function onSelectionChangedListener(_, commit, iBpmnModeler = new IBpmnModeler()) {
  if (!iBpmnModeler.getSelectedShape()) {
    commit('initState')
    commit('refreshState', {
      baseInfo: {
        name: iBpmnModeler.getRootShapeInfo().name,
        id: iBpmnModeler.getRootShapeInfo().id,
      },
      shapeType: '',
      documentation: '',
    })
    return
  }

  const baseInfo = baseInfoParameter2State(iBpmnModeler)

  const documentation = documentationParameter2State(iBpmnModeler)

  const listeners = listenersParameter2State(iBpmnModeler)

  const { inputParameters, outputParameters } = inputOutputParameter2State(iBpmnModeler)

  const userTask = userTaskParameter2State(iBpmnModeler)

  const actions = actionsParameter2State(iBpmnModeler)

  const shapeType = shapeType2State(iBpmnModeler)

  const multiInstance = multiInstance2State(iBpmnModeler)

  const timer = timer2State(iBpmnModeler)

  const condition = condition2State(iBpmnModeler)

  commit('refreshState', {
    shapeType,
    baseInfo,
    documentation,
    listeners,
    inputParameters,
    outputParameters,
    userTask,
    actions,
    multiInstance,
    timer,
    condition,
  })
}

export default onSelectionChangedListener
