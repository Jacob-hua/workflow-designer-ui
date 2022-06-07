import IBpmn from "../../../iBpmn";

function signalEffect({ signals }, iBpmn = new IBpmn()) {
  console.log(iBpmn.createBpmnModdleInstance("Signal", signals));
}

export default signalEffect;
