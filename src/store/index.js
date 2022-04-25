import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    optionsAscription: [{
        value: '',
        label: '全部项目'
      },
      {
        value: 'beiqijia',
        label: '北七家人才基地'
      },
      {
        value: 'laiwu',
        label: '莱芜供热项目'
      },
      {
        value: 'xilaideng',
        label: '海口喜来登酒店'
      }
    ],
    optionsBusiness: [{
        value: '',
        label: '全部业务'
      },
      {
        value: 'zhihuiyunwei',
        label: '智慧运维'
      },
      {
        value: 'zichanguanli',
        label: '资产管理'
      },
      {
        value: 'renyuanguanli',
        label: '人员管理'
      },
      {
        value: 'other',
        label: '其他业务'
      }
    ],
    optionsSystemType: [{
        value: 'energy-1',
        label: '配电'
      },
      {
        value: 'energy-2',
        label: '空压'
      },
      {
        value: 'energy-3',
        label: '供暖'
      },
      {
        value: 'energy-4',
        label: '空调'
      },
    ],
    tenantId: '18',
    userInfo: {
      name: 'admin',
      id: '1'
    }
  },
  mutations: {},
  actions: {},
  modules: {}
})
