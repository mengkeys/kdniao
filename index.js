const crypto = require('crypto');
const moment = require('moment');
const request = require('request');

//
// { EBusinessID:'xxx', DataType: 2 }

const KDNiao = function (options) {
    // 配置信息
    this.options = {
        DataType: 2,
        sanbox: false,
        debug: false
    };

    Object.assign(this.options, options);
};

// 对请求数据进行处理
KDNiao.prototype._sign = function (data, type) {
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

KDNiao.prototype._request = function (data, options) {
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
KDNiao.prototype.RealTimeQuery = function (params) {
    const options = {
        url: 'http://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx',
        sandbox: 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json',
        type: '1002'
    };
    return this._request(params, options);
};


// 物流跟踪-主动订阅
KDNiao.prototype.TrackSubscribe = function (params) {
    const options = {
        url: 'http://api.kdniao.com/api/dist',
        sanbox: 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json',
        type: '1008'
    };
    return this._request(params, options);
};

// 物流追踪被动推送
KDNiao.prototype.TrackNotify = function (params) {
    const options = {
        url: 'http://api.kdniao.com/api/dist',
        sanbox: 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json',
        type: '1008'
    };
    return this._request(params, options);
};

// 电子面单
KDNiao.prototype.EOrder = function(params) {
    const options = {
        url: 'http://api.kdniao.com/api/EOrderService',
        sandbox: 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json',
        type: '1007'
    };

    return this._request(params, options);
};

// 取消电子面单
KDNiao.prototype.EOrderCancel = function(params) {
    const options = {
        url: 'http://api.kdniao.com/api/EOrderService',
        sandbox: 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json',
        type: '1147'
    };

    return this._request(params, options);
};

// 电子面单余量查询
KDNiao.prototype.EOrderBalanceQuery = function(params) {
    const options = {
        url: 'http://api.kdniao.com/api/EOrderService',
        sandbox: 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json',
        type: '1127'
    };

    return this._request(params, options);
};

// 客户号申请
KDNiao.prototype.EOrderClientNumberApply = function(params) {
    const options = {
        url: 'http://api.kdniao.com/api/EOrderService',
        sandbox: 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json',
        type: '1127'
    };

    return this._request(params, options);
};

// 客户号推送
KDNiao.prototype.EOrderClientNumberNotify = function(params) {
    const options = {
        url: 'http://api.kdniao.com/api/EOrderService',
        sandbox: 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json',
        type: '1127'
    };

    return this._request(params, options);
};

module.exports = KDNiao;
