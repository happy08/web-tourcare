<!--健康接力 @touchstart.stop="touchstart"-->
<template>
    <div class="share-money bg-grey">
        <div class="share-nav">
            <div class="item" v-if="project.backgroundMusicUrl">
                <!--背景音乐 -->
                <music
                    :src="project.backgroundMusicUrl"
                    :play="musicPlay"
                    @change="onChangeMusicStatus"
                />
            </div>
            <div class="item" v-if="!!project.orgPhone" @click="callPhone(project.orgPhone)">
                <cy-icon type="phone" size="16" color="#6a0101"></cy-icon>
            </div>
            <!--公众号二维码 -->
            <div
                class="item"
                v-if="JSON.stringify(posterOption) !== '{}'"
                @click="showPoster = true"
            >
                <cy-icon type="code1" size="16" color="#6a0101"></cy-icon>
            </div>
            <div class="item" @click="$router.push('/mydata')">
                <cy-icon type="house" size="16" color="#6a0101"></cy-icon>
            </div>
        </div>

        <!-- 轮播图 -->
        <div class="share-swiper" @touchmove.prevent>
            <cy-swiper
                ref="shareSwiper"
                :autoPlay="swiperAutoPlay"
                :pagination="true"
                :swiperData="project.imgList"
                @slideChangeEnd="slideChangeEnd"
            >
                <div v-for="item in project.imgList" :key="item.pk" class="cy-swiper-slide">
                    <div class="play-video" v-if="item.videoUrl" @click="playVideo(0)">
                        <cy-icon class="play-video-icon" type="play1" size="35"></cy-icon>
                        <cy-image class="play-video-img" :src="item.imgUrl" :lazy="false"></cy-image>
                        <video
                            ref="swiperVideo"
                            :class="['slide-video', 'w100']"
                            :src="item.videoUrl"
                            webkit-playsinline="true"
                            x-webkit-airplay="true"
                            playsinline
                            x5-playsinline="true"
                            x5-video-player-fullscreen
                            x5-video-player-type="h5"
                        ></video>
                    </div>
                    <cy-image v-else :src="item.imgUrl" :lazy="false"></cy-image>
                </div>
            </cy-swiper>
            <div class="top">
                <div class="logo">
                    <cy-image :src="require('@/assets/img/share_money/logo.png')"></cy-image>
                </div>
            </div>

            <!-- 消息轮播 -->
            <div class="buy-list">
                <cy-swiper
                    :autoPlay="2500"
                    :pagination="false"
                    :loop="true"
                    direction="vertical"
                    :swiperData="orderNoticeList"
                >
                    <div v-for="(item,index) in orderNoticeList" :key="index" class="buy-list-item">
                        <div class="buy-item">
                            <div class="img">
                                <cy-image :src="item.face" round></cy-image>
                            </div>
                            <div>{{item.userName}} {{item.noticeType === '1' ? "购买" : item.noticeType === '2' ? "浏览" : "转发"}}</div>
                        </div>
                    </div>
                </cy-swiper>
            </div>
        </div>

        <!-- 售价 -->
        <div class="share-price flex between vcenter">
            <div class>
                <div class="flex vcenter lh1">
                    <span class="mgt-10 red fs-12">￥</span>
                    <span class="red fs-24 bold">{{project.price}}</span>
                    <span class="time-limit">限时购</span>
                </div>
                <div>
                    <span class="cost-price">原价¥{{project.costPrice}}</span>
                    <span class="red">已抢{{project.nationRealBuyTimes}}份</span>
                </div>
            </div>
            <div v-if="project.expireType === '1'" class="flex column vend">
                <span class="red fs-12">{{project.expireMsg}}</span>
                <cy-countdown
                    class="count-down"
                    :expireTime="project.expireTime"
                    @end="countdownEnd"
                />
            </div>
        </div>

        <!--导航-->
        <div class="share-tabs" :class="showShareTabs?'active':''">
            <cy-sticky ref="shareTab" @scrollChange="scrollChange" :fresh="true">
                <ul class="share-tab">
                    <li :class="activeTab===1?'active':''" @click="scrollIntoView('scroll-detail')">
                        <div class="text">详情</div>
                    </li>
                    <li :class="activeTab===2?'active':''" @click="scrollIntoView('scroll-case')">
                        <div class="text">
                            案例
                            <cy-badge :text="caseTotal" class="badge"></cy-badge>
                        </div>
                    </li>
                    <li
                        :class="activeTab===3?'active':''"
                        @click="scrollIntoView('scroll-evaluate')"
                        v-if="project.allowEvaluate === '1'"
                    >
                        <div class="text">
                            评价
                            <cy-badge :text="evaluateTotal" class="badge"></cy-badge>
                        </div>
                    </li>
                </ul>
            </cy-sticky>
        </div>

        <div class="bg-white">
            <!--附近可用门店-->
            <div class="pdt-10 bg-white">
                <div v-show="useStoresTotal>1" class="pdlr-10 pdb-10 fs-15">
                    <span class="pdr-5 bold">附近可用门店</span>
                    <small class="grey">({{useStoresTotal}}家)</small>
                </div>
                <use-stores :option="useStoresOption" @changeStore="onChangeStore" />
                <div v-if="useStoresTotal==0" class="bg-white grey tc cy-zoom-in ani-d-14" style="position: relative;height:40px; margin-top:-30px">附近无可用门店</div>
            </div>

            <div class="tab-scroll h10 bg-grey"></div>

            <!--详情-->
            <div class="pdlr-10 relative">
                <div class="scroll-detail"></div>
                <div class="pdtb-10 bold fs-15">宝贝详情</div>
                <!--介绍-->
                <div class="mgb-15" v-html="project.activityDsc"></div>
                <!--视频-->
                <div v-for="(item,index) in project.videoResList" :key="item.pk">
                    <div
                        v-if="item.videoUrl"
                        @click="playVideo(index+2)"
                        class="relative lh1 mgb-10"
                    >
                        <cy-icon class="play-video-icon" type="play1" size="35"></cy-icon>
                        <!-- <cy-image class="play-video-img" :src="item.img"></cy-image> -->
                        <video
                            class="w100"
                            :poster="item.img"
                            :src="item.videoUrl"
                            x5-playsinline
                            playsinline
                            webkit-playsinline
                        ></video>
                    </div>
                </div>
                <!-- 规则 -->
                <div v-if="project.activityRules">
                    <div class="pdtb-10 darkblue bold fs-15">活动规则</div>
                    <div class="fs-12" v-html="project.activityRules"></div>
                </div>
            </div>

            <div class="tab-scroll h10 bg-grey"></div>

            <!--施工案例-->
            <div class="relative">
                <div class="scroll-case"></div>
                <div class="pd-10 fs-15">
                    <span class="pdr-5 bold">施工案例</span>
                    <small class="grey">(共{{caseTotal}}条)</small>
                </div>
                <case-data-list v-if="showCase" @change="onChangeCase"></case-data-list>
            </div>

            <div class="tab-scroll h10 bg-grey"></div>

            <!--宝贝评价-->
            <div v-if="project.allowEvaluate === '1'" class="min-h101 relative">
                <div class="scroll-evaluate"></div>
                <div class="pd-10 fs-15">
                    <span class="pdr-5 bold">宝贝评价</span>
                    <!-- <small class="grey">(共{{evaluateTotal}}条)</small> -->
                    <!-- <div
                    v-if="evaluateTotal > 0"
                    @click="$router.push({path:'/evaluate',query:{projectPk:project.pk}})"
                    class="flex vcenter fs-12 grey"
                >
                    查看全部
                    <cy-icon type="youjiantou" size="10" color="#999999"></cy-icon>
                    </div>-->
                </div>
                <evaluate-data-info
                    :option="evaluateOption"
                    @change="onChangeEvaluate"
                    :isPullLoadMore="false"
                ></evaluate-data-info>
            </div>

            <!--购买按钮-->
            <div class="share-buy fixed-bt mgb-safe-0 cy-slide-up-in ani-d-5">
                <div>
                    <div
                        v-if="shareUserPk !== '' && shareUserPk !== $store.state.user.pk"
                        class="flex between"
                    >
                        <div
                            @click="$router.push('/user')"
                            class="exprience-inner flex column center tc fs-12"
                        >
                            <cy-icon type="gerenzhongxin1" size="22" color="#3F8BFD"></cy-icon>
                            <div>个人中心</div>
                        </div>
                        <div class="buy-inner">
                            <cy-btn
                                @click.native="onShowBuy"
                                type="blue-gradient"
                                angle
                                lg
                                :class="{'btn-disabled':buyDisabled === true}"
                            >
                                <span class="mglr-10">立即抢购</span>
                                ¥{{project.price}}
                            </cy-btn>
                        </div>
                    </div>
                    <div v-else class="flex between">
                        <div
                            @click="$router.push('/user')"
                            class="exprience-inner flex column center tc fs-12"
                        >
                            <cy-icon type="gerenzhongxin1" size="22" color="#3F8BFD"></cy-icon>
                            <div>个人中心</div>
                        </div>
                        <div class="share-inner white">
                            <cy-btn @click.native="onShowShare" background="#29D7A8" angle lg>
                                <cy-row>
                                    <cy-col :span="6" class="flex center">
                                        <cy-icon type="share" size="16"></cy-icon>
                                    </cy-col>
                                    <cy-col
                                        v-if="project.shareBackPrice>0"
                                        :span="18"
                                        class="tl lh12"
                                    >
                                        <div class="fs-16">分享赚钱</div>
                                        <div class="fs-12">平台返现￥{{project.shareBackPrice}}</div>
                                    </cy-col>
                                    <cy-col v-else :span="18" class="tl lh12">
                                        <div class="fs-16">立即分享</div>
                                    </cy-col>
                                </cy-row>
                            </cy-btn>
                        </div>
                        <div class="buy-inner white">
                            <cy-btn
                                @click.native="onShowBuy"
                                :class="{'btn-disabled':buyDisabled === true}"
                                background="#3F8BFD"
                                angle
                                lg
                            >
                                <cy-row>
                                    <cy-col :span="6" class="flex center">
                                        <cy-icon type="buy" size="16"></cy-icon>
                                    </cy-col>
                                    <cy-col v-if="project.backPrice>0" :span="18" class="tl lh12">
                                        <div class="fs-16">自购省钱</div>
                                        <div class="fs-12">平台返现￥{{project.backPrice}}</div>
                                    </cy-col>
                                    <cy-col v-else :span="18" class="tl lh12">
                                        <div class="fs-16">我要购买</div>
                                    </cy-col>
                                </cy-row>
                            </cy-btn>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 用户关注门店弹窗 -->
        <cy-popup
            v-model="showRelationStoreList"
            :closeIcon="false"
            :clickOverlayClose="false"
            width="100%"
            height="8.6rem"
        >
            <div class="pd-15">选择门店</div>
            <cy-cell
                v-for="(item,index) in relationStoreList"
                :key="index"
                :title="item.orgName || item.name"
                @click.native="changeRelationStore(item.orgPk || item.pk)"
                link="javascript:;"
            />
        </cy-popup>

        <!-- 购买弹窗 -->
        <to-buy :show.sync="showBuy" :info="buyOption" @change="buyChange"></to-buy>

        <!-- 分享弹窗 -->
        <share :show.sync="showShare" :displayPoster.sync="showPoster" :option="posterOption"></share>

        <!--返回顶部-->
        <cy-to-top class="mgb-safe-0"></cy-to-top>
    </div>
