import Vue from 'vue'
import App from './app.vue'
import router from './router/index.js'
import store from './store'
// import '../node_modules/swiper/swiper.min.css';

import '@/icons'
import '@/permission' // permission control
import '@/components/index.js'

import '@/styles/index.less' // global css

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' 


Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')