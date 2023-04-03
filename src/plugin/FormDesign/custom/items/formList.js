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

  // 请求地址
  action:'/applet/list',
  //显示序号
  showIndex:false,
  //多选
  multi:true,
  
  //禁用
  disabled:false,

  flex: 'default',
  justify: 'start',
  align: 'top',
  gutter: 0,
  visible: true,
  columns: [],
  value:[]
}
