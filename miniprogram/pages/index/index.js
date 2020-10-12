//index.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    genealogyInfo:{},
    ready: false,
    hasAuth: true
  },

  onLoad: function() {
    // 获取授权信息
    wx.getSetting({
      success: res => {
        console.log(this,res)
        if (res.authSetting['scope.userInfo']) {
          this.setData({
            hasAuth: true
          })
          this.onSearchGenealogy()
        }
      }
    })
  },
  // 查询家谱
  onSearchGenealogy: function() {
    wx.cloud.callFunction({
      name:'genealogy',
      data:{
        action:'search'
      },
      success:(res)=>{
        this.setData({
          userInfo: res.result.userInfo,
          genealogyInfo: res.result.genealogyInfo,
          ready: true
        })
        console.log(res)
      }
    })
  },
  //新建家谱
  onAddGenealogy: function(e) {
    wx.cloud.callFunction({
      name:'genealogy',
      data:{
        action:'add',
        userInfo:e.detail.userInfo
      },
      success:(res)=>{
        console.log(res)
      }
    })
  },
  // 获取授权
  onGetAuth(e){
    if (e.detail.userInfo) {
      this.onSearchGenealogy()
    }
  }
})
