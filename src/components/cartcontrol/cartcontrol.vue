<template>
  <div class="cartcontrol-section">
    <transition name="fade">
      <div class="cart-wrapper" v-show="!food.num || food.num <= 0">
        <img src="../cartcontrol/cart.png" alt=""  class="cart-icon cart-decrease" @click.stop.prevent="addCart">
      </div>
    </transition>
    <transition name="fade">
      <div class="cartcontrol" v-show="food.num > 0">
        <div class="btn cart-decrease" v-if="food.num < 1"></div>
        <div class="btn cart-decrease-on" v-else  @click.stop.prevent="decreaseCart"></div>
        <div class="cart-count" v-if="food.num">{{food.num}}</div>
        <div class="cart-count" v-else>0</div>
        <div v-if="food.num >= food.store" class="btn cart-add" @click.stop.prevent="addCart"></div>
        <div  v-else class="btn cart-add-on" @click.stop.prevent="addCart"></div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import { addCart, updateCart} from '@/api/goods'
export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart (event) {
      if (this.food.num >= this.food.store) {
        // this.$layer.msg('库存不足！')
        return
      }
      // this.$axios({
      //   url: this.GLOBAL.BASE_URL + '/front/cart/addCart',
      //   method: 'post',
      //   headers: {
      //     'canteenId': this.$store.state.canteenId,
      //     'token': this.$store.state.token
      //   },
      //   data: this.$qs.stringify({
      //     'classId': this.food.classId,
      //     'date': this.food.date,
      //     'productId': this.food.id,
      //     'type': 1
      //   })
      // })
      
      let patientId = this.$store.getters.patientData.memberId
        addCart({
          'classId': this.food.classId,
          'date': this.food.date,
          'productId': this.food.id,
          'type': 2,
          'isAdd': this.$store.state.goods.isAdd,
          patientId
        }).then(respanse => {
          if (respanse.code !== 0) {
            this.$layer.msg(respanse.message)
          } else {
            this.$store.commit('setCart')
          }
        })
      this.$emit('cart-add', event.target)
    },
    decreaseCart (event) {
      if (this.food.num > 0) {
        let patientId = this.$store.getters.patientData.memberId
        updateCart({
            'cartId': this.food.cartId,
            'num': -1,
            'isAdd': this.$store.state.goods.isAdd,
        }).then(respanse => {
          if (respanse.code !== 0) {
            this.$layer.msg(respanse.message)
          } else {
            this.$store.commit('setCart')
          }
        })
      }
    }
  }
}
</script>

<style scoped>
  .cartcontrol-section{
    position: relative;
  }
  .cartcontrol{
    /*width: 1.72rem;*/
    font-size: 0;
    border: 1px solid #eae5e5;
    border-radius: 0.05rem;
    overflow: hidden;
  }
  .cart-icon{
    position: absolute;
    right: 0;
    bottom: 0;
    display: block;
    width: 0.54rem;
    height: 0.54rem;
  }
  .cartcontrol .btn{
    display: inline-block;
    vertical-align: middle;
    width: 0.54rem;
    height: 0.52rem;
  }
  .cartcontrol .btn.cart-decrease{
    background: url("../cartcontrol/remov02.png") no-repeat center center #f9f9f9;
    background-size: 0.2rem 2px;
  }
  .cartcontrol .btn.cart-decrease-on{
    background: url("../cartcontrol/remov02_on.png") no-repeat center center #f9f9f9;
    background-size: 0.2rem 2px;
  }
  .cartcontrol .btn.cart-add{
    background: url("../cartcontrol/add.png") no-repeat center center #f9f9f9;
    background-size: 0.2rem;
  }
  .cartcontrol .btn.cart-add-on{
    background: url("../cartcontrol/add_on.png") no-repeat center center #f9f9f9;
    background-size: 0.2rem;
  }
  .cartcontrol .cart-count{
    display: inline-block;
    vertical-align: middle;
    width: 0.62rem;
    line-height: 0.52rem;
    text-align: center;
    font-size: 0.3rem;
    color: #222;
  }
  .fade-enter-active{
    transition: all 0.2s;
  }
  .fade-leave-active{
    transition: all 0s;
  }
  .fade-enter,.fade-leave-to{
    opacity: 0;
    background: rgba(0, 0, 0, 0);
  }
</style>
