/**
 * 栅格布局
 */

 // export default (_self, h) => {
//   return [
//     h("Input", {})
//   ];
// };

export let row = {
  id:'',
  _id:'',
  compType: 'row',
  //控件名称
  compName:'栅格布局',
  //element标签
  ele: 'el-row',
  //图标
  compIcon:'col',
  layout:'rowItem',
  // 是否可配置
  config: true,

  // 是否可复制
      isCopy: false,
  flex:'default',
  justify:'start',
  align:'top',
  gutter:0,
  controlFiled: '', // 控制栅格显示隐藏的字段
       controlFiledVal: '',
  columns:[
    {
      index:0,
      span:12,
      list:[]
    },
    {
      index:1,
      span:12,
      list:[]
    }
  ],
}
