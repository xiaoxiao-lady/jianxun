<template>
  <div class="menu-index">
    <div class="return-home return-area" @click="goArea()" v-if="area">
        <i class="iconfont icon-diancan"></i>
    </div>
    <div class="return-home" @click="goHome()">
        <i class="iconfont icon-home-g"></i>
    </div>
  </div>
</template>

<script>
import '@/common/icon/iconfont.css'
export default {
    props: {
        area: {
            default: true
        }
    },
    methods: {
        goArea() {
            // if(this.$route.path.indexOf(''))
            this.$router.push({path:'/area'})
        },
        goHome() {
            this.$router.replace({path: '/home'})
        }
    }
}
</script>

<style scoped>
.return-area {
    bottom: 2.2rem;
    text-align: center;
    line-height: 1rem;
    background: orange;
}
.return-area:active {
    transform: scale(.95)
}
.return-home:active {
    transform: scale(.95)
}
.return-home {
    background: orange;
    text-align: center;
    line-height: 1rem;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,.2);
}
.return-home img{
    width: 100%;
    height: auto;
}
.icon-diancan,.icon-home-g {
    font-size: .6rem;
    color: #fff;
}
</style>