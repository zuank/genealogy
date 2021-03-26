# 云开发 全民家谱

这是云开发的在线家谱查看工具

## 1.0

- ✅ 一个用户可以创建多个家谱
- ✅ 可以先生成节点再邀请微信好友
- ⬜️ 邀请伴侣加入家谱中
 
## 数据库

- 家谱表

  ``` json
  { 
    "_id":"",             // 记录ID
    "creator":"",         // OPENID
    "name":"幸福一家人",    // 家谱名称
    "members":{           // 成员
      "nickName":"油条子", // 家族顶点昵称 
      "avatarUrl":"",
      "companion":{
        "avatarUrl":"",
        "nickName":"伴侣"
        },
      "members":[]
    }
  }
  ```
