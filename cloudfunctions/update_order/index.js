// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event.id)
  console.log(event.status)
  try {
    return await db.collection('order').doc(event.id)
    .update({
      data: {
        order_status: Number(event.status)
      },
    })
  } catch(e) {
    return '修改失败'
  }
}