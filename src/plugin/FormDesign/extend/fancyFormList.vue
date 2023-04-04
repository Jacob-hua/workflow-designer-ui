<!--文本扩展-->
<template>
  <div class="form-list">
    <el-button @click.native="handlerShowDialog" type="primary">{{
      title
    }}</el-button>
    <el-table
      v-if="selectedData.length"
      :data="selectedData"
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
import { executeApi } from "@/api/globalConfig";
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
    requestConfig: {
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
  watch: {
    gridData(tableList){
      tableList.forEach(item => {
        this.selectedData.forEach(({id}) => {
          if(item.id === id){
            this.$nextTick(() => {
              this.$refs.dataTable.toggleRowSelection(item,true);
            })
          }
        })
      })
    }
  },
  methods: {
    handlerShowDialog() {
      if (this.$props.tableColumn.length <= 0) {
        this.dialogVisible = true;
        return;
      }
      if (Object.keys(this.$props.requestConfig) === 0) {
        this.dialogVisible = true;
        return;
      }
      const { apiMark, sourceMark, parameter } = this.$props.requestConfig;
      executeApi({
        apiMark: apiMark,
        sourceMark: sourceMark,
        data: parameter,
      }).then(({ result }) => {
        this.gridData = result.result;
        this.dialogVisible = true;
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
      // this.$emit("input", this.selectedData);
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
</style>
