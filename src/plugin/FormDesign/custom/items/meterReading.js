export let meterReading = {
  id: '',
  _id: '',
  // 栅格可复制时标题
  title: '抄表',
  compType: 'meterReading',
  //控件名称
  compName: '抄表',
  //element标签
  ele: 'fancy-meter-reading',
  //图标
  compIcon:'html',
  //展示表单的模式
  viewType:'component',
  // 是否可配置
  config: true,
  showLabel: false,
  label: '抄表',
  labelWidth: '0',
  
  //禁用
  disabled:false,
  dosageMeter: true,
  preDisable: true,
  timeFlag: true,
  curRequired: true,
  datatypeRule: '',
  datatypeRuleMsg: '',
  dataRule: 'larger',
  height:'600',

  flex: 'default',
  justify: 'start',
  align: 'top',
  gutter: 0,
  visible: true,
  rules: [],
  options: {},
  meterTreeConfig: {},
  defaultCheckedKeys: [],
  deviceInstanceCodeList: [],
  value: []
}
