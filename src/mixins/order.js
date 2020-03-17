import { payOrder, ccbPayOrder, getCardInfo, getOrderDetail } from "@/api/order";
import { Indicator, MessageBox } from "mint-ui";

export const orderpay = {
  data() {
    return {
      bankCardLoading: false,
      payAmount: 0
    };
  },
  created() {
    // this.bankCardPay()
  },
  beforeRouteLeave(to, from, next) {
    this.overCarding()
    Indicator.close()
    next()
  },
  methods: {
    payInit(data) {
      this.payAmount = data;
    },
    // 刷卡
    bankCardPay(orderIds) {
      let t = this;
      //安卓获取到卡号后回调前端方法
      window.NFC = function(cardId) {
        if (!t.bankCardLoading) {
          if (!cardId) {
            t.$layer.msg("请重试..");
            return;
          }
          t.bankCardLoading = true;
          Indicator.close();
          Indicator.open("加载中..");
          t.overCarding();
          //获取卡的信息 余额等 在弹框中显示
          getCardInfo({
            cardId
          })
            .then(res => {
              Indicator.close();
              if (res.code == 0) {
                if(!res.result.name || !res.result.cardId) {
                  t.breakError('读卡失败，请重试！');
                  t.bankCardPay(orderIds)
                  return
                }
                let title = "支付详情";
                let message = `
                  <p style="display: flex;align-items: center;padding:0;margin:0;line-height:30px;">
                    <span style="min-width: 100px;text-align: left;">姓名</span>:
                    <span style="flex: 1;text-align:left;padding-left: 10px">${res.result.name}</span>
                  </p>
                  <p style="display: flex;align-items: center;padding:0;margin:0;line-height:30px;">
                    <span style="min-width: 100px;text-align: left;">当前卡号</span>:
                    <span style="flex: 1;text-align:left;padding-left: 10px">${res.result.cardId}</span>
                  </p>
                  <p style="display: flex;align-items: center;padding:0;margin:0;line-height:30px;">
                    <span style="min-width: 100px;text-align: left;">当前现金余额</span>:
                    <span style="flex: 1;text-align:left;padding-left: 10px">${res.result.balance}元</span>
                  </p>
                  <p style="display: flex;align-items: center;padding:0;margin:0;line-height:30px;">
                    <span style="min-width: 100px;text-align: left;">当前补助余额</span>:
                    <span style="flex: 1;text-align:left;padding-left: 10px">${res.result.balanceSubsidy}元</span>
                  </p>
                  <p style="display: flex;align-items: center;padding:0;margin:0;line-height:30px;">
                    <span style="min-width: 100px;text-align: left;">支付金额</span>:
                    <span style="flex: 1;text-align:left;padding-left: 10px">${t.payAmount}元</span>
                  </p>
                  <p style="color:#ff6b24;font-size: 12px;line-height: 14px;text-align:left;margin:5px 0;">*交易时，优先扣除补助余额。</p>
                  <p style="color:#ff6b24;font-size: 12px;line-height: 14px;text-align:left;margin:5px 0;">*暂不支持现金和补助余额混合支付</p>`;
                MessageBox({
                  title,
                  message,
                  showCancelButton: true,
                  closeOnClickModal: false,
                  confirmButtonText: "确认支付"
                }).then(r => {
                  if (r == "confirm") {
                    if (res.result.balance < t.payAmount) {
                      t.bankCardLoading = false;
                      t.$layer.msg("余额不足");
                      return;
                    }
                    t.realCardPay(
                      orderIds,
                      res.result.cardId,
                      res.result.cardNo
                    );
                  } else {
                    t.bankCardLoading = false;
                  }
                });
              } else {
                t.breakError(res.message);
              }
            })
            .catch(err => {
              t.breakError(err);
            });

          return cardId;
        }
      };
      //通知安卓可以进行刷卡了
      t.bankCardLoading = false;
      javascript: lee.Nfc_android("jsandroid");
      Indicator.close();
      setTimeout(() => {
        Indicator.open({
          text: "请刷卡"
        });
      });

      //测试
      //   window.NFC('549500736')
    },
    //刷卡确认 调用支付接口
    realCardPay(orderIds, cardId, cardNo) {
      let t = this;
      Indicator.open("加载中..");
      //接口调用
      let params = {
        orderIds,
        orderType: 1,
        type: 5,
        userType: 2, // l职工，2点餐员，3病患
        cardId,
        cardNo
      };
      payOrder(params)
        .then(res => {
          Indicator.close();
          if (res.code !== 0) {
            t.breakError(res.message);
          } else {
            t.print(orderIds.split('/'), 'pay');
            t.$layer.msg("支付成功！");
            t.$router.push({ path: "/orderList", query: { type: 1 } });
          }
        })
        .catch(err => {
          t.breakError(err);
        });
    },
    // 现金 线下
    offlinePay(orderIds) {
      let t = this;
      let title = "提示";
      let message = `请确认已收到现金${this.payAmount}元`;
      MessageBox({
        title,
        message,
        showCancelButton: true,
        closeOnClickModal: false,
        confirmButtonText: "确定"
      }).then(res => {
        if (res == "confirm") {
          console.log("确定");
          t.realOfflinePay(orderIds);
        } else {
          console.log("取消");
        }
      });
    },
    realOfflinePay(orderIds) {
      let t = this;
      let params = {
        orderIds,
        type: 6,
        orderType: 1,
        userType: 2
      };
      Indicator.open({
        text: "加载中..."
      });
      payOrder(params)
        .then(res => {
          Indicator.close();
          if (res.code !== 0) {
            t.$layer.msg(res.message);
          } else {
            t.print(orderIds.split('/'), 'pay');
            t.$layer.msg("支付成功！");
            t.$router.push({ path: "/orderList", query: { type: 1 } });
          }
        })
        .catch(err => {
          Indicator.close();
          t.$layer.msg(err);
        });
    },
    // 扫码支付
    scanPay(orderIds) {
      let t = this
      window.js_ewm = function(code) {
        let title = "提示";
        let message = `<p style="padding: .1rem 0;margin: 0;line-height: .5rem;color: #444">扫码成功，请确认用户已成功支付</p>
        <p style="padding: 0;margin: 0;color: #ff5e00;font-size: .24rem;line-height: .5rem;">*扫码成功不代表支付成功，请注意核对。</p>`
        MessageBox({
          title,
          message,
          showCancelButton: true,
          closeOnClickModal: false,
          confirmButtonText: "确定"
        }).then(res => {
          if (res == "confirm") {
            t.realScanPay(orderIds, code)
          }
        });
      }
      javascript: lee.android_ewm("android_ewm");
    },
    realScanPay(orderIds, qrCode) {
      let t = this
      Indicator.open({
        text: "加载中..."
      });
      let params = {
        orderIds,
        qrCode,
        type: 70,
        orderType: 1,
        userType: 2
      }
      ccbPayOrder(params)
        .then(res => {
          Indicator.close();
          if (res.code !== 0) {
            t.$layer.msg(res.message);
          } else {
            t.print(orderIds.split('/'), 'pay');
            t.$layer.msg("支付成功！");
            t.$router.push({ path: "/orderList", query: { type: 1 } });
          }
        })
        .catch(err => {
          Indicator.close();
          t.$layer.msg(err);
        });

    },
    doTTS() {
      let ttsDiv = document.getElementById('bdtts_div_id');
      let ttsAudio = document.getElementById('tts_autio_id');
      let ttsText = '当前成功收款'+this.payAmount+'元，请注意查收';
      // 文字转语音
      ttsDiv.removeChild(ttsAudio);
      let au1 = '<audio id="tts_autio_id">';
      let sss = '<source id="tts_source_id" src="http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&per=3&spd=5&text=' + ttsText + '" type="audio/mpeg">';
      let eee = '<embed id="tts_embed_id" height="0" width="0" src="">';
      let au2 = '</audio>';
      ttsDiv.innerHTML = au1 + sss + eee + au2;
      console.log(1234)
      ttsAudio = document.getElementById('tts_autio_id');
      ttsAudio.play();
      
    },
    print(orderIds, type) {
      // let id = orderIds.replace(/\//g, "");
      orderIds = orderIds.filter(item => {
        return item != ''
      })
      if(orderIds.length == 0) return
      this.printDelay(orderIds, type)
    },
    printDelay(orderIds, type) {
      if(!orderIds || orderIds.length <= 0) return
      // for(let id of orderIds) {
        let params = {
          id: orderIds[0]
        };
        getOrderDetail(params).then(res => {
          let data = res.result;
          for(let index in data) {
            let item = data[index]
            if(item == null || item == undefined) {
              item = ''
            }
          }
          let paperType = ''
          if(type == 'pay') {
            if(data.payType == 5) {
              paperType = 1
            } else if(data.payType == 6 || data.payType == 70){
              paperType = 2
            }
          } else if(type == 'back') {
            if(data.payType == 5) {
              paperType = 3
            } else if(data.payType == 6 || data.payType == 70){
              paperType = 4
            }
          }
          data.products = data.products.map(item => {
            item.price = parseFloat(item.price).toFixed(2)
            return item
          })
          let orderDetails = {
            paperType,
            cardCurrentBalance: parseFloat(data.cardCurrentBalance).toFixed(2),
            cardAccount: data.cardAccount || '',
            cardNo: data.cardNo || '',
            payType: data.payType,
            takerName: data.takerName,
            identifier: data.identifier,
            createTimeStr: data.createTimeStr,
            receiveAddress: data.receiveAddress,
            receiveName: data.receiveName,
            receiveMobile: data.receiveMobile,
            products: data.products,
            payAmount: parseFloat(data.payAmount).toFixed(2),
            note: data.note || '',
            date: data.date || '',
            className: data.className || '',
            classTime: data.classTime || '',
            patientIdentifier: data.patientIdentifier || '',
            hospital: "雄伟医院",
            canteenName: sessionStorage.getItem('canteenName') || '默认食堂'
          }
          javascript: lee.funAndroid(JSON.stringify(orderDetails));
          setTimeout(() => {
            this.printDelay(orderIds.slice(1, orderIds.length), type)
          }, 500)
          
        });
      // }
    },
    overCarding() {
      javascript: lee.Nfc_android("done");
    },
    breakError(message = "error") {
      this.$layer.msg(message);
      this.bankCardLoading = false;
      Indicator.close();
    }
  }
};
