export let gasMeterReading = {
  id: '',
  _id: '',
  // 栅格可复制时标题
  title: '天然气抄表',
  compType: 'gasMeterReading',
  //控件名称
  compName: '天然气抄表',
  //element标签
  ele: 'fancy-gas-meter-reading',
  //图标
  compIcon: 'html',
  //展示表单的模式
  viewType: 'component',
  // 是否可配置
  config: true,
  showLabel: false,
  label: '天然气抄表',
  labelWidth: '0',

  //禁用
  disabled: false,

  totalRequired: false,
  totalDatatypeRule: 'default',
  totalDataRule: 'larger',
  marginRequired: false,
  marginDatatypeRule: 'default',
  marginDataRule: 'less',
  height: '600',

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
  value: {
    priceList: [
      {
        name: '锅炉',
        type: 'boiler',
        price: 0,
      },
      {
        name: '其他',
        type: 'other',
        price: 0,
      },
    ],
    meterList: [],
  },
};
