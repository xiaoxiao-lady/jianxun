<template>
  <!-- 我的订单 -->
  <div class="orderList bg-f6f6f6">
    <div class="top-menu" v-show="bottomCurrentIndex===0">
      <div style="display: flex;">
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
      <div class="search">
        <i class="iconfont icon-suosou"></i>
        <input type="text" placeholder="请输入姓名或手机号" v-model="searchName" @input="initialization">
      </div>
    </div>
    <!--订单列表-->
    <!-- v-show="order.receiveName.indexOf(searchName) > -1"  -->
    <div class="content bg-f6f6f6" v-show="bottomCurrentIndex===0">
      <div class="order-item" 
        v-for="(order, index) in orderList" 
        :key="index" 
        @click="toOrderDetails(order.id)"
      >
        <div class="order-num-status border-bottom">
          <div class="order-num">订单号：<i>{{order.identifier}}</i></div>
          <div class="status" :class="{'on':order.status === 1}" v-if="order.status === 1">待付款</div>
          <div class="status"  v-if="order.status === 2">待配送</div>
          <div class="status"  v-if="order.status === 3">配送中</div>
          <div class="status"  v-if="order.status === 4">已配送</div>
          <div class="status"  v-if="order.status === 5">待评价</div>
          <div class="status"  v-if="order.status === 6">退款中</div>
          <div class="status"  v-if="order.status === 7">已退款</div>
          <div class="status"  v-if="order.status === 99">已取消</div>

        </div>
        <div class="text border-bottom">
          <div class="time-wrapper ">
            <div class="date">{{order.date}} {{order.week}}</div>
          </div>
          <div >
            {{order.className}}&nbsp;
            <span 
              class="name" 
              v-for="(product, index) in order.products" 
              :key="index" 
              v-show="index == 0"
            >
              {{product.name}} {{order.products.length >= 2 ? '等'+order.products.length+'件菜品' : ''}}
            </span>
          </div>
        </div>
        <div class="text">
          <div class="">
            {{order.receiveName}} {{order.birthdate | birth}}
          </div>
          <!-- <div class="">
            病例号:{{order.patientIdentifier}}
          </div> -->
          <div class="">
            {{order.receiveMobile}}
          </div>
          <div class="">
             {{order.receiveAddress}}
          </div>
          <!-- <div class="" v-if="order.doctorAdviceType == 1">
            医嘱：{{order.doctorAdvice}}（原始医嘱）
          </div>
          <div v-else>
            医嘱：无医嘱<br>现场确认饮食：{{order.doctorAdvice}}
          </div> -->
        </div>
        <div class="text totalAmount-ct">
          <span class="price">合计￥{{order.totalAmount}}</span>
          <span class="toPay-btn on" v-if="order.status === 1">付款</span>
        </div>
      </div>
      <div class="loading" v-show="loadingShow">加载中</div>
      <div class="loading end" v-show="loadingFinsh">没有更多了</div>
    </div>
    <menuindex />
  </div>
</template>

<script>
import { getOrderList } from '@/api/order'
import moment from 'moment'
import '../../../static/css/icon/iconfont.css'

