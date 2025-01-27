import { deepCopy, emptyPropertiesObject } from '../../../../utils/object'
import panelEffect from '../effect'
import panelListener from '../listener'

const state = () => ({
  shapeType: '',
  rootBaseInfo: {
    processName:'',
    processDesc: ''
  },
  baseInfo: {
    id: '',
    name: '',
  },
  documentation: '',
  parentDocumentation: '',
  timer: {},
  condition: {
    type: 'expression',
    sourceRef: '',
    judgment: '',
    conditionTarget: ''
  },
  messages: [],
  signals: [],
  listeners: [],
  extendProperties: [],
  inputParameters: [],
  outputParameters: [],
  multiInstance: {
    loopCharacteristics: '',
    loopCardinality: '',
    collection: '',
    elementVariable: '',
    completionCondition: '',
  },
  condiInstance: {
    isHavLoopCharacteristics: false,
    typeSt: 'nrOfInstances',
    passPerson: '',
    passPercent: '',
  },
  userTask: {
    displayAssignee: {},
    displayCandidateUsers: [],
    displayCandidateGroups: [],
  },
  actions: [],
})

const getters = {
  findListenerByIndex(state) {
    return (index) => {
      // 为了保证数据是单向流动的，这里需要将匹配的对象重新解构为新的对象
      // 这样做的目的是防止Vue响应式的双向数据绑定会直接修改state中的数据
      return deepCopy(state.listeners[index] ?? {})
    }
  },
  findSignalByIndex(state) {
    return (index) => {
      return deepCopy(state.signals[index] ?? {})
    }
  },
  findMessageByIndex(state) {
    return (index) => {
      return deepCopy(state.messages[index] ?? {})
    }
  },
  findInputParameterByIndex(state) {
    return (index) => {
      return deepCopy(state.inputParameters[index] ?? {})
    }
  },
  findOutputParameterByIndex(state) {
    return (index) => {
      return deepCopy(state.outputParameters[index] ?? {})
    }
  },
}

const mutations = {
  updateBaseInfo(state, { newBaseInfo = {} }) {
    state.baseInfo = deepCopy(newBaseInfo)
  },
  updateRootBaseInfo(state, {rootBaseInfo = {}}){
    state.rootBaseInfo = deepCopy(rootBaseInfo)
  },
  updateDocumentation(state, { documentation = '' }) {
    state.documentation = documentation
  },
  updateParentDocumentation(state, { documentation = '' }) {
    state.parentDocumentation = documentation
  },
  addListener(state, { listener }) {
    if (emptyPropertiesObject(listener)) {
      return
    }
    state.listeners.push(listener)
  },
  updateListener(state, { index, newListener }) {
    if (!state.listeners[index] || emptyPropertiesObject(newListener)) {
      return
    }
    state.listeners.splice(index, 1, newListener)
  },
  removeListener(state, { index }) {
    if (!state.listeners[index]) {
      return
    }
    state.listeners.splice(index, 1)
  },
  clearListener(state) {
    state.listeners = []
  },
  addSignal(state, { signal }) {
    if (emptyPropertiesObject(signal)) {
      return
    }
    state.signals.push(signal)
  },
  updateSignal(state, { index, newSignal }) {
    if (!state.signals[index] || emptyPropertiesObject(newSignal)) {
      return
    }
    state.signals.splice(index, 1, newSignal)
  },
  removeSignal(state, { index }) {
    if (!state.signals[index]) {
      return
    }
    state.signals.splice(index, 1)
  },
  addMessage(state, { message }) {
    if (emptyPropertiesObject(message)) {
      return
    }
    state.messages.push(message)
  },
  updateMessage(state, { index, newMessage }) {
    if (!state.messages[index] || emptyPropertiesObject(newMessage)) {
      return
    }
    state.messages.splice(index, 1, newMessage)
  },
  removeMessage(state, { index }) {
    if (!state.messages[index]) {
      return
    }
    state.messages.splice(index, 1)
  },
  addInputParameter(state, { parameter }) {
    if (emptyPropertiesObject(parameter)) {
      return
    }
    state.inputParameters.push(parameter)
  },
  updateInputParameter(state, { index, newParameter }) {
    if (!state.inputParameters[index] || emptyPropertiesObject(newParameter)) {
      return
    }
    state.inputParameters.splice(index, 1, newParameter)
  },
  removeInputParameter(state, { index }) {
    if (!state.inputParameters[index]) {
      return
    }
    state.inputParameters.splice(index, 1)
  },
  addOutputParameter(state, { parameter }) {
    if (emptyPropertiesObject(parameter)) {
      return
    }
    state.outputParameters.push(parameter)
  },
  updateOutputParameter(state, { index, newParameter }) {
    if (!state.outputParameters[index] || emptyPropertiesObject(newParameter)) {
      return
    }
    state.outputParameters.splice(index, 1, newParameter)
  },
  removeOutputParameter(state, { index }) {
    if (!state.outputParameters[index]) {
      return
    }
    state.outputParameters.splice(index, 1)
  },
  updateUserTask(state, { newUserTask }) {
    state.userTask = deepCopy(newUserTask)
  },
  updateMultiInstance(state, { newMultiInstance }) {
    state.multiInstance = deepCopy(newMultiInstance)
  },
  updateActions(state, { newActions }) {
    if (!Array.isArray(newActions)) {
      return
    }
    state.actions = [...newActions]
  },
  updateTimer(state, { newTimer }) {
    state.timer = deepCopy(newTimer)
  },
  updateCondition(state, { newCondition }) {
    state.condition = deepCopy(newCondition)
  },
  updateCondiInstance(state, newData) {
    state.condiInstance = {...newData}
  },
}

const mutationsEffect = {
  updateBaseInfo: panelEffect.baseInfoEffect,
  updateDocumentation: panelEffect.documentationEffect,
  updateParentDocumentation: panelEffect.parentDocumentationEffect,
  addListener: panelEffect.listenerEffect,
  updateListener: panelEffect.listenerEffect,
  removeListener: panelEffect.listenerEffect,
  clearListener: panelEffect.listenerEffect,
  addSignal: panelEffect.signalEffect,
  updateSignal: panelEffect.signalEffect,
  removeSignal: panelEffect.signalEffect,
  addInputParameter: panelEffect.inputOutputParameterEffect,
  updateInputParameter: panelEffect.inputOutputParameterEffect,
  removeInputParameter: panelEffect.inputOutputParameterEffect,
  addOutputParameter: panelEffect.inputOutputParameterEffect,
  updateOutputParameter: panelEffect.inputOutputParameterEffect,
  removeOutputParameter: panelEffect.inputOutputParameterEffect,
  updateUserTask: panelEffect.userTaskEffect,
  updateMultiInstance: panelEffect.multiInstanceEffect,
  updateActions: panelEffect.actionsEffect,
  updateTimer: panelEffect.timerEffect,
  updateCondition: panelEffect.conditionEffect,
  updateCondiInstance: panelEffect.condiInstanceEffect
}

const eventsListener = {
  'selection.changed': panelListener.onSelectionChanged,
  'shape.changed': panelListener.onShapeChanged,
  'shape.move.move': panelListener.onShapeMove,
  'rootShape.changed': panelListener.onRootShapeChanged,
}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  mutationsEffect,
  eventsListener,
}
