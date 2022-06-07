import IBpmn from "../../../iBpmn";

function baseInfoParameter2State(iBpmn = new IBpmn()) {
  const state = {};
  const shapeInfo = iBpmn.getSelectedShapeInfo();
  state.name = shapeInfo.name;
  state.id = shapeInfo.id;
  return state;
}

function shapeType2State(element, iBpmn = new IBpmn()) {
  return { ...iBpmn.getShapeType(element) };
}

function shapeChangedListener({ element }, commit, iBpmn) {
  if (!element) {
    return;
  }
  const baseInfo = baseInfoParameter2State(iBpmn);
  const shapeType = shapeType2State(element, iBpmn);
  commit("refreshState", { baseInfo, shapeType });
}

export default shapeChangedListener;
