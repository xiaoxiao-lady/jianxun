<template>
  <!-- 我的订单 -->
  <div class="order-list bg-f6f6f6">
    <div class="top-menu" v-show="bottomCurrentIndex===0">
      <div class="menu-item" :class="{'on':currentIndex===0}"
           @click="selectMenu(0)">
        <span class="text">全部</span>
      </div>
      <div class="menu-item" :class="{'on':currentIndex===1}"
           @click="selectMenu(1)">
        <span class="text">未完成</span>
      </div>
      <div class="menu-item" :class="{'on':currentIndex===2}"
           @click="selectMenu(2)">
        <span class="text">已完成</span>
      </div>
    </div>
    <!--订单列表-->
    <div class="content" v-show="bottomCurrentIndex===0">
      <div class="order-item" v-for="(order, index) in orderList" :key="index" @click="toOrderDetails(order.id)">
        <div class="order-num-status border-bottom">
          <div class="order-num">订单号：<i>{{order.identifier}}</i></div>
          <div class="status" :class="{'on':order.status === 1}" v-if="order.status === 1">待付款</div>
          <div class="status"  v-if="order.status === 2">待配送</div>
          <div class="status"  v-if="order.status === 3">配送中</div>
          <div class="status"  v-if="order.status === 4">待评价</div>
          <div class="status"  v-if="order.status === 5">已评价</div>
          <div class="status"  v-if="order.status === 6">退款中</div>
          <div class="status"  v-if="order.status === 7">已退款</div>
          <div class="status"  v-if="order.status === 99">已取消</div>
        </div>
        <div class="text">
          <div class="time-wrapper">
            <div class="date">{{order.date}} {{order.week}} {{order.className}}</div>
            <!--<div class="time">12:00</div>-->
          </div>
          <!--<div class="balcony-name">华港观鱼包厢</div>-->
          <div class="food-infor" >
            <div class="icon" :style="{backgroundImage: 'url(' + order.products[0].image + ')'}"></div>
            <div class="name" v-if="order.products.length < 2">{{order.products[0].name}}</div>
            <div class="name" v-else>{{order.products[0].name}}等{{order.products.length}}件菜品</div>
            <div class="price">￥{{order.totalAmount}}</div>
          </div>
          <div class="button-wrapper clearfix">
            <button type="button" v-if="order.status === 1">付款</button>
            <button type="button" v-if="order.status === 4">评价</button>
          </div>
        </div>
      </div>
      <div class="loading" v-show="loadingShow">加载中</div>
      <div class="loading end" v-show="loadingFinsh">没有更多了</div>
    </div>
    <!--包厢订单列表-->
    <div class="content" style="padding-top: 0;" v-show="bottomCurrentIndex===1">
        <div class="balcony-order-item" v-for="(balconyOrderItem, index) in balconyOrderList" :key="index" @click="toBalconyOrderDetails(balconyOrderItem.id)">
          <div class="num-status border-bottom">
            <div class="num">订单号：<i>{{balconyOrderItem.identifier}}</i></div>
            <div class="status" v-if="balconyOrderItem.status === 1">已预定</div>
            <div class="status" v-if="balconyOrderItem.status === 5">已完成</div>
            <div class="status" v-if="balconyOrderItem.status === 99">已取消</div>
          </div>
          <div class="date-wrapper">{{balconyOrderItem.date}} {{balconyOrderItem.week}} {{balconyOrderItem.className}}</div>
          <div class="name">{{balconyOrderItem.boxName}}<span v-if="!balconyOrderItem.orderId && balconyOrderItem.status === 1">（未点餐）</span></div>
          <div class="button-wrapper border-top clearfix">
            <button type="button" class="on" v-if="balconyOrderItem.status === 1 && !balconyOrderItem.orderId">去点菜</button>
            <button type="button" class="on" v-else-if="balconyOrderItem.status == 5">结束用餐</button>
            <button type="button" v-else>查看详情</button>
          </div>
        </div>
        <div class="loading" v-show="boxLoadingShow">加载中</div>
        <div class="loading end" v-show="boxLoadingFinsh">没有更多了</div>
    </div>
    <div class="border-menu">
      <div class="menu-item" :class="{'on':bottomCurrentIndex===0}" @click="selectBottomMenu(0)" ><img src="../order-list/waidai_on.png" alt="" class="icon" v-if="bottomCurrentIndex===0"><img src="../order-list/waidai.png"  alt="" class="icon" v-else>点餐订单</div>
      <div class="menu-item" :class="{'on':bottomCurrentIndex===1}" @click="selectBottomMenu(1)"><img src="../order-list/baoxiang_on.png" alt="" class="icon" v-if="bottomCurrentIndex===1"><img src="../order-list/baoxiang.png"  alt="" class="icon" v-else>包厢订单</div>
    </div>
    <router-link to="/home">
      <div class="return-home"><img src="../../assets/home.png" alt=""></div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      currentIndex: 0,
      bottomCurrentIndex: 0,
      orderList: [],
      balconyOrderList: [],
      pageNo: 1,
      boxPageNo: 1,
      pageSize: 10,
      boxPageSize: 10,
      loadingShow: false,
      boxLoadingShow: false, // 加载中
      loadingFinsh: false, // 全部加载完毕
      boxLoadingFinsh: false,
      status: 999,
      type: 5
    }
  },
  activated() {
    // 获取订单列表
    this.initialization()
    // 获取包厢订单列表
    this.initialization2()
  },
  mounted() {
    let _this = this
    // 注册scroll事件并监听
    window.addEventListener('scroll', function () {
      var x = window.pageYOffset + window.innerHeight
      var y = document.documentElement.scrollHeight
      if ((x - y) >= 0) {
        if (_this.bottomCurrentIndex === 0) {
          _this.getOrderList(false)
        } else {
          _this.getBalconyOrderList(false)
        }
      }
    })
  },
  methods: {
    // 顶部菜单
    selectMenu(index) {
      this.currentIndex = index
      switch (index) {
        case 0:
          this.status = 999
          this.initialization()
          break
        case 1:
          this.status = 1
          this.initialization()
          break
        case 2:
          this.status = 2
          this.initialization()
          break
      }
    },
    // 底部菜单
    selectBottomMenu(index) {
      this.bottomCurrentIndex = index
      this.initialization2()
      this.initialization()
    },
    // 初始化(普通订单)
    initialization() {
      document.documentElement.scrollTop = 0
      this.pageNo = 1
      this.orderList = []
      this.loadingShow = false
      this.loadingFinsh = false
      this.getOrderList(true)
    },
    // 初始化（包厢订单）
    initialization2() {
      document.documentElement.scrollTop = 0
      this.boxPageNo = 1
      this.balconyOrderList = []
      this.boxLoadingShow = false
      this.boxLoadingFinsh = false
      this.getBalconyOrderList(true)
    },
    // 获取订单列表
    getOrderList(isRemove) {
      if (this.loadingShow || this.loadingFinsh) return
      if (isRemove) {
        this.orderList = []
      }
      this.loadingShow = true
        // console.log('滚动了')
      // console.log('status/' + this.status, 'pageNo/' + this.pageNo, 'pageSize/' + this.pageSize)
        this.$axios({
          url: this.GLOBAL.BASE_URL + '/front/order/pageQuery',
          method: 'post',
          headers: {
            'canteenId': this.$store.state.canteenId,
            'token': this.$store.state.token
          },
          data: this.$qs.stringify({
            'pageSize': this.pageSize,
            'pageNo': this.pageNo,
            'status': this.status,
            'type': this.type
          })
        })
          .then(respanse => {
            if (respanse.data.code !== 0) {
              this.$layer.msg(respanse.data.message)
            } else {
              var orderList = respanse.data.result
              if (orderList === null || orderList === '' || orderList.length < 1) {
                this.loadingFinsh = true
                this.loadingShow = false
              } else {
                for (var i = 0; i < orderList.length; i++) {
                  this.orderList.push(orderList[i])
                }
                this.loadingShow = false
              }
            }
          })
        this.pageNo = this.pageNo + 1
    },
    // 获取包厢订单列表
    getBalconyOrderList(isRemove) {
      if (this.boxLoadingShow || this.boxLoadingFinsh) return
      if (isRemove) {
        this.balconyOrderList = []
      }
      this.boxLoadingShow = true
      // console.log('滚动了')
      // console.log(this.boxPageNo)
      console.log('pageNo/' + this.boxPageNo, 'pageSize/' + this.boxPageSize)
      this.$axios({
        url: this.GLOBAL.BASE_URL + '/front/order/box/pageQuery',
        method: 'post',
        headers: {
          'canteenId': this.$store.state.canteenId,
          'token': this.$store.state.token
        },
        data: this.$qs.stringify({
          'pageSize': this.boxPageSize,
          'pageNo': this.boxPageNo,
          'status': 999
        })
      })
        .then(respanse => {
          if (respanse.data.code !== 0) {
            this.$layer.msg(respanse.data.message)
          } else {
            var balconyOrderList = respanse.data.result
            if (balconyOrderList === null || balconyOrderList === '' || balconyOrderList.length < 1) {
              this.boxLoadingFinsh = true
              this.boxLoadingShow = false
            } else {
              for (var i = 0; i < balconyOrderList.length; i++) {
                this.balconyOrderList.push(balconyOrderList[i])
              }
              this.boxLoadingShow = false
            }
          }
        })
      this.boxPageNo = this.boxPageNo + 1
    },
    // 跳转到订单详情
    toOrderDetails(orderId) {
      this.$router.push({path: '/orderDetails', query: {id: orderId}})
    },
    toBalconyOrderDetails(orderId) {
      this.$router.push({path: '/balconyOrder', query: {orderId: orderId}})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  i{
    font-style: normal;
  }
  .order-list .top-menu{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 10;
    display: flex;
    background-color: #fff;
  }
  .order-list .top-menu .menu-item{
    flex: 1;
    font-size: 0;
    text-align: center;
  }
  .order-list .top-menu .menu-item .text{
    position: relative;
    display: inline-block;
    vertical-align: top;
    line-height: 0.76rem;
    font-size: 0.28rem;
    color: #666;
  }
  .order-list .top-menu .menu-item.on .text{
    color: #222;
  }
  .order-list .top-menu .menu-item.on .text:after{
    content: " ";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 4px;
    border-radius: 2px;
    background-color: #ffb623;
  }
  .order-list .content{
    padding: 0.76rem 0 0.92rem;
  }
  .order-list .order-item{
    margin: 0.18rem 0.26rem;
    border-radius: 0.15rem;
    background-color: #fff;
  }
  .order-list .order-item .order-num-status{
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 0 0.15rem;
    line-height: 0.77rem;
  }
  .order-list .order-item .order-num-status .order-num{
    font-size: 0.28rem;
    color: #666;
  }
  .order-list .order-item .order-num-status .order-num i{
    color: #222;
  }
  .order-list .order-item .order-num-status .status{
    font-size: 0.28rem;
    color: #666;
  }
  .order-list .order-item .order-num-status .status.on{
    color: #ffb623;
  }
  .order-list .order-item .text{
    padding: 0.12rem 0.15rem 0.16rem;
  }
  .order-list .order-item .time-wrapper{
    display: flex;
    justify-content: space-between;
    line-height: 0.36rem;
    font-size: 0.28rem;
    font-weight: bold;
    color: #222;
  }
  .order-list .order-item .food-infor{
    display: flex;
    margin-top: 0.15rem;
    overflow: hidden;
  }
  .order-list .order-item .food-infor .icon{
    width: 0.9rem;
    height: 0.9rem;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
  .order-list .order-item .food-infor .name{
    flex: 1;
    margin-left: 0.15rem;
    line-height: 0.9rem;
    font-size: 0.28rem;
    font-weight: bold;
    color: #222;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .order-list .order-item .food-infor .price{
    width: 1.6rem;
    line-height: 0.9rem;
    text-align: right;
    font-size: 0.28rem;
    font-weight: bold;
    color: #222;
  }
  .order-list .order-item .balcony-name{
    margin-top: 0.16rem;
    line-height: 0.4rem;
    font-size: 0.3rem;
    font-weight: bold;
    color: #222;
  }
  .order-list .order-item .button-wrapper{
    margin-top: 0.15rem;
  }
  .order-list .order-item .button-wrapper button{
    float: right;
    width: 1.38rem;
    height: 0.6rem;
    line-height: 0.6rem;
    font-size: 0.28rem;
    border: 1px solid #ffb623;
    border-radius: 4px;
    color: #ffb623;
  }
  .order-list .border-menu{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    display: flex;
    background-color: #fff;
  }
  .order-list .border-menu .menu-item{
    flex: 1;
    padding: 0.22rem 0 0.26rem;
    line-height: 0.44rem;
    text-align: center;
    font-size: 0.28rem;
    font-weight: bold;
    color: #222;
  }
  .order-list .border-menu .menu-item .icon{
    display: inline-block;
    vertical-align: bottom;
    margin-right: 0.12rem;
    width: 0.44rem;
    height: 0.44rem;
  }
  .order-list .border-menu .menu-item.on{
    color: #ffb623;
  }
  .loading{
    line-height: 0.5rem;
    text-align: center;
    font-size: 0.26rem;
    color: #666;
  }
  .balcony-order-item{
    margin: 0.2rem 0.23rem;
    border-radius: 3px;
    box-shadow: 0px 0 7px 3px #efeeee;
    background-color: #fff;
  }
  .balcony-order-item .num-status{
    position: relative;
    display: flex;
    padding: 0 0.25rem 0 0.15rem;
    justify-content: space-between;
    line-height: 0.76rem;
  }
  .balcony-order-item .num-status .num{
    font-size: 0.26rem;
    color: #646464;
  }
  .balcony-order-item .num-status .num i{
    color: #222222;
  }
  .balcony-order-item .status{
    font-size: 0.3rem;
    color: #222;
  }
  .balcony-order-item .date-wrapper{
    padding: 0 0.25rem 0 0.15rem;
    margin-top: 0.21rem;
    line-height: 0.36rem;
    font-size: 0.26rem;
    font-weight: bold;
    color: #222222;
  }
  .balcony-order-item .name{
    padding: 0 0.25rem 0.14rem 0.15rem;
    margin-top: 0.11rem;
    line-height: 0.36rem;
    font-size: 0.28rem;
    font-weight: bold;
    color: #222222;
  }
  .balcony-order-item .button-wrapper{
    position: relative;
    padding: 0.12rem 0.25rem 0.13rem 0;
  }
  .balcony-order-item .button-wrapper:before{
    left: 0.2rem;
    right: 0.2rem;
  }
  .balcony-order-item .button-wrapper button{
    float: right;
    display: block;
    width: 1.36rem;
    line-height: 0.54rem;
    font-size: 0.28rem;
    border: 1px solid #d5d5d5;
    border-radius: 4px;
    color: #666;
  }
  .balcony-order-item .button-wrapper button.on{
    border-color: #ffb23c;
    color: #fcab0d;
  }
</style>
