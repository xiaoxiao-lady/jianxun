<template>
  <!-- 订单详情 -->
  <div class="order-yi order bg-f6f6f6">
    <div class="top-wrapper">
      <div class="bg"></div>
      <div class="content">
        <div class="status"  v-if="orderDetails.status === 1">待付款</div>
        <div class="status"  v-if="orderDetails.status === 2">待配送</div>
        <div class="status"  v-if="orderDetails.status === 3">配送中</div>
        <div class="status"  v-if="orderDetails.status === 4">已配送</div>
        <div class="status"  v-if="orderDetails.status === 5">已评价</div>
        <div class="status"  v-if="orderDetails.status === 6">退款中</div>
        <div class="status"  v-if="orderDetails.status === 7">已退款</div>
        <div class="status"  v-if="orderDetails.status === 99">已取消</div>
        <div class="refund-wrapper">
          <p class="desc" v-if="orderDetails.status === 1">请在<span class="count-down">{{time.m}}分{{time.s}}秒</span>内完成支付，过时订单将会自动取消</p>
          <p class="desc" v-if="orderDetails.status === 2"><span class="count-down">{{orderDetails.refundLimitTime}}</span> 前，您可以取消订单并退款</p>
          <p class="desc" v-if="orderDetails.status === 3">您的订单正在配送中，请耐心等待</p>
          <p class="desc" v-if="orderDetails.status === 4">订单已送达，感谢您的订购，期待再次光临</p>
          <p class="desc" v-if="orderDetails.status === 5">感谢您的订购，期待再次光临</p>
          <p class="desc" v-if="orderDetails.status === 6">退款申请已提交，将在1个工作日内原路返回</p>
          <p class="desc" v-if="orderDetails.status === 7">退款已返还支付账号，请查收</p>
          <p class="desc" v-if="orderDetails.status === 99">订单未按时付款，已关闭</p>
          <div class="button-wrapper">
            <button type="button" v-if="orderDetails.status === 1" class="btn cancel" @click="popupShow">取消订单</button>
            <button type="button" v-if="orderDetails.status === 1" class="btn" @click="showPayWay()">立即支付</button>
            <button type="button" v-if="orderDetails.status === 2 && beforeDate(orderDetails.refundLimitTime)" class="btn" @click="refund(orderDetails.id)">退款</button>
            <button type="button" v-if="orderDetails.status === 3" class="btn" @click="orderConfirm(orderDetails.id)">确认送达</button>
            <button type="button" v-if="orderDetails.status === 4" class="btn" @click="toRating(orderDetails.id)">评价</button>
            <button 
              type="button" 
              v-if="orderDetails.status === 2 || orderDetails.status === 3 || orderDetails.status === 4 || orderDetails.status === 5" 
              class="btn" 
              style="width: 1.9rem;"
              @click="rePrint('pay')">补打交易小票</button>
            <button 
              type="button" 
              v-if="orderDetails.status === 6 || orderDetails.status === 7" 
              class="btn" 
              style="width: 1.9rem;"
              @click="rePrint('back')">补打退款小票</button>
          </div>
        </div>
      </div>
    </div>
    <div class="food-list">
      <div class="food-item">
        <div class="food-header">{{orderDetails.date}} {{orderDetails.week}} {{orderDetails.className}} {{orderDetails.classTime}}</div>
        <div class="item" v-for="(food, index) in orderDetails.products" :key="index">
          <div class="icon" :style="{backgroundImage: 'url(' + food.image + ')'}"></div>
          <div class="text">
            <div class="name">{{food.name}}</div>
            <div class="desc">{{food.remark}}</div>
          </div>
          <div class="num">×{{food.num}}</div>
          <div class="price">￥{{food.price}}</div>
        </div>
      </div>
    </div>
    <div class="total-price border-top">合计：￥{{orderDetails.payAmount}}</div>
    <div class="order-infor">
      <div class="infor-item">
        <div class="titl">订单号：</div>
        <div class="con">{{orderDetails.identifier}}</div>
      </div>
      <div class="infor-item">
        <div class="titl">订单类型：</div>
        <div class="con">{{orderDetails.type | typeFormat}}</div>
      </div>
      <div class="infor-item">
        <div class="titl">订餐员：</div>
        <div class="con">{{orderDetails.takerName}}</div>
      </div>

      <template v-if="orderDetails.payType == 5">
      <div class="infor-item">
        <div class="titl">支付方式：</div>
        <div class="con">{{orderDetails.payType | payTypeFormat}}</div>
      </div>
      <div class="infor-item">
        <div class="titl">支付卡号：</div>
        <div class="con">{{orderDetails.cardNo}}</div>
      </div>
      <div class="infor-item">
        <div class="titl">支付账户：</div>
        <div class="con">{{orderDetails.cardAccount}}</div>
      </div>
      <div class="infor-item">
        <div class="titl">支付金额：</div>
        <div class="con">￥{{orderDetails.payAmount | amountToFixed}}</div>
      </div>
      <div class="infor-item">
        <div class="titl">支付后余额：</div>
        <div class="con">{{orderDetails.cardCurrentBalance}}</div>
      </div>
      </template>

      <template v-if="orderDetails.payType == 6">
        <div class="infor-item">
          <div class="titl">支付方式：</div>
          <div class="con">{{orderDetails.payType | payTypeFormat}}</div>
        </div>
        <div class="infor-item">
          <div class="titl">支付金额：</div>
          <div class="con">￥{{orderDetails.payAmount | amountToFixed}}</div>
        </div>
      </template>

      <div class="infor-item addre">
        <div class="titl">送餐地址：</div>
        <div class="con">
          <div>{{orderDetails.receiveAddress}}</div>
          <div>{{orderDetails.receiveName}} {{orderDetails.receiveMobile}}</div>
        </div>
      </div>
      <div class="infor-item">
        <div class="titl">下单时间：</div>
        <div class="con">{{orderDetails.createTimeStr}}</div>
      </div>
    </div>
    <!--弹窗-->
    <transition name="fade">
    <div class="mask" v-show="popupB || pagWayShow || cardWayShow" @click="popupHide"></div>
    </transition>
    <transition name="scale">
    <div class="confirm-popup" v-show="popupB">
      <div class="con">确认取消订单？</div>
      <div class="button-wrapper">
        <div class="btn yes" @click="cancelOrder(orderDetails.id)">确定</div>
        <div class="btn" @click="popupHide">我再想想</div>
      </div>
    </div>
    </transition>
    <transition name="fold" >
      <div class="pay-password-wrapper" v-show="cardWayShow">
        <div class="title border-bottom">支付密码</div>
        <div class="desc">为了保证您的账号安全，请输入您的支付密码</div>
        <input type="password" placeholder="请输入支付密码" @blur="blurF" v-model="payPassword">
        <button type="button" class="card-pay-btn" @click="cardPay(orderDetails.id)">确定</button>
      </div>
    </transition>
    <transition name="fold">
      <div class="pay-way" v-show="pagWayShow">
        <div class="title border-bottom">选择支付方式</div>
        <!-- <div class="way-item border-bottom" @click.stop="changePayWay(2)" :class="{'on' : wayIndex === 2}">
          <img src="../../assets/yikatong.png" alt="" class="icon">
          <div class="way-name">一卡通支付</div>
          <div class="radio"></div>
        </div> -->
        <!-- <div class="way-item border-bottom"  @click.stop="changePayWay(1)" :class="{'on' : wayIndex === 1}">
          <img src="../../assets/wechat.png" alt="" class="icon">
          <div class="way-name">微信支付</div>
          <div class="radio"></div>
        </div> -->
        <div class="way-item border-bottom"  @click="changePayWay(3)" :class="{'on' : wayIndex === 3}">
          <img src="../../assets/yikatong.png" alt="" class="icon">
          <div class="way-name">刷卡支付</div>
          <div class="radio"></div>
        </div>
        <div class="way-item border-bottom"  @click="changePayWay(4)" :class="{'on' : wayIndex === 4}">
          <i class="iconfont icon-qian"></i>
          <div class="way-name">线下收款</div>
          <div class="radio"></div>
        </div>
        <!-- <div class="way-item border-bottom"  @click="changePayWay(5)" :class="{'on' : wayIndex === 5}">
          <img src="../../assets/yikatong.png" alt="" class="icon">
          <div class="way-name">扫码支付</div>
          <div class="radio"></div>
        </div> -->
        <button type="button" class="com-button pay-btn" v-if="wayIndex === 2" @click.stop="showCardWay">确定</button>
        <button type="button" class="com-button pay-btn" v-if="wayIndex === 1 || wayIndex === 3 || wayIndex === 4 || wayIndex === 5" @click.stop="checkPayType(orderDetails.id)">确定</button>
      </div>
    </transition>
    <!-- <menuindex :area='false'/> -->
  </div>
