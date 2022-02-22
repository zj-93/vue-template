<template>
  <div class="btn_list_box">
    <div
      v-if="config.type == 'text' && (config.isShow ? config.isShow(data) : true)"
      :class="config.btnClass"
      class="render-text-btn"
      @click="config.handleClick(data)"
    >
      <span>{{ config.name }}</span>
    </div>
    <el-button
      v-else-if="(config.isShow ? config.isShow(data) : true)"
      type="primary"
      :plain="config.plain || 'plain'"
      :class="config.btnClass"
      :size="config.size || 'medium'"
      @click="config.handleClick(data)"
      >{{ config.name }}</el-button
    >
  </div>
</template>

<script>
export default {
  name: "Btn",
  props: {
    config: {
      type: Object,
      equired: true,
      default: () => {},
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style>
.search-btn.el-button--primary.el-button--medium {
  border: none;
  background-color: #206bff;
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
.update-btn.el-button--primary.el-button--medium {
  color: #206bff;
  border: 1px solid #206bff;
  background-color: #fff;
}
.update-btn.el-button--primary.el-button--medium:hover {
  background-color: #206bff;
  color: #fff;
}
.update-btn.el-button--primary.el-button--medium:active {
  border-color: #105df4;
  background-color: #105df4;
}
.render-text-btn {
  color: #2d82ff;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
}
.delete-btn.el-button--primary.el-button--medium{
  color: #ff5d5d !important;;
  border: 1px solid #ff5d5d !important;;
  background-color: #fff !important;;
}
.delete-btn.el-button--primary.el-button--medium:hover {
  background-color: #ff5d5d !important;;
  border-color: #ff5d5d !important;;
  color: #fff !important;;
}
.delete-btn.el-button--primary.el-button--medium:active {
  border-color: #f24848 !important;;
  background-color: #f24848 !important;;
} 
</style>