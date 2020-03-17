function getPatientData (item) {
  if (item) {
    return JSON.parse(item)
  }
  return {}
}
const patient = {
  state: {
    patientData: getPatientData(sessionStorage.getItem('patientData'))
  },

  mutations: {
    SET_PATIENTDATA: (state, data) => {
      state.patientData = data
      sessionStorage.setItem('patientData', JSON.stringify(data))
    }
  },

  actions: {
    SetPatientData ({ commit }, data) {
      return new Promise((resolve, reject) => {
        commit('SET_PATIENTDATA', data)
        resolve()
      })
    }
  }
}

export default patient
