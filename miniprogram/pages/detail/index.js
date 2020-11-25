//index.js
const app = getApp()
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
Page({
  data: {
    genealogyInfo:{},
    isPopShow: false,
    _id: '',
    popConfig:{
      canAddParents:false,
      canAddSons:true,
      canAddCompanion:false,
      canInvite:false
    }
  },

  onShareAppMessage: function (res) {
    console.log(`/pages/index/index?genealogyId=${app.globalData.genealogyId}&userId=${app.globalData.inviteId}`)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '邀请你加入家谱',
      path: `/pages/index/index?genealogyId=${app.globalData.genealogyId}&userId=${app.globalData.inviteId}`
    }
  },
  showPop:function(){
    this.setData({
      isPopShow: true
    })
    // 判断该节点都否可以添加 邀请
    const res = findNode(this.data.genealogyInfo.members,app.globalData.userId,app.globalData.IDType)
    this.setData({
      popConfig:{
        canAddParents:this.data.genealogyInfo.members[app.globalData.IDType]==res[app.globalData.IDType],
        canAddSons:true,
        canAddCompanion:res.companion.openId==undefined,
        canInvite:app.globalData.IDType=="tempId"||(!res.companion.openId)
      }
    })
    
  },
  closePop:function(){
    this.setData({
      isPopShow: false
    })
  },
  
  onLoad:function(option){
    app.globalData.genealogyId = option._id
    this.setData({
      _id:option._id
    })
    console.log(option)
    this.getGenealogyInfo()
  },
  getGenealogyInfo(){
    wx.cloud.callFunction({
      name:'api',
      data:{
        action:'getGenealogyInfo',
        info:{
          _id:this.data._id
        }
      },
      complete:(res)=>{
        this.setData({
          genealogyInfo:res.result
        })
        console.log(res)
      }
    })
  },
  addComplete(){
    this.setData({
      isPopShow:false
    })
    this.getGenealogyInfo()
  }
})
