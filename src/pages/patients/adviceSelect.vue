<template>
  <div class="advice-select">
    <div class="left">
        <li v-for="(item, index) in listKit" :key="item.id" :class="{active: activeKit == index}" @click="changeKit(index)">
            {{item.name}}
        </li>
    </div>
    <div class="right">
        <mt-radio align="right" v-model="adviceCheckedId" :options="listAdvice"> </mt-radio>
    </div>
    <div class="confirm-btn" @click="confirm()">确定</div>
  </div>
</template>

<script>
import { kitchenQuery, adviceQuery } from '@/api/area'
import { MessageBox, Toast} from 'mint-ui';

export default {
  data() {
    return {
      listKit: [],
      listAdvice: [],
      activeKit: 0,
      activeAdvice: 0,
      adviceCheckedId: '',
      adviceCheckedName: '',
      kitCheckedName: '',
    }
  },
  watch: {
      adviceCheckedId(val) {
          if(val) {
              this.kitCheckedName = this.listKit[this.activeKit].name
              this.adviceCheckedName = this.listAdvice.filter(item => {
                  return item.value == val
              })[0].label
          }
      }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      kitchenQuery().then(res => {
        this.listKit = res.result
        this.getAdviceList(this.listKit[this.activeKit].id)
      })
    },
    getAdviceList(kitchenId) {
      adviceQuery({ kitchenId }).then(res => {
        this.listAdvice = res.result.map(item => {
            return {
                label: item.name,
                value: item.id+''
            }
        })
      })
    },
    changeKit(index) {
        this.activeKit = index
        this.getAdviceList(this.listKit[this.activeKit].id)
    },
    confirm() {
        if(!this.adviceCheckedId) {
            Toast('请选择医嘱')
            return
        }
        MessageBox.confirm(`本次选择灶类：【${this.kitCheckedName}】<br>医嘱：【${this.adviceCheckedName}】`).then(action => {
            let item = this.$store.state.patient.patientData
            item.memberDoctorAdvice = this.adviceCheckedName
            item.memberDoctorAdviceId = this.adviceCheckedId
            item.doctorAdviceType = 0 //自定义医嘱
            this.$store.dispatch('SetPatientData', item)
            this.$router.togo('/patients/confirm')
        })
        
    }
  }
}
</script>

<style scoped>
.advice-select {
  display: flex;
}
.left {
  padding-bottom: 1rem;
  flex: 1;
  overflow: auto;
  background: #ebebeb;
}
.left li {
    padding: .2rem;
    text-align: center;
    border-bottom: 1px solid #dadada;
}
.left li.active {
    background: #fff;
}
.right {
  padding-bottom: 1.2rem;
  flex: 1.7;
  overflow: auto;
}

.confirm-btn {
    position: fixed;
    height: .8rem;
    bottom: 15px;
    width: 40%;
    left: 68%;
    transform: translateX(-50%);
    border-radius: .4rem;
    background: #fd9025;
    text-align: center;
    line-height: .8rem;
    color: #fff;
    font-size: .26rem;
}
</style>