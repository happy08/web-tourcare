<!--健康接力 @touchstart.stop="touchstart"-->
<template>
    <div class="share-money bg-grey">
        <div class="share-nav">
            <div class="item item-share-price" v-if="project.shareBackPrice>0">
                <div @click="showMore=false; displayPoster=true" class="flex center">
                    <cy-icon type="qiandai" size="18" color="#ffffff" class="mgr-5"></cy-icon>
                    {{project.shareBackPrice}}元
                </div>
            </div>
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
            <!-- <div class="top">
                <div class="logo">
                    <cy-image :src="require('@/assets/img/share_money/logo.png')"></cy-image>
                </div>
            </div>-->

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
        <div class="share-costprice flex white">
            <div class="share-price">
                <div class="flex vcenter lh1">
                    <span class="mgt-10 fs-12">￥</span>
                    <span class="fs-26 bold" v-html="project.priceText"></span>
                    <span class="time-limit">限时特价</span>
                </div>
                <div>
                    <span class="cost-price">原价¥{{project.costPrice}}</span>
                    <span class>已抢{{project.nationRealBuyTimes}}份</span>
                </div>
            </div>
            <div
                v-if="project.expireType === '1'"
                class="share-countdown flex column vend hcenter pdr-10"
            >
                <span class="brightred fs-12">{{project.expireMsg}}</span>
                <cy-countdown
                    class="count-down mgt-5"
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
            <div class="pdt-10 pdlr-10">
                <div class="pdb-10 fs-15">
                    <span class="pdr-5 bold">购买使用流程</span>
                    <small class="grey">(共6个步骤)</small>
                </div>
                <cy-image :src="require('@/assets/img/share_money/bg_buy.png')" :lazy="false"></cy-image>
            </div>

            <div class="h10 bg-grey"></div>

            <!--附近可用门店-->
            <div class="pdt-10">
                <div v-show="useStoresTotal>1" class="pdlr-10 pdb-10 fs-15">
                    <span class="pdr-5 bold">附近可用门店</span>
                    <small class="grey">({{useStoresTotal}}家)</small>
                </div>
                <use-stores :option="useStoresOption" @changeStore="onChangeStore"></use-stores>
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
            <div v-if="project.allowEvaluate === '1'" class="share-evaluate relative">
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
                <div class="mglr-15 mgb-15">
                    <cy-btn
                        class="share-buy-shadow"
                        @click.native="onShowBuy"
                        type="blue-gradient"
                        round
                        lg
                        :class="{'btn-disabled':buyDisabled === true}"
                    >立即抢购</cy-btn>
                </div>
            </div>

            <!-- 更多 -->
            <div @click="showMore=true" class="share-more mgb-safe-0 cy-slide-up-in ani-d-10">
                <cy-icon type="gengduo" size="16"></cy-icon>
                <div class="fs-12">更多</div>
            </div>
        </div>

        <!-- 购买弹窗 -->
        <to-buy :show.sync="showBuy" :info="buyOption" @change="buyChange"></to-buy>

        <!-- 分享弹窗 -->
        <share
            :show.sync="showShare"
            :displayShare.sync="displayShare"
            :displayPoster.sync="displayPoster"
            :option="posterOption"
        ></share>

        <!-- 更多弹窗 -->
        <cy-popup
            v-model="showMore"
            class="share-more-popup"
            :closeIcon="true"
            width="100%"
            height="auto"
            round
        >
            <div class="pd-10 fs-18">更多</div>
            <div class="flex between pd-20 mgb-30 tc fs-13">
                <div @click="showMore=false; displayShare=true">
                    <cy-icon type="haoyoufenxiang" size="60"></cy-icon>
                    <div class="mgt-10">好友分享</div>
                </div>
                <div @click="showMore=false; displayPoster=true">
                    <cy-icon type="pengyouquanfenxiang" size="60"></cy-icon>
                    <div class="mgt-10">海报分享</div>
                </div>
                <div @click="showMore=false; $router.push('/mydata')">
                    <cy-icon type="xiangmudashuju" size="60"></cy-icon>
                    <div class="mgt-10">项目大数据</div>
                </div>
                <div @click="showMore=false; $router.push('/user')">
                    <cy-icon type="gerenzhongxin2" size="60"></cy-icon>
                    <div class="mgt-10">个人中心</div>
                </div>
            </div>
        </cy-popup>

        <!-- 抽奖弹窗 -->
        <luck-draw :show.sync="showLuckDraw"></luck-draw>

        <!--返回顶部-->
        <cy-to-top class="mgb-safe-50" style="bottom: 2.5rem;"></cy-to-top>

        <div class="pd-10 tc grey">Ai优店提供活动策划与技术支持</div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import cySwiper from "@/components/swiper";
