<!-- 条形图 -->
<template>
    <div class="cy-echarts" ref="echarts" :style="{height:height,width:width}"></div>
</template>
<script>
//import echarts from "echarts";
import echarts from './index';
import deepMerge from "@/utils/deepMerge";

export default {
    name: "cy-echarts-bar",
    components: {},
    props: {
        width: {
            type: String,
            default: "100%"
        },
        height: {
            type: String,
            default: "210px"
        },
        option: {
            type: Object
        }
    },
    data() {
        return {
            chart: null,
            defaultOption: {
                title: {
                },
                backgroundColor: "rgba(0, 0, 0, 0)",
                tooltip: {
                    trigger: "axis",
                    show: true,
                    //trigger: "item",
                    backgroundColor:"rgba(6,110,195,.8)",
                    triggerOn: "click", //触发方式
                    enterable: true // 鼠标可移入tooltip中
                },
                dataset: {},
                legend: {
                    icon: "circle", //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
                    left: "0",
                    top: "10",
                    color: "#ffffff",
                    itemWidth: 10,
                    itemHeight: 10,
                    textStyle: {
                        color: '#0091FF',
                        fontSize: 10
                    },
                    data: []
                },
                grid: {
                    top: "50",
                    left: "5",
                    right: "5",
                    bottom: "0",
                    containLabel: true //标尺
                },
                dataZoom: [
                    {
                        id: 'dataZoomX',
                        type: "slider",
                        show: false,
                        start: 0,
                        end: 100,
                        handleSize: 0,
                        yAxisIndex: 0,
                        filterMode: "empty",
                        borderColor: "rgba(0,0,0,0)",
                        right: 0,
                        width:20,
                        zoomLock: true //只能平移，不能缩放
                    }
                ],
                xAxis: {
                    name: "xAxis",
                    type: "value",
                    //boundaryGap: true,
                    axisLabel: {
                        textStyle: {
                            color: "#ffffff"
                        }
                    },
                    axisTick: {
                        //刻度
                        lineStyle: {
                            width: 0
                        }
                    },
                    axisLine: {
                        //轴线
                        lineStyle: {
                            width: 1,
                            color: "#0A4373"
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle:{
                            color: ['#0A4373'],
                            width: 1,
                            type: 'solid'
                        }
                　　},
                },
                yAxis: {
                    type: "category",
                    nameTextStyle: {
                        color: "#ffffff", //文字颜色
                        fontSize: 12
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: "#ffffff"
                        }
                    },
                    axisTick: {
                        //刻度
                        lineStyle: {
                            width: 0
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#0A4373"
                        }
                    }
                },
                series: [
                    {
                        type: "bar",
                        barWidth : 8,
                        color: "#0091FF",
                        // encode: {
                        //     // Map the "amount" column to X axis.
                        //   //  x: "xAxis",
                        //     // Map the "product" column to Y axis
                        //   //  y: "yAxis"
                        // }
                    }
                ]
            }
        };
    },
    created() {},
    mounted() {
        this.initChart();
    },
    watch: {
        option: {
            handler(nVal, oVal) {
                this.$nextTick(() => {
                    nVal = deepMerge(this.defaultOption, nVal);
                    this.chart && this.chart.setOption(nVal); // 配置和数据
                });
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        initChart() {
            this.chart = echarts.init(this.$refs.echarts);
            //window.onresize = echarts.init(this.$refs.echarts).resize;
            //this.chart.setOption(this.option)  // 配置和数据
        }
    },
    beforeDestroy() {
        if (!this.chart) {
            return;
        }
        this.chart.dispose();
        this.chart = null;
    }
};
</script>
<style lang="scss" scoped>
</style>