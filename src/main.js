// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'

import * as psyFun from './assets/js/public.js' //引入自定义函数
import 'normalize.css/normalize.css'
require('./assets/css/base.css') //引入基础css

Vue.config.productionTip = false

import {
  mainRoutes
} from './router'

// const whiteList = ['/login','/'];

// router.beforeEach((to, from, next) => {
//   // NProgress.start();
//   let userToken = Cookies.get("UserToken");
//   if (userToken != "null" && userToken != undefined) {
//     if (to.path === '/login') {
//       next({
//         path: '/'
//       });
//     } else {
//       next();
//     }
//   } else {
//     if (whiteList.indexOf(to.path) !== -1) {
//       next();
//     } else {
//       next('/login');
//     }
//   }

// });

router.afterEach((to,from,next) => {
  window.scrollTo(0,0);
});

//遍历方法，从而在过滤器中调用
Object.keys(psyFun).forEach(k => Vue.filter(k, psyFun[k]))
//将自定义方法赋给 prototype,实现全局调用
Vue.prototype.publicFun = psyFun

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
