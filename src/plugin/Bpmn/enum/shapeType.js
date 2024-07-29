const shapeType = {
  /** 开始事件 */
  START_EVENT: Symbol('bpmn:StartEvent'),
  /** 消息开始事件 */
  MESSAGE_START_EVENT: Symbol('bpmn:StartEvent_bpmn:MessageEventDefinition'),
  /** 定时开始事件 */
  TIMER_START_EVENT: Symbol('bpmn:StartEvent_bpmn:TimerEventDefinition'),
  /** 条件开始事件 */
  CONDITIONAL_START_EVENT: Symbol('bpmn:StartEvent_bpmn:ConditionalEventDefinition'),
  /** 信号开始事件 */
  SIGNAL_START_EVENT: Symbol('bpmn:StartEvent_bpmn:SignalEventDefinition'),

  /** 结束事件 */
  END_EVENT: Symbol('bpmn:EndEvent'),
  /** 消息结束事件 */
  MESSAGE_END_EVENT: Symbol('bpmn:EndEvent_bpmn:MessageEventDefinition'),
  /** 升级结束事件 */
  ESCALATION_END_EVENT: Symbol('bpmn:EndEvent_bpmn:EscalationEventDefinition'),
  /** 错误结束事件 */
  ERROR_END_EVENT: Symbol('bpmn:EndEvent_bpmn:ErrorEventDefinition'),
  /** 补偿结束事件 */
  COMPENSATE_END_EVENT: Symbol('bpmn:EndEvent_bpmn:CompensateEventDefinition'),
  /** 信号结束事件 */
  SIGNAL_END_EVENT: Symbol('bpmn:EndEvent_bpmn:SignalEventDefinition'),
  /** 终止结束事件 */
  TERMINATE_END_EVENT: Symbol('bpmn:EndEvent_bpmn:TerminateEventDefinition'),

  /** 任务 */
  TASK: Symbol('bpmn:Task'),
  /** 发送任务 */
  SEND_TASK: Symbol('bpmn:SendTask'),
  /** 接收任务 */
  RECEIVE_TASK: Symbol('bpmn:ReceiveTask'),
  /** 用户任务 */
  USER_TASK: Symbol('bpmn:UserTask'),
  /** 手工任务 */
  MANUAL_TASK: Symbol('bpmn:ManualTask'),
  /** 业务规则任务 */
  BUSINESS_RULE_TASK: Symbol('bpmn:BusinessRuleTask'),
  /** 服务任务 */
  SERVICE_TASK: Symbol('bpmn:ServiceTask'),
  /** 脚本任务 */
  SCRIPT_TASK: Symbol('bpmn:ScriptTask'),
  /** 调用活动 */
  CALL_ACTIVITY: Symbol('bpmn:CallActivity'),

  /** 互斥网关 */
  EXCLUSIVE_GATEWAY: Symbol('bpmn:ExclusiveGateway'),
  /** 并联网关 */
  PARALLEL_GATEWAY: Symbol('bpmn:ParallelGateway'),
  /** 相容网关 */
  INCLUSIVE_GATEWAY: Symbol('bpmn:InclusiveGateway'),
  /** 事件网关 */
  EVENT_BASE_GATEWAY: Symbol('bpmn:EventBasedGateway'),
  /** 复杂网关 */
  COMPLEX_GATEWAY: Symbol('bpmn:ComplexGateway'),

  /** 顺序流程（有向箭头） */
  SEQUENCE_FLOW: Symbol('bpmn:SequenceFlow'),

  /** 中间捕获事件 */
  INTERMEDIATE_CATCH_EVENT: Symbol('bpmn:IntermediateCatchEvent'),
  /** 消息中间捕获事件 */
  MESSAGE_INTERMEDIATE_CATCH_EVENT: Symbol('bpmn:IntermediateCatchEvent_bpmn:MessageEventDefinition'),
  /** 定时中间捕获事件 */
  TIMER_INTERMEDIATE_CATCH_EVENT: Symbol('bpmn:IntermediateCatchEvent_bpmn:TimerEventDefinition'),
  /** 条件中间捕获事件 */
  CONDITIONAL_INTERMEDIATE_CATCH_EVENT: Symbol('bpmn:IntermediateCatchEvent_bpmn:ConditionalEventDefinition'),
  /** 链接中间捕获事件 */
  LINK_INTERMEDIATE_CATCH_EVENT: Symbol('bpmn:IntermediateCatchEvent_bpmn:LinkEventDefinition'),
  /** 信号中间捕获事件 */
  SIGNAL_INTERMEDIATE_CATCH_EVENT: Symbol('bpmn:IntermediateCatchEvent_bpmn:SignalEventDefinition'),

  /** 中间抛出事件 */
  INTERMEDIATE_THROW_EVENT: Symbol('bpmn:IntermediateThrowEvent'),
  /** 消息中间抛出事件 */
  MESSAGE_INTERMEDIATE_THROW_EVENT: Symbol('bpmn:IntermediateThrowEvent_bpmn:MessageEventDefinition'),
  /** 升级中间抛出事件 */
  ESCALATION_INTERMEDIATE_THROW_EVENT: Symbol('bpmn:IntermediateThrowEvent_bpmn:EscalationEventDefinition'),
  /** 链接中间抛出事件 */
  LINK_INTERMEDIATE_THROW_EVENT: Symbol('bpmn:IntermediateThrowEvent_bpmn:LinkEventDefinition'),
  /** 补偿中间抛出事件 */
  COMPENSATE_INTERMEDIATE_THROW_EVENT: Symbol('bpmn:IntermediateThrowEvent_bpmn:CompensateEventDefinition'),
  /** 信号中间抛出事件 */
  SIGNAL_INTERMEDIATE_THROW_EVENT: Symbol('bpmn:IntermediateThrowEvent_bpmn:SignalEventDefinition'),

  /** 边界事件 */
  BOUNDARY_EVENT: Symbol('bpmn:BoundaryEvent'),
  /** 消息边界事件 */
  MESSAGE_BOUNDARY_EVENT: Symbol('bpmn:BoundaryEvent_bpmn:MessageEventDefinition'),
  /** 消息边界事件（非中断） */
  MESSAGE_NON_INTERRUPTING_BOUNDARY_EVENT: Symbol('bpmn:BoundaryEvent_bpmn:MessageEventDefinition_false'),
  /** 定时边界事件 */
  TIMER_BOUNDARY_EVENT: Symbol('bpmn:BoundaryEvent_bpmn:TimerEventDefinition'),
  /** 定时边界事件（非中断） */
  TIMER_NON_INTERRUPTING_BOUNDARY_EVENT: Symbol('bpmn:BoundaryEvent_bpmn:TimerEventDefinition_false'),
  /** 升级边界事件 */
  ESCALATION_BOUNDARY_EVENT: Symbol('bpmn:BoundaryEvent_bpmn:EscalationEventDefinition'),
  /** 升级边界事件（非中断） */
  ESCALATION_NON_INTERRUPTING_BOUNDARY_EVENT: Symbol('bpmn:BoundaryEvent_bpmn:EscalationEventDefinition_false'),
  /** 条件边界事件 */
  CONDITIONAL_BOUNDARY_EVENT: Symbol('bpmn:BoundaryEvent_bpmn:ConditionalEventDefinition'),
  /** 条件边界事件（非中断） */
  CONDITIONAL_NON_INTERRUPTING_BOUNDARY_EVENT: Symbol('bpmn:BoundaryEvent_bpmn:ConditionalEventDefinition_false'),
  /** 错误边界事件 */
  ERROR_BOUNDARY_EVENT: Symbol('bpmn:BoundaryEvent_bpmn:ErrorEventDefinition'),
  /** 信号边界事件 */
  SIGNAL_BOUNDARY_EVENT: Symbol('bpmn:BoundaryEvent_bpmn:SignalEventDefinition'),
  /** 信号边界事件（非中断） */
  SIGNAL_NON_INTERRUPTING_BOUNDARY_EVENT: Symbol('bpmn:BoundaryEvent_bpmn:SignalEventDefinition_false'),
  /** 补偿边界事件 */
  COMPENSATE_BOUNDARY_EVENT: Symbol('bpmn:BoundaryEvent_bpmn:CompensateEventDefinition'),
}

