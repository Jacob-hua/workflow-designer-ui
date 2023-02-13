import IBpmnModeler from '../../../../IBpmnModeler'

function documentationEffect({ documentation }, iBpmnModeler = new IBpmnModeler()) {
  if (!documentation) {
    delete iBpmnModeler.getSelectedShapeInfo().documentation
    return
  }
  iBpmnModeler.updateSelectedShapeProperties({
    documentation: [iBpmnModeler.createBpmnModdleInstance('Documentation', { text: documentation })],
  })
}

export default documentationEffect
