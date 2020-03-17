<template>
  <!-- 个人资料 -->
  <div class="personal-profile">
    <div class="item-wrapper border-bottom" >
      <div class="title">姓名</div>
      <div class="con">{{userInfor.name}}</div>
    </div>
    <!-- <div class="item-wrapper border-bottom" >
      <div class="title">工号</div>
      <div class="con">{{userInfor.username}}</div>
    </div> -->
    <router-link :to="{path:'/changePassword',query: {mobile: userInfor.mobile}}">
      <div class="item-wrapper border-bottom" >
        <div class="title title2">修改登录密码</div>
        <div class="con on"></div>
      </div>
    </router-link>
    <!-- <router-link :to="{path:'/changePaymentPassword',query: {mobile: userInfor.mobile}}">
      <div class="item-wrapper border-bottom" >
        <div class="title title2">修改支付密码</div>
        <div class="con on"></div>
      </div>
    </router-link> -->
    <router-link :to="{path:'/changeTel',query: {mobile: userInfor.mobile}}">
      <div class="item-wrapper border-bottom" >
        <div class="title">手机号</div>
        <div class="con on">{{userInfor.mobile}}</div>
      </div>
    </router-link>
    <div class="item-wrapper border-bottom" >
      <div class="title">负责建筑物</div>
      <div class="con" style="text-align: left;padding-left: 10px;">{{userInfor.buildJson}}</div>
    </div>
    <div class="item-wrapper border-bottom" >
      <div class="title">负责病区/楼层</div>
      <div class="con" style="text-align: left;padding-left: 10px;">{{userInfor.areaJson}}</div>
    </div>
    <button type="button" class="com-button confirm" @click="loginOut">退出</button>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { getMemberInfo, loginOut } from  '@/api/user'
export default {
  data () {
    return {
      userInfor: {}
    }
  },
  activated() {
    //  用户信息
    getMemberInfo().then(respanse => {
        if (respanse.code !== 0) {
          this.$layer.msg(respanse.message)
        } else {
          var userInfor = respanse.result
          this.userInfor = userInfor

          if(userInfor.areaJson) {
            let arr = []
            JSON.parse(userInfor.areaJson).map(item => {
              arr.push(item.name)
            })
            this.userInfor.areaJson = arr.join('、')
          }
          if(userInfor.buildJson) {
            let arr = []
            JSON.parse(userInfor.buildJson).map(item => {
              arr.push(item.name)
            })
            this.userInfor.buildJson = arr.join('、')
          }
        }
      })
  },
  methods: {
    //  退出
    loginOut() {
      loginOut().then(respanse => {
          if (respanse.code !== 0) {
            this.$layer.msg(respanse.message)
          } else {
            sessionStorage.clear()
            Cookies.remove('token')
            this.$router.replace({path: '/login'})
          }
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .personal-profile .item-wrapper{
    position: relative;
    display: -webkit-flex;
    display: flex;
    padding-left: 0.36rem;
    background-color: #fff;
  }
  .personal-profile .item-wrapper .title{
    padding: 0.33rem 0 0.27rem;
    width: 1.5rem;
    line-height: 0.36rem;
    font-size: 0.3rem;
    color: #999;
  }
  .personal-profile .item-wrapper .title2{
    width: auto;
  }
  .personal-profile .item-wrapper .con{
    -webkit-flex: 1;
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    padding: 0.33rem 0.62rem 0.27rem 0;
    line-height: 0.36rem;
    text-align: right;
    font-size: 0.3rem;
    color: #222;
    word-break: break-all;
  }
  .personal-profile .item-wrapper .con.on{
    background: url(../../assets/next.png) no-repeat 95% center;
    background-size: 0.12rem 0.22rem;
  }
  .personal-profile .confirm{
    margin: 0.83rem auto 0;
    width: 93.3%;
  }

  .personal-profile a{
      text-decoration: none;
  }
</style>
