<!--案例 数据列表 -->
<template>
    <div>
        <cy-pullup-loading
            @loadmore="onLoadmore"
            :isPullLoadMore="isPullLoadMore"
            :isLoading="isLoading"
            :hasMore="isHasMore"
            :dataList="dataList"
        >
            <ul class="data-list">
                <li v-for="(item,index) in dataList" :key="index" class="b-line">
                    <div class="item-l">
                        <cy-image :src="item.faceUrl" round></cy-image>
                    </div>
                    <div class="item-r fs-10 grey">
                        <div class="flex between lh1 mgb-5">
                            <div class="fs-14 black">
                                {{item.nickName || ''}}
                                <cy-btn background="#EBF3FE" color="#3F8BFD" xxs>{{item.carNumber}}</cy-btn>
                            </div>
                            <cy-btn background="#EBF3FE" color="#3F8BFD" xxs>{{item.caseTypeName}}</cy-btn>
                        </div>

                        <div class="flex hstart vcenter">
                            <cy-image
                                class="mgr-5"
                                :src="item.icon"
                                round
                                width="14px"
                                height="14px"
                            ></cy-image>
                            {{item.car}}
                        </div>

                        <cy-row class="pdr-50" wrap="wrap" :gutter="3">
                            <cy-col
                                v-for="(items,idx) in item.imgList"
                                :key="idx"
                                @click.native="previewImage(index,idx)"
                                :span="8"
                                class="mgt-5"
                            >
                                <cy-image :src="items.src" height="78px"></cy-image>
                            </cy-col>
                        </cy-row>

                        <div class="flex between mgb-5">
                            <div class="flex vcenter">
                                <cy-icon class="mgr-3" type="home" size="11" color="#999"></cy-icon>
                                <div>{{item.shopName}}</div> 
                            </div>
                            <div v-show="item.address" class="address flex vcenter hend">
                                <div class="mgr-3" style="width:11px">
                                    <cy-icon type="location1" size="11" color="#999"></cy-icon>
                                </div>
                                <div class="hidden-1">{{item.address}}</div> 
                            </div>
                        </div>

                        <div class>{{item.createTime}}</div>
                    </div>
                </li>
            </ul>
        </cy-pullup-loading>

        <cy-popup
            class="poster-popup"
            v-model="showCaseSwiper"
            :closeIcon="false"
            :clickOverlayClose="true"
            position="center"
            closeIconPosition="bottom-center"
            width="100%"
            height="100%"
            background="transparent"
        >
            <div class="poster-box" @touchmove.prevent>
                <cy-swiper
                    ref="caseSwiper"
                    :center="true"
                    :pagination="false"
                    :swiperData="swiperImgList"
                >
                    <div v-for="(item,index) in swiperImgList" :key="index" class="cy-swiper-slide">
                        <cy-image :src="item.src"></cy-image>
                        <div class="pdtb-25 white tc lh12">{{item.name}}</div>
                    </div>
                </cy-swiper>
            </div>
            <div class="poster-close">
                <cy-icon
                    @click.native="showCaseSwiper = false"
                    type="close1"
                    size="50"
                    color="#ffffff"
                ></cy-icon>
            </div>
        </cy-popup>
    </div>
</template>

<script>
import cyPullupLoading from "@/components/pullup_loading";
import cySwiper from "@/components/swiper";
import { MixinPage } from "@/utils/mixins/index";
import { coverCarNo,coverStore } from "@/utils/number";

export default {
    name: "case_list",
    mixins: [MixinPage],
    components: {
        cyPullupLoading,
        cySwiper,
    },
    props: {
        isPullLoadMore: {
            type: Boolean,
            default: false,
        },
        option: Object,
    },
    data() {
        return {
            pageSize: 4,
            dataList: [],
            showCaseSwiper: false,
            swiperImgList: [],
        };
    },
    created() {},
    computed: {},
    watch: {
        option: {
            handler(nVal, oVal) {
                this.getDataList();
            },
            immediate: true,
        },
    },
    methods: {
        //获取案例列表
        getDataList() {
            let params = {
                caseType: this.$store.state.sysInfo.pk,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
            };
            params = { ...params, ...this.option };
            this.$api
                .queryUseCaseNew(params)
                .then((res) => {
                    this.total = res.total;
                    this.isLoading = false;
                    if (
                        res.obj.length < params.pageSize ||
                        params.pageNum === this.total
                    ) {
                        this.isHasMore = false;
                    } else {
                        this.isHasMore = true;
                    }
                    const list = res.obj.map((item) => {
                        //步骤图集
                        let imgList = [];
                        for (let i = 1; i <= 9; i++) {
                            if (item[`commentPic${i}`] != "") {
                                imgList.push({
                                    name: item[`pic${i}Remark`],
                                    src: item[`commentPic${i}`],
                                });
                            }
                        }
                        let obj = {
                            car: `${item.brandName} ${item.clazzName} ${item.year} ${item.salesName}`,
                            imgList: imgList,
                        };
                        item.carNumber=coverCarNo(item.carNumber)
                        item.shopName=coverStore(item.shopName)
                        
                        return { ...item, ...obj };
                    });
                    this.dataList = this.dataList.concat(list);
                    setTimeout(() => {
                        this.$emit("change", this.total);
                    }, 10);
                })
                .catch((err) => {
                    this.isHasMore = false;
                });
        },

        //图片预览
        previewImage(dataIndex, imgIndex) {
            this.showCaseSwiper = true;
            this.swiperImgList = this.dataList[dataIndex].imgList;
            this.$refs.caseSwiper.setPage(imgIndex + 1, false);
        },
    },
};
</script>
<style lang="scss" scoped>
.data-list {
    li {
        position: relative;
        display: flex;
        align-items: top;
        margin: 0px 10px;
        padding: 10px 0;
        .item-l {
            flex: 0 0 30px;
            height: 30px;
        }
        .item-r {
            flex: 1;
            margin-left: 15px;
            .address{
                width: 160px;
            }
        }
    }
}

.poster-popup {
    /deep/.cy-popup {
        transform: translate(-50%, -50%);
    }
    /deep/.cy-popup-inner {
        display: flex;
        align-items: center;
    }
    .poster-box {
        display: flex;
        align-items: center;
        .cy-swiper-slide {
            max-width: 80%;
        }
    }
    .poster-close {
        position: absolute;
        bottom: 50px;
        left: 50%;
        margin-left: -25px;
    }
}
</style>
