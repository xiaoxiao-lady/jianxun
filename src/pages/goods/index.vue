<template>
  <!-- 订餐下单 -->
  <div class="goods bg-fff">
    <div class="inpatient-area-wrapper">
      <div class="inpatient-area"><img src="../../assets/area-icon.png" class="icon" alt="">{{userInfor.buildName}}/{{userInfor.areaName}}/{{userInfor.identifier}}</div>
      <!--<div class="search"></div>-->
    </div>
    <div class="user-infor">
      <div class="infor-left">
        <div class="name">{{userInfor.memberName}}</div>
        <!-- <div class="num" v-if="userInfor.doctorAdviceType != 0">医嘱：{{userInfor.memberDoctorAdvice}}</div> -->
        <!-- <div class="num" v-else>无医嘱 （现场确认饮食：{{userInfor.memberDoctorAdvice}}）</div> -->
      </div>
      <!--<div class="balance">余额(元)：<span>{{userInfor.balance}}</span></div>-->
    </div>
    <div v-for="(good, index) in goods" :key="index" v-show="goodsIndex === index">
      <div class="date-wrapper">
        {{good.date}} {{good.week}}
        <div class="btn pre-day" v-show="goodsIndex > 0" @click="decreaseDate"></div>
        <div class="btn next-day" @click="addDate" v-show="goodsIndex < goods.length-1"></div>
      </div>
      <div class="tab-menu-wrapper border-bottom">
        <div class="tab-menu">
          <div class="tab-item" v-for="(classDTO, index) in good.classDTOS" :class="{'on':classIndex === index}" @click="selectClassMenu(index)" :key="index">{{classDTO.className}}<br>{{classDTO.classTime}}</div>
        </div>
      </div>
      <div class="menu-wrapper" v-for="(classDTO, index) in good.classDTOS" v-show="classIndex === index" :key="index">
        <ul class="menu">
          <li class="menu-item" v-for="(categoryDTO, index) in classDTO.categoryDTOS" :key="index" :class="{'on':currentIndex === index}"
              @click="selectMenu(index)">{{categoryDTO.categoryName}}
          </li>
        </ul>
        <div class="foods-wrapper">
          <ul v-for="(categoryDTO, index) in classDTO.categoryDTOS" :key="index" v-show="currentIndex === index">
            <li  class="food-list">
              <h2 class="title">{{categoryDTO.categoryName}} <span style="color: #8b8b8b;font-size: .24rem;">（图片仅供参考）</span>  </h2>
              <ul>
                <li class="food-item" v-for="(food, index) in categoryDTO.productDTOS" :key="index"  @click="getFoodDetail(food)">
                  <div class="icon" :style="{backgroundImage: 'url(' + food.image + ')'}" ></div>
                  <div class="content">
                    <div class="text">
                      <h2 class="name">{{food.name}}</h2>
                      <p class="desc">{{food.remark}}</p>
                    </div>
                    <div class="price">￥{{food.price}}</div>
                    <div class="cartcontrol-wrapper">
                      <cartcontrol :food="food"  @cart-add="_drop"></cartcontrol>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <transition name="fade">
        <div class="mask" v-show="detailShow" @click="detailHide"></div>
      </transition>
      <transition name="fade">
        <div class="food-detail" v-show="detailShow">
          <img src="../../assets/close.png" alt="" class="close" @click="detailHide">
          <img :src="foodDetails.image" alt="" class="food-img">
          <div class="text">
            <div class="name-price">
              <div class="name">{{foodDetails.name}}</div>
              <div class="price">￥{{foodDetails.price}}</div>
            </div>
            <div class="desc">{{foodDetails.remark}}</div>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food="foodDetails"></cartcontrol>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="shopcart-wrapper"><shopcart ref="shopcart"></shopcart></div>
  </div>
</template>

