<template>
  <div class="editOrDetail" :class="!isAdd ? 'bk-detail' : 'bk-edit'">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="ruleJ"
      label-width="100px"
      class="bk-form"
    >
      <div
        v-for="(item, index) in dataJ"
        :key="index"
        class="bk-item"
        :style="{
          width:
            item.width ||
            (item.type == 'search' && item.type == 'auto') ||
            config.autoWith ||
            '20%',
        }"
        :class="item.itemClass"
      >
        <!-- input输入框:class="{ 'no-border': item.type == 'upload' }" -->
        <el-form-item
          v-if="item.type == 'input' || item.type == 'textarea'"
          :prop="item.prop"
          :class="item.class"
          :label="item.label"
          :label-width="item.labelWidth || '100px'"
        >
          <div
            v-if="isAdd || config.type == 'add'"
            :style="{
              display: item.showBtn ? 'flex' : 'block',
            }"
          >
            <el-input
              v-model="ruleForm[item.prop]"
              :type="item.type"
              :maxlength="item.maxLength"
              :disabled="item.disabled"
              :clearable="!item.clearable"
              :placeholder="item.placeholder || `请输入${item.label}`"
              @input="item.input ? item.input() : null"
              @blur="item.blur ? item.blur() : null"
              @focus="item.focus ? item.focus() : null"
              @keyup.enter.native="sweepCode($event, item)"
            />
            <el-button
              v-if="item.showBtn"
              :type="item.btnConfig.type || 'primary'"
              :plain="item.btnConfig.plain || 'plain'"
              class="item_inline_btn"
              :class="item.btnConfig.className"
              @click="item.handleClick ? item.handleClick() : null"
              >{{ item.btnConfig.name }}</el-button
            >
          </div>
          <div class="bk-text" v-else>
            <el-tooltip
              class="item"
              effect="dark"
              :content="ruleForm[item.detailProp || item.prop]"
              placement="right"
            >
              <span>{{ ruleForm[item.detailProp || item.prop] }}</span>
            </el-tooltip>
          </div>
        </el-form-item>
        <!-- 下拉选择框 -->
        <el-form-item
          v-if="item.type == 'select'"
          :label="item.label"
          :prop="item.prop"
          :class="item.class"
          :label-width="item.labelWidth || '100px'"
        >
          <div v-if="isAdd || config.type == 'add'">
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
          <div class="bk-text" v-else>
            <el-tooltip
              v-if="item.formatter"
              class="item"
              effect="dark"
              :content="item.formatter(ruleForm[item.prop])"
              placement="right"
            >
              <span>{{ item.formatter(ruleForm[item.prop]) }}</span>
            </el-tooltip>
            <el-tooltip
              v-else
              class="item"
              effect="dark"
              :content="ruleForm[item.detailProp || item.prop]"
              placement="right"
            >
              <span>{{ ruleForm[item.detailProp || item.prop] }}</span>
            </el-tooltip>
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
          <div v-if="isAdd || config.type == 'add'">
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
          <div class="bk-text" v-else>
            <el-tooltip
              class="item"
              effect="dark"
              :content="ruleForm[item.detailProp || item.prop]"
              placement="right"
            >
              <span>{{ ruleForm[item.detailProp || item.prop] }}</span>
            </el-tooltip>
          </div>
        </el-form-item>
        <!-- 时间 -->
        <el-form-item
          v-if="['date', 'daterange', 'month'].includes(item.type)"
          :label="item.label"
          :prop="item.prop"
          :class="item.class"
          :label-width="item.labelWidth || '100px'"
        >
          <div v-if="isAdd || config.type == 'add'">
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
              :default-time="item.defaultTime || ''"
            />
          </div>
          <div class="bk-text" v-else>
            <span>{{ ruleForm[item.detailProp || item.prop] }}</span>
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
            v-if="isAdd || config.type == 'add'"
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
          <div class="bk-text" v-else>
            <span>{{ ruleForm[item.detailProp || item.prop] }}</span>
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
          <div v-if="isAdd || config.type == 'add'">
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
          <div class="bk-text" v-else>
            <span
              >{{ ruleForm[item.minprop] }} - {{ ruleForm[item.maxprop] }}</span
            >
          </div>
        </el-form-item>
        <!-- 单选 -->
        <el-form-item
          v-if="item.type == 'radio'"
          :label="item.label"
          :class="item.class"
          :label-width="item.labelWidth || '100px'"
          :required="ruleJ[item.minprop]"
        >
          <div v-if="isAdd || config.type == 'add'">
            <el-radio-group v-model="ruleForm[item.prop]">
              <el-radio
                v-for="(el, index) in item.options"
                :key="index"
                :label="el.value"
                >{{ el.label }}</el-radio
              >
            </el-radio-group>
          </div>
          <div class="bk-text" v-else>
            <span v-if="item.formatter">{{ item.formatter() }}</span>
            <span v-else>{{ ruleForm[item.detailProp || item.prop] }}</span>
          </div>
        </el-form-item>
        <!-- 多选 -->
        <el-form-item
          v-if="item.type == 'checkbox'"
          :label="item.label"
          :class="item.class"
          :label-width="item.labelWidth || '100px'"
          :required="ruleJ[item.minprop]"
        >
          <el-checkbox-group v-model="ruleForm[item.prop]">
            <el-checkbox
              v-for="(el, index) in item.options"
              :key="index"
              :label="el.value"
              >{{ el.label }}</el-checkbox
            >
          </el-checkbox-group>
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
        <!-- 上传 -->
        <el-form-item
          v-if="item.type == 'upload'"
          :label="item.label"
          :prop="item.prop"
          :class="item.class"
          :label-width="item.labelWidth || '100px'"
        >
          <!-- <uploadFile
            :limit="item.limit || 10"
            :fileList="ruleForm[item.showListProp]"
            :disabledFlag="!isAdd"
            @uploadImgSuccess="item.onsuccess($event, item)"
            @removeImg="item.removeImg($event, item)"
          /> -->
          <uploadFile
            :imgConfig="item.iconfig"
            :isAdd="isAdd"
            @upload-success="item.onsuccess($event, item)"
          />
        </el-form-item>
        <!-- slot -->
        <el-form-item
          v-if="item.type == 'slot'"
          :label="item.label"
          :prop="item.prop"
          :class="item.class"
          :label-width="item.labelWidth || '100px'"
        >
          <slot :name="item.prop"></slot>
        </el-form-item>
        <!-- render -->
        <el-form-item v-if="item.type == 'render'" class="btn-item">
          <div v-for="(ele, ind) in item.btnList" :key="ind" class="btn-box">
            <List :config="ele" :data="item" />
          </div>
        </el-form-item>
      </div>
    </el-form>
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

