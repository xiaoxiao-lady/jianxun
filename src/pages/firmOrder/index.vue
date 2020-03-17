<template>
  <!-- 确认订单 -->
  <div class="firm-order bg-f6f6f6">
    <div class="user-infor border-bottom"  @click="toReceivingInformation" >
      <div class="address">{{addressData.address}}</div>
      <div class="name-tel">{{addressData.name}} {{addressData.mobile}}</div>
    </div>
    <div class="food-list" >
      <div class="food-item" v-for="(orderItem, index) in firmOrderList.counts" :key="index">
        <div class="food-header">{{orderItem.date}} {{orderItem.weekName}} {{orderItem.className}}</div>
        <div class="item" v-for="(food, index) in orderItem.products" :key="index">
          <div class="icon" :style="{backgroundImage: 'url(' + food.image + ')'}"></div>
          <div class="text">
            <div class="name">{{food.name}}</div>
            <div class="desc">{{food.remark}}</div>
          </div>
          <div class="num">×{{food.num}}</div>
          <div class="price">￥{{food.price}}</div>
        </div>
        <div class="num-price border-top"><span class="num"></span><span class="titl">小计：</span>￥{{orderItem.totalAmount}}</div>
      </div>
    </div>
    <div class="note">
      <li>
        <span>备注：</span>
        <textarea v-model="note" name="" id="" cols="30" rows="5"></textarea>
      </li>
      <div class="tag">
        <span v-for="(item, index) in tagList" :key="index" @click="getTag(item)">{{ item }}</span>
      </div>
    </div>
    <div class="tab-bar">
      <div class="total-price"><i>合计：</i>￥{{firmOrderList.payAmount}}</div>
      <button type="button" class="pay" @click="showPayWay">去支付</button>
    </div>
    <div class="tab-bar-place"></div>
    <transition name="fold" >
      <div class="pay-password-wrapper" v-show="cardWayShow">
        <div class="title border-bottom">请输入支付密码</div>
        <div class="desc">为了保证您的账号安全，请输入您的支付密码</div>
        <input type="password" placeholder="请输入支付密码" @blur="blurF" v-model="payPassword">
        <button type="button" class="card-pay-btn" @click="cardPay">确定</button>
      </div>
    </transition>
    <transition name="fold">
      <div class="pay-way" v-show="pagWayShow">
        <div class="title border-bottom">选择支付方式</div>
        <!-- <div class="way-item border-bottom" @click="changePayWay(2)" :class="{'on' : wayIndex === 2}">
          <img src="../../assets/yikatong.png" alt="" class="icon">
          <div class="way-name">一卡通支付</div>
          <div class="radio"></div>
        </div> -->
        <!-- <div class="way-item border-bottom"  @click="changePayWay(1)" :class="{'on' : wayIndex === 1}">
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
        <button type="button" class="com-button pay-btn" @click="toPay()">确定</button>
      </div>
    </transition>
    <transition name="fade">
      <div class="mask" @click="hidePayWay" v-show="pagWayShow || cardWayShow"></div>
    </transition>
    <menuindex />
  </div>
</template>

<script>
import { confirmCart, empty } from '@/api/goods'
import { getAddress } from '@/api/address'
import { createOrder, payOrder } from '@/api/order'
import { Indicator, MessageBox  } from 'mint-ui';
import { orderpay } from '@/mixins/order'
import '@/common/icon/iconfont.css'

