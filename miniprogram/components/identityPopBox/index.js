// components/identityPopBox/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    genealogyId:{
      type:String
    },
    popConfig:{
      type:Object,
      value:{
        canAddParents:false,
        canAddSons:true,
        canAddCompanion:false,
        canInvite:false
      }
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
    invite(){
      this.triggerEvent('invite',{},{bubbles:true,composed:true})
    },
    close(){
      this.triggerEvent('closePop',{},{bubbles:true,composed:true})
    },
    changeIndex(e){
      this.setData({
        activeIndex:e.currentTarget.dataset.type
      })
    },
    addNode(){
      wx.cloud.callFunction({
        name:'api',
        data:{
          action:'addNode',
          info:{
            type:this.data.activeIndex,
            genealogyId:this.data.genealogyId,
            userId:app.globalData.userId,
            IDType:app.globalData.IDType||"openId"
          }
        },
        complete:(res)=>{
          this.triggerEvent('complete')
        }
      })
    }
  }
})
