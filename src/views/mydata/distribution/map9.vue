<!--地图-->
<template>
    <div id="container" ref="container"></div>
</template>

<script>
export default {
    name: "distribution_map",
    props: {
        option: {
            type: Object,
            defalut: {},
        },
    },
    components: {},
    data() {
        return {
            map: null,
            center: {},
            TMap: {},
            marker: {},
        };
    },
    created() {
        //this.initMap();
    },
    watch: {
        option: {
            handler(nVal, oVal) {
                this.getStoreRegionXY(nVal);
            },
            deep: true,
            immediate: true,
        },
    },
    mounted() {
         
        // this.loadScript(() => {
        //     this.initTMap();
        // });
        //this.$nextTick(() => {
            //this.initTMap();
        //})
    },
    computed: {},
    methods: {
        //获取门店分布经纬度
        getStoreRegionXY(option) {
            const params = {
                agentOrgPk: this.$store.state.defaultRole.defaultOrgPk, //当前角色代理商
                ...option,
            };
            this.$api
                .getStoreRegionXY(params)
                .then((res) => {
                    this.initMap(res.obj);

                    //this.initMap(res.obj);
                    //this.createMarker(res.obj);
                })
                .catch((err) => {});
        },

        //地图 JavaScript API GL
        initMap(option) {
            var center = new qq.maps.LatLng(39.916527, 116.397128);
            var map = new qq.maps.Map(document.getElementById("container"), {
                center: center,
                zoom: 8,
                mapTypeControl: false, //禁止地图类型控件
                //disableDefaultUI: true, //禁止所有控件
            });

            //图标
            var anchor = new qq.maps.Point(6, 6),
                size = new qq.maps.Size(24, 40),
                origin = new qq.maps.Point(0, 0),
                icon1 = new qq.maps.MarkerImage(
                    require("@/assets/img/mydata/icon_location3.png"),
                    size,
                    origin,
                    anchor
                ),
                icon2 = new qq.maps.MarkerImage(
                    require("@/assets/img/mydata/icon_location4.png"),
                    size,
                    origin,
                    anchor
                ),
                icon3 = new qq.maps.MarkerImage(
                    require("@/assets/img/mydata/icon_location.png"),
                    size,
                    origin,
                    anchor
                ),
                icon4 = new qq.maps.MarkerImage(
                    require("@/assets/img/mydata/icon_location2.png"),
                    size,
                    origin,
                    anchor
                );
            //所有点
            var markerArr = [];
            option.map((item) => {
                if (!!item.y && !!item.x) {
                    let icon;
                    if (item.constructionTimes === 0) {
                        icon = icon1;
                    } else if (
                        item.constructionTimes >= 1 &&
                        item.constructionTimes <= 50
                    ) {
                        icon = icon2;
                    } else if (
                        item.constructionTimes > 50 &&
                        item.constructionTimes <= 200
                    ) {
                        icon = icon3;
                    } else if (item.constructionTimes > 200) {
                        icon = icon4;
                    }
                    //地图点集合
                    markerArr.push({
                        name: item.name,
                        phone: item.phone,
                        icon: icon,
                        constructionTimes: item.constructionTimes,
                        createTime: item.createTime,
                        LatLng: new qq.maps.LatLng(item.y * 1, item.x * 1),
                    });

                    //设置中心点位置
                    map.panTo(markerArr[0].LatLng);
                }
            });
            console.log("markerArr", markerArr);
            var infoWin = new qq.maps.InfoWindow({
                map: map,
            });

            //点弹窗
            for (var i = 0; i < markerArr.length; i++) {
                (function (n) {
                    var marker = new qq.maps.Marker({
                        icon: markerArr[n].icon,
                        position: markerArr[n].LatLng,
                        map: map,
                    });
                    qq.maps.event.addListener(marker, "click", function () {
                        infoWin.open();
                        infoWin.setContent(
                            `<div style="text-align:center;white-space:nowrap;font-size:12px;text-align:left;">
                                <b class="fw">${markerArr[n].name}</b><br/>
                                加入时间:${markerArr[n].createTime}<br/>
                                施工次数:${markerArr[n].constructionTimes}<br/>
                                联系电话:${markerArr[n].phone}</div>`
                        );
                        infoWin.setPosition(markerArr[n].LatLng);
                    });
                })(i);
            }
        },

        // init() {
        //     var myLatlng = new qq.maps.LatLng(-34.397, 150.644);
        //     var myOptions = {
        //         zoom: 8,
        //         center: myLatlng,
        //         mapTypeId: qq.maps.MapTypeId.ROADMAP,
        //     };
        //     var map = new qq.maps.Map(
        //         document.getElementById("container"),
        //         myOptions
        //     );
        // },

        // loadScript() {
        //     var script = document.createElement("script");
        //     script.type = "text/javascript";
        //     script.src =
        //         "https://map.qq.com/api/js?v=2.exp&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&callback=init";
        //     document.body.appendChild(script);
        // },

        //销毁地图
        destroyMap() {
            this.map && this.map.destroy();
        },
    },
    destroyed() {
        this.map && this.map.destroy();
    },
};
</script>
<style lang="scss" scoped>
#container {
    width: 100%;
    height: 100%;
}
</style>
