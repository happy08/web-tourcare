
import axios from 'axios'
import qs from 'qs'
import router from '@/router'
import store from '@/store'
import toast from "@/components/_global/toast"

// 创建axios实例
let instance = axios.create({
	timeout: 80000,
	withCredentials: true,  // 设置 withCredentials 使请求带上 `cookies`
	headers: {
		"miniprogramRegEx": "miniprogramRegEx",
		"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
	}
});

/** 
 * 请求拦截器 
 * 每次请求前，如果存在token则在请求头中携带token 
 */
window.__axiosPromiseArr = []
instance.interceptors.request.use(
	config => {
		//const token = store.state.token
		//token && (config.headers.token = token)
		config.cancelToken = new axios.CancelToken(cancel => {
			//取消请求存在全局，切换路由时执行
			window.__axiosPromiseArr.push({ cancel })
		})
		return config
	},
	error => Promise.error(error)
)

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
	response => {
		const res = response.data
		if (res.code === 0) { //code=0成功  
			return res
		} else {
			return Promise.reject(res)
		}
	},
	error => {
		const { response } = error;
		if (response) {
			// 请求已发出，但是不在2xx的范围 
			errorHandle(response.status);
			return Promise.reject(response);
		} else {
			// 处理断网的情况
			if (window.__axiosPromiseArr.length !== 0) { //非用户取消
				//tip('网络异常');
				return Promise.reject()
			}
		}
	});


/**
* get方法
* @param {String} url 地址
* @param {Object} params 参数
*/
export function get(url, params) {
	const json = params && params.json //是否请求json文件
	return new Promise((resolve, reject) => {
		(json ? axios : instance).get(url, {
			params: params
		}).then(res => {
			resolve(json ? res.data : res);
		}).catch(err => {
			reject(err)
		})
	})
}

/** 
 * post方法
 * @param {String} url 地址
 * @param {Object} params 参数
 * @param {Boolean} json json/formData格式
 */
export function post(url, param, json) {
	return new Promise((resolve, reject) => {
		let errMsg = ""
		let params = param || {}
		if (!!json) { //json格式
			errMsg = params.errMsg
			const sysSource = store.state.sysInfo.pk || params.sysSource
			const userPk = store.state.user.pk

			errMsg === false ? delete params.errMsg : ""
			params.sysSource = sysSource
			params.userPk = userPk
		}

		instance.post(url, !!json ? qs.stringify(params) : params)
			.then(res => {
				resolve(res);
			})
			.catch(err => {
				if (errMsg !== false) { //错误不提示
					err && err.msg && tip(err.msg)
				}
				err && reject(err)
			})
	})
}


//提示
const tip = (msg, duration = 5000) => {
	toast(msg, {
		duration: duration
	})
}

/** 
 * 跳转登录页
 * 携带当前页面路由，在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
	router.currentRoute.fullPath && store.commit('setRedirectUrl', router.currentRoute.fullPath);
	router.replace({
		path: '/auth/index'
	})
}

/** 
 * 请求失败后的错误统一处理 
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status) => {
	switch (status) {
		// 401: 未登录状态，跳转登录页
		case 401: toLogin(); break
		case 403:
			tip('登录过期，请重新登录');
			store.commit('setUser', ""); // 清除token并跳转登录页
			setTimeout(() => { toLogin() }, 1000);
			break
		case 404: tip('请求的资源不存在'); break
		case 408: tip('请求超时'); break
		case 500: tip('服务器错误'); break
		case 501: tip('服务未实现'); break
		case 502: tip('网络错误'); break
		case 503: tip('服务不可用'); break
		case 504: tip('网络超时'); break
		case 505: tip('HTTP版本不受支持'); break
		default: tip(`连接出错(${status})!`);
	}
}

//export default instance
