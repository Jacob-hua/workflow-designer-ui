<template>
  <div class="bpmn-wrapper">
    <bpmn-editor
      :id="projectData.processId"
      :name="projectData.processName"
      :desc="projectData.processDesc"
      :xml="projectData.processFile"
      :generateIdFunc="fetchUUID"
      :prop="{
        bpmnRenderer: {
          defaultFillColor: 'none',
          defaultStrokeColor: '#666666',
          defaultLabelColor: '#666666',
        },
      }"
      @loaded="onEditorLoaded"
    />
    <bpmn-properties-panel
      ref="propertiesPanel"
      :iBpmnModeler="iBpmnModeler"
      :projectData="projectData"
      :lazyLoadUser="fetchUser"
      @getBaseInfo="getBaseInfo"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { postPersonUser } from '../api/unit/api';
import { getGlobalUUID } from '../api/globalConfig';
import IBpmnModeler from '../plugin/Bpmn/IBpmnModeler';

function users2CascaderData(data) {
  if (Array.isArray(data)) {
    return data.map(users2CascaderData);
  }
  return {
    value: data.userId,
    label: `${data.firstName} ${data.lastName}`,
  };
}

export default {
  name: 'bpmnDesigner',
  props: {
    projectData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      iBpmnModeler: new IBpmnModeler(),
      userGroup: [],
      rootBaseInfo: {
        processName: '',
        processId: '',
      },
    };
  },
  computed: {
    ...mapState('account', ['tenantId', 'currentOrganization']),
  },
  methods: {
    onEditorLoaded(iBpmnModeler) {
      this.iBpmnModeler = iBpmnModeler;
      this.$emit('loaded', iBpmnModeler);
    },
    async fetchUser({ value }) {
      try {
        const { errorInfo, result } = await postPersonUser({
          groupId: value,
          limit: 999999,
          name: '',
          page: 1,
          tenantId: this.tenantId,
          userId: 'admin',
        });
        if (errorInfo.errorCode) {
          return [];
        }
        return users2CascaderData(result?.dataList ?? []);
      } catch (error) {
        return [];
      }
    },
    async fetchUUID() {
      try {
        const { errorInfo, result } = await getGlobalUUID();
        if (errorInfo.errorCode) {
          return;
        }
        return result;
      } catch (error) {
        return;
      }
    },
    getBaseInfo(rootBaseInfo) {
      this.rootBaseInfo = rootBaseInfo;
      this.$emit('getRootInfo', this.rootBaseInfo);
    },
  },
};
</script>

<style scoped lang="scss">
.bpmn-wrapper {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
}
</style>
