import Vue from 'vue'
import Vuex from 'vuex'
import home from './modules/home'
import user from './modules/user'
import goods from './modules/goods'
import patient from './modules/patient'
import address from './modules/address'

import createLogger from 'vuex/dist/logger'
import getters from './getters'

Vue.use(Vuex)
const debug = false

export default new Vuex.Store({
  modules: {
    home,
    user,
    goods,
    patient,
    address
  },
  getters,
  plugins: debug ? [createLogger()] : [] // 是否开启vuex的debug模式
})
