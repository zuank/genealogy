export function request(data){
    return new Promise((resolve, reject)=>{
        wx.showLoading()
        wx.cloud.callFunction({
            name:'api',
            data:data,
            complete:(res)=>{
                wx.hideLoading()
                resolve(res)
            }
        })
    })
}