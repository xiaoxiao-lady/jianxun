function getData (item) {
  if (item) {
    return JSON.parse(item)
  }
  return ''
}
const user = {
  state: {
    addressData: getData(sessionStorage.getItem('addressData')) || {
      address: '',
      mobile: '',
      name: '',
      bedId: '',
      id: ''
    },
    build: '',
    area: '',
  },

  mutations: {
    SET_ADDRESSDATA: (state, data) => {
      state.addressData = data
      sessionStorage.setItem('addressData', data && JSON.stringify(data))
    }
  },

  actions: {
    // 设置地址
    Set_addressData ({ commit }, data) {
      return new Promise((resolve, reject) => {
        commit('SET_ADDRESSDATA', data)
        resolve()
      })
    }
  }
}

export default user
