<!--文本扩展-->
<template>
  <div class="form-list">
    <el-button @click.native="handlerShowDialog" type="primary">{{
      title
    }}</el-button>
    <el-table
      v-if="selectedData.length"
      :data="selectedData"
      border
      :highlight-current-row="!multi"
      :max-height="`${height}px`"
    >
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        align="center"
        :key="index"
        v-for="(item, index) in tableColumn"
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
        :highlight-current-row="!multi"
        :max-height="`${height}px`"
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
          label="序号"
        ></el-table-column>
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          align="center"
          :key="index"
          v-for="(item, index) in tableColumn"
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
      default: () => [],
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
    actionMode: {
      type: String,
      default: "GET",
    },
    height: {
      type: String,
      default: "600",
    },
    tableColumn: {
      type: Array,
      default: () => [],
    },
    formConf: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      selectedData: this.$props.value,
      dialogValue: "",
      dialogVisible: false,
      gridData: [],
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
      let url = process.env.VUE_APP_BASE_API
        ? `${process.env.VUE_APP_BASE_API}${this.action}`
        : this.action;
      this.$axios({
        url: url,
        method: this.actionMode,
        headers: {
          "X-SIACT-TOKEN": userInfo.token,
          "X-SIACT-SOURCE": "PC",
          "X-SIACT-TOKEN-TYPE": "1",
        },
      }).then((res) => {
        this.gridData = [];
        this.gridData = this.gridData.concat(res.data.result);
        this.dialogVisible = true;
        this.selectedData.forEach((item) => this.$refs.dataTable.toggleRowSelection(item,true))
      });
    },
    handleSelectionChange(val) {
      this.selectedData = val;
    },
    handlerSelect() {
      this.dialogVisible = false;
      this.$emit("input", this.selectedData);
    },
    handlerHideDialog() {
      this.dialogVisible = false;
      this.selectedData = [];
      this.$emit("input", this.selectedData);
    },
  },
  computed: {},
};
</script>
<style scoped lang="scss">
/**#e6f7ff; */
.form-list >>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #d1dfd5;
}

/deep/ .el-table {
    border-bottom: 1px solid #ebeef5;
  }
</style>
