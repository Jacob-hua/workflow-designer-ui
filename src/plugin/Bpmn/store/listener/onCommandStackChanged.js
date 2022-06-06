function commandStackChangedListener(_, commit, iBpmn) {
  commit("refreshState", {
    undoable: iBpmn.commandCanUndo(),
    redoable: iBpmn.commandCanRedo(),
  });
}

export default commandStackChangedListener;
