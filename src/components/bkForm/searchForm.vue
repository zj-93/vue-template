<template>
  <div class="searchForm bk-edit">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="ruleJ"
      label-width="100px"
      class="bk-form"
    >
      <div
        v-for="(item, index) in formHead"
        :key="index"
        class="bk-item"
        :style="{
          width:
            item.width ||
            (item.type == 'search' && item.type == 'auto') ||
            config.autoWith ||
            '20%',
        }"
      >
        <!-- input输入框:class="{ 'no-border': item.type == 'upload' }" -->
        <el-form-item
          v-if="item.type == 'input' || item.type == 'textarea'"
          :prop="item.prop"
          :class="item.class"
          :label="item.label"
          :label-width="item.labelWidth || '100px'"
        >
          <div>
            <el-input
              v-model="ruleForm[item.prop]"
              :type="item.type"
              :disabled="item.disabled"
              :clearable="!item.clearable"
              :placeholder="item.placeholder || `请输入${item.label}`"
              @input="item.input ? item.input() : null"
              @blur="item.blur ? item.blur() : null"
              @focus="item.focus ? item.focus() : null"
              @keyup.enter.native="sweepCode($event, item)"
            />
          </div>
        </el-form-item>
        <el-form-item v-if="item.type=='slot'">
          <slot :name="item.prop"></slot>
        </el-form-item>
        <!-- 下拉选择框 -->
        <el-form-item
          v-if="item.type == 'select'"
          :label="item.label"
          :prop="item.prop"
          :class="item.class"
          :label-width="item.labelWidth || '100px'"
        >
          <div>
            <el-select
              v-model="ruleForm[item.prop]"
              :popper-append-to-body="false"
              :placeholder="item.placeholder || `请选择${item.label}`"
              :disabled="item.disabled"
              filterable
              default-first-option
              :remote="item.remote || false"
              :remote-method="item.remoteMethod || null"
              :clearable="!item.clearable"
              @change="item.change ? item.change() : null"
            >
              <el-option
                v-for="(ele, ind) in item.options"
                :key="ind"
                :label="
                  item.props && Object.keys(item.props).length
                    ? ele[item.props.label]
                    : ele.label
                "
                :value="
                  item.props && Object.keys(item.props).length
                    ? ele[item.props.value]
                    : ele.value
                "
              />
            </el-select>
          </div>
        </el-form-item>
        <!-- 级联 -->
        <el-form-item
          v-if="item.type == 'cascader'"
          :label="item.label"
          :prop="item.prop"
          :class="item.class"
          :label-width="item.labelWidth || '100px'"
        >
          <div>
            <el-cascader
              v-model="ruleForm[item.prop]"
              :append-to-body="false"
              :options="item.options"
              :props="item.props"
              :ref="item.refs || item.prop"
              :show-all-levels="item.showAllLevels || false"
              filterable
              :clearable="!item.clearable"
              @change="item.change ? item.change() : null"
            />
          </div>
        </el-form-item>
        <!-- 时间 -->
        <el-form-item
          v-if="['date', 'daterange'].includes(item.type)"
          :label="item.label"
          :prop="item.prop"
          :class="item.class"
          :label-width="item.labelWidth || '100px'"
        >
          <div>
            <el-date-picker
              v-model="ruleForm[item.prop]"
              :type="item.type"
              :format="item.format || 'yyyy-MM-dd'"
              :value-format="item.valueFormat || 'yyyy-MM-dd'"
              :start-placeholder="item.startPlaceholder || '开始日期'"
              :end-placeholder="item.endPlaceholder || '结束日期'"
              :placeholder="item.placeholder || `请选择${item.label}`"
              :picker-options="item.pickerOptions"
              :clearable="!item.clearable"
              :disabled="item.disabled"
            />
          </div>
        </el-form-item>
        <!-- 计数器 -->
        <el-form-item
          v-if="item.type == 'inputNumber'"
          :label="item.label"
          :prop="item.prop"
          :class="item.class"
          :label-width="item.labelWidth || '100px'"
        >
          <div
            :class="{ unitItem: item.unit }"
          >
            <el-input
              @input="item.input ? item.input() : null"
              type="number"
              min="0"
              :clearable="!item.clearable"
              :disabled="item.disabled"
              v-model="ruleForm[item.prop]"
              :placeholder="item.placeholder || `请输入${item.label}`"
            ></el-input>
            <span class="unitBox" v-if="item.unit">
              {{ item.unit }}
            </span>
          </div>
        </el-form-item>
        <!-- 计数器范围 -->
        <el-form-item
          v-if="item.type == 'numrange'"
          :label="item.label"
          :class="item.class"
          :label-width="item.labelWidth || '100px'"
          :required="ruleJ[item.minprop]"
        >
          <div>
            <el-col :span="11">
              <el-form-item :prop="item.minprop">
                <el-input
                  @input="item.input ? item.input() : null"
                  type="number"
                  :clearable="!item.clearable"
                  :disabled="item.disabled"
                  v-model="ruleForm[item.minprop]"
                  :placeholder="item.placeholder || `请输入最小值`"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item :prop="item.maxprop">
                <el-input
                  @input="item.input ? item.input() : null"
                  type="number"
                  :clearable="!item.clearable"
                  :disabled="item.disabled"
                  v-model="ruleForm[item.maxprop]"
                  :placeholder="item.placeholder || `请输入最大值`"
                ></el-input>
              </el-form-item>
            </el-col>
          </div>
        </el-form-item>

        <!-- 纯文本 -->
        <el-form-item
          v-if="item.type == 'text'"
          :label="item.label"
          :prop="item.prop"
          :class="item.class"
          :label-width="item.labelWidth || '100px'"
        >
          <div :class="item.textClass" class="bk-text-span">
            <span v-if="item.formatter">{{ item.formatter() }}</span>
            <span v-else>{{ ruleForm[item.detailProp || item.prop] }}</span>
          </div>
        </el-form-item>
      </div>
      <el-form-item class="btn-item" v-if="searchFlag">
        <div>
          <el-button
            type="primary"
            plain
            class="search-btn"
            size="medium"
            @click="search"
            >查询</el-button
          >
          <el-button
            type="primary"
            plain
            class="reset-btn"
            size="medium"
            @click="resetForm"
            >重置</el-button
          >
        </div>
      </el-form-item>
    </el-form>
    <div class="hanle_box" v-if="dataJ.length > 8">
      <span class="handler" @click="handleClick">{{flag ? '展开': '收起'}}<i :class="flag?'el-icon-arrow-down': 'el-icon-arrow-up'"></i></span>
    </div>
  </div>
