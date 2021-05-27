// miniprogram/pages/index/index.js
import {request} from "../../utils/request";

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    hasAuth:false,
    loading:true,
    inviteInfo:{
      genealogyId:'',
      userId:'',
      joined:false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    this.setData({
      inviteInfo:{
        genealogyId:option.genealogyId,
        userId:option.userId,
        joined:false
      }
    })
    // 获取授权信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.setData({
            hasAuth: true
          })
          this.init()
        } else {
          this.setData({
            loading: false
          })
        }
      }
    })
  },
  // 初始化
  init(){
    if (this.data.inviteInfo.userId&&!this.data.inviteInfo.joined) {
      this.joinGenealogy(this.data.inviteInfo.genealogyId,this.data.inviteInfo.userId)
    } else {
      this.getUserInfo()
    }
  },
  // 获取授权
  onGetAuth(e){
    if (e.detail.userInfo) {
      this.getUserInfo()
    }
  },
  // 查询家谱
  async getUserInfo() {
    const res = await request({
      action:'getUserInfo'
    })
    this.setData({
      userInfo: res.result,
      loading: false
    })
  },
  //加入家谱
  joinGenealogy(genealogyId,userId){
    wx.getUserInfo({
      success: async (res)=> {
        await request({
          action:'joinGenealogy',
          info:{
            genealogyId,
            userId,
            userInfo:{
              nickName:res.userInfo.nickName,
              avatarUrl:res.userInfo.avatarUrl,
            }
          },
        })
        this.setData({
          inviteInfo:{
            ...this.data.inviteInfo,
            joined:true,
          }
        })
        this.init()
      }
    })
  },
  //新建家谱
  onAddGenealogy: function(e) {
    wx.cloud.callFunction({
      name:'api',
      data:{
        action:'addGenealogy',
        userInfo:{
          nickName:e.detail.userInfo.nickName,
          avatarUrl:e.detail.userInfo.avatarUrl,
        }
      },
      complete:(res)=>{
        console.log(res)
        this.setData({
          userInfo: res.result,
        })
      }
    })
  },
  // 跳转到家谱详情
  jumpDeatil(e){
    wx.navigateTo({
      url:`/pages/detail/index?_id=${e.currentTarget.dataset.id}`
    })
  }
})