import IBpmnModeler from '../../../../IBpmnModeler'
import BpmnShapeType from '../../../../enum/shapeType'

function userTaskEffect({ userTask }, iBpmnModeler = new IBpmnModeler()) {
  if (iBpmnModeler.getSelectedShapeType() !== BpmnShapeType.USER_TASK) {
    return
  }
  const { displayAssignee = {}, displayCandidateUsers = [], displayCandidateGroups = [] } = userTask
  const assignee = displayAssignee.value
  const candidateUsers = displayCandidateUsers.map(({ value }) => value).join(',')
  const candidateGroups = displayCandidateGroups.map(({ value }) => value).join(',')

  iBpmnModeler.updateSelectedShapeProperties({
    assignee,
    displayAssignee: JSON.stringify(displayAssignee),
    candidateUsers,
    displayCandidateUsers: JSON.stringify(displayCandidateUsers),
    candidateGroups,
    displayCandidateGroups: JSON.stringify(displayCandidateGroups),
  })
  
  if (!assignee) {
    delete iBpmnModeler.getSelectedShapeInfo().assignee
    delete iBpmnModeler.getSelectedShapeInfo().displayAssignee
  }

  if (!candidateUsers) {
    delete iBpmnModeler.getSelectedShapeInfo().candidateUsers
    delete iBpmnModeler.getSelectedShapeInfo().displayCandidateUsers
  }

  if (!candidateGroups) {
    delete iBpmnModeler.getSelectedShapeInfo().candidateGroups
    delete iBpmnModeler.getSelectedShapeInfo().displayCandidateGroups
  }
}

export default userTaskEffect
