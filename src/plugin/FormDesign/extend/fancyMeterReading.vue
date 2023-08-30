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
            :disabled="preDisable"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="本次抄表数"
          label-width="100px"
          :rules="curMeterRules"
        >
          <el-input
            v-model="meterReadingList[meterIndex].devList[devIndex].curMeter"
            @change="handleChange(insCode,$event)"
          ></el-input>
        </el-form-item>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/util/date.js";
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
  },
  data() {
    return {
      meterReadingList: this.$props.value,
      curMeterRules: [
        { required: true, message: "本次抄表数不能为空", trigger: "blur" },
      ],
    };
  },
  watch: {
    value: {
      handler(meterList) {
        this.meterReadingList = JSON.parse(JSON.stringify(meterList));
      },
    },
  },
  methods: {
    handleChange(meterCode,event) {
      this.meterReadingList = this.meterReadingList.map((element) => {
        element.devList = element.devList.map((item) => {
          if (item.insCode === meterCode) {
            // const curMeter = Number(event);
            // if(curMeter<item.preMeter){
            //   item.curMeter = "";
            //   return;
            // }
            // item.curMeter = curMeter;
            item.curMeter = event;
            if (this.timeFlag) {
              item.curTime = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
            }
          }
          return item;
        });
        return element;
      });
      this.$emit("input", this.meterReadingList);
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
