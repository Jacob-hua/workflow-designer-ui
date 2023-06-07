<template>
  <div>
    <el-dialog title="查看工作流" fullscreen :visible="visible" @close="onClose">
      <div class="container">
        <bpmn-info :processDisplayInfo="processDisplayInfo" :xml="workflow.content" />
        <div class="search-wrapper">
          <span>部署类型</span>
          <span>
            <el-cascader
              v-model="systemType"
              clearable
              :props="cascaderProps"
              :options="systemTypeOptions"
              @change="onSystemTypeChange"
            ></el-cascader>
          </span>
          <span> 已部署次数: {{ deployNumber }} </span>
        </div>
        <div class="detail-wrapper">
          <div v-if="!deployments.length">暂无数据</div>
          <div v-else class="details">
            <div
              class="detail"
              v-for="(
                {
                  id,
                  deployName,
                  createBy,
                  createTime,
                  displayStatus,
                  periodicityFlag,
                  cronExpression,
                  displayTriggerModel,
                },
                index
              ) in deployments"
              :key="id"
            >
              <div class="detail-button" @click="onClickDetail(index)">详情</div>
              <div>
                <div class="info">
                  <span>部署名称:</span>
                  <long-text contentStyle="margin-left: 10px; width: 130px;" :content="deployName" />
                </div>
                <div class="info">
                  <span>触发模式:</span>
                  <span>{{ displayTriggerModel }}</span>
                </div>
                <div class="info" v-if="periodicityFlag">
                  <span>周期规则:</span>
                  <span>{{ cronExpression }}</span>
                </div>
                <div class="info">
                  <span>部署人:</span>
                  <span>{{ createBy }}</span>
                </div>
                <div class="info">
                  <span>部署时间:</span>
                  <span>{{ createTime }}</span>
                </div>
                <div class="info">
                  <span>状态:</span>
                  <span>{{ displayStatus }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <deploy-detail :visible.sync="deployDetailVisible" :deployedId="deployedId" @deleted="onDeletedDeploy" />
  </div>
</template>

<script>
import BpmnInfo from '@/component/BpmnInfo.vue'
import { mapGetters, mapState } from 'vuex'
import { getDeployBasic } from '@/api/unit/api.js'
import DeployDetail from './DeployDetail.vue'
import longText from '../../../component/LongText.vue'

export default {
  name: 'DeployCabinDetail',
  components: {
    BpmnInfo,
    DeployDetail,
    longText,
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
    ...mapState('uiConfig', ['cascaderProps']),
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
          label: '流程名称',
          value: this.workflow.name,
        },
        {
          label: '创建时间',
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
    onDeletedDeploy() {
      this.fetchDeployDetails()
      this.$emit('deleted')
    },
    onClose() {
      this.systemType = null
      this.$emit('cloase')
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
          displayTriggerModel:
            deployment.triggerModel === '1' ? '周期性' : deployment.triggerModel === '2' ? '固定触发' : '无',
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
.container {
  display: flex;
  flex-direction: column;
}

.search-wrapper {
  color: $font-color;
  padding: 30px 0;
  font-size: 12px;

  & > span:first-child {
    margin-right: 20px;
  }

  & > span:last-child {
    margin-left: 20px;
  }
}

.detail-wrapper {
  overflow: auto;
  height: 240px;

  .details {
    display: grid;
    grid-template-columns: repeat(auto-fill, 270px);
    row-gap: 20px;
    column-gap: 20px;
    padding: 20px 30px;
  }

  .detail {
    background-color: #212739;
    color: $font-color;
    font-size: 14px;
    padding: 10px;

    .info {
      display: flex;
      padding: 5px 0;
      & > span:first-child {
        width: 65px;
        text-align: end;
      }
      & > span:last-child {
        margin-left: 10px;
      }
    }
  }

  .detail-button {
    float: right;
    cursor: pointer;
    color: $button-submit-bg-color;
  }
}
</style>
