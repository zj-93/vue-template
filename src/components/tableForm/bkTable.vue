<template>
  <div
    id="table-wrapper"
    class="table-wrapper"
    ref="tableWrapper"
    :class="isAdd ? 'addTable' : 'detailTable'"
  >
    <div id="bkTable" ref="bkTable">
      <el-form :model="tableForm" :ref="refName">
        <el-table
          ref="elTable"
          :data="tableData"
          border
          stripe
          style="width: 100%"
          :header-cell-style="tableHeaderCellStyle"
          :cell-style="tableCellStyle"
          @selection-change="handleSelectionChange"
          :height="configSet.tableH || '100%'"
          :max-height="configSet.tableH || maxTableH"
          @row-dblclick="rowdbClick"
        >
          <el-table-column
            v-if="configSet.showSelection"
            type="selection"
            width="50px"
            align="center"
            :cell-style="{ padding: '0 0' }"
          />
          <el-table-column
            v-if="configSet.showIndex"
            label="序号"
            type="index"
            width="55"
            align="center"
            :cell-style="{ padding: '0 0' }"
          />
          <el-table-column
            v-for="(item, index) in tableHeadConfig"
            :prop="item.prop"
            :label="item.label"
            align="center"
            :width="item.width"
            :key="index"
            :show-overflow-tooltip="true && !item.btnList"
            :cell-style="{ padding: '0 0' }"
          >
            <template slot-scope="scope">
              <div v-if="!item.btnList && isAdd">
                <el-form-item
                  :prop="'tableData.' + scope.$index + '.' + item.prop"
                  :rules="item.rules ? item.rules : []"
                >
                  <!-- 下拉框 -->
                  <el-select
                    v-model="scope.row[item.prop]"
                    v-if="item.type === 'select'"
                  >
                    <el-option
                      :label="option.label"
                      :value="option.value"
                      :key="option.value"
                      v-for="option in item.options"
                    ></el-option>
                  </el-select>
                  <!-- 时间框 -->
                  <el-date-picker
                    v-else-if="item.type === 'date'"
                    v-model="scope.row[item.prop]"
                    value-format="yyyy-MM-dd"
                    type="date"
                    :placeholder="item.placeholder"
                    :disabled="item.disabled"
                  />
                  <!-- 数字文本框 -->
                  <el-input
                    v-else-if="item.type === 'number'"
                    v-model="scope.row[item.prop]"
                    :max="item.max"
                    :min="item.min"
                    @keyup.native="$limitInt(scope.row, item.prop)"
                    @blur="item.handleBlur(scope.row, scope.$index, item.prop)"
                  />

                  <!-- 开关 -->
                  <el-switch
                    v-else-if="item.type === 'switch'"
                    v-model="scope.row[item.prop]"
                    :active-color="item.activeColor || '#13ce66'"
                    :inactive-color="item.activeColor || '#ff4949'"
                    :active-text="item.activeText || ''"
                    :inactive-text="item.inactiveText || ''"
                  ></el-switch>

                  <!-- 文本框 -->
                  <el-input
                    v-else-if="item.type === 'input'"
                    v-model="scope.row[item.prop]"
                    :disabled="item.disabled"
                    @blur="
                      item.handleBlur &&
                        item.handleBlur(scope.row, scope.$index, item.prop)
                    "
                  />

                  <div v-else-if="item.type === 'text'">
                    <div>
                      {{
                        (item.formatter &&
                          item.formatter(scope.row[item.prop])) ||
                        scope.row[item.prop]
                      }}
                    </div>
                  </div>
                </el-form-item>
              </div>
              <div v-else>
                <div v-if="item.formatter">
                  {{ item.formatter && item.formatter(scope.row[item.prop]) }}
                </div>
                <div v-else-if="item.render">
                  <div v-html="item.render(scope.row)"></div>
                </div>
                <div v-else-if="item.btnRender">
                  <List :config="item" :data="scope.row" />
                </div>
                <div v-else>{{ scope.row[item.prop] }}</div>
              </div>
              <!-- 操作按钮 -->
              <div v-if="item.btnList" class="btn-wrapper">
                <div
                  v-for="(ele, ind) in item.btnList"
                  :key="ind"
                  class="btn-box"
                >
                  <List :config="ele" :data="scope.row" />
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="desc">
          <slot name="desc"></slot>
        </div>
      </el-form>
    </div>

    <div class="table-page">
      <!-- <table-pagination
        v-if="configSet.showPage"
        @size-change="changeSize"
        @page-change="changePage"
        :pageNum="page.pageNum"
        :pageSize="page.pageSize"
        :total="total"
      ></table-pagination> -->
    </div>
  </div>
