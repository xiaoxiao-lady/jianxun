<template>
  <div class="cartcontrol">
    <img src="../cartcontrol/remov.png" alt="" class="btn cart-decrease" @click.stop.prevent="decreaseCart">
    <div class="cart-count" v-if="food.num">{{food.num}}</div>
    <div class="cart-count" v-else>0</div>
    <img src="../cartcontrol/add.png" alt="" class="btn cart-add" @click.stop.prevent="addCart">
  </div>
</template>

<script type="text/ecmascript-6">
import { addCart, updateCart } from '@/api/goods'
export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart (event) {
      let { classId, date, id, store } = this.food
      if (this.food.num >= store) {
        return
      }
      let params = {
        classId,
        date,
        productId: id,
        type: 2, // 类型.1职工，2订餐员,3病患，4包厢
        isAdd: this.$store.state.goods.isAdd
      }
      addCart(params).then(res => {
        if (res.code !== 0) {
          this.$layer.msg(res.message)
        } else {
          this.$store.dispatch('setCart')
        }
      })
      this.$emit('cart-add', event.target)
    },
    decreaseCart (event) {
      if (this.food.num > 0) {
        let { cartId } = this.food
        let params = {
          isAdd: this.$store.state.goods.isAdd,
          cartId,
          num: -1
        }
        updateCart(params).then(res => {
          if (res.code !== 0) {
            this.$layer.msg(res.message)
          } else {
            // this.$store.commit('setCart')
            this.$store.dispatch('setCart')
          }
        })
      }
    }
  }
}
</script>

<style scoped>
  .cartcontrol{
    font-size: 0;
  }
  .cartcontrol .cart-decrease{
    display: inline-block;
    vertical-align: middle;
    width: 0.42rem;
    height: 0.42rem;
    padding: 0.1rem;
  }
  .cartcontrol .btn{
    display: inline-block;
    vertical-align: middle;
    width: 0.42rem;
    height: 0.42rem;
    padding: 0.1rem;
  }
  .cartcontrol .cart-decrease{
    padding-right: 0;
  }
  .cartcontrol .cart-add{
    padding-left: 0;
  }
  .cartcontrol .cart-count{
    display: inline-block;
    vertical-align: middle;
    width: 0.66rem;
    line-height: 0.62rem;
    text-align: center;
    font-size: 0.3rem;
    color: #222;
  }
</style>
