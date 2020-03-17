<template>
  <div>
    <div class="shopcart" @click="toggleList">
      <transition name="hide">
        <div class="bg" v-show="listShow"></div>
      </transition>
      <div class="content">
        <div class="shopcart-price"><span v-if="this.$store.state.goods.countsList.payAmount">￥{{this.$store.state.goods.countsList.payAmount}}</span></div>
        <button type="button" class="pay"  @click.stop="toFirmOrder">去下单</button>
      </div>
      <div class="dinner-plate">
        <img src="../shopcart/canhefanhe.png" alt="" class="icon">
        <i class="num" v-show="totalCount">{{totalCount}}</i>
      </div>
      <div class="ball-container">
        <div v-for="(ball, index) in balls" :key="index">
          <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow" >
          <span class="empty" @click="empty">清空</span>
          <div class="list-content">
            <ul>
              <li class="food breakfast" v-for="(count, index) in this.$store.state.goods.countsList.counts" :key="index">
                <div class="food-header">{{count.date}} {{count.weekName}} {{count.className}}<i class="status" v-if="count.status===0">失效</i></div>
                <div class="con border-bottom" v-for="(product, index) in count.products" :key="index">
                  <div class="icon" :style="{backgroundImage: 'url(' + product.image + ')'}" ></div>
                  <div class="text">
                    <div class="name" :class="{'on':count.status===0}">{{product.name}}</div>
                    <p class="desc">{{product.remark}}</p>
                    <div class="price">￥{{product.price}}</div>
                  </div>
                  <div v-if="count.status===1" class="cartcontrol-wrapper">
                    <cartcontrol :food="product" ></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>

<script>
import cartcontrol from '@/components/cartcontrol/cartcontrol'
// import { Toast } from 'mint-ui'
import { empty } from '@/api/goods'
export default {
  data () {
    return {
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      fold: true
    }
  },
  computed: {
    listShow () {
      var _this = this
      if (!this.totalCount) {
        _this.fold = true
        return false
      }
      let show = !this.fold
      return show
    },
    totalCount() {
      let num = 0
      if (this.$store.state.goods.countsList.counts) {
        this.$store.state.goods.countsList.counts.forEach((count) => {
          if (count.status === 1) {
            count.products.forEach((product) => {
              num += product.num
            })
          }
        })
      }
      return num
    }
  },
  created() {
  },
  methods: {
    drop(el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    },
    beforeDrop(el) {
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - (1.24 * document.documentElement.clientWidth / 7.5) // 52
          let y = -(window.innerHeight - rect.top - (0.96 * document.documentElement.clientWidth / 7.5)) // 42
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
          el.style.transform = `translate3d(0, ${y}px, 0)`
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
          inner.style.transform = `translate3d(${x}px, 0, 0)`
        }
      }
    },
    dropping(el, done) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0, 0, 0)'
        el.style.transform = 'translate3d(0, 0, 0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0, 0, 0)'
        inner.style.transform = 'translate3d(0, 0, 0)'
        el.addEventListener('transitionend', done)
      })
    },
    afterDrop(el) {
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    },
    toggleList() {
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
    },
    hideList() {
      this.fold = true
    },
    empty() {
      //  清空购物车
      let patientId = this.$store.getters.patientData.memberId
      empty({
          type: 2,
          patientId,
          isAdd: this.$store.state.goods.isAdd,
      }).then(respanse => {
        if (respanse.code !== 0) {
          this.$layer.msg(respanse.message)
        } else {
          this.$store.commit('setCart')
        }
      })
    },
    toFirmOrder () {
      if (this.$store.state.goods.countsList.payAmount > 0) {
        this.$router.push({path: '/firmOrder'})
      } else {
        this.$layer.msg('请选择有效商品')
      }
    }
  },
  components: {
    cartcontrol
  }
}
</script>

