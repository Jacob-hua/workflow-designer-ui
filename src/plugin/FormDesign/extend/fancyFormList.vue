<!--文本扩展-->
<template>
  <div class="form-list">
    <el-button
      @click.native="handlerShowDialog"
      style="width: 100px"
      type="primary"
      >{{ title }}</el-button
    >
    <el-table
      v-if="formConf.disabled"
      :data="gridData"
      border
      :row-style="{ height: '10px' }"
      :cell-style="{ padding: '5px 0' }"
      :header-cell-style="{
        'background-color': '#fafafa',
        'border-bottom': '1px #e6f7ff solid',
        color: '#00000085',
      }"
      :highlight-current-row="!multi"
      :max-height="height"
    >
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        align="center"
        :key="index"
        v-for="(item, index) in columns"
      />
    </el-table>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :title="title"
      width="60%"
      center
      :append-to-body="true"
      :show-close="true"
      :lock-scroll="true"
      :destroy-on-close="true"
    >
      <el-table
        ref="dataTable"
        :data="gridData"
        border
        :row-class-name="tableRowClassName"
        :row-style="{ height: '10px' }"
        :cell-style="{ padding: '5px 0' }"
        :header-cell-style="{
          'background-color': '#fafafa',
          'border-bottom': '1px #e6f7ff solid',
          color: '#00000065',
        }"
        :highlight-current-row="!multi"
        :max-height="height"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          v-if="multi && !disabled"
          align="center"
        ></el-table-column>
        <el-table-column
          type="index"
          v-if="showIndex"
          align="center"
        ></el-table-column>
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          align="center"
          :key="index"
          v-for="(item, index) in columns"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlerSelect">确 定</el-button>
        <el-button @click="handlerHideDialog">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "fancyFormList",
  props: {
    value: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      default: "列表",
    },
    multi: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showIndex: {
      //显示序号
      type: Boolean,
      default: false,
    },
    action: {
      type: String,
      default: "",
    },
    height: {
      type: Number,
      default: 600,
    },
    columns: {
      type: Array,
      default: [],
    },
    formConf: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      selectedData: [],
      dialogValue: "",
      dialogVisible: false,
      gridData: this.$props.value,
    };
  },
  mounted() {
    this.$nextTick(() => {});
  },
  methods: {
    handlerShowDialog() {
      let userInfo =
        (sessionStorage.getItem("loginData") &&
          JSON.parse(sessionStorage.getItem("loginData"))) ||
        "";
      this.$axios
        .get(this.action, {
          headers: {
            "X-SIACT-TOKEN": userInfo.token,
            "X-SIACT-SOURCE": "PC",
            "X-SIACT-TOKEN-TYPE": "1",
          },
        })
        .then((res) => {
          this.gridData = [];
          this.gridData = this.gridData.concat(res.data.result);
          this.dialogVisible = true;
        });
    },
    tableRowClassName(v) {
      if (v.rowIndex % 2 == 1) {
        return "odd-row";
      }
      return "";
    },
    handleSelectionChange(val) {
      this.selectedData = val;
    },
    handlerSelect() {
      this.dialogVisible = false;
      if (this.disabled) return;
      this.$emit("input", this.selectedData);
    },
    handlerHideDialog() {
      this.dialogVisible = false;
      if (this.disabled) return;
      this.selectedData = [];
      this.$emit("input", this.selectedData);
    },
  },
  computed: {},
};
</script>
<style scoped>
/**#e6f7ff; */
.form-list >>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #d1dfd5;
}
.search-text {
  margin-bottom: 10px;
}
</style>
<style>
.el-table .odd-row {
  background-color: #fafafa;
}
</style>