import music from "@/components/_custom/music";
import cyCountdown from "@/components/countdown";
import cySticky from "@/components/sticky";
import useStores from "./use_stores";
import cyBadge from "@/components/badge";
import cyToTop from "@/components/totop";
import wxx, { wxMenuShare } from "@/utils/wx";
import { dataURLtoFile } from "@/utils/compression";
import { toKW, fixNumber } from "@/utils/number";
import caseDataList from "@/components/_custom/case/data_list"; //案例列表
import evaluateDataInfo from "@/components/_custom/evaluate/data_info"; //评价列表
import share from "@/components/_custom/share"; //分享
import toBuy from "./buy"; //购买
import luckDraw from "./luck_draw"; //抽奖

export default {
    name: "share_money",
    components: {
        cySwiper,
        music,
        cyCountdown,
        cySticky,
        useStores,
        cyBadge,
        cyToTop,
        caseDataList,
        evaluateDataInfo,
        share,
        toBuy,
        luckDraw
    },
    props: {
        option: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },
    data() {
        return {
            latitude: "", //纬度
            longitude: "", //经度
            address: "", //地址

            orgPk: "", //门店或代理商pk
            shareUserPk: "", //分享人pk
            shareRecordsPk: "", //分享人的浏览pk
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
            buyOption: {}, //自购省钱参数
            showShare: false, //分享弹窗
            displayShare: false, //好友分享弹窗提示
            displayPoster: false, //海报弹窗
            posterOption: {}, //海报配置
            showMore: false, //更多弹窗
            showLuckDraw: false //抽奖弹窗
        };
    },
    created() {},
    mounted() {
        //监听页面后台运行
        document.addEventListener(
            "visibilitychange",
            this.pageVisibilityChange,
            false
        );
    },
    computed: {
        ...mapState(["defaultRole", "user"])
    },
    watch: {
        // option(nVal, oVal) {
        //     console.log('nVal',nVal);
        //     this.getProject(nVal);
        // },
        option: {
            handler(nVal, oVal) {
                this.getProject(nVal);
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        //获取宝贝详情
        async getProject(option) {
            const q = this.$route.query;
            this.shareUserPk = q.shareUserPk || "";
            this.shareRecordsPk = q.shareRecordsPk || "";
            this.isNowBuy = q.isNowBuy || "";
            this.applyPk = q.applyPk || "";

            const miniProgram = q.miniProgram; //=1 从小程序扫码跳过来的
            const qrcodeType = q.qrcodeType; // 二维码类型，=2推广码
            const qrcodePk = q.qrcodePk; // 二维码pk/推广码pk

            let nowTime = "",
                startTime = "",
                endTime = "",
                expireMsg = "",
                expireMsgToast = "",
                expireTime = 0;
            if (option.expireType === "1") {
                //0=长期有效， 1=时间起止
                nowTime = new Date(
                    option.systemTime.replace(/-/g, "/")
                ).getTime();
                startTime = new Date(
                    option.startDate.replace(/-/g, "/") + " 00:00:00"
                ).getTime();
                endTime = new Date(
                    option.endDate.replace(/-/g, "/") + " 23:59:59"
                ).getTime();

                if (startTime >= nowTime) {
                    expireTime = startTime - nowTime;
                    expireMsg = "距离特价开始还有";
                    expireMsgToast = "活动未开始";
                    this.buyDisabled = true;
                } else if (endTime <= nowTime) {
                    expireMsg = "活动已结束";
                    expireMsgToast = "活动已结束";
                    this.buyDisabled = true;
                } else {
                    expireTime = endTime - nowTime;
                    expireMsg = "距离特价结束仅剩";
                    this.buyDisabled = false;
                }
            } else {
                this.buyDisabled = false;
            }

            //设置为非新用户
            this.$store.commit("setUser", {
                ...this.user,
                newUser: "0" //=1新用户
            });
            const priceTx = fixNumber(option.price, 2).split(".");
            const priceText = `${priceTx[0]}${
                !!priceTx[1]
                    ? '<span class="fs-14"> . ' + priceTx[1] + "</span>"
                    : ""
            }`;
            const project = {
                ...option,
                startTime, //开始时间戳
                endTime, //结束时间戳
                nowTime, //当前时间戳
                expireMsg, //倒计时提示
                expireMsgToast, //点击自购省钱倒计时提示
                expireTime, //倒计时间戳
                priceText, //价格文字
                nationRealBuyTimes:
                    option.nationBuyTimes + option.nationRealBuyTimes, //全国购买
                imgList:
                    option.imgVideoList.length > 0
                        ? [option.imgVideoList[0], ...option.imgList]
                        : option.imgList
            };
            //项目信息
            this.project = project;
            //标题
            document.title = this.project.name;

            this.orgPk = option.orgPk;
            this.longitude = option.longitude;
            this.latitude = option.latitude;

            //立即购买 是从体验中心跳过来的
            if (this.isNowBuy === "1") {
                this.showBuy = true;
            }

            if (!option.latitude || !option.longitude) {
                await this.getLocation(); //获取经纬度
            }

            //获取用户地理位置名称
            if (!!this.longitude && !!this.latitude) {
                this.getMapAddress();
            }

            //设置购买参数 无地址
            this.buyOption = {
                applyPk: this.applyPk, //申请体验记录pk --从体验中心跳过来的
                price: this.project.price, //价格
                costPrice: this.project.costPrice, //原价
                orgPk: this.orgPk, //当前代理商/门店pk
                projectPk: this.project.pk, //项目pk
                shareUserPk: this.shareUserPk, //分享人pk
                x: this.longitude,
                y: this.latitude
            };
            //附近可用门店参数
            this.useStoresOption = {
                projectPk: this.project.pk,
                orgPk: this.orgPk, //门店或代理商pk
                x: this.longitude, //经度
                y: this.latitude, //纬度
                shareUserPk: this.shareUserPk,
                nationBuyTimes: this.project.nationBuyTimes //虚拟购买次数
            };

            //新增或修改关注代理商/门店信息
            this.addOrUpdateRelation();

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
            this.browsePk && this.updateBuyOrForwardStatus("browseStatus");

            //获取购买订单的用户
            this.getOrderList();

            //评价参数
            this.evaluateOption = {
                pageSize: 3,
                projectPk: this.project.pk
            };

            //增加更新扫码次数
            if (qrcodeType === "2" && this.orgPk && !!qrcodePk) {
                this.updateScanCount(this.orgPk, qrcodePk);
            }

            this.$toast.clear();
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
        },

        //获取经纬度
        getLocation() {
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
                            "menuItem:copyUrl"
                        ]
                    });

                    wx.getLocation({
                        type: "wgs84",
                        success: res => {
                            this.latitude = res.latitude; //纬度
                            this.longitude = res.longitude; //经度
                            resolve();
                        },
                        cancel: () => {
                            resolve();
                        },
                        fail: err => {
                            resolve();
                        }
                    });
                };
                //微信签名配置
                wxx.wxaccountConfig(setWxConfig);
            });
        },

        //新增或修改关注代理商/门店信息
        addOrUpdateRelation() {
            const params = {
                orgPk: this.orgPk
            };
            this.$api
                .addOrUpdateRelation(params)
                .then(res => {
                    if (
                        this.defaultRole &&
                        this.orgPk === this.defaultRole.defaultOrgPk
                    ) {
                        return;
                    }
                    if (!!this.user.phone) {
                        this.getAccountsUserAndRole();
                    }
                })
                .catch(err => {});
        },

        //获取角色列表
        getAccountsUserAndRole() {
            const params = {
                pk: this.user.pk
            };
            this.$api.getAccountsUserAndRole(params).then(res => {
                //当前角色
                const currentRole = res.obj.roleList.filter(item => {
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
                defaultOrgPk: option.orgPk,
                orgName: option.orgName,
                rolePk: option.rolePk,
                type: option.type,
                nation: this.address.address_component.nation || "", //国家
                province: this.address.address_component.province || "", //省份
                city: this.address.address_component.city || "", //市
                district: this.address.address_component.district || "" //区县
            };
            //修改默认角色
            this.$api
                .addOrUpdateUserRole(params)
                .then(res => {
                    this.$store.commit("setDefaultRole", {
                        ...res.obj,
                        orgName: option.orgName || ""
                    });
                })
                .catch(err => {});
        },

        //获取购买订单的用户列表
        getOrderList() {
            const params = {
                projectPk: "1", //this.project.pk,
                pageNum: 1,
                pageSize: 8
            };
            this.$api
                .getOrderList(params)
                .then(res => {
                    this.buyOption = {
                        ...this.buyOption,
                        orderList: res.obj
                    };
                })
                .catch(err => {});
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
                output: "jsonp"
            };
            this.$jsonp(this.$api.config.TENCENT_MAP_ADDRESS_API, params)
                .then(res => {
                    this.address = res.result;
                    //更新设置购买参数 有地址
                    this.buyOption = {
                        ...this.buyOption,
                        address: this.address.address //地址
                    };
                })
                .catch(err => {});
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
                    errMsg: false
                };
                this.$api
                    .addOrUpdateMyShare(params)
                    .then(res => {
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
                    .catch(err => {
                        reject();
                    });
            });
        },

        //设置分享信息
        setMenuShare() {
            //const setWxConfig = () => {
            let imgUrl = "";
            if (this.project.imgVideoList.length > 0) {
                imgUrl = this.project.imgVideoList[0].imgUrl;
            } else if (this.project.imgList.length > 0) {
                imgUrl = this.project.imgList[0].imgUrl;
            }
            const option = {
                title: this.project.shareTitle,
                desc: this.project.shareDsc,
                link: `?orgPk=${this.orgPk}&shareRecordsPk=${this.browsePk}`, // 分享链接
                imgUrl: imgUrl, // 分享图标
                success: () => {
                    this.updateBuyOrForwardStatus("forwardStatus");
                }
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
                errMsg: false
            };
            this.$api
                .addOrUpdateMyShare(params)
                .then(res => {
                    callback && callback();
                })
                .catch(err => {
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
                errMsg: false
            };
            this.$api
                .posterQrCode(params)
                .then(res => {
                    //海报配置
                    const posterOption = {
                        // posterSummary: this.project.posterSummary.replace(
                        //     /[\n\r]/g,
                        //     "<br/>"
                        // ),
                        projectName: this.project.name,
                        nickName: this.user.nickName,
                        face: this.user.face,
                        shareTitle: this.project.shareTitle,
                        shareDsc: this.project.shareDsc,
                        posterImgList: this.project.posterList,
                        qcode: "data:image/jpg;base64," + res.obj
                    };
                    this.posterOption = posterOption;
                })
                .catch(err => {});
        },

        //获取轮播购买，转发，浏览的用户
        getOrderNotice() {
            const params = {
                projectPk: this.project.pk, //项目pk
                errMsg: false
            };
            this.$api
                .getOrderNotice(params)
                .then(res => {
                    const count = 40;
                    this.orderNoticeList =
                        res.obj.length < count
                            ? this.arrayPadEnd(res.obj, count)
                            : res.obj;
                })
                .catch(err => {});
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
                    .map(item => {
                        if (index > max) {
                            index = 0;
                        }
                        item = {
                            ...data[index]
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
                this.$toast("附近无可用门店");
            }
            if (!this.useStoresTotal) {
                this.useStoresTotal = totle;
            } else {
                this.navOffsetTop();
            }
        },

        //增加更新扫码次数
        updateScanCount(orgPk, qrcodePk) {
            const params = {
                orgPk: orgPk,
                pk: qrcodePk //推广码pk
            };
            this.$api
                .updateScanCount(params)
                .then(res => {})
                .catch(err => {});
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
                this.$toast(this.project.expireMsgToast);
                return;
            }
            this.showBuy = true;
        },

        //底部分享按钮
        onShowShare() {
            if (this.shareDisabled) {
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
                this.project.expireMsg = "距离特价结束仅剩";
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
        }
    },

    //销毁前
    beforeDestroy() {
        if (this.browseTimer) {
            window.clearInterval(this.browseTimer);
            this.browseTimer = null;
        }
    }
};
</script>
<style lang="scss" scoped>
.relative {
    position: relative;
}
.share-money {
    padding-bottom: 70px;
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
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    .item {
        width: 32px;
        height: 32px;
        padding: 5px;
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
    .item-share-price {
        width: auto;
        padding: 5px 10px;
        background: #ff6300;
        color: #fff;
        border-radius: 50px 0 0 50px;
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
    // .top {
    //     position: absolute;
    //     top: 0px;
    //     left: 0px;
    //     padding: 8px 10px;
    //     width: 100%;
    //     display: flex;
    //     justify-content: space-between;
    //     background: linear-gradient(
    //         to top,
    //         rgba(0, 0, 0, 0),
    //         rgba(0, 0, 0, 0.8)
    //     );
    //     .logo {
    //         width: 127px;
    //         height: 22px;
    //     }
    // }
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
.share-costprice {
    .share-price {
        flex: 1;
        position: relative;
        padding: 10px 20px;
        background: #f82647;
        .time-limit {
            display: inline-block;
            width: 52px;
            height: 18px;
            margin: -10px 0 0 5px;
            padding: 1px 0 1px 5px;
            line-height: 14px;
            font-weight: 600;
            font-size: 10px;
            color: #6a0101;
            background: url("../../assets/img/user/orders/label_bg.png")
                no-repeat;
            background-size: 100% 100%;
        }
        .cost-price {
            padding-right: 10px;
            text-decoration: line-through;
            color: #ff9ca9;
        }
    }
    .share-countdown {
        flex: 0 0 150px;
        background: #feeb85;
    }
}
.count-down {
    font-size: 14px;
    line-height: 1;
    color: #cf392c;
    font-weight: bold;
    /deep/span {
        display: inline-block;
        width: 22px;
        height: 20px;
        line-height: 21px;
        margin: 0 2px;
        font-size: 14px;
        text-align: center;
        font-weight: normal;
        background: #8e5626;
        border-radius: 3px;
        color: #ffffff;
        &:first-child {
            width: auto;
            margin: 0px;
            background: transparent;
            color: #cf392c;
            font-weight: bold;
        }
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
    .share-buy-shadow {
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.5);
    }
    .btn-disabled {
        opacity: 1;
    }
}
.share-evaluate {
    min-height: 80vh;
}
.share-more {
    width: 50px;
    height: 50px;
    padding-top: 5px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.5);
    text-align: center;
    color: #666;
    position: fixed;
    right: 15px;
    bottom: 80px;
    z-index: 110;
}
</style>
     