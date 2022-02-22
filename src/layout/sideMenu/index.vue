<template>
  <div class="menu">
    <i
      @click="handleClick"
      class="handler"
      :class="isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'"
    ></i>
    <el-menu
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      :default-active="defaultActive"
      :default-openeds="defaultOpeneds"
    >
      <template>
        <div v-for="(item, index) in menuList" :key="index">
          <el-submenu
            :index="item.path"
            v-if="item.children && item.children.length > 1"
          >
            <template>
              <template slot="title">
                <i class="el-icon-location"></i>
                <!-- <svg-icon icon-class="eye" /> -->
                <span slot="title">{{ item.name }}</span>
              </template>
              <template>
                <div v-for="(elm, index) in item.children" :key="index">
                  <template v-if="elm.children">
                    <el-submenu
                      v-for="dom in elm.children"
                      :key="dom.path"
                      :index="`${item.path}/${elm.path}`"
                    >
                      <span slot="title">{{ elm.name }}</span>
                      <el-menu-item
                        v-for="(el, index) in elm.children"
                        :class="{
                          'menu-active':
                            curPath == `${item.path}/${elm.path}/${el.path}`,
                        }"
                        :key="index"
                        :index="`${item.path}/${elm.path}/${el.path}`"
                        @click="
                          handleSelect(
                            `${item.path}/${elm.path}/${el.path}`,
                            el.name
                          )
                        "
                        >{{ el.name }}</el-menu-item
                      >
                    </el-submenu>
                  </template>

                  <el-menu-item
                    v-else
                    :class="{ 'menu-active': curPath == `${item.path}/${elm.path}` }"
                    :index="`${item.path}/${elm.path}`"
                    @click="handleSelect(`${item.path}/${elm.path}`, elm.name)"
                    >{{ elm.name }}</el-menu-item
                  >
                </div>
              </template>
            </template>
          </el-submenu>
          <template v-else>
            <el-menu-item
              v-for="(elm, index) in item.children"
              :key="index"
              :class="{ 'menu-active': curPath == `${elm.path}` }"
              :index="elm.path"
              @click="handleSelect(`${elm.path}`, elm.name)"
            >
              <i class="el-icon-menu"></i>
              <span slot="title">{{ elm.name }}</span>
            </el-menu-item>
          </template>
        </div>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      menuList: [],
      curPath: "",
      defaultActive: "",
      defaultOpeneds: [""],
    };
  },
  computed: {},
  watch: {
    $route: {
      handler(to, from) {
        this.curPath = to.path;
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    // 初始化tab菜单栏缓存数据
    if (sessionStorage.getItem("tabbar")) {
      this.$store.commit(
        "SET_BAR_LIST",
        JSON.parse(sessionStorage.getItem("tabbar"))
      );
    } else {
      this.$store.dispatch("addBarList", {
        keyPath: this.$route.path,
        key: this.$route.name,
      });
    }
    this.$store.dispatch("setDeptList").then((res) => {
      this.menuList = res;
    });
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath, "open");
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath, "close");
    },
    handleClick() {
      this.isCollapse = !this.isCollapse;
    },
    // 点击菜单，生成Tag标签集合
    handleSelect(keyPath, key) {
      // 多窗口
      // 通过随机数生成动态路由
      let num = Math.random()
      this.$router.push({name: key, params: {id: num}})
      // 将地址，名称，随机数存入vuex，标签点击时可以跳转回去
      this.$store.dispatch('addBarList', { keyPath: keyPath.replace(':id', num), key, num})
      // 单窗口
      // this.$router.push({ name: key });
      // this.$store.dispatch("addBarList", { keyPath, key });
    },
  },
};
</script>

<style scoped lang="less">
.menu {
  height: 100%;
  .handler {
    font-size: 36px;
    float: right;
    position: relative;
    z-index: 11;
    cursor: pointer;
    margin-right: 5px;
    display: none;
  }
  & > .el-menu {
    height: 100%;
    // padding-top: 40px;
  }
  .is-active {
    color: #303133;
  }
  .menu-active {
    color: #409eff;
  }
}
/deep/ .el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
