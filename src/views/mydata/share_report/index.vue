<!--分享效果报表-->
<template>
    <div class="min-h101 mgb-30">
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
            <div class="data-box pd-10 mgb-10">
                <div class="title blue bold tc fs-15">
                    平台返现 (元)
                    <span class="year">{{year}}</span>
                </div>
                <cy-echarts-line :option="cashOption" height="300px"></cy-echarts-line>
                <div v-if="shareOption.dataZoom[0].show" class="mgt-5 fs-12 tc grey">可左右滑动查看数据</div>
                <div class="data-border-line border-lt"></div>
                <div class="data-border-line border-rt"></div>
                <div class="data-border-line border-lb"></div>
                <div class="data-border-line border-rb"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { dateDiffDate, dateDiffDays } from "@/utils/formatDate";
import { sub, mul, div } from "@/utils/number";
import numberPlus from "@/components/_custom/mydata/number_plus"; //数字加
import cyEchartsLine from "@/components/echarts/line"; //线性

export default {
    name: "share_report",
    components: {
        numberPlus,
        cyEchartsLine,
    },
    props: {
        option: Object,
    },
    data() {
        return {
            year: "", //搜索年份
            params: {
                shareUserPk: "", //车主pk(车主运营数据必传)
                type: "", //时间类型：0=小时 1=天 2=月 3=年
                startTime: "",
                endTime: "",
            },
            totalList: [],
            //分享数据，购买/转发/浏览
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
            //返现金额数据
            cashOption: {
                tooltip: {
                    trigger: "axis",
                    formatter: "{b0}<br/> {a0}: {c0}元",
                },
                legend: {
                    data: ["返现"],
                },
                series: [
                    {
                        name: "返现",
                        data: [],
                    },
                ],
            },
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
                res.obj.shareReportTimesList.forEach((item,index) => {
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
                //平台返现
                let rewardMoneySum = [];
                let rewardMoneySumIndex = 0;
                res.obj.shareReportRewardMoneySumList.forEach((item, index) => {
                    //第几个开始数据大于0
                    if (item.rewardMoneySum > 0 && rewardMoneySumIndex === 0) {
                        rewardMoneySumIndex = index;
                    }
                    rewardMoneySum.push(item.rewardMoneySum);
                });
                const rewardMoneySumZoom = this.xAxisDataZoom(
                    xAxis.length,
                    rewardMoneySumIndex
                );
                this.cashOption = {
                    ...this.cashOption,
                    xAxis: {
                        data: xAxis,
                    },
                    dataZoom: rewardMoneySumZoom,
                    series: [
                        {
                            data: rewardMoneySum,
                        },
                    ],
                };
                this.$toast.clear();
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
</style>
