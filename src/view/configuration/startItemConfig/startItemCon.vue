<template>
  <div>
    <el-dialog
        :close-on-click-modal="false"
        title="自定义启动"
        :visible.sync="dialogVisible2"
        v-if="dialogVisible2"
        width="30%"
        append-to-body
    >
      <div id="item">
        <p class="tit">自定义启动项</p>
        <el-tag
          v-for="tag in tags"
          :key="tag.name"
          closable
          @close="handleClose(tag)"
          :class="'bg' + tag.backGroundColorIndex"
        >
          {{ tag.name }}
        </el-tag>
        <div style="display: flex; margin-top: 15px">
          <el-input v-model="inputValue"></el-input>
          <div class="addDefine" @click="handleInputConfirm" type="primary">
            新增
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="savebtn" type="primary" @click="saveTag"
          >保 存</el-button
        >
        <el-button class="cancelbtn" @click="dialogVisible2 = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="启动项配置"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="80%"
      fullscreen
      append-to-body
    >
      <div class="start_container">
        <div class="start_left">
          <el-tree
            @node-click="handleNodeClick"
            class="tree"
            default-expand-all
            :data="data"
            :props="defaultProps"
          ></el-tree>
        </div>
        <div class="start_right">
          <p>自定义启动项</p>
          <div v-if="!tableData.length" class="tip_content">
            当前未配置自定义启动项
          </div>
          <div class="selfDefine" v-if="footFlag" @click="showSelf">自定义</div>
          <!--          <el-button @click="editTable" v-if="btnFlag && tableData.length" style="margin-left: 960px" type="primary"-->
          <!--                     v-role="{ id: 'StartItemConfigEdit', type: 'button', business: business }">编辑-->
          <!--          </el-button>-->
          <el-table
            v-if="tableFlag && tableData.length > 0"
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column
              align="center"
              prop="name"
              label="启动项"
              width="180"
            >
            </el-table-column>
            <el-table-column align="center" prop="" label="Code" width="180">
              <template slot-scope="scope">
                <el-input
                  @blur="codeChange(scope.row.code)"
                  :disabled="scope.row.disabled"
                  v-model="scope.row.code"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop=""
              label="启动类型"
              width="240"
            >
              <template slot-scope="scope">
                <el-input
                  v-show="scope.row.startType === '1'"
                  :disabled="scope.row.disabled"
                  v-model="scope.row.value"
                ></el-input>
                <el-select
                  v-show="scope.row.startType === '2'"
                  :disabled="scope.row.disabled"
                  v-model="scope.row.thirdInterfaceId"
                >
                  <el-option
                    v-for="(item, index) in optionsList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-date-picker
                  v-show="scope.row.startType === '3'"
                  :disabled="scope.row.disabled"
                  v-model="scope.row.value"
                  type="datetime"
                  default-time="00:00:00"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop=""
              label="启动类型选择"
              width="420"
            >
              <template slot-scope="scope">
                <el-radio
                  @change="radioChange"
                  :disabled="scope.row.disabled"
                  v-model="scope.row.startType"
                  label="1"
                >
                  输入框
                </el-radio>
                <el-radio
                  @change="radioChange"
                  :disabled="scope.row.disabled"
                  v-model="scope.row.startType"
                  label="2"
                >
                  下拉框
                </el-radio>
                <el-radio
                  @change="radioChange"
                  :disabled="scope.row.disabled"
                  v-model="scope.row.startType"
                  label="3"
                >
                  日期时间
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="" label="配置" width="100">
              <template slot-scope="scope">
                <el-checkbox
                  :disabled="scope.row.disabled"
                  v-model="scope.row.isSetting"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column align="center" width="100" prop="" label="必填">
              <template slot-scope="scope">
                <el-checkbox
                  @change="write(scope.row)"
                  :disabled="scope.row.disabled"
                  v-model="scope.row.isRequired"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              v-if="processFlag"
              prop=""
              label="操作"
            >
              <template slot-scope="scope">
                <span
                  @click="deleteRow(scope.row)"
                  style="color: #1d89ff; cursor: pointer; margin-right: 5px"
                  v-role="{
                    id: 'StartItemConfigDelete',
                    type: 'button',
                    business: business,
                  }"
                  >删除</span
                >
                <span
                  @click="editTable(scope.row, scope.row.btnTxt)"
                  style="color: #1d89ff; cursor: pointer"
                  v-if="btnFlag && tableData.length"
                  >{{ scope.row.btnTxt }}</span
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getThirdInterfaceList,
  selectProcessStartConfigList,
  startConfig,
  checkIsReferenced,
  startConfigUpdate,
  startConfigDelete,
} from "@/api/globalConfig";

