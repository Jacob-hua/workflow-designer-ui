import IBpmn from "../../../iBpmn";

function onShapeMove({ shape }, commit, iBpmn = new IBpmn()) {
  commit("refreshState", { shapeType: { ...iBpmn.getShapeType(shape) } });
}

export default onShapeMove;
