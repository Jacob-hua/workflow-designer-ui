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
          @submit.native.prevent="submit"
        >
          <template v-for="(element, index) in metaDataList"  >
             <preview-row-item
              v-if="element.compType === 'row'"
              :key="'row-'+index"
              :model="element"
              :itemList="itemList"
              @changeItemList = "changeItemList"
              :index = 'index'
              :quoteOption="quoteOption"
              :getFileList="getFileList"
              :uploadFun = 'uploadFun'
              :downloadFun = 'downloadFun'
              >
              <el-col v-for="(column) in element.columns" :key="column.index" :span="column.span">
                <template v-for="(col) in column.list">
                  <preview-item
                    v-if="col.compType!== 'dynamicTable'"
                    :key="col.id"
                    :model="col"
                    v-model="form[col.id]"
                    @valChange="handlerValChange"
                    :quoteOption="quoteOption"
                    :getFileList="getFileList"
                    :uploadFun = 'uploadFun'
                    :downloadFun = 'downloadFun'
                  />
                </template>
              </el-col>
            </preview-row-item>
            <!--item-->
            <el-col class="drag-col-wrapper" :key="index"   :span="element.span" v-else>
              <preview-item
                :model="element"
                v-model="form[element.id]"
                :quoteOption="quoteOption"
                :getFileList="getFileList"
                @valChange="handlerValChange"
                :uploadFun = 'uploadFun'
                :downloadFun = 'downloadFun'
              />
            </el-col>
          </template>
        </el-form>
    </el-row>
  </div>
</template>
<script>
import previewItem from "./previewItem";
import previewRowItem from "./previewRowItem";
import fancyDynamicTable from "../dynamic/fancyDynamicTable";
import fancyDynamicTableItem from "../dynamic/fancyDynamicTableItem";
import {datas,addRow,batchDeleteRow,deleteRow} from "../custom/formDraw";
import formDepMonitorMixin, {mixinExecuteFunction} from "@/mixin/formDepMonitor";
import {executeApi, processVariable} from "@/api/globalConfig";
import _ from 'lodash'
import {getSimpleId} from "@/plugin/FormDesign/utils/IdGenerate";

export default {
  name:'preview',
  props:['itemList','formConf', 'uploadFun', 'downloadFun', 'processInstanceId'],
  components:{
    previewItem,
    previewRowItem,
    fancyDynamicTable,
    fancyDynamicTableItem
  },
  data(){
    return{
      form:{},
      rules:{},
      currentIndex:-1,
      quoteOption: [],
      fileList: [],
      file:{},
    }
  },
  mixins: [
    formDepMonitorMixin({
        formData: 'form',
        formFields: 'metaDataList',
    }),
  ],
  created(){
   this.handlerInitDatas();
  },
  computed:{
    metaDataList : function () {
      return this.itemList.map((fieldInfo) => {
        if (fieldInfo.relationMapping && fieldInfo.relationMapping.length) {
          if (!fieldInfo.disabled && !this.formConf.disabled) {
            fieldInfo.context = this.getContext()
          }
        }
        return mixinExecuteFunction(fieldInfo, (data, fieldInfo) => {
          if (!fieldInfo.disabled && !this.formConf.disabled) {
            executeApi({
              apiMark: fieldInfo.requestConfig.apiMark,
              sourceMark: fieldInfo.requestConfig.sourceMark,
              data,
            }).then(({ result: options }) => {
              if(fieldInfo.compType === 'select' || fieldInfo.compType === 'radio' || fieldInfo.compType === 'checkbox' ){
                this.quoteOption = options
              } else if(fieldInfo.compType === 'cascader') { // 处理级联
                this.deleteEmptyChildren(options.result)
                this.quoteOption = options.result
              } else { // 处理选择列表
              }
            })
          }
        })
      })
    }
  },
  watch: {
    form: {
      immediate: false,
      deep: true,
      handler(data) {
        this.metaDataList.forEach(item => {
          if ((item.compType === 'text' || item.compType === 'input' || item.compType === 'textarea') && item.relationField) {
            if (item.relationField.trim().startsWith('#')) {
              if (item.compType === 'text') {
                item.text = data[item.relationField.split('#')[1]]
              } else {
                data[item.id] = data[item.relationField.split('#')[1]]
              }
            } else if(item.relationField.trim().startsWith('$')) {
               this.getContext().then(res=> {
                 if (item.compType === 'text') {
                   item.text = res[item.relationField.split('$')[1]]
                 } else {
                   data[item.id] = res[item.relationField.split('$')[1]]
                 }
               })
            }
          }
          if ((item.compType === 'row')   && item.controlFiled && item.controlFiledVal) {
            item.controlFiledFlag = String(data[item.controlFiled]) === item.controlFiledVal;
            console.log(item.controlFiledFlag)
          } else {
           item.controlFiledFlag = true
          }
        })
      }
    }
  },
  methods:{
    changeItemList(model) {
      const clone = _.cloneDeep(model)
      const uId = "row_"+getSimpleId();
      clone.id = uId;
      clone._id = uId;
      clone.columns.map((column)=>{
        let itemList = [];
        if (column.list.length) {
          column.list.map((item)=>{
            const cloneitem = _.cloneDeep(item)
              cloneitem.id = `${cloneitem.id}_${getSimpleId()}`;
              cloneitem._id = cloneitem.id;
              itemList.push(cloneitem);
          })
          column.list = [];
          column.list = itemList;
        }
      })
      this.itemList.splice( this.itemList.findIndex((item) => item.id === model.id ), 0, clone)
    },
    deleteEmptyChildren(arr) {
      for (let i = 0; i < arr.length; i++) {
        const arrElement = arr[i];
        if (!arrElement.children.length) {
          delete arrElement.children
          continue
        }
        if (arrElement.children) {
          this.deleteEmptyChildren(arrElement.children)
        }
      }
    },
    getFileList(file, fileList) {
      this.fileList = fileList
      this.file = file
    },
    handlerValChange(key,origin){
      this.$set(this.form,key,origin);
    },
    handlerDynamicValChange(parentId,index,key,origin){
      this.$set(this.form[parentId][index],key,origin);
      this.currentIndex = index;
    },
    async resetField () {
       this.$refs[this.formConf.formModel].resetField()
    },
     async submit(){
      this.metaDataList.forEach(metaData => {
        Object.keys(this.form).forEach(form => {
            if (form === metaData.id) {
              metaData.value = this.form[form]
            }
        })
      })
        try {
          await this.$refs[this.formConf.formModel].validate()
          console.log(_.cloneDeep(
              {
                metaDataList: this.metaDataList,
                formData: this.form
              }
          ))
          return _.cloneDeep(
                {
                  metaDataList: this.metaDataList,
                  formData: this.form
                }
              )
        }catch (e) {
          throw  new Error(e.toString())
        }
      },
   async getContext() {
     const { result } =  await processVariable({
        // processInstanceId: 'c4ace818-01a9-11ed-8113-b215cd163104'
          processInstanceId: this.processInstanceId ?? ''
      })
      return  result
    },
    handlerAddRow:addRow,
    handlerDeleteRow:deleteRow,
    handlerBatchDeleteRow:batchDeleteRow,
    handlerInitDatas:datas,
  },

  mounted() {
  },
  beforeCreate(){
  },

}
</script>
<style scoped>
.preview-board{
  border: 1px dashed #ccc
}
</style>