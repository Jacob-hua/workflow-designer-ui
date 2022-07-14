import IBpmnModeler from '../../../../IBpmnModeler'

function commandStackChangedListener(_, commit, iBpmnModeler = new IBpmnModeler()) {
  commit('refreshState', {
    undoable: iBpmnModeler.commandCanUndo(),
    redoable: iBpmnModeler.commandCanRedo(),
  })
}

export default commandStackChangedListener
