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
      return addGenealogy(event.userInfo)
      break;
    case "addNode": // 新增一条家庭成员
      return addNode(event.info)
      break;
  }
}


// 添加家庭成员
async function addNode(info){
  const res = await getGenealogyInfo({_id:info.genealogyId})
  console.log(res)
  if (res._id) {
    /**
     * type
     * 0 父亲
     * 1 儿女
     * 2 伴侣
     */
    let userInfo = findNode(res.members,info.openId)
    const time = new Date().getTime()
    const params = {
      avatarUrl:'',
      nickName:'',
      tempId:time,
      openId:'',
    }
    switch (info.type) {
      case "0":
        console.log(userInfo)
        res.members = {
          ...params,
          companion:{},
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
    const searchRes = await cloud.callFunction({
      name:'genealogy',
      data:{
        action:'updateMembers',
        info:{
          genealogyId:info.genealogyId,
          members:res.members
        }
      }
    })

    return searchRes
  } else {
    return "没有找到家谱"
  }
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
  const params = {
      creator:wxContext.OPENID, // 创建者OPENID
      name:info.name||'幸福一家人', // 家谱名称
      members:{
        ...userInfo,
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
      const addRes = await cloud.callFunction({
        name:'user',
        data:{
          action:'addUser',
          info:{
            ...userInfo,
            openId: wxContext.OPENID,
            genealogyInfoList:[{name:'',_id:genealogyRes.result._id}]
          }
        }
      })
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


// 递归查找用户节点
function findNode(obj, id, type){
  let _obj = {}
  if (obj[type||'openId'] == id){
    _obj = obj
  } else if (obj.members && obj.members.length) {
    obj.members.forEach(item => {
      if (findNode(item,id,type)[type||'openId']){
        _obj = findNode(item,id,type)
      }
    });
  }
  return _obj
}