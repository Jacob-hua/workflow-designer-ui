import IBpmnModeler from '../../../../IBpmnModeler'

function baseInfoEffect({ baseInfo }, iBpmnModeler = new IBpmnModeler()) {
  iBpmnModeler.updateSelectedShapeProperties(baseInfo)
}

export default baseInfoEffect
