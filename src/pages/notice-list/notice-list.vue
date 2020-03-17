<template>
  <!-- 消息列表 -->
  <div class="notice-list bg-f6f6f6">
    <nodata v-if="noticeList != null && noticeList.length == 0"/>
    <template v-else>
    <div class="notice-item" v-for="(notice, index) in noticeList" :key="index" @click="toNoticeDetails(notice.id)">
      <img :src="notice.image" alt="" class="img">
      <div class="text">
        <div class="name">{{notice.title}}</div>
        <div class="date">{{notice.createDateStr}}</div>
      </div>
    </div>
    </template>
  </div>
</template>

<script>
import { getNoticeList } from '@/api/notice'
export default {
  data () {
    return {
      noticeList: null
    }
  },
  created () {
    //  列表
    getNoticeList().then(respanse => {
      if (respanse.code !== 0) {
        this.$layer.msg(respanse.message)
      } else {
        this.noticeList = respanse.result
      }
    })
  },
  methods: {
    // 跳转详情
    toNoticeDetails (id) {
      this.$router.push({path: '/noticeDetails', query: {id: id}})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .notice-list .notice-item{
    padding-bottom: 0.21rem;
    margin: 0.28rem 0.2rem;
    border-radius: 0.11rem;
    box-shadow: 0 0 7px 3px #efeeee;
    overflow: hidden;
    background-color: #fff;
  }
  .notice-list .notice-item .img{
    display: block;
    width: 100%;
  }
  .notice-list .notice-item .name{
    margin-top: 0.16rem;
    line-height: 0.42rem;
    font-size: 0.32rem;
    font-weight: bold;
    color: #222222;
  }
  .notice-list .notice-item .date{
    margin-top: 0.05rem;
    line-height: 0.34rem;
    font-size: 0.26rem;
    font-weight: bold;
    color: #999999;
  }
  .notice-list .notice-item .text{
    padding: 0 0.19rem;
  }
</style>
