<template>
  <!--中间面板-->
  <div class="center-board">
    <div class="action-bar">
      <el-button class="reset" icon="el-icon-view" type="text" @click="preview">
        预览
      </el-button>
      <el-button
          class="mainBtn"
          icon="el-icon-tickets"
          type="text"
          @click="viewJSON"
      >
        JSON
      </el-button>
<!--      <el-button-->
<!--          class="mainBtn"-->
<!--          icon="el-icon-tickets"-->
<!--          type="text"-->
<!--          @click="handleTreeClick"-->
<!--      >-->
<!--        组件树-->
<!--      </el-button>-->
      <el-button
          class="delete-btn mainBtn"
          icon="el-icon-delete-solid"
          type="text"
          @click="clear"
      >
        清空
      </el-button>
    </div>
    <el-scrollbar class="center-scrollbar">
      <el-row class="center-board-row" :gutter="formConf.gutter">
        <el-form
            :size="formConf.size"
            :label-position="formConf.labelPosition"
            :disabled="formConf.disabled"
            :label-width="formConf.labelWidth + 'px'"
        >
          <draggable
              class="drawing-board"
              :list="list"
              :animation="100"
              group="componentsGroup"
              draggable=".drawing-item"
          >
            <design-item
                v-for="(element, index) in list"
                :key="index"
                :model="element"
                :activeItem="activeItem"
                @rowItemRollBack="handlerRollBack"
                @onActiveItemChange="handlerActiveItemChange"
                @copyItem="handlerItemCopy"
                @deleteItem="handlerItemDelete"
            />
          </draggable>
          <div v-show="infoShow" class="empty-info">
            <el-empty
                :image="imgPath"
                description="从左侧拖拽添加控件"
            ></el-empty>
          </div>
        </el-form>
      </el-row>
    </el-scrollbar>
    <config-panel :activeItem="activeItem" :itemList="list" />
    <!-- 设计器配置弹出框 -->
    <el-dialog
        :visible.sync="previewVisible"
        fullscreen
        title="预览"
        append-to-body
    >
      <preview
          :uploadFun="upload"
          :itemList="itemList"
          :formConf="formConf"
          v-if="previewVisible"
      />
    </el-dialog>
    <el-dialog
        :visible.sync="JSONVisible"
        width="70%"
        title="JSON"
        center
        :close-on-click-modal="false"
        append-to-body
    >
      <codemirror v-model="viewCode" :options="options" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlerSetJson()">确 定</el-button>
      </span>
    </el-dialog>
    <component-tree ref="tree" @updateJSON = "updateJSON" :data="data" v-if="dialogTableVisible" :visible.sync ='dialogTableVisible'></component-tree>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import configPanel from "./configPanel";
import designItem from "./designItem";
import { getSimpleId } from "../utils/IdGenerate";
import { isLayout } from "../utils";
import formConf from "../custom/formConf";
import preview from "./preview";
import { codemirror } from "vue-codemirror";
// 核心样式
import "codemirror/lib/codemirror.css";
// 引入主题后还需要在 options 中指定主题才会生效
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import ComponentTree from "@/plugin/FormDesign/component/componentTree";

