import sha1 from './sha1.min.js'
import api from '@/service/api'
import store from "@/store";


// 微信api常用方法
export default {

    // // 产生随机数，len：长度
    // getUUID: (len) => {
    //     len = len || 6
    //     len = parseInt(len, 10)
    //     len = isNaN(len) ? 6 : len
    //     const seed = '0123456789abcdefghijklmnopqrstubwxyzABCEDFGHIJKLMNOPQRSTUVWXYZ'
    //     const seedLen = seed.length - 1
    //     let uuid = ''
    //     while (len--) {
    //         uuid += seed[Math.round(Math.random() * seedLen)]
    //     }
    //     return uuid
    // },

    //微信签名配置
    async wxaccountConfig(callback) {
        try {
            const url = window.location.href.split("#")[0]; //"http://coupon.mynatapp.cc/agent-accounts/"
            const res = await api.wxaccountConfig({ url: url })
            if (!!res && !!res.obj) {
                this.settingWechat(
                    res.obj.appId,
                    res.obj.nonceStr,
                    res.obj.jsapi_ticket,
                    res.obj.timestamp,
                    url,
                    callback
                );
            }
        } catch (err) { }
    },

    /**
     * 微信等分享接口前的设置调用
     * @param {any} appid 公众号的openid
     * @param {any} noncestr 用accesst_token获取的noncestr
     * @param {any} ticket 用accesst_token获取的ticket
     * @param {any} timestamp 时间戳
     * @param {any} callback 回调函数，放置分享等设置
     */
    settingWechat: (appId, nonceStr, ticket, timestamp, url, callback) => {
        let full = 'jsapi_ticket=' + ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url // 拼接jsapi_ticket
        let shaValue = sha1(full) // 使用sha1加密jsapi_ticket
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId, // 必填，公众号的唯一标识
            timestamp, // 必填，生成签名的时间戳
            nonceStr, // 必填，生成签名的随机串
            signature: shaValue, // 必填，签名，见附录1
            jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'openLocation', 'getLocation', 'previewImage', 'chooseWXPay', 'showMenuItems', 'hideAllNonBaseMenuItem', 'chooseImage'] //,'hideMenuItems', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone','scanQRCode', 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        wx.ready(() => {
            callback && callback()
        })
    },
    /**
     * 微信扫一扫
     * @param {any} callback 用户扫码之后的回调
     */
    // sweepYard: (callback) => {
    //     wx.scanQRCode({
    //         desc: 'scanQRCode desc',
    //         needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    //         scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
    //         success: (res) => {
    //             return callback(res)
    //         },
    //         cancel: () => {
    //             
    //         }
    //     });
    // },  
}


const wxMenuShare = (option) => {
    const link = `${window.location.href.split('?')[0]}${option.link}&shareUserPk=${store.state.user.pk}&sysSource=${store.state.sysInfo.pk}`
    //分享给朋友
    wx.onMenuShareAppMessage({
        title: option.title, // 分享标题
        desc: option.desc, // 分享描述
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: option.imgUrl, // 分享图标
        type: option.type || 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: option.dataUrl || '', // 如果type是music或video，则要提供数据链接，默认为空
        success: () => {
            option.success && option.success()
        },
        cancel: () => {
            option.cancel && option.cancel()
        },
        fail: () => {
            option.fail && option.fail()
        }
    });
    //分享到朋友圈
    wx.onMenuShareTimeline({
        title: option.title,
        link: link,
        imgUrl: option.imgUrl,
        success: () => {
            option.success && option.success()
        },
        cancel: () => {
            option.cancel && option.cancel()
        },
        fail: () => {
            option.fail && option.fail()
        }
    });
    // //分享到QQ
    // wx.onMenuShareQQ({
    //     title: option.title,
    //     desc: option.desc,
    //     link: link,
    //     imgUrl: option.imgUrl,
    //     success: ()=> {
    //         option.success && option.success()
    //     },
    //     cancel: () => {
    //         option.cancel && option.cancel()
    //     },
    //     fail: () => {
    //         option.fail && option.fail()
    //     }
    // });
    // //分享到腾讯微博
    // wx.onMenuShareWeibo({
    //     title: option.title,
    //     desc: option.desc,
    //     link: link,
    //     imgUrl: option.imgUrl,
    //     success: () => {
    //         option.success && option.success()
    //     },
    //     cancel: () => {
    //         option.cancel && option.cancel()
    //     },
    //     fail: () => {
    //         option.fail && option.fail()
    //     }
    // });
    // //分享到QQ空间
    // wx.onMenuShareQZone({
    //     title: option.title,
    //     desc: option.desc,
    //     link: link,
    //     imgUrl: option.imgUrl,
    //     success: () => {
    //         option.success && option.success()
    //     },
    //     cancel: () => {
    //         option.cancel && option.cancel()
    //     },
    //     fail: () => {
    //         option.fail && option.fail()
    //     }
    // });
}
export {
    wxMenuShare
}