<!--门店分布 全国-->
<template>
    <div class="min-h101">
        <div class="head pdt-15 pdb-10 white">
            <div class="pdl-15">门店：{{storeDataDto.storeSum}} 家</div>
            <div class="pdl-15">设备：{{storeDataDto.equipmentSum}} 台</div>
        </div>

        <div class="echarts-map">
            <!-- 中国地图 type=0厂商 =1代理商-->
            <cy-echarts-map
                v-if="!showProvince"
                :option="chinaOption"
                :tooltipClick="chinaOption.tooltip[chinaOption.tooltip.clickName]"
            ></cy-echarts-map>
            <cy-echarts-map
                v-else
                :option="provinceOption"
                :tooltipClick="provinceOption.tooltip[provinceOption.tooltip.clickName]"
                height="380px"
            ></cy-echarts-map>
        </div>

        <!-- 省份地图 -->
        <!-- <cy-popup
            v-model="showMapRegion"
            :closeIcon="true"
            :clickOverlayClose="true"
            round
            height="380px"
        >
            <cy-echarts-map :option="provinceOption" height="380px"></cy-echarts-map>
        </cy-popup>-->

        <!-- 地图插旗 v-if="showMapRegion"-->
        <cy-popup v-model="showMapRegion" :closeIcon="true" :clickOverlayClose="true" height="90vh">
            <cy-map ref="map" :option="mapOption"></cy-map>
        </cy-popup>
    </div>
</template>

<script>
import { mapState } from "vuex";
import cyEchartsMap from "@/components/echarts/map";
import cyMap from "./map9";

