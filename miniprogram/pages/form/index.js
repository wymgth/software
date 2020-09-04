// pages/form/form.js
const util = require("../../utils/util")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    success_info: '2020-09-01',
    success: '2020-09-01',
    pickValue: '',
    date: '2020-09-01',
    sex: 2,
    pickList: ['中国大陆', '中国香港', '中国台湾', '中国澳门', '智利', '直布罗陀', '乍得', '赞比亚', '越南', '约旦', '英属印度洋区', '英属维尔京群岛', '英国', '印度尼西亚', '印度', '意大利', '以色列', '伊朗', '伊拉克', '也门', '亚美尼亚', '牙买加', '叙利亚', '匈牙利', '新西兰', '新喀里多尼亚', '新加坡', '小奥特兰群岛', '象牙海岸', '希腊', '西班牙', '乌兹别克斯坦', '乌拉圭', '乌克兰', '乌干达', '文莱达鲁萨兰', '委内瑞拉', '危地马拉', '瓦努阿图', '瓦利斯/富图纳岛', '托客劳群岛', '土库曼斯坦', '土耳其', '图瓦卢', '突尼斯', '统一', '特立尼达/多巴哥', '特克斯/凯科斯岛', '汤加', '坦桑尼亚', '泰国', '塔吉克斯坦', '索马里', '所罗门群岛', '苏里南', '苏丹', '斯洛文尼亚', '斯洛伐克', '斯里兰卡', '圣文森特', '圣马力诺', '圣路西亚', '圣基茨和那维斯', '圣赫勒拿岛', '圣多马/普林西比', '圣诞岛', '沙特阿拉伯', '塞舌尔群岛', '塞浦路斯', '塞内加尔', '塞拉利昂', '塞尔维亚及门的', '塞尔维亚/Monten', '萨摩亚, 美国', '萨摩亚', '萨尔瓦多', '撒哈拉西部', '瑞士'],
    pickValue: '',
    form_info: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  change(e) {
    this.setData({
      currentTab: e.detail.index
    })
  },
  tips: function (e) {
    var that = this;
    var now = this.data.tip;
    var fl = this.data.fenlei;
    var bb = this.data.banben;
    var num = e.currentTarget.dataset.tip;
    if (num == 1) {
      if (now == num) {
        that.setData({
          tip: 0
        })
      } else {
        that.setData({
          tip: num
        })
      }
    } else if (num == 2) {
      if (fl == num) {
        that.setData({
          fenlei: 0
        })
      } else {
        that.setData({
          fenlei: 2
        })
      }
    } else if (num == 3) {
      if (bb == num) {
        that.setData({
          banben: 0
        })
      } else {
        that.setData({
          banben: 3
        })
      }
    }


  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  successChange: function (e) {
    this.setData({
      success: e.detail.value
    })
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
    var that = this;
    if (wx.getStorageSync('user')) {
      that.setData({
        mobile: wx.getStorageSync('user').mobile,
        sex: 2
      })
    } else {
      wx.clearStorageSync()
    }
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
    clearTimeout(this.data.timeout)
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

  radioChange(e) {
    this.setData({
      sex: e.detail.value
    })
  },
  // 地点选择
  picker: function (e) {
    this.setData({
      pickValue: this.data.pickList[e.detail.value]
    })
  },
  // 表单提交
  submitForm: util.throttle(function (e) {
    var that = this;
    var info_one = e.detail.value;
    var set_info; //总数据
    // 基础数据
    var get_st = {
      software_all: info_one.software_all,
      version: info_one.version,
      copy_name: info_one.copy_name,
      copy_number: info_one.copy_number,
      copy_address: info_one.copy_address,
      post_code: info_one.post_code,
      link_people: info_one.link_people,
      telephone: info_one.telephone,
      email: info_one.email,
      iphone: info_one.iphone,
      fax_number: info_one.fax_number,
      openid: wx.getStorageSync('user')._openid,
      mobile: wx.getStorageSync('user').mobile,
      other: '',
      reffer: wx.getStorageSync('user').reffer,
      order_number: that.random_No()
    }
    // 获取发表状态
    var get_success = that.data.sex == 2 ? {
      status: Number(0) //未发表
    } : {
        start_time: that.data.success,
        country: info_one.country,
        city: info_one.city,
        status: Number(1) //已发表
      };
    set_info = Object.assign(get_st, get_success);
    wx.cloud.callFunction({
      name: 'form',
      data: {
        action: set_info,
      },
      success: (res) => {
        wx.showToast({
          title: res.result.msg,
          icon: 'none',
          duration: 2500
        })
        if (res.result.success == 0) {
          var timeout = setTimeout(() => {
            wx.navigateTo({
              url: '/pages/order/index',
            })
          }, 2000);
          that.setData({
            timeout:timeout
          })
        }
      },
      fail: err => {
        return err;
      }
    })
  },3000),
  onLaunch: function (e) {

  },

  formReset: function (e) {
    console.log("清空数据")
  },
  getPhoneNumber: util.throttle(function (e) {
    util.getPhoneNumber(e);
    var that = this
    setTimeout(() => {
      that.onShow()
    }, 1500);
  }, 1500),
  // 生成订单号
  random_No: function () {
    // 时间戳
    var time = new Date();
    // 年
    var year = String(time.getFullYear());
    // 月
    var mouth = String(time.getMonth() + 1);
    // 日
    var day = String(time.getDate());
    // 时
    var hours = String(time.getHours());
    if (hours.length < 2) {
      hours = '0' + hours
    }
    // 分
    var minutes = String(time.getMinutes());
    if (minutes.length < 2) {
      minutes = '0' + minutes
    }
    // 秒
    var seconds = String(time.getSeconds());
    if (seconds.length < 2) {
      seconds = '0' + seconds
    }
    var random_no = "";
    for (var i = 0; i < 6; i++) //j位随机数，用以加在时间戳后面。
    {
      random_no += Math.floor(Math.random() * 10);
    }
    var str = year + mouth + day + hours + minutes + seconds + random_no
    return str;
  }
})