<!--文本扩展-->
<template>
  <div class="form-list">
    <el-button
      v-if="!formConf || !formConf.disabled"
      @click.native="handlerShowDialog"
      type="primary"
      >{{ title }}</el-button
    >
    <el-table
      v-if="selectedData.length"
      :data="selectedData"
      :max-height="`${height}px`"
      style="width: 100%"
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
        :max-height="`${height}px`"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          v-if="gridData.length && !disabled"
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
        >
          <template #default="scope">
            <template v-if="scope.row[item.prop] instanceof Array">
              <div
                class="column-item"
                v-for="(imgItem, index) in scope.row[item.prop]"
                :key="index"
                @click="downloadImg(imgItem)"
              >
                {{ imgItem.attachmentFileName }}
              </div>
            </template>
            <div v-else>{{ scope.row[item.prop] }}</div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlerSelect">确 定</el-button>
        <el-button @click="handlerHideDialog">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="imgDialogVisible"
      :append-to-body="true"
      width="60%"
      center
      :destroy-on-close="true"
      :lock-scroll="true"
      :show-close="true"
      :close-on-click-modal="false"
    >
      <img :src="previewImage" alt="Preview" style="width: 100%;height: 70vh;" />
    </el-dialog>
  </div>
</template>

<script>
// import { executeApi } from "@/api/globalConfig";
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
      default: [],
    },
    formConf: {
      type: Object,
      default: {},
    },
    options: {
      type: Object,
      default: {},
    },
    downloadFun: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      selectedData: this.$props.value,
      dialogValue: "",
      dialogVisible: false,
      gridData: [],
      previewImage: null,
      imgDialogVisible: false,
    };
  },
  watch: {
    gridData(tableList) {
      tableList.forEach((item) => {
        this.selectedData.forEach(({ id }) => {
          if (item.id === id) {
            this.$nextTick(() => {
              this.$refs.dataTable.toggleRowSelection(item, true);
            });
          }
        });
      });
    },
    value(val) {
      this.selectedData = val;
    },
  },
  methods: {
    handlerShowDialog() {
      if (this.$props.tableColumn.length <= 0) {
        this.dialogVisible = true;
        return;
      }
      if (this.$props.options.result && this.$props.options.result.length > 0) {
        this.gridData = this.$props.options.result;
      }
      this.dialogVisible = true;
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
    async downloadImg(imgItem) {
      const result = await Promise.resolve(
        this.$props.downloadFun({ url: imgItem.attachmentId })
      );
      const reader = new FileReader();
      reader.readAsDataURL(result);
      reader.onload = () => {
        this.previewImage = reader.result;
        // const a = document.createElement("a");
        // a.href = reader.result;
        // a.setAttribute("download", imgItem.attachmentFileName);
        // a.click();
      };
        this.imgDialogVisible = true;
    },
  },
};
</script>
<style scoped lang="scss">
/**#e6f7ff; */
.form-list >>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #d1dfd5;
}

::v-deep .el-table__body-wrapper {
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
    display: block;
  }

  &::-webkit-scrollbar-corner {
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #eee;
    border-radius: 4px;
  }
  .column-item {
    cursor: pointer;
    color: #409eff;

    &:hover {
      color: #ffffff;
    }
  }
}
</style>
