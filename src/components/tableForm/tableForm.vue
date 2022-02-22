<template>
  <div
    v-height
    id="table-wrapper"
    class="table-wrapper"
    ref="tableWrapper"
    :class="isAdd ? 'addTable' : 'detailTable'"
  >
    <div id="bkTable">
      <el-form :model="tableForm" :ref="refName">
        <el-table
          ref="elTable"
          :data="tableForm.tableData"
          border
          stripe
          style="width: 100%"
          :header-cell-style="tableHeaderCellStyle"
          :cell-style="tableCellStyle"
          @selection-change="handleSelectionChange"
          height="100%"
          :max-height="maxTableH"
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
                    :max="item.max"
                    :min="item.min"
                    v-model="scope.row[item.prop]"
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
                    @blur="item.handleBlur && item.handleBlur(scope.row, scope.$index, item.prop)"
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
                <div v-else-if="item.render" >
                  <List :config="item" :data="scope.row" />
                </div>
                <div v-else>{{ scope.row[item.prop] }}</div>
              </div>
              <!-- 操作按钮 -->
              <div v-if="item.btnList">
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
        <div class="desc" >
          <slot name="desc"></slot>
        </div>
      </el-form>
    </div>

    <div class="table-page">
      <table-pagination
        v-if="configSet.showPage"
        @size-change="changeSize"
        @page-change="changePage"
        :pageNum="page.pageNum"
        :pageSize="page.pageSize"
        :total="total"
      ></table-pagination>
    </div>
  </div>
</template>

<script>
import tablePagination from "@/components/tableGroup/tablePagination";
import "@/commom/vdirective";

export default {
  components: { tablePagination },
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
  watch: {
    defaultList: {
      handler(val) {
        if (val.length) {
          val.forEach((row) => {
            this.$refs.elTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.elTable.clearSelection();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  mounted() {
    this.$emit("getList", { pageNum: this.pageNum, pageSize: this.pageSize });
    setTimeout(() => {
      this.maxTableH = `${this.$refs.tableWrapper.clientHeight - 60}px`;
      let tempH = `${45 * this.tableForm.tableData.length + 46}`;
      if (this.isAdd) {
        tempH = `${55 * this.tableForm.tableData.length + 46}`;
      }
      if (tempH < 450) {
        this.tableH = "450px";
      } else {
        this.tableH = `${tempH}px`;
      }
      if (this.defaultList.length) {
        this.defaultList.forEach((row) => {
          this.$refs.elTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.elTable.clearSelection();
      }
    }, 300);
    window.onresize = () => {
      setTimeout(() => {
        this.maxTableH = `${this.$refs.tableWrapper.clientHeight - 60}px`;
        let tempH = `${45 * this.tableForm.tableData.length + 46}`;
        if (this.isAdd) {
          tempH = `${55 * this.tableForm.tableData.length + 46}`;
        }
        if (tempH < 450) {
          this.tableH = "450px";
        } else {
          this.tableH = `${tempH}px`;
        }
      }, 300);
    };
  },
  updated() {
    this.maxTableH = `${this.$refs.tableWrapper.clientHeight - 60}px`;
    let tempH = `${45 * this.tableForm.tableData.length + 46}`;
    if (this.isAdd) {
      tempH = `${55 * this.tableForm.tableData.length + 46}`;
    }
    if (tempH < 450) {
      this.tableH = "450px";
    } else {
      this.tableH = `${tempH}px`;
    }
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
      let temp = []
      this.tableHead.forEach(el => {
        if(!el.hidden) {
          temp.push(el)
        }
      })
      return Object.assign({}, temp);
    }
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
    validTable(callback) {
      this.$refs["tableForm"].validate(valid => {
        if (valid) {
            callback && callback(valid)
          } else {
            callback && callback(valid)
          }
      });
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
#bkTable {
  background-color: #fff;
  padding: 20px;
  padding-bottom: 0;
  box-sizing: border-box;
  height: calc(100% - 30px);
  box-shadow: 0px 0px 21px 0px rgba(211, 219, 232, 0.5);
  border-radius: 4px;
  ::v-deep .el-form {
    height: 100%;
    .el-table {
      // border-left: 1px solid #ebeef5;
      border: 1px solid #EBEEF5;
      &:before {
        content: "";
        height: 0;
      }
      .cell {
        height: 32px;
        line-height: 32px;
      }
      // .el-table__body-wrapper {
      //   border-bottom: 1px solid #ebeef5;
      // }
      .el-table__body {
        // border-left: 1px solid #ebeef5;
        // border-right: 1px solid #ebeef5;
        // &:after {
        //   content: "";
        //   position: absolute;
        //   background-color: #ebeef5;
        //   z-index: 1;
        //   top: 0;
        //   right: 0;
        //   width: 1px;
        //   height: 100%;
        // }
      }
    }
  }
  .desc {
    background-color: #fff;
    height: auto;
  }
  .btn-box {
    display: inline-block;
    margin-right: 8px;
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
      .cell {
        height: 32px;
        line-height: 32px;
        .el-input {
          width: 100%;
          .el-input__inner{
            height: 32px;
            line-height: 32px;
          }
        }
        .el-form-item__content {
          line-height: 32px;
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
