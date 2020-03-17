<template>
  <div id="app">
      <transition :name="transitionName">
        <keep-alive exclude="OrderList">
            <router-view  class="Router" ></router-view>
        </keep-alive>
      </transition>
      <!--<div class="tiwen-ct-back" ref="smallorange">-->
        <!--<span class="shouye-ct" @click="goToHome()" @touchmove="touchmove($event)">-->
          <!--<img src="./assets/home.png" />-->
        <!--</span>-->
      <!--</div>-->
      <!-- 语音 -->
      <!-- <div id="bdtts_div_id">
        <audio id="tts_autio_id" autoplay="autoplay">
          <source id="tts_source_id" src="http://tts.baidu.com/text2audio?lan=zh&amp;ie=UTF-8&amp;spd=5&amp;per=1&amp;text=" type="audio/mpeg">
          <embed id="tts_embed_id" height="0" width="0" src="">
        </audio>
      </div> -->
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      transitionName: 'slideleft',
      isShowFloat: false
    }
  },
  watch: {
    $route () { // 监听路由变化重新赋值
      if (this.$router.isleft) {
        this.transitionName = 'slideleft'
      }
      if (this.$router.isright) {
        this.transitionName = 'slideright'
      }
    }
  },
  methods: {
    // 显示悬浮框
    showFloat () {
      // this.isShowFloat = !this.isShowFloat
      this.$router.push('/')
    },
    // 返回首页
    goToHome () {
      this.$router.push('/home')
      // this.$router.togo('/')
    },
    // 拖动图标
    touchmove (evt) {
      evt.preventDefault()
      this.$refs.smallorange.style.left = (evt.touches[0].pageX - 20) + 'px'
      this.$refs.smallorange.style.top = (evt.touches[0].pageY - 20) + 'px'
    }
  }
}
</script>

<style lang="less">
  i{
    font-style: normal;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  -webkit-tap-highlight-color:rgba(0,0,0,0);
}
.Router {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  transition: all .5s ease;
  -webkit-transition: all .5s ease;
  -moz-transition: all .5s ease;
  /* border:1px solid #000; */
  box-sizing: border-box;
}
.slideleft-enter,
 .slideright-leave-active {
  opacity: 0;
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}
.slideleft-leave-active,
.slideright-enter {
  opacity: 0;
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100%, 0);
}

// 返回首页
.tiwen-ct-back{
  width: 75/75rem;
  height:75/75rem;
  position:fixed;
  right: 30/75rem;
  bottom: 60/75rem;
  z-index: 999;
  .shouye-ct{
    width: 75/75rem;
    height: 75/75rem;
    img{
      width: 100%!important;
      height: 100%!important;
    }
  }
}
  button{
    border: none;
    outline: none;
    border-radius: 0;
    background: #fff;
  }
  .return-home{
    position: fixed;
    right: 0;
    bottom: 1.1rem;
    z-index: 70;
    width: 1.02rem;
    height: 1.04rem;
  }
  .return-home img{
    display: block;
    width: 1.02rem;
    height: 1.04rem;
  }
  
.mint-indicator-mask {
  z-index: 9999!important;
}
</style>
