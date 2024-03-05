import { deepCopy } from '../../../../utils/object'

const state = () => ({
  listenerTypeOptions: [
    {
      label: 'Java 类',
      value: 'class',
    },
    {
      label: '表达式',
      value: 'expression',
    },
    {
      label: '代理表达式',
      value: 'delegateExpression',
    },
    {
      label: '脚本',
      value: 'script',
    },
  ],
  eventOptions: [
    {
      label: '开始',
      value: 'start',
    },
    {
      label: '结束',
      value: 'end',
    },
    {
      label: '创建',
      value: 'create',
    },
    {
      label: '指派',
      value: 'assignment',
    },
    {
      label: '完成',
      value: 'complete',
    },
    {
      label: '删除',
      value: 'delete',
    },
    {
      label: '更新',
      value: 'update',
    },
    {
      label: '超时',
      value: 'timeout',
    },
  ],
  scriptTypeOptions: [
    {
      label: '内联脚本',
      value: 'inline',
    },
    {
      label: '外部脚本',
      value: 'outside',
    },
  ],
  judgmentTypeOpstions: [
    {
      label: '等于',
      value: '=='
    },
    {
      label: '大于',
      value: '>'
    },
    {
      label: '小于',
      value: '<'
    },
    {
      label: '大于等于',
      value: '>='
    },
    {
      label: '小于等于',
      value: '<='
    },
  ],
  conditionTragetOptions: [
    {
      label: 'true',
      value: true
    },
    {
      label: 'false',
      value: false
    },
  ],
  conditionTypeOpstions: [
    {
      label: '脚本',
      value: 'script',
    },
    {
      label: '表达式',
      value: 'expression',
    },
    {
      label: '无',
      value: 'null',
    },
  ],
  conditionScriptTypeOptions: [
    {
      label: '内联脚本',
      value: 'inline',
    },
    {
      label: '外部脚本',
      value: 'external',
    },
  ],
  timerTypeOptions: [
    {
      label: '特定时间',
      value: 'date',
    },
    {
      label: '延迟时间',
      value: 'duration',
    },
    {
      label: '循环时间',
      value: 'cycle',
    },
    {
      label: '无',
      value: 'null',
    },
  ],
  fieldTypeOptions: [
    {
      label: '字符串',
      value: 'string',
    },
    {
      label: '表达式',
      value: 'expression',
    },
  ],
  variableTypeOptions: [
    {
      label: '字符串或表达式',
      value: 'string/expression',
    },
    {
      label: '脚本',
      value: 'script',
    },
    {
      label: '列表',
      value: 'list',
    },
    {
      label: '键值对',
      value: 'map',
    },
  ],
  loopCharacteristicsOptions: [
    {
      label: '并行多重事件',
      value: 'ParallelMultiInstance',
    },
    {
      label: '时序多重事件',
      value: 'SequentialMultiInstance',
    },
  ],
  userTaskActionButtons: [
    {
      label: '代办',
      value: 'Agency',
    },
    {
      label: '传阅',
      value: 'Circulate',
    },
    {
      label: '挂起',
      value: 'Hang',
    },
    {
      label: '驳回',
      value: 'Reject',
    },
    {
      label: '终止',
      value: 'Terminate',
    },
  ],
  multiInstanceActionButtons: [
    {
      label: '代办',
      value: 'Agency',
    },
    {
      label: '传阅',
      value: 'Circulate',
    },
    {
      label: '挂起',
      value: 'Hang',
    },
    {
      label: '加减签',
      value: 'Signature',
    },
    {
      label: '驳回',
      value: 'Reject',
    },
    {
      label: '终止',
      value: 'Terminate',
    },
  ],
  userGroupOptions: [],
  userOptions: [],
})

const getters = {
  listenerTypeLabel(state) {
    return ({ listenerType }) => {
      return state.listenerTypeOptions.find(({ value }) => value === listenerType)?.label
    }
  },
  eventLabel(state) {
    return ({ event }) => {
      return state.eventOptions.find(({ value }) => value === event)?.label
    }
  },
  fieldTypeLabel(state) {
    return ({ fieldType }) => {
      return state.fieldTypeOptions.find(({ value }) => value === fieldType)?.label
    }
  },
  variableTypeLabel(state) {
    return ({ type }) => {
      return state.variableTypeOptions.find(({ value }) => value === type)?.label
    }
  },
  actionButtons(state) {
    return ({ loopCharacteristics }) => {
      return loopCharacteristics ? state.multiInstanceActionButtons : state.userTaskActionButtons
    }
  },
  findUserGroupChildren(state) {
    return ({ value }) => {
      return state.userGroupOptions.find((option) => option.value === value)?.children
    }
  },
}

const mutations = {
  updateUserOptions(state, { newUserOptions = [] }) {
    state.userOptions = deepCopy(newUserOptions)
  },
  updateUserGroupOptions(state, { newUserGroupOptions = [] }) {
    state.userGroupOptions = deepCopy(newUserGroupOptions)
  },
}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
