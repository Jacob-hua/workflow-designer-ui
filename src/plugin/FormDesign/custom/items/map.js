export let map = {
  id: '',
  _id: '',
  compType: 'map',
  //控件名称
  compName: '地址',
  //element标签
  ele: 'fancy-map',
  //图标
  compIcon: 'select',
  //展示表单的模式
  viewType: 'component',
  // 是否可配置
  config: true,
  // 控件左侧label内容
  label: '地址',
  placeholder: '请选择地址',
  //表单栅格
  span: 24,
  //栅格间隔
  gutter: '15',
  //标签宽度
  labelWidth: 80,
  //显示标签
  showLabel: true,
  //必填
  required: false,
  //多选
  multiple: false,
  //禁用
  disabled: false,
  //是否可以清空
  clearable: false,
  value: undefined,
  rules: [],
  // 验证错误提示信息
  ruleError: '该字段不能为空',
}
