<template>
  <div>
    <el-dialog
      title="表单详情"
      :visible.sync="visible"
      fullscreen
      top="1vh"
      width="90%"
      @close="close"
      custom-class="dialogVisibleEdit"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
    >
      <!-- <DatePicker
        :showTime="{ format: 'HH:mm' }"
        format="YYYY-MM-DD HH:mm"
      ></DatePicker> -->
      <div class="dialogVisible2-main">
        <div class="ProjectForm-title">
          <div class="detail-title">
            <div class="detail-title-item">
              <span class="detail-title-item-label">表单编码:</span>
              <span>{{ formMsg.formCode }}</span>
            </div>
            <div class="detail-title-item">
              <span class="detail-title-item-label">表单名称:</span>
              <span>{{ formMsg.formName }}</span>
            </div>
            <div class="detail-title-item">
              <span class="detail-title-item-label">项目名称:</span>
              <span
                >{{ formMsg.projectName }}-{{
                  formMsg.applicationName
                }}</span
              >
            </div>
            <div class="detail-title-item">
              <span class="detail-title-item-label">创建人:</span>
              <span>{{ formMsg.creatorName }}</span>
            </div>
            <div class="detail-title-item">
              <span class="detail-title-item-label">创建时间:</span>
              <span>{{ formMsg.createTime }}</span>
            </div>
            <div class="detail-title-item">
              <span class="detail-title-item-label">版本个数:</span>
              <span>{{ formMsg.versionNum }}</span>
            </div>
          </div>
          <div class="detail-title-item-button">
            <el-button class="primary" type="primary" @click="editForm()"
              >编辑</el-button
            >
            <el-button class="primary" type="primary" @click="deleteRow()"
              >删除</el-button
            >
          </div>
        </div>
        <div>
          <div class="optionV">
            <el-select v-model="selectedVersion" placeholder="请选择">
              <el-option
                v-for="item in versionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="fromEdit">
          <!-- <preview
            :itemList="itemList"
            :formConf="formConf"
            v-if="dialogVisible2"
          ></preview> -->
          <FormPreview :formTree="formTree" :disabled="false"> </FormPreview>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="引入工作流"
      :visible.sync="dialogVisible1"
      :close-on-click-modal="false"
      width="35%"
      custom-class="dialogVisible1"
      :close-on-press-escape="false"
    >
      <div>
        <div class="from-item">
          <span>应用项目</span>
          <el-select v-model="postData.ascription" placeholder="请选择应用项目">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="from-item">
          <span>表单类型</span>
          <el-select v-model="postData.business" placeholder="请选择表单类型">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="from-item">
          <span>表单名称</span>
          <el-input
            v-model="postData.name"
            placeholder="请输入表单名称"
          ></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="nextDiolog()" type="primary">确认</el-button>
        <el-button @click="dialogVisible1 = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import formBpmnEdit from './formBpmnEdit.vue';
import preview from '@/plugin/FormDesign/component/preview';
import FormPreview from '@/component/FormPreview.vue';
import {
  postFormDesignRecordFormDesignRecordInfo,
  postFormDesignServiceRealiseProcessData,
} from '@/api/unit/api.js';
import Preview from '@/plugin/FormDesign/component/preview';
import { mapState } from 'vuex';
import {
  fetchFormVersionList,
  fetchFormVersion,
  deleteFormVersion,
} from '../../../api/workflowForm';
import { DatePicker } from 'ant-design-vue';

