import IBpmn from "../../../iBpmn";

function loopCharacteristicsState2Parameter(multiInstance, iBpmn = new IBpmn()) {
  const loopCharacteristics = {
    ParallelMultiInstance: iBpmn.createBpmnModdleInstance("MultiInstanceLoopCharacteristics"),
    SequentialMultiInstance: iBpmn.createBpmnModdleInstance("MultiInstanceLoopCharacteristics", { isSequential: true }),
  };
  const multiLoopInstance = loopCharacteristics[multiInstance.loopCharacteristics];
  iBpmn.updateSelectedShapeModdleProperties(multiLoopInstance, {
    loopCardinality: loopCardinalityState2Parameter(multiInstance, iBpmn),
    completionCondition: completionConditionState2Parameter(multiInstance, iBpmn),
    collection: multiInstance.collection,
    elementVariable: multiInstance.elementVariable,
  });
  return multiLoopInstance;
}

function loopCardinalityState2Parameter(multiInstance, iBpmn = new IBpmn()) {
  if (!multiInstance.loopCardinality) {
    return;
  }
  return iBpmn.createBpmnModdleInstance("FormalExpression", { body: multiInstance.loopCardinality });
}

function completionConditionState2Parameter(multiInstance, iBpmn = new IBpmn()) {
  if (!multiInstance.completionCondition) {
    return;
  }
  return iBpmn.createBpmnModdleInstance("FormalExpression", { body: multiInstance.completionCondition });
}

function multiInstanceEffect({ multiInstance }, iBpmn = new IBpmn()) {
  iBpmn.updateSelectedShapeProperties({
    loopCharacteristics: loopCharacteristicsState2Parameter(multiInstance, iBpmn),
  });
}

export default multiInstanceEffect;
