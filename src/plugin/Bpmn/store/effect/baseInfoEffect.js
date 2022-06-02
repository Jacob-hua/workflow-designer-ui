import IBpmn from "../../iBpmn";

function baseInfoEffect({ baseInfo }, iBpmn = new IBpmn()) {
  iBpmn.updateSelectedShapeProperties(baseInfo);
}

export default baseInfoEffect;
