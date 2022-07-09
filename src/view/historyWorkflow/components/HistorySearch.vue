<template>
  <div class="search-wrapper">
    <el-form :model="searchForm" inline>
      <el-form-item label="项目">
        <el-select v-model="searchForm.projectValue">
          <el-option
            v-for="{ id, label, value } in rootOrganizations"
            :key="id"
            :label="label"
            :value="value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务">
        <el-cascader
          v-model="searchForm.business"
          :options="rootOrganizationChildrenAndAll(searchForm.projectValue)"
          :props="cascaderProps"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="发起时间">
        <el-date-picker
          v-model="searchForm.valueDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="——"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd hh:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { currentOneMonthAgo } from '@/util/date'

export default {
  name: 'HistorySearch',
  data() {
    const { start, end } = currentOneMonthAgo('yyyy-MM-DD HH:mm:ss')
    return {
      projectOption: [],
      searchForm: {
        valueDate: [start, end],
        projectValue: '',
        business: '',
      },
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'currentOrganization']),
    ...mapState('uiConfig', ['cascaderProps']),
    ...mapGetters('config', ['rootOrganizations', 'rootOrganizationChildrenAndAll']),
  },
  watch: {
    'searchForm.projectValue'(val) {
      if (val === this.currentOrganization) {
        return
      }
      this.updateCurrentOrganization({ currentOrganization: val })
    },
    searchForm: {
      deep: true,
      handler(searchForm) {
        this.$emit('searchHistory', searchForm)
      },
    },
    currentOrganization: {
      immediate: true,
      handler(val) {
        this.searchForm.projectValue = val
      },
    },
  },
  methods: {
    ...mapMutations('account', ['updateCurrentOrganization']),
    ...mapActions('config', ['dispatchRefreshOrganization']),
  },
}
</script>

<style scoped lang="scss">
.search-wrapper {
  height: 106px;
  background-color: $card-bg-color;
  border-radius: 6px;

  @include searchForm;

  .el-form {
    display: flex;
    align-items: center;
    padding: 0 43px;
  }

  .el-form-item {
    margin-bottom: 0;
  }

  .button-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;

    .search-button {
      @include primaryBtn;
    }
  }
}
</style>
