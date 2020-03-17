<template>
  <!-- 评价 -->
  <div class="rating bg-f6f6f6">
    <div class="order-infor border-bottom">
      <div class="order-num">订单号：<i>{{orderDetails.identifier}}</i></div>
      <div class="order-date">创建日期：<i>{{orderDetails.createTimeStr}}</i></div>
    </div>
    <div class="rating-list">
      <div class="rating-item">
        <div class="time">{{orderDetails.date}} {{orderDetails.week}} {{orderDetails.className}}</div>
        <div class="food-list">
          <div class="food-item border-bottom" v-for="(food, index) in orderDetails.products" :key="index">
            <div class="food-infor">
              <div class="icon" :style="{backgroundImage: 'url(' + food.image + ')'}"></div>
              <div class="text">
                <div class="name">{{food.name}}</div>
                <div class="desc" v-if="food.remark">{{food.remark}}</div>
              </div>
              <div class="num">×{{food.num}}</div>
              <div class="price">￥{{food.price}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="order-rating">
      <div class="title">对本次订单服务评价：</div>
      <div class="score-wrapper">
        <div class="score-item" :class="{'on': scoreIndex === 0}"  @click="selectedScore(0, 5)">
          <img src="../rating/manyi_off.png" alt="" class="icon icon-off">
          <img src="../rating/manyi_on.png" alt="" class="icon icon-on">
          <div class="text">满意</div>
        </div>
        <div class="score-item" :class="{'on': scoreIndex === 1}"  @click="selectedScore(1, 3)">
          <img src="../rating/jiaomanyi_off.png" alt="" class="icon icon-off">
          <img src="../rating/jiaomanyi_on.png" alt="" class="icon icon-on">
          <div class="text">较满意</div>
        </div>
        <div class="score-item" :class="{'on': scoreIndex === 2}"  @click="selectedScore(2, 1)">
          <img src="../rating/bumanyi_off.png" alt="" class="icon icon-off">
          <img src="../rating/bumanyi_on.png" alt="" class="icon icon-on">
          <div class="text">不满意</div>
        </div>
      </div>
      <textarea name="" v-model="content" placeholder="留言、建议" class="text-con" ></textarea>
    </div>
    <button type="button" class="com-button submit"  @click="submit">提交</button>

  </div>
</template>

<script>
import { getOrderDetail, orderComment  } from '@/api/order'
export default {
  data () {
    return {
      orderDetails: {},
      score: 5,
      scoreIndex: 0,
      id: '',
      content: '',
      productCommentJson: []
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.id = to.query.id
      // console.log(to.query.id)
      getOrderDetail({id: to.query.id}).then(respanse => {
        if (respanse.code !== 0) {
          vm.$layer.msg(respanse.message)
        } else {
          var orderDetails = respanse.result
          vm.orderDetails = orderDetails
        }
      })
    })
  },
  created() {
  },
  methods: {
    selectedScore(index, score) {
      this.scoreIndex = index
      this.score = score
    },
    submit() {
      this.productCommentJson = []
      for (var i = 0; i < this.orderDetails.products.length; i++) {
        this.productCommentJson.push({'id': this.orderDetails.products[i].id, 'orderProductId': this.orderDetails.products[i].orderProductId, 'score': this.score})
      }
      orderComment({
          'id': this.id,
          'productCommentJson': JSON.stringify(this.productCommentJson),
          'score': this.score,
          'content': this.content ? this.content : '好评！好评！好评！'
      }).then(respanse => {
        if (respanse.code !== 0) {
          this.$layer.msg(respanse.message)
        } else {
          this.$layer.msg('您的评价已提交！')
          this.$router.go(-1)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .rating .order-infor{
    position: relative;
    padding: 0.07rem 0.22rem 0.05rem;
    line-height: 0.32rem;
    font-size: 0.24rem;
    background-color: #fff;
    color: #666666;
  }
  .rating .order-infor i{
    color: #222222;
  }
  .rating .order-infor .order-date{
    margin-top: 0.08rem;
  }
  .rating .rating-item{
    padding: 0.15rem 0.22rem 0.05rem;
    margin-bottom: 0.18rem;
    background-color: #fff;
  }
  .rating .rating-item .time{
    line-height: 0.4rem;
    font-size: 0.3rem;
    font-weight: bold;
    color: #222;
  }
  .rating .rating-item .food-item{
    padding: 0.21rem 0;
  }
  .rating .rating-item .food-item .food-infor{
    display: flex;
  }
  .rating .rating-item .food-item .food-infor .icon{
    width: 0.9rem;
    height: 0.9rem;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
  .rating .rating-item .food-item .food-infor .text{
    flex: 1;
    margin-left: 0.24rem;
    overflow: hidden;
  }
  .rating .rating-item .food-item .food-infor .name{
    line-height: 0.4rem;
    font-size: 0.3rem;
    font-weight: bold;
    color: #222;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .rating .rating-item .food-item .food-infor .desc{
    margin-top: 0.1rem;
    line-height: 0.32rem;
    font-size: 0.24rem;
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .rating .rating-item .food-item .food-infor .num{
    width: 0.9rem;
    line-height: 0.84rem;
    text-align: right;
    font-size: 0.26rem;
    color: #222;
  }
  .rating .rating-item .food-item .food-infor .price{
    width: 1.38rem;
    line-height: 0.84rem;
    text-align: right;
    font-size: 0.28rem;
    color: #222;
  }
  .rating .order-rating{
    padding: 0.11rem 0.26rem 0.26rem;
    background-color: #fff;
  }
  .rating .order-rating .title{
    line-height: 0.38rem;
    font-size: 0.28rem;
    color: #666666;
  }
  .rating .order-rating .score-wrapper{
    text-align: center;
    font-size: 0;
  }
  .rating .order-rating .score-item{
    display: inline-block;
    vertical-align: top;
    padding: 0.3rem 0 0.14rem;
    width: 27%;
  }
  .rating .order-rating .score-item .icon{
    display: block;
    margin: 0 auto;
    width: 0.72rem;
    height: 0.72rem;
  }
  .rating .order-rating .score-item .icon.icon-on{
    display: none;
  }
  .rating .order-rating .score-item.on .icon.icon-on{
    display: block;
  }
  .rating .order-rating .score-item.on .icon.icon-off{
    display: none;
  }
  .rating .order-rating .score-item .text{
    margin-top: 0.12rem;
    line-height: 0.36rem;
    text-align: center;
    font-size: 0.28rem;
    color: #222222;
  }
  .rating .order-rating .score-item.on .text{
    font-weight: bold;
  }
  .rating .text-con{
    display: block;
    padding: 0.24rem 0.24rem 0;
    width: 100%;
    height: 1.88rem;
    box-sizing: border-box;
    line-height: 0.36rem;
    font-size: 0.28rem;
    border: 1px solid #dbdbdb;
    border-radius: 0.06rem;
    color: #222;
  }
  .rating .submit{
    margin: 0.42rem auto 0;
    width: 95.4%;
  }
</style>
