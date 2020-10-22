// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  wxContext = await cloud.getWXContext()

  switch (event.action) {
    case "searchUser": // 搜索用户
      return searchUser(event.info)
      break;
    case "updateGenealogyId": // 搜索用户
      return updateGenealogyId(event.info)
      break;
    case 'addUser': //添加用户
      return addUser(event.info)
  }
}


async function searchUser(info) {
  const userRes = await db.collection('user').where({
    openId:info.openId
  }).get()
  console.log(userRes,info.openId)
  return userRes.data[0]||{}
}

async function updateGenealogyId(info) {
  const userRes = await db.collection('user').doc(info._id).update({
    // data 字段表示需新增的 JSON 数据
    data: {
      genealogyInfoList:info.genealogyInfoList
    }
  })
  return userRes
}

// 添加一个用户记录
async function addUser(info){
  const userRes = await db.collection('user').add({
    // data 字段表示需新增的 JSON 数据
    data: info
  })
  if (userRes._id) {
    return {
      _id:userRes._id,
      ...info
    }
  }
  return {}
}