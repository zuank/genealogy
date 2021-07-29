const app = getApp();
//Component Object
Component({
  properties: {
    myProperty:{
      type:String,
      value:'',
      observer: function(){}
    },

  },
  data: {
    active: 0,
  },
  methods: {
    onChange(event){
      this.setData({ active: event.detail });
    }
  },
  created: function(){

  },
  attached: function(){

  },
  ready: function(){

  },
  moved: function(){

  },
  detached: function(){

  },
});