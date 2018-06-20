import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 前台页
import index from '../views/showPage/index.vue'
import single from '../views/showPage/single.vue'
import list from '../views/showPage/list.vue'
import info from '../views/showPage/info.vue'

export const mainRoutes = [
  {
    path: '/',
    component: index
  },
  {
    path: '/single',
    component: single
  },
  {
    path: '/list',
    component: list
  },
  {
    path: '/info',
    component: info
  }
]


export default new Router({
  mode: 'hash',
  routes: mainRoutes
})
