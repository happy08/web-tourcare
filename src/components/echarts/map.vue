

<template>
    <div ref="echarts" class="echarts" :style="{height:height,width:width}"></div>
</template>
<script>
import echarts from "./index";
import { get } from "../../service/axios"; // 导入配置域名
import deepMerge from "@/utils/deepMerge";

export default {
    name: "echart-map",
    props: {
        width: {
            type: String,
            default: "100%",
        },
        height: {
            type: String,
            default: "340px",
        },
        option: Object,
        tooltipClick: {
            type: Function,
        },
        tooltipClick2: {
            type: Function,
        },
    },

    data() {
        return {
            echartObj: null,

            defaultOption: {
                tooltip: {
                    show: true,
                    trigger: "item",
                    backgroundColor: "rgba(6,110,195,.9)",
                    triggerOn: "click", //触发方式
                    enterable: true, // 鼠标可移入tooltip中
                },
                geo: {
                    show: true,
                    map: "china", //默认
                    label: {
                        normal: {
                            show: true,
                            color: "#ffffff",
                            fontSize: 10,
                        },
                        emphasis: {
                            show: true,
                            color: "#ffffff",
                        },
                    },
                    // left: "5%",
                    // right: "5%",
                    // top: "5%",
                    // bottom: "5%",
                    roam: true, //缩放
                    zoom: 1.2,
                    scaleLimit: {
                        //所属组件的z分层，z值小的图形会被z值大的图形覆盖
                        min: 1.2, //最小的缩放值
                        max: 4, //最大的缩放值
                    },
                    itemStyle: {
                        normal: {
                            areaColor: "#092740",
                            borderColor: "#066EC3",
                            borderWidth: 1,
                        },
                        emphasis: {
                            areaColor: "#066EC3", // hover效果
                        },
                    },
                },
                visualMap: {
                    pieces: [
                        { gt: 5000 },
                        { gt: 3000, lte: 4999 },
                        { gt: 1000, lte: 2999 },
                        { gt: 500, lte: 999 },
                        { gt: 100, lte: 499 },
                        { gte: 1, lte: 99 }, //(0,9] , label: "10 到 200"
                        //{ lt: 0, label: "0" } // (-Infinity, 0)
                    ],
                    type: "piecewise",
                    orient: "vertical",
                    left: 0,
                    bottom: 0,
                    itemWidth: 5, // 每个小块的宽度
                    itemHeight: 10, // 每个小块的高度
                    textGap: 4, // 两端文字主体之间的距离
                    inRange: {
                        color: [
                            "#FFE7B2",
                            "#fac695",
                            "#ef835b",
                            "#e9623d",
                            "#e44020",
                            "#c51d04",
                        ],
                    },
                    textStyle: {
                        fontSize: 10,
                        color: "#fff",
                    },
                },
                

                series: [
                     {
                        type: "map",
                        geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
                        data: [],
                        //symbolSize: 12,
                    },                   
                ],
            },
        };
    },
    created() {},
    mounted() {
        this.echartObj = echarts.init(this.$refs.echarts);
    },
    watch: {
        option: {
            handler(nVal, oVal) {
                this.setMapType(nVal);
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        async setMapType(opt) {
            if (opt.tooltip && opt.tooltip.clickName) {
                window[opt.tooltip.clickName] = this.tooltipClick; //tooltip点击事件需挂到window才生效
                delete opt.tooltip.clickName;
                delete opt.tooltip.tooltipClick;
            }
            const option = deepMerge(this.defaultOption, opt);
            const mapName = option.geo.map;
            if (!mapName) {
                return;
            }
            let url = `./mapJson/${
                mapName === "china" ? "china" : "province/" + mapName
            }.json`;
            const mapJson = await this.loadJson(url); //读取json文件数据
            if (mapJson) {
                echarts.registerMap(mapName, mapJson); //注册地图数据
                // echarts.registerMap("重庆", JSON);
                //this.defaultOption.geo.map = mapName;
                this.echartObj.setOption(option, true);
                this.echartObj.resize();
                window.addEventListener("resize", () => {
                    if (this.echartObj && this.echartObj.resize) {
                        this.echartObj.resize();
                    }
                });
            }
        },
        // 加载json文件
        loadJson(url = "") {
            const params = {
                json: true,
            };
            return get(url, params)
                .then((res) => {
                    return res;
                })
                .catch((err) => {
                    return false;
                });
        },
    },
};
</script>
<style lang="scss">
.echarts {
    z-index: 99;
}
.link {
    color: #fff;
    pointer-events: all;
}
</style>