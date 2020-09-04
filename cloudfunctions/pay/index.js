const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const res = await cloud.cloudPay.unifiedOrder({
    "body": event.body,
    "outTradeNo": event.order_number,
    "spbillCreateIp": "127.0.0.1",
    "subMchId": "1497339252",//普通商户id
    "totalFee": Number(event.money),//支付金额
    "envId": "soft-writing-9sd4l",//云环境id
    "functionName": "pay_success",//回调函数名
    "nonceStr": event.nonceStr,//必填项，
    "tradeType": "JSAPI",
  })
  return res
}

