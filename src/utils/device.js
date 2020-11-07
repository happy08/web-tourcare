/** 判断pc 移动 iso android 设备平台
   * @param
   */
const device = () => {
    let browser = {
        versions: function () {
            let u = navigator.userAgent
            //let app = navigator.appVersion
            return {         //移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1//是否web程序，没有头部与底部
            }
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
    let agent = navigator.userAgent.toLowerCase();//获取判断用的对象
    if (browser.versions.mobile) {//判断是否是移动设备打开。browser代码在下面
        if (agent.match(/MicroMessenger/i) === "micromessenger") {
            //判断是否在微信打开
            if (browser.versions.android) {
                //安卓端微信
                return 'wehatAndroid'
            } else if (browser.versions.ios) {
                //ios端微信
                return 'wechatIOS'
            } else {
                return 'wechat'
            }
            // 判断是ios还是安卓
        } else if (browser.versions.android) {
            //安卓
            return 'Android'
        } else if (browser.versions.ios) {
            //ios
            return 'ios'
        } else {
            return 'wp'
        }
    } else {
        //PC
        let isMac = /macintosh|mac os x/i.test(navigator.userAgent)
        if (isMac) {
            return 'isMac'
        }
        if (agent.indexOf("win32") >= 0 || agent.indexOf("wow32") >= 0) {
            return 'win32';
        }
        if (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0) {
            return 'win64';
        }
    }
}
export default device;