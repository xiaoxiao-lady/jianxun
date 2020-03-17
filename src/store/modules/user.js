import { loginByUsername } from '@/api/login'
import { getToken, setToken } from '@/utils/auth'

const user = {
  state: {
    canteenId: sessionStorage.getItem('canteenId') || '',
    token: getToken(),
    username: sessionStorage.getItem('username') || ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_CANTEENID: (state, canteenId) => {
      state.canteenId = canteenId
      sessionStorage.setItem('canteenId', canteenId)
    },
    SET_USERNAME: (state, name) => {
      state.username = name
      sessionStorage.setItem('username', name)
    }
  },

  actions: {
    // 设置食堂Id
    setCanteenId ({ commit }, canteenId) {
      commit('SET_CANTEENID', canteenId)
    },
    // 用户名登录
    LoginByUsername ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo).then(response => {
          if (response && response.code === 0) { // 登录成功
            commit('SET_TOKEN', response.result)
            commit('SET_USERNAME', response.username)
            setToken(response.result)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
