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