export default {
    name: "distribution",
    components: {
        cyEchartsMap,
        cyMap,
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
            showMap:false,
            storeDataDto: {
                storeSum: "--",
                equipmentSum: "--",
            },
            chinaOption: {
                tooltip: {
                    formatter: function (params) {
                        if (!params.data) {
                            return;
                        }
                        return `<div onClick="tooltipClick('${params.data.pinyin}','${params.data.province}')">
                            地区：${params.data.name}<br/>
                            门店：${params.data.value} 家<br/>
                            设备：${params.data.equipmentSum} 台<br/>
                            <div style="margin-top: 3px;padding-top: 3px;border-top: solid 1px rgba(0,0,0,.1);text-align: center;">详情 ><div/>
                            </div>`;
                    },
                    clickName: "tooltipClick", //点击事件名称
                    //点击事件
                    tooltipClick: (pinyin, province) => {
                        this.mapOption = {
                            //pinyin,
                            province,
                        };
                        this.showMapRegion = true;
                    },
                },
                geo: {
                    map: "china",
                },
                series: [
                    {
                        data: [],
                    },
                ],
            },
            showProvince: false,
            provinceOption: {
                tooltip: {
                    triggerOn: "mousemove",
                    formatter: function (params) {
                        if (!params.data) {
                            return;
                        }
                        return `<div onClick="tooltipClick('${params.data.cityPinYin}','${params.data.city}')">
                            地区：${params.data.name}<br/>
                            门店：${params.data.value} 家<br/>
                            设备：${params.data.equipmentSum} 台.<br/>
                            <div style="margin-top: 3px;padding-top: 3px;border-top: solid 1px rgba(0,0,0,.1);text-align: center;">详情 ><div/>
                            </div>`;
                    },
                    clickName: "tooltipClick", //点击事件名称
                    //点击事件
                    tooltipClick: (pinyin, city) => {
                        this.mapOption = {
                            //pinyin,
                            city,
                        };
                        this.showMapRegion = true;
                    },
                },
                geo: {
                    map: "",
                },
                series: [
                    {
                        data: [],
                    },
                ],
            },
            showMapRegion: false,
            mapOption: {},
        };
    },
    created() {
        //  this.loadScript(() => {
        //     this.showMap = true
        // });
    },
    watch: {
        option: {
            handler(nVal, oVal) {
                //厂商
                if (nVal.agentOrgPk === "01") {
                    this.showProvince = false
                    this.chinaMap(nVal);
                } else {
                    //代理商
                    const provincePinYin = nVal.provincePinYin;
                    const province = nVal.province;
                    if (!provincePinYin) {
                        this.$toast("请正确配置服务商省份！");
                        return;
                    }
                    this.provinceMap(nVal);
                    this.showProvince = true
                }
            },
            immediate: true,
            deep: true,
        },
        showMapRegion(nVal, oVal){
            if(nVal === false){
                this.$refs.map.destroyMap()
            }

        }
    },
    computed: {},
    methods: {
        
        //中国分布信息
        chinaMap(option) {
            this.$toast.loading("加载中…");
            const params = {
                agentOrgPk:option.agentOrgPk
            };
            this.$api.storeRegion(params).then((res) => {
                this.storeDataDto = res.obj.storeDataDto;
                const data = res.obj.storeDataRegionList.map((item) => {
                    let obj = {};
                    obj.name = item.provinceSimpleName; //简称
                    obj.province = item.province; //全称
                    obj.pinyin = item.provincePinYin; //地图json名称
                    obj.value = item.storeSum; //门店
                    obj.equipmentSum = item.equipmentSum; //设备
                    return obj;
                });
                this.chinaOption = {
                    ...this.chinaOption,
                    series: [
                        {
                            data: data,
                        },
                    ],
                };
                this.$toast.clear();
            });
        },

        //省份分布信息
        provinceMap(option) {
            this.$toast.loading("加载中…");
            let params = {
                province: option.province,
                agentOrgPk:option.agentOrgPk

            };
            this.$api.storeRegion(params).then((res) => {
                this.storeDataDto = res.obj.storeDataDto;
                const data = res.obj.storeDataRegionList.map((item) => {
                    let obj = {};
                    obj.name = item.city;
                    obj.value = item.storeSum;
                    obj.equipmentSum = item.equipmentSum;
                    obj.province = item.province; //全称
                    obj.pinyin = item.provincePinYin; //地图json名称
                    obj.city = item.city; //全称
                    obj.cityPinYin = item.cityPinYin;
                    return obj;
                });
                this.provinceOption = {
                    ...this.provinceOption,
                    geo: {
                        map: option.provincePinYin.toLowerCase(),
                    },
                    series: [
                        {
                            data: data,
                        },
                    ],
                };
                this.$toast.clear();
            });
        },

        loadScript(callback) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = `https://map.qq.com/api/gljs?v=1.exp&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&callback=init`;

            document.body.appendChild(script);
            if (script.readyState) {
                //IE
                //这里只有反人类设计的IE才有
                script.onreadystatechange = function () {
                    if (
                        script.readyState == "complete" ||
                        script.readyState == "loaded"
                    ) {
                        script.onreadystatechange = null;
                        callback && callback();
                    }
                };
            } else {
                //非IE
                script.onload = function () {
                    callback && callback();
                };
            }
        },

        // //加载腾讯插旗地图js
        // loadScript() {
        //     var script = document.createElement("script");
        //     script.type = "text/javascript";
        //     //script.src = "https://map.qq.com/api/js?v=2.exp&callback=mapCallback&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77"; //+config.TENCENT_MAP_ADDRESS_Key;
        //     script.src =
        //         "https://map.qq.com/api/gljs?v=1.exp&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77";
        //     document.body.appendChild(script);
        //     //js 加载完
        //     let _this = this;
        //     script.onload = script.onreadystatechange = function () {
        //         if (
        //             !this.readyState ||
        //             this.readyState == "loaded" ||
        //             this.readyState == "complete"
        //         ) {
        //             console.log("script onload");
        //             setTimeout(()=>{
        //                  _this.showMap = true;
        //             },1000)
                   
        //         }
        //         script.onload = script.onreadystatechange = null; //删除事件处理函数。
        //     };
        // },
    },
};
</script>
<style lang="scss" scoped>
.tab-head {
    border: solid 1px #efefef;
    .tab-item {
        background: #ffffff;
        border: none;
        color: #333;
        &.active {
            background: #eef4ff;
            color: #005dfe;
        }
    }
}
</style>
