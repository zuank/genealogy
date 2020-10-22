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
  showPop:function(){
    this.setData({
      isPopShow: true
    })
  },
  closePop:function(){
    this.setData({
      isPopShow: false
    })
  }
})
