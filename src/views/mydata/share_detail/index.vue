<!--分享效果详情-->
<template>
    <div class="min-h101 mgb-30">
        <!-- 数据统计 -->
        <cy-row wrap="wrap" class="pdlr-5 blue fs-12">
            <cy-col :span="12" v-for="(item,index) in totalList" :key="index">
                <div class="data-box bg-blue mglr-5 mgb-10 pd-10 cy-zoom-in">
                    <div class="flex between">
                        <span>环比{{(item.currentValue>=0?'+':'-')+item.currentValue}}</span>
                        <span class="flex vcenter" :class="item.ratio<0?'red':'blue'">
                            <cy-icon
                                v-if="item.ratio>0"
                                class="cy-up mgr-3"
                                type="wangshang"
                                color="#52A0FF"
                                :size="12"
                            ></cy-icon>
                            <cy-icon v-if="item.ratio<0" type="wangxia" color="#FF5F5F" :size="12"></cy-icon>
                            {{item.ratio}}%
                        </span>
                    </div>
                    <div class="fs-26 ts-blue tc bold">
                        <number-plus class="greenblue" :value="item.value"></number-plus>
                    </div>
                    <div class="tc">{{item.title}}({{item.unit}})</div>
                    <div class="data-border-line border-lt"></div>
                    <div class="data-border-line border-rt"></div>
                    <div class="data-border-line border-lb"></div>
                    <div class="data-border-line border-rb"></div>
                </div>
            </cy-col>
        </cy-row>
        <div class="pdlr-10">
            <div class="data-box pd-10 mgb-10 cy-slide-right-in ani-d-5">
                <div class="title blue bold tc fs-15">
                    浏览/转发/购买 (次)
                    <span class="year">{{year}}</span>
                </div>
                <cy-echarts-line :option="shareOption" height="300px"></cy-echarts-line>
                <div v-if="shareOption.dataZoom[0].show" class="mgt-5 fs-12 tc grey">可左右滑动查看数据</div>
                <div class="data-border-line border-lt"></div>
                <div class="data-border-line border-rt"></div>
                <div class="data-border-line border-lb"></div>
                <div class="data-border-line border-rb"></div>
            </div>
        </div>

        <!-- 数据列表 -->
        <cy-pullup-loading
            :isPullLoadMore="false"
            @loadmore="onLoadmore"
            :hasMore="isHasMore"
            :isLoading="isLoading"
            :noMore="false"
            :dataList="dataList"
        >
            <data-list :headList="headList" @sort="onSort">
                <div class="data-list">
                    <div class="item pd-5" v-for="(item,index) in dataList" :key="index">
                        <cy-row
                            :gutter="5"
                            class="white fs-15 tc cy-slide-right-in"
                            :class="'ani-d-'+(index%pageSize)"
                        >
                            <cy-col class="flex center w60">
                                <cy-image
                                    v-if="item.rank===1"
                                    class="cy-rotate-rank ani-d-1"
                                    :src="require('@/assets/img/mydata/one_icon.png')"
                                    width="25px"
                                    height="28px"
                                ></cy-image>
                                <cy-image
                                    v-else-if="item.rank===2"
                                    class="cy-rotate-rank ani-d-3"
                                    :src="require('@/assets/img/mydata/two_icon.png')"
                                    width="25px"
                                    height="25px"
                                ></cy-image>
                                <cy-image
                                    v-else-if="item.rank===3"
                                    class="cy-rotate-rank ani-d-5"
                                    :src="require('@/assets/img/mydata/three_icon.png')"
                                    width="25px"
                                    height="25px"
                                ></cy-image>
                                <span v-else>{{item.rank}}</span>
                            </cy-col>
                            <cy-col>
                                <div>￥{{item.rewardMoneyTotalSum}}</div>
                                <div class="flex center">
                                    <span class="assist lightblue">{{item.rewardMoneyLastSum}}</span>
                                    <span
                                        class="assist"
                                        :class="item.rewardMoneyRatio<0?'red':'skyblue'"
                                    >
                                        <cy-icon
                                            v-if="item.rewardMoneyRatio>0"
                                            type="wangshang"
                                            color="#52A0FF"
                                            :size="7"
                                        ></cy-icon>
                                        <cy-icon
                                            v-if="item.rewardMoneyRatio<0"
                                            type="wangxia"
                                            color="#FF5F5F"
                                            :size="7"
                                        ></cy-icon>
                                        {{item.rewardMoneyRatio}}%
                                    </span>
                                </div>
                                <div class="mgt-5 hidden-1 lh12 fs-12">{{item.userName}}</div>
                            </cy-col>
                            <cy-col>
                                <div>{{item.browseTotalCount}}</div>
                                <div class="flex center">
                                    <span class="assist lightblue">{{item.browseLastCount}}</span>
                                    <div class="assist" :class="item.browseRatio<0?'red':'skyblue'">
                                        <cy-icon
                                            v-if="item.browseRatio>0"
                                            type="wangshang"
                                            color="#52A0FF"
                                            :size="7"
                                        ></cy-icon>
                                        <cy-icon
                                            v-if="item.browseRatio<0"
                                            type="wangxia"
                                            color="#FF5F5F"
                                            :size="7"
                                        ></cy-icon>
                                        {{item.browseRatio}}%
                                    </div>
                                </div>
                            </cy-col>
                            <cy-col>
                                <div>{{item.forwardTotalCount}}</div>
                                <div class="flex center">
                                    <span class="assist lightblue">{{item.forwardLastCount}}</span>
                                    <span
                                        class="assist"
                                        :class="item.forwardRatio<0?'red':'skyblue'"
                                    >
                                        <cy-icon
                                            v-if="item.forwardRatio>0"
                                            type="wangshang"
                                            color="#52A0FF"
                                            :size="7"
                                        ></cy-icon>
                                        <cy-icon
                                            v-if="item.forwardRatio<0"
                                            type="wangxia"
                                            color="#FF5F5F"
                                            :size="7"
                                        ></cy-icon>
                                        {{item.forwardRatio}}%
                                    </span>
                                </div>
                            </cy-col>
                            <cy-col>
                                <div>{{item.buyTotalCount}}</div>
                                <div class="flex center">
                                    <span class="assist lightblue">{{item.buyLastCount}}</span>
                                    <div class="assist" :class="item.buyRatio<0?'red':'skyblue'">
                                        <cy-icon
                                            v-if="item.buyRatio>0"
                                            type="wangshang"
                                            color="#52A0FF"
                                            :size="7"
                                        ></cy-icon>
                                        <cy-icon
                                            v-if="item.buyRatio<0"
                                            type="wangxia"
                                            color="#FF5F5F"
                                            :size="7"
                                        ></cy-icon>
                                        {{item.buyRatio}}%
                                    </div>
                                </div>
                            </cy-col>
                        </cy-row>
                    </div>
                </div>
            </data-list>
        </cy-pullup-loading>
    </div>
