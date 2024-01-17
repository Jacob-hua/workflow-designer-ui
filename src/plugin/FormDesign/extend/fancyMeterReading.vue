<!--文本扩展-->
<template>
  <div class="meter-reading">
    <div
      class="form-box"
      v-for="({ flagId, nameString, devList }, meterIndex) in meterReadingList"
      :key="flagId"
    >
      <p>{{ nameString }}</p>
      <div
        class="input-item"
        v-for="({ insCode, insName }, devIndex) in devList"
        :key="insCode"
      >
        <p>{{ insName }}</p>
        <el-form-item label="上次抄表数" label-width="100px">
          <el-input
            v-model="meterReadingList[meterIndex].devList[devIndex].preMeter"
            placeholder="请输入上次抄表数"
            :disabled="preDisable"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="本次抄表数"
          label-width="100px"
          :prop="`${formId}.${meterIndex}.devList.${devIndex}.curMeter`"
          :rules="curMeterRules"
        >
          <el-input
            v-model.trim="
              meterReadingList[meterIndex].devList[devIndex].curMeter
            "
            placeholder="请输入本次抄表数"
            @change="handleChange(insCode, $event)"
          ></el-input>
        </el-form-item>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/util/date.js";
import _ from 'lodash';
export default {
  name: "fancyMeterReading",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: () => {},
    },
    preDisable: {
      type: Boolean,
      required: true,
    },
    curRequired: {
      type: Boolean,
      required: true,
    },
    timeFlag: {
      type: Boolean,
      required: true,
    },
    dataRule: {
      type: String,
    },
    datatypeRule: {
      type: String,
    },
    datatypeRuleMsg: {
      type: String,
    },
    id: {
      type: String,
    },
  },
  data() {
    return {
      meterReadingList: this.$props.value,
      meterRule: this.$props.dataRule,
      correctFlag: true,
      currentPreMeter: "",
      currentInsCode: "",
      curMeterRules: [
        { required: true, message: "本次抄表数不能为空", trigger: "blur" },
        {
          validator: this.meterValidator.bind(this),
          trigger: "blur",
        },
      ],
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
      handler(meterList) {
        this.meterReadingList = JSON.parse(JSON.stringify(meterList));
      },
    },
    dataRule(newVal) {
      this.meterRule = newVal;
    },
    "options.result": {
      handler(opt) {
        if (!opt) return;
        this.meterReadingList = this.meterReadingList.map((element) => {
          element.devList = element.devList.map((item) => {
            const devValueObj = opt.find(
              ({ meterCode }) => meterCode === item.insCode
            );
            if (devValueObj) {
              item.preMeter = devValueObj.value;
              item.preTime = devValueObj.time;
            }
            return item;
          });
          return element;
        });
      },
    },
  },
  methods: {
    handleChange(meterCode, event) {
      this.currentInsCode = meterCode;
      this.meterReadingList = this.meterReadingList.map((element) => {
        element.devList = element.devList.map((item) => {
          if (item.insCode === meterCode) {
            if (['number'].includes(this.$props.datatypeRule) && new RegExp('^[0-9]+(\.[0-9]{1,4})?$').test(event) === false) {
              this.correctFlag = false;
            } else {
              this.currentPreMeter = item.preMeter;
              if (this.$props.dataRule === "larger") {
                if (item.preMeter >= event) {
                  this.correctFlag = false;
                }
              }
              if (this.$props.dataRule === "larger_amount") {
                if (item.preMeter > event) {
                  this.correctFlag = false;
                }
              }
            }
            if (this.correctFlag) {
              if (this.timeFlag) {
                item.curTime = formatDate(new Date(), "YYYY-MM-DD HH:mm:ss");
              }
            }
          }
          return item;
        });
        return element;
      });
      this.$emit("input", this.meterReadingList);
    },
    handleValueList(meterCode) {
      this.meterReadingList = this.meterReadingList.map((element) => {
        element.devList = element.devList.map((item) => {
          if (item.insCode === meterCode) {
            delete item.curMeter;
            delete item.curTime;
          }
          return item;
        });
        return element;
      });
      this.$emit("input", this.meterReadingList);
    },
    meterValidator(rule, value, callback) {
      if(['default'].includes(this.$props.datatypeRule)){
        callback();
        return;
      }
      const meterRule = this.meterRule;
      const devicePath = rule.field.split('.');
      const currentPreMeter = this.meterReadingList[devicePath[1]].devList[devicePath[3]].preMeter;
      if (!_.isNumber(this.currentPreMeter) && new RegExp('^[0-9]+(\.[0-9]{1,4})?$').test(value) === true) {
        callback();
      } else if (['number'].includes(this.$props.datatypeRule) && new RegExp('^[0-9]+(\.[0-9]{1,4})?$').test(value) === false) {
        this.handleValueList(this.currentInsCode);
        callback(new Error('请输入整数或者不超过小数点后四位的小数'));
      } else if (!['number'].includes(this.$props.datatypeRule) && new RegExp(this.$props.datatypeRule).test(value) === false) {
        this.handleValueList(this.currentInsCode);
        callback(new Error(this.$props.datatypeRuleMsg));
      } else if ( meterRule === "larger" && value <= currentPreMeter) {
        this.handleValueList(this.currentInsCode);
        callback(new Error("本次抄表数必须大于上次抄表数"));
      } else if (meterRule === "larger_amount" && value < currentPreMeter) {
        this.handleValueList(this.currentInsCode);
        callback(new Error("本次抄表数必须大于等于上次抄表数"));
      } else {
        callback();
      }
    },
  },
};
</script>
<style scoped lang="scss">
.meter-reading {
  .input-item {
    .el-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>
