<template>
    <div class="pdlr-10">
        <cy-pullup-loading
            @loadmore="onLoadmore"
            :isPullLoadMore="false"
            :isLoading="isLoading"
            :hasMore="isHasMore"
            :noMore="false"
            :dataList="dataList"
            moreText="继续查看可用门店"
        >
            <ul class="use-stores">
                <li v-for="(item,index) in dataList" :key="index">
                    <div class="item">
                        <div class="flex">
                            <div class="item-l">
                                <cy-swiper
                                    v-if="item.imgList&&item.imgList.length>0"
                                    :autoPlay="index === 0?3000:0"
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
                                    评价：
                                    <cy-rate v-model="item.level" :readOnly="true" :size="12"></cy-rate>
                                    <span class="pdl-5 orange">{{item.levelText}}</span>
                                    <div
                                        class="pdl-15"
                                    >订单：{{item.serviceOrders+option.nationBuyTimes}}</div>
                                </div>
                                <div
                                    @click="openLocation(item.x,item.y,item.name,item.address)"
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
                                        v-for="(item,index) in item.serviceList"
                                        :key="index"
                                        background="#FDF6F2"
                                        color="#FF6300"
                                        round
                                        xxs
                                        class="mgr-3"
                                    >{{item.name}}</cy-btn>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="dataList.length>1" class="b-line mgtb-10"></div>
                </li>
            </ul>
            <div slot="noData" class="tc grey">附近无可用门店</div>
        </cy-pullup-loading>
    </div>
</template>
<script>
import cyPullupLoading from "@/components/pullup_loading";
import cyRate from "@/components/rate";
import cySwiper from "@/components/swiper";
import { MixinPage } from "@/utils/mixins/index";
export default {
    components: {
        cyPullupLoading,
        cyRate,
        cySwiper,
    },
    mixins: [MixinPage],
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
            params: {},
            dataList: [],
            pageSize: 2,
        };
    },
    watch: {
        option: {
            handler(nVal, oVal) {
                this.dataList = [];
                !!nVal.orgPk && this.getDataList(nVal);
            },
            immediate: true,
            deep: true,
        },
    },
    created() {},
    methods: {
        //附近可用门店
        getDataList(option = {}) {
            this.params = {
                ...this.params,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                errMsg: false,
                ...option,
            };
            this.$api
                .useStoresByShareNew(this.params)
                .then((res) => {
                    this.total = res.total;
                    this.isLoading = false;
                    if (
                        res.obj.length < this.params.pageSize ||
                        this.params.pageNum === this.total
                    ) {
                        this.isHasMore = false;
                    } else {
                        this.isHasMore = true;
                    }
                    if (!!res.obj) {
                        const serviceList = [
                            { name: "洗车" },
                            { name: "镀晶" },
                            { name: "美容" },
                            { name: "保养" },
                            { name: "维修" },
                        ];
                        const levelText = [
                            "一星",
                            "二星",
                            "三星",
                            "四星",
                            "五星",
                        ];
                        const dataList = res.obj.map((item) => {
                            item.distance = !!this.params.x
                                ? (item.distance / 1000).toFixed(2) + ""
                                : false;
                            item.logoUrl =
                                item.imgList.length > 0
                                    ? item.imgList[0].url
                                    : item.logoUrl;
                            item.levelText = levelText[item.level - 1];
                            item.serviceList =
                                item.serviceList.length === 0
                                    ? serviceList
                                    : item.serviceList;
                            return item;
                        });
                        this.dataList = this.dataList.concat(dataList);
                    }
                    this.$emit("changeStore", res.countRecord);
                })
                .catch((err) => {});
        },

        //打开地图
        openLocation(x, y, name, address) {
            wx.openLocation({
                latitude: y * 1,
                longitude: x * 1, // 经度，浮点数，范围为180 ~ -180。
                name: name,
                address: address,
                scale: 12,
                infoUrl: "",
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
.use-stores {
    overflow: hidden;
    li {
        .item {
            position: relative;
            .item-l {
                flex: 0 0 110px;
                height: 110px;
            }
            .item-r {
                flex: 1;
                line-height: 1.9;
                padding-left: 10px;
                .address {
                    width: 225px;
                }
            }
            .go-btn {
                position: absolute;
                bottom: 2px;
                right: 0px;
            }
            /deep/.cy-swiper-pagination {
                bottom: 5px;
                .text {
                    padding-right: 4px;
                    font-size: 10px;
                }
            }
        }
        &:last-child {
            .b-line {
                margin-bottom: 0 !important;
            }
        }
    }
}
</style>