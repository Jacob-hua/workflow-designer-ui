<template>
  <el-dialog
    title="执行人员选择"
    :visible.sync="userDialogVisible"
    @close="close"
    append-to-body
  >
    <el-transfer
      filterable
      :data="userList"
      v-model="selectedUser"
    ></el-transfer>
    <div slot="footer">
      <div class="next" @click="save()" type="primary">保存</div>
      <div class="cancel" @click="close">取消</div>
    </div>
  </el-dialog>
</template>
<script>
import { fetchUserByOrg } from '@/api/globalConfig';
export default {
  name: 'SpecifyUser',
  props: {
    userDialogVisible: {
      type: Boolean,
      default: false,
    },
    selectedFixed: {
      type: Array,
      default: [],
    },
    organization: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      userList: [],
      selectedUser: [],
    };
  },
  watch: {
    userDialogVisible(value) {
      if (value) {
        this.fetchUserList();
      }
    },
    selectedFixed(value){
      this.selectedUser = value.map(({ key }) => key);
    }
  },
  methods: {
    async fetchUserList() {
      const { data, code, msg } = await fetchUserByOrg({
        tenantId: this.organization.tenantId ?? '',
        projectId: this.organization.projectId ?? '',
        applicationId: this.organization.applicationId ?? '',
      });
      if (code !== '200') {
        this.$message.error(msg);
        return;
      }
      this.userList = data.map(({ userId, userName }) => {
        return {
          key: userId,
          label: userName,
        };
      });
    },
    save() {
      const user = this.selectedUser.map((item) => {
        return this.userList.find(({ key }) => key === item);
      });
      this.$emit('saveUser', user);
      this.close()
    },
    close() {
      this.selectedUser = []
      this.$emit('closeUserDialog');
    },
  },
};
</script>
<style lang="scss" scoped>
.next {
  @include primaryBtn;
}
.cancel {
  @include cancelBtn;
}

/deep/.el-transfer-panel {
  background: #1b1e2d;
  width: 40%;

  .el-transfer-panel__header {
    background: #1b1e2d;
    .el-checkbox__label {
      color: #fff;
    }
  }
  .el-transfer-panel__list::-webkit-scrollbar {
    display: none;
  }
  .el-transfer-panel__item.el-checkbox {
    color: #fff;
  }
}
</style>
