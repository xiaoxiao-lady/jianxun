<template>
  <!-- 消息详情 -->
  <div class="notice-details bg-fff">
    <h2 class="title">{{noticeDetails.title}}</h2>
    <div class="date">{{noticeDetails.createDateStr}}</div>
    <div class="text border-top">{{noticeDetails.content}}</div>
  </div>
</template>

<script>
import { getNoticeDetail } from '@/api/notice'
export default {
  data () {
    return {
      noticeDetails: {}
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let data = {
        id: vm.$route.query.id
      }
      getNoticeDetail(data).then(respanse => {
        if (respanse.code !== 0) {
          vm.$layer.msg(respanse.message)
        } else {
          var noticeDetails = respanse.result
          vm.noticeDetails = noticeDetails
        }
      })
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .notice-details{
    padding: 0.23rem 0.26rem;
  }
  .notice-details .title{
    line-height: 0.44rem;
    font-size: 0.34rem;
    font-weight: bold;
    color: #222222;
  }
  .notice-details .date{
    margin-top: 0.24rem;
    line-height: 0.28rem;
    font-size: 0.22rem;
    color: #999999;
  }
  .notice-details .text{
    position: relative;
    padding-top: 0.22rem;
    margin-top: 0.3rem;
    line-height: 0.4rem!important;
    font-size: 0.28rem !important;
    color: #666666!important;
  }
</style>
