<template>
  <!-- 修改密码 -->
  <div class="receiving-information change-password">
    <div class="input-wrapper border-bottom" style="margin-top: 0.18rem;">
      <div class="title">手机号</div>
      <input
        type="text"
        style="text-align: right;"
        readonly="readonly"
        :value="mobile"
        class="input-tag"
      />
    </div>
    <div class="input-wrapper yan border-bottom">
      <div class="title">验证码</div>
      <input type="text" name="" placeholder="请输入验证码" v-model="yzm" class="input-tag" />
      <button type="button" :disabled="!canClick" class="send" @click="cutDown">
        {{ cutNUm }}
      </button>
    </div>
    <div class="input-wrapper border-bottom" style="margin-top: 0.18rem;">
      <div class="title">输入新密码</div>
      <input
        type="password"
        name=""
        placeholder="请输入新登录密码"
        v-model="newPassword"
        class="input-tag"
      />
    </div>
    <button type="button" class="com-button confirm" @click="changePassword">确定修改</button>
  </div>
</template>

<script>
import { validatemobile } from '@/common/js/util'
import { sendCode, updatePassword } from '@/api/user'

let timer = null
export default {
  data() {
    return {
      mobile: '',
      yzm: '',
      newPassword: '',
      cutNUm: '发送验证码',
      currentTime: 60,
      canClick: true
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.mobile = to.query.mobile
    })
  },
  methods: {
    // 短信验证码
    cutDown() {
      if (!validatemobile(this.mobile, this)) {
        return
      }
      sendCode({
        type: 2,
        mobile: this.mobile
      })
        .then(respanse => {
          if (respanse.code !== 0) {
            this.$layer.msg(respanse.message)
          } else {
            if (!this.canClick) return
            this.canClick = false
            this.cutNUm = this.currentTime + 's'
            timer = setInterval(() => {
              this.currentTime--
              this.cutNUm = this.currentTime + 's'
              if (this.currentTime === 0) {
                clearInterval(timer)
                this.cutNUm = '重新发送'
                this.canClick = true
                this.currentTime = 60
              }
            }, 1000)
          }
        })
        .catch(error => {
          console.log(error)
          clearInterval(timer)
          this.cutNUm = '重新发送'
          this.canClick = true
          this.currentTime = 60
        })
    },
    // 修改密码
    changePassword() {
      if (this.yzm === '') {
        this.$layer.msg('请输入验证码！')
        return
      }
      if (this.newPassword === '') {
        this.$layer.msg('请输入新登录密码！')
        return
      }
      updatePassword({
        code: this.yzm,
        mobile: this.mobile,
        password: this.newPassword,
        type: 1
      }).then(respanse => {
        if (respanse.code !== 0) {
          this.$layer.msg(respanse.message)
        } else {
          this.$layer.msg('登录密码修改成功！')
          this.$router.go(-1)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.receiving-information {
  background: #f9f9f9;
}
.receiving-information .input-wrapper {
  position: relative;
  display: -webkit-flex;
  display: flex;
  padding-left: 0.4rem;
  background-color: #fff;
}
.receiving-information .input-wrapper .title {
  padding: 0.33rem 0 0.27rem;
  width: 2rem;
  line-height: 0.36rem;
  font-size: 0.3rem;
  color: #333;
}
.receiving-information .input-tag {
  -webkit-flex: 1;
  flex: 1;
  padding-right: 0.36rem;
  width: 100%;
  height: 0.96rem;
  font-size: 0.3rem;
  color: #656565;
}
.receiving-information .confirm {
  margin: 0.82rem auto 0;
  width: 93.3%;
}
.receiving-information .input-wrapper.yan .input-tag {
  margin-right: 1.84rem;
}
.receiving-information .input-wrapper.yan .send {
  position: absolute;
  right: 0.36rem;
  top: 0.22rem;
  width: 1.6rem;
  height: 0.52rem;
  box-sizing: border-box;
  line-height: 0.52rem;
  font-size: 0.24rem;
  border: 1px solid #39bdfa;
  border-radius: 4px;
  color: #39bdfa;
}
.receiving-information .input-wrapper.yan .send[disabled] {
  background-color: #f6f6f6;
  border-color: #f6f6f6;
  color: #d4d4d4;
}
</style>
