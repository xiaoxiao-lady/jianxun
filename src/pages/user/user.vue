<template>
  <!-- 个人中心 -->
  <div class="user">
    <div class="top-wrapper">
      <div class="user-infor">
        <img :src="userInfor.imageSmall" alt="" class="avatar">
        <div class="text">
          <div class="name">{{userInfor.name}}</div>
          <div class="job-number">员工号：{{userInfor.identifier}}</div>
        </div>
      </div>
      <div class="account-wrapper">
        <div class="title">余额（元）：</div>
        <div class="con">
          <router-link to="/recharge">
            <!--<button type="button" class="recharge">充值</button>-->
          </router-link>
          <div class="account">00.00</div>
        </div>
      </div>
    </div>
    <div class="menu-wrapper border-top">
      <router-link to="/orderList">
        <div class="menu-item border-bottom">
          <img src="../user/order.png" alt="" class="icon">
          <div class="text">我的订单</div>
          <img src="../../assets/next.png" alt="" class="next">
        </div>
      </router-link>
      <router-link to="/personalProfile">
        <div class="menu-item border-bottom">
          <img src="../user/infor.png" alt="" class="icon">
          <div class="text">个人资料</div>
          <img src="../../assets/next.png" alt="" class="next">
        </div>
      </router-link>
      <router-link to="/noticeList">
      <div class="menu-item border-bottom">
        <img src="../user/notice.png" alt="" class="icon">
        <div class="text">消息公告</div>
        <img src="../../assets/next.png" alt="" class="next">
      </div>
      </router-link>
      <router-link to="/feedback">
        <div class="menu-item border-bottom">
          <img src="../user/fankui.png" alt="" class="icon">
          <div class="text">意见反馈</div>
          <img src="../../assets/next.png" alt="" class="next">
        </div>
      </router-link>
    </div>
    <router-link to="/home">
      <div class="return-home"><img src="../../assets/home.png" alt=""></div>
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userInfor: {}
    }
  },
  created() {
    //  用户信息
    this.$axios({
      url: this.GLOBAL.BASE_URL + '/front/member/getMemberInfo',
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
          var userInfor = respanse.data.result
          this.userInfor = userInfor
        }
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .user .top-wrapper{
    padding: 0.49rem 0 0.19rem;
    background: url("../user/top-bg.png") no-repeat center center;
    background-size: 100% 100%;
  }
  .user .top-wrapper .user-infor{
    display: flex;
    padding-left: 0.57rem;
  }
  .user .top-wrapper .user-infor .avatar{
    display: block;
    width: 1.04rem;
    height: 1.04rem;
    border-radius: 50%;
  }
  .user .top-wrapper .user-infor .text{
    flex: 1;
    padding-top: 0.12rem;
    margin-left: 0.35rem;
    font-size: 0;
  }
  .user .top-wrapper .user-infor .text .name{
    line-height: 0.36rem;
    font-size: 0.3rem;
    color: #222;
  }
  .user .top-wrapper .user-infor .text .job-number{
    display: inline-block;
    vertical-align: top;
    padding: 0 0.08rem;
    margin-top: 0.11rem;
    line-height: 0.4rem;
    font-size: 0.24rem;
    border-radius: 3px;
    background-color: #e7bd69;
    color: #fff;
  }
  .user .top-wrapper .account-wrapper{
    padding: 0.48rem 0 0.56rem;
    margin: 0.29rem 0.4rem 0;
    text-align: center;
    font-size: 0;
    border-radius: 8px;
    background-color: #fff;
  }
  .user .top-wrapper .account-wrapper .title{
    line-height: 0.34rem;
    text-align: center;
    font-size: 0.26rem;
    color: #222222;
  }
  .user .top-wrapper .account-wrapper .con{
    position: relative;
    display: inline-block;
    vertical-align: top;
    padding: 0 1.06rem;
    margin-top: 0.18rem;
    line-height: 0.56rem;
    font-size: 0.48rem;
    font-weight: bold;
    color: #222;
  }
  .user .top-wrapper .account-wrapper .con .recharge{
    position: absolute;
    left: 0;
    top: 0.06rem;
    width: 0.88rem;
    line-height: 0.43rem;
    font-size: 0.26rem;
    border-radius: 3px;
    background-color: #ffb522;
    color: #fff;
  }
  .user .menu-wrapper{
    position: relative;
    margin-top: 0.67rem;
  }
  .user .menu-wrapper:before{
    left: 0.26rem;
    right: 0.26rem;
  }
  .user .menu-wrapper .menu-item{
    position: relative;
    display: flex;
    padding: 0 0.49rem 0 0.31rem;
  }
  .user .menu-wrapper .menu-item:after{
    left: 0.26rem;
    right: 0.26rem;
  }
  .user .menu-wrapper .menu-item .icon{
    display: block;
    margin: 0.24rem 0.25rem 0 0;
    width: 0.52rem;
    height: 0.54rem;
  }
  .user .menu-wrapper .menu-item .text{
    flex: 1;
    line-height: 0.99rem;
    font-size: 0.28rem;
    color: #222;
  }
  .user .menu-wrapper .menu-item .next{
    display: block;
    margin-top: 0.4rem;
    width: 0.12rem;
    height: 0.22rem;
  }
  .user .menu-wrapper .menu-item.on:before{
    content: " ";
    position: absolute;
    right: 0.78rem;
    top: 0.44rem;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #db040b;
  }
</style>