export default {
  data () {
    return {
      firmOrderList: {},
      addressData: {
        address: '',
        name: '',
        mobile: ''
      },
      cardWayShow: false,
      pagWayShow: false,
      payPassword: '',
      orderIds: '',
      wayIndex: 3,
      bankCardLoading: false,
      note: '',
      tagList: [
        '不辣','微辣', '辣', '少盐', '清淡', '不要香菜'
      ]
    }
  },
  computed: {
    // address: function () {
    //   return this.$store.getters.patientData.bedName
    // },
    // name: function () {
    //   return this.$store.getters.patientData.name
    // },
    // mobile: function () {
    //   return this.$store.getters.patientData.mobile
    // }
  },
  mixins: [orderpay],
  created () {
    // this.init()
    // this.getAddress()
  },
  activated () {
    this.orderIds = ''
    this.note = ''
    this.init()
    this.getAddress()
  },
  deactivated() {
    // this.clearCar()
    this.overCarding()
  },
  methods: {
    getAddress () {
      // console.log(this.$store.getters.patientData)
      // let patientId = this.$store.getters.patientData.id // 病床ID
      let patientId = this.$store.getters.patientData.memberId // 病床人员ID
      let params = {
        patientId
      }
      getAddress(params).then(res => {
        this.addressData = res.result
        this.$store.commit('SET_ADDRESSDATA', this.addressData)
        console.log(this.addressData)
      })
    },
    init () {
      let patientId = this.$store.getters.patientData.memberId // 病床人员ID
      let params = {
        isAdd: this.$store.state.goods.isAdd,
        type: 2,
        patientId
      }
      confirmCart(params).then(res => {
        if (res.code !== 0) {
          this.$layer.msg(res.message)
        } else {
          var firmOrderList = res.result
          this.payAmount = firmOrderList.payAmount
          if (!firmOrderList.counts) {
            this.$router.goBack()
          }
          this.firmOrderList = firmOrderList
          console.log(firmOrderList)
        }
      })
      // //  确认订单
      // this.$axios({
      //   url: this.GLOBAL.BASE_URL + '/front/cart/confirm',
      //   method: 'post',
      //   headers: {
      //     'canteenId': this.$store.state.canteenId,
      //     'token': this.$store.state.token
      //   },
      //   data: this.$qs.stringify({
      //     'type': 1
      //   })
      // }).then(respanse => {
      //   if (respanse.data.code !== 0) {
      //     this.$layer.msg(respanse.data.message)
      //   } else {
      //     var firmOrderList = respanse.data.result
      //     if (!firmOrderList.counts) {
      //       this.$router.go(-1)
      //     }
      //     this.firmOrderList = firmOrderList
      //   }
      // })
      // //  获取收货地址
      // this.$store.dispatch('setAddressInfor')
    },
    // 跳转到修改收货信息
    toReceivingInformation () {
      this.$router.togo('/receivingInformation')
    },
    showPayWay () {
      if(!this.addressData.mobile) {
        MessageBox({
          title: '提示',
          message: '请前往填写手机号码'
        }).then( res => {
          if(res == 'confirm') {
            this.toReceivingInformation()
          }
        })
        return
      }
      this.pagWayShow = true
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
    // 切换支付方式 1WX 2一卡通 3刷卡 4现金
    changePayWay (index) {
      this.wayIndex = Number(index)
    },
    // 去支付
    toPay () {
      let data = this.addressData
      if (typeof data.mobile === 'undefined' || data.mobile === null || data.mobile === '') {
        this.$layer.msg('请填写手机号！')
      }
      if (this.orderIds) {
        this.pagWayShow = false
        if (this.wayIndex == 2) {
          this.cardWayShow = true
          document.getElementsByTagName('html')[0].style.overflow = 'hidden'
          document.getElementsByTagName('html')[0].style.height = '100%'
          document.getElementsByTagName('body')[0].style.overflow = 'auto'
          document.getElementsByTagName('body')[0].style.height = '100%'
        }
        if (this.wayIndex == 1) {
          this.pay(this.orderIds)
        }
        if (this.wayIndex == 3) {
          this.bankCardPay(this.orderIds)
        }
        if (this.wayIndex == 4) {
          this.offlinePay(this.orderIds)
        }
        if (this.wayIndex == 5) {
          this.scanPay(this.orderIds)
        }
        return
      }
      Indicator.open({
        text: '加载中...'
      });
      this.pagWayShow = false
      let patientId = this.$store.getters.patientData.memberId
      let params = {
        addressId: data.id,
        type: 2, // 类型.1职工，2订餐员 3病患，4包厢
        isAdd: this.$store.state.goods.isAdd, // 是否是加餐
        patientId,
        note: this.note
      }
      let patientSample = this.$store.getters.patientData
      if(patientSample.doctorAdviceType == 0) {
        params.doctorAdviceId = patientSample.memberDoctorAdviceId
      }
      createOrder(params).then(res => {
        Indicator.close()
        if (res.code !== 0) {
          this.$layer.msg(res.message)
        } else {
          this.orderIds = res.result.orderIds
          var orderIds = res.result.orderIds
          if (this.wayIndex == 2) {
            this.cardWayShow = true
            document.getElementsByTagName('html')[0].style.overflow = 'hidden'
            document.getElementsByTagName('html')[0].style.height = '100%'
            document.getElementsByTagName('body')[0].style.overflow = 'auto'
            document.getElementsByTagName('body')[0].style.height = '100%'
          }
          if (this.wayIndex == 1) {
            this.pay(orderIds)
          }
          if (this.wayIndex == 3) {
            this.bankCardPay(orderIds)
          }
          if (this.wayIndex == 4) {
            this.offlinePay(orderIds)
          }
          if (this.wayIndex == 5) {
            this.scanPay(this.orderIds)
          }
        }
      }).catch(err => {
        Indicator.close()
      })
    },
    clearCar() {
      let patientId = this.$store.getters.patientData.memberId
      empty({
        isAdd: this.$store.state.goods.isAdd,
        type: 2,
        patientId
      }).then(respanse => {
        if (respanse.code !== 0) {
          this.$layer.msg(respanse.message)
        } else {
          this.$store.commit('setCart')
        }
      })
    },
    // 一卡通支付
    cardPay () {
      if (this.payPassword === '') {
        this.$layer.msg('请输入支付密码！')
        return
      }
      Indicator.open({
        text: '加载中...'
      });
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
          'orderIds': this.orderIds,
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
              this.$router.push({path: '/orderList', query: {type: 1}})
            }
            if (result === 'closed') {
              this.$layer.msg('扣款失败，请重试！')
            }
          }
        }).catch(err => {
          Indicator.close()
        })
    },
    // wx支付
    pay (orderIds) {
      let params = {
        type: 1, // l订餐支付，2一卡通充值
        orderIds: orderIds,
        orderType: 1,
        userType: 2 // l职工，2点餐员，3病患
      }
      Indicator.open({
        text: '加载中...'
      });
      payOrder(params).then(res => {
        Indicator.close()
        if (res.code !== 0) {
          this.$layer.msg(res.message)
        } else {
          var url = res.result
          window.location.href = url
        }
      }).catch(err => {
        Indicator.close()
      })
      // // 支付
      // this.$axios({
      //   url: this.GLOBAL.BASE_URL + '/front/pay/prepay',
      //   method: 'post',
      //   headers: {
      //     'canteenId': this.$store.state.canteenId,
      //     'token': this.$store.state.token
      //   },
      //   data: this.$qs.stringify({
      //     'type': 1,
      //     'orderIds': orderIds
      //   })
      // }).then(respanse => {
      //   if (respanse.data.code !== 0) {
      //     this.$layer.msg(respanse.data.message)
      //   } else {
      //     var url = respanse.data.result
      //     window.location.href = url
      //   }
      // })
    },
    blurF () {
      window.scrollTo(0, 0)
    },
    getTag(item) {
      this.note += ' '+item
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  i{
    font-style: normal;
  }
  .firm-order .user-infor{
    position: relative;
    padding: 0.18rem 0.6rem 0.21rem 0.26rem;
    line-height: 0.5rem;
    font-size: 0.3rem;
    background: url("../../assets/next.png") no-repeat 96.5% center #fff;
    background-size: 0.12rem 0.22rem;
    color: #222;
  }
  .firm-order .user-infor .address{
    line-height: 0.46rem;
    font-size: 0.38rem;
    font-weight: bold;
    color: #222;
  }
  .firm-order .user-infor .name-tel{
    margin-top: 0.07rem;
    line-height: 0.36rem;
    font-size: 0.28rem;
    color: #222;
  }
  .firm-order .food-list .food-item{
    padding-top: 0.2rem;
    margin-bottom: 0.16rem;
    background-color: #fff;
  }
  .firm-order .food-list .food-item .food-header{
    padding-left: 0.26rem;
    margin-bottom: 0.24rem;
    line-height: 0.38rem;
    font-size: 0.3rem;
    font-weight: bold;
    color: #222;
  }
  .firm-order .food-list .food-item .item{
    display: flex;
    margin: 0.11rem 0;
    padding-right: 0.28rem;
    padding-left: 0.26rem;
  }
  .firm-order .food-list .food-item .item .icon{
    width: 0.9rem;
    height: 0.9rem;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .firm-order .food-list .food-item .item .text{
    flex: 1;
    margin-left: 0.17rem;
    overflow: hidden;
  }
  .firm-order .food-list .food-item .item .text .name{
    line-height: 0.38rem;
    font-size: 0.3rem;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #222;
  }
  .firm-order .food-list .food-item .item .text .desc{
    margin-top: 0.11rem;
    line-height: 0.3rem;
    font-size: 0.24rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #999;
  }
  .firm-order .food-list .food-item .item .num{
    width: 0.9rem;
    line-height: 0.84rem;
    text-align: right;
    font-size: 0.26rem;
    color: #222;
  }
  .firm-order .food-list .food-item .item .price{
    width: 1.38rem;
    line-height: 0.84rem;
    text-align: right;
    font-size: 0.28rem;
    color: #222;
  }
  .firm-order .food-list .food-item .num-price{
    position: relative;
    padding: 0.24rem 0.28rem 0.2rem;
    line-height: 0.38rem;
    text-align: right;
    font-size: 0.28rem;
    background-color: #fff;
    color: #222222;
  }
  .firm-order .food-list .food-item .num-price .num{
    margin-right: 0.18rem;
    color: #666;
  }
  .firm-order .food-list .food-item .num-price .titl{
    color: #666;
  }
  .firm-order .tab-bar{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    display: flex;
    background-color: #323232;
  }
  .firm-order .tab-bar .total-price{
    flex: 1;
    padding-left: 0.29rem;
    line-height: 1rem;
    font-size: 0.38rem;
    font-weight: bold;
    color: #fff;
  }
  .firm-order .tab-bar .total-price i{
    font-size: 0.26rem;
  }
  .firm-order .tab-bar .pay{
    width: 2.15rem;
    line-height: 1rem;
    font-size: 0.34rem;
    background-color: #ffb522;
    color: #222;
  }
  .firm-order .tab-bar-place{
    height: 1rem;
  }
  .pay-way{
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    padding: 0 0 .16rem;
    box-sizing: border-box;
    background-color: #fff;
    transform: translateY(0);
    border-top-left-radius: .15rem;
    border-top-right-radius: .15rem;
  }
  .pay-way .title{
    position: relative;
    padding: 0 0.45rem;
    line-height: 1rem;
    font-size: 0.25rem;
    color: #999999;
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
    color: #252525;
    font-weight: bold;
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
    padding-bottom:0.2rem;
    border-top-left-radius: .15rem;
    border-top-right-radius: .15rem;
    box-sizing: border-box;
    background-color: #fff;
    transform: translateY(0);
  }
  .pay-password-wrapper .title{
    position: relative;
    line-height: 0.87rem;
    /* text-align: center; */
    padding-left: .4rem;
    font-size: 0.27rem;
    color: #999999;
  }
  .pay-password-wrapper .title:after{
    border-color: #d4d4d4;
  }
  .pay-password-wrapper .desc{
    margin-top: 0.26rem;
    line-height: 0.32rem;
    text-align: center;
    font-size: 0.26rem;
    color: #999;
  }
  .pay-password-wrapper input{
    display: block;
    margin: 0.22rem auto 0.66rem;
    width: 6.38rem;
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
    border-radius: 0.1rem;
    background-color: #5087ef;
    color: #fff;
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
    transition: all 0.3s;
  }
  .fade-enter,.fade-leave-to{
    opacity: 0;
    background: rgba(0, 0, 0, 0);
  }

  .icon-qian {
    font-size: .54rem;
    color: #e1b882;
  }
  .note {
    padding: .3rem;
    background: #fff;
  }
  .note>li{
    display: flex;
    
  }
  .note>li span {
    font-size: .28rem;
  }
  .note>li textarea {
    flex:1;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    padding: .1rem;
  }
  .note .tag {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-top: .2rem;
  }
  .note .tag span {
    width: 28%;
    padding: .15rem 0;
    border-radius: 4px;
    font-size: .26rem;
    color: #444;
    text-align: center;
    border: 1px solid #e0e0e0;
    margin-bottom: .2rem;
  }
  .note .tag span:active {
    background: rgb(230, 230, 230);
    border-color:rgb(230, 230, 230);
  }
</style>
