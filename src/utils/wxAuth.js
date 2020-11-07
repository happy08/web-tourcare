import api from "@/service/api";
import store from "@/store";

const wxAuth = {
    urlencode: function (url) {
        url = url + '';
        return encodeURIComponent(url).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
            replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
    },
    auth: function (uri) {
        const s = store.state.sysInfo.pk
        const appid = store.state.sysInfo.appId
        let redirect_uri = `${api.authToPage}?redirectUrl=${uri}&sysSource=${s}`
        redirect_uri = this.urlencode(redirect_uri)
        const url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect";
        window.location.replace(url);
    }
}

export default wxAuth