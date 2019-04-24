const crypto = require('crypto');
const moment = require('moment');
const request = require('request');

//
// { EBusinessID:'xxx', DataType: 2 }

const KDNiaoService = function (options) {
    // 配置信息
    this.options = {
        DataType: 2,
        sanbox: false,
        debug: false
    };

    Object.assign(this.options, options);
};

// 对请求数据进行处理
KDNiaoService.prototype._sign = function (data, type) {
    let sign = "";
    let str  = JSON.stringify(data);
    // MD5编码
    let hash = crypto.createHash('md5');
    hash.update(str);
    hash.update(this.options.AppKey);
    sign = hash.digest('hex');
    // BASE64编码
    sign = Buffer.from(sign).toString("base64");

    const params =  {
        DataSign:    encodeURIComponent(sign),
        RequestType: type, // (接口编号)
        RequestData: str,
        DataType:    this.options.DataType,
        EBusinessID: this.options.EBusinessID
    };

    if(this.options.debug) {
        console.log('==========数据签名==========');
        console.log(sign);
        console.log('==========请求数据==========');
        console.log(params);
    }
    return params;
};


// 发送请求
// options: { type: '', url: ''}

KDNiaoService.prototype._request = function (data, options) {
    const url  = this.sandbox ? options.sandbox : options.url;
    const form = this._sign(data, options.type);
    return new Promise((resolve, reject) => {
        request.post({url: url, form: form}, (err, httpResponse, body) => {
            if(err) {
                reject(err);
            }
            else {
                try {
                    resolve(JSON.parse(body));
                }
                catch(err) {
                    reject(err);
                }
            }
        });
    });
};


// 即时查询
KDNiaoService.prototype.RealTimeQuery = function (params) {
    const options = {
        url: 'http://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx',
        sandbox: 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json',
        type: '1002'
    };
    return this._request(params, options);
};


// 物流跟踪-主动订阅
KDNiaoService.prototype.TrackSubscribe = function (params) {
    const options = {
        url: 'http://api.kdniao.com/api/dist',
        sanbox: 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json',
        type: '1008'
    };
    return this._request(params, options);
};

// 物流追踪被动推送
KDNiaoService.prototype.TrackNotify = function (params) {
    const options = {
        url: 'http://api.kdniao.com/api/dist',
        sanbox: 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json',
        type: '1008'
    };
    return this._request(params, options);
};

// 电子面单
KDNiaoService.prototype.EOrder = function(params) {
    const options = {
        url: 'http://api.kdniao.com/api/EOrderService',
        sandbox: 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json',
        type: '1007'
    };

    return this._request(params, options);
};

// 取消电子面单
KDNiaoService.prototype.EOrderCancel = function(params) {
    const options = {
        url: 'http://api.kdniao.com/api/EOrderService',
        sandbox: 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json',
        type: '1147'
    };

    return this._request(params, options);
};

// 电子面单余量查询
KDNiaoService.prototype.EOrderBalanceQuery = function(params) {
    const options = {
        url: 'http://api.kdniao.com/api/EOrderService',
        sandbox: 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json',
        type: '1127'
    };

    return this._request(params, options);
};

// 客户号申请
KDNiaoService.prototype.EOrderClientNumberApply = function(params) {
    const options = {
        url: 'http://api.kdniao.com/api/EOrderService',
        sandbox: 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json',
        type: '1127'
    };

    return this._request(params, options);
};

// 客户号推送
KDNiaoService.prototype.EOrderClientNumberNotify = function(params) {
    const options = {
        url: 'http://api.kdniao.com/api/EOrderService',
        sandbox: 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json',
        type: '1127'
    };

    return this._request(params, options);
};

// 物流跟踪-异步推送（回调）接口
// KDNiaoService.prototype.notify = (orders) => {
//     let data = {};
//
//     const options = {
//       type: '',
//       url: ''
//     };
//
//     data.PushTime = moment().format('YYYY-MM-DD hh-mm-ss');
//     data.data = orders.map(it => ({
//         ShipperCode: it.ShipperCode,
//         LogisticCode: it.LogisticCode
//     }));
//     data.count = data.data.length;
//     data.EBusinessID = this.options.EBusinessID;
//     return this._request(data, options);
// };

// 电子面单,包含(创建,取消,余量,
// CreateEOrderService(order, options = {}) {
//
//     let data = {};
//
//     const data = {
//
//         ShipperCode: order.ShipperCode,  // 快递公司代码
//         OrderCode:   order.OrderCode,    // 订单号
//         PayType:     order.PayType,      // 1:现付,2:到付,3:月结,4:第三方
//         ExpType:     order.ExpType,      // 1:标准快件
//         Receiver: {
//             Name: '',
//             Mobile: '',
//             ProvinceName: '',
//             CityName: '',
//             ExpAreaName: '',
//             Address: '',
//         },
//         Sender: {
//             Name: '和江龙',
//             Mobile: '13688771387',
//             ProvinceName: '云南省',
//             CityName: '丽江市',
//             ExpAreaName: '玉龙县',
//             Address: '黄山镇嘉乐建材城三号门文锦苑1栋102商铺'
//         },
//         Quantity: '1',
//         Commodity: [
//             {
//                 GoodsName: '',     // 商品名称
//                 GoodsCode: '',     // 商品代码(必填)
//                 Goodsquantity: '', // 商品数量
//                 GoodsPrice: '',    // 商品价格
//                 GoodsDesc: ''      // 描述（用户备注）
//             }
//         ]
//     };
// }

module.exports = KDNiaoService;
