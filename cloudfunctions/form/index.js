// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()//链接数据库
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action.status) {
    case 0:
      {
        return unpublished(event);
      }
    case 1:
      {
        return published(event)
      }
    default:
      {
        return
      }
  }
}

async function unpublished(event) {
  //未发表
  const post_code = /^\d{6}$/
  if (event.action.software_all.length == 0) {
    return {
      success: -1,
      msg: '请填写软件全称'
    }
  }
  if (event.action.copy_name.length == 0) {
    return {
      success: -1,
      msg: '请填写著作权申请人/公司'
    }
  }
  if (event.action.copy_number.length == 0) {
    return {
      success: -1,
      msg: '请填写著作权/公司证件号'
    }
  }
  if (event.action.copy_address.length == 0) {
    return {
      success: -1,
      msg: '请填写详细地址'
    }
  }
  if (event.action.post_code.length == 0) {
    return {
      success: -1,
      msg: '请填写邮政编码'
    }
  } else if (!(post_code.test(event.action.post_code))) {
    return {
      success: -1,
      msg: '请填写正确的邮政编码'
    }
  }
  if (event.action.link_people.length == 0) {
    return {
      success: -1,
      msg: '请填写联系人'
    }
  }
  if (event.action.email.length == 0) {
    return {
      success: -1,
      msg: '请填写E-mail'
    }
  } else if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(event.action.email))) {
    return {
      success: -1,
      msg: '请填写正确的E-mail'
    }
  }
  if (event.action.iphone.length == 0) {
    return {
      success: -1,
      msg: '请填写手机号码'
    }
  } else if (!(/^1[345789]\d{9}$/.test(event.action.iphone))) {
    return {
      success: -1,
      msg: '请填写正确的手机号码'
    }
  }

  try {
    const result = await db.runTransaction(async transaction => {
      const add = db.collection('form').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          software_all: event.action.software_all, //软件全称
          version: event.action.version,  //版本号
          deliver_status: event.action.status, //发表状态
          copy_name: event.action.copy_name, //著作权人、公司
          copy_number: event.action.copy_number, //著作权/公司证件号
          copy_address: event.action.copy_address, //详细地址
          post_code: event.action.post_code, //邮政编码
          link_people: event.action.link_people, //联系人
          telephone: event.action.telephone, //电话号码
          email: event.action.email, //邮箱
          iphone: event.action.iphone, //手机号码
          fax_number: event.action.fax_number,//传真号码
          write_phone: event.action.mobile,//填写人手机号
          write_openid: event.action.openid, // 填写人openid
          order_number: event.action.order_number, //订单号
          add_time: db.serverDate() //添加时间
        },
        success: res => {

        },
        fail: err => {

        }
      })
      // 添加订单数据
      const add_order = db.collection('order').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          write_phone: event.action.mobile,//填写人手机号
          write_openid: event.action.openid, // 填写人openid
          order_number: event.action.order_number, //订单号
          order_status: 0, //订单状态  0 订单生成 1已付款
          price: Number(399), //应付金额
          pay_money: Number(0), //实付金额
          back_money: Number(0), //退款金额
          other: new Array(), //附件
          pay_status: Number(0), //支付状态 0 未支付 1 已支付
          order_number: event.action.order_number, //订单号
          add_time: db.serverDate(), //添加时间
          type: 0, //代理方式 0 委托代理 1 自行代理
          reffer: event.action.reffer,//邀请人openid
          other_status: Number(0),//附件状态
          del_status: Number(0) //删除状态 
        },
        success: res => {

        },
        fail: err => {

        }
      })
    })
    return {
      success: 0,
      msg: '添加成功'
    }
  } catch  {
    return {
      success: -1,
      msg: '请求失败'
    }
  }
}

