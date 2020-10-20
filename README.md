# 云开发 全民家谱

这是云开发的在线家谱查看工具

## 1.0

- ✅ 数据库结构设计
- ✅ 页面结构设计
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
      "gender":1,
      "language":"zh_CN",
      "city":"Suzhou",
      "province":"Jiangsu",
      "country":"China",
      "avatarUrl":"",
      "companion":{
        "avatarUrl":"",
        "nickName":"伴侣"
        },
      "members":[]
    }
  }
  ```
