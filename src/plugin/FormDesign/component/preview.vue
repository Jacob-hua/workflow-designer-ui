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
          <template v-for="(element,index) in metaDataList"  >
            <!-- <el-input v-model="element.id" placeholder=""></el-input> -->
             <preview-row-item 
              v-if="element.compType === 'row'"
              :key="'row-'+index"
              :model="element"
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

export default {
  name:'preview',
  props:['itemList','formConf', 'uploadFun', 'downloadFun'],
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
  computed:{
    metaDataList : function () {
      return this.itemList.map((fieldInfo) => {
        return mixinExecuteFunction(fieldInfo, (data, fieldInfo) => {
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
        })
      })
    }
  },
  methods:{
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
    handlerAddRow:addRow,
    handlerDeleteRow:deleteRow,
    handlerBatchDeleteRow:batchDeleteRow,
    handlerInitDatas:datas,
  },
  created(){
    this.handlerInitDatas();
  },
  mounted() {
    processVariable({
      processInstanceId: '18d5241d-f856-11ec-a9d6-ba48737afcba'
    }).then(res => {
      let flag = false
      this.metaDataList.forEach(meta => {
        if (meta.columns) {
          flag =  true
          meta.columns.forEach(item => {
            item.list.forEach(col => {
              if (col.variable.includes('$')) {
                let character  = col.variable.split('$')[1]
                this.form[col.id] = (res.result)[character]
              }
            })
          })
        }
      })
      if (flag) {
        return
      }
      let sysVar = this.metaDataList.filter(item => item.variable)
      sysVar.forEach(sys=> {
        if (sys.variable.includes('$')) {
          let character  = sys.variable.split('$')[1]
          this.form[sys.id] = (res.result)[character]
        }
      })

    })
  },
  beforeCreate(){
  },

}
</script>
<style scoped>
>>> .el-upload--picture-card {
  background-color: unset;
}
.preview-board{
  border: 1px dashed #ccc
}
</style>