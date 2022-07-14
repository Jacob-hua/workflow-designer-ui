import IBpmnModeler from '../../../../IBpmnModeler'

function loopCharacteristicsState2Parameter(multiInstance, iBpmnModeler = new IBpmnModeler()) {
  const loopCharacteristics = {
    ParallelMultiInstance: iBpmnModeler.createBpmnModdleInstance('MultiInstanceLoopCharacteristics'),
    SequentialMultiInstance: iBpmnModeler.createBpmnModdleInstance('MultiInstanceLoopCharacteristics', {
      isSequential: true,
    }),
  }
  const multiLoopInstance = loopCharacteristics[multiInstance.loopCharacteristics]
  iBpmnModeler.updateSelectedShapeModdleProperties(multiLoopInstance, {
    loopCardinality: loopCardinalityState2Parameter(multiInstance, iBpmnModeler),
    completionCondition: completionConditionState2Parameter(multiInstance, iBpmnModeler),
    collection: multiInstance.collection,
    elementVariable: multiInstance.elementVariable,
  })
  return multiLoopInstance
}

function loopCardinalityState2Parameter(multiInstance, iBpmnModeler = new IBpmnModeler()) {
  if (!multiInstance.loopCardinality) {
    return
  }
  return iBpmnModeler.createBpmnModdleInstance('FormalExpression', { body: multiInstance.loopCardinality })
}

function completionConditionState2Parameter(multiInstance, iBpmnModeler = new IBpmnModeler()) {
  if (!multiInstance.completionCondition) {
    return
  }
  return iBpmnModeler.createBpmnModdleInstance('FormalExpression', { body: multiInstance.completionCondition })
}

function multiInstanceEffect({ multiInstance }, iBpmnModeler = new IBpmnModeler()) {
  iBpmnModeler.updateSelectedShapeProperties({
    loopCharacteristics: loopCharacteristicsState2Parameter(multiInstance, iBpmnModeler),
  })
}

export default multiInstanceEffect
