<template>
  <div class="configuration">
    <el-tabs @tab-click="tabClick" v-model="activeName" type="border-card">
      <el-tab-pane label="访问配置" name="first">
        <div class="selectBox">
          <el-select
            @change="valChange"
            v-model="business"
            placeholder="请选择"
          >
            <el-option
              v-for="item in projectOption"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </div>
        <div style="display: flex; justify-content: flex-end">
          <div
            class="buttonTab"
            v-if="activeName === 'first'"
            @click="showDiolog"
            v-role="{ id: 'VisitCallAdd', type: 'button', business: business }"
          >
            新增第三方接口
          </div>
        </div>
        <visitCall
          v-if="activeName === 'first' && permissionRole"
          ref="first"
          @editTable="editTable()"
          @deleteTable="deleteTable()"
          :business="business"
        ></visitCall>
        <permission v-if="!permissionRole"></permission>
      </el-tab-pane>
      <el-tab-pane label="业务配置" name="second">
        <businessCall
          v-if="activeName === 'second' && permissionRole"
          ref="second"
        ></businessCall>
        <permission v-if="!permissionRole"></permission>
      </el-tab-pane>
      <el-tab-pane label="启动项配置" name="third">
        <StartItemConfig
          v-if="activeName === 'third' && permissionRole"
          ref="third"
        />
        <permission v-if="!permissionRole"></permission>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import visitCall from "./visitCall/index.vue";
import businessCall from "./businessCall/index.vue";
import StartItemConfig from "@/view/configuration/startItemConfig";
import permission from "@/component/permission/index.vue";
import { getProjectList } from "@/api/globalConfig";
import { mapState } from "vuex";
export default {
  data() {
    return {
      projectOption: [],
      activeName: "first",
      business: "",
      activeNameMapping: {
        first: "VisitCall",
        second: "BusinessCall",
        third: "StartItemConfig",
      },
      permissionRole: true,
      jsonData: {
        total: 25,
        limit: 10,
        skip: 0,
        link: {
          previous: "LL",
          Evle: "KK",
        },
      },
    };
  },
  async mounted() {
    await this.getProjectList();
    await this.$refs.first.GetGlobalList(this.business);
  },
  computed: {
    ...mapState("account", ["userInfo", "tenantId"]),
  },
  methods: {
    tabClick() {
      if (this.activeName === "first") {
        this.$nextTick(() => {
          this.$refs.first.GetGlobalList(this.business);
        });
      }
    },
    valChange(val) {
      console.log(val);
      this.$refs.first.GetGlobalList(val);
    },
    async getProjectList() {
      let res = await getProjectList({
        count: -1,
        projectCode: "",
        tenantId: this.tenantId,
        type: "",
        menuRoute: this.$route.name,
        account: JSON.parse(sessionStorage.getItem("loginData")).account,
      });
      this.projectOption = res?.result ?? [];
      this.business = this.projectOption[0]?.code;
      this.changeActiveName("first");
      this.$nextTick(() => {
        this.$refs.first.GetGlobalList(this.business);
      });
    },
    changeActiveName(value) {
      this.activeName = value;
      let { permissions } = JSON.parse(sessionStorage.getItem("loginData"));
      let proJectRole =
        permissions.filter((item) => {
          return item.projectCode === this.business;
        })[0]?.permissionSet || [];
      let findEle = proJectRole.findIndex((item) => {
        return item.frontRoute === this.activeNameMapping[value];
      });
      if (findEle === -1) {
        this.permissionRole = false;
      } else {
        this.permissionRole = true;
      }
    },
    showDiolog() {
      this.$refs[this.activeName].$refs.guide.dialogVisible = true;
      if (this.activeName === "first") {
        this.$refs[this.activeName].$refs.guide.form = {
          source: "",
          sourceMark: "",
        };
      }
    },
    editTable() {
      this.$refs[this.activeName].$refs.visitDiolog.dialogVisible2 = true;
    },
    deleteTable() {
      this.$confirm("删除不可恢复, 请确认是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {});
    },
  },
  components: {
    visitCall,
    businessCall,
    StartItemConfig,
    permission,
  },
};
</script>

<style scoped>
.btnContainer {
  width: 100%;
  display: flex;
  justify-content: right;
}
.buttonTab {
  cursor: pointer;
  font-size: 14px;
  color: #009efb;
  margin: 15px 0;
  width: 138px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #009efb;
  border-radius: 4px;
}

.configuration {
  padding: 20px;
  height: 90.7vh;
}

.home-main {
  position: relative;
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

.projectHeader {
  display: inline-block;
  margin: 15px 0px 15px 0px;
}
</style>

<style lang="scss">
.btn-custom-cancel {
  @include cancelbutton;
}
</style>