</template>

<script>
import { dateDiffDate, dateDiffDays } from "@/utils/formatDate";
import { sub, mul, div } from "@/utils/number";
import cyPullupLoading from "@/components/pullup_loading"; //加载更多
import numberPlus from "@/components/_custom/mydata/number_plus"; //数字加
import cyEchartsLine from "@/components/echarts/line"; //echart线性
import dataList from "@/components/_custom/mydata/data_list"; //数据列表
import { MixinPage } from "@/utils/mixins/index";

export default {
    name: "share_detail",
    mixins: [MixinPage],
    components: {
        cyPullupLoading,
        numberPlus,
        cyEchartsLine,
        dataList,
    },
    props: {
        option: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    data() {
        return {
            pageSize: 3,
            totalList: [],
            year: "", //搜索年份
            dataListParams: {
                startTime: "",
                endTime: "",
                orderBy: "0", //0 = 返现， 1=浏览， 2=转发， 3=购买次数
                orderType: "0", //0=降序 1=升
                pageNum: "",
                pageSize: "",
            },
            shareOption: {
                tooltip: {
                    trigger: "axis",
                    formatter:
                        "{b0}<br/> {a0}: {c0}次<br/> {a1}: {c1}次<br/> {a2}: {c2}次",
                },
                legend: {
                    data: ["浏览", "转发", "购买"],
                },
                dataZoom: [{ show: false }],
                xAxis: {
                    data: [],
                },
                series: [
                    {
                        name: "浏览",
                        type: "line",
                        color: "#F06061",
                        data: [],
                    },
                    {
                        name: "转发",
                        type: "line",
                        color: "#6BBD7E",
                        data: [],
                    },
                    {
                        name: "购买",
                        type: "line",
                        color: "#0091FF",
                        data: [],
                    },
                ],
            },
            headList: [
                {
                    pk: "-1",
                    name: "排名",
                    unit: "",
                    sort: false,
                    rank: true, //排名标识
                },
                {
                    pk: "0",
                    name: "返现",
                    unit: "元",
                    sort: "0", //-1不排序 0=降序 1=升
                    color: "grey",
                },
                {
                    pk: "1",
                    name: "浏览",
                    unit: "次",
                    sort: "-1",
                    color: "red",
                },
                {
                    pk: "2",
                    name: "转发",
                    unit: "次",
                    sort: "-1",
                    color: "green",
                },
                {
                    pk: "3",
                    name: "购买",
                    unit: "次",
                    sort: "-1",
                    color: "grey",
                },
            ],
            dataList: [],
            tmpTime: {},
        };
    },
    created() {},
    watch: {
        option: {
            handler(nVal, oVal) {
                this.pageNum = 1;
                this.tmpTime = nVal;
                this.year = nVal.year;
                this.shareReport(nVal);
                this.getDataList(nVal);
            },
            immediate: true,
            deep: true,
        },
    },
    computed: {},
    methods: {
        //外部主动更新数据
        updateData(option) {
            //时间不一致时更新
            if (
                option.startTime != this.tmpTime.startTime ||
                option.endTime != this.tmpTime.endTime
            ) {
                this.$toast("时间变化，数据正在更新");
                this.pageNum = 1;
                this.tmpTime = option;
                this.shareReport(option);
                this.getDataList(option);
                return true;
            }
            return false;
        },

        //获取分享效果报表信息
        shareReport(option = {}) {
            //this.$toast.loading("加载中…");
            this.params = {
                ...this.params,
                ...option,
            };
            this.$api.shareReport(this.params).then((res) => {
                const [
                    browseCountCurrentValue,
                    browseCountRatio,
                ] = this.computeRatio(
                    res.obj.browseCountSum,
                    res.obj.browseCountLastSum
                );
                const [
                    forwardCountCurrentValue,
                    forwardCountRatio,
                ] = this.computeRatio(
                    res.obj.forwardCountSum,
                    res.obj.forwardCountLastSum
                );
                const [buyCountCurrentValue, buyCountRatio] = this.computeRatio(
                    res.obj.buyCountSum,
                    res.obj.buyCountLastSum
                );
                const [
                    rewardMoneyCurrentValue,
                    rewardMoneyRatio,
                ] = this.computeRatio(
                    res.obj.rewardMoneySum,
                    res.obj.rewardMoneyLastSum
                );

                this.totalList = [
                    {
                        title: "浏览",
                        unit: "次",
                        value: res.obj.browseCountTotalSum,
                        currentValue: browseCountCurrentValue,
                        ratio: browseCountRatio, //环比率
                    },
                    {
                        title: "转发",
                        unit: "次",
                        value: res.obj.forwardCountTotalSum,
                        currentValue: forwardCountCurrentValue,
                        ratio: forwardCountRatio,
                    },
                    {
                        title: "购买",
                        unit: "次",
                        value: res.obj.buyCountTotalSum,
                        currentValue: buyCountCurrentValue,
                        ratio: buyCountRatio,
                    },
                    {
                        title: "获得返现",
                        unit: "元",
                        value: res.obj.rewardMoneyTotalSum,
                        currentValue: rewardMoneyCurrentValue,
                        ratio: rewardMoneyRatio,
                    },
                ];
                //购买/转发/浏览
                let xAxis = [],
                    browseCount = [],
                    buyCount = [],
                    forwardCount = [];
                const nowHours = new Date().getHours() + 1;
                let xIndex = 0;
                res.obj.shareReportTimesList.forEach((item, index) => {
                    if (option.timeType === 0) {
                        //timeType=0今天 只显示当前小时前的
                        item.statisticTime <= nowHours &&
                            xAxis.push(
                                item.statisticTime +
                                    (option.type === 0 ? ":00" : "")
                            );
                    } else {
                        let statistic = item.statisticTime.split("-");
                        let statisticTime =
                            statistic.length === 3
                                ? statistic[1] + "-" + statistic[2]
                                : statistic[0];
                        xAxis.push(
                            statisticTime + (option.type === 0 ? ":00" : "")
                        );
                    }
                    //第几个开始数据大于0
                    if (
                        (item.browseCount > 0 ||
                            item.buyCount > 0 ||
                            item.forwardCount > 0) &&
                        xIndex === 0
                    ) {
                        xIndex = index;
                    }
                    browseCount.push(item.browseCount);
                    buyCount.push(item.buyCount);
                    forwardCount.push(item.forwardCount);
                });
                //x轴移动
                const dataZoom = this.xAxisDataZoom(xAxis.length, xIndex);
                this.shareOption = {
                    ...this.shareOption,
                    xAxis: {
                        data: xAxis,
                    },
                    dataZoom: dataZoom,
                    series: [
                        {
                            data: browseCount,
                        },
                        {
                            data: forwardCount,
                        },
                        {
                            data: buyCount,
                        },
                    ],
                };
                this.$toast.clear();
            });
        },

        //X轴是否可左右移动
        xAxisDataZoom(length, startValue) {
            let dataZoom = [{ show: false, start: 0, end: 100 }];
            if (length > 8) {
                let start = Math.ceil((startValue / length) * 100);
                start = start - 5 > 0 ? start - 5 : 0;
                const step = (60 / length) * 10;
                let end = start + step > 100 ? 100 : Math.ceil(start + step);
                dataZoom = [{ show: true, start: start, end: end }];
            }
            return dataZoom;
        },

        // //X轴是否可左右移动
        // xAxisDataZoom(length) {
        //     let dataZoom = [{ show: false, end: 100 }];
        //     if (length > 10) {
        //         let zoomEnd = Math.ceil(100 - (length / (length + 20)) * 100);
        //         return [{ show: true, end: zoomEnd }];
        //     }
        //     return dataZoom;
        // },

        //获取分享详情列表
        getDataList(option = {}) {
            if (this.pageNum === 1) {
                this.dataList = [];
            }
            this.dataListParams = {
                ...this.dataListParams,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                ...option,
            };
            this.$api
                .shareDetail(this.dataListParams)
                .then((res) => {
                    this.total = res.total;
                    this.isLoading = false;
                    if (
                        res.obj.page.length < this.pageSize ||
                        this.pageNum === this.total
                    ) {
                        this.isHasMore = false;
                    } else {
                        this.isHasMore = true;
                    }
                    const list = res.obj.page.map((item) => {
                        const [
                            rewardMoneyCurrentValue,
                            rewardMoneyRatio,
                        ] = this.computeRatio(
                            item.rewardMoneySum,
                            item.rewardMoneyLastSum
                        );
                        item.rewardMoneyRatio = rewardMoneyRatio;
                        item.rewardMoneyLastSum =
                            (rewardMoneyCurrentValue >= 0 ? "+" : "") +
                            rewardMoneyCurrentValue;

                        const [
                            browseCurrentValue,
                            browseRatio,
                        ] = this.computeRatio(
                            item.browseCount,
                            item.browseLastCount
                        );
                        item.browseRatio = browseRatio;
                        item.browseLastCount =
                            (browseCurrentValue >= 0 ? "+" : "") +
                            browseCurrentValue;

                        const [
                            forwardCurrentValue,
                            forwardRatio,
                        ] = this.computeRatio(
                            item.forwardCount,
                            item.forwardLastCount
                        );
                        item.forwardRatio = forwardRatio;
                        item.forwardLastCount =
                            (forwardCurrentValue >= 0 ? "+" : "") +
                            forwardCurrentValue;

                        const [buyCurrentValue, buyRatio] = this.computeRatio(
                            item.buyCount,
                            item.buyLastCount
                        );
                        item.buyRatio = buyRatio;
                        item.buyLastCount =
                            (buyCurrentValue >= 0 ? "+" : "") + buyCurrentValue;
                        return item;
                    });
                    this.dataList = this.dataList.concat(list);
                })
                .catch((err) => {
                    //this.isHasMore = false;
                });
        },

        //计算环比 val1=当期数，val2=上期数
        computeRatio(val1, val2) {
            const currentValue = val1;
            const ratio =
                val2 === 0
                    ? "- "
                    : mul(
                          div(
                              Math.round(
                                  mul(div(sub(val1, val2), val2 || 1), 100)
                              ),
                              100
                          ),
                          100
                      );
            return [currentValue, ratio];
        },

        //排序
        onSort(pk, sort) {
            this.isLoading = true;
            var sortTmp = "0";
            const headList = this.headList.map((item) => {
                let obj = {
                    pk: item.pk,
                    name: item.name,
                    unit: item.unit,
                    rank: item.rank,
                };
                if (item.pk === pk) {
                    sort === "0" ? (obj.sort = "1") : (obj.sort = "0");
                    sortTmp = obj.sort;
                } else {
                    if (!!item.sort) {
                        obj.sort = "-1";
                    } //-1不排序 0=降序 1=升
                }
                return obj;
            });
            this.headList = headList;
            const option = {
                orderBy: pk, //0 = 返现， 1=浏览， 2=转发， 3=购买次数
                orderType: sortTmp, //0=降序 1=升
            };
            this.pageNum = 1;
            this.getDataList(option);
        },

        // //条件搜索
        // onChangeSearch(option) {
        //     this.pageNum = 1;
        //     //计算日期相差天数
        //     const days = dateDiffDays(option.startTime, option.endTime);
        //     //计算days天前的日期
        //     option.startLastTime = dateDiffDate(option.startTime, -days);
        //     option.endLastTime = dateDiffDate(option.startTime, -1);

        //     this.totalOption = option;
        //     this.getDataList(option);
        // },
    },
};
</script>
<style lang="scss" scoped>
.data-box {
    position: relative;
    border: solid 1px #0a4373;
    &.bg-blue {
        background: #032038;
    }
    .title {
        height: 32px;
        position: relative;
        color: #33b8cc;
        text-shadow: 0px 0px 10px #006890;
        border-bottom: solid 1px #0a4373;
        &::after,
        &::before {
            position: absolute;
            content: "";
            bottom: -2px;
            width: 3px;
            height: 3px;
            background: #066ec3;
        }
        &::after {
            left: 0;
        }
        &::before {
            right: 0;
        }
        .year {
            position: absolute;
            right: 5px;
            top: 50%;
            transform: translateY(-50%);
            color: #ffffff;
            font-size: 12px;
            font-weight: 400;
        }
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
    .item {
        background: #032038;
        &:nth-child(2n) {
            background: #04233d;
        }
        .w60 {
            width: 60px;
            flex: 0 0 60px;
        }
        .assist {
            display: flex;
            align-items: center;
            padding: 0px 5px;
            margin: 0 1px;
            border-radius: 50px;
            font-size: 10px;
            background: #00192d;
            white-space: nowrap;
        }
    }
}
</style>
