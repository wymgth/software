// pages/form/form.js

var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs3: [{
      name: "软件基本信息"
    }, {
      name: "软件技术特点"
    }, {
      name: "著作权人信息"
    }, {
      name: "软件鉴别资料"
    }],
    currentTab: 0,
    bgColor: "#ffe1cc",
    tip: 0,
    fenlei: 0,
    banben: 0,
    date2: '2020-09-01',
    success_info: '2020-09-01',
    success: '2020-09-01',
    pickValue: '',
    date: '2020-09-01',
    sex: 2,
    modal8: false,
    sort_code: '10000-0000',
    sex: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var sex;
    const db = wx.cloud.database();
    // 判断有无信息
    db.collection('form').where({
      order_number: options.number
    }).get().then(res => {
      if (res.data.deliver_status == '未发表') {
        sex = 1
      } else {
        sex = 0
      }
      console.log(res.data)
      that.setData({
        list: res.data[0],
        sex: sex
      })
    })
  },
  // wx.request({
  //   url: api_url + '/xcx/user/selnumber',
  //   method: 'POST',
  //   data: {
  //     number: options.number
  //   },
  //   success: (res) => {
  //     if (res.data.code == 0) {
  //       var sex;
  //       if (res.data.data.deliver_status == '未发表') {
  //         sex = 1
  //       } else {
  //         sex = 0
  //       }
  //         that.setData({
  //           list: res.data.data,
  //           sex:sex
  //         })
  //     } else {
  //       wx.showToast({
  //         title: res.data.msg,
  //         icon: 'none'
  //       })
  //     }
  //   }

  // })
// },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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


  onLaunch: function (e) {

  },
  radioChange(e) {
  console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
    sex: e.detail.value
  })
},
})