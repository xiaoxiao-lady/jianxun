<template lang="html">
  <div class="confirm-container">
    <div class="main-ct">
      <div class="header-ct">
        请确认病患信息
      </div>
      <div class="info-ct">
        <span>{{item.buildName}}</span>
        <span>{{item.areaName}}/{{item.identifier}}</span>
        <span>{{item.memberName}}</span>
        <span>{{sexObj[item.memberSex]}} {{item.memberAge}}{{item.memberAge > 0 ? '岁':''}}</span>
        <!-- <span v-if="item.doctorAdviceType != 0">{{item.memberDoctorAdvice}}</span> -->
        <!-- <span v-else style="text-align:center;padding-top: 10px">无医嘱 <br>现场确认饮食：{{item.memberDoctorAdvice}}</span> -->
      </div>
      <div class="btn-item">
        <mt-button type="primary" class="user-btn" @click="gotoGoods(0)">预定</mt-button>
        <!-- <mt-button type="default" class="user-btn-white" @click="resetSelect">重新选择</mt-button> -->
      </div>
      <!-- <div class="btn-item">
        <mt-button type="primary" class="user-btn" @click="gotoGoods(1)">加餐</mt-button>
        <mt-button type="default" class="user-btn-white" @click="resetSelect">重新选择</mt-button>
      </div> -->
      <div class="todayOrder-ct">
        <div class="left-ct">今日点餐:</div>
        <div>
          <div class="right-ct" v-for="(item,index) in todayOrderItems" :key="index">
            {{item.name}}（{{item.remark}}）
          </div>
        </div>
      </div>
    </div>
    <menuindex />
  </div>
</template>

<script>
import { sexObj } from '@/utils/contant'
import { getPatientTodayOrder } from '@/api/order'
export default {
  data () {
    return {
      sexObj,
      item: {},
      todayOrderItems: []
    }
  },
  created () {
    // this.init()
  },
  activated() {
    this.init()
  },
  methods: {
    init () {
      let data = this.$store.getters.patientData
      if (!data.id) {
        this.$router.goBack()
      }
      this.getPatientTodayOrder(data.memberId)
      this.item = data
    },
    // 获取病患今日所点餐别
    getPatientTodayOrder (patientId) {
      getPatientTodayOrder({patientId}).then(res => {
        this.todayOrderItems = res.result
      })
    },
    // 去信息确认
    gotoGoods (val) {
      this.$store.commit('setIsAdd', val)
      this.$router.togo('/goods')
    },
    // 重新选择
    resetSelect () {
      this.$store.dispatch('SetPatientData', {})
      this.$router.goBack('/patient')
    }

  }
}
</script>

<style lang="less" scoped>
  .user-btn{
    background-color: #feb528;
  }
  .user-btn-white{
      background-color: #fff;
  }
  .confirm-container{
    .main-ct{
      padding: 20px;
    }
    .header-ct{
      font-size: 20px;
      text-align:center;
    }
    .info-ct{
      height: 200px;
      margin-top: 10px;
      display:flex;
      justify-content: center;
      align-items:center;
      flex-direction:column;
      box-shadow: 0 0 3px #e3e3e3;
      border-radius: 5px;
      margin-bottom: 15px;
      span:nth-child(1){
        font-size: 21px;
        font-weight:500;
        margin-bottom: 10px;
      }
      span:nth-child(2), span:nth-child(3){
        font-size: 17px;
        font-weight:500;
        margin-bottom: 10px;
      }
    }
  }
  .todayOrder-ct{
    display:flex;
    margin-top: 30/75rem;
    font-size: 25/75rem;
    .left-ct{
      width: 120/75rem;
    }
  }
  .btn-item {
    display: flex;
    margin-bottom: 10px;
    button {
      font-size: .28rem;
    }
    .user-btn {
      flex: 1;
      // margin-right: 10px;
      letter-spacing: .02rem;
      font-size: .3rem;
    }
    .user-btn-white {
      width: 1.8rem
    }
  }
</style>
