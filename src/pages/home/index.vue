<template>
  <div class="login home">
    <div class="date-container">
      <span class="avatar-ct" @click="goPersonInfo()">
        <img src="./avatar.jpeg" />
      </span>
      <!-- 2019-01-02 -->
      {{date}}
      <span style="position:absolute;right: 4px;font-size: .28rem;font-weight: bold;top: 50%;transform: translateY(-50%)">{{canteenName}}</span>
    </div>
    <div class="nav-wrapper">
      <div @click="gotoNext('/build')" class="nav-item">
        <img src="../home/xiadan.png" class="icon">
      </div>
      <div @click="gotoNext('/orderList')" class="nav-item">
        <img src="../home/wode.png" class="icon">
      </div>
    </div>
    <div class="msg-container">
      <div class="msg-ct" @click="goPageNotice()">
        <div class="img-ct">
          <img src="./msg.png" alt=""/>
        </div>
        <span class="title-ct">通知消息</span>
        <span class="point-ct"></span>

      </div>
      <div class="msg-ct" @click="goPageMonthReport()">
        <div class="img-ct">
          <img src="./month.png" alt=""/>
        </div>
        <span class="title-ct">月度结算单</span>
        <span class="point-ct"></span>
      </div>
    </div>
    <div class="orderNum-ct">
      <div class="orderNum-ct-top">
        <h5>订餐数统计</h5>
        <ul>
          <li>
            <p>{{dataStatistic.ddsl_jr}}</p>
            <p>今日</p>
          </li>
          <li>
            <p>{{dataStatistic.ddsl_bz}}</p>
            <p>本周</p>
          </li>
          <li>
            <p>{{dataStatistic.ddsl_by}}</p>
            <p>本月</p>
          </li>
        </ul>
      </div>
      <div class="echart-title">
        <p style="font-weight:bold;color: #555;">销售统计</p>
        <ul>
          <li :class="{on: echartIndex == 1}" @click="echartIndex = 1">周</li>
          <li :class="{on: echartIndex == 2}" @click="echartIndex = 2">月</li>
        </ul>
      </div>
      <div id="echart" ref="echart" style="width:100%;height: 4rem;"></div>
      <!-- <img src="../home/order_num.png" class="icon"> -->
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import echarts from 'echarts'
import { parseTime } from '@/utils/index'
import { getTakerIndex } from '@/api/home'
export default {
  data () {
    return {
      date: '',
      dataStatistic: {},
      echartOption: {
        // backgroundColor: '#58b6ff',//背景色
        title: {
          text: ''
        },
        tooltip: {},
        xAxis: {
          data: [],
          axisLine: {
            lineStyle:{
                color:'#888'
            }
          }
        },
        yAxis: {
          type : 'value',
          axisLine: {
            lineStyle:{
                color:'#888'
            }
          }
        },
        series: [{
          name: '订单数量',
          type: 'line',
          symbolSize: 6,   //设定实心点的大小
          data: [5, 20, 36, 10, 10, 20],
          itemStyle: {
            normal: {
              color: "#feaa23",
              lineStyle: {
                color: "#feaa23"
              }
            }
          },
        },{
          name: '销售金额',
          type: 'line',
          symbolSize: 6,   //设定实心点的大小
          data: [52, 2, 3, 10, 10, 20], //折线数据
          itemStyle: {
            normal: {
              color: "#58b6ff", //线条颜色
              lineStyle: {
                color: "#58b6ff"
              }
            }
          },
        }],
        grid: {
          left: '3%',
          right: '5%',
          bottom: '6%',
          top: '8%',
          containLabel: true
        },
      },
      echartIndex: 1, //1周 2月
      canteenName: '',
    }
  },
  watch: {
    echartIndex(val, old) {
      this.setOption()
      this.setEcharts()
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
      // console.log(new Date())
      this.canteenName = sessionStorage.getItem('canteenName')
      this.date = parseTime(new Date().getTime(), '{y}-{m}-{d} 星期{a}')
      this.getData()
      
    },
    getData() {
      getTakerIndex().then(res => {
        this.dataStatistic = res.result
        this.echartIndex = 1
        this.setOption()
        this.setEcharts()
      })
    },
    setOption() {
      let type = ''
      if(this.echartIndex == 1) {
        type = 'bzDatas'
      } else {
        type = 'byDatas'
      }
      let dates = []
      let ddsls = []
      let yyes = []
      for(let item of this.dataStatistic[type]) {
        ddsls.push(item.ddsl)
        yyes.push(item.yye)
        dates.push(item.date)
      }
      this.echartOption.xAxis.data = dates
      this.echartOption.series[0].data = ddsls
      this.echartOption.series[1].data = yyes
    },
    setEcharts() {
      let chart = echarts.init(this.$refs.echart)
      chart.setOption(this.echartOption);
    },
    gotoNext (path) {
      this.$router.togo(path)
    },
    goPageNotice () {
      this.$router.push({
        path: '/noticeList'
      })
    },
    goPageMonthReport () {
      this.$router.push({
        path: '/monthReport'
      })
    },
    goPersonInfo() {
      this.$router.push({
        path: '/personal'
      })
    }

  }
}
</script>

