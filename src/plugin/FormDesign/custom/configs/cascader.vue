<template>
  <div v-show="props.compType === 'cascader'">
    <!-- <el-form-item label="字段名">
      <el-input class="input" v-model="props"></el-input>
    </el-form-item> -->
    <el-form-item label="字段">
      <el-tooltip class="item" effect="dark" content="请注意,ID的修改可能会导致该组件相关事件失效！" placement="left">
        <el-input class="input" v-model="props.id" @change="handlerChangeId" ></el-input>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="标题">
      <el-input class="input" v-model="props.label"></el-input>
    </el-form-item>
    <el-form-item label="栅格">
      <el-input-number v-model="props.span"  :min="1" :max="24"/>
    </el-form-item>
    <el-form-item label="宽度">
      <el-input-number v-model="props.width"  :min="0" :max="100"/>%
    </el-form-item>
    <el-form-item label="提示符">
      <el-input class="input" v-model="props.placeholder" placeholder="请输入提示符"/>
    </el-form-item>
    <!-- <el-form-item label="表单栅格">
      <el-slider class="input" v-model="props.span" :max="24" :min="1" :marks="{12:''}"></el-slider>
    </el-form-item> -->
    <el-form-item label="栅格间隔">
      <el-input-number v-model="props.gutter"  :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="标签宽度">
      <el-input-number v-model="props.labelWidth"  :min="0" :max="200"></el-input-number>
    </el-form-item>
    <el-form-item label="显示标签">
      <el-switch v-model="props.showLabel"  @change="handlerChangeLabel"></el-switch>
    </el-form-item>
    <el-form-item label="大小">
      <el-radio-group v-model="props.size">
        <el-radio-button label="medium">正常</el-radio-button>
        <el-radio-button label="small">略小</el-radio-button>
        <el-radio-button label="mini">迷你</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="清除">
      <el-switch v-model="props.clearable"></el-switch>
    </el-form-item>
    <el-form-item label="禁用">
      <el-switch v-model="props.disabled" ></el-switch>
    </el-form-item>
    <el-form-item label="完整路径">
      <el-switch v-model="props.props['show-all-levels']" ></el-switch>
    </el-form-item>
    <el-form-item label="分隔符">
      <el-input v-model="props.props.separator" ></el-input>
    </el-form-item>
    <el-form-item label="搜索">
      <el-switch v-model="props.props.filterable" ></el-switch>
    </el-form-item>
    <el-form-item label="展开方式">
      <el-radio-group v-model="props.props.props.expandTrigger">
      <el-radio-button label="click">点击</el-radio-button>
      <el-radio-button label="hover">悬停</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="多选">
      <el-switch v-model="props.props.props.multiple"></el-switch>
    </el-form-item>
    <el-form-item label="任一级可选">
      <el-switch v-model="props.props.props.checkStrictly"></el-switch>
    </el-form-item>
    <el-form-item label="数据类型">
      <el-radio-group v-model="props.dataType" @change="handlerChangeDataType">
        <el-radio-button label="static">静态数据</el-radio-button>
        <el-radio-button label="dynamic">动态数据</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <div v-show="props.dataType ==='dynamic'">
<!--      <el-form-item label="地址">-->
<!--        <el-input v-model="props.action"></el-input>-->
<!--      </el-form-item>-->
      <el-form-item label="第三方API">
        <el-select v-model="interFace"
                   clearable>
          <el-option  v-for="({ name, id, source, sourceMark }, index) in interFaceOption"
                      @click.native="onClickOption(id,source, sourceMark)"
                      :key="index"
                      :label="name"
                      :value="id" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="variableOption.length" label="关联">
        <div v-for="(variable,index) in variableArr" :key="index">
          <div>{{variable}}</div>
          <el-input v-model="variableOption[index][variable]" ></el-input>
        </div>
      </el-form-item>
      <el-form-item label="显示标识">
        <el-input v-model="props.props.props.label"></el-input>
      </el-form-item>
      <el-form-item label="值标识">
        <el-input v-model="props.props.props.value"></el-input>
      </el-form-item>
      <el-form-item label="下级标识">
        <el-input v-model="props.props.props.children"></el-input>
      </el-form-item>
    </div>
    <div v-show="props.dataType ==='static'">
        <el-form-item label="静态数据">
          <el-button icon="el-icon-edit-outline" circle @click="handlerStaticData"></el-button>
        </el-form-item>
        <el-form-item label="省市区">
          <el-checkbox v-model="props['china-area-data']" @change="handlerSetAreaData"/>
        </el-form-item>
    </div>
    <!-- <el-form-item label="URL">
      <el-input v-model="props.action"></el-input>
    </el-form-item> -->
    
    <el-dialog  :visible.sync="staticDataVisible" width="70%"
                :close-on-press-escape="false"
                :close-on-click-modal="false"
                :show-close="false"
                :center="true"
                top="20px"
                append-to-body
    >
      <codemirror v-model="staticOptions" :options="codeMirror"/>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlerSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {changeId} from '../mixin'
