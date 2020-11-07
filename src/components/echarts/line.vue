<!-- 线性图 -->
<template>
    <div class="cy-echarts" ref="echarts" :style="{height:height,width:width}"></div>
</template>
<script>
//import echarts from "echarts";
import echarts from "./index";
import deepMerge from "@/utils/deepMerge";

export default {
    name: "cy-echarts-line",
    components: {},
    props: {
        width: {
            type: String,
            default: "100%",
        },
        height: {
            type: String,
            default: "210px",
        },
        option: {
            type: Object,
        },
        tooltipClick: {
            type: Function,
        },
    },
    data() {
        return {
            chart: null,
            defaultOption: {
                title: {
                    // text: "",
                    // textStyle: {
                    //     fontSize: 14,
                    //     color: "#ffffff"
                    // }
                },
                backgroundColor: "rgba(0, 0, 0, 0)",
                tooltip: {
                    trigger: "axis",
                    show: true,
                    //trigger: "item",
                    backgroundColor: "rgba(6,110,195,.9)",
                    triggerOn: "click", //触发方式
                    enterable: true, // 鼠标可移入tooltip中
                },
                legend: {
                    icon: "circle", //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
                    left: "0",
                    top: "10",
                    color: "#0091FF",
                    itemWidth: 10,
                    itemHeight: 10,
                    textStyle: {
                        color: "#0091FF",
                        fontSize: 10,
                    },
                    data: [],
                    //itemGap: 5
                },
                //网格
                grid: {
                    top: "50",
                    left: "5",
                    right: "5",
                    bottom: "0",
                    containLabel: true, //标尺
                },
                xAxis: {
                    type: "category",
                    boundaryGap: true, //名称显示完整
                    axisLabel: {
                        interval: 0, //控制坐标轴刻度标签的显示间隔.设置成 0 强制显示所有标签。设置为 1，隔一个标签显示一个标签。以此类推
                        rotate: 25, //倾斜度 -90 至 90 默认为0
                        textStyle: {
                            color: "#ffffff",
                        },
                    },
                    axisTick: {
                        //刻度
                        lineStyle: {
                            width: 0,
                        },
                    },
                    axisLine: {
                        //轴线
                        lineStyle: {
                            width: 1,
                            color: "#0A4373",
                        },
                    },
                    data: [],
                },
                yAxis: {
                    type: "value",
                    nameTextStyle: {
                        color: "#ffffff", //文字颜色
                        fontSize: 12,
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: "#ffffff",
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            color: "rgba(0,0,0,0)",
                        },
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ["#0A4373"],
                            width: 1,
                            type: "solid",
                        },
                    },
                },
                dataZoom: [
                    {
                        id: "dataZoomX",
                        type: "slider",
                        show: false,
                        // start: 0,//数据窗口范围的起始%
                        // end: 100,
                        // startValue: 10, //数据窗口范围的起始数值
                        // endValue: 20,
                        handleSize: 0,
                        xAxisIndex: 0,
                        filterMode: "empty",
                        borderColor: "rgba(0,0,0,0)",
                        bottom: 0,
                        height: 20, //这里可以设置dataZoom的尺寸
                        zoomLock: true, //只能平移，不能缩放
                    },
                ],

                series: [
                    {
                        name: "",
                        type: "line",
                        barWidth: 8,
                        smooth: true,
                        color: "#0091FF",
                        data: [],
                        // encode: {
                        //     // Map the "amount" column to X axis.
                        //     x: "xAxis",
                        //     // Map the "product" column to Y axis
                        //     y: "YAxis"
                        // }
                        itemStyle: {
                            barBorderRadius: 5,
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    { offset: 0, color: "#14c8d4" },
                                    { offset: 1, color: "#43eec6" },
                                ]
                            ),
                        },
                    },
                ],
            },
        };
    },
    created() {},
    mounted() {
        //this.$nextTick(() => {
        this.initChart();
        //});
    },
    watch: {
        option: {
            handler(nVal, oVal) {
                this.$nextTick(() => {
                    const opt = deepMerge(this.defaultOption, nVal);
                    this.chart && this.chart.setOption(opt); // 配置和数据

                    if (opt.tooltip && opt.tooltip.clickName) {
                        window[opt.tooltip.clickName] = this.tooltipClick; //tooltip点击事件需挂到window才生效
                        delete opt.tooltip.clickName;
                        delete opt.tooltip.tooltipClick;
                    }
                });
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        initChart() {
            this.chart = echarts.init(this.$refs.echarts);

            //this.chart.setOption(this.defaultOption); // 配置和数据
            //window.onresize = echarts.init(this.$refs.echarts).resize;
            //this.chart.setOption(this.option)  // 配置和数据
        },
    },
    beforeDestroy() {
        if (!this.chart) {
            return;
        }
        this.chart.dispose();
        this.chart = null;
    },
};
</script>
<style lang="scss" scoped>
.cy-echarts {
    z-index: 1;
}
</style>