<template>
  <div>
    <mt-popup style="width: 100%" v-model="popupVisible" position="bottom">
        <div class="tab btn">
            <li class="cancel" @click="popupVisible = false">取消</li>
            <li class="confirm" @click="comfirm()">确定</li>
        </div>
        <!-- <div class="tab">
            <li>建筑物</li>
            <li>病区</li>
            <li>病床</li>
        </div> -->
      <mt-picker
        ref="picker"
        style="background: #fff"
        value-key="name"
        :slots="slots"
        @change="onValuesChange"
      ></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import { getBuildAndAreaAndBedOrOffice } from '@/api/address'
export default {
  data() {
    return {
      list: [],
      popupVisible: false,
      slots: [
        {
          flex: 1,
          values: [],
          className: 'slot1',
          textAlign: 'center'
        },
        {
          flex: 1,
          values: [],
          className: 'slot2',
          textAlign: 'center'
        },
        {
          flex: 1,
          values: [],
          className: 'slot3',
          textAlign: 'center'
        }
      ],
      currentValues: [],
      isAuto: true,
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getBuildAndAreaAndBedOrOffice({
          type: 1
      })
        .then(respanse => {
          if (respanse.code !== 0) {
            this.$layer.msg(respanse.message)
          } else {
            this.list = respanse.result
            this.slots[0].values = respanse.result
            // this.resetSolts1()
            // this.resetSolts2()
            // setTimeout(() => {
            //   this.isAuto = false
            // });
            
          }
        })
    },
    resetSolts1() {
      let value = this.getValue()[0]
      if(value) {
        let find = this.list.find(item => item.id == value.id)
        if(find) {
          this.slots[1].values = find.children
        } else {
          this.slots[1].values = []
        }
      }
    },
    resetSolts2() {
      let value = this.getValue()[1]
      if(value) {
        let find = this.slots[1].values.find(item => item.id == value.id)
        if(find) {
          this.slots[2].values = find.children
        } else {
          this.slots[2].values = []
        }
      }
    },
    open() {
      this.popupVisible = true
    },
    close() {
      this.popupVisible = false
    },
    getValue() {
      let val = this.$refs.picker.getValues()
      return val
    },
    onValuesChange(picker, val) {
      if(val[0]) {
        let one = this.list.find(item => item.id == val[0].id)
        if(one) {
          picker.setSlotValues(1, one.children)
          if(one.children.length > 0 && val[1]) {
            let two = one.children.find(item => item.id == val[1].id)
            if(two) {
              picker.setSlotValues(2, two.children)
            }
          }
          
        }
      }
    },
    comfirm() {
      let values = this.getValue()
      let addressData = this.$store.getters.addressData
      addressData.address = values[0].name +'/'+values[1].name +'/'+values[2].name,
      addressData.bedId = values[2].id
      
      this.$store.dispatch('Set_addressData', addressData)
      this.popupVisible = false
    }
  }
}
</script>
<style>
.picker-item {
  font-size: .26rem;
}
</style>
<style scoped>
.tab {
    display: flex;
    align-items: center;
}
.tab li {
    flex: 1;
    text-align: center;
    padding: .3rem;
}
.tab.btn {
    justify-content: space-between;
    border-bottom: .01rem solid #ebebeb;
}
.tab.btn li {
    flex: none;
    width: 1rem;
    font-size: .28rem;
}
.cancel {
    color: #888;
}
.confirm {
    color: #1989fa;
}
</style>