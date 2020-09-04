const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const totalFee = Number(event.totalFee) / 100;
  const resultCode = event.resultCode
  if (resultCode === 'SUCCESS') {
    const order = db.collection('pay_log').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        totalFee: Number(totalFee),
        order_number: event.outTradeNo,
        openid: event.userInfo.openId,
        time: event.timeEnd
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
      }
    })
    const thisID = db.collection('order').where({
      'order_number': event.outTradeNo
    }).update({
        data: {
          'order_status': Number(1),
          pay_money:Number(totalFee),
          pay_status:Number(1),
          other_status: Number(1)
        }
      })
    const res = { errcode: 0, errmsg: '支付成功' }
    return res
  }
}
