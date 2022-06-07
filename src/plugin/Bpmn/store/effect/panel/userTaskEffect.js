import IBpmn from "../../../iBpmn";

function userTaskEffect({ userTask }, iBpmn = new IBpmn()) {
  iBpmn.updateSelectedShapeProperties(userTask);
}

export default userTaskEffect;
