<template>
  <div class="PublicForm">
    <div class="PublicForm-title">
      <div class="datePick">
        <span class="datePickTitle">创建时间</span>
        <el-date-picker
          v-model="valueDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="——"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :clearable="false"
        >
        </el-date-picker>
        <span class="datePickTitle">表单</span>
        <el-input
          style="width: 260px"
          v-model="input"
          placeholder="请输入内容"
        ></el-input>
      </div>
      <div class="PublicForm-title-input">
        <el-button class="primary" type="primary" @click="getManyData()"
          >查询</el-button
        >
      </div>
    </div>
    <div class="PublicForm-title-button">
      <div class="boxBtn" @click="addForm(true, '新建表单')">新建表单</div>
    </div>
    <div class="content-wrapper">
      <el-tabs
        type="border-card"
        v-model="formStatus"
        @tab-click="changeActiveName"
      >
        <el-tab-pane name="enabled">
          <span slot="label">可用表单({{ getDataFirst.total }})</span>
          <div
            class="home-table-card"
            v-for="(item, index) in formListFirst"
            :key="index"
          >
            <div class="card-title">
              <span class="title">{{ item.numberCode }}</span>
              <span
                class="detailWord"
                @click="detailsDiolog(item)"
                v-role="{ id: 'FromLook', type: 'button' }"
                >详情</span
              >
            </div>
            <div class="card-main">
              <div class="card-main-item">
                <span class="label">表单名称:</span>
                <long-text contentStyle="color: white; width: 180px" :content="item.name" />
              </div>
              <div class="card-main-item">
                <span class="label">创建人:</span>
                <span class="value">{{
                  item.createBy == -1 ? "系统" : item.createBy
                }}</span>
              </div>
              <div class="card-main-item">
                <span class="label">创建时间:</span>
                <span class="value">{{ item.createTime }}</span>
              </div>
              <div class="card-main-item">
                <span class="label">发布次数:</span>
                <span class="value">{{ item.count }}</span>
              </div>
            </div>
          </div>
          <div class="noData" v-if="formListFirst.length === 0">暂无数据</div>
        </el-tab-pane>
        <el-tab-pane name="drafted">
          <span slot="label">草稿箱({{ getDataSecond.total }})</span>
          <div
            class="home-table-card"
            v-for="(item, index) in formListSecond"
            :key="index"
          >
            <div class="card-title">
              <span class="title">{{ item.numberCode }}</span>
              <span class="detailWord" @click="detailsDiolog(item)">详情</span>
            </div>
            <div class="card-main">
              <div class="card-main-item">
                <span class="label">表单名称:</span>
                <long-text contentStyle="color: white; width: 180px" :content="item.name" />
              </div>
              <div class="card-main-item">
                <span class="label">创建人:</span>
                <span class="value">{{ item.createBy }}</span>
              </div>
              <div class="card-main-item">
                <span class="label">创建时间:</span>
                <span class="value">{{ item.createTime }}</span>
              </div>
            </div>
          </div>
          <div class="noData" v-if="formListSecond.length === 0">暂无数据</div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <PublicFormDiolog
      ref="PublicFormDiolog"
      @addSuccess="addSuccess()"
      :formStatus="formStatus"
    ></PublicFormDiolog>
    <detailsDiolog
      tileText="编辑表单"
      ref="detailsDiolog"
      quote="delete"
      :formDatas="formData"
      @editForm="editForm"
      :status="formStatus"
      ascription="public"
      @deleteSuccsee="deleteSuccsee()"
    ></detailsDiolog>
  </div>
</template>

