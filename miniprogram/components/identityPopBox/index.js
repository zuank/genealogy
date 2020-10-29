// components/identityPopBox/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    genealogyId:{
      type:String
    }
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
      console.log(this.options)
      wx.cloud.callFunction({
        name:'api',
        data:{
          action:'addNode',
          info:{
            type:this.data.activeIndex,
            genealogyId:this.data.genealogyId,
            openId:app.globalData.chooseOpenId,
          }
        },
        complete:(res)=>{

        }
      })
    }
  }
})
