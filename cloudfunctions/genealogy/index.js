// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
let wxContext = null
// 云函数入口函数
exports.main = async (event, context) => {
  wxContext = await cloud.getWXContext()
  if (!wxContext.OPENID) {
    return {
      msg:'请授权'
    }
  }
  switch (event.action) {
    case "add":
      return addGenealogy(event.userInfo)
      break;
    case 'search':
      return searchGenealogy()
      break;
    case 'addNode':
      return addNode(event)
      break;
  }
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}

// 添加一个家谱记录
async function addGenealogy(userInfo){
  const params = {
      creator:wxContext.OPENID, // 创建者OPENID
      name:'幸福一家人', // 家谱名称
      members:{
        ...userInfo,
        openId: wxContext.OPENID,
        members:[],
        companion:{}
      }
  }
  const genealogyRes = await db.collection('genealogy').add({
    // data 字段表示需新增的 JSON 数据
    data: params
  })
  if (genealogyRes._id) {
    const userRes = await db.collection('user').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        genealogyId:genealogyRes._id,
        ...userInfo
      }
    })
    if (userRes._id) {
      return {
        _id:genealogyRes._id,
        ...params
      }
    }
  }
  return {
    msg: '请重试'
  }
}

// 查询家谱
async function searchGenealogy(){
  let userInfo = {}
  const userRes = await db.collection('user').where({
    openId: wxContext.OPENID
  }).get()
  if (userRes.data.length) {
    userInfo = userRes.data[0]
    const genealogyRes = await db.collection('genealogy').doc(userInfo.genealogyId).get()
    return {
      userInfo,
      genealogyInfo:genealogyRes.data
    }
  }
  return {
    userInfo:{},
    genealogyInfo:{}
  }
}

// 添加成员节点
async function addNode(info){
  /**
   * type
   * 0 父亲
   * 1 儿女
   * 2 伴侣
   */
  const genealogyRes = await db.collection('genealogy').doc(info.genealogyId).get()
  const memberNode = findNode(genealogyRes.members, info.openId)
  switch (info.type) {
    case "0":
      
      break;
    case "1":
      
      break;
    case "2":
      memberNode.companion = {
        avatarUrl:'',
        nickName:'',
        tempId:'',
        openId:''
      }
      break;
  
    default:
      break;
  }

  const updateRes = await db.collection('genealogy').doc(info.genealogyId).update({
    data:{
      members:genealogyRes.members
    }
  })

  return {
    genealogyInfo:genealogyRes
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