<script>
import PublicFormDiolog from "./PublicFormComponent/index.vue";
import detailsDiolog from "./details.vue";
import longText from "../../../component/LongText.vue";
import {
  postFormDesignRecordDraftInfo,
  postFormDesignBasicFormRecord,
  postFormDesignRecordFormDesignRecordInfo,
} from "@/api/unit/api.js";
import { mapState } from "vuex";
import { currentOneMonthAgo } from "@/util/date";
export default {
  data() {
    const { start, end } = currentOneMonthAgo("yyyy-MM-DD HH:mm:ss");
    return {
      formData: {},
      valueDate: [start, end],
      input: "",
      formStatus: "enabled",
      formListFirst: [],
      formListSecond: [],
      getDataFirst: {
        page: 1,
        limit: 9999999,
        total: 0,
      },
      getDataSecond: {
        page: 1,
        limit: 9999999,
        total: 0,
      },
    };
  },
  computed: {
    ...mapState("account", ["userInfo", "tenantId"]),
  },
  methods: {
    // 查询草稿箱
    getDraftData() {
      this.valueDate = this.valueDate || [];
      postFormDesignRecordDraftInfo({
        tenantId: this.tenantId,
        status: "drafted",
        ascription: "public",
        business: "",
        createBy: this.userInfo.account,
        numberCode: "",
        name: this.input,
        startTime: this.valueDate[0] + " 00:00:00",
        endTime: this.valueDate[1] + " 23:59:59",
        ...this.getDataSecond,
      }).then((res) => {
        this.formListSecond = res.result.dataList;
        this.getDataSecond.total = res.result.count;
      });
    },
    // 查询公共表单
    getEnableData() {
      this.valueDate = this.valueDate || [];
      postFormDesignBasicFormRecord({
        tenantId: this.tenantId,
        status: "enabled",
        ascription: "public",
        business: "",
        createBy: this.userInfo.account,
        numberCode: "",
        name: this.input,
        startTime: this.valueDate[0] + " 00:00:00",
        endTime: this.valueDate[1] + " 23:59:59",
        ...this.getDataFirst,
      }).then((res) => {
        this.formListFirst = res.result.dataList;
        this.getDataFirst.total = res.result.count;
      });
    },

    getManyData() {
      this.getEnableData();
      this.getDraftData();
    },

    getData() {
      switch (this.formStatus) {
        case "enabled":
          this.getEnableData();
          break;
        case "drafted":
          this.getDraftData();
          break;
        default:
          break;
      }
    },

    changeActiveName() {
      this.getManyData();
    },

    deleteSuccsee() {
      this.$refs.detailsDiolog.dialogVisible2 = false;
      this.getManyData();
    },

    addSuccess(value) {
      this.$refs.PublicFormDiolog.dialogVisible2 = false;
      this.$refs.detailsDiolog.dialogVisible2 = false;
      this.getManyData();
    },

    addForm(item, tileText) {
      if (typeof item === "boolean") {
        this.$refs.PublicFormDiolog.tit = tileText;
        this.$refs.PublicFormDiolog.postData.name = "";
      } else {
        this.$refs.PublicFormDiolog.dialogVisible2 = true;
        let content = JSON.parse(item.content);
        this.$nextTick(() => {
          this.$refs.PublicFormDiolog.tit = tileText;
          this.$refs.PublicFormDiolog.$refs.formDesigner.designList =
            content.list;
          this.$refs.PublicFormDiolog.$refs.formDesigner.formConfig =
            content.config;
          this.$refs.PublicFormDiolog.postData = {
            ascriptionName: "",
            ascName: this.$getMappingName(item.business),
            ...item,
          };
        });
      }
      this.$refs.PublicFormDiolog.dialogVisible2 = true;
    },
    detailsDiolog(item) {
      postFormDesignRecordFormDesignRecordInfo({
        id: item.id,
        status: this.formStatus,
        tenantId: this.tenantId,
        ascription: "public",
        business: "",
        createBy: this.userInfo.account,
      }).then((res) => {
        this.$refs.detailsDiolog.dialogVisible2 = true;
        this.formData = res.result;
        this.$nextTick(() => {
          let arr = [];
          res.result.versions.forEach((item, index) => {
            arr.push({
              value: res.result.childIds[index],
              label: item,
            });
          });
          this.$refs.detailsDiolog.options = arr;
          this.$refs.detailsDiolog.value = res.result.childIds[0];
          this.$refs.detailsDiolog.getAllBusinessConfig(res.result);
        });
      });
    },
    editForm(item, tileText) {
      this.addForm(item, tileText);
    },
  },
  components: {
    PublicFormDiolog,
    detailsDiolog,
    longText,
  },
  created() {
    this.getEnableData();
    this.getDraftData();
  },
};
</script>

<style scoped lang="scss">
/deep/ .el-tabs__content {
  padding: 50px 20px;
}
.noData {
  color: #fff;
}
.content-wrapper {
  min-height: 100vh;
  margin-top: 40px;
  @include contentTab;
}
.primary {
  @include primaryBtn;
}
.boxBtn {
  font-size: 14px;
  color: #009efb;
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #009efb;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 20px;
}

.datePick {
  display: inline-block;
  margin-top: 15px;
}
.datePickTitle {
  width: 56px;
  height: 14px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  line-height: 20px;
  margin-right: 10px;
  margin-left: 10px;
}
.PublicForm-title-input {
  display: inline-block;
  margin-left: 40px;
}
.PublicForm-title-button {
  display: flex;
  justify-content: right;
}
.home-main {
  margin-top: 40px;
}

.home-main-tab {
  display: flex;
}

.home-main-tab-item {
  color: #9f9fa0;
  display: inline-block;
  height: 60px;
  width: 200px;
  line-height: 60px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
}

.active {
  background-color: #030303;
  color: white;
  font-weight: 600;
  border-top: 2px solid #176cf4;
}

.home-table {
  min-height: 786px;
  border: 1px solid #666666;
  margin-bottom: 40px;
  padding: 20px 20px;
}

.home-table-card {
  border: 1px solid #666666;
  min-height: 170px;
  display: inline-block;
  width: 310px;
  margin-right: 40px;
  margin-bottom: 40px;
}
.card-title {
  height: 30px;
  line-height: 30px;
  background-color: #212739;
  color: #fff;
  padding: 0px 20px;
}
.card-title .title {
  font-size: 14px;
}
.card-title .detailWord {
  float: right;
  color: #0dd5ef;
  font-size: 14px;
  cursor: pointer;
}
.card-main {
  display: inline;
  padding: 10px 10px;
}
.card-main-item {
  line-height: 40px;
  height: 40px;
  font-size: 14px;
}
.card-main-item .label {
  display: inline-block;
  width: 90px;
  vertical-align: top;
  color: #999999;
}
.card-main-item .value {
  width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: top;
  color: #fff;
}
</style>
