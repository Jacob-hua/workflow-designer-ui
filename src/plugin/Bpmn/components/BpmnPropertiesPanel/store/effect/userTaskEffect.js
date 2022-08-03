import IBpmnModeler from '../../../../IBpmnModeler'
import BpmnShapeType from '../../../../enum/shapeType'

function userTaskEffect({ userTask }, iBpmnModeler = new IBpmnModeler()) {
  if (iBpmnModeler.getSelectedShapeType() !== BpmnShapeType.USER_TASK) {
    return
  }
  iBpmnModeler.updateSelectedShapeProperties({
    assignee: userTask.assignee,
    candidateUsers: userTask.candidateUsers,
    candidateGroups: userTask.candidateGroups,
  })
  !userTask.assignee && (delete iBpmnModeler.getSelectedShapeInfo().assignee)
  !userTask.candidateUsers && (delete iBpmnModeler.getSelectedShapeInfo().candidateUsers)
  !userTask.candidateGroups && (delete iBpmnModeler.getSelectedShapeInfo().candidateGroups)
}

export default userTaskEffect
