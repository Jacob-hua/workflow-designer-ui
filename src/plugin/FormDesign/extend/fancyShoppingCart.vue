<template>
  <div>
    <div>
      <el-select
        v-model="selectedValue"
        :filterable="true"
        :filter-method="handleFilter"
        clearable
        @focus="handleSearch"
        @change="handleSelect"
        @visible-change="handleReset"
        v-loadMore="loadMoreData"
      >
        <el-option
          v-for="item in options"
          :key="item.itemnum"
          :value="item.itemnum"
          :label="item.spareInfo"
        ></el-option>
      </el-select>
    </div>
    <div class="cart-box" v-if="spareParts.length">
      <div v-for="(item, index) in spareParts" :key="index" class="spare-part">
        <el-row>
          <el-col :span="18"
            ><span>{{ item.spareInfo }}</span></el-col
          >
          <el-col :span="6" class="remove-icon"
            ><i
              @click="handleRemoveSpare(item, index)"
              class="el-icon-remove-outline remove-spare-spart"
              :class="formConf.disabled ? 'is-disable' : ''"
          /></el-col>
        </el-row>
        <el-row type="flex" justify="end">
          <div class="input-number">
            <el-button
              class="number-descress icon-box"
              icon="el-icon-minus"
              @click="handleChange(item, index, false)"
            ></el-button>
            <el-input type="text" v-model="item.spareNum" size="mini" />
            <el-button
              class="number-increase icon-box"
              icon="el-icon-plus"
              @click="handleChange(item, index, true)"
            ></el-button>
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import { getSpareListByPage } from "../../../api/unit/api";
import _ from "lodash";
export default {
  name: "shoppingCart",
  directives: {
    loadMore: {
      bind(el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        SELECTWRAP_DOM.addEventListener("scroll", function () {
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      },
    },
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    checkStockAndUseFun: {
      type: Function,
      default: () => {},
    },
    checkStockFun: {
      type: Function,
      default: () => {},
    },
    cancleStockFun: {
      type: Function,
      default: () => {},
    },
    formConf: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      options: [],
      selectedValue: "",
      loading: false,
      spareParts: this.$props.value,
      spareNum: 0,
      page: 1,
      limit: 10,
      total: 0,
      description: "",
    };
  },
  methods: {
    handleSearch() {
      this.page = 1;
      this.options = [];
      this.fetchSpareList();
    },

    handleFilter(value) {
      this.description = value;
      this.page = 1;
      this.options = [];
      this.fetchSpareList();
    },

    async fetchSpareList() {
      const params = {
        page: this.page,
        limit: this.limit,
        description: this.description,
      };
      this.loading = true;
      try {
        const { errorInfo, result } = await getSpareListByPage(params);
        this.loading = false;
        if (errorInfo.errorCode) {
          return [];
        }
        this.total = +result.count;
        this.options = this.options.concat(result.dataList);
      } catch (error) {
        return [];
      }
    },

    handleReset(value) {
      if (!value) {
        this.page = 1;
        this.description = "";
      }
    },

    handleSelect(value) {
      if (!value) return;
      if (this.spareParts.findIndex(({ itemnum }) => itemnum === value) != -1) {
        this.$message.warning("备件已存在");
        return;
      }
      let sparePart = this.options.find(({ itemnum }) => itemnum === value);
      if (sparePart.allowance <= 0) {
        this.$message.warning("备件已被领用完");
        this.selectedValue = "";
        return;
      }
      this.page = 1;
      this.description = "";
      sparePart.spareNum = 1;
      this.spareParts.push(sparePart);
      this.selectedValue = "";
      this.$emit("input", this.spareParts);
    },

    handleChange(spareSpart, index, flag) {
      if (this.formConf.disabled) return
      if (flag) {
        spareSpart.spareNum += 1;
      }
      if (!flag) {
        spareSpart.spareNum -= 1;
        if (spareSpart.spareNum === 0) {
          this.spareParts.splice(index, 1);
        }
      }
      this.$forceUpdate();
      this.$emit("input", this.spareParts);
    },

    handleRemoveSpare(sparePart, index) {
      if (this.formConf.disabled) return;
      this.spareParts.splice(index, 1);
      this.$emit("input", this.spareParts);
    },

    loadMoreData() {
      this.page++;
      this.fetchSpareList();
    },
  },
  beforeDestroy() {
    if (!this.formConf) return;
    if (this.formConf.isSubmit) return;
    if (this.spareParts.length <= 0) return;
    this.spareParts = [];
  },
};
</script>
<style lang="scss" scoped>
.cart-box {
  border: 1px dashed #ccc;
  margin-top: 20px;
}

.spare-part {
  padding: 10px;
}

.spare-part:not(:last-child) {
  border-bottom: 1px dashed #ccc;
}

.remove-icon {
  text-align: right;
  font-size: 22px;
}

.remove-spare-spart {
  cursor: pointer;
  color: #f56c6c;
}

.input-number {
  width: 130px;
  line-height: 26px;
  display: inline-block;
  background-color: #212739;
  border-radius: 4px;
  border: 1px solid #333333;

  ::v-deep .el-input {
    width: 72px;

    .el-input__inner {
      border: none;
      text-align: center;
      height: 26px;
      vertical-align: top;
    }
  }
}

.icon-box {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  width: 28px;
  font-size: 12px;
  background-color: transparent;
  border: none;
  border-radius: 0;
  line-height: 26px;
  padding: 0;

  i {
    transform: scale(0.8);
  }
}

.number-descress {
  border-right: 1px solid #dcdfe6;
}

.number-increase {
  border-left: 1px solid #dcdfe6;
}

.is-disable {
  cursor: not-allowed;
  color: #c0c4cc;
}

::v-deep .el-button.is-loading {
  color: #fff;
}

::v-deep .el-button.is-loading:before {
  background-color: transparent;
}
</style>
