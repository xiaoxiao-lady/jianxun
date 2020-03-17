<template>
  <!-- 修改收货信息 -->
  <div class="receiving-information bg-f6f6f6">
    <div>
      <div class="input-wrapper border-bottom" >
        <div class="title">建筑/病区/床位</div>
        <div class="to-address" @click="toInpatientArea">{{addressData.address}}</div>
        <!-- <input type="text" name="" :value="this.$store.state.address" hidden ref="address"> -->
      </div>
      <div class="input-wrapper border-bottom">
        <div class="title">联系人</div>
        <input type="text" name="" v-model="addressData.name" placeholder="请输入联系人" ref="name"  class="input-tag">
      </div>
      <div class="input-wrapper border-bottom">
        <div class="title">手机号</div>
        <input type="tel" name="" v-model="addressData.mobile" placeholder="请输入手机号" ref="mobile"  class="input-tag">
      </div>
    </div>
    <button type="button" class="com-button confirm" @click="submitAddressInfor">确定</button>
    <router-link to="/home">
      <div class="return-home"><img src="../../assets/home.png" alt=""></div>
    </router-link>
    
    <addressPicker ref="addressPicker" />
  </div>
</template>

<script>
import {validatemobile} from '@/common/js/util'
import { getAddress, updateAddress } from '@/api/address'
import addressPicker from '@/components/addressPicker'
export default {
  components: {
    addressPicker
  },
  data () {
    return {
      addressData: {}
    }
  },
  activated () {
    this.init()
  },
  methods: {
    init () {
      // console.log(this.$store.);
      this.getAddress()
    },
    // 获取地址
    getAddress () {
      let addressStore = this.$store.getters.addressData
      if (!(addressStore.id)) {
        let patientId = this.$store.getters.patientData.memberId
        let params = {
          patientId
        }
        getAddress(params).then(res => {
          this.addressData = res.result
          this.$store.dispatch('Set_addressData', res.result)
        })
      } else {
        this.addressData = addressStore
      }
    },
    // 跳转到修改病区
    toInpatientArea () {
        this.$refs.addressPicker.open()
      // this.$router.togo('/inpatientArea')
    },
    //  更新地址信息
    submitAddressInfor () {
      var address = this.addressData.address
      var name = this.addressData.name
      var mobile = this.addressData.mobile || ''
      if (typeof address === 'undefined' || address === null || address === '') {
        this.$layer.msg('请选择病房病床！')
        return
      }
      if (typeof name === 'undefined' || name === '' || name === null) {
        this.$layer.msg('请输入联系人！')
        return
      }
      if (validatemobile(mobile, this)) {
        let params = {
          address,
          name,
          mobile,
          id: this.addressData.id,
          bedId: this.addressData.bedId
        }
        updateAddress(params).then(res => {
          if (res.code !== 0) {
            this.$layer.msg(res.message)
          } else {
            this.$store.dispatch('Set_addressData', {})
            this.$router.goBack()
          }
        })
      }
    },
    confirm(val) {
      console.log(val)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .receiving-information .input-wrapper{
    position: relative;
    display: -webkit-flex;
    display: flex;
    padding-left: 0.28rem;
    background-color: #fff;
  }
  .receiving-information .input-wrapper:after{
    left: 0.24rem;
  }
  .receiving-information .input-wrapper:last-child:after{
    display: none;
  }
  .receiving-information .input-wrapper .title{
    padding: 0.33rem 0 0.27rem;
    width: 1.4rem;
    line-height: 0.36rem;
    font-size: 0.3rem;
    font-weight: bold;
    color: #333;
  }
  .receiving-information .input-wrapper .to-address{
    -webkit-flex: 1;
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    padding: 0.33rem 0.55rem 0.27rem 0;
    line-height: 0.36rem;
    font-size: 0.28rem;
    background: url(../../assets/next.png) no-repeat 95.7% center;
    background-size: 0.12rem 0.22rem;
    color: #656565;
  }
  .receiving-information .input-tag{
    -webkit-flex: 1;
    flex: 1;
    width: 100%;
    height: 0.96rem;
    font-size: 0.28rem;
    color: #656565;
  }
  .receiving-information .confirm{
    margin: 0.32rem auto 0;
    width: 93.3%;
  }
</style>