<style scoped>
  .shopcart{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    /*display: flex;*/
    padding: 0 0.6rem 0.13rem;
    height: 1.02rem;
  }
  .shopcart .content{
    display: flex;
    width: 100%;
    box-shadow: 0 -0.07rem 0.07rem 0 rgba(196, 194, 194, 0.35);
    border-radius: 0.51rem;
  }
  .shopcart .bg{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: -1;
    background-color: #fff;
  }
  .shopcart .shopcart-price{
    flex: 1;
    padding-left: 1.62rem;
    line-height: 1.02rem;
    font-size: 0.36rem;
    font-weight: bold;
    border-top-left-radius: 0.51rem;
    border-bottom-left-radius: 0.51rem;
    color: #fff;
    background-color: #565656;
  }
  .shopcart .pay{
    width: 2.16rem;
    line-height: 1.02rem;
    font-size: 0.36rem;
    font-weight: bold;
    border-top-right-radius: 0.51rem;
    border-bottom-right-radius: 0.51rem;
    background-color: #fd9025;
    color: #fff;
  }
  .shopcart .dinner-plate{
    position: absolute;
    left: 1.2rem;
    top: 0;
  }
  .shopcart .dinner-plate .icon{
    display: block;
    margin-top: 0.3rem;
    width: 0.4rem;
    height: 0.38rem;
  }
  .shopcart .dinner-plate .num{
    position: absolute;
    left: 0.4rem;
    top: -0.12rem;
    padding: 0 0.15rem;
    line-height: 0.44rem;
    font-size: 0.3rem;
    border-radius: 0.22rem;
    background-color: #ff5d2b;
    color: #fff;
  }
  .shopcart-list{
    position: absolute;
    left: 0;
    bottom: 1.15rem;
    z-index: -2;
    width: 100%;
    max-height: 7.6rem;
    overflow: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #fff;
    transform: translateY(0);
  }
  .fold-enter-active{
    transition: all 0.3s;
  }
  .fold-leave-active{
    transition: all 0.2s;
  }
  .fold-enter, .fold-leave-to{
    transform: translateY(100%);
  }
  .fade-enter-active{
    transition: all 0.3s;
  }
  .fade-leave-active{
    transition: all 0.2s;
  }
  .fade-enter,.fade-leave-to{
    opacity: 0;
    background: rgba(0, 0, 0, 0);
  }
  .hide-leave-active{
    transition-delay: 0.2s;
  }
  .shopcart-list .empty{
    position: absolute;
    right: 0;
    top: 0;
    padding: 0.18rem 0.26rem 0.12rem 0.37rem;
    line-height: 0.32rem;
    font-size: 0.26rem;
    background: url("../shopcart/delete.png") no-repeat left center;
    background-size: 0.28rem 0.3rem;
    color: #666666;
  }
  .shopcart-list .food .food-header{
    padding: 0 0.26rem;
    line-height: 0.62rem;
    font-size: 0.26rem;
    font-weight: bold;
    color: #222;
    background-color: #f6f6f6;
  }
  .shopcart-list .food .food-header .icon{
    display: inline-block;
    vertical-align: middle;
    width: 0.72rem;
    height: 0.62rem;
    background-repeat: no-repeat;
    background-position: right center;
    background-size: 0.36rem 0.35rem;
  }
  .shopcart-list .food .food-header .status{
    display: inline-block;
    vertical-align: middle;
    padding: 0 0.14rem;
    margin-left: 0.24rem;
    line-height: 0.37rem;
    font-size: 0.24rem;
    font-weight: normal;
    border-radius: 3px;
    background-color: #bdbdbd;
    color: #fff;
  }
  .shopcart-list .food .con .text .name.on{
    color: #999;
  }
  .shopcart-list .food .con{
    position: relative;
    display: flex;
    padding: 0.18rem 2.15rem 0.19rem 0.23rem;
  }
  .shopcart-list .food .con .icon{
    width: 1.14rem;
    height: 1.14rem;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
  .shopcart-list .food .con:last-child:after{
    display: none;
  }
  .shopcart-list .food .con .text{
    flex: 1;
    margin-left: 0.18rem;
    overflow: hidden;
  }
  .shopcart-list .food .con .text .name{
    line-height: 0.34rem;
    font-size: 0.28rem;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #222;
  }
  .shopcart-list .food .con .text .desc{
    margin-top: 0.09rem;
    line-height: 0.32rem;
    font-size: 0.24rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #999999;
  }
  .shopcart-list .food .con .price{
    margin-top: 0.14rem;
    line-height: 0.32rem;
    font-size: 0.26rem;
    font-weight: bold;
    color: #f2463e;
  }
  .shopcart-list .food .con .cartcontrol-wrapper{
    position: absolute;
    right: 0.19rem;
    bottom: 0.14rem;
  }
  .ball-container .ball{
    position: fixed;
    left: 1.24rem;
    bottom: 0.64rem;
    z-index: 200;
    transition: all 0.2s cubic-bezier(0.49, -0.29, 0.75, 0.41);
  }
  .ball-container .ball  .inner{
    width: 0.32rem;
    height: 0.32rem;
    border-radius: 50%;
    background: #fd9025;
    transition: all 0.2s linear;
  }
</style>
