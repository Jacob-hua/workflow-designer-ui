import IBpmnModeler from '../../../../IBpmnModeler'
import BpmnShapeType from '../../../../enum/shapeType'

function actionsEffect({ actions }, iBpmnModeler = new IBpmnModeler()) {
  if (iBpmnModeler.getSelectedShapeType() !== BpmnShapeType.USER_TASK) {
    return
  }
  iBpmnModeler.updateSelectedShapeProperties({ actions })
  if (!actions || actions.length === 0) {
    delete iBpmnModeler.getSelectedShapeInfo().actions
  }
}

export default actionsEffect
