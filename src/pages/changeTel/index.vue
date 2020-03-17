<template>
  <!-- 修改手机号 -->
  <div class="receiving-information change-password">
    <div class="input-wrapper border-bottom">
      <div class="title">原手机号</div>
      <input type="text" readonly="readonly" :value="oldMobile" class="input-tag" />
    </div>
    <div class="input-wrapper yan border-bottom">
      <div class="title">新手机号</div>
      <input
        type="text"
        name=""
        placeholder="请输入新手机号"
        v-model="newMobile"
        class="input-tag"
      />
      <button type="button" :disabled="!canClick" class="send" @click="cutDown">
        {{ cutNUm }}
      </button>
    </div>
    <div class="input-wrapper border-bottom">
      <div class="title">验证码</div>
      <input type="text" placeholder="请输入验证码" v-model="yzm" class="input-tag" />
    </div>
    <button type="button" class="com-button confirm" @click="changeMobile">确定修改</button>
  </div>
</template>

<script>
import { validatemobile } from '@/common/js/util'
import { sendCode, updateMobile } from '@/api/user'

var timer = null
export default {
  data() {
    return {
      inputType: 'password',
      cutNUm: '发送验证码',
      currentTime: 60,
      canClick: true,
      oldMobile: '',
      newMobile: '',
      yzm: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.oldMobile = to.query.mobile
    })
  },
  methods: {
    // 切换密码显示类型
    toggleType() {
      if (this.inputType === 'password') {
        this.inputType = 'text'
      } else {
        this.inputType = 'password'
      }
    },
    // 短信验证码
    cutDown() {
      if (!validatemobile(this.newMobile, this)) {
        return
      }
      sendCode({
        type: 1,
        mobile: this.newMobile
      }).then(respanse => {
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
      })
    },
    changeMobile() {
      if (!validatemobile(this.newMobile, this)) {
        return
      }
      if (this.yzm === '') {
        this.$layer.msg('请输入验证码！')
        return
      }
      updateMobile({
        mobile: this.newMobile,
        code: this.yzm
      }).then(respanse => {
        if (respanse.code === 0) {
          this.$router.go(-1)
        } else {
          this.$layer.msg(respanse.message)
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
  width: 1.5rem;
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
  text-align: right;
  font-size: 0.3rem;
  color: #656565;
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
.receiving-information .confirm {
  margin: 0.82rem auto 0;
  width: 93.3%;
}
</style>
