<template>
  <div>
    <el-dialog title="查看工作流" :visible="visible" width="70%" @close="onCancel" custom-class="dialogVisible1">
      <div>
        <ProcessInformation :processDisplayInfo="processDisplayInfo" :xml="workflow.content" />
      </div>
      <div class="details-footer-height">
        <div class="details-header">
          <span>部署类型</span>
          <span class="inputSelect">
            <el-cascader
              v-if="systemTypeOptions.length === 0"
              v-model="business"
              :options="rootOrganizationChildren(workflow.ascription)"
              :disabled="true"
            ></el-cascader>
            <el-select v-else v-model="systemType" @change="onSystemTypeChange" clearable placeholder="请选择">
              <el-option v-for="{ value, label } in systemTypeOptions" :key="value" :label="label" :value="value" />
            </el-select>
          </span>
          <span class="frequency"> 已部署次数: {{ deployNumber }} </span>
        </div>
        <div class="detail-list">
          <div style="line-height: 194px; width: 100%; text-align: center" v-if="!deployments.length">暂无数据</div>
          <div v-else>
            <div
              v-for="({ id, deployName, createBy, createTime, displayStatus }, index) in deployments"
              :key="id"
              class="detail-list-item"
            >
              <span class="detailsWord" @click="onClickDetail(index)">详情</span>
              <div class="item-item">
                <span>部署名称:</span>
                <span>{{ deployName }}</span>
              </div>
              <div class="item-item">
                <span>部署人:</span>
                <span>{{ createBy }}</span>
              </div>
              <div class="item-item">
                <span>部署时间:</span>
                <span>{{ createTime }}</span>
              </div>
              <div class="item-item">
                <span>状态:</span>
                <span>{{ displayStatus }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <deploy-detail :visible.sync="deployDetailVisible" :deployedId="deployedId" />
  </div>
</template>

<script>
import ProcessInformation from '@/component/bpmnView/ProcessInformation.vue'
import { mapGetters } from 'vuex'
import { getDeployBasic } from '@/api/unit/api.js'
import DeployDetail from './DeployDetail.vue'

export default {
  name: 'DeployCabinDetail',
  components: {
    ProcessInformation,
    DeployDetail,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    workflow: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      business: '',
      deployments: [],
      deployNumber: 0,
      systemType: null,
      deployDetailVisible: false,
      deployedId: '',
    }
  },
  computed: {
    ...mapGetters('config', ['rootOrganizationChildren', 'findOrganizations']),
    systemTypeOptions() {
      return this.findOrganizations(this.workflow.business)
    },
    processDisplayInfo() {
      return [
        {
          label: '流程编码',
          value: this.workflow.numberCode,
        },
        {
          label: '部署时间',
          value: this.workflow.createTime,
        },
        {
          label: '应用项目',
          value: this.$getMappingName(this.workflow.ascription),
        },
        {
          label: '流程类型',
          value: this.$getMappingName(this.workflow.business),
        },
        {
          label: '部署人',
          value: this.workflow.createBy,
        },
      ]
    },
  },
  watch: {
    workflow(workflow) {
      this.business = workflow.business
      this.fetchDeployDetails()
    },
  },
  methods: {
    onCancel() {
      this.systemType = null
      this.$emit('cancel')
      this.$emit('update:visible', false)
    },
    onSystemTypeChange() {
      this.fetchDeployDetails()
    },
    onClickDetail(index) {
      this.deployedId = this.deployments[index].id
      this.deployDetailVisible = true
    },
    async fetchDeployDetails() {
      try {
        const {
          errorInfo,
          result: { dataList, count },
        } = await getDeployBasic({
          processId: this.workflow.id,
          systemType: this.systemType,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }
        this.deployments = (dataList ?? []).map((deployment) => ({
          ...deployment,
          displayStatus: deployment.status === 'activation' ? '已激活' : '未激活',
        }))
        this.deployNumber = count
      } catch (error) {
        this.deployments = []
        this.deployNumber = 0
      }
    },
  },
}
</script>

<style scoped lang="scss">
.details-header {
  margin-top: 20px;
}
.inputSelect {
  margin-right: 20px;
  display: inline-block;
  margin-left: 20px;
}
.inputSelect /deep/ .el-input__inner {
  width: 180px;
  height: 43px;
  line-height: 43px;
  padding: 0px 10px;
  border: 1px solid black;
}
.frequency {
  color: #0066cc;
  font-weight: 700;
}
.detail-list {
  margin-top: 30px;
  /* display: flex; */
  width: 1312px;
  padding-bottom: 10px;
  margin-bottom: 20px;
  /* height: 200px; */
  overflow: auto;
  white-space: nowrap;
}
.detail-list::-webkit-scrollbar {
  width: 0px;
  /* height: 2px; */
}
.detail-list-item {
  position: relative;
  display: inline-block;
  width: 290px;
  height: 165px;
  border: 1px solid black;
  padding: 20px 20px;
  margin-right: 40px;
}
.detailsWord {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #0066cc;
  cursor: pointer;
}

.detail-list-item .item-item {
  line-height: 35px;
  color: black;
}

::v-deep .el-dialog__footer {
  text-align: center;
}

.bpmn-configure {
  display: flex;
}

.noneForm {
  display: inline-block;
  height: 160px;
  width: 100%;
  text-align: center;
  line-height: 160px;
}

.details-footer-height {
  height: 248px;
}

.bpmn-configure-title {
  height: 40px;
  line-height: 40px;
}

.bpmn-configure-basic {
  flex: 1;
}

.bpmn-configure-form {
  flex: 3;
  margin-left: 20px;
}

.bpmn-configure-Main {
  height: 200px;
  border: 1px solid #000000;
  padding: 20px 10px;
  overflow: auto;
}

.bpmn-configure-Main-item {
  margin-bottom: 20px;
  color: black;
}

.formShowForm {
  position: relative;
}

.formRemove {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
