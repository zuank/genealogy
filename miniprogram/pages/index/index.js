// miniprogram/pages/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    hasAuth:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    // 获取授权信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.setData({
            hasAuth: true
          })
          this.getUserInfo()
        }
      }
    })
  },
  // 获取授权
  onGetAuth(e){
    if (e.detail.userInfo) {
      this.getUserInfo()
    }
  },
  // 查询家谱
  getUserInfo: function() {
    wx.cloud.callFunction({
      name:'api',
      data:{
        action:'getUserInfo'
      },
      complete:(res)=>{
        console.log(res)
        this.setData({
          userInfo: res.result,
        })
        app.globalData.userInfo = res.result
      }
    })
  },
  //新建家谱
  onAddGenealogy: function(e) {
    wx.cloud.callFunction({
      name:'api',
      data:{
        action:'addGenealogy',
        userInfo:e.detail.userInfo
      },
      complete:(res)=>{
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})