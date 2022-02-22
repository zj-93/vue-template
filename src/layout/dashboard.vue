<template>
  <section class="app-content">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {};
  },
  computed: {
    key() {
      return this.$route.path;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="less"></style>
