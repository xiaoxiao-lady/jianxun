<template>
    <div class="canteen">
      <div class="title">请选择食堂</div>
      <div class="content">
        <img src="../canteen/icon.png" alt="" class="icon">
        <div class="canteen-item" v-for="(canteenItem, index) in canteenList" :key="index"  @click="toHome(canteenItem)">
          <div class="name">{{canteenItem.name}}</div>
          <div class="type">提供餐别：<i v-for="classItem in JSON.parse(canteenItem.classJson)" :key="classItem.id">{{classItem.name}}<span>、</span></i></div>
          <div class="type time">开放预定时间：可提前{{canteenItem.delayDay}}天</div>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { getCanteenList } from '@/api/canteen'
// import {getUrlParam} from 'common/js/util'
export default {
  data () {
    return {
      canteenList: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getCanteenList()
    },
    getCanteenList () {
      getCanteenList().then(res => {
        this.canteenList = res.result
        if (res.code !== 0) {
          this.$layer.msg(res.message)
        } else {
          let canteenList = res.result
          this.canteenList = canteenList
          if (canteenList.length === 1) {
            this.toHome(canteenList[0])
          }
        }
      })
    },
    toHome (canteen) {
      sessionStorage.setItem('canteenName', canteen.name)
      this.$store.dispatch('setCanteenId', canteen.id)
      this.$router.togo('/home')
    }
  }
}
</script>

<style scoped>
  i{
    font-style: normal;
  }
  .canteen{
    position: absolute;
    width: 100%;
    min-height: 100%;
    background: url("../canteen/bg.jpg") no-repeat center center fixed;
    background-size: cover;
  }
  .canteen .title{
    padding-top: 0.97rem;
    line-height: 0.58rem;
    text-align: center;
    font-size: 0.48rem;
    font-weight: bold;
    color: #222222;
  }
  .canteen .content{
    position: relative;
  }
  .canteen .icon{
    position: absolute;
    left: 1.27rem;
    top: -0.98rem;
    width: 1.09rem;
    height: 1.27rem;
  }
  .canteen .content{
    padding: 0.29rem 0.82rem 0;
  }
  .canteen .canteen-item{
    padding: 0.37rem 0.65rem 0.26rem 0.33rem;
    margin-bottom: 0.36rem;
    border-radius: 0.2rem;
    box-shadow: 0px 3px 7px 0px rgba(187, 187, 187, 0.35);
    background: url("../canteen/next08.png") no-repeat 94.8% center #fff;
    background-size: 0.18rem 0.26rem;
  }
  .canteen .canteen-item .name{
    margin-bottom: 0.25rem;
    line-height: 0.48rem;
    font-size: 0.38rem;
    font-weight: bold;
    color: #ffb522;
  }
  .canteen .canteen-item .type{
    line-height: 0.37rem;
    font-size: 0.24rem;
    color: #666666;
  }
  .canteen .canteen-item .type i:last-child span{
    display: none;
  }
</style>
