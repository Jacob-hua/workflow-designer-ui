<template>
  <el-dialog
    title="执行人员选择"
    :visible.sync="userDialogVisible"
    @close="close"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
      :destroy-on-close="true"
  >
    <div class="dialog-content">
      <div class="user-list list-card">
        <div class="card-header">人员选择</div>
        <div class="content-wrapper">
          <div class="search-wrapper">
            <el-input
              v-model="userName"
              placeholder="请输入人员名称"
              prefix-icon="el-icon-search"
            ></el-input>
            <el-button type="primary" @click="handlesearch">查询</el-button>
          </div>
          <div class="user-table">
            <div class="table-header">
              <div class="name-column header-column">姓名</div>
              <div class="selector-column header-column">选择</div>
            </div>
            <div class="table-content">
              <div
                v-for="item in displayUserList"
                :key="item.userId"
                class="table-row"
              >
                <div class="name-column table-column">{{ item.userName }}</div>
                <div class="selector-column table-column">
                  <el-checkbox
                    v-model="item.selectStatus"
                    @change="handleSelect(item)"
                  ></el-checkbox>
                </div>
              </div>
            </div>
          </div>
          <div class="pagination-box">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="prev, pager, next, jumper"
              :total="pageTotal"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="selected-list list-card">
        <div class="card-header">选择预览</div>
        <div class="selected-user content-wrapper">
          <div
            v-for="item in selectedUser"
            :key="item.userId"
            class="user-item"
          >
            <span class="item-content">{{ item.userName }}</span>
            <span class="delete-icon" @click="handleDeleteUser(item)"
              ><i class="el-icon-circle-close"></i
            ></span>
          </div>
        </div>
      </div>
    </div>
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
      // selectedUser: [],
      userName: '',
      displayUserList: [],
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0
    };
  },
  computed: {
    selectedUser() {
      return this.userList.filter(({ selectStatus }) => selectStatus);
    },
  },
  watch: {
    userDialogVisible(value) {
      if (value) {
        this.fetchUserList();
      }
    },
    // selectedFixed(value) {
    //   this.selectedUser = value.map(({ userId }) => userId);
    // },
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
        const index = this.selectedFixed.findIndex(
          ({ userId: id }) => userId === id
        );
        let selectStatus = false;
        if (index !== -1) {
          selectStatus = true;
        }
        return {
          userId,
          userName,
          selectStatus,
        };
      });
      this.handleDisplayUsers();
    },
    handlesearch() {
      this.currentPage = 1;
      this.handleDisplayUsers();
    },
    handleSelect(item) {
      this.userList = this.userList.map((ele) => {
        if (item.userId === ele.userId) {
          return {
            ...ele,
            selectStatus: item.selectStatus,
          };
        }
        return ele;
      });
      this.handleDisplayUsers();
    },
    handleDeleteUser(item) {
      this.userList = this.userList.map((ele) => {
        if (item.userId === ele.userId) {
          return {
            ...item,
            selectStatus: false,
          };
        }
        return ele;
      });
      this.handleDisplayUsers();
    },
    handleCurrentChange(pageNum) {
      this.currentPage = pageNum;
      this.handleDisplayUsers();
    },
    handleDisplayUsers() {
      if (!this.userName) {
        this.displayUserList = this.userList.slice(
          (this.currentPage - 1) * this.pageSize,
          this.currentPage * this.pageSize
        );
        this.pageTotal = this.userList.length
        return;
      }
      const filterList = this.userList
        .filter(({ userName }) => {
          return userName.includes(this.userName);
        })
      this.displayUserList = filterList.slice(
          (this.currentPage - 1) * this.pageSize,
          this.currentPage * this.pageSize
        );
      this.pageTotal = filterList.length
    },
    save() {
      // const user = this.selectedUser.map((item) => {
      //   return this.userList.find(({ userId }) => userId === item);
      // });
      this.$emit('saveUser', this.selectedUser);
      this.close();
    },
    close() {
      this.userList = [];
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

.dialog-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 30px;

  .list-card {
    margin: 0 10px;
    border: 1px solid;
    border-radius: 5px;

    .card-header {
      display: inline-block;
      width: 100%;
      height: 50px;
      line-height: 50px;
      padding: 0 10px;
      border-bottom: 1px solid #99999970;
      color: #f5f5f5;
    }

    .content-wrapper {
      padding: 0 10px;
    }
  }
  .user-list {
    .search-wrapper {
      display: flex;
      margin: 20px 0;
      grid-gap: 20px;
    }

    .user-table {
      padding: 10px 0;
      color: #e8e8e8;
      .table-header {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        justify-content: center;
        align-items: center;
        // border-top: 1px solid;
        // border-bottom: 1px solid;
        height: 40px;

        .header-column {
          text-align: center;
        }
      }
      .table-content {
        max-height: 30vh;
        overflow: auto;
        &::-webkit-scrollbar {
          display: none;
        }

        .table-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          justify-content: center;
          align-items: center;
          // border-bottom: 1px solid;
          height: 50px;

          &:nth-of-type(odd) {
            background: #33333370;
          }

          &:hover {
            background: #99999970;
          }

          .table-column {
            text-align: center;
          }
        }
      }
    }

    .pagination-box {
      text-align: right;
      margin-bottom: 10px;
    }
  }

  .selected-list {
    .selected-user {
      margin: 10px 0;
      display: grid;
      grid-gap: 10px;
      grid-template-columns: repeat(2, 1fr);

      .user-item {
        display: flex;
        grid-gap: 10px;
        align-items: center;
        color: #409eff;
        justify-content: center;

        .item-content {
          border: 1px solid;
          border-radius: 4px;
          padding: 5px 10px;
          text-align: center;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .delete-icon {
          cursor: pointer;
          font-size: 20px;
          color: red;
          flex-shrink: 0;
        }
      }
    }
  }
}
</style>
