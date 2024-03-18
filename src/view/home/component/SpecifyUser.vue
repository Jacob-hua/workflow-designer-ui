<template>
  <el-dialog :title="执行人员选择" :visible.sync="userDialogVisible" @close="clost">
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
    save(){},
    close(){},
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
</style>
