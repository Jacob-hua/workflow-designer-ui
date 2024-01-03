<!--文本扩展-->
<template>
  <div class="meter-reading">
    <div class="price">
      <p>单价</p>
      <el-form-item
        v-for="({name},index) in meterReading.priceList"
        :key="index"
        :label="name"
        label-width="100px"
        :prop="`${formId}.priceList.${index}.price`"
        :rules="priceRule"
      >
        <el-input
          v-model.trim="meterReading.priceList[index].price"
          placeholder="请输入单价"
          @change="handleChangePrice"
        >
          <template slot="append">m³/元</template>
        </el-input>
      </el-form-item>
    </div>
    <div
      class="form-box"
      v-for="({ flagId, nameString, devList }, meterIndex) in meterReading.meterList"
      :key="flagId"
    >
      <p>{{ nameString }}</p>
      <div
        class="input-item"
        v-for="({ insCode, insName }, devIndex) in devList"
        :key="insCode"
      >
        <p>{{ insName }}</p>
        <el-form-item label="总量" label-width="100px" 
        :prop="`${formId}.meterList.${meterIndex}.devList.${devIndex}.totalCount`"
        :rules="totalMeterRules">
          <el-input
            v-model.trim="meterReading.meterList[meterIndex].devList[devIndex].totalCount"
            placeholder="请输入总量"
            @change="handleChange(insCode)"
          >
          <template slot="append">m³</template>
        </el-input>
        </el-form-item>
        <el-form-item
          label="余量"
          label-width="100px"
          :prop="`${formId}.meterList.${meterIndex}.devList.${devIndex}.margin`"
          :rules="marginMeterRules"
        >
          <el-input
            v-model.trim="meterReading.meterList[meterIndex].devList[devIndex].margin"
            placeholder="请输入余量"
            @change="handleChange(insCode)"
          >
          <template slot="append">m³</template>
        </el-input>
        </el-form-item>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'fancyGasMeterReading',
  props: {
    formConf: {
      type: Object,
      default: () => {},
    },
    value: {
      type: Object
    },
    options: {
      type: Object,
      default: () => {},
    },
    totalDataRule: {
      type: String,
    },
    marginDataRule: {
      type: String,
    },
    id: {
      type: String,
    },
    totalRequired: {
      type: Boolean
    },
    marginRequired: {
      type: Boolean
    }
  },
  data() {
    return {
      meterReading: this.$props.value,
      totalRule: this.$props.totalDataRule,
      marginRule: this.$props.marginDataRule,
      currentPreMeter: '',
      currentInsCode: '',
      totalMeterRules: [
        {
          validator: this.totalValidator.bind(this),
          trigger: 'blur',
        },
      ],
      marginMeterRules: [
        {
          validator: this.marginValidator.bind(this),
          trigger: 'blur',
        },
      ],
      priceRule: [
        { required: true, message: '单价不能为空', trigger: 'blur' },
        {
          validator: this.priceValidator.bind(this),
          trigger: 'blur',
        },
      ]
    };
  },
  computed: {
    formId() {
      return this.$props.id;
    },
    // meterRule() {
    //   return this.$props.dataRule;
    // },
  },
  watch: {
    value: {
      handler(meterReading) {
        this.meterReading = JSON.parse(JSON.stringify(meterReading));
      },
    },
    totalDataRule(newVal) {
      this.totalRule = newVal;
    },
    marginDataRule(newVal){
      this.marginRule = newVal;
    },
    'options.result': {
      handler(opt) {
        if (!opt || !opt.length) return;
        if (this.$props.formConf.disabled) return;
        this.meterReading.priceList = opt.map(item => {
          if(item.type === 'boiler'){
            item.name = '锅炉'
          }
          else if(item.type === 'other'){
            item.name = '其他'
          }
          return item
        })
      },
    },
  },
  methods: {
    handleChange(meterCode) {
      this.currentInsCode = meterCode;
      this.$emit('input', this.meterReading);
    },
    handleChangePrice() {
      this.$emit('input', this.meterReading);
    },
    handleValueList(meterCode, type) {
      this.meterReading.meterList = this.meterReading.meterList.map((element) => {
        element.devList = element.devList.map((item) => {
          if (item.insCode === meterCode) {
            if(type === 'total'){
              delete item.totalCount
            }
            if(type === 'margin'){
              delete item.margin;
            }
          }
          return item;
        });
        return element;
      });
      this.$emit('input', this.meterReading);
    },
    totalValidator(rule, value, callback) {
      if(!value){
        callback()
      }else if (/^[0-9]+(\.[0-9]{1,4})?$/.test(value) === false) {
        this.handleValueList(this.currentInsCode, 'total');
        callback(new Error('请输入小数不超过四位的数字'));
      } else {
        callback();
      }
    },
    marginValidator(rule, value, callback) {
      if(!value){
        callback()
      }else if (/^[0-9]+(\.[0-9]{1,4})?$/.test(value) === false) {
        this.handleValueList(this.currentInsCode, 'margin');
        callback(new Error('请输入小数不超过四位的数字'));
      } else {
        callback();
      }
    },
    priceValidator(rule, value, callback) {
      if(!value){
        callback()
      }else if (/^[0-9]+(\.[0-9]{1,4})?$/.test(value) === false) {
        this.handleValueList(this.currentInsCode, 'margin');
        callback(new Error('请输入小数不超过四位的数字'));
      } else {
        callback();
      }
    }
  },
};
</script>
<style scoped lang="scss">
.meter-reading {
  .input-item {
    .el-form-item {
      margin-bottom: 15px;
    }
  }
}

.price {
  .el-form-item {
      margin-bottom: 15px;
    }
}
</style>