export default {
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
      type: 92, // 查询参数。类型：1,职工，2订餐员 3病患，4包厢,5职工和包厢
      listQuery: {
        areaId: ''
      },
      searchName: '',
    }
  },
  filters: {
    birth(val) {
      if(val) {
        return moment(val).format('YYYY-MM-DD')
      } else {
        return ''
      }
      
    }
  },
  activated () {
    this.initialization()
    // 获取包厢订单列表
    // this.initialization2()
  },
  created () {
    // 获取订单列表
    // this.initialization()
  },
  mounted () {
    // let _this = this
    // 注册scroll事件并监听
    // window.addEventListener('scroll', function () {
    //   var x = window.pageYOffset + window.innerHeight
    //   var y = document.documentElement.scrollHeight
    //   if ((y - x) >= 200) {
    //     // _this.getOrderList(false)
    //     // if (_this.bottomCurrentIndex === 0) {
    //     //   _this.getOrderList(false)
    //     // } else {
    //     //   _this.getBalconyOrderList(false)
    //     // }
    //   }
    // })
    let _this = this
    window.onscroll = function () {
      // 变量scrollTop是滚动条滚动时，距离顶部的距离
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      // 变量windowHeight是可视区的高度
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      // 变量scrollHeight是滚动条的总高度
      var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      // 滚动条到底部的条件
      if (Math.ceil(scrollTop + windowHeight) === scrollHeight) {
      // 写后台加载数据的函数
      // if (_this.bottomCurrentIndex === 0) {
        _this.getOrderList(false)
      // } else {
      // _this.getBalconyOrderList(false)
      // }
      }
    }
  },
  methods: {
    // 顶部菜单
    selectMenu (index) {
      if(this.currentIndex == index) return
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
    // selectBottomMenu (index) {
    //   this.bottomCurrentIndex = index
    //   this.initialization2()
    //   this.initialization()
    // },
    // 初始化(普通订单)
    initialization () {
      document.documentElement.scrollTop = 0
      this.pageNo = 1
      this.orderList = []
      this.loadingShow = false
      this.loadingFinsh = false
      this.getOrderList(true)
    },
    // 初始化（包厢订单）
    // initialization2 () {
    //   document.documentElement.scrollTop = 0
    //   this.boxPageNo = 1
    //   this.balconyOrderList = []
    //   this.boxLoadingShow = false
    //   this.boxLoadingFinsh = false
    //   this.getBalconyOrderList(true)
    // },
    // 获取订单列表
    getOrderList (isRemove) {
      if (this.loadingShow || this.loadingFinsh) return
      if (isRemove) {
        this.orderList = []
      }
      this.loadingShow = true
      let params = {
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        status: this.status,
        type: this.type,
        receiveNameAndReceiveMobile: this.searchName
      }
      setTimeout(() => {
        getOrderList(params).then(res => {
          var orderList = res.result
          if (orderList === null || orderList === '' || orderList.length < 1) {
            this.loadingFinsh = true
            this.loadingShow = false
          } else {
            for (var i = 0; i < orderList.length; i++) {
              this.orderList.push(orderList[i])
            }
            this.loadingShow = false
          }
        })
        this.pageNo = this.pageNo + 1
      }, 100)
    },
    // 跳转到订单详情
    toOrderDetails (orderId) {
      // this.$router.push({path: '/orderDetails', query: {id: orderId}})
      this.$router.togo(`/orderDetails?id=${orderId}`)
    },
    toBalconyOrderDetails (orderId) {
      this.$router.push({path: '/balconyOrder', query: {orderId: orderId}})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  i{
    font-style: normal;
  }
  .orderList{
    /* overflow-y: scroll; */
    .text{
      // border-bottom:1px solid #ededed;
      line-height: 0.4rem;
      font-size: 0.3rem;
      color: #222;
    }
  }
  .orderList .top-menu{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
    // display: flex;
    background-color: #fff;
    border-bottom:1px solid #ededed;
    .search {
      display: flex;
      align-items: center;
      padding: .18rem .4rem;
      // border-top: 1px solid #ebebeb;
      background: #f5f5f5;
      i {
        font-weight: bold;
        margin-right: .15rem;
        color: #9c9c9c;
      }
      input {
        flex: 1;
        background: #fff;
        border-radius: .4rem;
        padding: .1rem .2rem;
      }
    }
  }

  .orderList .top-menu .menu-item{
    flex: 1;
    font-size: 0;
    text-align: center;

  }
  .orderList .top-menu .menu-item .text{
    position: relative;
    display: inline-block;
    vertical-align: top;
    line-height: 0.76rem;
    font-size: 0.28rem;
    color: #666;
  }
  .orderList .top-menu .menu-item.on .text{
    color: #222;
  }
  .orderList .top-menu .menu-item.on .text:after{
    content: " ";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 4px;
    border-radius: 2px;
    background-color: #ffb623;
  }
  .orderList .content{
    padding: 1.7rem 0 0.92rem;
  }
  .orderList .order-item{
    margin: 0.18rem 0.26rem;
    border-radius: 0.15rem;
    background-color: #fff;
  }
  .orderList .order-item .order-num-status{
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 0 0.15rem;
    line-height: 0.77rem;
  }
  .orderList .order-item .order-num-status .order-num{
    font-size: 0.28rem;
    color: #666;
  }
  .orderList .order-item .order-num-status .order-num i{
    color: #222;
  }
  .status{
    font-size: 0.28rem;
    color: #666;
  }
  .status.on{
    color: #ffb623;
  }
  .orderList .order-item .order-num-status .status{
    font-size: 0.28rem;
    font-weight: bold;
    color: #666;
  }
  .orderList .order-item .order-num-status .status.on{
    color: #ffb623;
  }
  .orderList .order-item .text{
    padding: 0.12rem 0.15rem 0.16rem;
  }
  .orderList .order-item .time-wrapper{
    display: flex;
    justify-content: space-between;
    line-height: 0.36rem;
    font-size: 0.28rem;
    font-weight: bold;
    color: #222;
  }
  .orderList .order-item .food-infor{
    display: flex;
    margin-top: 0.15rem;
    overflow: hidden;
  }
  .orderList .order-item .food-infor .icon{
    width: 0.9rem;
    height: 0.9rem;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
  .orderList .order-item .food-infor .name{
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
  .orderList .order-item .food-infor .price{
    width: 1.6rem;
    line-height: 0.9rem;
    text-align: right;
    font-size: 0.28rem;
    font-weight: bold;
    color: #222;
  }
  .orderList .order-item .balcony-name{
    margin-top: 0.16rem;
    line-height: 0.4rem;
    font-size: 0.3rem;
    font-weight: bold;
    color: #222;
  }
  // .orderList .order-item .button-wrapper{
  //   /* margin-top: 0.15rem; */
  // }
  .orderList .order-item .button-wrapper button{
    float: right;
    width: 1.38rem;
    height: 0.6rem;
    line-height: 0.6rem;
    font-size: 0.28rem;
    border: 1px solid #ffb623;
    border-radius: 4px;
    color: #ffb623;
  }
  .orderList .border-menu{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    display: flex;
    background-color: #fff;
  }
  .orderList .border-menu .menu-item{
    flex: 1;
    padding: 0.22rem 0 0.26rem;
    line-height: 0.44rem;
    text-align: center;
    font-size: 0.28rem;
    font-weight: bold;
    color: #222;
  }
  .orderList .border-menu .menu-item .icon{
    display: inline-block;
    vertical-align: bottom;
    margin-right: 0.12rem;
    width: 0.44rem;
    height: 0.44rem;
  }
  .orderList .border-menu .menu-item.on{
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
  .totalAmount-ct{
    text-align:right;
    font-weight: bold;
    .toPay-btn{
      /* border-color: #ffb23c;
      color: #fcab0d; */
      display: inline-block;
      width: 1.36rem;
      line-height: 0.54rem;
      font-size: 0.28rem;
      border: 1px solid #d5d5d5;
      border-radius: 4px;
      color: #666;
      text-align:center;
    }
    .toPay-btn.on{
      border-color: #ffb23c;
      color: #fcab0d;
    }
  }
</style>
