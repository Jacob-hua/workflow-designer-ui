import IBpmnModeler from '../../../../IBpmnModeler'

function parentDocumentationEffect({ parentDocumentation }, iBpmnModeler = new IBpmnModeler()) {
  // if (!documentation) {
  //   delete iBpmnModeler.getSelectedShapeInfo().documentation
  //   return
  // }
  iBpmnModeler.updateSelectedShapeProperties({
    "camunda:documentation": parentDocumentation,
  })
}

export default parentDocumentationEffect
