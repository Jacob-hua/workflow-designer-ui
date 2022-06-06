import IBpmn from "../../iBpmn";

function baseInfoParameter2State(iBpmn = new IBpmn()) {
  const state = {};
  const shapeInfo = iBpmn.getSelectedShapeInfo();
  state.name = shapeInfo.name;
  state.id = shapeInfo.id;
  return state;
}

function shapeChangedListener({ element }, commit, iBpmn) {
  if (!element) {
    return;
  }
  const baseInfo = baseInfoParameter2State(iBpmn);
  commit("refreshState", { baseInfo });
}

export default shapeChangedListener;