</template>

<script>
// import mixins from './mixins'
/**
 * dataJ 数据源
 * ruleJ 表单验证数据源
 * type 详情（detail） || 新增(add)
 * ruleForm 表单数据
 */

// import uploadFile from "@/commom/uploadFile/upload.vue";

export default {
  name: "EditOrDetail",
  components: {
    // uploadFile,
  },
  model: {
    prop: "ruleForm",
    event: "formChange",
  },
  props: {
    // 数据源
    dataJ: {
      type: Array,
      default: () => [],
    },
    // 表单规则
    ruleJ: {
      type: Object,
      default: () => ({}),
    },
    // 表单数据
    ruleForm: {
      type: Object,
      default: () => ({}),
    },
    // 配置
    config: {
      type: Object,
      default: () => {
        return {
          type: "add",
          autoWith: "25%",
        };
      },
    },
    isAdd: {
      type: Boolean,
      default: true,
    },
    searchFlag: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      ruleFormList: ["select"], // 需要获取name值的插件
      ruleFormName: {}, // ruleForm字段对应name值
      formHead: [],
      flag: true,
    };
  },
  computed: {},
  watch: {
    dataJ: {
      handler(val) {
        if (this.flag) {
          this.formHead = val.slice(0, 8);
        } else {
          this.formHead = val;
        }
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.setInitValue();
    });
  },
  methods: {
    handleClick() {
      this.flag = !this.flag;
      if (this.flag) {
        this.formHead = this.dataJ.slice(0, 8);
      } else {
        this.formHead = this.dataJ;
      }
    },
    // ruleForm初始化
    setInitValue() {
      let ruleForm = {};
      this.dataJ.forEach((el) => {
        if (el.type != "render") {
          ruleForm[el.prop] = "";
        }
      });
      this.$emit("formChange", { ...ruleForm, ...this.ruleForm });
    },
    // 清除表单验证
    clearVaild(arr) {
      if (arr && arr.length) {
        arr.forEach((el) => {
          this.$refs.ruleForm.clearValidate(el);
        });
      } else {
        this.$refs.ruleForm.clearValidate();
      }
    },
    signalVaild(fileValue) {
      this.$refs.ruleForm.validateField(fileValue);
    },
    search() {
      this.$emit('search-form')
    },
    resetForm() {
      // this.$refs["ruleForm"].resetFields();
      this.dataJ.forEach((el) => {
        if (!el.noReset) {
          if (this.ruleForm[el.prop] instanceof Array) {
            this.ruleForm[el.prop] = [];
          } else if (this.ruleForm[el.prop] instanceof Object) {
            this.ruleForm[el.prop] = {};
          } else {
            this.ruleForm[el.prop] = "";
          }
        }
        if (el.defaultVal || el.defaultVal === 0 || el.defaultVal === null) {
          this.ruleForm[el.prop] = el.defaultVal;
        }
      });
      this.$emit('rest-form')
      this.$emit('search-form')
    },
    sweepCode($event, item) {
      if(!item.isScan) {
        return
      }
      $event.srcElement.select()
      this.$emit('sweep-code',item)
    },
    // 表单验证
    formValid() {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            resolve(true);
          } else {
            Object.keys(this.ruleJ).some((el) => {
              let obj = this.dataJ.find((item) => item.prop == el);
              let label = obj && (obj.label || obj.name);
              if (
                Array.isArray(this.ruleForm[el]) &&
                !this.ruleForm[el].length
              ) {
                label &&
                  this.$message({
                    type: "warning",
                    duration: 5000,
                    message: `请填写${label}`,
                  });
                return true;
              } else if (!this.ruleForm[el]) {
                label &&
                  this.$message({
                    type: "warning",
                    duration: 5000,
                    message: `请填写${label}`,
                  });
                return true;
              }
            });
            resolve(false);
          }
        });
      });
    },
    // 获取对应prop的name值
    async getValueName() {
      this.ruleFormName = {};
      await this.dataJ.forEach((el) => {
        if (this.ruleFormList.includes(el.type)) {
          let obj = el.options.find(
            (re) =>
              (el.props && re[el.props.value] == this.ruleForm[el.prop]) ||
              re.value == this.ruleForm[el.prop]
          );
          let name = obj ? (el.props ? obj[el.props.label] : obj.label) : "";
          let label = el.prop + "Name";
          this.$set(this.ruleFormName, [label], name);
        }
      });
      return this.ruleFormName;
    },
  },
};
</script>
<style lang="less" scoped>
.bk-detail {
  .bk-form {
    .bk-item {
      border-bottom: 1px solid #ccc;
      padding-bottom: 12px !important;
      padding-top: 12px !important;
      .bk-text-span {
        overflow: hidden;
        height: 40px;
        line-height: 40px;
      }
    }
  }
}
.searchForm {
  // overflow: hidden;
  display: flex;
  .hanle_box{
  position: relative;
  display: inline-block;
    width: 50px;
    margin-left: 5px;
    .handler{
    color: #206bff;
    font-size: 12px;
    position: absolute;
    bottom: 34px;
    left: 0;
    cursor: pointer;
  }
  }
  
  .bk-form {
    width: 100%;
    .no-border {
      border: none;
    }
    .bk-item {
      padding: 0 1%;
      display: inline-block;
      box-sizing: border-box;
      padding-bottom: 22px;
      vertical-align: bottom;
      ::v-deep .el-form-item {
        margin-bottom: 0;
      }
      ::v-deep .el-form-item__label {
        display: grid;
        height: 40px;
        line-height: 40px;
      }
      ::v-deep .el-date-editor {
        width: 100%;
      }
      ::v-deep .el-form-item__content {
        min-width: 60px;
      }
      ::v-deep input[type="number"] {
        padding-right: 10px;
      }
    }
    .bk-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      height: 40px;
      line-height: 40px;
    }
    .bk-text-span {
      overflow: initial;
      height: 40px;
      line-height: 40px;
    }
    .picture {
      .bk-item {
        border: none;
      }
    }
    .btn-item {
      display: inline-block;
      ::v-deep .el-form-item__content {
        margin: 0 !important;
      }
      .btn-box {
        display: inline-block;
        margin: 0 10px;
      }
    }
    .line {
      text-align: center;
    }
  }
  .unitItem {
    display: flex;
    .unitBox {
      margin-left: 3px;
      white-space: nowrap;
    }
  }
}
</style>
<style>
input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.search-btn.el-button--primary.el-button--medium {
  border: none;
  background-color: #206bff;
  color: #fff;
}

.search-btn.el-button--primary.el-button--medium:hover {
  background-color: #105df4;
}

.search-btn.el-button--primary.el-button--medium:active {
  background-color: #0445c5;
}

.reset-btn.el-button--primary.el-button--medium {
  border: none !important;
  background-color: #8794ae !important;
  color: #fff !important;
}
.reset-btn.el-button--primary.el-button--medium:hover {
  background-color: #7785a0 !important;
}
.reset-btn.el-button--primary.el-button--medium:active {
  background-color: #62718c !important;
}
</style>