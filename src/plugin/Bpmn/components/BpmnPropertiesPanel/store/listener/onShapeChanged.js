import IBpmnModeler from '../../../../IBpmnModeler'

function baseInfoParameter2State(iBpmnModeler = new IBpmnModeler()) {
  const state = {}
  const shapeInfo = iBpmnModeler.getSelectedShapeInfo()
  state.name = shapeInfo.name
  state.id = shapeInfo.id
  return state
}

function shapeType2State(element, iBpmnModeler = new IBpmnModeler()) {
  return iBpmnModeler.getShapeType(element)
}

function multiInstance2State(element, iBpmnModeler = new IBpmnModeler()) {
  const state = {
    loopCharacteristics: '',
    loopCardinality: '',
    collection: '',
    elementVariable: '',
    completionCondition: '',
  }
  const moddleElement = iBpmnModeler.getShapeInfoByType(element, 'loopCharacteristics')
  if (!moddleElement) {
    return state
  }
  state.loopCharacteristics = moddleElement.isSequential ? 'SequentialMultiInstance' : 'ParallelMultiInstance'
  return state
}

function onShapeChangedListener({ element }, commit, iBpmnModeler = new IBpmnModeler()) {
  if (!element) {
    return
  }
  const baseInfo = baseInfoParameter2State(iBpmnModeler)
  const shapeType = shapeType2State(element, iBpmnModeler)
  const multiInstance = multiInstance2State(element, iBpmnModeler)
  commit('refreshState', { baseInfo, shapeType, multiInstance })
}

export default onShapeChangedListener
