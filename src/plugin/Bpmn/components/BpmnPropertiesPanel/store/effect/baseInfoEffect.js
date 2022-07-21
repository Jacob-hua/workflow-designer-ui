import IBpmnModeler from '../../../../IBpmnModeler'

function baseInfoEffect({ baseInfo }, iBpmnModeler = new IBpmnModeler()) {
  iBpmnModeler.updateSelectedShapeProperties({ name: baseInfo.name })
}

export default baseInfoEffect
