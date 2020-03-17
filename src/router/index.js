import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 需要左方向动画的路由用this.$router.to('****')
Router.prototype.togo = function (path) {
  this.isleft = true
  this.isright = false
  this.push(path)
}
// 需要右方向动画的路由用this.$router.goRight('****')
Router.prototype.goRight = function (path) {
  this.isright = true
  this.isleft = false
  this.push(path)
}
// 需要返回按钮动画的路由用this.$router.goBack()，返回上一个路由
Router.prototype.goBack = function () {
  this.isright = true
  this.isleft = false
  this.go(-1)
}
// 点击浏览器返回按钮执行，此时不需要路由回退
Router.prototype.togoback = function () {
  this.isright = true
  this.isleft = false
}
/// goods
export default new Router({
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: (resolve) => require(['@/pages/home/index'], resolve)
    },
    {
      path: '/',
      name: 'Canteen',
      component: (resolve) => require(['@/pages/canteen/index'], resolve)
    },
    {
      path: '/login',
      name: 'Login',
      component: (resolve) => require(['@/pages/login/index'], resolve)
    },
    {
      path: '/build',
      name: 'Build',
      component: (resolve) => require(['@/pages/build/index'], resolve),
      meta: { title: '选择建筑物' }
    },
    {
      path: '/area',
      name: 'Area',
      component: (resolve) => require(['@/pages/area/index'], resolve),
      meta: { title: '选择病区' }
    },
    {
      path: '/patients',
      name: 'Patients',
      component: (resolve) => require(['@/pages/patients/index'], resolve),
      meta: { title: '病患列表' }
    },
    {
      path: '/patients/adviceSelect',
      name: 'adviceSelect',
      component: (resolve) => require(['@/pages/patients/adviceSelect'], resolve),
      meta: { title: '选择医嘱' }
    },
    {
      path: '/patients/confirm',
      name: 'PatientsConfirm',
      component: (resolve) => require(['@/pages/patients/confirm'], resolve),
      meta: { title: '信息确认' }
    },
    {
      path: '/goods',
      name: 'Goods',
      component: (resolve) => require(['@/pages/goods/index'], resolve),
      meta: {title: '订餐下单'}
    },
    {
      path: '/firmOrder',
      name: 'FirmOrder',
      component: (resolve) => require(['@/pages/firmOrder/index'], resolve),
      meta: {
        title: '确认订单'
      }
    },
    {
      path: '/orderList',
      name: 'OrderList',
      component: (resolve) => require(['@/pages/orderList/index'], resolve),
      meta: {
        title: '我的订单',
        keepAlive: true
      }
    },
    {
      path: '/orderDetails',
      name: 'OrderDetails',
      component: (resolve) => require(['@/pages/orderDetails/index'], resolve),
      meta: {
        title: '我的订单'
      }
    },
    {
      path: '/receivingInformation',
      name: 'ReceivingInformation',
      component: (resolve) => require(['@/pages/receivingInformation/index'], resolve),
      meta: {
        title: '确认订单'
      }
    },
    {
      path: '/inpatientArea',
      name: 'InpatientArea',
      component: (resolve) => require(['@/pages/inpatientArea/index'], resolve),
      meta: {
        title: '确认订单'
      }
    },
    {
      path: '/noticeList',
      name: 'noticeList',
      component: (resolve) => require(['@/pages/notice-list/notice-list'], resolve),
      meta: {
        title: '消息列表'
      }
    },
    {
      path: '/noticeDetails',
      name: 'noticeDetails',
      component: (resolve) => require(['@/pages/notice-details/notice-details'], resolve),
      meta: {
        title: '消息详情'
      }
    },
    {
      path: '/monthReport',
      name: 'monthReport',
      component: (resolve) => require(['@/pages/month-report/month-report'], resolve),
      meta: {
        title: '月度结算单'
      }
    },
    {
      path: '/rating',
      name: 'rating',
      component: (resolve) => require(['@/pages/rating/rating'], resolve),
      meta: {
        title: '评价'
      }
    },
    {
      path: '/personal',
      name: 'personal',
      component: (resolve) => require(['@/pages/personal/index'], resolve),
      meta: {
        title: '个人信息'
      }
    },
    {
      path: '/changePassword',
      name: 'changePassword',
      component: (resolve) => require(['@/pages/changePwd/index'], resolve),
      meta: {
        title: '修改密码'
      }
    },
    {
      path: '/changeTel',
      name: 'changeTel',
      component: (resolve) => require(['@/pages/changeTel/index'], resolve),
      meta: {
        title: '修改手机号'
      }
    },
  ]
})
