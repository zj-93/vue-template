<template>
  <div class="app-main">
    <header class="header">
      <img class="app-logo" src="@/image/logo.png" alt="" />
      <span class="app-wellcom">您好，欢迎来到枣阳人民医院智慧门户！</span>
      <div class="app-user">
        <!-- <div class="mes-setting">
          <i class="el-icon-message"></i>
          <el-badge :value="10" :max="99" class="item">消息中心</el-badge>
        </div>
        <div class="sys-setting">
          <i class="el-icon-setting"></i>
          <span class="sys-name"
            >系统设置<i class="el-icon-caret-bottom"></i
          ></span>
        </div> -->
        <div class="user-info">
          <img class="user-icon" src="@/image/userIcon.png" alt="" />
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ userInfo.name
              }}<i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </header>
    <div class="app-bottom">
      <div class="app-menu">
        <i :class="isCollapse ? 'collapse' : 'expand'" @click="handleCollapse"></i>
        <SideMenu v-if="isCollapse"/>
      </div>
      <section class="app-content">
        <xTabbar></xTabbar>
        <transition name="fade-transform" mode="out-in">
          <keep-alive>
            <div class="routerView" id="routerView">
              <router-view :key="key" />
            </div>
          </keep-alive>
        </transition>
        <div class="pageFooter">技术支持：武汉博科国泰信息技术有限公司</div>
      </section>
    </div>
  </div>
</template>

<script>
import SideMenu from "@/layout/sideMenu";
import xTabbar from "./xTabbar/xTabbar";

export default {
  name: "AppMain",
  components: {
    SideMenu,
    xTabbar,
  },
  data() {
    return {
      userInfo: {
        name: "123",
      },
      fullList: ["/monitorScreen"],
      isCollapse: true
    };
  },
  computed: {
    key() {
      return this.$route.path;
    },
  },
  methods: {
    fullScreen() {
      var elem = document.getElementById("monitorScreen");
      this.requestFullScreen(elem);
    },
    requestFullScreen(element) {
      var requestMethod =
        element.requestFullScreen ||
        element.webkitRequestFullScreen || //谷歌
        element.mozRequestFullScreen || //火狐
        element.msRequestFullScreen; //IE11
      if (requestMethod) {
        requestMethod.call(element); //执行这个请求的方法
      } else if (typeof window.ActiveXObject !== "undefined") {
        //window.ActiveXObject判断是否支持ActiveX控件
        //这里其实就是模拟了按下键盘的F11，使浏览器全屏
        var wscript = new ActiveXObject("WScript.Shell"); //创建ActiveX
        if (wscript !== null) {
          //创建成功
          wscript.SendKeys("{F11}"); //触发f11
        }
      }
    },
    handleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  },
};
</script>

