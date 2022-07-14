import IBpmnModeler from '../../../../IBpmnModeler'

function baseInfoParameter2State(iBpmnModeler = new IBpmnModeler()) {
  const state = {}
  const shapeInfo = iBpmnModeler.getRootShapeInfo()
  state.name = shapeInfo.name
  state.id = shapeInfo.id
  return state
}

function shapeType2State(element, iBpmnModeler = new IBpmnModeler()) {
  return iBpmnModeler.getShapeType(element)
}

function onRootShapeChangedListener({ element }, commit, iBpmnModeler = new IBpmnModeler()) {
  if (!element) {
    return
  }
  const baseInfo = baseInfoParameter2State(iBpmnModeler)
  const shapeType = shapeType2State(element, iBpmnModeler)
  commit('refreshState', { baseInfo, shapeType })
}

export default onRootShapeChangedListener