async function published(event) {
  //已发表
  const post_code = /^\d{6}$/
  if (event.action.software_all.length == 0) {
    return {
      success: -1,
      msg: '请填写软件全称'
    }
  }
  if (event.action.country.length == 0) {
    return {
      success: -1,
      msg: '请填写首次发表地点(国家)'
    }
  }
  if (event.action.city.length == 0) {
    return {
      success: -1,
      msg: '请填写首次发表地点(城市)'
    }
  }
  if (event.action.copy_name.length == 0) {
    return {
      success: -1,
      msg: '请填写著作权申请人/公司'
    }
  }
  if (event.action.copy_name.length == 0) {
    return {
      success: -1,
      msg: '请填写著作权申请人/公司'
    }
  }
  if (event.action.copy_number.length == 0) {
    return {
      success: -1,
      msg: '请填写著作权/公司证件号'
    }
  }
  if (event.action.copy_address.length == 0) {
    return {
      success: -1,
      msg: '请填写详细地址'
    }
  }
  if (event.action.post_code.length == 0) {
    return {
      success: -1,
      msg: '请填写邮政编码'
    }
  } else if (!(post_code.test(event.action.post_code))) {
    return {
      success: -1,
      msg: '请填写正确的邮政编码'
    }
  }
  if (event.action.link_people.length == 0) {
    return {
      success: -1,
      msg: '请填写联系人'
    }
  }
  if (event.action.email.length == 0) {
    return {
      success: -1,
      msg: '请填写E-mail'
    }
  } else if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(event.action.email))) {
    return {
      success: -1,
      msg: '请填写正确的E-mail'
    }
  }
  if (event.action.iphone.length == 0) {
    return {
      success: -1,
      msg: '请填写手机号码'
    }
  } else if (!(/^1[345789]\d{9}$/.test(event.action.iphone))) {
    return {
      success: -1,
      msg: '请填写正确的手机号码'
    }
  }
  try {
    const result = await db.runTransaction(async transaction => {
      // 添加表单填写数据
      const add_list = db.collection('form').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          software_all: event.action.software_all, //软件全称
          version: event.action.version,  //版本号
          start_time: event.action.start_time,  //首次发表时间 
          country: event.action.country,  //首次发表国家
          city: event.action.city,  //首次发表城市
          deliver_status: event.action.status, //发表状态
          copy_name: event.action.copy_name, //著作权人、公司
          copy_number: event.action.copy_number, //著作权/公司证件号
          copy_address: event.action.copy_address, //详细地址
          post_code: event.action.post_code, //邮政编码
          link_people: event.action.link_people, //联系人
          telephone: event.action.telephone, //电话号码
          email: event.action.email, //邮箱
          iphone: event.action.iphone, //手机号码
          fax_number: event.action.fax_number,//传真号码
          write_phone: event.action.mobile,//填写人手机号
          write_openid: event.action.openid, // 填写人openid
          order_number: event.action.order_number, //订单号
          add_time: db.serverDate() //添加时间
        },
        success: res => {

        },
        fail: err => {

        }
      })
      // 添加订单数据
      const add_order = db.collection('order').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          write_phone: event.action.mobile,//填写人手机号
          write_openid: event.action.openid, // 填写人openid
          order_number: event.action.order_number, //订单号
          order_status: 0, //订单状态  0 订单生成 1邮寄
          price: Number(399), //应付金额
          pay_money: Number(0), //实付金额
          back_money: Number(0), //退款金额
          other: new Array(), //附件
          pay_status: Number(0), //支付状态 0 未支付 1 已支付
          order_number: event.action.order_number, //订单号
          add_time: db.serverDate(), //添加时间
          type: 0, //代理方式 0 委托代理 1 自行代理
          reffer: event.action.reffer,//邀请人openid
          other_status: Number(0),//附件状态  0不显示 1 显示
          del_status: Number(0) //删除状态 
        },
        success: res => {

        },
        fail: err => {

        }
      })
    })

    return {
      success: 0,
      msg: '添加成功'
    }
  } catch (e) {
    return {
      success: -1,
      msg: '请求失败,重新尝试'
    }
  }

}
