// components/identityPopBox/index.js
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    close(){
      this.triggerEvent('closePop',{},{bubbles:true,composed:true})
    },
    shareInvite(e){
      console.log(e.currentTarget.dataset.type)
    }
  }
})
