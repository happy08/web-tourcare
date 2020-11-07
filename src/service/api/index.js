/**
 * api接口统一出口
 */
import { config } from '../config'; // 导入配置
import { get, post } from '../axios';

let url = config.DOMAIN_API + config.PATH_API + config.VERSION_API,
	haoanda = config.HAOANDA
const isDev = process.env.NODE_ENV === 'development'
//跨域代理
if (isDev) {
	url = '/api/';
	haoanda = '/apc/';
}

const api = {
	config,   //配置信息

	//获取短信验证码
	sendSMS: (params) => post(`${url}wxaccount/wx.user/sendSMS`, params, true),

	//获取系统信息
	findAppCheckTypeInfo: (params) => post(`${url}app/common.check.type/findAppCheckTypeInfo`, params, true),

	// 上传
	getUpyunToken: (params) => post(`${url}app/upload/getToken`, params, true), // 获取又拍云上传文件的token
	scanVinCode: (params) => post(`${config.CAR_SERVICE_API}fileService/recognitionImage`, params, false), // 上传图片识别VIN码

	//签名
	wxaccountConfig: (params) => post(`${url}wxaccount/config`, params, true),

	//获取海报二维码
	posterQrCode: (params) => post(`${url}wxaccount/wx.project/posterQrCode`, params, true),

	//授权
	authToPage: `${url}wxaccount/toPage`,//授权地址 跳转 #号问题 #=JINHAO  ?=WENHAO  &=AND  '='=DENGYU
	auth: (params) => post(`${url}wxaccount/redirect`, params, true),//网页授权
	login: (params) => post(`${url}wxaccount/login`, params, true),//登录

	//绑定手机号
	addPhone: (params) => post(`${url}wxaccount/wx.user/addPhone`, params, true),//绑定手机号
	untiePhone: (params) => post(`${url}wxaccount/wx.user/untiePhone`, params, true),//解绑手机号
	sysorganizationGet: (params) => post(`${url}miniprogram/sysorganization/get`, params, true),//绑定手机轮播图
	findCommonConfigList: (params) => post(`${url}miniprogram/commonConfig/findCommonConfigList`, params, true),//绑定手机轮播图


	//用户
	getAccountsUser: (params) => post(`${url}wxaccount/wx.user/getAccountsUser`, params, true),//获取会员信息
	getAccountsUserAndRole: (params) => post(`${url}wxaccount/wx.user/getAccountsUserAndRole`, params, true),//获取会员及角色信息
	updateUserInfo: (params) => post(`${url}wxaccount/wx.user/updateUserInfo`, params, true),//修改会员信息
	addOrUpdateUserCar: (params) => post(`${url}wxaccount/wx.user/addOrUpdateUserCar`, params, true),//新增或修改车辆
	getUserCarList: (params) => post(`${url}wxaccount/wx.user/getUserCarList`, params, true),//获取用户车辆	

	//健康接力	
	getOrderNotice: (params) => post(`${url}wxaccount/wx.project/getOrderNotice`, params, true),//获取轮播购买，转发，浏览的用户
	getIncome: (params) => post(`${url}wxaccount/wx.project/getIncome`, params, true),//收益统计
	saveOrUpdateMpAccessRecords: (params) => post(`${url}wxaccount/wx.project/saveOrUpdateMpAccessRecords`, params, true),//获取用户是否首次访问该页面
	getProject: (params) => post(`${url}wxaccount/wx.project/getProject`, params, true),//获取项目详情
	getProjectOtherData: (params) => post(`${url}wxaccount/wx.project/getProjectOtherData`, params, true),//获取项目详情其他参数
	getRealData: (params) => post(`${url}wxaccount/wx.project/getRealData`, params, true),//获取项目真实统计数据
	buyProject: (params) => post(`${url}wxaccount/wx.project/buyProject`, params, true),//购买项目
	getRankList: (params) => post(`${url}wxaccount/wx.project/getRankList`, params, true),//获取排名列表
	useStoresByShareNew: (params) => post(`${url}wxaccount/wx.project/useStoresByShareNew`, params, true),//可用门店(分享)
	addOrUpdateRelation: (params) => post(`${url}wxaccount/wx.user.relation/addOrUpdateRelation`, params, true),//新增或更新关注代理商信息
	getUserRelationListByPage: (params) => post(`${url}wxaccount/wx.user.relation/getUserRelationListByPage`, params, true),//获取用户关注列表
	getOrderList: (params) => post(`${url}wxaccount/wx.project/getOrderList`, params, true),//获取购买订单的用户

	//申请体验
	applyExperience: (params) => post(`${url}wxaccount/wx.experience/applyExperience`, params, true),//申请体验
	saveEvaluateExperience: (params) => post(`${url}wxaccount/wx.experience/saveEvaluateExperience`, params, true),//评价体验
	getExperienceReport: (params) => post(`${url}wxaccount/wx.experience/getExperienceReport`, params, true),//获取用户体验报告
	getExperienceMember: (params) => post(`${url}wxaccount/wx.experience/getExperienceMember`, params, true),//体验车主列表
	getApplyExperienceInfo: (params) => post(`${url}wxaccount/wx.experience/getApplyExperienceInfo`, params, true),//申请体验详情


	//我的数据
	getAgentList: (params) => post(`${url}wxaccount/wx.project.report/getAgentList`, params, true),//获取服务商/代理商

	shareReport: (params) => post(`${url}wxaccount/wx.project.report/shareReport`, params, true),//分享效果报表
	shareDetail: (params) => post(`${url}wxaccount/wx.project.report/shareDetail`, params, true),//分享效果详情
	hzData: (params) => post(`${url}wxaccount/wx.project.report/hzData`, params, true),//汇总数据
	getIdleEquipmentList: (params) => post(`${url}wxaccount/wx.project.report/getIdleEquipmentList`, params, true),//闲置设备列表

	storeRegion: (params) => post(`${url}wxaccount/wx.project.report/storeRegion`, params, true),//门店分布
	getAddressList: (params) => post(`${url}wxaccount/wx.user/getAddressList`, params, true),//地址集合
	getStoreRegionXY: (params) => post(`${url}wxaccount/wx.project.report/getStoreRegionXY`, params, true),//获取门店分布经纬度

	czRank: (params) => post(`${url}wxaccount/wx.project.report/czRank`, params, true),//车主排行榜
	mdRankNew: (params) => post(`${url}wxaccount/wx.project.report/mdRankNew`, params, true),//门店排行榜
	agentRank: (params) => post(`${url}wxaccount/wx.project.report/agentRank`, params, true),//经营排行榜

	//个人中心
	getMyPersonalCenter: (params) => post(`${url}wxaccount/wx.share/getMyPersonalCenter`, params, true),//个人中心统计
	updateScanCount: (params) => post(`${config.BASE_API_MINIPROGRAM}cashierQrCodeManage/updateScanCount`, params, true),//更新扫码次数

	//设备
	getEquipmentInfo: (params) => post(`${url}wxaccount/wx.equipment/getEquipmentInfo`, params, true),//获取设备信息
	activationEquipment: (params) => post(`${url}wxaccount/wx.equipment/activationEquipment`, params, true),//激活设备
	getEquipmentInviteQRCode: (params) => post(`${url}wxaccount/wx.equipment/getEquipmentInviteQRCode`, params, true),//生成邀请同事二维码
	getEquipmentInviteInfo: (params) => post(`${url}wxaccount/wx.equipment/getEquipmentInviteInfo`, params, true),//获取邀请同事参数
	joinEquipmentInviteGroup: (params) => post(`${url}wxaccount/wx.equipment/joinEquipmentInviteGroup`, params, true),//加入邀请设备组

	//订阅设置
	getSubscribeDataList: (params) => post(`${url}wxaccount/wx.subscribe/getSubscribeDataList`, params, true),//获取订阅配置列表
	getSubscribeDataDetailList: (params) => post(`${url}wxaccount/wx.subscribe/getSubscribeDataDetailList`, params, true),//获取用户订阅配置
	saveOrUpdateDataList: (params) => post(`${url}wxaccount/wx.subscribe/saveOrUpdateDataList`, params, true),//提交用户订阅运营数据
	addOrUpdateUserRole: (params) => post(`${url}wxaccount/wx.user/addOrUpdateUserRole`, params, true),//增加或修改用户最新使用角色

	//消息提醒
	getUserMsgInit: (params) => post(`${url}wxaccount/wx.user/getUserMsgInit`, params, true),//获取消息默认配置
	getUserMsgInstall: (params) => post(`${url}wxaccount/wx.user/getUserMsgInstall`, params, true),//获取用户消息提醒配置
	getServiceExpired: (params) => post(`${url}wxaccount/wx.user/getServiceExpired`, params, true),//获取服务到期提醒配置
	saveOrUpdateUserMsgInstall: (params) => post(`${url}wxaccount/wx.user/saveOrUpdateUserMsgInstall`, params, true),//修改服务到期提醒配置

	//我的分享
	getMyShare: (params) => post(`${url}wxaccount/wx.share/getMyShare`, params, true),//我的分享
	getMyShareDetail: (params) => post(`${url}wxaccount/wx.share/getMyShareDetail`, params, true),//分享详情
	getMyShareStatistical: (params) => post(`${url}wxaccount/wx.share/getMyShareStatistical`, params, true),//我的分享 统计数据
	addOrUpdateMyShare: (params) => post(`${url}wxaccount/wx.share/addOrUpdateMyShare`, params, true),//新增修改浏览记录
	updateBuyOrForwardStatus: (params) => post(`${url}wxaccount/wx.share/updateBuyOrForwardStatus`, params, true),//修改转发次数或购买次数
	getMyShareFunnel: (params) => post(`${url}wxaccount/wx.share/getMyShareFunnel`, params, true),//我的分享-漏斗

	//评价
	findAllEvaluateProject: (params) => post(`${url}wxaccount/wx.project/findAllEvaluateProject`, params, true),//全部评价
	findEvaluateProject: (params) => post(`${url}wxaccount/wx.project/findEvaluateProject`, params, true),//查看评价
	saveEvaluateProject: (params) => post(`${url}wxaccount/wx.project/saveEvaluateProject`, params, true),//提交评价
	getEvaluateList: (params) => post(`${url}wxaccount/wx.project/getEvaluateList`, params, true),//获取评价标签

	//案例
	queryUseCaseNew: (params) => post(`${url}miniprogram/useCaseService/queryUseCaseNew`, params, true),//施工案例

	//订单
	getProjectListByGroup: (params) => post(`${url}wxaccount/wx.project/getProjectListByGroup`, params, true),//获取订单列表
	writeOffProject: (params) => post(`${url}wxaccount/wx.project/writeOffProject`, params, true),//核销
	creatCheckCode: (params) => post(`${url}wxaccount/wx.project/creatCheckCode`, params, true),//生成校验码
	startEquipmentForCheck: (params) => post(`${url}wxaccount/wx.project/startEquipmentForCheck`, params, true),//校验校验码
	useStoresDetails: (params) => post(`${url}wxaccount/wx.project/useStoresDetails`, params, true),//门店详情
	useStores: (params) => post(`${url}wxaccount/wx.project/useStores`, params, true),//可用门店

	// 车型查询
	getHotCarBrandList: (params) => post(`${config.CAR_SERVICE_API}cadApiService/queryHotBrandName`, params, true), // 查询热门品牌列表
	getCarBrandList: (params) => post(`${config.CAR_SERVICE_API}cadApiService/queryAllBrandName`, params, true), // 查询品牌列表
	getCarLineList: (params) => post(`${config.CAR_SERVICE_API}cadApiService/queryClazzNameByBrandName`, params, true), // 根据品牌查询车系
	getCarTypeList: (params) => post(`${config.CAR_SERVICE_API}carTypeService/queryCarType`, params, true), // 根据车系查车型
	getCarYearList: (params) => post(`${config.CAR_SERVICE_API}carTypeService/queryYearStyle`, params, true), // 根据车系查年款
	getCarSweptVolume: (params) => post(`${config.CAR_SERVICE_API}carTypeService/querySweptVolume`, params, true), // 根据车系查排量

	queryCadDataByVinCode: (params) => post(`${config.CAR_SERVICE_API}cadApiService/queryCadDataByVinCode`, params, true), // vin 查车型, 不限次数(checkTimes: true)

	//体验 
	getEquipmentByUser: (params) => post(`${haoanda}weixin/manage/getEquipmentByUser`, params, true),//获取设备列表的接口
	getExperienceStatus: (params) => post(`${url}wxaccount/wx.experience/getExperienceStatus`, params, true),//获取体验状态
	getExperienceReport: (params) => post(`${url}wxaccount/wx.experience/getExperienceReport`, params, true),//获取用户体验报告
}

export default api
