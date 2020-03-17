<template>
  <!-- 选择病区 -->
  <div class="inpatient-area bg-f6f6f6">
    <!-- 舍弃 -->
    <div v-if="false">
      <div class="left-menu">
        <div class="menu-item" v-for="(parent, index) in addressTree" :key="index" :class="{'on':currentIndex === index}" @click="selectMenu(index)"><span>{{parent.name}}</span></div>
      </div>
      <div class="middle-menu">
        <div class="menu-item" v-for="(parent, index) in addressTree" :key="index" :class="{'on':currentIndex === index}" v-show="currentIndex === index">
          <div class="floor-item" v-for="(childrenItem, index) in parent.children" :key="index" :class="{'on':currentIndex2 === index}" @click="selectMenu2(index, childrenItem)">{{childrenItem.name}}</div>
        </div>
      </div>

      <div class="content" v-show="currentIndex2 === index"  v-for="(parent, index) in addressTree[currentIndex]&&addressTree[currentIndex].children" :key="index" >
        <div class="floor-item border-bottom"  v-for="(childrenItem, idx) in parent&&parent.children" :key="idx" :class="{'on':currentIndex3 === idx}" @click="selectMenu3(idx, childrenItem)">{{childrenItem.name}}</div>
      </div>
    </div>

    <!-- 开始 -->
    <div class="left-menu">
      <div class="menu-item" v-for="(parent, index) in addressTree" :key="index" :class="{'on':currentIndex === index}" @click="selectMenu(index)"><span>{{parent.name}}</span></div>
    </div>
    <div class="content" v-for="(parent, index) in addressTree" :key="index" :class="{'on':currentIndex === index}" v-show="currentIndex === index">
      <div class="floor-item border-bottom"  v-for="(childrenItem, idx) in parent.children" :key="idx" :class="{'on':currentIndex3 === idx}" @click="selectMenu3(idx, childrenItem)">{{childrenItem.identifier}}</div>
    </div>
    <router-link to="/home">
      <div class="return-home"><img src="../../assets/home.png" alt=""></div>
    </router-link>

  </div>
</template>

<script>
import { getAddressTree } from '@/api/address'
import { getAreaList } from '@/api/area'
import { bedQueryByAreaId } from '@/api/user'
export default {
  data () {
    return {
      addressTree: [],
      areaList: [],
      bedList: [],
      currentIndex: 0,
      currentIndex2: null,
      currentIndex3: null
    }
  },
  created () {
    this.init()
    //  病区管理
    // this.$axios({
    //   url: this.GLOBAL.BASE_URL + '/front/address/getTree',
    //   method: 'post',
    //   headers: {
    //     'canteenId': this.$store.state.canteenId,
    //     'token': this.$store.state.token
    //   },
    //   data: this.$qs.stringify({
    //     'type': 3
    //   })
    // }).then(respanse => {
    //     if (respanse.data.code !== 0) {
    //       this.$layer.msg(respanse.data.message)
    //     } else {
    //       var addressTree = respanse.data.result
    //       this.addressTree = addressTree
    //     }
    //   })
  },
  methods: {
    init () {
      this.getAddressTree()
    },
    getAddressTree () {
      // this.areaList = []
      // getAreaList().then(res => {
      //   this.areaList = res.result
      //   this.getPatientList(this.areaList[0].id)
      // })
      let params = {
        // type: 2
      }
      getAddressTree(params).then(res => {
        this.addressTree = res.result
      })
    },
    getPatientList (id) {
      let params = {
        areaId: id,
        type: 3, // 病患
        pageNo: 1,
        pageSize: 20
      }
      this.currentIndex3 = null
      this.bedList = []
      bedQueryByAreaId(params).then((res) => {
        this.bedList = res.result
      })
    },
    // 单选
    selectMenu (index) {
      this.currentIndex = index
      // this.currentIndex2 = null
      // this.getPatientList(this.areaList[index].id)
    },
    // 单选
    selectMenu2 (index) {
      this.currentIndex2 = index
      this.currentIndex3 = null
    },
    selectMenu3 (index, item) {
      this.currentIndex3 = index
      let addressData = this.$store.getters.addressData
      addressData.address = item.areaName + '/' + item.identifier
      addressData.bedId = item.id
      this.$store.dispatch('Set_addressData', addressData)
      this.$router.goBack()
    }
    // 单选
    // selectMenu2 (index, childrenItem) {
    //   this.currentIndex2 = index
    //   this.$store.commit('setAdress', childrenItem.fullNamePath)
    //   this.$store.commit('setOfficeId', childrenItem.id)
    //   this.$router.go(-1)
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .inpatient-area{
    display: flex;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  .inpatient-area .left-menu{
    width: 2.12rem;
    height: 100%;
    overflow: auto;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #f1f1f1;
    border-right:1px solid #dedede;
  }
  .inpatient-area .left-menu .menu-item{
    display: table;
    height: 0.9rem;
    width: 100%;
  }
  .inpatient-area .left-menu .menu-item span{
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    font-size: 0.3rem;
    font-weight: bold;
    color: #222;
  }
  .inpatient-area .left-menu .menu-item.on{
    background-color: #fff;
  }
  .inpatient-area .content{
    flex: 1;
    height: 100%;
    overflow: auto;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .inpatient-area .middle-menu{
    width:2.5rem;
    height: 100%;
    overflow: auto;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #f1f1f1;
    border-right:1px solid #dedede;
  }
  .inpatient-area .middle-menu .menu-item{
    display: table;
    height: 0.9rem;
    width: 100%;
  }
  .inpatient-area .middle-menu .menu-item span{
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    font-size: 0.3rem;
    font-weight: bold;
    color: #222;
  }
  .inpatient-area .middle-menu .menu-item.on{
    /* background-color: #fff; */
  }
  .inpatient-area .middle-menu .floor-item{
    position: relative;
    padding-left: 0.1rem;
    line-height: 0.9rem;
    font-size: 0.28rem;
    color: #666;
    /* background-color: #000; */
  }
  .inpatient-area .middle-menu .floor-item.on{
    background-color: #fff;
    /* background-size: 0.42rem; */
  }
  .inpatient-area .middle-menu .floor-item:after{
    bottom: -0.01rem;
  }

  .inpatient-area .content{
    flex: 1;
    height: 100%;
    overflow: auto;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .inpatient-area .content .floor-item{
    position: relative;
    padding-left: 0.95rem;
    line-height: 0.9rem;
    font-size: 0.28rem;
    color: #666;
    background-color: #fff;
  }
  .inpatient-area .content .floor-item:after{
    bottom: -0.01rem;
  }
  .inpatient-area .content .floor-item.on{
    background: url("../../assets/radio.png") no-repeat 95.5% center #fff;
    background-size: 0.42rem;
  }
</style>
