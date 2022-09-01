<template>
  <el-dialog
    title="第三方接口配置"
    :visible.sync="dialogVisible"
    width="65%"
    fullscreen
    top="1vh"
    append-to-body
    @close="visitColse"
  >
    <el-form ref="form" label-width="80px">
      <div class="top">
        <el-tooltip
          class="item"
          effect="dark"
          :content="currentRow[0] && currentRow[0].source"
          placement="top"
        >
          <el-form-item label="资源名称">
            <el-input
              disabled
              v-model="currentRow[0] && currentRow[0].source"
            ></el-input>
          </el-form-item>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          :content="currentRow[0] && currentRow[0].sourceMark"
          placement="top"
        >
          <el-form-item label="资源标识">
            <el-input
              disabled
              v-model="currentRow[0] && currentRow[0].sourceMark"
            ></el-input>
          </el-form-item>
        </el-tooltip>

        <div>
          <el-button
            @click="$emit('showAddOrEidtDailog', currentRow, 'edit')"
            type="primary"
            v-role="{ id: 'VisitCallEdit', type: 'button' }"
            >编辑
          </el-button>
          <el-button
            @click="deleteApis()"
            type="primary"
            v-role="{ id: 'VisitCallDelete', type: 'button' }"
            >删除
          </el-button>
        </div>
      </div>
      <div style="display: flex">
        <div class="container">
          <div class="content-wrapper">
            <el-tabs
              type="border-card"
              @tab-click="handleClick"
              v-model="editableTabsValue"
            >
              <el-tab-pane
                v-for="(item, index) in currentRow"
                :key="item.id"
                :name="String(index)"
              >
                <div slot="label"><long-text :content="item.name" /></div>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.name"
                  placement="top"
                >
                  <el-form-item label="api名称">
                    <el-input v-model="item.name" disabled></el-input>
                  </el-form-item>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.apiMark"
                  placement="top"
                >
                  <el-form-item label="api标识">
                    <el-input v-model="item.apiMark" disabled></el-input>
                  </el-form-item>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.host"
                  placement="top"
                >
                  <el-form-item label="主机地址">
                    <el-input v-model="item.host" disabled></el-input>
                  </el-form-item>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.path"
                  placement="top"
                >
                  <el-form-item label="访问路径">
                    <el-input v-model="item.path" disabled></el-input>
                  </el-form-item>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.type"
                  placement="top"
                >
                  <el-form-item label="api类型">
                    <el-select
                      v-model="item.type"
                      disabled
                      placeholder="请选择api类型"
                    >
                      <el-option
                        v-for="item in apiOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.method"
                  placement="top"
                >
                  <el-form-item label="请求类型">
                    <el-select
                      v-model="item.method"
                      disabled
                      placeholder="请选择api类型"
                    >
                      <el-option
                        v-for="item in methodsOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.headers"
                  placement="top"
                >
                  <el-form-item label="请求头">
                    <el-input disabled v-model="item.headers"></el-input>
                  </el-form-item>
                </el-tooltip>
                <div
                  class="params"
                  v-for="(config, idx) in item.configParams"
                  :key="idx"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="config.key"
                    placement="top"
                  >
                    <el-form-item label="参数key">
                      <el-input disabled v-model="config.key"></el-input>
                    </el-form-item>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="config.value"
                    placement="top"
                  >
                    <el-form-item label="参数value">
                      <el-input disabled v-model="config.value"></el-input>
                    </el-form-item>
                  </el-tooltip>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="cardBox">
          <p>解析参数</p>
          <div class="jsonViewer">
            <div v-for="(par, idx) in currentPars" :key="idx" class="params">
              <el-tooltip
                class="item"
                effect="dark"
                :content="par.key"
                placement="top"
              >
                <el-form-item label="参数key">
                  <el-input disabled v-model="par.key"></el-input>
                </el-form-item>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                :content="par.value"
                placement="top"
              >
                <el-form-item label="参数value">
                  <el-input disabled v-model="par.value"></el-input>
                </el-form-item>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { deleteApi } from "@/api/globalConfig";
import longText from "../../../component/LongText.vue";

export default {
  components: {
    longText,
  },
  name: "AddOrEidtDailog",
  props: {
    currentRow: Array,
  },
  data() {
    return {
      ascription: "",
      currentPars: [],
      activeName: "",
      form: {},
      editableTabsValue: "0",
      methodsOptions: [
        {
          value: "1",
          label: "POST",
        },
        {
          value: "2",
          label: "GET",
        },
      ],
      apiOptions: [],
      tabIndex: 2,
      dialogVisible: false,
    };
  },
  methods: {
    visitColse() {
      this.$parent.GetGlobalList(this.ascription);
    },
    handleClick(e) {
      this.editableTabsValue = e.index;
      this.currentPars = this.currentRow[this.editableTabsValue].parseParams;
      console.log(this.currentPars);
    },
    deleteApis() {
      this.$confirm("此操作将删除当前选中api,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
        beforeClose: (action, instance, done) => {
          // 取消回车确认事件
          if (action === "confirm") {
            (instance.$refs["confirm"].$el.onclick = function (e) {
              e = e || window.event;
              if (e.detail !== 0) {
                done();
              }
            })();
          } else {
            done();
          }
        },
      }).then(() => {
        let currentApi = this.currentRow[this.editableTabsValue];
        deleteApi(currentApi.id).then((res) => {
          this.currentRow.splice(+this.editableTabsValue, 1);
          this.editableTabsValue = "0";
          if (!this.currentRow.length) {
            this.dialogVisible = false;
          }
          this.$message({
            type: "success",
            message: "删除成功",
          });
        });
      });
    },
  },
  mounted() {
    this.ascription = this.currentRow && this.currentRow[0].ascription;
    this.this.currentPars = this.currentRow[this.editableTabsValue].parseParams;
  },
};
</script>

<style scoped lang="scss">
/deep/
  .content-wrapper
  .el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item.is-active {
  width: auto !important;
}

.content-wrapper {
  min-height: 100vh;
  margin-top: 40px;
  @include contentTab;
}

/deep/ .el-form-item {
  width: 80%;
  margin-right: 30px;
}

.el-select {
  width: 356px;
}

.top {
  display: flex;
}

.top /deep/ .el-form-item {
  width: 40%;
}

/deep/ .jsonViewer .jv-code {
  background-color: rgb(204, 204, 204);
  width: 600px;
  height: 600px;
}

.parse {
  margin-left: 40%;
}

.config_tit i {
  color: #409eff;
  font-size: 20px;
  margin-left: 10px;
}

.params {
  width: 100%;
  margin-top: 15px;
}

.params i {
  color: red;
  font-size: 20px;
}

.container {
  padding: 0 15px 0 10px;
  width: 50%;
}

.jsonViewer .params {
  width: 600px;
}

.jsonViewer {
  height: 550px;
  overflow-y: auto;
  overflow-x: hidden;
}

.container .cardBox {
  padding: 10px 0 10px 10px;
  box-sizing: border-box;
  border-radius: 0px;
  border: 1px solid #333333;
}

p {
  white-space: nowrap;
  text-align: left;
  font-size: 16px;
  font-weight: 700;
  font-style: normal;
  text-decoration: none;
  color: rgb(0, 102, 204);
}

p i,
p span {
  font-size: 22px;
}

p span {
  color: red;
}
</style>