//引入 省市区 数据
import {areaData} from '../../utils/chinaAreaData';
import {codemirror} from 'vue-codemirror';
// 核心样式
import 'codemirror/lib/codemirror.css';
// 引入主题后还需要在 options 中指定主题才会生效
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript'
import {mapActions, mapMutations, mapState} from "vuex";
import {apiDetail} from "@/api/globalConfig";
import {variableFactory} from "@/mixin/formDepMonitor";
const options = {
    tabSize: 2, // 缩进格式
    theme: 'dracula', // 主题，对应主题库 JS 需要提前引入
    lineNumbers: true, // 显示行号
    line: true,
    styleActiveLine: true, // 高亮选中行
    hintOptions: {
      completeSingle: true // 当匹配只有一项的时候是否自动补全
    }
  }
/**
 * input的配置项
 */
export default {
  name:"cascaderConfig",
  props:['props', 'itemList'],
  components:{
    codemirror
  },
  mixins:[changeId],
  data(){
    return {
      staticDataVisible:false,
      codeMirror:options,
      staticOptions:'',
      tempOptions:[],
      currentDetail: {},
      variableOption: [],
      variableArr: [],
      interFace: ''
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'currentOrganization']),
    ...mapState('form',['interFaceOption', 'dynamicOption'])
  },
  methods:{
    ...mapActions('form',['refreshApiList', 'executeFunction']),
    ...mapMutations('form',['addThirdPartyApi']),
    onClickOption(id,source, sourceMark) {
      let _this = this
      apiDetail({
        source: source,
        sourceMark: sourceMark,
        tenantId: this.tenantId
      }).then((res)=> {
        // 获取开闭所问题是不是
        this.currentDetail = res.result.filter(item => item.id === id)[0]
        this.variableArr = variableFactory(this.currentDetail)
        this.addThirdPartyApi( { id: this.currentDetail.id } )
        if (this.variableArr) {
          this.variableOption = this.variableArr.map(variable =>(
              {
                [variable] : variable
              }
          ))
        }

        this.itemList.forEach(item => {
          if (item.id ===  this.props.id) {
            item.requestConfig = this.currentDetail
            item.relationMapping = this.variableOption
          }
        })


        // console.log(arr)
        // _this.executeFunction({api: this.currentDetail, relation: this.props.relation, value: ''}  )
        // this.addThirdPartyApi( { id: this.currentDetail.id } )
      })
    },
    handlerChangeLabel(val){
      this.props.labelWidth = val?'80':'1'
    },
    handlerStaticData(){
      this.staticOptions = JSON.stringify(this.props.options,null,4);
      this.staticDataVisible = true;
      
    },
    handlerSave(){
      this.props.options = JSON.parse(this.staticOptions);
      this.staticDataVisible = false;
    },
    handlerChangeDataType(value){
      if(value === 'static'){
        this.props.options = [];
        this.props.options = this.tempOptions;
      }else{
        this.tempOptions = this.props.options;
        this.props.options = [];
        this.refreshApiList()
      }
    },
    handlerSetAreaData(val){
      if(val){
        const areaoptions = areaData();
        this.tempOptions = this.props.options;
        this.props.options = areaoptions;
      }else{
        this.props.options = this.tempOptions;
      }
    }
  },
  mounted(){
  },
  watch:{
  }
}
</script>
<style scoped>
</style>