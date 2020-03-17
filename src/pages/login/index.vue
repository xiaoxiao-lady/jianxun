<template>
  <!-- 登录 -->
  <div class="login">
    <div class="title-wrapper">
      <!-- <div class="bg"></div> -->
      <div class="title">医院食堂订餐系统</div>
    </div>
    <input type="text" name placeholder="请输入账号" v-model="mobile" class="login-input tel" />
    <input type="password" name placeholder="请输入登录密码" v-model="password" class="login-input passw" />
    <button type="button" class="com-button login-btn" @click="login">登录</button>
  </div>
</template>

<script>
import { MessageBox } from "mint-ui";
export default {
  data() {
    return {
      mobile: "",
      password: ""
    };
  },
  created() {
    // let title = "支付详情";
    // let message = `
    //   <p style="display: flex;align-items: center;padding:0;margin:0;line-height:30px;color: #222;">
    //     <span style="min-width: 100px;text-align: left;">姓名</span>:
    //     <span style="flex: 1;text-align:left;padding-left: 10px">稿子解</span>
    //   </p>
    //   <p style="display: flex;align-items: center;padding:0;margin:0;line-height:30px;color: #222;">
    //     <span style="min-width: 100px;text-align: left;">当前卡号</span>:
    //     <span style="flex: 1;text-align:left;padding-left: 10px">1231415322222222222225135</span>
    //   </p>
    //   <p style="display: flex;align-items: center;padding:0;margin:0;line-height:30px;color: #222;">
    //     <span style="min-width: 100px;text-align: left;">当前现金余额</span>:
    //     <span style="flex: 1;text-align:left;padding-left: 10px">234元</span>
    //   </p>
    //   <p style="display: flex;align-items: center;padding:0;margin:0;line-height:30px;color: #222;">
    //     <span style="min-width: 100px;text-align: left;">支付金额</span>:
    //     <span style="flex: 1;text-align:left;padding-left: 10px">244.5元</span>
    //   </p>
    //   <p style="color:#ff6b24;font-size: 12px;line-height: 14px;text-align:left;margin:5px 0;">*交易时，优先扣除补助余额。</p>
    //   <p style="color:#ff6b24;font-size: 12px;line-height: 14px;text-align:left;margin:5px 0;">*暂不支持现金和补助余额混合支付</p>`;
    // MessageBox({
    //   title,
    //   message,
    //   showCancelButton: true,
    //   closeOnClickModal: false,
    //   confirmButtonText: "确认支付"
    // })
  },
  activated() {
    this.password = "";
  },
  methods: {
    login() {
      if (this.password === "") {
        this.$layer.msg("请输入密码！");
        return;
      }
      if (this.mobile === "") {
        this.$layer.msg("请输入账号！");
      }
      let params = {
        username: this.mobile,
        password: this.password
      };
      this.$store.dispatch("LoginByUsername", params).then(response => {
        this.$router.togo(this.redirect || "/");
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  background-image: url("./bg.png");
  background-size: cover;
}
.login input {
  color: #fff;
}
.login .title-wrapper {
  position: relative;
  padding: 1.29rem 0.1rem 0;
  width: 100%;
  height: 4.3rem;
  box-sizing: border-box;
  overflow: hidden;
}
.login .bg {
  position: absolute;
  left: 50%;
  bottom: 0;
  z-index: -1;
  margin-left: -7.5rem;
  width: 15rem;
  height: 15rem;
  border-radius: 50%;
  background-color: #fdc355;
}
.login .title {
  line-height: 0.7rem;
  text-align: center;
  font-size: 0.46rem;
  color: #fff;
  text-shadow: 0px 3px 7px rgba(150, 150, 150, 0.35);
}
.login .login-input {
  display: block;
  padding-left: 0.16rem;
  margin: 0.57rem auto 0;
  width: 73%;
  height: 0.76rem;
  box-sizing: border-box;
  font-size: 0.3rem;
  border-bottom: 1px solid #cfcfcf;
  color: #fff;
}
.login .login-input.passw {
  margin: 0.53rem auto 0;
}
.login .login-btn {
  margin: 1.45rem auto 0;
  width: 73%;
}
.login-input::-webkit-input-placeholder {
  color: #fff;
}
</style>
