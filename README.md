# [快递鸟](http://www.kdniao.com) NodeJS 非官方模块

[![npm package](https://nodei.co/npm/wechat-message-client.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/wechat-message-client/)


## 链接
- [快递鸟官方网站](http://www.kdniao.com)
- [快递鸟接口文档](http://www.kdniao.com/api-all)

## 安装

```shell
npm install kdniao -S
```

## 使用
```js
const KDNiaoService = require('kdniao');

const client = new KDNiaoService({
    EBusinessID: 'xxx',
    AppKey: 'xxx',
    sandbox: true,
    debug: true
});

client.RealTimeQuery({
    ShipperCode: 'xxx',
    LogisticCode: 'xxx'
}).then((result) => {
    console.log(result)
}).catch((error) => {
    console.error(error)
})
```

## 接口
| 序号 | 接口 | 功能 |
| --- | --- | --- |
|  1  | RealTimeQuery | 即时查询 |
|  2  | TrackSubscribe | 物流追踪-订阅接口 |
|  3  | TrackNotify | 物流追踪-推送接口 |
|  3  | EOrder | 电子面单接口 |
|  3  | EOrderCancel | 电子面单取消接口 |
|  3  | EOrderBalanceQuery | 电子面单余量查询接口 |
|  3  | EOrderClientNumberApply | 电子面单客户号申请接口 |
|  3  | EOrderClientNumberNotify | 电子面单客户号推送接口 |
注: 模块仅实现基本通讯功能,使用模块时请参考[快递鸟官方接口文档](http://www.kdniao.com/api-all)传参及返回处理。





