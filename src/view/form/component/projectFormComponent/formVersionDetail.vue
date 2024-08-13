<template>
  <div v-if="dialogVisible">
    <el-dialog
      title="表单详情"
      :visible.sync="dialogVisible"
      fullscreen
      top="1vh"
      width="90%"
      @close="close"
      custom-class="dialogVisibleEdit"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
    >
      <div class="dialogVisible2-main">
        <div class="ProjectForm-title">
          <div class="detail-title">
            <div class="detail-title-item">
              <span class="detail-title-item-label">表单名称:</span>
              <span>{{ formDatas.formName }}</span>
            </div>
            <div class="detail-title-item">
              <span class="detail-title-item-label">创建人:</span>
              <span>{{ formDatas.creatorName }}</span>
            </div>
            <div class="detail-title-item">
              <span class="detail-title-item-label">创建时间:</span>
              <span>{{ formDatas.createTime }}</span>
            </div>
            <div class="detail-title-item">
              <span class="detail-title-item-label">表单版本:</span>
              <span
                >{{ formDatas.formVersionTag }}-{{
                  formDatas.formVersion
                }}</span
              >
            </div>
          </div>
        </div>
        <div class="fromEdit">
          <FormPreview :formTree="formTree" :disabled="false"> </FormPreview>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import FormPreview from '@/component/FormPreview.vue';
export default {
  name: 'formVersionDetail',
  components: {
    FormPreview,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    formDatas: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    formTree() {
      return JSON.parse(this.formDatas.formVersionFile);
    },
    dialogVisible() {
      return this.visible;
    },
  },
  methods: {
    close() {
      this.$emit('closeDetail');
    },
  },
};
</script>
<style lang="scss" scoped>
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
  margin-top: 20px;
  padding-bottom: 20px;
}
</style>