</template>

<script>
import { mapState } from "vuex";
import cySwiper from "@/components/swiper";
import music from "@/components/_custom/music";
import cyCountdown from "@/components/countdown";
import cySticky from "@/components/sticky";
import cyToTop from "@/components/totop";
import useStores from "./use_stores";
import cyBadge from "@/components/badge";
import wxx, { wxMenuShare } from "@/utils/wx";
import { dataURLtoFile } from "@/utils/compression";
import { toKW } from "@/utils/number";
import caseDataList from "@/components/_custom/case/data_list"; //案例列表
import evaluateDataInfo from "@/components/_custom/evaluate/data_info"; //评价列表
import share from "@/components/_custom/share"; //分享
import toBuy from "./buy"; //购买

export default {
    name: "share_money",
    components: {
        cySwiper,
        music,
        cyCountdown,
        cySticky,
        cyToTop,
        useStores,
        cyBadge,
        caseDataList,
        evaluateDataInfo,
        share,
        toBuy,
    },
    data() {
        return {
            latitude: "", //纬度
            longitude: "", //经度
            address: "", //地址

            orgPk: "", //门店或代理商pk
            shareUserPk: "", //分享人pk
            shareRecordsPk: "", //分享人的浏览pk
            showRelationStoreList: false, //显示用户关注门店
            relationStoreList: [], //用户关注的门店列表
            swiperAutoPlay: 3000, //自动轮播
            isNowBuy: false, //是否立即购买
            applyPk: false, //申请体验记录pk
            project: "", //宝贝详情
            musicPlay: false, //背景音乐播放
            orderNoticeList: [], //轮播消息
            showQRCode: false, //显示公众号二维码
            browsePk: "", //自己的当前浏览pk
            browseTimes: 0, //浏览时长
            browseTimer: null, //浏览时间定时器
            caseTotal: "", //施工案例总数
            showCase: false, //显示评价施工案例
            evaluateTotal: "", //评价总数
            evaluateOption: {}, //评价列表参数
            useStoresPageNum: 1, //可用施工门店分页
            useStoresTotal: "", //可用施工门店总数
            useStoresOption: {}, //可用施工门店
            showShareTabs: false, //显示tab滚动
            activeTab: -1, //tab滚动到栏目
            buyDisabled: true, //禁用购买按钮
            shareDisabled: true, //禁用分享按钮
            showBuy: false, //自购省钱弹窗
            showBuyBtn: false, //自购省钱弹窗
            buyOption: {}, //自购省钱参数
            showShare: false, //分享弹窗
            showPoster: false, //海报弹窗
            posterOption: {}, //海报配置
        };
    },
    created() {
        const q = this.$route.query;
        this.shareUserPk = q.shareUserPk || "";
        this.shareRecordsPk = q.shareRecordsPk || "";
        this.isNowBuy = q.isNowBuy || "";
        this.applyPk = q.applyPk || "";
        this.getProject();
        //this.getProject("22.72174", "114.06031"); //暂时
    },
    mounted() {
        //监听页面后台运行
        document.addEventListener(
            "visibilitychange",
            this.pageVisibilityChange,
            false
        );
    },
    computed: {
        ...mapState(["defaultRole", "user"]),
    },
    methods: {
        //获取宝贝详情
        getProject() {
            this.$toast.loading("加载中…");
            this.$api
                .getProject()
                .then(async (res) => {
                    let nowTime = "",
                        startTime = "",
                        endTime = "",
                        expireMsg = "",
                        expireMsgToast = "",
                        expireTime = 0;
                    if (res.obj.expireType === "1") {
                        //0=长期有效， 1=时间起止
                        nowTime = new Date(
                            res.obj.systemTime.replace(/-/g, "/")
                        ).getTime();
                        startTime = new Date(
                            res.obj.startDate.replace(/-/g, "/") + " 00:00:00"
                        ).getTime();
                        endTime = new Date(
                            res.obj.endDate.replace(/-/g, "/") + " 23:59:59"
                        ).getTime();
                        if (startTime >= nowTime) {
                            expireTime = startTime - nowTime;
                            expireMsg = "距离开始还有";
                            expireMsgToast = "活动未开始";
                            this.buyDisabled = true;
                        } else if (endTime <= nowTime) {
                            expireMsg = "活动已结束";
                            expireMsgToast = "活动已结束";
                            this.buyDisabled = true;
                        } else {
                            expireTime = endTime - nowTime;
                            expireMsg = "距离结束仅剩";
                            this.buyDisabled = false;
                        }
                    } else {
                        this.buyDisabled = false;
                    }

                    const project = {
                        ...res.obj,
                        name:'途康车内大健康检测&治理项目，祛异味杀菌消毒祛除有害气体！',
                        shareDsc:'国家高新技术企业出品，先检测后科学治理车内环境危害，有健康爱恒久！',
                        startTime, //开始时间戳
                        endTime, //结束时间戳
                        nowTime, //当前时间戳
                        expireMsg, //倒计时提示
                        expireMsgToast, //点击自购省钱倒计时提示
                        expireTime, //倒计时间戳
                        nationRealBuyTimes:
                            res.obj.nationBuyTimes + res.obj.nationRealBuyTimes, //全国购买
                        imgList:
                            res.obj.imgVideoList.length > 0
                                ? [res.obj.imgVideoList[0], ...res.obj.imgList]
                                : res.obj.imgList,
                    };
                    //项目信息
                    this.project = project;
                    //标题
                    document.title = this.project.name;
                    this.$toast.clear();

                    //orgPk 代理商/门店pk
                    this.orgPk = this.$route.query.orgPk;
                    if (!this.orgPk) {
                        //当前角色是1代理商/2门店/4普通车主关注门店
                        if (
                            this.defaultRole.type === "1" ||
                            this.defaultRole.type === "2" ||
                            this.defaultRole.type === "4"
                        ) {
                            this.orgPk = this.defaultRole.defaultOrgPk;
                            await this.getLocation(); //获取经纬度
                        } else {
                            try {
                                this.orgPk = await this.getUserRelationListByPage(); //获取用户上一次关注的代理商/门店 和 代理商/门店列表
                                await this.getLocation();
                            } catch (err) {}
                        }
                    } else {
                        await this.getLocation(); //获取经纬度
                    }

                    //立即购买 是从体验中心跳过来的
                    if (this.isNowBuy === "1") {
                        this.showBuy = true;
                    }

                    //获取用户地理位置名称
                    if (!!this.longitude && !!this.latitude) {
                        this.getMapAddress();
                    }

                    //设置购买参数 无地址
                    if (this.orgPk) {
                        this.buyOption = {
                            applyPk: this.applyPk, //申请体验记录pk --从体验中心跳过来的
                            price: this.project.price, //价格
                            orgPk: this.orgPk, //当前代理商/门店pk
                            projectPk: this.project.pk, //项目pk
                            shareUserPk: this.shareUserPk, //分享人pk
                            x: this.longitude,
                            y: this.latitude,
                        };
                        //附近可用门店参数
                        this.useStoresOption = {
                            projectPk: this.project.pk,
                            orgPk: this.orgPk, //门店或代理商pk
                            x: this.longitude, //经度
                            y: this.latitude, //纬度
                            shareUserPk: this.shareUserPk,
                            nationBuyTimes: this.project.nationBuyTimes, //虚拟购买次数
                        };
                        //获取项目其他信息
                        this.getProjectOtherData();
                    }

                    //轮播购买，转发，浏览
                    this.getOrderNotice();

                    //设置浏览时间
                    try {
                        this.browsePk = await this.setBrowseTime();
                    } catch (err) {}

                    if (this.orgPk && this.browsePk) {
                        //设置分享
                        this.setMenuShare();
                        //海报配置
                        this.posterQrCode();
                    }

                    //修改浏览次数
                    this.browsePk &&
                        this.updateBuyOrForwardStatus("browseStatus");

                    //评价参数
                    this.evaluateOption = {
                        pageSize: 3,
                        projectPk: this.project.pk,
                    };

                    this.$nextTick(() => {
                        if (
                            this.project.imgVideoList &&
                            this.project.imgVideoList.length > 0
                        ) {
                            //监听轮播中的视频
                            this.addEventListenerSwiperVideo();
                        }
                        //绑定顶部tab
                        this.$refs.shareTab.bindStickyFresh();
                        //显示案例
                        this.showCase = true;
                    });
                })
                .catch((err) => {});
        },

        //获取经纬度 isMust-新用户必须开启定位
        getLocation(isMust = false) {
            return new Promise((resolve, reject) => {
                const setWxConfig = () => {
                    //播放音乐
                    const shareMoneyMusic =
                        this.$store.state.shareMoneyMusic &&
                        this.$store.state.shareMoneyMusic.play;
                    this.musicPlay =
                        typeof shareMoneyMusic === "undefined"
                            ? true
                            : shareMoneyMusic;
                    //显示菜单项按钮 已在App.vue隐藏
                    wx.showMenuItems({
                        menuList: [
                            "menuItem:share:appMessage",
                            "menuItem:share:timeline",
                            "menuItem:favorite",
                            "menuItem:copyUrl",
                        ],
                    });

                    wx.getLocation({
                        type: "wgs84",
                        success: (res) => {
                            this.latitude = res.latitude; //纬度
                            this.longitude = res.longitude; //经度
                            //新用户-去选择附近门店
                            if (!!isMust) {
                                this.useStores();
                            }
                            resolve();
                        },
                        cancel: () => {
                            if (!!isMust) {
                                this.$nextTick(() => {
                                    this.$dialog({
                                        title: "活动有区域限制，请开启定位",
                                        noCancel: true,
                                        onConfirm: () => {
                                            this.getLocation(true);
                                        },
                                    });
                                });
                            } else {
                                resolve();
                            }
                        },
                        fail: (err) => {
                            if (!!isMust) {
                                this.$nextTick(() => {
                                    this.$dialog({
                                        title:
                                            "活动有区域限制，请前往设置开启定位！",
                                        noCancel: true,
                                        onConfirm: () => {
                                            this.getLocation(true);
                                        },
                                    });
                                });
                            } else {
                                resolve();
                            }
                        },
                    });
                };
                //微信签名配置
                wxx.wxaccountConfig(setWxConfig);
            });
        },

        //获取用户上一次关注的代理商/门店 和 代理商/门店列表
        getUserRelationListByPage() {
            return new Promise((resolve, reject) => {
                const params = {
                    pageNum: "1",
                    pageSize: "50",
                };
                this.$api
                    .getUserRelationListByPage(params)
                    .then(async (res) => {
                        //没有默认关注过代理商/门店
                        if (!res.obj.recentlyUsed) {
                            //没有关注列表  说明是新用户则【必须开启定位】
                            if (res.obj.pages && res.obj.pages.length <= 0) {
                                await this.getLocation(true);
                            } else {
                                //选择门店
                                this.showRelationStoreList = true;
                                this.relationStoreList = res.obj.pages;
                                await this.getLocation();
                            }
                            reject();
                        } else {
                            const orgPk = res.obj.recentlyUsed.orgPk;
                            resolve(orgPk);
                        }
                    })
                    .catch(async (err) => {
                        await this.getLocation(true);
                        reject();
                    });
            });
        },

        //获取代理商/门店信息
        useStores() {
            const params = {
                x: this.longitude,
                y: this.latitude,
                projectPk: this.project.pk,
                pageNum: "1",
                pageSize: "10",
            };
            this.$api
                .useStores(params)
                .then((res) => {
                    //弹窗选择门店
                    this.showRelationStoreList = true;
                    this.relationStoreList = res.obj;
                })
                .catch((err) => {});
        },

        //选择门店 默认关注代理商/门店信息
        changeRelationStore(orgPk) {
            this.showRelationStoreList = false;
            this.orgPk = orgPk;
            //设置购买参数
            this.buyOption = {
                ...this.buyOption,
                applyPk: this.applyPk, //申请体验记录pk --从体验中心跳过来的
                price: this.project.price, //价格
                orgPk: this.orgPk, //当前代理商/门店pk
                projectPk: this.project.pk, //项目pk
                shareUserPk: this.shareUserPk, //分享人pk
                x: this.longitude,
                y: this.latitude,
            };
            //附近可用门店参数
            this.useStoresOption = {
                projectPk: this.project.pk,
                orgPk: this.orgPk, //门店或代理商pk
                x: this.longitude, //经度
                y: this.latitude, //纬度
                shareUserPk: this.shareUserPk,
                nationBuyTimes: this.project.nationBuyTimes, //虚拟购买次数
            };

            this.setMenuShare(); //设置分享
            this.posterQrCode(); //设置海报
            this.getProjectOtherData(); //获取项目其他信息
        },

        //获取项目其他信息
        getProjectOtherData() {
            const params = {
                projectPk: this.project.pk,
                orgPk: this.orgPk,
            };
            this.$api
                .getProjectOtherData(params)
                .then((res) => {
                    this.project = {
                        ...this.project,
                        // isExperience: res.obj.isExperience, //是否参与免费体验 0-否 1-是 2-已申请 3-已体验
                        // experienceOrgPk: res.obj.experienceOrgPk, //体验门店OrgPk
                        // experienceOrgName: res.obj.orgName, //体验门店名称
                        // experienceSimpleCode: res.obj.experienceSimpleCode, //体验门店简码
                        orgPhone: res.obj.orgPhone,
                        //qrCodeUrl: res.obj.qrCodeUrl
                    };
                    this.addOrUpdateRelation(); //新增或修改关注代理商/门店信息
                })
                .catch((err) => {});
        },

        //新增或修改关注代理商/门店信息
        addOrUpdateRelation() {
            const params = {
                orgPk: this.orgPk,
            };
            this.$api
                .addOrUpdateRelation(params)
                .then((res) => {
                    if (!!this.user.phone) {
                        this.getAccountsUserAndRole();
                    }
                })
                .catch((err) => {});
        },

        //获取角色列表
        getAccountsUserAndRole() {
            const params = {
                pk: this.user.pk,
            };
            this.$api.getAccountsUserAndRole(params).then((res) => {
                //当前角色
                const currentRole = res.obj.roleList.filter((item) => {
                    return item.orgPk === this.orgPk;
                });
                if (currentRole.length > 0) {
                    this.addOrUpdateUserRole(currentRole[0]);
                }
            });
        },

        //修改默认角色
        addOrUpdateUserRole(option) {
            const params = {
                defaultOrgPk: option.orgPk, //01 厂商
                orgName: option.orgName,
                rolePk: option.rolePk,
                type: option.type,
                nation: this.address.address_component.nation || "", //国家
                province: this.address.address_component.province || "", //省份
                city: this.address.address_component.city || "", //市
                district: this.address.address_component.district || "", //区县
            };
            //修改默认角色
            this.$api
                .addOrUpdateUserRole(params)
                .then((res) => {
                    this.$store.commit("setDefaultRole", {
                        ...res.obj,
                        orgName: option.orgName || "",
                    });
                })
                .catch((err) => {});
        },

        //修改背景音乐状态
        onChangeMusicStatus(status) {
            this.musicPlay = status;
            if (status === true) {
                this.playVideo(-1); //暂停所有视频
            }
        },

        //播放/暂停轮播视频
        playVideo(index, isPaly = true) {
            const videoAll = this.$el.querySelectorAll("video");
            const iconAll = this.$el.querySelectorAll(".play-video-icon");
            const img = this.$el.querySelector(".play-video-img"); //轮播图的视频封面
            for (let i = 0; i < videoAll.length; i++) {
                if (i === index) {
                    if (videoAll[i].paused && isPaly) {
                        iconAll[i].classList.add("none");
                        img && img.classList.add("none");
                        this.musicPlay = false;
                        videoAll[i].play();
                    } else {
                        iconAll[i].classList.remove("none");
                        img && img.classList.remove("none");
                        videoAll[i].pause();
                    }
                } else {
                    iconAll[i].classList.remove("none");
                    videoAll[i].pause();
                }
            }
        },

        //监听轮播中的视频
        addEventListenerSwiperVideo() {
            let time = null;
            const swiperVideo = this.$refs.swiperVideo;
            //监听播放
            swiperVideo[0].addEventListener(
                "play",
                () => {
                    this.swiperAutoPlay = 0; //暂停轮播
                    time && clearTimeout(time);
                    time = null;
                },
                false
            );
            //监听暂停
            swiperVideo[0].addEventListener(
                "pause",
                () => {
                    this.swiperAutoPlay = 3000; //自动轮播
                    time && clearTimeout(time);
                    time = null;
                    time = setTimeout(() => {
                        this.$refs.shareSwiper.setPage(2, true, "NEXT");
                    }, 500);
                },
                false
            );
            //监听结束
            swiperVideo[0].addEventListener(
                "ended",
                () => {
                    this.swiperAutoPlay = 3000; //自动轮播
                    time && clearTimeout(time);
                    time = null;
                    time = setTimeout(() => {
                        this.$refs.shareSwiper.setPage(2, true, "NEXT");
                    }, 500);
                },
                false
            );
        },

        //切换轮播图
        slideChangeEnd(index, e) {
            if (index !== 1) {
                const swiperVideo = this.$refs.swiperVideo;
                if (swiperVideo[0].play) {
                    swiperVideo[0].pause();
                }
            }
        },

        //获取用户地理位置名称
        getMapAddress() {
            //腾讯API逆解析
            const params = {
                key: this.$api.config.TENCENT_MAP_ADDRESS_Key,
                location: `${this.latitude},${this.longitude}`,
                get_poi: 0,
                output: "jsonp",
            };
            this.$jsonp(this.$api.config.TENCENT_MAP_ADDRESS_API, params)
                .then((res) => {
                    this.address = res.result;
                    //更新设置购买参数 有地址
                    this.buyOption = {
                        ...this.buyOption,
                        address: this.address.address, //地址
                    };
                })
                .catch((err) => {});
        },

        //统计浏览时间
        setBrowseTime() {
            return new Promise((resolve, reject) => {
                let pk = this.browsePk; //自己的当前浏览pk
                const params = {
                    projectPk: this.project.pk,
                    shareUserPk: this.shareUserPk, //分享人pk
                    shareRecordsPk: this.shareRecordsPk, //分享者浏览Pk
                    orgPk: this.orgPk, //当前代理商/门店pk
                    x: this.longitude, //经度
                    y: this.latitude, //纬度
                    address: this.address.address,
                    browseTimes: this.browseTimes + (!!pk ? 5 : 2), //浏览时间
                    pk: pk, //浏览pk
                    errMsg: false,
                };
                this.$api
                    .addOrUpdateMyShare(params)
                    .then((res) => {
                        //只设置一次
                        if (
                            this.browseTimes === 0 ||
                            this.browseTimer === null
                        ) {
                            //设置定时器
                            this.browseTimer = window.setInterval(() => {
                                this.setBrowseTime();
                            }, 5000);
                            resolve(res.obj.pk);
                        }
                        this.browseTimes = res.obj.browseTimes;
                    })
                    .catch((err) => {
                        reject();
                    });
            });
        },

        //设置分享信息
        setMenuShare() {
            //const setWxConfig = () => {
            const option = {
                title: this.project.name,
                desc: this.project.shareDsc,
                link: `?orgPk=${this.orgPk}&shareRecordsPk=${this.browsePk}`, // 分享链接
                imgUrl: this.project.imgVideoList[0].imgUrl, // 分享图标
                success: () => {
                    this.updateBuyOrForwardStatus("forwardStatus");
                },
            };
            wxMenuShare(option);

            //分享按钮非禁用
            this.shareDisabled = false;
            //};
            //wxx.wxaccountConfig(setWxConfig);
        },

        //修改转发次数或购买次数 购买后需要回调
        updateBuyOrForwardStatus(type, callback) {
            const params = {
                pk: this.browsePk,
                [type]: "1", //type=  forwardStatus转发 buyStatus购买 browseStatus浏览
                errMsg: false,
            };
            this.$api
                .addOrUpdateMyShare(params)
                .then((res) => {
                    callback && callback();
                })
                .catch((err) => {
                    callback && callback();
                });
        },

        //购买成功后修改购买次数
        buyChange(type, callback) {
            this.updateBuyOrForwardStatus(type, callback);
        },

        //获取海报二维码
        posterQrCode() {
            const link = `${window.location.href.split("?")[0]}?orgPk=${
                this.orgPk
            }&shareRecordsPk=${this.browsePk}&shareUserPk=${
                this.user.pk
            }&sysSource=${this.$store.state.sysInfo.pk}`;
            const params = {
                orgPk: this.orgPk,
                value: link,
                errMsg: false,
            };
            this.$api
                .posterQrCode(params)
                .then((res) => {
                    //海报配置
                    const posterOption = {
                        // posterSummary: this.project.posterSummary.replace(
                        //     /[\n\r]/g,
                        //     "<br/>"
                        // ),
                        projectName: this.project.name,
                        nickName: this.user.nickName,
                        face: this.user.face,
                        posterImgList: this.project.posterList,
                        qcode: "data:image/jpg;base64," + res.obj,
                    };
                    this.posterOption = posterOption;
                })
                .catch((err) => {});
        },

        //获取轮播购买，转发，浏览的用户
        getOrderNotice() {
            const params = {
                projectPk: this.project.pk, //项目pk
                errMsg: false,
            };
            this.$api
                .getOrderNotice(params)
                .then((res) => {
                    const count = 40;
                    this.orderNoticeList =
                        res.obj.length < count
                            ? this.arrayPadEnd(res.obj, count)
                            : res.obj;
                })
                .catch((err) => {});
        },

        //在数组末尾填充数据
        arrayPadEnd(data, count) {
            if (!data || !Array.isArray(data)) {
                return [];
            } else if (data.length < 1) {
                return data;
            } else {
                const max = data.length - 1;
                let index = 0;
                return Array(count)
                    .fill(count)
                    .map((item) => {
                        if (index > max) {
                            index = 0;
                        }
                        item = {
                            ...data[index],
                        };
                        index++;
                        return item;
                    });
            }
        },

        //评价总数
        onChangeEvaluate(totle) {
            if (!this.evaluateTotal) {
                this.evaluateTotal = totle;
            }
        },

        //案例总数
        onChangeCase(totle) {
            if (!this.caseTotal) {
                this.caseTotal = totle;
            }
            this.navOffsetTop();
        },

        //门店总数
        onChangeStore(totle) {
            if (totle === "") {
                this.buyDisabled = true //禁用购买按钮
                //this.$toast("附近无可用门店");
            }
            if (!this.useStoresTotal) {
                this.useStoresTotal = totle;
            } else {
                this.navOffsetTop();
            }
        },

        //跳转到tab
        scrollIntoView(tab) {
            this.$el.querySelector("." + tab).scrollIntoView();
        },

        //计算[详情 案例 评价] 距顶距离
        navOffsetTop() {
            this.topArr = [0];
            const tabs = this.$el.querySelectorAll(".tab-scroll");
            tabs.forEach((item, index) => {
                this.topArr.push(item.offsetTop);
            });
        },

        //底部购买按钮
        onShowBuy() {
            if (this.buyDisabled) {
                this.project.expireMsgToast && this.$toast(this.project.expireMsgToast);
                return;
            }
            this.showBuy = true;
        },

        //底部分享按钮
        onShowShare() {
            if (this.shareDisabled && this.buyDisabled) {
                return;
            }
            this.showShare = true;
        },

        //打电话
        callPhone(phone) {
            if (!phone) {
                return;
            }
            window.location.href = "tel://" + phone;
        },

        //倒计时结束
        countdownEnd() {
            const project = { ...this.project };
            //活动从未开始到已开始
            if (project.startTime >= project.nowTime) {
                this.buyDisabled = false;
                this.project.expireTime = project.endTime - project.startTime;
                this.project.expireMsg = "距离结束还有";
                //活动从已开始到结束
            } else if (project.endTime >= project.nowTime) {
                this.buyDisabled = true;
                this.showBuy = false;
                this.project.expireMsg = "活动已结束";
                this.project.expireMsgToast = "活动已结束";
            }
        },

        //选中第几个导航
        scrollChange(top) {
            if (top > 50) {
                this.showShareTabs = true;
            } else {
                this.showShareTabs = false;
            }
            const index =
                (this.topArr &&
                    this.topArr.findIndex((val, index, arr) => {
                        top = top + 20;
                        return val >= top;
                    })) ||
                1;
            this.activeTab = (index === -1 ? this.topArr.length : index) - 1;
        },

        //监听息屏 暂停浏览时间
        pageVisibilityChange(s) {
            // 网页后台运行
            if (document.visibilityState == "hidden") {
                if (this.browseTimer) {
                    window.clearInterval(this.browseTimer);
                    this.browseTimer = null;
                }
            } else {
                this.setBrowseTime();
            }
        },
    },

    //销毁前
    beforeDestroy() {
        if (this.browseTimer) {
            window.clearInterval(this.browseTimer);
            this.browseTimer = null;
        }
    },
};
</script>
<style lang="scss" scoped>
.relative {
    position: relative;
}
.share-money {
    padding-bottom: 50px;
}
.play-video-icon {
    position: absolute;
    width: 35px;
    height: 35px;
    top: 50%;
    left: 50%;
    margin: -15px 0 0 -15px;
    z-index: 2;
}
.play-video-img {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}
.share-nav {
    position: fixed;
    right: 0;
    top: 100px;
    z-index: 50;
    .item {
        width: 32px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 16px;
        border-radius: 5px 0 0 5px;
        background-image: linear-gradient(
            180deg,
            #fff671 0%,
            #fee322 50%,
            #ffd306 100%
        );
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.5);
    }
}
.share-swiper {
    position: relative;
    height: 375px;
    background-color: #ebecec;
    .play-video {
        height: 100%;
        .slide-video {
            height: 100%;
            object-fit: fill;
        }
    }
    .top {
        position: absolute;
        top: 0px;
        left: 0px;
        padding: 8px 10px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0.8)
        );
        .logo {
            width: 127px;
            height: 22px;
        }
    }
    .buy-list {
        position: absolute;
        height: 82px;
        width: 40%;
        bottom: 5px;
        overflow: hidden;
        z-index: 9;
        .buy-list-item {
            height: 30px;
        }
        .buy-item {
            display: flex;
            height: 22px;
            line-height: 22px;
            margin-bottom: 8px;
            overflow: hidden;
            background: linear-gradient(
                to left,
                rgba(0, 0, 0, 0),
                rgba(0, 0, 0, 0.6)
            );
            font-size: 12px;
            color: #ffffff;
            .img {
                margin-right: 5px;
                width: 22px;
                height: 22px;
            }
        }
    }
}
.share-price {
    position: relative;
    padding: 10px 15px;
    background: #fff6e2;
    .time-limit {
        display: inline-block;
        width: 43px;
        height: 16px;
        margin: -10px 0 0 5px;
        padding: 1px 0 1px 5px;
        line-height: 14px;
        font-weight: 600;
        font-size: 10px;
        color: #6a0101;
        background: url("../../assets/img/user/orders/label_bg.png") no-repeat;
        background-size: 100% 100%;
    }
    .cost-price {
        padding-right: 10px;
        text-decoration: line-through;
        color: #9c7421;
    }
}
.count-down {
    font-size: 10px;
    line-height: 1;
    color: #cf392c;
    font-weight: bold;
    /deep/span {
        display: inline-block;
        width: 22px;
        height: 20px;
        line-height: 20px;
        margin: 0 2px;
        font-size: 14px;
        text-align: center;
        font-weight: normal;
        background: #e0ba6b;
        background-image: linear-gradient(
            180deg,
            #fff671 0%,
            #fee322 50%,
            #ffd306 100%
        );
        border-radius: 3px;
        color: #d4332b;
    }
}
.share-tabs {
    position: fixed;
    z-index: 90;
    width: 100%;
    left: 0;
    top: 0;
    transition: 0.2s;
    transform: translate3d(0, -100%, 0);
    &.active {
        transform: translate3d(0, 0%, 0);
    }
    ul.share-tab {
        display: flex;
        padding: 10px 10px 6px 10px;
        text-align: center;
        background-color: #ffffff;
        border-bottom: solid 1px rgba(0, 0, 0, 0.05);
        li {
            flex: 1;
            position: relative;
            height: 26px;
            &.active::after {
                content: "";
                position: absolute;
                width: 20%;
                left: 40%;
                bottom: 0px;
                height: 5px;
                border-radius: 10px;
                background: linear-gradient(90deg, #29d7a8, #3f8bfd);
            }
            .text {
                position: relative;
                display: inline-block;
                .badge {
                    position: absolute;
                    top: -4px;
                    left: 28px;
                    transform: scale(0.8);
                }
            }
        }
    }
}
.scroll-detail,
.scroll-case,
.scroll-evaluate {
    position: absolute;
    height: 1px;
    top: -40px;
}
.share-buy {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 1)
    );
    .btn-disabled {
        opacity: 1;
    }
    .exprience-inner {
        background: #ffffff;
        color: #3f8bfd;
        flex: 1;
    }
    .buy-inner,
    .share-inner {
        flex: 2;
    }
}
</style>
     