</template>

<script>
import { getOrderDetail, cancelOrder, payOrder, refundOrder, orderSendConfirm } from '@/api/order'
import { Indicator, MessageBox } from 'mint-ui'
import { orderpay } from '@/mixins/order'
import '@/common/icon/iconfont.css'
import moment from 'moment'

export default {
  data () {
    return {
      orderDetails: {},
      popupB: false,
      endTime: '',
      time: {
        D: '00',
        h: '00',
        m: '00',
        s: '00'
      },
      pagWayShow: false,
      cardWayShow: false,
      payPassword: '',
      wayIndex: 3
    }
  },
  mixins: [orderpay],
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // let id = to
      // console.log(to.query.id)
      // vm.$axios({
      //   url: vm.GLOBAL.BASE_URL + '/front/order/get',
      //   method: 'post',
      //   headers: {
      //     'canteenId': vm.$store.state.canteenId,
      //     'token': vm.$store.state.token
      //   },
      //   data: vm.$qs.stringify({
      //     'id': to.query.id
      //   })
      // }).then(respanse => {
      //   if (respanse.data.code !== 0) {
      //     vm.$layer.msg(respanse.data.message)
      //   } else {
      //     var orderDetails = respanse.data.result
      //     vm.orderDetails = orderDetails
      //     vm.endTime = orderDetails.deadTime
      //     console.log(orderDetails)
      //     if (orderDetails.deadTime && orderDetails.status === 1) {
      //       vm.setEndTime()
      //     }
      //   }
      // })

    })
  },
  filters: {
    typeFormat(val) {
      let str = ''
      if (val == 2) {
        str = '订餐员代下单'
      } else if (val == 3) {
        str = '病患订单'
      } else if (val == 5) {
        str = '陪护订单'
      }
      return str
    },
    payTypeFormat(val) {
      let str = ''
      if (val == 5) {
        str = '会员卡支付'
      } else if (val == 6) {
        str = '线下收款'
      }
      return str
    }
  },
  created () {
    // this.getOrderDetail()
  },
  activated() {
    this.getOrderDetail()
  },
  methods: {
    beforeDate(date) {
      let now = moment().valueOf()
      let deadline = moment(date).valueOf()
      return now < deadline
    },
    rePrint(type) {
      this.print([this.orderDetails.id], type)
    },
    // 获取详情
    getOrderDetail () {
      let id = this.$route.query.id
      let params = { id }
      getOrderDetail(params).then(res => {
        var orderDetails = res.result
        this.orderDetails = orderDetails
        this.endTime = orderDetails.deadTime
        this.payAmount = orderDetails.payAmount
        if (orderDetails.deadTime && orderDetails.status === 1) {
          this.setEndTime()
        }
      })
    },
    popupShow () {
      this.popupB = true
    },
    popupHide () {
      this.popupB = false
      this.pagWayShow = false
      this.cardWayShow = false
    },
    cancelOrder (id) {
      // this.$axios({
      //   url: this.GLOBAL.BASE_URL + '/front/order/cancel',
      //   method: 'post',
      //   headers: {
      //     'canteenId': this.$store.state.canteenId,
      //     'token': this.$store.state.token
      //   },
      //   data: this.$qs.stringify({
      //     'id': id
      //   })
      // }).then(respanse => {
      //   if (respanse.data.code !== 0) {
      //     this.$layer.msg(respanse.data.message)
      //   } else {
      //     this.$router.back()
      //   }
      // })
      cancelOrder({id}).then(res => {
        this.$router.goBack()
      })
    },
    showPayWay () {
      this.pagWayShow = true
    },
    // 显示支付支付密码
    showCardWay () {
      this.cardWayShow = true
      this.pagWayShow = false
      document.getElementsByTagName('html')[0].style.overflow = 'hidden'
      document.getElementsByTagName('html')[0].style.height = '100%'
      document.getElementsByTagName('body')[0].style.overflow = 'auto'
      document.getElementsByTagName('body')[0].style.height = '100%'
    },
    // 隐藏支付方式
    hidePayWay () {
      this.pagWayShow = false
      this.cardWayShow = false
      this.payPassword = ''
      document.getElementsByTagName('html')[0].style.overflow = ''
      document.getElementsByTagName('html')[0].style.height = ''
      document.getElementsByTagName('body')[0].style.overflow = ''
      document.getElementsByTagName('body')[0].style.height = ''
    },
    // 切换支付方式
    changePayWay (index) {
      this.wayIndex = Number(index)
    },
    blurF () {
      window.scrollTo(0, 0)
    },
    // 一卡通支付
    cardPay (id) {
      if (this.payPassword === '') {
        this.$layer.msg('请输入支付密码！')
        return
      }
      Indicator.open({
        text: '加载中...'
      })
      this.$axios({
        url: this.GLOBAL.BASE_URL + '/front/pay/prepay',
        method: 'post',
        headers: {
          'canteenId': this.$store.state.canteenId,
          'token': this.$store.state.token
        },
        data: this.$qs.stringify({
          'userType': 2,
          'type': this.wayIndex,
          'orderIds': `/${id}/`,
          'orderType': 1,
          'payPassword': this.payPassword
        })
      })
        .then(respanse => {
          Indicator.close()
          if (respanse.data.code !== 0) {
            this.$layer.msg(respanse.data.message)
          } else {
            let result = respanse.data.result
            if (result === 'normal') {
              this.$layer.msg('支付成功！')
              this.$router.back()
            }
            if (result === 'closed') {
              this.$layer.msg('扣款失败，请重试！')
            }
          }
        }).catch(err => {
          Indicator.close()
        })
    },
    checkPayType(id) {
      this.pagWayShow = false
      if(this.wayIndex == 1) {
        this.pay(id)
      } else if (this.wayIndex == 3) {
        this.bankCardPay(`/${id}/`)
      } else if (this.wayIndex == 4) {
        this.offlinePay(`/${id}/`)
      } else if (this.wayIndex == 5) {
        this.scanPay(`/${id}/`)
      }
    },
    pay (id) {
      // 支付
      // this.$axios({
      //   url: this.GLOBAL.BASE_URL + '/front/pay/prepay',
      //   method: 'post',
      //   headers: {
      //     'canteenId': this.$store.state.canteenId,
      //     'token': this.$store.state.token
      //   },
      //   data: this.$qs.stringify({
      //     'type': 1,
      //     'orderIds': `/${id}/`
      //   })
      // }).then(respanse => {
      //   if (respanse.data.code !== 0) {
      //     this.$layer.msg(respanse.data.message)
      //   } else {
      //     var url = respanse.data.result
      //     window.location.href = url
      //   }
      // })
      let params = {
        type: 1, // 1订餐支付，2一卡通充值
        userType: 2, // 1职工，2点餐员，3病患
        orderIds: `/${id}/`,
        orderType: 1
      }
      Indicator.open({
        text: '加载中...'
      })
      payOrder(params).then(res => {
        Indicator.close()
        var url = res.result
        window.location.href = url
      }).then(err => {
        Indicator.close()
      })
    },
    // 退款
    refund (id) {
      // refundOrder
      let params = {
        orderId: id,
        orderType: 1
      }
      MessageBox({
        title: '提示',
        message: '是否确认提交退款，支付款项将原路返回',
        showCancelButton: true,
        closeOnClickModal: false,
        confirmButtonText: "确定"
      }).then(r => {
        if (r == "confirm") {
          refundOrder(params).then(res => {
            // console.log(res)
            this.rePrint('back')
            this.$layer.msg('退款成功！')
            this.$router.back()
          })
        }
      });
      
      // // 部分退款
      // this.$axios({
      //   url: this.GLOBAL.BASE_URL + '/front/pay/refund',
      //   method: 'post',
      //   headers: {
      //     'canteenId': this.$store.state.canteenId,
      //     'token': this.$store.state.token
      //   },
      //   data: this.$qs.stringify({
      //     'orderId': id
      //   })
      // }).then(respanse => {
      //   if (respanse.data.code !== 0) {
      //     this.$layer.msg(respanse.data.message)
      //   } else {
      //     this.$layer.msg('退款成功！')
      //     setTimeout(function () {
      //       this.$router.go(-1)
      //     }, 1000)
      //   }
      // })
    },
    //确认送达
    orderConfirm(id) {
      orderSendConfirm({
        'id': id
      }).then(respanse => {
        if (respanse.code !== 0) {
          this.$layer.msg(respanse.message)
        } else {
          this.orderDetails.status = 4
        }
      })
    },
    // 评价
    toRating (id) {
      this.$router.push({path: '/rating', query: {id: id}})
    },
    // 倒计时
    setEndTime () {
      var that = this
      var interval = null
      clearInterval(interval)
      interval = setInterval(function timestampToTime () {
        var date = (new Date(that.endTime)) - (new Date()) // 计算剩余的毫秒数
        if (date < 0) {
          that.cancelOrder(that.orderDetails.id)
          clearInterval(interval)
        } else {
          that.time.D = parseInt(date / 1000 / 60 / 60 / 24, 10)
          that.time.h = parseInt(date / 1000 / 60 / 60 % 24, 10)
          if (that.time.h < 10) {
            that.time.h = '0' + that.time.h
          }
          that.time.m = parseInt(date / 1000 / 60 % 60, 10)// 计算剩余的分钟
          if (that.time.m < 10) {
            that.time.m = '0' + that.time.m
          }
          that.time.s = parseInt(date / 1000 % 60, 10) // 计算剩余的秒数
          if (that.time.s < 10) {
            that.time.s = '0' + that.time.s
          }
          return that.time.D + that.time.h + that.time.m + that.time.s
        }
      }, 1000)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .order-yi .top-wrapper{
    position: relative;
    padding-top: 0.66rem;
    background-color: #fff;
  }
  .order-yi .top-wrapper .bg{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: 2;
    height: 3.12rem;
    background: linear-gradient(to bottom, rgb(255,207,115), rgb(255,180,35));
  }
  .order-yi .top-wrapper .content{
    position: relative;
    z-index: 3;
  }
  .order-yi .top-wrapper .status{
    padding-left: 0.41rem;
    line-height: 0.6rem;
    font-size: 0.52rem;
    font-weight: bold;
    text-shadow: 0px 3px 7px rgba(186, 186, 186, 0.35);
    color: #fff;
  }
  .order-yi .top-wrapper .refund-wrapper{
    position: relative;
    padding: 0.43rem 0 0.46rem 0.25rem;
    margin: 0.29rem 0.26rem 0;
    font-size: 0;
    border-radius: 6px;
    box-shadow: 0px 3px 7px 0px rgba(186, 186, 186, 0.35);
    background-color: #fff;
  }
  .order-yi .top-wrapper .refund-wrapper .desc{
    line-height: 0.36rem;
    font-size: 0.28rem;
    font-weight: bold;
    color: #222222;
  }
  .order-yi .top-wrapper .refund-wrapper .btn{
    display: inline-block;
    vertical-align: top;
    padding: 0 0.44rem;
    margin-top: 0.19rem;
    line-height: 0.64rem;
    font-size: 0.28rem;
    border-radius: 4px;
    background-color: #ffb522;
    color: #fff;
  }
  .order-yi .food-list{
    padding: 0.33rem 0 0.05rem;
    background-color: #fff;
  }
  .order-yi .food-list .food-item{
    padding: 0.2rem 0.28rem 0 0.26rem;
  }
  .order-yi .food-list .food-item .food-header{
    line-height: 0.38rem;
    font-size: 0.3rem;
    font-weight: bold;
    color: #222;
  }
  .order-yi .food-list .food-item .item{
    display: flex;
    margin: 0.11rem 0 0.15rem;
  }
  .order-yi .food-list .food-item .item .icon{
    width: 0.9rem;
    height: 0.9rem;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .order-yi .food-list .food-item .item .text{
    flex: 1;
    margin-left: 0.17rem;
    overflow: hidden;
  }
  .order-yi .food-list .food-item .item .text .name{
    line-height: 0.38rem;
    font-size: 0.3rem;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #222;
  }
  .order-yi .food-list .food-item .item .text .desc{
    margin-top: 0.11rem;
    line-height: 0.3rem;
    font-size: 0.24rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #999;
  }
  .order-yi .food-list .food-item .item .num{
    width: 0.9rem;
    line-height: 0.84rem;
    text-align: right;
    font-size: 0.26rem;
    color: #222;
  }
  .order-yi .food-list .food-item .item .price{
    width: 1.38rem;
    line-height: 0.84rem;
    text-align: right;
    font-size: 0.26rem;
    color: #222;
  }
  .order-yi .total-price{
    position: relative;
    padding: 0.24rem 0.28rem 0.2rem;
    line-height: 0.38rem;
    text-align: right;
    font-size: 0.28rem;
    background-color: #fff;
    color: #222222;
  }
  .order-yi .order-infor{
    padding: 0.2rem 0.26rem 0.16rem;
    margin-top: 0.16rem;
    line-height: 0.38rem;
    background-color: #fff;
  }
  .order-yi .order-infor .infor-item{
    display: flex;
    margin-top: 0.3rem;
  }
  .order-yi .order-infor .infor-item:first-child{
    margin-top: 0;
  }
  .order-yi .order-infor .infor-item:last-child{
    margin-top: 0.08rem;
  }
  .order-yi .order-infor .infor-item .con{
    flex: 1;
    text-align: right;
  }
  .order-yi .order-infor .infor-item .titl{
    width: 1.6rem;
  }
  .order-yi .order-infor .titl{
    font-size: 0.26rem;
    color: #666666;
  }
  .order-yi .order-infor .con{
    font-size: 0.26rem;
    color: #222;
  }
  .order .top-wrapper .refund-wrapper .btn{
    padding: 0;
    margin-right: 0.25rem;
    width: 1.6rem;
  }
  .order .top-wrapper .refund-wrapper .btn.cancel{
    height: 0.64rem;
    box-sizing: border-box;
    border: 1px solid #d5d5d5;
    background-color: #fff;
    color: #666;
  }
  .order .top-wrapper .count-down{
    margin: 0 0.06rem;
    color: #0090ff;
  }
  .fade-enter-active{
    transition: all 0.3s;
  }
  .fade-leave-active{
    transition: all 0.3s;
  }
  .fade-enter,.fade-leave-to{
    opacity: 0;
    background: rgba(0, 0, 0, 0);
  }
  .scale-enter-active{
    transition: all 0.3s;
  }
  .scale-leave-active{
    transition: all 0.2s;
  }
  .scale-enter,.scale-leave-to{
    transform: translate(-50%,-50%) scale(0.7);
  }
  .pay-way{
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    padding: 0.16rem 0;
    box-sizing: border-box;
    background-color: #fff;
    transform: translateY(0);
    border-top-left-radius: .1rem;
    border-top-right-radius: .1rem;
  }
  .pay-way .title{
    position: relative;
    padding: 0 0.45rem;
    line-height: 0.95rem;
    font-size: 0.3rem;
    color: #222;
  }
  .pay-way .way-item{
    position: relative;
    display: flex;
    padding: 0.29rem 0 0.26rem 0.45rem;
  }
  .pay-way .way-item .icon{
    display: block;
    width: 0.55rem;
    height: 0.55rem;
  }
  .pay-way .way-item .way-name{
    margin-left: 0.25rem;
    flex: 1;
    line-height: 0.55rem;
    font-size: 0.3rem;
    color: #707070;
  }
  .pay-way .way-item .radio{
    width: 0.98rem;
    height: 0.55rem;
    background: url("../../assets/radio_off.png") no-repeat center center;
    background-size: 0.38rem 0.38rem;
  }
  .pay-way .way-item.on .radio{
    background: url("../../assets/radio_on.png") no-repeat center center;
    background-size: 0.38rem 0.38rem;
  }
  .pay-way .pay-btn{
    margin: 0.42rem auto 0;
    width: 93.3%;
  }
  .pay-password-wrapper{
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    padding-bottom:0.78rem;
    box-sizing: border-box;
    background-color: #f8f8f8;
    transform: translateY(0);
  }
  .pay-password-wrapper .title{
    position: relative;
    line-height: 0.87rem;
    text-align: center;
    font-size: 0.32rem;
    color: #333333;
  }
  .pay-password-wrapper .title:after{
    border-color: #d4d4d4;
  }
  .pay-password-wrapper .desc{
    margin-top: 0.26rem;
    line-height: 0.32rem;
    text-align: center;
    font-size: 0.24rem;
    color: #666;
  }
  .pay-password-wrapper input{
    display: block;
    margin: 0.36rem auto 0.46rem;
    width: 6.98rem;
    height: 0.86rem;
    box-sizing: border-box;
    text-align: center;
    font-size: 0.32rem;
    letter-spacing: 0.1rem;
    background-color: #fff;
    color: #333333;
    border: 1px solid #eaeaea;
    border-radius: 0.05rem;
  }
  .pay-password-wrapper .card-pay-btn{
    display: block;
    margin: 0 auto;
    width: 6.98rem;
    height: 0.86rem;
    box-sizing: border-box;
    line-height: 0.86rem;
    font-size: 0.36rem;
    border: 1px solid #eaeaea;
    border-radius: 0.43rem;
    background-color: #fff;
    color: #666666;
  }
  .fade-enter-active{
    transition: all 0.3s;
  }
  .fade-leave-active{
    transition: all 0.3s;
  }
  .fade-enter,.fade-leave-to{
    opacity: 0;
    background: rgba(0, 0, 0, 0);
  }
  .scale-enter-active{
    transition: all 0.3s;
  }
  .scale-leave-active{
    transition: all 0.2s;
  }
  .scale-enter,.scale-leave-to{
    transform: translate(-50%,-50%) scale(0.7);
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
  .icon-qian {
    font-size: .54rem;
    color: #e1b882;
  }
</style>
