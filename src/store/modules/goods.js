// import { loginByUsername } from '@/api/login'
// import { getToken, setToken } from '@/utils/auth'
import Vue from 'vue'
import store from '../index'
import { getMenuByDate, getCart } from '@/api/goods'

const goods = {
  state: {
    // canteenId: sessionStorage.getItem('canteenId') || '',
    // token: getToken(),
    // username: sessionStorage.getItem('username') || ''
    countsList: {}, // 购物车（用购物车里面的商品和菜单里面对比然后赋给职工订餐菜单）
    goodsData: {}, // 病患订餐菜单
    isAdd: sessionStorage.getItem('isAdd') || 0, //获取菜单是否加餐
  },

  mutations: {
    setIsAdd(state, value) {
      state.isAdd = value
      sessionStorage.setItem('isAdd', value)
    },
    // 获取购物车
    setCart (state) {
      let patientId = store.getters.patientData.memberId
      let params = {
        type: 2,
        patientId,
        isAdd: state.isAdd
      }
      getCart(params).then(res => {
        if (res.code !== 0) {
          this.$layer.msg(res.message)
        } else {
          let countsList = res.result
          state.countsList = countsList
          console.log(this.state.goods.goodsData)
          this.state.goods.goodsData.forEach((good) => {
            
            console.log(1)
            good.classDTOS.forEach((products) => {
              Vue.set(products, 'num', 0)
              var allNum = 0
              
              products.categoryDTOS.forEach((categoryDTO) => {
                if(categoryDTO.productDTOS) {
                  categoryDTO.productDTOS.forEach((goodsProduct) => {
                    // products.products.forEach((goodsProduct) => {
                    Vue.set(goodsProduct, 'num', 0)
                    if (countsList.counts) {
                      countsList.counts.forEach((count) => {
                        count.products.forEach((product) => {
                          if (goodsProduct.id === product.id && goodsProduct.date === product.date && goodsProduct.classId === product.classId) {
                            Vue.set(goodsProduct, 'num', product.num)
                            Vue.set(goodsProduct, 'cartId', product.cartId)
                          }
                        })
                      })
                    }
                    allNum += goodsProduct.num
                    // })
                  })
                }
                
              })
              Vue.set(products, 'num', allNum)
            })
          })
        }
      })
      // axios({
      //   url: global.BASE_URL + '/front/cart/getCart',
      //   method: 'post',
      //   headers: {
      //     'canteenId': this.state.canteenId,
      //     'token': this.state.token
      //   },
      //   data: qs.stringify({
      //     'type': 1
      //   })
      // })
      //   .then(respanse => {
      //     if (respanse.data.code !== 0) {
      //       this.$layer.msg(respanse.data.message)
      //     } else {
      //       let countsList = respanse.data.result
      //       state.countsList = countsList
      //       this.state.goods.forEach((good) => {
      //         good.classDTOS.forEach((products) => {
      //           Vue.set(products, 'num', 0)
      //           var allNum = 0
      //           products.products.forEach((goodsProduct) => {
      //             Vue.set(goodsProduct, 'num', 0)
      //             if (countsList.counts) {
      //               countsList.counts.forEach((count) => {
      //                 count.products.forEach((product) => {
      //                   if (goodsProduct.id === product.id && goodsProduct.date === product.date && goodsProduct.classId === product.classId) {
      //                     Vue.set(goodsProduct, 'num', product.num)
      //                     Vue.set(goodsProduct, 'cartId', product.cartId)
      //                   }
      //                 })
      //               })
      //             }
      //             allNum += goodsProduct.num
      //             Vue.set(products, 'num', allNum)
      //           })
      //         })
      //       })
      //     }
      //   })
    },

    //  获取商品列表
    getGoods (state) {
      state.goodsData = {}
      state.countsList = {}
      let params = {
        menuType: 2, // 类型.1职工，2订餐员 3病患
        patientId: store.getters.patientData.memberId,
        doctorAdviceId: store.getters.patientData.memberDoctorAdviceId,
        isAdd: state.isAdd
      }
      getMenuByDate(params).then(res => {
        if (res.code !== 0) {
          this.$layer.msg(res.message)
        } else {
          let goods = res.result
          // state.goods = goods
          // this.commit('setCart')
          state.goodsData = goods
          this.commit('setCart')
        }
      })
    }
  },

  actions: {
    setCart ({ commit }) {
      commit('setCart')
    },
    getGoods ({ commit }) {
      commit('getGoods')
    }
  }
}

export default goods
