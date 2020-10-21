// components/identityPopBox/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    activeIndex:'',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close(){
      this.triggerEvent('closePop',{},{bubbles:true,composed:true})
    },
    shareInvite(e){
      this.setData({
        activeIndex:e.currentTarget.dataset.type
      })
    },
    addNode(){
      wx.cloud.callFunction({
        name:'genealogy',
        data:{
          action:'addNode',
          type:this.activeIndex,
          genealogyId:app.globalData.genealogyId,
          openId:app.globalData.chooseOpenId,
        },
        complete:(res)=>{

        }
      })
    }
  }
})
