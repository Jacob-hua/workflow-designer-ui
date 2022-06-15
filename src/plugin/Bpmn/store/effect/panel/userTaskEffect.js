import IBpmn from "../../../iBpmn";

function userTaskEffect({ userTask }, iBpmn = new IBpmn()) {
  const { namespace, type } = iBpmn.getSelectedShapeType();
  if (namespace !== "bpmn" || type !== "UserTask") {
    return;
  }
  iBpmn.updateSelectedShapeProperties({
    assignee: userTask.assignee,
    candidateUsers: userTask.candidateUsers,
    candidateGroups: userTask.candidateGroups,
  });
}

export default userTaskEffect;