import uploadFile from "@/commom/uploadFile/newUpload.vue";
// import uploadFile from "@/commom/uploadFile/upload.vue";

export default {
  name: "EditOrDetail",
  components: {
    uploadFile,
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
  },
  data() {
    return {
      ruleFormList: ["select"], // 需要获取name值的插件
      ruleFormName: {}, // ruleForm字段对应name值
    };
  },
  computed: {},
  watch: {
    ruleForm: {
      handler(val) {
        // this.ruleForm
      },
    },
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.setInitValue();
    });
  },
  methods: {
    // onSuccess(event, item) {
    //   this.ruleForm[item.showListProp].push(event.data);
    //   if(Array.isArray(this.ruleForm[item.prop])) {
    //     this.ruleForm[item.prop].push(event.data.id)
    //   }
    // },
    // removeImg(event, item) {
    //   let ind = this.ruleForm[item.showListProp].findIndex(
    //     (el) => el.id == event.id
    //   );
    //   this.ruleForm[item.showListProp].splice(ind, 1);
    //   this.ruleForm[item.prop].splice(ind, 1);
    // },
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
    resetForm() {
      this.$refs["ruleForm"].resetFields();
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
    sweepCode($event, item) {
      if (!item.isScan) {
        return;
      }
      $event.srcElement.select();
      this.$emit("sweep-code", item);
    },
  },
};
</script>
<style lang="scss" scoped>
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
.editOrDetail {
  // overflow: hidden;
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
      .item_inline_btn {
        margin-left: 10px;
        margin-top: 3px;
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
      //  white-space: nowrap;
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
  border: none !important;
  background-color: #206bff !important;
  color: #fff !important;
}

.search-btn.el-button--primary.el-button--medium:hover {
  background-color: #105df4 !important;
}

.search-btn.el-button--primary.el-button--medium:active {
  background-color: #0445c5 !important;
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