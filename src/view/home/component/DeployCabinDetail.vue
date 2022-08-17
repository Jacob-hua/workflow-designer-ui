<template>
  <div>
    <el-dialog title="查看工作流" fullscreen :visible="visible" @close="onClose">
      <div class="container">
        <bpmn-info :processDisplayInfo="processDisplayInfo" :xml="workflow.content" />
        <div class="search-wrapper">
          <span>部署类型</span>
          <span>
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
          <span> 已部署次数: {{ deployNumber }} </span>
        </div>
        <div class="detail-wrapper">
          <div v-if="!deployments.length">暂无数据</div>
          <div v-else class="details">
            <div
              class="detail"
              v-for="({ id, deployName, createBy, createTime, displayStatus }, index) in deployments"
              :key="id"
            >
              <div class="detail-button" @click="onClickDetail(index)">详情</div>
              <div>
                <div class="info">
                  <span>部署名称:</span>
                  <span>{{ deployName }}</span>
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
import { mapGetters } from 'vuex'
import { getDeployBasic } from '@/api/unit/api.js'
import DeployDetail from './DeployDetail.vue'

export default {
  name: 'DeployCabinDetail',
  components: {
    BpmnInfo,
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
          label: '流程名称',
          value: this.workflow.name,
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