export function getShapeType(tag) {
  const shapTypes = {
    'bpmn:StartEvent': shapeType.START_EVENT,
    'bpmn:StartEvent_bpmn:MessageEventDefinition': shapeType.MESSAGE_START_EVENT,
    'bpmn:StartEvent_bpmn:TimerEventDefinition': shapeType.TIMER_START_EVENT,
    'bpmn:StartEvent_bpmn:ConditionalEventDefinition': shapeType.CONDITIONAL_START_EVENT,
    'bpmn:StartEvent_bpmn:SignalEventDefinition': shapeType.SIGNAL_START_EVENT,
    'bpmn:EndEvent': shapeType.END_EVENT,
    'bpmn:EndEvent_bpmn:MessageEventDefinition': shapeType.MESSAGE_END_EVENT,
    'bpmn:EndEvent_bpmn:EscalationEventDefinition': shapeType.ESCALATION_END_EVENT,
    'bpmn:EndEvent_bpmn:ErrorEventDefinition': shapeType.ERROR_END_EVENT,
    'bpmn:EndEvent_bpmn:CompensateEventDefinition': shapeType.COMPENSATE_END_EVENT,
    'bpmn:EndEvent_bpmn:SignalEventDefinition': shapeType.SIGNAL_END_EVENT,
    'bpmn:EndEvent_bpmn:TerminateEventDefinition': shapeType.TERMINATE_END_EVENT,
    'bpmn:Task': shapeType.TASK,
    'bpmn:SendTask': shapeType.SEND_TASK,
    'bpmn:ReceiveTask': shapeType.RECEIVE_TASK,
    'bpmn:UserTask': shapeType.USER_TASK,
    'bpmn:ManualTask': shapeType.MANUAL_TASK,
    'bpmn:BusinessRuleTask': shapeType.BUSINESS_RULE_TASK,
    'bpmn:ServiceTask': shapeType.SERVICE_TASK,
    'bpmn:ScriptTask': shapeType.SCRIPT_TASK,
    'bpmn:CallActivity': shapeType.CALL_ACTIVITY,
    'bpmn:ExclusiveGateway': shapeType.EXCLUSIVE_GATEWAY,
    'bpmn:ParallelGateway': shapeType.PARALLEL_GATEWAY,
    'bpmn:InclusiveGateway': shapeType.INCLUSIVE_GATEWAY,
    'bpmn:EventBasedGateway': shapeType.EVENT_BASE_GATEWAY,
    'bpmn:ComplexGateway': shapeType.COMPLEX_GATEWAY,
    'bpmn:SequenceFlow': shapeType.SEQUENCE_FLOW,
    'bpmn:IntermediateCatchEvent': shapeType.INTERMEDIATE_CATCH_EVENT,
    'bpmn:IntermediateCatchEvent_bpmn:MessageEventDefinition': shapeType.MESSAGE_INTERMEDIATE_CATCH_EVENT,
    'bpmn:IntermediateCatchEvent_bpmn:TimerEventDefinition': shapeType.TIMER_INTERMEDIATE_CATCH_EVENT,
    'bpmn:IntermediateCatchEvent_bpmn:ConditionalEventDefinition': shapeType.CONDITIONAL_INTERMEDIATE_CATCH_EVENT,
    'bpmn:IntermediateCatchEvent_bpmn:LinkEventDefinition': shapeType.LINK_INTERMEDIATE_CATCH_EVENT,
    'bpmn:IntermediateCatchEvent_bpmn:SignalEventDefinition': shapeType.SIGNAL_INTERMEDIATE_CATCH_EVENT,
    'bpmn:IntermediateThrowEvent': shapeType.INTERMEDIATE_THROW_EVENT,
    'bpmn:IntermediateThrowEvent_bpmn:MessageEventDefinition': shapeType.MESSAGE_INTERMEDIATE_THROW_EVENT,
    'bpmn:IntermediateThrowEvent_bpmn:EscalationEventDefinition': shapeType.ESCALATION_INTERMEDIATE_THROW_EVENT,
    'bpmn:IntermediateThrowEvent_bpmn:LinkEventDefinition': shapeType.LINK_INTERMEDIATE_THROW_EVENT,
    'bpmn:IntermediateThrowEvent_bpmn:CompensateEventDefinition': shapeType.COMPENSATE_INTERMEDIATE_THROW_EVENT,
    'bpmn:IntermediateThrowEvent_bpmn:SignalEventDefinition': shapeType.SIGNAL_INTERMEDIATE_THROW_EVENT,
    'bpmn:BoundaryEvent': shapeType.BOUNDARY_EVENT,
    'bpmn:BoundaryEvent_bpmn:MessageEventDefinition': shapeType.MESSAGE_BOUNDARY_EVENT,
    'bpmn:BoundaryEvent_bpmn:MessageEventDefinition_false': shapeType.MESSAGE_NON_INTERRUPTING_BOUNDARY_EVENT,
    'bpmn:BoundaryEvent_bpmn:TimerEventDefinition': shapeType.TIMER_BOUNDARY_EVENT,
    'bpmn:BoundaryEvent_bpmn:TimerEventDefinition_false': shapeType.TIMER_NON_INTERRUPTING_BOUNDARY_EVENT,
    'bpmn:BoundaryEvent_bpmn:EscalationEventDefinition': shapeType.ESCALATION_BOUNDARY_EVENT,
    'bpmn:BoundaryEvent_bpmn:EscalationEventDefinition_false': shapeType.ESCALATION_NON_INTERRUPTING_BOUNDARY_EVENT,
    'bpmn:BoundaryEvent_bpmn:ConditionalEventDefinition': shapeType.CONDITIONAL_BOUNDARY_EVENT,
    'bpmn:BoundaryEvent_bpmn:ConditionalEventDefinition_false': shapeType.CONDITIONAL_NON_INTERRUPTING_BOUNDARY_EVENT,
    'bpmn:BoundaryEvent_bpmn:ErrorEventDefinition': shapeType.ERROR_BOUNDARY_EVENT,
    'bpmn:BoundaryEvent_bpmn:SignalEventDefinition': shapeType.SIGNAL_BOUNDARY_EVENT,
    'bpmn:BoundaryEvent_bpmn:SignalEventDefinition_false': shapeType.SIGNAL_NON_INTERRUPTING_BOUNDARY_EVENT,
    'bpmn:BoundaryEvent_bpmn:CompensateEventDefinition': shapeType.COMPENSATE_BOUNDARY_EVENT,
  }
  return shapTypes[tag]
}

export default shapeType
