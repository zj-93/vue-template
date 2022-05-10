<template>
 <div>
   {{Math.random()}}
 </div>
</template>

<script>
  // import SideMenu from '@/layout/sideMenu'

 export default {
   name: '',
   components: {
    //  SideMenu
   },
   data () {
     return {

     }
   },
   computed: {
     key() {
      return this.$route.path;
    },
   },
   watch: {

   },
   created() {

   },
   mounted() {

   },
   methods: {

   },
 }
</script>

<style scoped lang='less'>

</style>