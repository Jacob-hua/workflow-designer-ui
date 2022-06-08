import IBpmn from "../../../iBpmn";

function baseInfoEffect({ baseInfo }, iBpmn = new IBpmn()) {
  // TODO: 当没有选中元素时应该更新整个流程图的名称
  iBpmn.updateSelectedShapeProperties(baseInfo);
}

export default baseInfoEffect;
