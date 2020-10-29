// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case "add":
      return addGenealogy(event.info)
      break;
    case 'search':
      return searchGenealogy(event.info)
      break;
    case 'updateMembers':
      return updateMembers(event.info)
      break;
  }
}

// 添加一个家谱记录
async function addGenealogy(info){
  const genealogyRes = await db.collection('genealogy').add({
    // data 字段表示需新增的 JSON 数据
    data: info
  })
  if (genealogyRes._id) {
    return {
      _id:genealogyRes._id,
      ...info
    }
  }
  return {}
}

// 查询家谱
async function searchGenealogy(info){
  const genealogyRes = await db.collection('genealogy').where({_id:info._id}).get()
  if (genealogyRes.data[0]) {
    return genealogyRes.data[0]
  }
  return {}
}

// 添加成员节点
async function updateMembers(info){
  /**
   * type
   * 0 父亲
   * 1 儿女
   * 2 伴侣
   */
  const genealogyRes = await db.collection('genealogy').doc(info.genealogyId).get()
  const updateRes = await db.collection('genealogy').doc(info.genealogyId).update({
    data:{
      members:info.members
    }
  })
  return {
    status:updateRes.status
  }
}

// 递归查找用户节点
function findNode(obj, id, type){
  let _obj = {}
  if (obj[type||'openId'] == id){
    _obj = obj
  } else if (obj.members && obj.members.length) {
    obj.members.forEach(item => {
      if (findNode(item,id)[type||'openId']){
        _obj = findNode(item,id)
      }
    });
  }
  return _obj
}