import FormTypeEnum from "@/enum/FormTypeEnum";
import StartItemEnum from "@/enum/StartItemEnum";
import { mapState } from "vuex";

export default {
  name: "startItemCon",
  props: {
    footFlag: {
      type: Boolean,
      default: true,
    },
    businessData: {
      type: Object,
    },
  },
  data() {
    return {
      deleteIds: [],
      processFlag: true,
      btnFlag: false,
      tableFlag: false,
      tableData: [],
      inputValue: "",
      businessConfigId: "",
      tags: [],
      dialogVisible: false,
      dialogVisible2: false,
      data: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      business: "",
      tempArr: [],
      optionsList: [],
      currentId: null,
    };
  },
  computed: {
    ...mapState("account", ["userInfo", "tenantId"]),
  },
  mounted() {
    getThirdInterfaceList({
      tenantId: this.tenantId,
      ascription: this.businessData.code,
    }).then((res) => {
      this.optionsList = res.result;
    });
  },
  methods: {
    codeChange(value) {
      if (value.length < 1 || value.length > 100) {
        this.$message({
          type: "warning",
          message: "编码长度必须大于0小于100字符",
        });
      }
    },
    deleteRow(row) {
      if (row.id) {
        startConfigDelete({
          id: row.id,
          tenantId: this.tenantId,
          ascription: this.businessData.code,
        }).then((res) => {
          if (res.result) {
            this.$message({
              type: "success",
              message: res.result,
            });
          } else {
            this.$message({
              type: "success",
              message: "删除成功",
            });
          }

          if (this.processFlag) {
            if (row.id) {
              this.deleteIds.push(row.id);
            }
          }
        });
      }
      if (!res.result) {
        this.tableData.splice(
          this.tableData.findIndex((item) => item.id === row.id),
          1
        );
      }
    },
    write(data) {
      if (data.isRequired) {
        data.isSetting = true;
      }
    },
    radioChange(val) {
      if (val === FormTypeEnum.FORM_TYPE_SELECT) {
        getThirdInterfaceList({
          tenantId: this.tenantId,
          ascription: this.businessData.code,
        }).then((res) => {
          this.optionsList = res.result;
        });
      }
    },
    formatData(data) {
      data.forEach((item) => {
        item.isSetting
          ? (item.isSetting = StartItemEnum.SURE_SETTING)
          : (item.isSetting = StartItemEnum.NOT_SETTING);

        item.isRequired
          ? (item.isRequired = StartItemEnum.SURE_REQUIRED)
          : (item.isRequired = StartItemEnum.NOT_SETTING);

        item.startType = +item.startType;
      });
    },
    checkCodeIsNull() {
      return this.tableData.every((table) => table.code);
    },
    checkCodeIsRepeat(data) {
      return (
        data.map((item) => item.code).length ===
        new Set(data.map((item) => item.code)).size
      );
    },
    saveStart() {
      if (this.checkCodeIsNull()) {
        this.formatData(this.tableData);
        if (this.checkCodeIsRepeat(this.tableData)) {
          startConfig({
            businessConfigId: this.businessConfigId,
            list: this.tableData,
            ascription: this.businessData.code,
            deleteIds: this.deleteIds,
            tenantId: this.tenantId,
          }).then((res) => {
            this.$message({
              type: "success",
              message: "保存成功",
            });
          });
          this.dialogVisible = false;
        } else {
          this.$message({
            type: "warning",
            message: "当前添加启动项列表中存在code重复,请重新填写提交",
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "当前提交的启动项中存在code为空、请检查填写code提交",
        });
      }
    },
    handleNodeClick(data) {
      this.processFlag = true;
      this.currentId = data.id;
      this.businessConfigId = data.id;
      selectProcessStartConfigList(data.id, +this.tenantId).then((res) => {
        res.result.forEach((item) => {
          item.disabled = true;
          item.startType = item.startType + "";
          item.isSetting = !!item.isSetting;
          item.isRequired = !!item.isRequired;
        });
        res.result.forEach((item) => {
          item["btnTxt"] = "编辑";
        });
        this.tableFlag = true;
        this.tableData = res.result;
      });
    },
    // 检查引用
    checkIsReferenced(data) {
      checkIsReferenced({
        ascription: this.data[0].code,
        startConfigId: data.id,
        tenantId: data.tenantId,
      }).then((res) => {
        if (res.result) {
          this.$message({
            type: "warning",
            message: "此启动项被引用请慎重编辑！",
          });
        }
      });
    },
    editTable(row, txt) {
      if (row.btnTxt === "编辑" && row.id) {
        this.checkIsReferenced(row);
      }
      row.btnTxt = "保存";
      this.processFlag = true;
      row.disabled = false;
      if (txt === "保存") {
        row.isSetting
          ? (row.isSetting = StartItemEnum.SURE_SETTING)
          : (row.isSetting = StartItemEnum.NOT_SETTING);

        row.isRequired
          ? (row.isRequired = StartItemEnum.SURE_REQUIRED)
          : (row.isRequired = StartItemEnum.NOT_SETTING);
        if (row.code && (row.thirdInterfaceId || row.value)) {
          if (row.id) {
            // 走修改接口
            row.updateBy = this.userInfo.account;
            startConfigUpdate(row).then((res) => {
              this.$message({
                type: "success",
                message: "修改成功",
              });
            });
          } else {
            // 走新建接口
            startConfig(row).then((res) => {
              this.$message({
                type: "success",
                message: "创建成功",
              });
            });
          }
        } else {
          this.$message({
            type: "warning",
            message: "code或启动类型不能为空！",
          });
        }
        row.disabled = true;
        row.btnTxt = "编辑";
        row.isSetting = !!row.isSetting;
        row.isRequired = !!row.isRequired;
      }
      // this.tableData.forEach(item => item.disabled = false)
    },
    saveTag() {
      if (this.tags.length) {
        this.dialogVisible2 = false;
        if (this.tableData.length) {
          this.tableData = this.tableData.concat(this.tags);
        } else {
          this.tableData = this.tags;
        }
        this.tableFlag = true;
        this.btnFlag = true;
      } else {
        this.$message({
          type: "warning",
          message: "没有可添加的启动项！",
        });
      }
    },
    showSelf() {
      this.tags = [];
      this.dialogVisible2 = true;
    },
    handleClose(tag) {
      this.tags.splice(
        this.tags.findIndex((item, index) => item.name === tag.name),
        1
      );
    },
    checkRepeat(inputValue) {
      return this.tableData.some((tag) => tag.name === inputValue);
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue.length > 0 && inputValue.length <= 100) {
        let index = parseInt(Math.random() * 5);
        if (inputValue) {
          if (this.checkRepeat(inputValue)) {
            this.$message({
              type: "warning",
              message: "启动项名称重复,请重新添加",
            });
          } else {
            this.tags.push({
              isUse: 0,
              createBy: this.userInfo.account,
              updateBy: this.userInfo.account,
              businessConfigId: this.currentId,
              code: "",
              tenantId: this.tenantId,
              thirdInterfaceId: null,
              value: null,
              name: this.inputValue,
              isSetting: true,
              isRequired: true,
              backGroundColorIndex: index,
              startType: "1",
              disabled: true,
              btnTxt: "编辑",
            });
          }
        }
        this.inputValue = "";
      } else {
        this.$message({
          type: "warning",
          message: "名称长度必须大于0字符小于100个字符",
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.savebtn {
  @include primaryBtn;
}

.cancelbtn {
  @include cancelBtn;
}

.addDefine {
  cursor: pointer;
  width: 78px;
  height: 32px;
  margin-left: 10px;
  line-height: 32px;
  margin-top: 3px;
  text-align: center;
  border: 1px solid #009efb;
  border-radius: 4px;
  color: #009efb;
}

.selfDefine {
  margin-bottom: 20px;
  cursor: pointer;
  width: 98px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border: 1px solid #009efb;
  border-radius: 4px;
  color: #009efb;
  margin-top: 10px;
}

#item /deep/ .el-input {
  width: 420px;
}

/deep/ .el-tag {
  margin-right: 10px;
  margin-top: 5px;
}

.tit {
  color: #fff;
}

.tip_content {
  width: 100%;
  height: 73px;
  line-height: 73px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: #212739;
}

.start_container {
  display: flex;
}

.start_right {
  width: 80%;
  padding: 10px;
  margin-left: 20px;
  border: 1px solid rgb(204, 204, 204);
}

.start_right button {
  margin-top: 20px;
}

.start_left {
  padding-left: 20px;
  width: 300px;
  height: 600px;
  border: 1px solid rgb(204, 204, 204);
}

.bg0 {
  background: #d4fdd9;
}

.bg1 {
  background: #d1ebfb;
}

.bg2 {
  background: #ffe5af;
}
.bg3 {
  background: #cccccc;
}

.bg4 {
  background: #d3ecef;
}

@include tree;
</style>