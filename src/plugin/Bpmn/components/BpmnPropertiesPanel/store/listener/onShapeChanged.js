import IBpmnModeler from '../../../../IBpmnModeler'

function baseInfoParameter2State(iBpmnModeler = new IBpmnModeler()) {
  const state = {}
  const shapeInfo = iBpmnModeler.getSelectedShapeInfo()
  state.name = shapeInfo.name
  state.id = shapeInfo.id
  return state
}

function shapeType2State(element, iBpmnModeler = new IBpmnModeler()) {
  return iBpmnModeler.getShapeType(element)
}

function multiInstance2State(element, iBpmnModeler = new IBpmnModeler()) {
  const state = {
    loopCharacteristics: '',
    loopCardinality: '',
    collection: '',
    elementVariable: '',
    completionCondition: '',
  }
  const shapeInfo = iBpmnModeler.getSelectedShapeInfo()
  if (!shapeInfo.loopCharacteristics) {
    return state
  }
  const moddleElement = shapeInfo.loopCharacteristics
  if (!moddleElement) {
    return state
  }
  state.loopCharacteristics = moddleElement.isSequential ? 'SequentialMultiInstance' : 'ParallelMultiInstance'
  state.loopCardinality = moddleElement.loopCardinality?.body
  state.completionCondition = moddleElement.completionCondition?.body
  state.collection = moddleElement.collection
  state.elementVariable = moddleElement.elementVariable
  return state
}

function condiIntance2State(iBpmnModeler = new IBpmnModeler()) {
  const state = {
    typeSt: 'nrOfInstances',
    passPerson: 0,
    passPercent: 0,
    isHavLoopCharacteristics: false
  };
  if(iBpmnModeler.getSelectedShapeInfo()){
    const shapeInfo = iBpmnModeler.getSelectedShapeInfo();
    if (!shapeInfo.loopCharacteristics?.completionCondition) return state;
    const body = shapeInfo.loopCharacteristics.completionCondition.body
    const len = body.length
    const newList = body.substring(2, len - 1).split(' ')
    if (newList[2] === 'nrOfInstances') {
      state.typeSt = 'nrOfInstances';
      state.passPerson = 0;
      state.passPercent = 0;
    } else if (newList[2] !== 'nrOfInstances' && newList[1] === '==') {
      state.typeSt = 'passPerson';
      state.passPerson = newList[2];
      state.passPercent = 0;
    } else {
      state.typeSt = 'passPercent';
      state.passPerson = 0;
      state.passPercent = (100 * newList[2]).toFixed(0);
    }
  }

  // const temp = iBpmnModeler.getSelectedShapeInfoByType(
  //   'sequenceFlow '
  // );

  // const completionCondition = iBpmnModeler.getSelectedShapeInfoByType(
  //   'completionCondition'
  // );

  // console.log(completionCondition)

  // if (!completionCondition) {
  //   return state;
  // }
  state.isHavLoopCharacteristics = true;

  return state;
}

function onShapeChangedListener({ element }, commit, iBpmnModeler = new IBpmnModeler()) {
  if (!element) {
    return
  }
  const baseInfo = baseInfoParameter2State(iBpmnModeler)
  const shapeType = shapeType2State(element, iBpmnModeler)
  const multiInstance = multiInstance2State(element, iBpmnModeler)
  commit('refreshState', { baseInfo, shapeType, multiInstance });
  if (element.type === 'bpmn:UserTask') {
    commit('refreshState', { condiInstance: { ...condiIntance2State(iBpmnModeler) } })
  }
}

export default onShapeChangedListener
