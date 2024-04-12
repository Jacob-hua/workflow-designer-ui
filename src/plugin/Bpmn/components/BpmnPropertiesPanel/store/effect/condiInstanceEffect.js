import IBpmnModeler from '../../../../IBpmnModeler'

function condiInstanceEffect({ condiInstance }, iBpmnModeler = new IBpmnModeler()) {
  const shapeInfo = iBpmnModeler.getSelectedShapeInfo()
  if (condiInstance.typeSt === 'nrOfInstances') {
    // iBpmnModeler.updateSelectedShapeProperties({
    //   completionCondition: iBpmnModeler.createBpmnModdleInstance('FormalExpression', {
    //     body: '${' + 'nrOfCompletedInstances == nrOfInstances' + '}',
    //   }),
    // })
    shapeInfo.loopCharacteristics.completionCondition.body = '${' + 'nrOfCompletedInstances == nrOfInstances' + '}'
  } else if (condiInstance.typeSt === 'passPerson') {
    // iBpmnModeler.updateSelectedShapeProperties({
    //   completionCondition: iBpmnModeler.createBpmnModdleInstance('FormalExpression', {
    //     body: '${' + 'nrOfCompletedInstances ==' + condiInstance.passPerson + '}',
    //   }),
    // })
    shapeInfo.loopCharacteristics.completionCondition.body = '${' + 'nrOfCompletedInstances == ' + condiInstance.passPerson + '}'
  } else if (condiInstance.typeSt === 'passPercent') {
    // iBpmnModeler.updateSelectedShapeProperties({
    //   completionCondition: iBpmnModeler.createBpmnModdleInstance('FormalExpression', {
    //     body: '${' + `nrOfCompletedInstances/nrOfInstances >= ${condiInstance.passPercent / 100}` + '}',
    //   }),
    // })
    shapeInfo.loopCharacteristics.completionCondition.body = '${' + `nrOfCompletedInstances/nrOfInstances >= ${condiInstance.passPercent / 100}` + '}'
  }
}

export default condiInstanceEffect
