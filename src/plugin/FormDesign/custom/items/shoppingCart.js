

export let shoppingCart = {
  id: '',
  _id: '',
  compType: 'shoppingCart',
  //控件名称
  compName: '购物车 ',
  //element标签
  ele: 'fancy-shopping-cart',
  //图标
  compIcon: 'select',
  //展示表单的模式
  viewType: 'component',
  // 是否可配置
  config: true,
  label:'备品',

  //标签宽度
  labelWidth: 80,

  showLabel:true,

  checkStockFun: Function,
  cancleStockFun: Function,

}