<script>
  import cartcontrol from '@/components/cartcontrol/cartcontrol'
  import shopcart from '@/components/shopcart/shopcart'
  import { getMemberInfo } from '@/api/user' 
  export default {
    data () {
      return {
        currentIndex: 0,
        goodsIndex: 0,
        classIndex: 0,
        detailShow: false,
        foodDetails: {},
        notieList: [],
        userInfor: {},
        openIsAdd: false,
      }
    },
    computed: {
      goods: function () {
        return this.$store.getters.goodsData
      }
    },
    created() {
      // 获取商品列表和获取购物车
      // this.getUserInfor()
    },
    activated() {
      this.getData()
    },
    methods: {
      commitIsAdd(val) {
        this.$store.commit('setIsAdd', val)
        this.getData()
      },
      getData() {
        this.getUserInfor()
        this.$store.dispatch('getGoods')
      },
      // 套餐选择
      selectMenu (index) {
        this.currentIndex = index
      },
      // 餐别选择
      selectClassMenu(index) {
        this.classIndex = index
        this.currentIndex = 0
      },
      // 后一天
      addDate () {
        this.goodsIndex++
        this.classIndex = 0
        this.currentIndex = 0
      },
      // 前一天
      decreaseDate () {
        this.goodsIndex--
        this.classIndex = 0
        this.currentIndex = 0
      },
      // 商品详情
      getFoodDetail (food) {
        if (Object.keys(food).length !== 0) {
          this.detailShow = true
        }
        this.foodDetails = food
      },
      // 隐藏商品详情
      detailHide () {
        this.detailShow = false
      },
      _drop(target) {
        // 体验优化,异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target)
        })
      },
      //  用户信息
      getUserInfor() {
        this.userInfor = this.$store.getters.patientData
        return
        getMemberInfo().then(respanse => {
            if (respanse.code !== 0) {
              this.$layer.msg(respanse.message)
            } else {
              var userInfor = respanse.result
              this.userInfor = userInfor
            }
          })
      }
    },
    components: {
      cartcontrol,
      shopcart
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .goods .menu-wrapper{
    position: fixed;
    left: 0;
    top: 3.75rem;
    bottom: 0;
    display: flex;
    width: 100%;
  }
  .goods .menu-wrapper .menu{
    padding-bottom: 1.15rem;
    width: 1.66rem;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #f6f6f6;
  }
  .goods .menu-wrapper .menu-item{
    position: relative;
    padding: 0.2rem 0 0.2rem 0.14rem;
    line-height: 0.38rem;
    text-align: center;
    font-size: 0.28rem;
    color: #666666;
    word-break: break-all;
  }
  .goods .menu-wrapper .menu-item.on{
    background-color: #fff;
    font-weight: bold;
    color: #222222;
  }
  .goods .menu-wrapper .menu-item.on:after{
    content: " ";
    position: absolute;
    left: 0;
    top: 0.08rem;
    bottom: 0.08rem;
    width: 0.08rem;
    background-color: #fd9025;
  }
  .goods .date-wrapper{
    position: relative;
    margin: 0.2rem 0.28rem 0;
    height: 0.62rem;
    box-sizing: border-box;
    line-height: 0.62rem;
    text-align: center;
    font-size: 0.28rem;
    font-weight: bold;
    color: #222222;
  }
  .goods .date-wrapper:after{
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 200%;
    height: 200%;
    border: 1px solid #e4e4e4;
    box-sizing: border-box;
    border-radius: 0.62rem;
    transform-origin: 0 0;
    transform: scale(0.5, 0.5);
  }
  .goods .date-wrapper .btn{
    position: absolute;
    top: 0;
    width: 0.65rem;
    height: 0.62rem;
  }
  .goods .date-wrapper .next-day{
    right: 0;
    background: url("../../assets/next.png") no-repeat center center;
    background-size: 0.11rem 0.22rem;
  }
  .goods .date-wrapper .pre-day{
    left: 0;
    background: url("../../assets/pre.png") no-repeat center center;
    background-size: 0.11rem 0.22rem;
  }
  .goods .foods-wrapper{
    flex: 1;
    padding-bottom: 1.15rem;
    padding-left: 0.43rem;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #fff;
  }
  .goods .foods-wrapper .title{
    line-height: 0.34rem;
    font-size: 0.26rem;
    color: #666;
  }
  .goods .foods-wrapper .food-list{
    margin-top: 0.1rem;
  }
  .goods .foods-wrapper .food-item{
    position: relative;
    display: flex;
    padding-bottom: 0.37rem;
  }
  .goods .foods-wrapper .food-item:first-child{
    margin-top: 0.14rem;
  }
  .goods .foods-wrapper .food-item .icon{
    width: 1.7rem;
    height: 1.7rem;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
  .goods .foods-wrapper .food-item .content{
    flex: 1;
    padding-right: 0.15rem;
    margin-left: 0.15rem;
  }
  .goods .foods-wrapper .food-item .content .text{
    min-height: 1.24rem;
  }
  .goods .foods-wrapper .food-item .content .name{
    line-height: 0.36rem;
    font-size: 0.3rem;
    font-weight: bold;
    color: #222;
  }
  .goods .foods-wrapper .food-item .content .desc{
    margin-top: 0.07rem;
    line-height: 0.32rem;
    font-size: 0.24rem;
    color: #999999;
  }
  .goods .foods-wrapper .food-item .content .price{
    margin-top: 0.1rem;
    line-height: 0.32rem;
    font-size: 0.28rem;
    font-weight: bold;
    color: #222;
  }
  .goods .foods-wrapper .food-item .cartcontrol-wrapper{
    position: absolute;
    right: 0.26rem;
    bottom: 0.26rem;
  }
  .goods .mask{
    z-index: 110;
  }
  .goods .food-detail{
    position: fixed;
    left: 0.28rem;
    right: 0.28rem;
    top: 1.5rem;
    z-index: 120;
    background-color: #fff;
  }
  .goods .food-detail .close{
    position: absolute;
    right: 0;
    top: -0.84rem;
    display: block;
    width: 0.56rem;
    height: 0.56rem;
  }
  .goods .food-detail .food-img{
    display: block;
    width: 100%;
  }
  .goods .food-detail .name-price{
    display: flex;
    padding-right: 0.3rem;
    line-height: 0.4rem;
    font-size: 0.32rem;
    font-weight: bold;
    color: #222;
  }
  .goods .food-detail .name-price .name{
    flex: 1;
  }
  .goods .food-detail .name-price .price{
    width: 1.74rem;
    font-size: 0.36rem;
    text-align: right;
  }
  .goods .food-detail .desc{
    padding-right: 2.17rem;
    margin-top: 0.08rem;
    line-height: 0.34rem;
    font-size: 0.26rem;
    color: #999;
  }
  .goods .food-detail .text{
    position: relative;
    padding: 0.36rem 0 0.3rem 0.3rem;
    min-height: 2rem;
    box-sizing: border-box;
  }
  .goods .food-detail .cartcontrol-wrapper{
    position: absolute;
    right: 0.22rem;
    bottom: 0.45rem;
  }
  .goods .shopcart-wrapper{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
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
  .inpatient-area-wrapper{
    display: flex;
    justify-content: space-between;
    padding-left: 0.3rem;
  }
  .inpatient-area-wrapper .inpatient-area{
    flex: 1;
    padding: 0.18rem 0 0.17rem;
    line-height: 0.43rem;
    font-size: 0.32rem;
    font-weight: bold;
    color: #222222;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .inpatient-area-wrapper .inpatient-area .icon{
    display: inline-block;
    vertical-align: bottom;
    margin-right: 0.21rem;
    width: 0.47rem;
    height: 0.43rem;
  }
  .inpatient-area-wrapper .search{
    width: 1.05rem;
    background: url("../../assets/fangdajing.png") no-repeat center center;
    background-size: 0.42rem 0.42rem;
  }
  .user-infor{
    display: flex;
    justify-content: space-between;
    padding: 0.24rem 0.39rem 0.22rem 0.28rem;
    margin: 0.17rem 0.21rem 0;
    border-radius: 0.06rem;
    background: url("../../assets/infor-bg.png") no-repeat;
    background-size: 100%;
    box-shadow: 0 0 0.3rem 0.05rem #f0f0f0;
  }
  .user-infor .name{
    line-height: 0.34rem;
    font-size: 0.26rem;
    color: #906108;
  }
  .user-infor .num{
    margin-top: 0.04rem;
    line-height: 0.34rem;
    font-size: 0.26rem;
    color: #906108;
  }
  .user-infor .balance{
    line-height: 0.72rem;
    font-size: 0.3rem;
    color: #444444;
  }
  .user-infor .balance span{
    font-weight: bold;
  }
  .tab-menu-wrapper{
    position: relative;
  }
  .tab-menu{
    position: relative;
    font-size: 0;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .tab-menu .tab-item{
    position: relative;
    display: inline-block;
    vertical-align: top;
    padding: .1rem 0.6rem;
    line-height: 0.4rem;
    font-size: 0.28rem;
    color: #222222;
  }
  .tab-menu .tab-item.on{
    font-weight: bold;
  }
  .tab-menu .tab-item.on:after{
    content: " ";
    position: absolute;
    left: 0.6rem;
    right: 0.6rem;
    bottom: 0;
    z-index: 6;
    height: 4px;
    border-radius: 2px;
    background-color: #fd9025;
  }
</style>
