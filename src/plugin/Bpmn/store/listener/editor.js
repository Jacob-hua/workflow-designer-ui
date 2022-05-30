export default {
  "commandStack.changed": (_, commit, iBpmn) => {
    commit("refreshState", {
      undoable: iBpmn.commandCanUndo(),
      redoable: iBpmn.commandCanRedo(),
    });
  },
};
