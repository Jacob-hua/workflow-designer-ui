<template>
  <div>
    <el-dialog title="新建工单" top="1vh" fullscreen :visible="dialogVisible" @close="onClose" :close-on-click-modal="false">
      <div class="content-wrapper">
        <div>
          <el-card header="业务选择">
            <PeTree nodeKey="id" labelName="label"
            :data="rootOrganizationChildren(projectCode)"
            @nodeClick="handleNodeClick"
            ></PeTree>
          </el-card>
        </div>
        <div v-if="processList && processList.length !== 0">
          <div class="process-list">
            <div class="process" v-for="(process, index) in processList" :key="index">
              <div class="process-info">
                <div>部署名称:</div>
                <long-text contentStyle="color: white; width: 180px" :content="process.deployName" />
              </div>
              <div class="process-info">
                <div>部署人:</div>
                <div>{{ process.user }}</div>
              </div>
              <div class="process-info">
                <div>部署时间:</div>
                <div>{{ process.createTime }}</div>
              </div>
              <div class="button-wrapper">
                <el-button plain @click="createTicket(process)">创建</el-button>
                <!--el-button @click="detailsShow(process)">详情</el-button-->
              </div>
            </div>
          </div>
          <el-pagination 
            @size-change="onSizeChange"
            @current-change="onCurrentChange"
            :current-page.sync="getData.page"
            :page-size="getData.limit"
            layout="prev, pager, next, jumper"
            :total="getData.total">
          </el-pagination>
        </div>
        <div class="empty" v-else>
          <img :src="require('../../../assets/image/common/no_data.png')" />
        </div>
      </div>
    </el-dialog>
    <runtime-creat-ticket
      :visible="createTicketVisible"
      :process="process" @close="onCreateTicketVisible"
      @submit="onCreateTicketSubmit"
    />
  </div>
</template>

<script>
import { getProcessDefinitionList } from '@/api/unit/api.js'
import { mapState, mapGetters } from 'vuex'
import RuntimeCreatTicket from './RuntimeCreatTicket.vue'
import PeTree from '@/component/PeTree.vue'
import longText from "../../../component/LongText.vue"

export default {
  name: 'RuntimeAdd',
  components: {
    RuntimeCreatTicket,
    PeTree,
    longText,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    projectCode: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      processList: [],
      energyTree: [],
      getData: {
        type: '',
        order: '',
        page: 1,
        limit: 12,
        total: 1,
      },
      createTicketVisible: false,
      process: {},
      defaultProps: {
        children: 'children',
        label: 'label',
      },
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
    ...mapGetters('config', ['rootOrganizations', 'rootOrganizationChildren']),
  },
  methods: {
    //detailsShow(item) {},
    handleNodeClick(data) {
      this.getData.type = data.value
      this.getProcessList()
    },
    onCreateTicketVisible() {
      this.createTicketVisible = false
    },
    changSystem(energyType) {
      this.getData.type = energyType
      this.getProcessList()
    },
    onClose() {
      this.$emit('close')
    },
    getProcessList() {
      getProcessDefinitionList({
        ...this.getData,
        tenantId: this.tenantId,
      }).then((res) => {
        this.processList = res.result.dataList
        this.getData.total = res.result.count * 1
      })
    },
    onSizeChange() {
      this.getProcessList()
    },
    onCurrentChange() {
      this.getProcessList()
    },
    onCreateTicketSubmit(signal) {
      if (signal) {
        this.$emit('succseeAdd')
      }
    },
    createTicket(process) {
      this.process = { ...process }
      this.createTicketVisible = true
    },
  },
}
</script>

<style scoped lang="scss">
.el-card {
  height: 100%;
}

.content-wrapper {
  display: flex;
  height: 100%;

  & > div:first-child {
    width: 278px;
  }

  & > div:last-child {
    flex: 1;
    margin-left: 12px;
    border: 1px solid $border-color-1;
    height: 100%;
    border-radius: 6px;
  }
}

.process-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, 370px);
  grid-template-rows: 229px;
  row-gap: 20px;
  column-gap: 20px;
  padding: 20px;
  height: 720px;
}

.process {
  width: 370px;
  height: 229px;
  background-color: $card-bg-color-1;
  display: flex;
  flex-direction: column;
  border-radius: 4px;

  .process-info {
    display: flex;
    margin: 30px 30px 0px 32px;

    & > div:first-child {
      width: 60px;
    }

    & > div:last-child {
      margin-left: 30px;
      color: $font-color;
    }
  }

  .button-wrapper {
    margin: 30px 30px 24px 0px;
    text-align: end;
    display: flex;
    justify-content: flex-end;

    & > button {
      @include primaryPlainBtn;
      width: 68px;
      height: 28px;
    }
  }
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-pagination {
  text-align: right;
  margin-right: 20px;
}
</style>
