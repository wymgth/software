//index.js
const app = getApp()
const util = require("../../utils/util")
Page({
  data: {
    left: 0,
    right: 80,
    bottom: 150,
    bgColor: "#5677fc",
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的主页', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    link_people:0
  },

  onLoad: function (e) { 
    var that = this;
    //获取分享人的openID
    //点击分享的面板进入的小程序
    if (e && e.userShare) {
      //转化json为对象
      let userShare = JSON.parse(e.userShare);
      console.log(userShare)
      that.setData({
        link_people:userShare.openId
      })
    } 
    util.animationMiddleHeaderItem(this);
  },
  onShareAppMessage: function(res) {
    var vm = this;
    //自定义信息
    let sendinfo = {
      openId: wx.getStorageSync('user')._openid, //分享人的openId
      mobile: wx.getStorageSync('user').mobile, //分享人的昵称
    }
    let str = JSON.stringify(sendinfo);
    return {
      title: '在线快速申请软件著作权',
      path: 'pages/index/index?userShare=' + str,
      success: function(res) {
        console.log("分享success()");
        console.log("onShareAppMessage()==>>转发成功", res);
        //分享的是群还是个人
        app.setInfo(res);
      },
      fail: (res) => {
        console.log("onShareAppMessage()==>>转发失败", res);
      }
    }
  },
  onShareTimeline: function(res) {
    var vm = this;
    //自定义信息
    let sendinfo = {
      openId: wx.getStorageSync('user')._openid, //分享人的openId
      mobile: wx.getStorageSync('user').mobile, //分享人的昵称
    }
    let str = JSON.stringify(sendinfo);
    console.log(str)
    return {
      title: '在线快速申请软件著作权',
      query: 'userShare=' + str,
      success: function(res) {
        app.setInfo(res);
      },
      fail: (res) => {
        console.log("onShareAppMessage()==>>转发失败", res);
      }
    }
  },
  onShow: function () {
    wx.showShareMenu({
      withShareTicket: true,
    })
    var that = this;
    if (wx.getStorageSync('user')) {
      that.setData({
        mobile: wx.getStorageSync('user').mobile
      })
    } else {
      wx.clearStorageSync()
    }
  },
  getPhoneNumber:function(e) {
    let that = this;
    //判断用户是否授权确认
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showToast({
        title: '获取手机号失败',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '获取手机号中...',
    })
    wx.cloud.callFunction({
      name: 'login',   //登录云函数
      data: {
        action: 'getcellphone',
        id: wx.cloud.CloudID(e.detail.cloudID),
      },
      success: (login_res) => {
        //判断该手机号是否注册，如果手机号在数据库中注册了则直接跳转
        if (login_res.result == null) {
          wx.hideLoading();
          wx.showToast({
            title: '获取失败,请重新获取',
            icon: 'none',
            duration: 2000
          })
          return false;
        } else {
          // //获取数据库的引用
          const db = wx.cloud.database();
          // 判断用户是否注册过
          db.collection('user').where({
            mobile: login_res.result
          }).get().then(res => {
            if (res.data.length != 0) {
              console.log(wx.getStorageSync('link_people'))
              wx.hideLoading();
              wx.showToast({
                title: '欢迎小主回来,想你很久了~',
                icon: 'none'
              })
              wx.setStorageSync('user', res.data[0]);
              that.onShow()
            } else {
              // 没有注册过
              console.log(wx.getStorageSync('link_people'))
              db.collection('user').add({
                // data 字段表示需新增的 JSON 数据
                data: {
                  mobile: login_res.result,
                  addtime: db.serverDate(),
                  reffer:that.data.link_people,//推荐人openid
                },
                success: res => {
                  // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                  // 在返回结果中会包含新创建的记录的 _id
                  wx.hideLoading();
                  that.getPhoneNumber(e)
                },
                fail: err => {
                  wx.hideLoading();
                  wx.showToast({
                    icon: 'none',
                    title: '一不小心走神了,重新试试吧'
                  })
                }
              })
            }
          })
        }
      },
      fail: err => {
        return err;
      }
    })
  },
  handlerGohomeClick:util.throttle(function(e) {
    wx.navigateTo({
      url: '/pages/order/index'   //订单页
    });
  },1500)
})
