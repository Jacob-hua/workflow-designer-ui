import IBpmn from "../../../iBpmn";

function actionsEffect({ actions }, iBpmn = new IBpmn()) {
  const { namespace, type } = iBpmn.getSelectedShapeType();
  if (namespace !== "bpmn" || type !== "UserTask") {
    return;
  }
  iBpmn.updateSelectedShapeProperties({ actions });
}

export default actionsEffect;
