/**
 * NFC
 */
export let nfc = {
  id: '',
  _id: '',
  compType: 'nfc',
  ele: 'fancy-nfc',
  //控件名称(左侧显示)
  compName: 'NFC识别',
  //图标
  compIcon: 'input',
  //展示表单的模式
  viewType: 'text',

  // 是否可配置
  //暂时默认为true，无法更改，后期考虑某些时候无法配置
  config: true,
  // 控件左侧label内容
  showLabel: true,
  label: 'NFC识别',
  labelWidth: '80',
  placeholder: '请输入文本',
  // 是否必填
  required: false,
  //栅格间隔
  gutter: 15,
  //默认栅格
  span: 24,
  //组件长度
  width: '95%',
  disabled: false,
  value: '',
  //验证规则(字符,phone,email,number)
  rules: [],
  //验证规则
  rulesType: 'default',
}
