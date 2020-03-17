<template lang="html">
  <div class="patients-container">
    <nodata v-if="items != null && items.length == 0"/>
    <template v-else>
    <div class="list-container" >
      <div class="list-ct" v-for="(item,index) in items" :key="index" @click="openInfo(item)">
          <p>{{item.buildName}}</p>
          <p>{{item.areaName}}/{{item.identifier}}</p>
          <!-- <p>{{item.memberName}} {{sexObj[item.memberSex]}} {{item.memberAge}}{{item.memberAge > 0 ? '岁':''}}</p> -->
          <!-- <p>{{item.memberDoctorAdvice}}</p> -->
      </div>
    </div>
    </template>
    <menuindex :area="false"/>

    <!-- 完善信息 -->
    <div class="register" @click="showInfo = false" v-show="showInfo">
      <div class="register-main" @click.stop>
        <p>完善病人信息</p>
        <ul>
          <li style="position: relative">
            <mt-field class="input-focus" label="手机号" placeholder="请输入手机号" v-model="form.mobile"></mt-field>
            <p 
              v-if="already == null"
              style="padding-left: 2.1rem;margin:0;font-size: .24rem;color: #ff5e00;transform: translateY(-.15rem)">
              请输入手机号进行匹配
            </p>
            <p 
              v-if="already == true"
              style="padding-left: 2.1rem;margin:0;font-size: .24rem;color: #ff5e00;transform: translateY(-.15rem)">
              信息已匹配
            </p>
            <p 
              v-if="already == false"
              style="padding-left: 2.1rem;margin:0;font-size: .24rem;color: #ff5e00;transform: translateY(-.15rem)">
              无匹配信息
            </p>
            <!-- <div class="person-list" :class="{active: (focus && persons.length > 0)}">
              <li v-for="item in persons" @click="choose(item)">{{item.name}}</li>
            </div> -->
          </li>
          <li>
            <mt-field label="姓名" placeholder="请输入姓名" :disabled="already" v-model="form.name"></mt-field>
          </li>
          <li style="display:flex;padding: 15px 10px 0; border-top: 1px solid #d9d9d9">
            <span style="width: 1.9rem;">收货地址</span>
            <span style="flex: 1">{{form.address}}</span>
            <!-- <mt-field
              disabled
              label="收货地址"
              v-model="form.address"
            ></mt-field> -->
          </li>
          <li>
            <mt-button
              :disabled="loading"
              type="primary" 
              style="font-size: .3rem;width: 100%;margin-top: .2rem;" 
              @click="confirm()"
            >确定</mt-button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { bedQueryByAreaId, queryPatientByMobile, patientCreate } from '@/api/user'
import { sexObj } from '@/utils/contant'
import { MessageBox } from 'mint-ui'
import { validatemobile } from '@/utils/index'

