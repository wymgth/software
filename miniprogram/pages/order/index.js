// pages/weituo/order/index.js
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_list: [],
    mail: true,
    other: true,
    left: 0,
    right: 80,
    bottom: 150,
    bgColor: "#5677fc",
    btnList: [{
      bgColor: "#fff",
      //图标/图片地址
      imgUrl: "/images/huo.png",
      //图片高度 rpx
      imgHeight: 64,
      //图片宽度 rpx
      imgWidth: 64,
      //名称
      text: "小伙伴",
      //字体大小
      fontSize: 34,
      //字体颜色
      color: "#fff"
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      order_list:[]
    })
    this.order();

  },
  // 查询订单信息
  order: function () {
    var that = this;
    const db = wx.cloud.database();
    // 判断有无信息
    db.collection('order').where({
      write_phone: wx.getStorageSync('user').mobile,
      del_status: 0
    }).orderBy('add_time', 'desc').get().then(res => {
      if (res.data.length != 0) {
        that.setData({
          order_list: res.data
        })
      } else {
        wx.showToast({
          title: '暂无订单',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  // 付款
  pay_money: util.throttle(function (e) {
    console.log(e)
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that = this;
    var uuid = util.getRandom() //生成noncestr
    var pay_money = Number(e.currentTarget.dataset.price) * 100;
    // var pay_money = Number(1);
    var body = "著作权委托代理"
    wx.cloud.callFunction({
      name: "pay",
      data: {
        body: body,
        order_number: e.currentTarget.dataset.order,
        money: pay_money, //支付金额
        nonceStr: uuid
      },
      success(res) {
        wx.hideLoading({
          complete: (res) => { },
        })
        that.pay(res.result, pay_money)
      },
      fail(res) {
        wx.hideLoading({
          complete: (res) => { },
        })
        console.log("提交失败", res)
      }
    })
  }, 1000),
  pay(payData, pay_money) {
    var that = this;
    const payment = payData.payment //这里注意，上一个函数的result中直接整合了这里要用的参数，直接展开即可使用
    wx.requestPayment({
      ...payment, //展开变量的语法 
      success(res) {
        console.log(res)
        that.onShow()
      },
      fail(res) {
        wx.showToast({
          title: '取消支付',
          icon: 'none'
        })
        //支付失败
      }
    })
  },

  // 客服
  cell_iphone: function () {
    wx.makePhoneCall({
      phoneNumber: '0351-2917721'
    })
  },
  handleContact(e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  },
  // 邮寄
  mail_btn: function () {
    this.setData({
      mail: false
    })
  },
  // 附件
  other_btn: function () {
    this.setData({
      other: false
    })
  },
  hidden_btn: function () {
    this.setData({
      mail: true,
      other: true
    })
  },
  // go_list: util.throttle(function (e) {

  // }, 2000),
  onClick(e) {
    let index = e.detail.index;
    var that = this;
    if (index == 0) {
      wx.navigateTo({
        url: '/pages/reffer/index',
      })
    }
  },
  delete(e) {
    wx.hideLoading();
    let index = e.currentTarget.dataset.index
    var that = this;
    wx.showModal({
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          // 跟新数据库
          wx.cloud.callFunction({
            name: 'del_form',
            data: {
              id: index,
            },
            success: (res) => {
              wx.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 2000
              })
              setTimeout(() => {
                that.onShow()
              }, 2500);
            }
          })
          return false

        }
      }
    })
  },

})