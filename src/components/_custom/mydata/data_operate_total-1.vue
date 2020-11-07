<!--运营数据统计图表-->
<template>
     
        <div class="data-box bg-blue mglr-10 mgb-10 pd-10">
            <div class="flex between mgb-5 white">
                <div class="left">
                    <div class="flex vend">
                        返现
                        <small>(元)</small>
                        <span class="pdl-5 blue">{{rewardMoneySum}}</span>
                    </div>
                    <div class="flex vend">
                        转发
                        <small>(次)</small>
                        <span class="pdl-5 red">{{forwardCountSum}}</span>
                    </div>
                </div>
                <div class="right">
                    <div class="flex vend">
                        浏览
                        <small>(次)</small>
                        <span class="pdl-5 green">{{browseCountSum}}</span>
                    </div>
                    <div class="flex vend">
                        购买
                        <small>(次)</small>
                        <span class="pdl-5 black">{{buyCountSum}}</span>
                    </div>
                </div>
            </div>
            <cy-echarts-line :option="shareOption" height="300px"></cy-echarts-line>
            <div v-if="shareOption.dataZoom[0].show" class="mgt-5 fs-12 tc grey">可左右滑动查看数据</div>

            <div class="data-border-line border-lt"></div>
            <div class="data-border-line border-rt"></div>
            <div class="data-border-line border-lb"></div>
            <div class="data-border-line border-rb"></div>
        </div>
     
</template>

<script>
import cyEchartsLine from "@/components/echarts/line"; //echart线性

export default {
    name: "data_operate_total",
    components: {
        cyEchartsLine,
    },
    props: {
        option: {
            type: Object,
            default: {},
        },
    },
    data() {
        return {
            browseCountSum: "", //	浏览总次数
            forwardCountSum: "", //	转发总次数
            buyCountSum: "", //	购买总次数
            rewardMoneySum: "", //	返现总金额

            //分享数据，购买/转发/浏览
            shareOption: {
                title: {
                    text: "",
                },
                tooltip: {
                    trigger: "axis",
                    formatter: `{b0}<br/> {a0}: {c0}次<br/> {a1}: {c1}次<br/> {a2}: {c2}次`,
                },
                legend: {
                    top: "5",
                    data: ["浏览", "转发", "购买"],
                },
                grid: {
                    top: "40",
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
        };
    },
    created() {},
    computed: {},
    watch: {
        option: {
            handler(nVal, oVal) {
                if (JSON.stringify(nVal) === "{}") {
                    return;
                }
                this.shareReport(nVal);
            },
            immediate: true,
        },
    },
    methods: {
        //获取分享效果报表信息
        shareReport(option = {}) {
            this.params = {
                ...this.params,
                ...option,
            };
            this.$api.shareReport(this.params).then((res) => {
                this.browseCountSum = res.obj.browseCountSum;
                this.buyCountSum = res.obj.buyCountSum;
                this.forwardCountSum = res.obj.forwardCountSum;
                this.rewardMoneySum = res.obj.rewardMoneySum;
                //购买/转发/浏览
                let xAxis = [],
                    browseCount = [],
                    buyCount = [],
                    forwardCount = [];
                const nowHours = new Date().getHours() + 1;
                res.obj.shareReportTimesList.forEach((item) => {
                    if (option.timeType === 0) {
                        //timeType=0今天 只显示当前小时前的
                        item.statisticTime <= nowHours &&
                            xAxis.push(
                                item.statisticTime +
                                    (option.type === 0 ? ":00" : "")
                            );
                    } else {
                        xAxis.push(
                            item.statisticTime +
                                (option.type === 0 ? ":00" : "")
                        );
                    }
                    browseCount.push(item.browseCount);
                    buyCount.push(item.buyCount);
                    forwardCount.push(item.forwardCount);
                });
                //x轴移动
                const dataZoom = this.xAxisDataZoom(xAxis.length);
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
            });
        },

        //X轴是否可左右移动
        xAxisDataZoom(length) {
            let dataZoom = [{ show: false, end: 100 }];
            if (length > 10) {
                const zoomEnd = Math.ceil(100 - (length / (length + 20)) * 100);
                dataZoom = [{ show: true, end: zoomEnd }];
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
    .data-border-line {
        position: absolute;
        z-index: 1;
        width: 8px;
        height: 8px;
        border-color: #42e6ff;
        border-style: solid;
        border-width: 0px;
        background: rgba(0, 0, 0, 0);
        animation: lineSize 1s 1 alternate;
        animation-fill-mode: forwards;
        animation-delay: 0.3s;
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
        @keyframes lineSize {
            0% {
                width: 50%;
                height: 50%;
            }
            100% {
                width: 8px;
                height: 8px;
            }
        }
    }
}
</style>