<style lang="less" scoped>
.login{
  padding: 0 20/75rem;

}
.date-container{
  position: relative;
  height: 50/54rem;
  font-size: 22/54rem;
  display:flex;
  align-items: center;
  margin: 20/54rem 0 10/54rem;
  .avatar-ct{
    border-radius: 50%;
    overflow:hidden;
    width: 50/54rem;
    height: 50/54rem;
    margin-right: 10/54rem;
    img{
      width: 100%;
      height: 100%;
    }
  }

}
.home .nav-wrapper{
  display: -webkit-flex;
  display: flex;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20/75rem;
}
.home .nav-wrapper .nav-item{
  width: 48%;
}
.home .nav-wrapper .nav-item:nth-child(2){
  margin-right: 0;
}
.home .nav-wrapper .nav-item .text{
  display: block;
  line-height: 0.67rem;
  text-align: center;
  font-size: 0.28rem;
  color: #222222;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.home .nav-wrapper .nav-item .icon{
  display: block;
  width: 100%;
  border-radius: 0.18rem;
  box-shadow: 0 0 0.2rem 0.1rem #f3f3f3;
}

.questionnaire-popup{
  position: fixed;
  left: 0.3rem;
  right: 0.3rem;
  top: 1.3rem;
  z-index: 110;
  padding-bottom: 0.86rem;
  background: #fff;
  border-radius: 0.22rem;
}
.questionnaire-popup .top-img{
  display: block;
  width: 100%;
}
.questionnaire-popup .close{
  position: absolute;
  right: -0.1rem;
  top: -0.94rem;
  display: block;
  padding: 0.1rem;
  width: 0.6rem;
  height: 0.6rem;
}
.questionnaire-popup .name{
  margin-top: 0.59rem;
  line-height: 0.38rem;
  text-align: center;
  font-size: 0.3rem;
  color: #222222;
}
.questionnaire-popup .to-questionnaire{
  margin: 0.81rem auto 0;
  width: 3.6rem;
}
.fade-enter-active{
  transition: all 0.3s;
}
.fade-leave-active{
  transition: all 0.2s;
}
.fade-enter,.fade-leave-to{
  opacity: 0;
  background: rgba(0, 0, 0, 0);
}
.orderNum-ct{
  img{
    display:block;
    width: 100%;

  }
}
.msg-container{
  width: 100%;
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom: 20/54rem;
  .msg-ct{
    box-shadow: 0 0 5px #dddddd;
    border-radius: 5px;
    width: 48%;
    height: 100/75rem;

    display:flex;

    align-items:center;
    box-sizing: border-box;
    padding: 0 14/54rem;
    .img-ct{
      width:46/54rem;
      height: 46/54rem;
      display: block;
      margin-right: 10/54rem;
      img{
        display:block;
        width:100%;
        height:100%;
      }
    }
    .title-ct{
      line-height: 100/75rem;
    }
  }
}

.orderNum-ct-top h5{
  color: #8b8b8b;
  font-size: .34rem;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 10px;
}
.orderNum-ct-top ul {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.orderNum-ct-top ul li {
  font-size: .35rem;
  text-align: center;
  padding: 15px 0;
}
.orderNum-ct-top ul li p {
  margin: 0;
  font-weight: bold;
}
.orderNum-ct-top ul li p:first-child {
  color: #888;
  font-size: .4rem;
}
.orderNum-ct-top ul li p:last-child {
  color: #999;
  font-size: .27rem;
}

.echart-title {
  display: flex;
  justify-content: space-between;
}

.echart-title ul {
  display:flex;
  align-items:center;
}
.echart-title ul li {
  font-size: .3rem;
  padding: 2px 12px;
  font-weight: bold;
  height: .35rem;
  line-height: .35rem;
}
.echart-title ul li.on {
  background: #58b6ff;
  color: #fff;
  border-radius: .24rem;

}
</style>
