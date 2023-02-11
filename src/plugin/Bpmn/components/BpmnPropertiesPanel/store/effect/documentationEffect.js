import IBpmnModeler from '../../../../IBpmnModeler'

function documentationEffect({ documentation }, iBpmnModeler = new IBpmnModeler()) {
  iBpmnModeler.updateSelectedShapeProperties({
    documentation: [iBpmnModeler.createBpmnModdleInstance('Documentation', { text: documentation })],
  })
}

export default documentationEffect