<style scoped lang="less">
.app-main {
  width: 100%;
  height: 100%;
  .header {
    background-color: #ffffff;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e8eaed;
    .app-logo {
      width: 150px;
      height: 40px;
      padding: 10px 20px;
    }
    .app-wellcom {
      display: inline-block;
      vertical-align: top;
    }
    .app-user {
      float: right;
      margin-right: 22px;
      .user-info {
        display: inline-block;
        /deep/ .el-dropdown {
          color: #111;
        }
        .user-icon {
          width: 30px;
          height: 30px;
          vertical-align: middle;
          margin-right: 12px;
          margin-bottom: 5px;
        }
      }
      .sys-setting {
        display: inline-block;
        cursor: pointer;
        &::before {
          content: "";
          display: inline-block;
          width: 1px;
          height: 20px;
          background-color: #dedede;
          margin: 0 20px;
          vertical-align: middle;
        }
        /deep/ .el-icon-setting {
          font-size: 24px;
          color: #666666;
          vertical-align: middle;
          margin-bottom: 5px;
          margin-right: 10px;
        }
        .sys-name {
          font-size: 16px;
          color: #111;
        }
      }
      .mes-setting {
        display: inline-block;
        line-height: normal;
        cursor: pointer;
        .el-badge {
          margin-bottom: 5px;
        }
        /deep/ .el-icon-message {
          font-size: 24px;
          color: #666666;
          vertical-align: middle;
          margin-right: 10px;
          margin-bottom: 5px;
        }
      }
    }
  }
  .app-bottom {
    display: flex;
    height: calc(100% - 62px);
    .app-menu {
      height: 100%;
      position: relative;
      .collapse {
        position: absolute;
        top: 40%;
        right: -8px;
        width: 8px;
        height: 67px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAABDCAYAAAChkEQkAAABbElEQVRIie3Wy0ocQRTG8X/bpcxlI8aReImXqImOGRVc5DHygskDhIBP4AsIKkYxos7YKoijC8cZe2xo7f6yEi0vU6AbhSmo1flxqCqKcw6SYkm7kn5K+i6J+xs9Xr8ldbcCkrQjqdAKSNKSJDxJ4vn1wwUWXeDYBZKOFkEA3wVogzZ4PTiv1Tg+qQJgHgabzStW1v6SpCkf+wp2BklsbP0jSVMGB/rxfd8GweERF/UGmUyG4tdJ+wxh2GSvEgBQKk5hjLkDt6nTNOXT0CC9H3rsW1SCA+qNS7LZLNNfJuxrxvE1leAQgNHhIXzft0FXVydjI8PcZoqi6PFDTY6P0VfoJY6vWV3fJEkSG3iex9y3Ivl8jsswZGNr2wYAxhgW5mcxxlA9PaO8f2ADgHwux3xpBs/zKO8H3NwkT9eok9Mzoiji8+iIs4i93S/XBu8TOHtW1QWWnZ3X2btf1P3/6MH8EEralvRLT0wg/wEBmGhcpKgcdQAAAABJRU5ErkJggg==);
        background-position: 100%;
        background-size: cover;
        transform: translateY(-50%);
        cursor: pointer;
        display: none;
      }
      .expand{
        position: absolute;
        top: 40%;
        right: -8px;
        width: 8px;
        height: 67px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAABDCAYAAAChkEQkAAABMklEQVRIie3Wz0oCURTH8V/j1NhKLYLC2pWY/aM2PUYvWA8QQU/QC7QqUlOHFlFko6RtcpQr8W1XTjN6qVWQB+7qfuDcc7mccwUYwAeOgUNAo0vE4xTITgIADWBpEgC4ADQDoPFxZAPnNvBkA+/OhE1JStmApmAKfg56vVBBqz0elG9rurqpJCJHkvIry5Kkat2XMcM4WFvNa3EhJ2OMqvVG8iF3tjbluikFrXYk1SeYT6dV3FgfSWXiZUZT+XFgzFBh2JckzbpuFAC6LlfUHwyUzWRUKhaioO7fqdN9lefN6WBvW47jfIHmc6D7h0c5jqP93R15nhetohm0JEmlYkG5bCZ6lQBh2Oel001sVLYG8nde1BT8E2CdWYENXFonr3V2/2r6n/Ht//AG1IATEn4gH9wibk9HZ/bJAAAAAElFTkSuQmCC);
        background-position: 100%;
        background-size: cover;
        transform: translateY(-50%);
        cursor: pointer;
        display: none;
      }
    }
    .app-content {
      flex: 1;
      padding: 0;
      box-sizing: border-box;
      background-color: #eff0f5;
      padding: 4px 22px;
      overflow: hidden;
      .routerView {
        // padding: 4px 0;
        margin-top: 4px;
        padding-bottom: 0px;
        box-sizing: border-box;
        height: calc(100% - 40px);
        background: #fff;
        & > div {
          height: 100%;
          padding: 20px 30px;
          box-sizing: border-box;
        }
      }
      .pageFooter {
        font-size: 12px;
        text-align: center;
        line-height: 18px;
        color: #999999;
        background-color: #eff0f5;
      }
    }
  }
}
</style>
