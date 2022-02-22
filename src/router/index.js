import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'
import Dashboard from '@/layout/dashboard'

// 注册路由插件
Vue.use(VueRouter)

// 解决当前路由重复点击跳转报错
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err);
};
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

// 路由JSON
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/page/login/index.vue'),
  },
  {
    path: '/404',
    component: () => import('@/page/404'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/home',
    meta: {
      title: 'Home',
      icon: 'table'
    },
    children: [{
      path: '/home',
      name: 'Home',
      component: () => import('@/page/home.vue'),
      meta: {
        title: 'Home',
        icon: 'table'
      }
    }]
  },
  {
    path: '/example',
    component: Layout,
    name: 'Example',
    meta: {
      title: 'Example',
      icon: 'example'
    },
    children: [{
        // path: 'form',
        path: 'form/:id', // 用于多tag
        name: 'Form',
        component: () => import('@/page/form.vue'),
        meta: {
          title: 'Form',
        }
      },
      {
        path: 'about',
        // path: 'about/:id', // 用于多tag
        name: 'About',
        component: () => import('@/page/about.vue'),
        meta: {
          title: 'About',
        }
      }
    ]
  },
  {
    path: '/table',
    component: Layout,
    redirect: '/table/tableForm',
    name: 'Table',
    meta: {
      title: 'Table',
      icon: 'table'
    },
    children: [{
        path: 'tableForm',
        name: 'TableForm',
        component: () => import('@/page/home.vue'),
        meta: {
          title: 'tableForm',
          icon: 'tableForm'
        }
      },
      {
        path: 'echart',
        name: 'Echart',
        component: Dashboard,
        redirect: '/table/echart/pictrue',
        meta: {
          title: 'echart',
          icon: 'echart'
        },
        children: [{
          path: 'pictrue',
          name: 'Pictrue',
          component: () => import('@/page/home.vue'),
          meta: {
            title: 'pictrue',
            icon: 'pictrue'
          }
        }]
      }
    ]
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const router = new VueRouter({
  routes
})

export default router