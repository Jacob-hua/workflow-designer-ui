import IBpmnModeler from '../../../../IBpmnModeler'

function onShapeMove({ shape }, commit, iBpmnModeler = new IBpmnModeler()) {
  commit('refreshState', { shapeType: iBpmnModeler.getShapeType(shape) })
}

export default onShapeMove
