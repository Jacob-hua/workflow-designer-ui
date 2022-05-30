<template>
  <div >
    <el-row  :gutter="formConf.gutter">
      <el-form
          :rules="rules"
          :ref="formConf.formModel"
          :size="formConf.size"
          :model="form"
          :label-position="formConf.labelPosition"
          :disabled="formConf.disabled"
          :validate-on-rule-change="false"
          label-width="formConf.labelWidth + 'px'"
        >
          <template v-for="(element,index) in list"  >
             <preview-row-item 
              v-if="element.compType === 'row'"
              :key="'row-'+index" 
              :model="element"
              >
            </preview-row-item>
            <el-col class="drag-col-wrapper" :key="index"   :span="element.span" v-else>
              <preview-item 
                :model="element"
                v-model="form[element.id]"
                @valChange="handlerValChange"
              />
            </el-col>
          </template>
          
        </el-form>
    </el-row>
    <el-divider></el-divider>
    <div style="text-align: center;">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlerSubForm">提交</el-button>
      </span>
    </div>
  </div>
</template>
<script>
import previewItem from "./previewItem";
import previewRowItem from "./previewRowItem";
import {datas,addRow,batchDeleteRow,deleteRow} from "../custom/formDraw";
export default {
  name:'preview',
  props:['itemList','formConf'],
  components:{
    previewItem,
    previewRowItem
  },
  data(){
    return{
      list: this.itemList,
      form:{},
      rules:{},
      currentIndex:-1
    }
  },
  methods:{
    handlerValChange(key,origin){
      this.$set(this.form,key,origin);
    },
    handlerDynamicValChange(parentId,index,key,origin){
      this.$set(this.form[parentId][index],key,origin);
      this.currentIndex = index;
    },
    handlerSubForm(){
      this.$refs[this.formConf.formModel].validate((valid) => {
        if (valid) {
          this.$message.success('success');
        }
      });
    },
    handlerAddRow:addRow,
    handlerDeleteRow:deleteRow,
    handlerBatchDeleteRow:batchDeleteRow,
    handlerInitDatas:datas,
  },
  created(){
    this.handlerInitDatas();//初始化表单
  },
  mounted() {
    this.$nextTick(()=> {
    })
  },
  beforeCreate(){
  },
  computed:{
  }
}
</script>
<style scoped>
.preview-board{
  border: 1px dashed #ccc
}
</style>