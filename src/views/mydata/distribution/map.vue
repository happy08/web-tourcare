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
       
        // this.$nextTick(() => {
        //     this.initMap();
        // })
    },
    computed: {},
    methods: {
        //获取门店分布经纬度
        getStoreRegionXY(option) {
            const params = {
                // province: "",
                // city: "",
                agentOrgPk: this.$store.state.defaultRole.defaultOrgPk, //当前角色代理商
                ...option,
            };
            this.$api
                .getStoreRegionXY(params)
                .then((res) => {
                    this.initMap(res.obj);
                    //this.mapMarker(res.obj);
                })
                .catch((err) => {});
        },

        //地图 JavaScript API GL
        initMap(option) {
            var markerArr = [];
            option.map((item) => {
                if (!!item.y && !!item.x) {
                    let styleId = "marker1";
                    if (item.constructionTimes === 0) {
                        styleId = "marker1";
                    } else if (
                        item.constructionTimes >= 1 &&
                        item.constructionTimes <= 50
                    ) {
                        styleId = "marker2";
                    } else if (
                        item.constructionTimes > 50 &&
                        item.constructionTimes <= 200
                    ) {
                        styleId = "marker3";
                    } else if (item.constructionTimes > 200) {
                        styleId = "marker4";
                    }
                    //地图点集合
                    markerArr.push({
                        id: item.pk,
                        styleId: styleId,
                        position: new TMap.LatLng(item.y * 1, item.x * 1),
                        properties: {
                            //title: "marker",
                            name: item.name,
                            phone: item.phone,
                            constructionTimes: item.constructionTimes,
                            createTime: item.createTime,
                        },
                    });
                }
            });

            var center = markerArr[0].position; //new TMap.LatLng(39.984104, 116.307503); //设置中心点坐标
            // //初始化地图
            var map = new TMap.Map("container", {
                zoom: 8, //设置地图缩放级别
                center: center,
            });
            // //设置中心点
            // map.setCenter(new TMap.LatLng(39.908802, 116.397502)); //坐标为天安门

            // 移除缩放控件
            if (!!map.getControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM)) {
                // 如果map上不存在该控件则直接返回
                map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM);
            }

            //图标
            const styles = {
                marker1: new TMap.MarkerStyle({
                    width: 24,
                    height: 40,
                    anchor: { x: 12, y: 35 },
                    src: require("@/assets/img/mydata/icon_location3.png"),
                }),
                marker2: new TMap.MarkerStyle({
                    width: 24,
                    height: 40,
                    anchor: { x: 12, y: 35 },
                    src: require("@/assets/img/mydata/icon_location4.png"),
                }),
                marker3: new TMap.MarkerStyle({
                    width: 24,
                    height: 40,
                    anchor: { x: 12, y: 35 },
                    src: require("@/assets/img/mydata/icon_location.png"),
                }),
                marker4: new TMap.MarkerStyle({
                    width: 24,
                    height: 40,
                    anchor: { x: 12, y: 35 },
                    src: require("@/assets/img/mydata/icon_location2.png"),
                }),
            };

            //初始marker
            var marker = new TMap.MultiMarker({
                id: "marker-layer",
                map: map,
                styles: styles,
                geometries: markerArr,
            });

            // marker.setGeometries([]);
            // marker.add(markerArr);

            // //设置自适应显示marker  所有marker可见
            // var bounds = new TMap.LatLngBounds();
            // //判断标注点是否在范围内
            // markerArr.forEach(function (item) {
            //     //若坐标点不在范围内，扩大bounds范围
            //     if (bounds.isEmpty() || !bounds.contains(item.position)) {
            //         bounds.extend(item.position);
            //     }
            // });
            // //设置地图可视范围
            // map.fitBounds(bounds, {
            //     padding: 50, // 自适应边距
            // });

            //初始化infoWindow
            var infoWindow = new TMap.InfoWindow({
                map: map,
                position: new TMap.LatLng(39.984104, 116.307503),
                offset: { x: 0, y: -32 }, //设置信息窗相对position偏移像素
            });
            infoWindow.close(); //初始关闭信息窗关闭
            //监听标注点击事件
            marker.on("click", function (evt) {
                //设置infoWindow
                infoWindow.open(); //打开信息窗
                infoWindow.setPosition(evt.geometry.position); //设置信息窗位置
                const properties = { ...evt.geometry.properties };
                infoWindow.setContent(`
                <div class="tl fs-12" style="margin-top: -5px;">
                    <b class="fw">${properties.name}</b><br/>
                    加入时间:${properties.createTime}<br/>
                    施工次数:${properties.constructionTimes}<br/>
                    联系电话:${properties.phone}</div>
                `); //设置信息窗内容
            });

            this.map = map
            
            //map.destroy();
        },


        //销毁地图
        destroyMap() { 
            this.map && this.map.destroy();
            console.log('this.map2',this.map);
        }
    },
};
</script>
<style lang="scss" scoped>
#container {
    width: 100%;
    height: 100%;
}
</style>
