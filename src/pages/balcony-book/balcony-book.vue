<template>
  <!-- 包厢预定 -->
  <div class="balcony-book bg-f6f6f6">
    <div class="time-wrapper border-bottom">
      <div class="title">就餐时间：</div>
      <div class="time-item" style="width: 49%">
        <select name="" v-on:change="changeDate($event)">
          <option :value="item.date"  v-for="(item, index) in dateAndClass" :key="index">{{item.date}} {{item.week}}</option>
        </select>
      </div>
      <div class="time-item" style="margin-left: 0.06rem;;width: 24.5%">
        <select ref="class" name="" v-on:change="changeClass($event)" v-for="(item, index) in dateAndClass" :key="index" v-show="currentIndex === index">
          <option :value="clas.id" v-for="(clas, index) in item.classVOS" :key="index">{{clas.name}}</option>
        </select>
      </div>
    </div>
    <div class="balcony-list">
      <div class=" clearfix" style="width: 9rem;">
        <div  class="balcony-item" v-for="(box, index) in boxList" :key="index">
          <div class="balcony-c" v-if="!box.status">
            <div class="name">{{box.name}}</div>
            <div class="num">{{box.remark}}</div>
            <button type="button" class="book" @click="getBoxDetail(box)">预定</button>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade" >
    <div class="mask" v-show="confirmBoxB" @click="confirmBoxHide"></div>
    </transition>
    <transition name="fade">
    <div class="confirm-box" v-show="confirmBoxB">
      <div class="title-wrapper">
        <span class="line"></span>
        <div class="title">预定信息确认</div>
        <span class="line"></span>
      </div>
      <div class="name">{{boxDetail.name}}</div>
      <div class="num-wrapper">
        <img src="../balcony-book/iconfontgerenzhongxin.png" alt="" class="icon">
        <div class="num">{{boxDetail.remark}}</div>
      </div>
      <div class="book-time">
        <span class="titl">预定时间：</span>{{date}} <span v-show="classId === 1">早餐</span><span v-show="classId === 2">午餐</span><span v-show="classId === 3">晚餐</span>
      </div>
      <button type="button" class="com-button comfir-btn" @click="toBalconyOrder(boxDetail.id, classId, date)">确定</button>
      <img src="../../assets/close.png" alt="" class="close" @click="confirmBoxHide">
    </div>
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dateAndClass: {},
      boxList: [],
      confirmBoxB: false,
      classId: {
        type: Number
      },
      date: '',
      boxDetail: {},
      currentIndex: 0
    }
  },
  created() {
    // 获取包厢筛选菜单
    this.$axios({
      url: this.GLOBAL.BASE_URL + '/company/canteen/canteen/getDayAndClass',
      method: 'post',
      headers: {
        'canteenId': this.$store.state.canteenId,
        'token': this.$store.state.token
      }
    })
      .then(respanse => {
        if (respanse.data.code !== 0) {
          this.$layer.msg(respanse.data.message)
        } else {
          let dateAndClass = respanse.data.result
          this.dateAndClass = dateAndClass
          this.classId = dateAndClass[0].classVOS[0].id
          this.date = dateAndClass[0].date
          this.getBox()
        }
      })
  },
  methods: {
    confirmBoxHide () {
      this.confirmBoxB = false
    },
    toBalconyOrder(boxId, classId, date) {
      this.$axios({
        url: this.GLOBAL.BASE_URL + '/front/order/box/create',
        method: 'post',
        headers: {
          'canteenId': this.$store.state.canteenId,
          'token': this.$store.state.token
        },
        data: this.$qs.stringify({
          'boxId': boxId,
          'classId': classId,
          'date': date
        })
      })
        .then(respanse => {
          let createOrderInfor = respanse.data
          if (respanse.data.code !== 0) {
            this.$layer.msg(createOrderInfor.message)
          } else {
            var orderId = createOrderInfor.result.orderId
            this.$router.push({path: '/balconyOrder', query: {orderId: orderId}})
          }
        })
    },
    // 获取包厢列表
    getBox() {
      this.$axios({
        url: this.GLOBAL.BASE_URL + '/front/order/box/getBox',
        method: 'post',
        headers: {
          'canteenId': this.$store.state.canteenId,
          'token': this.$store.state.token
        },
        data: this.$qs.stringify({
          'classId': this.classId,
          'date': this.date
        })
      })
        .then(respanse => {
          if (respanse.data.code !== 0) {
            this.$layer.msg(respanse.data.message)
          } else {
            let boxList = respanse.data.result
            this.boxList = boxList
          }
        })
    },
    //  修改筛选条件
    changeDate(event) {
      this.date = event.target.value
      this.currentIndex = event.target.selectedIndex
      this.classId = this.dateAndClass[this.currentIndex].classVOS[0].id // 重置数据
      this.$refs.class.forEach((classItem) => {
        classItem.options[0].selected = true // 重置dom
      })
      this.getBox()
    },
    changeClass(event) {
      this.classId = Number(event.target.value)
      this.getBox()
    },
    // 包厢详情
    getBoxDetail(box) {
      if (Object.keys(box).length !== 0) {
        this.confirmBoxB = true
      }
      this.boxDetail = box
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .balcony-book{
    padding-top: 0.87rem;
    box-sizing: border-box;
  }
  .balcony-book .time-wrapper{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 10;
    display: flex;
    padding-left: 0.26rem;
    background-color: #fff;
  }
  .balcony-book .time-wrapper .title{
    line-height: 0.87rem;
    font-size: 0.3rem;
    color: #666;
  }
  .balcony-book .time-wrapper .time-item{
    position: relative;
    height: 0.62rem;
    box-sizing: border-box;
    margin-top: 0.12rem;
    border: 1px solid #d8d8d8;
    border-radius: 0.1rem;
  }
  .balcony-book .time-wrapper .time-item:after{
    position: absolute;
    top: 50%;
    right: 0.12rem;
    margin-top: -2px;
    content: " ";
    width: 0;
    height: 0;
    border-top: 4px solid #959595;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
  }
  .balcony-book .time-wrapper .time-item select{
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    padding-left: 0.24rem;
    width: 100%;
    height: 0.62rem;
    line-height: 0.62rem;
    box-sizing: border-box;
    font-size: 0.3rem;
    background: none;
    color: #222;
  }
  .balcony-book .balcony-list{
    padding: 0 0.26rem;
    overflow: hidden;
  }
  .balcony-book .balcony-list .balcony-item{
    float: left;
    margin-right: 0.2rem;
    width: 3.35rem;
  }
  .balcony-book .balcony-list .balcony-item .balcony-c{
    padding: 0.24rem 0.16rem 0.18rem;
    margin: 0.18rem 0;
    box-sizing: border-box;
    border-radius: 0.16rem;
    box-shadow: 0 0 0.2rem 0.1rem #eeeeee;
    background-color: #fff;
  }
  .balcony-book .balcony-list .balcony-item .name{
    line-height: 0.4rem;
    font-size: 0.32rem;
    font-weight: bold;
    color: #222;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .balcony-book .balcony-list .balcony-item .num{
    padding-left: 0.32rem;
    margin-top: 0.18rem;
    line-height: 1;
    font-size: 0.24rem;
    background: url("../balcony-book/iconfontgerenzhongxin.png") no-repeat left top;
    background-size: 0.2rem 0.22rem;
    color: #222;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .balcony-book .balcony-list .balcony-item .book{
    display: block;
    margin-top: 0.4rem;
    width: 1.38rem;
    height: 0.62rem;
    box-sizing: border-box;
    line-height: 0.62rem;
    font-size: 0.28rem;
    border: 1px solid #222;
    border-radius: 0.08rem;
    color: #222;
  }
  .balcony-book .confirm-box{
    position: fixed;
    left: 0.26rem;
    right: 0.26rem;
    top: 50%;
    z-index: 100;
    border-radius: 0.1rem;
    padding: 0.23rem 0 0.67rem;
    transform: translateY(-50%);
    background-color: #fff;
  }
  .balcony-book .confirm-box .title-wrapper{
    display: flex;
    margin: 0 1.64rem;
  }
  .balcony-book .confirm-box .title-wrapper .line{
    flex: 1;
    margin-top: 0.18rem;
    height: 1px;
    background-color: #ffb522;
  }
  .balcony-book .confirm-box .title-wrapper .title{
    padding: 0 0.2rem;
    line-height: 0.36rem;
    font-size: 0.28rem;
    color: #ffb522;
  }
  .balcony-book .confirm-box .name{
    margin-top: 0.74rem;
    line-height: 0.4rem;
    text-align: center;
    font-size: 0.32rem;
    font-weight: bold;
    color: #222;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .balcony-book .confirm-box .num-wrapper{
    margin-top: 0.16rem;
    font-size: 0;
    text-align: center;
  }
  .balcony-book .confirm-box .num-wrapper .icon{
    display: inline-block;
    vertical-align: top;
    margin-right: 0.13rem;
    width: 0.2rem;
    height: 0.22rem;
  }
  .balcony-book .confirm-box .num-wrapper .num{
    display: inline-block;
    vertical-align: top;
    line-height: 1;
    font-size: 0.24rem;
    color: #222;
  }
  .balcony-book .confirm-box .book-time{
    margin-top: 0.84rem;
    line-height: 0.38rem;
    text-align: center;
    font-size: 0.3rem;
    font-weight: bold;
    color: #222;
  }
  .balcony-book .confirm-box .book-time .titl{
    font-weight: normal;
    color: #666;
  }
  .balcony-book .confirm-box .comfir-btn{
    margin: 0.96rem auto 0;
    width: 56.1%;
  }
  .balcony-book .confirm-box .close{
    position: absolute;
    right: 0.2rem;
    top: 0.2rem;
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.4);
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
</style>
