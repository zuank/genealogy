// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
let wxContext = null
// 云函数入口函数
exports.main = async (event, context) => {
  wxContext = await cloud.getWXContext()

  switch (event.action) {
    case 'getGenealogyInfo':
      return getGenealogyInfo(event.info)
    case 'getUserInfo':
      return getUserInfo()
      break;
    case "addGenealogy": // 新增一条家谱记录
      return addGenealogy(event)
      break;
    case "addNode": // 新增一条家庭成员
      return addNode(event.info)
      break;
    case "joinGenealogy": // 加入家谱
      return joinGenealogy(event.info)
  }
}


// 添加家庭成员
async function addNode(info){
  console.log(info)
  const res = await getGenealogyInfo({_id:info.genealogyId})
  console.log(res)
  if (res._id) {
    /**
     * type
     * 0 父亲
     * 1 儿女
     * 2 伴侣
     */
    console.log(res.members,info.userId)
    let userInfo = findNode(res.members,info.userId,info.IDType)
    const time = new Date().getTime()
    const params = {
      avatarUrl:'',
      nickName:'',
      tempId:time,
      openId:'',
    }
    switch (info.type) {
      case "0":
        res.members = {
          ...params,
          companion:params,
          members:[],
          members:[userInfo]
        }
        break;
      case "1":
        console.log(userInfo.members)
        userInfo.members = [
          ...userInfo.members,
          {
            ...params,
            companion:{},
            members:[]
          }
        ]
        break;
      case "2":
        userInfo.companion = params
        break;
    }
    console.log(userInfo)
    const searchRes = await updateMembers(info.genealogyId,res.members)
    return searchRes
  } else {
    return "没有找到家谱"
  }
}

// 加入家谱
async function joinGenealogy(info){
  console.log(info)
  const res = await getGenealogyInfo({_id:info.genealogyId})
  if (res._id){
    let userInfo = findNode(res.members,info.userId,"tempId")
    if (userInfo.openId == '') {
      userInfo.nickName = info.userInfo.nickName
      userInfo.avatarUrl = info.userInfo.avatarUrl
      userInfo.openId = wxContext.OPENID
      await addUser(info.userInfo,res.name,info.genealogyId,)
    }
    console.log(userInfo)
    const searchRes = await updateMembers(info.genealogyId,res.members)
    return searchRes
  } else {
    return "没有找到家谱"
  }
}

// 更新家谱
async function updateMembers(genealogyId,members){
  return await cloud.callFunction({
    name:'genealogy',
    data:{
      action:'updateMembers',
      info:{
        genealogyId,
        members
      }
    }
  })
}


// 获取家谱信息
async function getGenealogyInfo(info){
  console.log(info)
  const searchRes = await cloud.callFunction({
    name:'genealogy',
    data:{
      action:'search',
      info:{
        _id:info._id
      }
    }
  })

  if (searchRes.result._id) {
    return searchRes.result
  }
  return {}
}

// 获取用户信息
async function getUserInfo(){
  // 查询用户表 是否已经存在用户
  const searchRes = await cloud.callFunction({
    name:'user',
    data:{
      action:'searchUser',
      info:{
        openId:wxContext.OPENID
      }
    }
  })
  if (searchRes.result._id) {
    return searchRes.result
  }
  return {}
}


// 添加一个家谱记录
async function addGenealogy(info){
  const userInfo = info.userInfo
  const GenealogyName = info.name||'幸福一家人' // 家谱名称
  const params = {
      creator:wxContext.OPENID, // 创建者OPENID
      name:GenealogyName, // 家谱名称
      members:{
        nickName:userInfo.nickName,
        avatarUrl:userInfo.avatarUrl,
        openId: wxContext.OPENID,
        members:[],
        companion:{}
      }
  }
  const genealogyRes = await cloud.callFunction({
    name:'genealogy',
    data:{
      action:'add',
      info:params
    }
  })

  if (genealogyRes.result._id) {
    // 查询用户表 是否已经存在用户
    const searchRes = await cloud.callFunction({
      name:'user',
      data:{
        action:'searchUser',
        info:{
          openId:wxContext.OPENID
        }
      }
    })
    // 更新用户表
    if (searchRes.result._id){
      const updateRes = await cloud.callFunction({
        name:'user',
        data:{
          action:'updateGenealogyId',
          info:{
            _id:searchRes.result._id,
            genealogyInfoList:[...searchRes.result.genealogyInfoList,{
              name:genealogyRes.result.name,
              _id:genealogyRes.result._id
            }]
          }
        }
      })
      console.log(updateRes)
      if (updateRes.result.stats.updated==1) {
        return {
          ...searchRes.result,
          genealogyInfoList:[...searchRes.result.genealogyInfoList,{
            name:genealogyRes.result.name,
            _id:genealogyRes.result._id
          }]
        }
      }
    } else {
      // 新增一个用户
      const addRes = await addUser(userInfo,GenealogyName,genealogyRes.result._id)
      
      if (addRes.result._id) {
        return {
          _id:addRes.result._id,
          ...userInfo,
          openId: wxContext.OPENID,
          genealogyInfoList:[{
            name:genealogyRes.result.name,
            _id:genealogyRes.result._id
          }]
        }
      }
    }
  }
  return {
    msg: '请重试'
  }
}
// 新增用户
async function addUser(userInfo,genealogyName,genealogyId) {
  return await cloud.callFunction({
    name:'user',
    data:{
      action:'addUser',
      info:{
        ...userInfo,
        openId: wxContext.OPENID,
        genealogyInfoList:[{name:genealogyName,_id:genealogyId}]
      }
    }
  })
}

// 递归查找用户节点
function findNode(obj, id, type){
  let _obj = {}
  if (obj[type||'openId'] == id){
    _obj = obj
  } else if (obj.companion[type||'openId'] == id){
    _obj = obj.companion
  } else if (obj.members && obj.members.length) {
    obj.members.forEach(item => {
      if (findNode(item,id,type)[type||'openId']){
        _obj = findNode(item,id,type)
      }
    });
  }
  return _obj
}