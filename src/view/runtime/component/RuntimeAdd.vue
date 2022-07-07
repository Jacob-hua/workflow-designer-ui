<template>
  <div>
    <el-dialog title="新建执行" :visible="dialogVisible" @close="onClose">
      <div class="content-wrapper">
        <div>
          <div class="system-list">
            <el-tree
              :data="rootOrganizationChildren(projectCode)"
              :props="defaultProps"
              @node-click="handleNodeClick"
            ></el-tree>
          </div>
        </div>
        <div>
          <div class="process-list">
            <div class="process-list-item" v-for="(process, index) in processList" :key="index">
              <div class="process-list-item-detail" @click="detailsShow(process)">
                <span>详情</span>
              </div>
              <div class="process-list-item-word">
                <label>部署名称:</label>
                <span>{{ process.deployName }}</span>
              </div>
              <div class="process-list-item-word">
                <label>部署人:</label>
                <span>{{ process.user }}</span>
              </div>
              <div class="process-list-item-word">
                <label> 部署时间:</label>
                <span>{{ process.createTime }}</span>
              </div>
              <div class="process-list-item-button">
                <el-button type="primary" plain @click="createTicket(process)">创建</el-button>
              </div>
            </div>
          </div>
          <el-pagination
            @size-change="onSizeChange"
            @current-change="onCurrentChange"
            :current-page.sync="getData.page"
            :page-size="getData.limit"
            layout="prev, pager, next, jumper"
            :total="getData.total"
          >
          </el-pagination>
        </div>
      </div>
    </el-dialog>
    <runtime-creat-ticket
      :visible="createTicketVisible"
      :process="process"
      @close="onCreateTicketVisible"
      @submit="onCreateTicketSubmit"
    />
  </div>
</template>

<script>
import { getProcessDefinitionList } from '@/api/unit/api.js'
import { mapState, mapGetters } from 'vuex'
import RuntimeCreatTicket from './RuntimeCreatTicket.vue'

export default {
  name: 'RuntimeAdd',
  components: {
    RuntimeCreatTicket,
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
        type: 'energy-1',
        order: 'desc',
        page: 1,
        limit: 4,
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
    detailsShow(item) {},
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
    systemListItemClass(value) {
      return this.getData.type === value ? 'check-pro' : ''
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
.content-wrapper {
  display: flex;

  & > div:first-child {
    flex: 1;
  }

  & > div:last-child {
    flex: 3;
  }
}

.system-list {
  margin-top: 30px;
}

.check-pro {
  border-color: #0066cc;
  color: #0066cc;
}

.process-list {
  height: 500px;
}

.process-list-item {
  width: 290px;
  height: 178px;
  background-color: #e4e4e4;
  padding: 20px 0px 0px 20px;
  position: relative;
  margin-right: 20px;
  display: inline-block;
  margin-top: 30px;
}

.process-list-item-detail {
  position: absolute;
  right: 20px;
  top: 10px;
  color: #1890ff;
  cursor: pointer;
}

.process-list-item-word {
  font-size: 14px;
  color: #000000;
  margin-bottom: 20px;
}

.process-list-item-button {
  text-align: center;
}

.process-list-item-button /deep/ .el-button {
  height: 30px;
  line-height: 30px;
  padding: 0px 20px;
}
</style>
