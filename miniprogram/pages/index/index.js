//index.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    genealogyInfo:{},
    ready: false,
    hasAuth: true,
    isPopShow: false,
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.genealogyId,
      path: `/page/index?genealogyId=${app.globalData.genealogyId}`
    }
  },

  onLoad: function() {
    // 获取授权信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.setData({
            hasAuth: true
          })
          console.log(this,res)
          this.onSearchGenealogy()
        }
      }
    })
  },
  showPop:function(){
    this.setData({
      isPopShow: true
    })
  },
  closePop:function(){
    this.setData({
      isPopShow: false
    })
  },
  // 查询家谱
  onSearchGenealogy: function() {
    wx.cloud.callFunction({
      name:'genealogy',
      data:{
        action:'search'
      },
      complete:(res)=>{
        console.log(res)
        console.log(JSON.stringify(res.result.userInfo),'999',JSON.stringify(res.result.genealogyInfo))
        this.setData({
          userInfo: res.result.userInfo,
          genealogyInfo: res.result.genealogyInfo,
          ready: true
        })
        app.globalData.genealogyId = res.result.genealogyInfo._id
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
