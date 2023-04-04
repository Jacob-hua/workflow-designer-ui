export let formList = {
  id: '',
  _id: '',
  // 栅格可复制时标题
  title: '列表',
  compType: 'formList',
  //控件名称
  compName: '列表',
  //element标签
  ele: 'fancy-form-list',
  //图标
  compIcon:'button',
  //展示表单的模式
  viewType:'component',
  // 是否可配置
  config: true,
  showLabel: false,
  label: '列表',
  labelWidth: '0',

  // 请求地址
  action:'/applet/list',
  //请求方式
  actionMode:'GET',
  //请求头
  actionHeader:'',
  //显示序号
  showIndex:false,
  //多选
  multi:true,
  
  //禁用
  disabled:false,

  height:'600',

  flex: 'default',
  justify: 'start',
  align: 'top',
  gutter: 0,
  visible: true,
  tableColumn: [],
  value:[]
}