export default {
  name: "Designer",
  components: {
    ComponentTree,
    draggable,
    configPanel,
    designItem,
    preview,
    codemirror,
  },
  props: {
    list: {
      type: Array,
      default: [],
    },
    formConfig: {
      type: Object,
      default: formConf,
    },
  },
  data() {
    return {
      data: [],
      dialogTableVisible: false,
      imgPath: require("../../../assets/image/common/no_data.png"),
      formConf: formConf,
      activeItem: {},
      lastActiveItem: {},
      formConfVisible: false,
      previewVisible: false,
      JSONVisible: false,
      itemList: [],
      activeName: "formConf",
      editorCode: "",
      viewCode: "",
      // 默认配置
      options: {
        tabSize: 2, // 缩进格式
        theme: "dracula", // 主题，对应主题库 JS 需要提前引入
        lineNumbers: true, // 显示行号
        line: true,
        styleActiveLine: true, // 高亮选中行
        hintOptions: {
          completeSingle: true, // 当匹配只有一项的时候是否自动补全
        },
      },
    };
  },
  mounted() {},
  methods: {
    updateJSON(jsonStr) {
      this.$emit("updateJSON", jsonStr);
    },
    // handleTreeClick() {
    //   this.dialogTableVisible = true
    //   let formData =  JSON.parse(JSON.stringify(this.list))
    //   this.$nextTick(() => {
    //     this.data = this.$refs.tree.json2TreeData(formData)
    //   })
    //
    // },
    upload(file) {
      console.log(file);
    },
    setting() {
      this.formConfVisible = true;
    },
    preview() {
      const clone = JSON.parse(JSON.stringify(this.list));
      this.itemList = clone;
      this.previewVisible = true;
    },
    viewJSON() {
      this.viewCode = this.generateCode();
      this.JSONVisible = true;
    },
    generateCode() {
      let json = {};
      json.config = this.formConf;
      json.list = this.list;
      return JSON.stringify(json, null, 4);
    },
    clear() {
      this.$confirm("此操作将清空整个表单,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      }).then(() => {
        this.$emit("clear");
      });
    },
    handlerActiveItemChange(obj) {
      this.lastActiveItem = this.activeItem;
      this.activeItem = obj;
    },
    handlerItemCopy(origin, parent) {
      if (isLayout(origin)) {
        //布局组件，需要复制布局组件以及下面的组件
        const clone = JSON.parse(JSON.stringify(origin));
        const uId = "row_" + getSimpleId();
        clone.id = uId;
        clone._id = uId;
        clone.columns.map((column) => {
          let itemList = [];
          column.list.map((item, i) => {
            const cloneitem = JSON.parse(JSON.stringify(item));
            const uId = "fd_" + getSimpleId();
            cloneitem.id = uId;
            cloneitem._id = uId;
            itemList.push(cloneitem);
          });
          column.list = [];
          column.list = itemList;
        });
        this.list.push(clone);
        this.handlerActiveItemChange(clone);
      } else {
        //如果是普通组件，需要判断他是否再布局组件下。
        if (parent) {
          parent.columns.map((column) => {
            if (column.list.some((item) => item.id === origin.id)) {
              const clone = JSON.parse(JSON.stringify(origin));
              const uId = "fd_" + getSimpleId();
              clone.id = uId;
              clone._id = uId;
              column.list.push(clone);
              this.handlerActiveItemChange(clone);
            }
          });
        } else {
          const clone = JSON.parse(JSON.stringify(origin));
          const uId = "fd_" + getSimpleId();
          clone.id = uId;
          clone._id = uId;
          this.list.push(clone);
          this.handlerActiveItemChange(clone);
        }
      }
    },
    handlerItemDelete(origin, parent) {
      //如果不是布局组件，则先判断是不是再布局内部，如果不是，则直接删除就可以，如果是，则要在布局内部删除
      if (parent) {
        parent.columns.map((column, index) => {
          const colIndex = column.list.findIndex(
              (item) => item.id === origin.id
          );
          if (colIndex > -1) {
            column.list.splice(colIndex, 1);
          }
        });
      } else {
        const index = this.list.findIndex((item) => item.id === origin.id);
        this.list.splice(index, 1);
      }
      this.activeItem = {};
    },
    handlerSaveFormConf() {
      this.formConfVisible = false;
    },
    handlerRollBack(rowItem, oldIndex) {
      //还原
      this.list.splice(oldIndex, 0, rowItem);
    },
    handlerSetJson() {
      this.$emit("updateJSON", this.viewCode);
      this.JSONVisible = false;
    },
  },
  computed: {
    infoShow() {
      return this.list.length < 1;
    },
  },
  watch: {
    activeItem(newValue, oldValue) {
      this.lastActiveItem = oldValue;
    },
  },
};
</script>
<style scoped lang="scss">
.action-bar {
  display: flex;
  justify-content: right;
}
.reset {
  margin-right: 10px;
  @include resetBtn;
}
.mainBtn {
  @include primaryBtn;
}
.el-rate {
  display: inline-block;
}
/deep/ .CodeMirror {
  height: 600px !important;
}
.center-scrollbar /deep/ .el-scrollbar__bar.is-horizontal {
  display: none;
}
.center-scrollbar /deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
.empty-info /deep/ .el-empty__description p {
  color: #fff;
  font-size: 16px;
}
</style>
<style lang="scss">
.el-tree-node__content {
  height: 45px;
}
@import "../style/designer";
</style>
<style>
@import "../style/designer.css";
</style>
