// pages/income/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    areDisabled: true,
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
  // 查询邀请人数 
  reffer: function () {
    var that = this;
   
    const db = wx.cloud.database();
    // 判断有无信息
    db.collection('user').where({
      reffer: wx.getStorageSync('user')._openid,
    }).count({
      success: (rdar) => {
        that.setData({
          people: rdar.total
        })
        if (rdar.total > 0) {
         that.notes()
        } else {
          wx.showToast({
            title: '邀请伙伴有惊喜吆~，快去试试吧',
            icon: 'none', duration: 3000
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
}) 