// pages/income/index.js
var util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showpsStatus: false,
    areDisabled: true,
    addr_list: [{
      name: '已付款'
    },
    {
      name: '授权代理'
    },
    {
      name: '打印盖章邮寄'
    },
    {
      name: '版权中心审核'
    },
    {
      name: '快递下证'
    }],
    site_type: ''
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
    this.reffer()
  },
  // 订单查询
  reffer: function () {
    var that = this;
    const db = wx.cloud.database();
    // 判断有无信息
    db.collection('order').where({
      pay_status: 1, //支付状态
      del_status: 0  //订单状态
    }).count({
      success: (rdar) => {
        that.setData({
          people: rdar.total
        })
        if (rdar.total > 0) {
          wx.cloud.callFunction({
            name: "admin_order",
            data: {
            },
            complete: res => {
              that.setData({
                list: res.result.data
              })
            }
          })
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  // 记录
  notes: function () {
    var that = this
    wx.showLoading({
      title: '请稍等',
      mask: true
    })
    const db = wx.cloud.database();
    db.collection('user').where({
      reffer: wx.getStorageSync('user')._openid,
    }).get().then(res => {
      wx.hideLoading({
        success: (res) => { },
      })
      if (res.data.length != 0) {
        that.setData({
          list: res.data
        })
        var arr = that.data.list;
        arr.forEach((item, index) => {
          var temp = "list[" + index + "].addtime";
          that.setData({
            [temp]: that._formatime(arr[index].addtime),
          })
        })
      }
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 时间处理函数 
  _formatime(time_t) {
    var t = new Date(time_t)
    var month = t.getMonth() + 1
    var date = t.getFullYear() + '.' + month + '.' + t.getDate()
    return date
  },
  show_order: function (e) {
    var that = this;
    wx.showModal({
      content: '确定要修改该订单状态吗？',
      success: (res) => {
        if (res.confirm) {
          var animation = wx.createAnimation({
            duration: 220,
            timingFunction: "linear",
            delay: 0
          })
          animation.translateY(500).step()
          this.setData({
            animationDatas: animation.export(),
            showpsStatus: true,
            site_type: 0,
            update_id: e.currentTarget.dataset.id
          })
          setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
              animationDatas: animation.export(),
            })
          }.bind(this), 200)
        }
      }
    })
  },
  picker_ps: function (e) {
    let value = this.data.site_type;
    var that = this;
    wx.showLoading({
      title: '请稍等',
      icon: 'none',
      duration: 3000
    })
    that.setData({
      showpsStatus: false,
    })
    wx.cloud.callFunction({
      name: 'update_order',
      data: {
        id: that.data.update_id,
        status: Number(value) + 1
      },
      success: (res) => {
        wx.hideLoading()
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          that.onShow()
        }, 2500);
      }
    })
  },
  columnps: function (e) {
    let value = e.detail.value;
    this.setData({
      site_type: value[0]
    })
  },
  hideps: function () {
    this.setData({
      showpsStatus: false
    })
  },
  go_list: util.throttle(function (e) {
    wx.navigateTo({
      url: '/pages/info/index?number=' + e.currentTarget.dataset.order,
    })
  }, 1000),
}) 