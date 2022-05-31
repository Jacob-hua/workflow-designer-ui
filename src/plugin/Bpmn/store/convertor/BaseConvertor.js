import IBpmn from "../../iBpmn";

class BaseConvertor {
  constructor({ iBpmn = new IBpmn(), state = {} }) {
    this.iBpmn = iBpmn;
    this.state = state;
    this.result = {};
  }

  convert() {}
}

export default BaseConvertor;
