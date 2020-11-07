/** 常用
*/

const utils = {

    /** 跳转
    * @param url:string 链接
    * @param $router:obj
    */
    go(url, $router) {
        if (/^javas/.test(url) || !url) return
        const useRouter = typeof url === 'object' || ($router && typeof url === 'string' && !/http/.test(url))
        if (useRouter) {
            if (typeof url === 'object' && url.replace === true) {
                $router.replace(url)
            } else {
                url === 'BACK' ? $router.go(-1) : $router.push(url)
            }
        } else {
            window.location.href = url
        }
    },

    // 获取 URL 参数
    getUrlParams: function (p) {
        var str = window.location.href;
        var objURL = {};
        str.replace(
            new RegExp("([^?=&]+)(=([^&]*))?", "g"),
            function ($0, $1, $2, $3) {
                objURL[$1] = $3;
            }
        );
        if (p) { return objURL[p] || '' }
        return objURL;
    },

    //删除某个url参数
    urlDelParams(url,name){
        var urlArr = url.split('?');
        if(urlArr.length>1 && urlArr[1].indexOf(name)>-1){
            var query = urlArr[1];
            var obj = {}
            var arr = query.split("&");
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].split("=");
                obj[arr[i][0]] = arr[i][1];
            };
            delete obj[name];
            var urlte = urlArr[0] +'?'+ JSON.stringify(obj).replace(/[\"\{\}]/g,"").replace(/\:/g,"=").replace(/\,/g,"&");
            return urlte;
        }else{
            return url;
        };
    }


}
export default utils