// /函数节流和函数防抖
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }
  let _lastTime = null
  // 返回新的函数
  return function () {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments) 
      _lastTime = _nowTime
    }
  }
}
function  getPhoneNumber(e) {
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
    name: 'login',
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
        // wx.setStorageSync('mobile', res.result);
        // //获取数据库的引用
        const db = wx.cloud.database();
        // 判断用户是否注册过
        db.collection('user').where({
          mobile: login_res.result
        }).get().then(res => {
          if (res.data.length != 0) {
            wx.hideLoading();
            wx.showToast({
              title: '欢迎小主回来,想你很久了~',
              icon: 'none'
            })
            wx.setStorageSync('user', res.data[0]);
          } else {
            // 没有注册过
            db.collection('user').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                mobile: login_res.result,
                addtime: db.serverDate(),
                reffer:wx.getStorageSync('link_people'),//推荐人openid
              },
              success: res => {
                // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                // 在返回结果中会包含新创建的记录的 _id
                wx.hideLoading();
                wx.showToast({
                  title: '欢迎小主回来,想你很久了~',
                  icon: 'none'
                })
                getPhoneNumber(e)
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
}
// 生成nonceStr
function getRandom() {
  var str_nums = "",
    range = 32,
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  for (var i = 0; i < range; i++) {
    let id = Math.round(Math.random() * (arr.length - 1));
    str_nums += arr[id];
  }
  return str_nums;
}

// 平移动画
function animationMiddleHeaderItem(that) {
  var circleCount = 0;
  // 心跳的外框动画  
  that.animationMiddleHeaderItem = wx.createAnimation({
    duration: 1000,    // 以毫秒为单位  
    timingFunction: 'linear',
    delay: 100,
    transformOrigin: '50% 50%',
    success: function (res) {
    }
  });
  setInterval(function () {
    if (circleCount % 2 == 0) {
      that.animationMiddleHeaderItem.scale(1.01).step();
    } else {
      that.animationMiddleHeaderItem.scale(1.0).step();
    }

    that.setData({
      animationMiddleHeaderItem: that.animationMiddleHeaderItem.export()  //输出动画
    });

    circleCount++;
    if (circleCount == 1000) {
      circleCount = 0;
    }
  }.bind(this), 1500);
  return that.animationMiddleHeaderItem;
}
module.exports = {
  throttle: throttle,
  getPhoneNumber:getPhoneNumber,
  getRandom:getRandom,
  animationMiddleHeaderItem:animationMiddleHeaderItem
}
