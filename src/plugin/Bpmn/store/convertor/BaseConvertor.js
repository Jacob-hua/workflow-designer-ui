import IBpmn from "../../iBpmn";

class BaseConvertor {
  constructor({ iBpmn = new IBpmn(), state = {} }) {
    this.iBpmn = iBpmn;
    this.state = state;
  }

  convert() {}
}

export default BaseConvertor;
