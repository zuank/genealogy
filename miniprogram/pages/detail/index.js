//index.js
const app = getApp()

Page({
  data: {
    genealogyInfo:{},
    isPopShow: false,
    _id: ''
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.genealogyId,
      path: `/pages/index/index?genealogyId=${app.globalData.genealogyId}`
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
  },
  onLoad:function(option){
    this.setData({
      _id:option._id
    })
    console.log(option)
    this.getGenealogyInfo()
  },
  getGenealogyInfo(){
    console.log(this)
    wx.cloud.callFunction({
      name:'api',
      data:{
        action:'getGenealogyInfo',
        info:{
          _id:this.data._id
        }
      },
      complete:(res)=>{
        console.log(res)
      }
    })
  }
})
