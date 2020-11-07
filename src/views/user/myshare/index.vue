<!--我的分享-->
<template>
    <div class="bg-darkblue">
        <div class="flex hend pd-10">
            <div class="cy-slide-right-in">
                <cy-btn
                    @click.native="showTimeInterval = true"
                    type="blue-gradient"
                    round
                    inline
                    sm
                >
                    <div class="flex center pdlr-5">
                        <cy-icon class="mgr-5" type="calendar" size="20"></cy-icon>
                        <div class="flex center pdl-10 pdr-15">
                            <span v-if="nameTime==='自定义'" class="fs-10 lh12">
                                {{startDate}}
                                <br />
                                {{endDate}}
                            </span>
                            <span v-else>{{nameTime}}</span>
                        </div>
                    </div>
                </cy-btn>
            </div>
        </div>
        <cy-row wrap="wrap" class="pdlr-5 blue fs-12">
            <cy-col :span="8" v-for="(item,index) in totalList" :key="index">
                <div class="data-box bg-blue mglr-5 mgb-10 pdtb-10 cy-zoom-in">
                    <div class="fs-26 ts-blue tc bold">
                        <number-plus class="greenblue" :value="item.value" :step="5"></number-plus>
                    </div>
                    <div class="tc">{{item.title}}</div>
                    <div class="data-border-line border-lt"></div>
                    <div class="data-border-line border-rt"></div>
                    <div class="data-border-line border-lb"></div>
                    <div class="data-border-line border-rb"></div>
                </div>
            </cy-col>
        </cy-row>

        <!-- 分享列表 -->
        <div class="mgb-20">
            <cy-row class="head pdlr-5" :gutter="5">
                <cy-col class="flex center" v-for="(item,index) in headList" :key="index">
                    <div @click="onItemClick(index)" class="flex center blue lh1">
                        <div class="item">
                            <div :class="{'greenblue':index===curTabIndex}">
                                {{item.name}}
                                <span v-if="item.unit" class="unit">({{item.unit}})</span>
                            </div>
                            <cy-badge v-if="item.total" :text="item.total" class="badge"></cy-badge>
                        </div>
                    </div>
                </cy-col>
            </cy-row>

            <div v-if="curTabIndex===0">
                <div v-show="!!totalFunnel" class="funnel white cy-slide-right-in">
                    <div class="bg-funnel">
                        <cy-image
                            :src="require('@/assets/img/user/myshare/bg_blue.png')"
                            :lazy="false"
                        ></cy-image>
                    </div>
                    <div class="item cy-zoom-in ani-d-1">
                        <div>浏览次数</div>
                        {{totalFunnel.browseStatusSum}}
                    </div>
                    <div class="item cy-zoom-in ani-d-2">
                        <div>转发次数</div>
                        {{totalFunnel.forwardStatusSum}}
                    </div>
                    <div class="item cy-zoom-in ani-d-3">
                        <div>浏览人数</div>
                        {{totalFunnel.browseNumSum}}
                    </div>
                    <div class="item cy-zoom-in ani-d-4">
                        <div>转发人数</div>
                        {{totalFunnel.forwardNumCount}}
                    </div>
                    <div class="item cy-zoom-in ani-d-5">
                        <div>成交人数</div>
                        {{totalFunnel.buyNumCount}}
                    </div>
                    <div class="item cy-zoom-in ani-d-6">
                        <div>成交单数</div>
                        {{totalFunnel.purchaseQuantitySum}}
                    </div>
                </div>
            </div>

            <cy-pullup-loading
                v-else
                @loadmore="onLoadmore"
                :dataList="dataList"
                :hasMore="isHasMore"
                :isLoading="isLoading"
                :noMore="false"
            >
                <ul class="data-list">
                    <li
                        v-for="(item,index) in dataList"
                        @click="linkTo(item.userPk,item.status)"
                        :key="index"
                        class="cy-slide-right-in"
                        :class="'ani-d-'+(index%pageSize+1)"
                    >
                        <div class="item-img">
                            <cy-image :src="item.face" round width="30px"></cy-image>
                        </div>
                        <div class="item-l">
                            <div class="pdl-15">
                                <div class="fs-14">
                                    {{item.userName}}
                                    <cy-btn
                                        v-if="item.forwardStatus === '1'"
                                        class="mgl-5 pdlr-10"
                                        type="white"
                                        plain
                                        round
                                        xxs
                                    >转发过</cy-btn>
                                    <cy-btn
                                        v-if="item.buyStatus === '1'"
                                        class="mgl-5 pdlr-10"
                                        type="white"
                                        plain
                                        round
                                        xxs
                                    >购买过</cy-btn>
                                </div>
                                <div>
                                    {{curTabIndex === 1?'浏览':curTabIndex === 2?'转发':'购买'}}
                                    {{curTabIndex === 1?item.browseStatusCount:curTabIndex === 2?item.forwardStatusCount:item.buyStatusCount}}次，共浏览
                                    <span v-html="item.browseTimes"></span> | 
                                    <span>{{item.createTime}}</span>
                                    
                                </div>
                                <div v-if="!!item.address" class="flex vcenter">
                                    <cy-icon type="location1" size="13"></cy-icon>
                                    <div class="address pdl-5 hidden-1">
                                        <span v-if="!!item.distance">{{item.distance}}km</span>
                                        {{item.address}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="item-r">
                            <cy-icon type="youjiantou" color="#ffffff" size="10"></cy-icon>
                        </div>
                    </li>
                </ul>
            </cy-pullup-loading>
        </div>

        <!-- 结束时间 -->
        <cy-popup-datetime
            clear-text="结束时间"
            v-model="endDate"
            :start-date="startDate"
            :show.sync="showEndDate"
            format="YYYY-MM-DD"
            year-row="{value}年"
            month-row="{value}月"
            day-row="{value}日"
            @onConfirm="onConfirmEndTime"
        ></cy-popup-datetime>

        <!-- 开始时间 -->
        <cy-popup-datetime
            clear-text="开始时间"
            v-model="startDate"
            :show.sync="showStartDate"
            format="YYYY-MM-DD"
            year-row="{value}年"
            month-row="{value}月"
            day-row="{value}日"
            @onConfirm="onConfirmStartTime"
        ></cy-popup-datetime>

        <!-- 选择日期时段 :type="3"-->
        <date-interval :show.sync="showTimeInterval" @onChange="onChangeTime"></date-interval>
    </div>
</template>

<script>
import cyPullupLoading from "@/components/pullup_loading";
import numberPlus from "@/components/_custom/mydata/number_plus"; //数字加
import cyBadge from "@/components/badge";
//import cyPopupDatetime from "@/components/popup_datetime";
import dateInterval from "@/components/_custom/mydata/date_interval";
import { MixinPage } from "@/utils/mixins/index";
import wxx from "@/utils/wx";
import { semantics } from "@/utils/formatDate";
import { getDateInterval } from "@/utils/formatDate";

export default {
    name: "myshare",
    mixins: [MixinPage],
    components: {
        cyPullupLoading,
        numberPlus,
        //cyPopupDatetime,
        dateInterval,
        cyBadge,
    },
    data() {
        return {
            downOption: {
                use: false,
            },
            upOption: {
                auto: false,
            },
            totalList: [
                {
                    title: "带来购买人数(人)",
                    value: 0,
                },
                {
                    title: "产生购买(元)",
                    value: 0,
                },
                {
                    title: "分享返利(元)",
                    value: 0,
                },
            ],
            totalFunnel: "",
            headList: [],
            curTabIndex: 0, //选中tab
            dataList: [],

            dataDto: "",
            showTimeInterval: false,
            nameTime: "",
            startDate: "",
            endDate: "",
            showStartDate: false,
            showEndDate: false,
            keyword: "",

            latitude: "", // 纬度
            longitude: "", // 经度
        };
    },
    created() {
        this.init();
    },
    mounted() {},
    watch: {},
    computed: {},
    methods: {
        async init() {
            await this.getLocation();
            const type = 3; //=3是默认7天
            this.nameTime = "7天";
            const { endDate, startDate } = getDateInterval(3);
            this.startDate = startDate;
            this.endDate = endDate;
            this.getMyShareStatistical();
            this.getMyShareFunnel();
            this.getDataList();
        },

        getLocation() {
            return new Promise(async (resolve, reject) => {
                // 获取经纬度
                const getLocation = () => {
                    wx.getLocation({
                        type: "wgs84",
                        success: (res) => {
                            this.latitude = res.latitude; // 纬度
                            this.longitude = res.longitude; // 经度
                            resolve();
                        },
                        cancel: () => {
                            resolve();
                        },
                        fail: () => {
                            resolve();
                        },
                    });
                };
                //签名配置
                wxx.wxaccountConfig(getLocation);
            });
        },

        //统计数据
        getMyShareStatistical() {
            const params = {
                //userName: this.keyword,
                x: this.longitude,
                y: this.latitude,
                startTime: this.startDate,
                endTime: this.endDate,
            };
            this.$api
                .getMyShareStatistical(params)
                .then((res) => {
                    const dataDto = res.obj.dataDto;
                    this.totalList = [
                        {
                            title: "带来购买人数(人)",
                            value: dataDto.buyCount,
                        },
                        {
                            title: "产生购买(元)",
                            value: dataDto.moneySum,
                        },
                        {
                            title: "分享返利(元)",
                            value: dataDto.rewardMoneySum,
                        },
                    ];
                    const headDataDto = res.obj.headDataDto;
                    this.headList = [
                        {
                            name: "漏斗",
                            unit: "",
                            tabIndex: 0,
                            status: "funnelStatus",
                            total: 0,
                        },
                        {
                            name: "浏览",
                            unit: "次",
                            tabIndex: 1,
                            status: "browseStatus",
                            total: headDataDto.browseStatusSum>99?'99+':headDataDto.browseStatusSum,
                        },
                        {
                            name: "转发",
                            unit: "次",
                            tabIndex: 2,
                            status: "forwardStatus",
                            total: headDataDto.forwardStatusSum>99?'99+':headDataDto.forwardStatusSum
                        },
                        {
                            name: "购买",
                            unit: "次",
                            tabIndex: 3,
                            status: "buyStatus",
                            total: headDataDto.buyStatusCount>99?'99+':headDataDto.buyStatusCount,
                        },
                    ];
                })
                .catch((err) => {});
        },

        //漏斗数据统计
        getMyShareFunnel() {
            const params = {
                startTime: this.startDate,
                endTime: this.endDate,
            };
            this.$api
                .getMyShareFunnel(params)
                .then((res) => {
                    this.totalFunnel = res.obj;
                })
                .catch((err) => {});
        },

        //获取列表
        getDataList(curStatus = "funnelStatus") {
            //this.$toast.loading("加载中…");
            if (this.pageNum === 1) {
                this.isLoading = true;
                this.dataList = [];
            }
            const params = {
                userName: this.keyword,
                x: this.longitude, //"22.72174",
                y: this.latitude, //"114.06031",
                startTime: this.startDate,
                endTime: this.endDate,
                [curStatus]: 1, // 状态
                pageNum: this.pageNum,
                pageSize: this.pageSize,
            };
            this.$api
                .getMyShare(params)
                .then((res) => {
                    this.total = res.total;
                    this.isLoading = false;
                    if (
                        res.obj.length < params.pageSize ||
                        params.pageNum === this.total
                    ) {
                        this.isHasMore = false;
                    } else {
                        this.isHasMore = true;
                    }
                    const dataList = res.obj.map((item) => {
                        item.browseTimes = this.toTimeStr(
                            item.browseTimes * 1000
                        );
                        item.distance = !!this.longitude
                            ? (item.distance / 1000).toFixed(2) + ""
                            : false;
                        item.status = curStatus    
                        return item;
                    });
                    this.dataList = this.dataList.concat(dataList);
                    this.$toast.clear();
                })
                .catch((err) => {});
        },

        //切换tab
        onItemClick(tabIndex) {
            if (this.curTabIndex !== tabIndex) {
                this.dataList = [];
                this.curTabIndex = tabIndex;
                this.pageNum = 1;
                // 状态
                const curStatus = this.headList.filter((item) => {
                    return item.tabIndex === this.curTabIndex;
                })[0].status;
                this.getDataList(curStatus);
            }
        },

        toTimeStr(time) {
            let [days, hours, minutes, seconds] = semantics(time);
            return (
                (days > 0 ? this.fill2(days) + "天" : "") +
                (hours > 0 ? this.fill2(hours) + "时" : "") +
                (minutes > 0 ? this.fill2(minutes) + "分" : "") +
                (seconds > 0 ? this.fill2(seconds) + "秒" : "")
            );
        },

        fill2(v) {
            if (v > 0 && v < 10) {
                v = "0" + v;
            }
            return v;
        },

        //选择日期
        onChangeTime(item) {
            if (item) {
                this.showTimeInterval = false;
                if (item.type !== 99) {
                    //=99 自定义
                    this.pageNum = 1;
                    this.nameTime = item.name;
                    setTimeout(() => {
                        this.startDate = item.startDate;
                        this.endDate = item.endDate;
                        this.getMyShareStatistical();
                        this.getMyShareFunnel();
                        // 状态
                        const curStatus = this.headList.filter((item) => {
                            return item.tabIndex === this.curTabIndex;
                        })[0].status;
                        this.getDataList(curStatus);
                    }, 0);
                } else {
                    this.showStartDate = true;
                }
            }
        },

        //确认开始时间
        onConfirmStartTime(v) {
            this.showEndDate = true;
        },

        //确认结束时间
        onConfirmEndTime() {
            this.pageNum = 1;
            this.nameTime = "自定义";
            this.getMyShareStatistical();
            this.getDataList();
        },

        //搜索
        onSearch() {
            this.pageNum = 1;
            this.getMyShareStatistical();
            this.getDataList();
        },

        //跳转详情
        linkTo(userPk,status) {
            this.$router.push({
                path: "/myshare/detail",
                query: {
                    status: status,
                    browseUserPk: userPk,
                    startDate: this.startDate,
                    endDate: this.endDate,
                },
            });
        },
    },

    //设置页面缓存
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$store.commit("setKeepAlive", ["myshare"]);
        });
    },

    //清除页面缓存
    beforeRouteLeave(to, from, next) {
        if (to.path !== "/myshare/detail") {
            this.$store.commit("setKeepAlive", []);
        }
        next();
    }
};
</script>
<style lang="scss" scoped>
.head {
    background: #04233d;
    padding: 18px 0;
    height: 49px;
    .item {
        position: relative;
        .greenblue {
            white-space: nowrap;
            &::before {
                position: absolute;
                content: "";
                bottom: -6px;
                height: 2px;
                width: 90%;
                border-radius: 10px;
                background: linear-gradient(295deg, #3f8bfd 0%, #29d7a8 100%);
            }
        }
        .badge {
            position: absolute;
            top: -10px;
            right: -12px;
            transform: scale(0.8);
        }
    }
}
.funnel {
    position: relative;
    width: 302px;
    height: 360px;
    margin: 20px auto;
    text-align: center;
    z-index: 1;
    .item {
        height: 44px;
        margin-bottom: 14px;
        padding-top: 8px;
        line-height: 1.2;
        &:last-child {
            padding-top: 20px;
        }
    }
    .bg-funnel {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
}
.data-box {
    position: relative;
    border: solid 1px #0a4373;
    &.bg-blue {
        background: #032038;
    }
    .data-border-line {
        position: absolute;
        z-index: 1;
        width: 8px;
        height: 8px;
        border-color: #42e6ff;
        border-style: solid;
        border-width: 0px;
        background: rgba(0, 0, 0, 0);
        &.border-lt {
            top: -1px;
            left: -1px;
            border-top-width: 1px;
            border-left-width: 1px;
        }
        &.border-rt {
            top: -1px;
            right: -1px;
            border-top-width: 1px;
            border-right-width: 1px;
        }
        &.border-rb {
            bottom: -1px;
            right: -1px;
            border-bottom-width: 1px;
            border-right-width: 1px;
        }
        &.border-lb {
            bottom: -1px;
            left: -1px;
            border-bottom-width: 1px;
            border-left-width: 1px;
        }
    }
}

.data-list {
    li {
        position: relative;
        display: flex;
        align-items: center;
        padding: 10px 15px;
        font-size: 12px;
        color: #ffffff;
        background: #032038;
        &:nth-child(2n) {
            background: #04233d;
        }
        .item-img {
            flex: 0 0 30px;
            height: 30px;
        }
        .item-l {
            flex: 1;
            line-height: 25px;
            .address {
                width: 250px;
            }
        }
        .item-r {
            flex: 0 0 25px;
            text-align: right;
        }
    }
}
</style>
