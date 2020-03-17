// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'
import store from './store'
import qs from 'qs'
import axios from 'axios'
import '../static/js/flexible.js'
import './permission'

import Mint from 'mint-ui'
import 'mint-ui/lib/style.css' // 引入css
import FastClick from 'fastclick'
import layer from 'vue-layer'
import 'vue-layer/lib/vue-layer.css';

import global_ from './Base.vue'
FastClick.attach(document.body) // permission control

Vue.prototype.$axios = axios
Vue.use(Mint) // 全局使用
Vue.use(Vuex)
Vue.config.productionTip = false
Vue.prototype.$layer = layer({
  msgtime: 3 //目前只有一项，即msg方法的默认消失时间，单位：秒
})
Vue.prototype.$qs = qs
// 设置全局变量
Vue.prototype.GLOBAL = global_

//注册几个全局组件
import nodata from '@/components/nodata/index' 
import menuindex from '@/components/menuIndex/index' 
Vue.use({
  install: function() {
    Vue.component('nodata', nodata)
  }
})
Vue.use({
  install: function() {
    Vue.component('menuindex', menuindex)
  }
})
Vue.filter('amountToFixed', function (value) {
  return parseFloat(value).toFixed(2)
})
window.addEventListener('popstate', function (e) {
  router.togoback() // router已经在上面import进来
}, false)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
