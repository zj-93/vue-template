<template>
  <div id="XTabbar" class="XTabbar-wrap" :class="{'no-tab':!menus.length}">
    <div class="tabbar-list">
      <div class="tabbar-item" :class="{active: activeFlag(item.keyPath)}" v-for="(item, index) in menus" :key="index" @click="clickMenu(item)">
        <span class="menu-status"></span>{{item.key}}
        <div class="close" @click.stop="closeMenu(item, index)">×</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'XTabbar',
    data() {
      return {
        currentPath: ''
      }
    },
    created() {
      this.currentPath = this.$route.path
    },
    mounted() {},
    methods: {
      clickMenu(item) {
        // this.currentPath = item.keyPath;
        // this.$router.push(`${item.keyPath}`);.
        // this.$router.push({name: item.key, params: {id: item.num}})
        this.$router.push({path: item.keyPath})
      },
      closeMenu(item, index) {
        let nextPath = '';
        this.$store.dispatch('delBarList', index)
        if(this.menus.length > 0) {
          if(this.$route.path.indexOf(item.keyPath) < 0) {
            return
          }
          let idx  = index > 0 ? index - 1 : 0
          nextPath = this.menus[idx].keyPath
        } else {
          this.$store.dispatch("addBarList", { keyPath: '/home', key: 'Home' });
          nextPath = '/home';
        }
        this.$router.push(nextPath);
      },
      strEnd(str,endStr){
        // 判断字符串是否以endStr结尾
        var d = str.length - endStr.length;
        return (d >= 0 && str.lastIndexOf(endStr) == d)
      },
      activeFlag(path){
        // currentPath.indexOf(item.path) > -1
        if(path === this.currentPath) {
          return true
        }else if(this.strEnd(this.currentPath,"Detail")){
          let s = this.currentPath.split("Detail")[0];
          return s === path         
        }else if(this.strEnd(this.currentPath,"Edit")){
          let s = this.currentPath.split("Edit")[0];
          return s === path 
        }else {
          return false
        }
      }
    },
    computed: {
      menus() {
        return this.$store.getters.barList
      }
    },
    components: {},
    watch: {
      $route(n) {
        this.currentPath = n.path
      }
    }
  }
</script>

<style scoped lang="less">
  // @import '../../assets/css/variable.less';
  .XTabbar-wrap{
    // margin-bottom: 20px;
    width: 100%;
    height: 22px;
    // background-color: #fff;
    .tabbar-list{
      display: flex;
      // border-bottom:1px solid rgba(229,229,229,1);
      .tabbar-item{
        // padding: 0 10px 0 30px;
        height: 22px;
        padding: 0 8px;
        line-height: 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: #999999;
        border-radius: 3px;
        background-color: #fff;
        margin-right: 5px;
        .menu-status{
          display: inline-block;
          width: 10px;
          height: 10px;
          background-color: #E8EAEC;
          border-radius: 20px;
          margin-right: 13px;
        }
        // &:first-of-type{
          // border-left: 1px solid #e5e5e5;
        // }
        cursor: pointer;
        user-select: none;
        &.active{
          background-color: #fff;
           .menu-status{
             background-color: #018EED;
           }
        }
        .close{
          margin-left: 13px;
          font-size: 20px;
          color: #BDBDBD;
          &:hover{
            color: #ccc;
          }
        }
      }
    }
     &.no-tab{
      display: none;
      }
  }
</style>
