<!--门店 数据列表-->
<template>
    <ul class="write-off pd-10">
        <li v-for="(item,index) in dataList" :key="index">
            <div class="item">
                <div class="flex">
                    <div class="item-l">
                        <cy-swiper
                            v-if="item.imgList&&item.imgList.length>0"
                            :autoPlay="index===0?3000:0"
                            :pagination="true"
                            :swiperData="item.imgList"
                        >
                            <div
                                v-for="(item,index) in item.imgList"
                                :key="index"
                                class="cy-swiper-slide"
                            >
                                <cy-image :src="item.url" :lazy="false"></cy-image>
                            </div>
                        </cy-swiper>
                        <cy-image v-else :src="require('@/assets/img/image.png')"></cy-image>
                    </div>
                    <div class="item-r fs-12 darkgrey">
                        <div class="fs-14 black bold">{{item.name}}</div>
                        <div class="flex wrap vcenter">
                            <div class="flex wrap vcenter">
                                评价：
                                <cy-rate v-model="item.level" :readOnly="true" :size="12"></cy-rate>
                                <span class="pdl-10 orange">{{item.levelText}}</span>
                            </div>
                        </div>
                        <div
                            @click="!!item.distance ? openLocation(item.x,item.y,item.name,item.address) : ''"
                            class="flex vcenter"
                        >
                            <cy-icon type="location1" color="#f20" size="13"></cy-icon>
                            <div class="address pdlr-5 hidden-1">
                                <span v-if="!!item.distance">{{item.distance}}km</span>
                                {{item.address}}
                            </div>
                            <!-- <cy-icon type="youjiantou" color="#666666" size="8"></cy-icon> -->
                        </div>

                        <div class="flex between vcenter mgr-5">
                            <div>营业时间:{{item.openStartTime}}~{{item.openEndTime}}</div>
                            <div @click="callPhone(item.phone)" class="orange fs-14">
                                <cy-icon type="phone" size="12" color="#FA6400"></cy-icon>
                                {{item.phone}}
                            </div>
                        </div>
                        <div>
                            主营特色:
                            <cy-btn
                                v-for="(items,index) in item.serviceList"
                                :key="index"
                                background="#FDF6F2"
                                color="#FF6300"
                                round
                                xxs
                                class="mgr-3"
                            >{{items.name}}</cy-btn>
                        </div>
                    </div>
                </div>

                <div class="flex hend mgt-5" v-if="!!item.distance">
                    <cy-btn
                        @click.native="openLocation(item.x,item.y,item.name,item.address)"
                        type="blue-gradient"
                        class="pdlr-20"
                        round
                        sm
                    >导航</cy-btn>
                </div>
            </div>
            <div class="b-line mgtb-10"></div>
        </li>
    </ul>
</template>

<script>
import cySwiper from "@/components/swiper";
import cyRate from "@/components/rate";
import wxx from "@/utils/wx";

export default {
    name: "store_list",
    components: {
        cySwiper,
        cyRate,
    },
    props: {
        dataList: Array,
    },
    data() {
        return {};
    },
    created() {},
    computed: {},
    methods: {
        //打开地图
        openLocation(x, y, name, address) {
            wx.openLocation({
                latitude: y * 1, // 纬度，浮点数，范围为90 ~ -90
                longitude: x * 1, // 经度，浮点数，范围为180 ~ -180。
                name: name, // 位置名
                address: address, // 地址
                scale: 12, // 地图缩放级别,整形值,范围从1~28
                infoUrl: "", // 在查看位置界面底部显示的超链接,可点击跳转
            });
        },

        //打电话
        callPhone(phone) {
            if (!phone) {
                return;
            }
            window.location.href = "tel://" + phone;
        },
    },
};
</script>
<style lang="scss" scoped>
.write-off {
    overflow: hidden;
    li {
        .item {
            position: relative;
            .item-l {
                flex: 0 0 110px;
                height: 110px;
                /deep/.cy-swiper-pagination {
                    bottom: 5px;
                    .text {
                        padding-right: 4px;
                        font-size: 10px;
                    }
                }
            }
            .item-r {
                flex: 1;
                line-height: 1.9;
                padding-left: 10px;
                .address {
                    width: 215px;
                }
            }
        }
    }
}
</style>
