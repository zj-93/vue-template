<template>
  <div id="app">
    <router-view  />
    <!-- <Layout /> -->
  </div>
</template>

<script>
import  './components/bkForm/index.jsx'
import Layout from "@/layout";
export default {
  components: {
    Layout,
  },
};
</script>
