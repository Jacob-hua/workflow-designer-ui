<template>
  <div>
    <div>
      <el-select
        v-model="selectedValue"
        :filterable="true"
        :filter-method="handleFilter"
        clearable
        @focus="handleSearch"
        :loading="loading"
        @change="handleSelect"
      >
        <el-option
          v-for="item in options"
          :key="item.itemnum"
          :value="item.itemnum"
          :label="item.spareInfo"
        ></el-option>
        <el-pagination
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :total="total"
          :hide-on-single-page="true"
        >
        </el-pagination>
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
          /></el-col>
        </el-row>
        <el-row type="flex" justify="end">
          <div class="input-number">
            <span
              class="number-descress icon-box"
              :class="item.spareNum === 0 ? 'is-disable' : ''"
              @click="handleChange(item, false)"
              ><i class="el-icon-minus"
            /></span>
            <el-input type="text" v-model="item.spareNum" size="mini" />
            <span
              class="number-increase icon-box"
              :class="item.hasStock ? '' : 'is-disable'"
              @click="handleChange(item, true)"
              ><i class="el-icon-plus"
            /></span>
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
  props: {
    checkStockFun: {
      type: Function,
      default: () => {},
    },
    cancleStockFun: {
      type: Function,
      default: () => {},
    },
    // timeDelay: {
    //   type: Number,
    //   default: 30,
    // },
  },
  data() {
    return {
      options: [],
      selectedValue: "",
      loading: false,
      spareParts: [],
      spareNum: 0,
      page: 1,
      limit: 10,
      total: 0,
      description: "",
      hasStock: true,
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleSearch() {
      this.fetchSpareList();
    },
    handleFilter(value) {
      this.description = value;
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
        this.options = result.dataList;
      } catch (error) {
        return [];
      }
    },
    handleSelect(value) {
      if (this.spareParts.findIndex(({ itemnum }) => itemnum === value) != -1) {
        this.$message.warning("备件已存在");
        return;
      }
      this.page = 1;
      this.description = "";
      let sparePart = this.options.find(({ itemnum }) => itemnum === value);
      sparePart.spareNum = 0;
      sparePart.hasStock = true;
      this.spareParts.push(sparePart);
    },
    handleChange: _.throttle(function (spareSpart, flag) {
      if (flag) {
        this.checkStockFun(spareSpart.itemnum, flag).then((res) => {
          spareSpart.hasStock = res;
          if (res) {
            spareSpart.spareNum += 1;
          }
          this.$forceUpdate();
        });
      } else {
        if (spareSpart.spareNum === 0) return;
        this.checkStockFun(spareSpart.itemnum, flag).then((res) => {
          spareSpart.hasStock = res;
        });
        spareSpart.spareNum -= 1;
        this.$forceUpdate();
      }
    }, 30),
    handleRemoveSpare(sparePart, index) {
      this.cancleStockFun(sparePart.itemnum, sparePart.spareNum);
      this.spareParts.splice(index, 1);
    },
    handleCurrentChange() {
      this.fetchSpareList();
    },
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
</style>
