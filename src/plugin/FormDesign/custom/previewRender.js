import { isAttr,jsonClone } from '../utils';
import childrenItem from './slot/index';
import {remoteData} from './mixin';
//先修改在这里,后续需要优化
function vModel(self, dataObject) {
  dataObject.props.value = self.value;
  dataObject.on.input = val => {
    self.$emit('input', val)
  }
  //判断是否为上传组件
  if(self.conf.compType === 'upload'){
    dataObject.attrs['auto-upload'] = false // 文件手动上传
    dataObject.attrs['on-change'] = (file, fileList) => { // 文件变换 钩子
      self.getFileList(file, fileList)
    }
    dataObject.attrs['before-upload'] = file=>{
      //非限定后缀不允许上传
      const fileName = file.name;
      const suffixName = fileName.split('.').pop();
      
      if(!self.conf.accept.includes(suffixName)){ 
        self.$message.error('该后缀文件不允许上传');
        return false;
      }
      const fileSize = file.size;
      if(fileSize>dataObject.props.fileSize*1024*1024){
        self.$message.error('文件大小超出限制，请检查！');
        return false;
      }
    }
  }
}

export default {
  // inject: ['quoteOption'],
  render(h) {
    let dataObject = {
      attrs: {},
      props: {},
      on: {},
      style: {}
    }
    //远程获取数据
    this.getRemoteData();
    if (this.quoteOption.length) {
      this.conf.options = this.quoteOption
    }
    const confClone = jsonClone(this.conf);
    const children = childrenItem(h,confClone);

    Object.keys(confClone).forEach(key => {
      const val = confClone[key]
      if (dataObject[key]) {
        dataObject[key] = val
      } else if(key ==='width'){
        dataObject.style= 'width:'+val;
      } else if (!isAttr(key)) {
        dataObject.props[key] = val
      }else {
        if(key !== 'value'){
          dataObject.attrs[key] = val
        }
      }
    })
    /*调整赋值模式，规避cascader组件赋值props会出现覆盖预制参数的bug */
    vModel(this, dataObject);
    return h(confClone.ele, dataObject, children)
  },
  props: ['conf','value','quoteOption','getFileList'],
  mixins:[remoteData]
}
