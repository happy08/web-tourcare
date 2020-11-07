<!--门店详情-->
<template>
    <div class="store bg-grey">
        <div class="header bg-white">
            <div
                v-if="storeInfo.imgList && storeInfo.imgList.length>0"
                class="swiper"
                @touchmove.prevent
            >
                <cy-swiper :autoPlay="4000" :pagination="true" :swiperData="storeInfo.imgList">
                    <div
                        v-for="(item,index) in storeInfo.imgList"
                        :key="index"
                        class="cy-swiper-slide"
                    >
                        <cy-image :src="item.url" :lazy="false"></cy-image>
                    </div>
                </cy-swiper>
            </div>

            <div class="pd-15">
                <div class="flex between">
                    <div>{{storeInfo.name}}</div>
                    <a :href="'tel:'+storeInfo.saleAfterTel">
                        <cy-image
                            :src="require('@/assets/img/user/store/bluephone.png')"
                            width="17px"
                            height="17px"
                        ></cy-image>
                    </a>
                </div>
                <div class="flex wrap vcenter orange">
                    <cy-rate v-model="storeInfo.starLevel" :readOnly="true"></cy-rate>
                    <span class="pdlr-10">{{storeInfo.starLevel || 5}}.0</span>
                    <cy-btn
                        v-for="(item,index) in storeInfo.serviceList"
                        :key="index"
                        background="#FDF6F2"
                        color="#FF6300"
                        round
                        xxs
                        class="mgr-5"
                    >{{item.name}}</cy-btn>
                </div>
                <div class="mgtb-5 fs-12 grey">营业时间 {{storeInfo.startDate}}~{{storeInfo.endDate}}</div>
                <div class="flex vcenter between fs-12 grey" @click="openLocation">
                    <div class="flex vcenter">
                        <cy-icon type="location1" size="13"></cy-icon>
                        <div class="address pdlr-5 hidden-1">
                            <span v-if="!!storeInfo.distance">{{storeInfo.distance}}km</span>
                            {{storeInfo.address}}
                        </div>
                    </div>
                    <cy-image
                        :src="require('@/assets/img/user/store/bluenavigation_icon.png')"
                        width="17px"
                        height="17px"
                    ></cy-image>
                </div>
            </div>
        </div>

        <!-- 施工案例 -->
        <div class="case mgt-10 bg-white">
            <div class="pdlr-15 pdt-15 darkblue">施工案例</div>
            <case-data-list :option="caseOption"></case-data-list>
        </div>

        <!-- 评价信息 -->
        <div class="evaluate mgt-10 pdb-20 bg-white">
            <div class="flex between pdlr-15 pdt-15 darkblue">
                <div>评价信息</div>
                <!-- <div
                    v-if="showAllEvaluate"
                    @click="$router.push({path:'/evaluate',query:{projectPk:storeInfo.projectPk,orgPk:storeInfo.orgPk}})"
                    class="flex center grey fs-12"
                >
                    查看全部
                    <cy-icon type="youjiantou" class="mgl-5"></cy-icon>
                </div> -->
            </div>
            <evaluate-data-info
                :option="evaluateOption"
                :isPullLoadMore="false"
                @change="onChangeEvaluate"
            ></evaluate-data-info>
        </div>
    </div>
</template>

<script>
import cySwiper from "@/components/swiper";
import cyRate from "@/components/rate";
import caseDataList from "@/components/_custom/case/data_list"; //案例列表
import evaluateDataInfo from "@/components/_custom/evaluate/data_info"; //评价列表
import wxx from "@/utils/wx";

export default {
    name: "store",
    components: {
        cySwiper,
        cyRate,
        caseDataList,
        evaluateDataInfo
    },
    data() {
        return {
            storeInfo: {},
            latitude: "",
            longitude: "",
            caseOption: {}, //施工案例参数
            showAllEvaluate: false,
            evaluateOption: {} //评价列表参数
        };
    },
    created() {
        this.projectPk = this.$route.query.projectPk;
        this.storesOrgPk = this.$route.query.orgPk;
        this.init();
    },
    computed: {},
    methods: {
        init() {
            this.$toast.loading("加载中…");
            // 获取经纬度
            const getLocation = () => {
                wx.getLocation({
                    type: "wgs84",
                    success: res => {
                        this.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        this.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        this.useStoresDetails();
                    },
                    cancel: res => {
                        this.useStoresDetails();
                    },
                    fail: err => {
                        this.useStoresDetails();
                    }
                });
            };
            //微信签名配置
            wxx.wxaccountConfig(getLocation);
        },

        //门店信息详情
        useStoresDetails() {
            const params = {
                lat: this.latitude,
                lng: this.longitude,
                storesOrgPk: this.storesOrgPk
            };
            this.$api
                .useStoresDetails(params)
                .then(res => {
                    const imgList = res.obj.imgList.filter(item => {
                        return item.type === "0";  //=0门店形象
                    });
                    this.storeInfo = {
                        ...res.obj,
                        imgList: imgList,
                        distance: !!this.latitude
                            ? (res.obj.distance / 1000).toFixed(2) + ""
                            : false
                    };
                    //评价参数
                    this.evaluateOption = {
                        projectPk: this.projectPk, //大项目pk
                        evaluateOrgPk: res.obj.orgPk //门店pk
                    };
                    this.$toast.clear();
                })
                .catch(err => {});
        },

        //评价总数
        onChangeEvaluate(totle) {
            if (totle !== 0) {
                this.showAllEvaluate = true;
            }
        },

        //打开地图
        openLocation() {
            wx.openLocation({
                latitude: this.storeInfo.y * 1, // 纬度，浮点数，范围为90 ~ -90
                longitude: this.storeInfo.x * 1, // 经度，浮点数，范围为180 ~ -180。
                name: this.storeInfo.name, // 位置名
                address: this.storeInfo.address, // 地址
                scale: 12, // 地图缩放级别,整形值,范围从1~28
                infoUrl: "" // 在查看位置界面底部显示的超链接,可点击跳转
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.header {
    .swiper {
        .cy-swiper {
            height: 215px;
        }
    }
    .address {
        width: 300px;
    }
}
.evaluate {
    .head {
        .l-line::after {
            top: 5px;
            bottom: 5px;
        }
    }
}
</style>
