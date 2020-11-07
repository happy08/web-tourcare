//测试配置
const development = {
	//域名
	DOMAIN_WEB: 'http://leiyong.iok.la/',
	//路径
	DOMAIN_PATH: '',
	//请求地址
	DOMAIN_API: 'http://192.168.2.246:8077/',

	//接口路径
	PATH_API: 'agent-web/',

	// CAR_SERVICE_API: 'http://192.168.2.119:8888/cad.api.service/', // 选择车型组件服务
	// 选择车型服务
	CAR_SERVICE_API: 'https://agent.wlyinfo.com/cad.api.service/',

	//田老板接口
	BASE_API_MINIPROGRAM:'http://192.168.2.119:8083/base-api-miniprogram/',

	//腾讯地图 逆地址解析
	TENCENT_MAP_ADDRESS_API: 'https://apis.map.qq.com/ws/geocoder/v1/',
	//腾讯地图 逆地址解析key
	TENCENT_MAP_ADDRESS_Key: 'JKSBZ-HQI66-DIVSR-EGWFY-2IGOQ-OWBH7',
	//版本
	VERSION_API: '',
	//又拍云图片文件夹名字
	UPYUN_IMAGE_PATH: 'wxAccountImgDev',
	//又拍云视频文件夹名字
	UPYUN_IMAGE_VIDEO: 'wxAccountVideoDev',
	// webSocket URL
	// WEBSOCKETURL:'ws://192.168.2.254:8088',
	// webSocket URL
	// WEBSOCKETURL:'ws://www.haoanda.cn:8088',
	WEBSOCKETURL:'wss://agent.wlyinfo.com/smart/',
	//体验接口
	HAOANDA:'https://www.haoanda.cn/'
}

//线上配置
const production = {
	//域名
	DOMAIN_WEB: 'https://agent.wlyinfo.com/', //http://192.168.2.18:8010/

	//路径
	DOMAIN_PATH: 'agent-accounts',
	
	//请求地址
	DOMAIN_API: 'https://agent.wlyinfo.com/',//https://coupon.mynatapp.cc/   https://agent.wlyinfo.com/

	//接口路径
	PATH_API: 'agent-web/',

	//选择车型服务
	CAR_SERVICE_API: 'https://agent.wlyinfo.com/cad.api.service/',

	//田老板接口
	BASE_API_MINIPROGRAM:'https://cykj.wlyinfo.com/',

	//腾讯地图 逆地址解析
	TENCENT_MAP_ADDRESS_API: 'https://apis.map.qq.com/ws/geocoder/v1/',
	//腾讯地图 逆地址解析key
	TENCENT_MAP_ADDRESS_Key: 'JKSBZ-HQI66-DIVSR-EGWFY-2IGOQ-OWBH7',
	//版本
	VERSION_API: '',
	//又拍云图片文件夹名字
	UPYUN_IMAGE_PATH: 'wxAccountImgDev',
	//又拍云视频文件夹名字
	UPYUN_IMAGE_VIDEO: 'wxAccountVideoDev',
	// webSocket URL
	// WEBSOCKETURL: 'ws://www.haoanda.cn:8088',
	WEBSOCKETURL:'wss://agent.wlyinfo.com/smart/',
	//体验接口
	HAOANDA:'https://www.haoanda.cn/'

}

const isDev = process.env.NODE_ENV === 'development'
let configs = {}
if (isDev) configs = development
else configs = production

//角色列表 0-厂商 1-代理商 2-门店 3-普通车主 4-普通车主关注的门店
export const roleList = { 0: "company", 1: "agent", 2: "store", 3: "member", 4: "member" }


//导出配置
export const config = configs


