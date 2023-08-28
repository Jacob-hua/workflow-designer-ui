<!--文本扩展-->
<template>
  <div class="meter-reading">
    <el-form :model="formModel" label-position="left">
      <div v-for="{ flagId, nameString, devList } in meterReadingList">
        <p>{{ nameString }}</p>
        <div v-for="{ insCode, insName } in devList">
          <p>{{ insName }}</p>
          <el-form-item label="上次抄表数">
            <el-input :disabled="preDisable" ></el-input>
          </el-form-item>
          <el-form-item label="本次抄表数">
            <el-input @change="handleChange" placeholder="本次抄表数"></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
// import { executeApi } from "@/api/globalConfig";
export default {
  name: "fancyMeterReading",
  props: {
    meterList: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "抄表",
    },
    options: {
      type: Object,
      default: () => {},
    },
    preDisable: {
      type: Boolean,
      required: true
    },
    curRequired: {
      type: Boolean,
      required: true
    },
    timeFlag: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      formModel: {},
      meterReadingList: []
    };
  },
  watch: {
    meterList: {
      immediate:true,
      deep: true,
      handler(meterList){
        this.meterReadingList = meterList;
      }
    }
  },
  methods: {
    handleChange(){
      this.$emit("input", this.meterReadingList);
    }
  },
};
</script>
<style scoped lang="scss">
.meter-reading{

}
</style>