export default {
  data() {
    return {
      items: null,
      sexObj,

      showInfo: false,
      form: {
        name: '',
        mobile: '',
        address: '',
        areaId: this.$route.query.areaId,
        bedId: ''
      },
      focus: false,
      persons: [],

      loading: false,
      addressInputShow: false,
      already: null,
      currentBox: {},
    }
  },
  computed: {
    addressInput() {
      let bol = false
      if (!this.persons) {
        bol = true
      }
      return bol
    }
  },
  activated() {
    // this.getPatientList()
    this.init()
  },
  created() {
    // this.init()
  },
  mounted() {
    this.$nextTick(() => {
      let target = document.querySelector('.input-focus input')
      target.onfocus = () => {
        this.focus = true
      }
      target.onblur = () => {
        this.focus = false
      }
    })
  },
  watch: {
    'form.mobile': function(val) {
      if (validatemobile(val, this, true)) {
        if (this.focus) {
          this.getPersons(val)
        }
      } else {
        this.already = null
        this.addressInputShow = false
        this.persons = []
      }
    }
  },
  methods: {
    choose(item) {
      this.form.name = item.name
    },
    getPersons(mobile) {
      this.persons = []
      this.loading = true
      queryPatientByMobile({
        mobile
      })
        .then(res => {
          this.loading = false
          this.persons = res.result
          if (!this.persons) {
            this.already = false
            this.addressInputShow = true
          } else {
            this.form.name = this.persons.name
            this.already = true
            this.addressInputShow = false
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    openInfo(item) {
      this.clearForm()
      this.form.bedId = item.id
      this.showInfo = true
      this.currentBox = item
      this.form.address = item.buildName + "/" + item.areaName +"/" + item.identifier
    },
    confirm() {
      let form = this.form
      if (this.addressInput) {
        if (!form.name || !form.mobile || !form.address) {
          this.$layer.msg('请完整填写信息!')
          return
        }
      }
      
      let validate = validatemobile(form.mobile, this)
      if (validate) {
        this.showInfo = false
        patientCreate({
          name: this.form.name,
          mobile: this.form.mobile,
          bedId: this.form.bedId
        }).then(res => {
            let data = res
            if (data.code == 0) {
              let target = data.result
              console.log(target)
              this.$store.dispatch('SetPatientData', this.resetPatientData(target))
              this.$router.togo('/patients/confirm')
            } else {
              this.$layer.msg(data.message)
            }
          })
        // let filters = this.persons.filter(item => {
        //   return item.name == form.name
        // })
        // if (filters.length > 0) {
        //   let target = filters[0]
        //   this.$store.dispatch('SetPatientData', this.resetPatientData(target))
        //   this.$router.togo('/patients/confirm')
        // } else {
        //   patientCreate(form).then(res => {
        //     let data = res
        //     if (data.code == 0) {
        //       let target = data.result
        //       this.$store.dispatch('SetPatientData', this.resetPatientData(target))
        //       this.$router.togo('/patients/confirm')
        //     } else {
        //       this.$layer.msg(data.message)
        //     }
        //   })
        // }
      }
    },
    resetPatientData(target) {
      target.memberId = target.id
      target.memberName = target.name
      target.buildName = this.currentBox.buildName
      target.areaName = this.currentBox.areaName
      target.identifier = this.currentBox.identifier
      return target
    },
    clearForm() {
      this.form.mobile = ''
      this.form.name = ''
    },
    init() {
      this.getPatientList()
    },
    getPatientList() {
      let params = {
        areaId: this.$route.query.areaId,
        type: 3, // 病患
        pageNo: 1,
        pageSize: 20
      }
      bedQueryByAreaId(params).then(res => {
        this.items = res.result
      })
    },
    // 去信息确认
    gotoPatientConfirm(item) {
      if (!item.memberDoctorAdvice) {
        MessageBox.confirm(
          '该患者饮食医嘱不明确，请根据患者实际情况给对方选择饮食医嘱，请谨慎操作!'
        ).then(action => {
          this.$store.dispatch('SetPatientData', item)
          this.$router.togo('/patients/adviceSelect')
        })
      } else {
        this.$store.dispatch('SetPatientData', item)
        this.$router.togo('/patients/confirm')
      }
    }
  }
}
</script>
<style>
.register-main .mint-field .mint-cell-title {
  width: 1.9rem;
}
</style>
<style scoped>
.register {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
.register-main {
  width: 80%;
  margin: 0 auto;
  background: #fff;
  margin-top: 20vh;
  border-radius: 3px;
  animation: scaleIn 0.3s;
}
.register-main > p {
  margin: 0;
  font-size: 0.4rem;
  padding: 0.2rem;
  text-align: center;
}
.register-main > ul {
  padding: 0.05rem 0.2rem 0.2rem;
}
.register-main > ul li:last-child {
  margin-top: 0.5rem;
  /* border-top: 1px solid #d9d9d9; */
}
.register-main .person-list {
  position: absolute;
  background: #fff;
  padding: 0.1rem;
  width: calc(100% - 2rem);
  top: 100%;
  right: 0;
  z-index: 1;
  border: 1px solid #ebebeb;
  transition: transform 0.1s;
  transform-origin: center top;
  transform: scaleY(0);
}
.register-main .person-list.active {
  transform: scaleY(1);
}
.register-main .person-list li {
  padding: 0.15rem;
}
.register-main .person-list li:active {
  background: #f0f0f0;
}
</style>
<style lang="less" scoped>
.list-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20px;
}
.list-ct {
  width: 46%;
  height: 160px;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.1);
  p {
    padding: 0;
    margin: 0;
    margin-bottom: .1rem;
    text-align: center;
  }
  p:nth-child(1) {
    font-size: 18px;
    font-weight: bold;
  }
  p:nth-child(2) {
    font-size: 15px;
    letter-spacing: .01rem;
  }
  p:nth-child(3) {
    font-size: 14px;
  }
}
</style>
