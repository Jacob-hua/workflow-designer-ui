import BaseConvertor from "./BaseConvertor";

class BaseInfoConvertor extends BaseConvertor {
  constructor(props) {
    super(props);
    this.baseInfo = this.state["baseInfo"] ?? {};
  }

  convert() {
    return this.baseInfo;
  }
}

export default BaseInfoConvertor;
