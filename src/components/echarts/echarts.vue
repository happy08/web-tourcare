<template>
    <div class="echarts" ref="echarts" :style="{height:height,width:width}"></div>
</template>
<script>
import echarts from "echarts";
import { get } from "../../service/axios"; // 导入配置域名
import JSON2 from './json/province/chongqing.json';
export default {
    name: "cy-echarts",
    components: {},
    props: {
        width: {
            type: String,
            default: "100%"
        },
        height: {
            type: String,
            default: "340px"
        },
        option: Object
    },
    data() {
        return {
            chart: null
        };
    },
    created() {
        //require(`echarts/map/js/${map}.js`);
    },
    mounted() {
        const map = this.option.series[0].mapType || "china";
        this.initChart();
        //this.setMapType(map);
    },
    watch: {
        option: {
            handler(nVal, oVal) {
                this.$nextTick(() => {
                    nVal && this.chart && this.chart.setOption(nVal); // 配置和数据
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
        },
        // 设置地图数据
        async setMapType(obj) {
            let url = ""; // 本地地址
            // if (obj == "china") {
            //     url = `models/map/json/china.json`;
            // } else if (obj == "world") {
            //     url = `models/map/json/world.json`;
            // } else {
            //     url = `models/map/json/province/${obj}.json`;
            // }
            url = `./json/china.json`;

            const map = await this.loadJson(url); //从静态json读取文件数据

            if (map != false) {
                 console.log("map", map);
                 
                       echarts.registerMap("map", JSON2); //注册地图数据
         //echarts.registerMap("map", JSON.stringify(map)); //注册地图数据
            }
        },
        // 加载外部json文件
        async loadJson(url = "") {
            console.log("utlrl", url);
            const result = await get(url)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
           
            return result;
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