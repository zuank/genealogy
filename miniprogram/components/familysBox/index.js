// components/familyBox/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    members:{
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    setBaseUser:function() {
      app.globalData.userId = this.data.members.openId||this.data.members.tempId
      app.globalData.IDType = this.data.members.openId?"openId":'tempId'
      this.triggerEvent('showPop',{},{bubbles:true,composed:true})
    }
  }
})
