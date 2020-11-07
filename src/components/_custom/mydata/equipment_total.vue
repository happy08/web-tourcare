<!--设备统计数据-->
<template>
    <div class="total">
        <div class="flex between">
            <div class="left">
                <div class="flex">
                    收益
                    <small class="unit">(元)</small>
                    <span class="pdl-5 blue">22232</span>
                </div>
                <div class="flex">
                    数量
                    <small class="unit">(台)</small>
                    <span class="pdl-5 red">22232</span>
                </div>
            </div>
            <div class="right">
                <div class="flex">
                    门店
                    <small class="unit">(家)</small>
                    <span class="pdl-5 green">22232</span>
                </div>
                <div class="flex">
                    施工
                    <small class="unit">(次)</small>
                    <span class="pdl-5 black">22</span>
                </div>
            </div>
        </div>
 
        <cy-echarts-map :option="lineOption"></cy-echarts-map>
    </div>
</template>

<script>
import cyEchartsMap from "@/components/echarts/map";

export default {
    name: "mydata",
    components: {
        cyEchartsMap
    },
    data() {
        return {
            lineOption: {
                backgroundColor: "#ffffff",
                tooltip: {
                    trigger: "axis",
                    formatter:
                        "{b0}月<br/> {a0}: {c0}<br />{a1}: {c1}<br />{a2}: {c2}"
                },
                legend: {
                    icon: "circle", //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
                    lineHeight: "156px",
                    left: "0",
                    top: "0",
                    color: "#666666",
                    data: ["购买", "转发", "浏览"]
                },
                grid: {
                    top: "40",
                    left: "0",
                    right: "5",
                    bottom: "0",
                    containLabel: true //标尺
                },
                xAxis: {
                    type: "category",
                    //boundaryGap: true,
                    axisLabel: {
                        textStyle: {
                            color: "#999999"
                        }
                    },
                   axisTick:{ //刻度
                       lineStyle:{
                           width:0
                       }
                   },
                    axisLine: { //轴线
                        lineStyle: {
                            width: 1,
                            color: "#aaa" //颜色，'rgb(128, 128, 128)'，'rgba(128, 128, 128, 0.5)'，支持线性渐变，径向渐变，纹理填充
                        }
                    },
                    data: [10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                },
                yAxis: {
                    type: "value",
                    nameTextStyle: {
                        color: "#ff3333", //文字颜色
                        fontSize: 18
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: "#999999"
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#ffffff" //颜色，'rgb(128, 128, 128)'，'rgba(128, 128, 128, 0.5)'，支持线性渐变，径向渐变，纹理填充
                        }
                    }
                },
                series: [
                    {
                        name: "购买",
                        type: "line",
                        smooth: true,
                        color: "#0091FF",
                        data: [
                            120,
                            132,
                            101,
                            134,
                            90,
                            230,
                            210,
                            120,
                            132,
                            101,
                            134,
                            90
                        ]
                    },
                    {
                        name: "转发",
                        type: "line",
                        smooth: true,
                        color: "#6BBD7E",
                        data: [
                            220,
                            182,
                            191,
                            234,
                            290,
                            330,
                            310,
                            191,
                            234,
                            290,
                            330,
                            310
                        ]
                    },
                    {
                        name: "浏览",
                        type: "line",
                        smooth: true,
                        color: "#F06061",
                        data: [
                            120,
                            182,
                            191,
                            234,
                            150,
                            330,
                            310,
                            220,
                            182,
                            191,
                            234,
                            290
                        ]
                    }
                ]
            }
        };
    },
    created() {
        
    },
    mounted() {},
    computed: {},
    methods: {
         
    }
};
</script>
<style lang="scss" scoped>
.total {
    padding: 15px;
    border: solid 1px #ccc;
    border-radius: 5px;
    .unit {
        display: inline-block;
        margin-top: 2px;
        transform: scale(0.8);
        color: #999999;
    }
}
</style>
