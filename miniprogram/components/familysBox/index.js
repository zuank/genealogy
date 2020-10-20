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
      this.triggerEvent('showPop',{},{bubbles:true,composed:true})
      app.globalData.invite.openId = this.data.members.openId
      console.log(app.globalData)
    }
  }
})