export default {
  components: {
    Preview,
    formBpmnEdit,
    preview,
    FormPreview,
    DatePicker,
  },
  props: {
    tileText: {
      type: String,
      default: '',
    },
    formDatas: {
      type: Object,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogVisible1: false,
      postData: {
        ascription: '',
        business: '',
        systemType: '',
        name: '',
      },
      input: '',
      options1: [],
      options2: [],
      options3: [],
      versionList: [],
      selectedVersion: '',
      formScheam: '',
      formTree: {},
      selectedForm: {},
      formMsg: {}
    };
  },
  watch: {
    formDatas: {
      deep: true,
      async handler(value) {
        this.formMsg = value
        await this.getFormVersionList();
        this.setDefaultSelectedVersion();
      },
    },
    selectedVersion(newVal, oldVal) {
      if (!newVal) return;
      if (newVal === oldVal) return;
      this.formTree = this.versionList.find(
        ({ value }) => value === newVal
      ).formTree;
    },
    visible: {
      handler(val) {
        if (val) {
          this.setDefaultSelectedVersion();
        }
      },
    },
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
  },
  methods: {
    close() {
      this.formTree = {};
      this.selectedVersion = '';
      this.$emit('handleCloseDetail');
    },
    async getFormVersionList() {
      const { data, code, msg } = await fetchFormVersionList({
        formId: this.formDatas.formId,
        limit: 9999,
        page: 1,
      });
      if (code !== '200') {
        this.$message.error(msg);
        return;
      }
      this.versionList = data.dataList.map(
        ({ formVersion, formVersionTag, formVersionId, formVersionFile }) => {
          return {
            label: `${formVersionTag}_${formVersion}`,
            value: formVersionId,
            formTree: JSON.parse(formVersionFile),
          };
        }
      );
    },

    setDefaultSelectedVersion() {
      if (this.versionList.length <= 0) return;
      this.selectedVersion = this.versionList[0].value;
    },

    async getFormVersionInfo() {
      const { data, code, msg } = await fetchFormVersion({
        formVersionId: this.selectedVersion,
      });
      if (code !== '200') {
        this.$message.error(msg);
        return;
      }
      this.selectedForm = { ...data, formName: this.formDatas.formName };
    },

    deleteRow() {
      this.$confirm('表单删除不可恢复, 请确认是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning',
      })
        .then(async () => {
          const { code, msg } = await deleteFormVersion({
            formVersionId: this.selectedVersion,
          });
          if (code !== '200') {
            this.$message.error(msg);
            return;
          }
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          this.formMsg.versionNum -= 1
          // this.$emit('deleteSuccsee');
          await this.getFormVersionList();
          if (this.versionList.length <= 0) {
            this.$emit('deleteSuccsee');
          } else {
            this.setDefaultSelectedVersion();
          }
        })
        .catch(() => {});
    },
    async editForm() {
      await this.getFormVersionInfo();
      this.$emit('editForm', this.selectedForm, this.tileText);
    },
    nextDiolog() {
      const xml = this.$refs.formbpmn.importData();
      xml.id = 'form_' + Date.parse(new Date());
      var file1 = new File([JSON.stringify(xml)], 'test.json', {
        type: 'text/xml',
      });
      let formData = new FormData();
      formData.append('name', this.postData.name);
      formData.append('docName', this.postData.name + '.json');
      formData.append('ascription', this.postData.ascription);
      formData.append('code', xml.id);
      formData.append('business', this.postData.business);
      formData.append('status', 'enabled');
      formData.append('createBy', this.userInfo.account);
      formData.append('createName', 'admin');
      formData.append('tenantId', this.tenantId);
      formData.append('file', file1);
      postFormDesignServiceRealiseProcessData(formData).then((res) => {
        this.$message.success('发布至可用表单成功');
        this.dialogVisible1 = false;
      });
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .dialogVisibleEdit {
  width: 100% !important;
}

.primary {
  @include primaryBtn;
}

.from-item {
  display: flex;
  margin-bottom: 20px;
  text-align: center;
}

.from-item > span {
  width: 100px;
  height: 40px;
  line-height: 40px;
}

.form-title {
  border-bottom: 1px solid #cccccc;
  margin-bottom: 40px;
}

.title-item {
  display: inline-block;
  margin-bottom: 20px;
}

.title-item-label {
  margin-right: 15px;
}

.title-item-main {
  display: inline-block;
}

.detail-title {
  color: white;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  align-items: center;
}

.detail-title-item {
  margin-right: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-title-item-label {
  display: inline-block;
  margin-right: 10px;
}

.detail-title-item-button {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-bottom: 20px;
}

.optionV {
  margin-top: 10px;
  display: inline-block;
}

.fromEdit {
  overflow-x: hidden;
  overflow-y: auto;
  height: 660px;
  margin-top: 20px;
}

.ProjectForm-title {
  display: flex;
  border-bottom: 1px solid #cccccc;
  justify-content: space-between;
}
</style>

<style lang="scss">
.btn-custom-cancel {
  @include cancelbutton;
}
</style>
