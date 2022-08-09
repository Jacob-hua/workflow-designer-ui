<script>
import render from '../custom/previewRender'
import checkRules from '../custom/rule';

const layouts = {
  colItem(h, element,value, quoteOption, getFileList, uploadFun, downloadFun) {
    let labelWidth = element.labelWidth ? `${element.labelWidth}px` : null
    const {valChange} = this.$listeners;
    const rules = checkRules(element)
    if (element.compType === 'checkbox') {
      value = value ?? []
    }
    return (
        <el-col  style="{padding-left: 7.5px; padding-right: 7.5px;">
          <el-form-item label={element.showLabel ? element.label : ''}
                        label-width={labelWidth}
                        prop={element.id}
                        rules={rules}
                        >
            <render
                key={element.id}
                conf={element}
                value={value}
                getFileList={getFileList}
                quoteOption={quoteOption}
                uploadFun= { uploadFun }
                downloadFun= { downloadFun }
                onInput={ event => {
                this.$set(element,'value',event);
                valChange(element.id,event);
            }}/>
          </el-form-item>
        </el-col>
    )
  }
}

export default {
  name:"previewItem",
  components: {
    render
  },
  props: ['models','value', 'quoteOption', 'getFileList', 'downloadFun', 'uploadFun'],
  data(){
    return {
      eleConfig:this.models
    }
  },

  render(h) {

    return layouts.colItem.call(this, h, this.eleConfig,this.value, this.quoteOption, this.getFileList, this.uploadFun, this.downloadFun)
  }
}
</script>