</template>

<script>
// import tablePagination from "@/components/tableGroup/tablePagination";
// import "@/commom/vdirective";

export default {
  components: { 
    // tablePagination 
  },
  props: {
    tableForm: {
      type: Object,
      default: () => {},
    },
    tableData: {
      type: Array, // 表格
      default: () => {},
    },
    tableHead: {
      type: Array, // 表格
      default: () => [],
    },
    config: {
      type: Object,
      default: () => {},
    },
    isAdd: {
      type: Boolean,
      default: false,
    },
    refName: {
      type: String,
      default: "tableForm",
    },
    page: {
      type: Object,
      default: () => {
        return {
          pageSize: 10,
          pageNum: 1,
        };
      },
    },
    total: {
      type: Number,
      default: 0,
    },
    tableHeaderCellStyle: {
      type: Object,
      default: function () {
        return {
          background: "rgb(243, 243, 245)",
          padding: "6px 0",
          color: "#333",
        };
      },
    },
    tableCellStyle: {
      type: Object,
      default: function () {
        return {
          padding: "6px 0",
          color: "#666",
        };
      },
    },
    defaultList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tableH: 100,
      maxTableH: 100,
    };
  },
  // watch: {
  //   defaultList: {
  //     handler(val) {
  //       if (val.length) {
  //         val.forEach((row) => {
  //           this.$refs.elTable.toggleRowSelection(row);
  //         });
  //       } else {
  //         this.$refs.elTable.clearSelection();
  //       }
  //     },
  //     deep: true,
  //     immediate: true,
  //   },
  // },
  created() {},
  mounted() {
    this.maxTableH = `${this.$refs.bkTable.clientHeight - 36}px`;
  },
  updated() {
    this.maxTableH = `${this.$refs.bkTable.clientHeight - 36}px`;
    this.tableH = `${(this.tableData.length + 1) * 45}px`;
  },
  computed: {
    configSet() {
      let obj = {
        showPage: true,
        showSelection: false,
        showIndex: true,
      };
      return Object.assign(obj, this.config);
    },
    tableHeadConfig() {
      let temp = [];
      this.tableHead.forEach((el) => {
        if (!el.hidden) {
          temp.push(el);
        }
      });
      return Object.assign({}, temp);
    },
  },
  methods: {
    changeSize(val) {
      this.page.pageSize = val;
      this.$emit("getList", { ...this.page });
    },
    changePage(val) {
      this.page.pageNum = val;
      this.$emit("getList", { ...this.page });
    },
    handleSelectionChange(val) {
      this.$emit("handleSelectionChange", val);
    },
    toggleSelection(rows) {
      let that = this;
      if (rows.length) {
        for(let i = 0; i < rows.length; i++) {
          that.$refs.elTable.toggleRowSelection(rows[i],true);
        }
      } else {
        this.$refs.elTable.clearSelection();
      }
    },
    rowdbClick(row, column, event) {
      this.$emit("rowdbClick", row, column, event);
    }
  },
  watch: {},
};
</script>
<style lang="less" scoped>
#bkTable {
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  height: calc(100% - 26px);
  box-shadow: 0px 0px 21px 0px rgba(211, 219, 232, 0.5);
  border-radius: 4px;
  ::v-deep .el-form {
    height: 100%;
    .el-table {
      // border-left: 1px solid #ebeef5;
      border-left: 1px solid #ebeef5;
      border-bottom: 1px solid #ebeef5;
      &:before {
        content: "";
        height: 0;
      }
      .cell {
        height: 32px;
        line-height: 32px;
      }
    }
  }

  .desc {
    background-color: #fff;
    height: auto;
  }

  .btn-wrapper {
    text-align: left;
  }

  .btn-box {
    display: inline-block;
    margin-right: 8px;
    margin-left: 8px;

    ::v-deep .el-button {
      height: 32px;
      line-height: 32px;
      padding: 0 15px;
    }
  }
}

.pagination {
  background-color: #fff;
  margin-top: 0;
  height: auto;
  padding-bottom: 10px;
  padding-right: 20px;
}

.addTable {
  #bkTable {
    ::v-deep .el-form {
      ::v-deep .cell {
        height: 42px;
        line-height: 42px;

        ::v-deep .el-input {
          width: 100%;

          ::v-deep .el-input__inner {
            height: 32px;
            line-height: 32px;
          }
        }
      }

      .has-gutter {
        .cell {
          height: 35px;
          line-height: 35px;
        }
      }
    }
  }
}
</style>
