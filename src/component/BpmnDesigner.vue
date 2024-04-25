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
  mounted() {
    this.$nextTick(() => {
      this.initlistenDomChanged();
    });
  },
  methods: {
    listenObserver() {
      const shapeInfo = this.iBpmnModeler.getSelectedShapeInfo()
      const domParent = document.getElementsByClassName('djs-container')[0]
      const dom = document.getElementsByClassName('djs-popup bpmn-replace')[0]
      const domSt = document.getElementsByClassName('bpmn-icon-screw-wrench')[0]
      const rect = domSt?.getBoundingClientRect();
      if (dom && shapeInfo.$type !== 'bpmn:ExclusiveGateway') {
        const innerDom = dom.getElementsByClassName('djs-popup-body')[0]
        const headers = dom.getElementsByClassName('djs-popup-header')[0]
        const loopDom = headers?.getElementsByClassName('bpmn-icon-loop-marker')[0]
        const parallelDom = headers?.getElementsByClassName('bpmn-icon-parallel-mi-marker')[0]
        const sequentialDom = headers?.getElementsByClassName('bpmn-icon-sequential-mi-marker')[0]
        if (innerDom) innerDom.style.display = 'none'
        if (loopDom) loopDom.style.display = 'none'
        if (parallelDom) parallelDom.innerHTML = '并行'
        if (sequentialDom) sequentialDom.innerHTML = '串行'
        if (dom) {
          dom.style.left = rect.left - 10 + 'px'
          dom.style.top = rect.top - 90 + 'px'
        }
      }
    },
    initlistenDomChanged() {
      const displayNoneDomList = [
        'bpmn-icon-intermediate-event-none',
        'bpmn-icon-subprocess-expanded',
        'bpmn-icon-data-object',
        'bpmn-icon-data-store',
        'bpmn-icon-participant',
        'bpmn-icon-group',
      ]
      const observer = new MutationObserver(this.listenObserver)
      const dom = document.getElementsByClassName('djs-container')[0]
      observer.observe(dom, {
        childList: true,
        characterData: true
      })
      displayNoneDomList.forEach(item => {
        const dom = document.getElementsByClassName(item)[0]
        if (dom) {
          dom.style.display = 'none'
        }
      })
    },
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
