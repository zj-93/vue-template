<template>
  <div class="home">
    
  </div>
</template>

<script>
import { getUser} from '@/api/login'

export default {
  
  components: {},
  data() {
    return {};
  },
  mounted() {
    getUser()
  },
  methods: {},
};
</script>

<style lang="less" scoped>

</style>
