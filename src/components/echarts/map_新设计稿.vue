

<template>
    <div ref="echarts" class="echarts" :style="{height:height,width:width}"></div>
</template>
<script>
import echarts from "echarts"; //"./index";
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
                geo: {
                    show: true,
                    map: "china", //默认
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
                series: [
                    {
                        //name: "pm2.5",
                        type: "scatter",
                        coordinateSystem: "geo",
                        data: [
                            {
                                name: "门店",
                                value: [
                                    116.46, // 地理坐标，经度
                                    39.92,
                                    90,
                                ],
                            },
                            { name: "海门:190", value: [121.15, 31.89, 190] },
                            
                        ],
                        symbolSize: function (val) {
                            return 12; //val[2] / 10;
                        },
                        encode: {
                            value: 2,
                        },
                        label: {
                            formatter: "{b}",
                            position: "right",
                            show: false,
                            color: "#fff",
                        },
                        itemStyle: {
                            color: {
                                type: "linear",
                                x: 0,
                                y: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: "#800", // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: "#f00", // 100% 处的颜色
                                    },
                                ],
                                global: false, // 缺省为 false
                            },
                        },
                        symbol: "pin", //图标形状 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
                        symbolSize: 18,
                        emphasis: {
                            label: {
                                show: true,
                            },
                        },
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
            //const option = deepMerge(this.defaultOption, opt);
            const option = this.defaultOption;
            console.log("option", option);
            const mapName = "china"; //option.geo.map;
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