import IBpmn from "../../../iBpmn";

function commandStackChangedListener(_, commit, iBpmn = new IBpmn()) {
  commit("refreshState", {
    undoable: iBpmn.commandCanUndo(),
    redoable: iBpmn.commandCanRedo(),
  });
}

export default commandStackChangedListener;
