<!--核销门店-->
<template>
    <cy-popup
        v-model="showWriteOff"
        :closeIcon="false"
        position="bottom"
        height="220px"
        width="100%"
        @onClose="onClose"
    >
        <div class="pdlr-10 pdt-5">核销记录</div>
        <ul class="write-off pd-10">
            <li>
                <div class="item">
                    <div class="flex">
                        <div class="item-l">
                            <cy-swiper
                                v-if="info.imgList && info.imgList.length>0"
                                :autoPlay="3000"
                                :pagination="true"
                                :swiperData="info.imgList"
                            >
                                <div
                                    v-for="(item,index) in info.imgList"
                                    :key="index"
                                    class="cy-swiper-slide"
                                >
                                    <cy-image :src="item.url" :lazy="false"></cy-image>
                                </div>
                            </cy-swiper>
                            <cy-image v-else :src="require('@/assets/img/image.png')"></cy-image>
                        </div>
                        <div class="item-r fs-12 darkgrey">
                            <div class="fs-14 black bold">{{info.name}}</div>
                            <div class="flex wrap vcenter">
                                <div class="flex wrap vcenter">
                                    评价：
                                    <cy-rate v-model="info.level" :readOnly="true" :size="12"></cy-rate>
                                    <span class="pdl-10 orange">{{info.levelText}}</span>
                                </div>
                            </div>
                            <div
                                @click="openLocation(info.x,info.y,info.name,info.address)"
                                class="flex vcenter"
                            >
                                <cy-icon type="location1" color="#f20" size="13"></cy-icon>
                                <div class="address pdlr-5 hidden-1">
                                    <span v-if="!!info.distance">{{info.distance}}km</span>
                                    {{info.address}}
                                </div>
                                <!-- <cy-icon type="youjiantou" color="#666666" size="8"></cy-icon> -->
                            </div>

                            <div class="flex between vcenter mgr-5">
                                <div>营业时间:{{info.openStartTime}}~{{info.openEndTime}}</div>
                                <div @click="callPhone(info.phone)" class="orange fs-14">
                                    <cy-icon type="phone" size="12" color="#FA6400"></cy-icon>
                                    {{info.phone}}
                                </div>
                            </div>
                            <div>
                                主营特色:
                                <cy-btn
                                    v-for="(item,index) in info.serviceList"
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

                    <div class="flex between vcenter">
                        <div class="pdtb-10 fs-12 darkgrey">核销时间: {{info.useTime}}</div>
                    </div>
                    <div class="go-btn">
                        <!-- =1允许评价-->
                        <template v-if="info.allowEvaluate === '1'">
                            <!-- =0未评价 -->
                            <cy-btn
                                v-if="info.evaluateStatus === '0'"
                                @click.native="toEvaluate(info)"
                                type="blue-gradient"
                                class="pdlr-15"
                                round
                                sm
                            >去评价</cy-btn>
                            <!-- =1已评价 -->
                            <cy-btn
                                v-if="info.evaluateStatus === '1'"
                                @click.native="checkEvaluate(info)"
                                type="blue-gradient"
                                class="pdlr-15"
                                round
                                sm
                            >查看评价</cy-btn>
                        </template>
                    </div>
                </div>
            </li>
        </ul>
    </cy-popup>
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
        show: {
            type: Boolean,
            default: false,
        },
        option: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    data() {
        return {
            longitude: "",
            latitude: "",
            showWriteOff: false,
            info: [],
        };
    },
    created() {},
    watch: {
        show(nVal, oVal) {
            nVal && this.useStoresByShareNew(this.option); //useStoresDetails
        },
    },
    computed: {},
    methods: {
        //核销记录
        async useStoresByShareNew(option) {
            this.$toast.loading("加载中…");
            if (!this.longitude && !this.latitude) {
                // 获取经纬度
                try {
                    await this.getLocation();
                } catch (err) {}
            }
            const params = {
                x: this.longitude,
                y: this.latitude,
                storesOrgPk: option.useStorePk, //核销门店pk
                projectPk: option.projectPk,
                orgPk: option.orgPk,
                pageNum: "1",
                pageSize: "1",
            };
            this.$api
                .useStoresByShareNew(params)
                .then((res) => {
                    const obj = res.obj[0];
                    const imgList = obj.imgList.filter((item) => {
                        return item.type === "0"; //=0门店形象
                    });
                    const serviceList = [
                        { name: "洗车" },
                        { name: "镀晶" },
                        { name: "美容" },
                        { name: "保养" },
                        { name: "维修" },
                    ];
                    const levelText = ["一星", "二星", "三星", "四星", "五星"];
                    this.info = {
                        ...obj,
                        imgList,
                        //主营
                        serviceList:
                            obj.serviceList.length === 0
                                ? serviceList
                                : obj.serviceList,
                        distance: !!this.longitude
                            ? (obj.distance / 1000).toFixed(2) + ""
                            : false,
                        levelText: levelText[obj.level - 1],
                        allowEvaluate: option.allowEvaluate, //=0不可评价 =1可评
                        evaluateStatus: option.evaluateStatus, //=0未评状态  =1已评
                        userProjectPk: option.pk, //订单PK
                        projectOrgPk: option.orgPk, //订单的厂商/代理商PK
                        projectPk: option.projectPk, //项目PK
                        useTime: option.useTime, //核销时间
                        projectName: option.projectName, //项目名
                    };

                    this.showWriteOff = true;
                    this.$toast.clear();
                })
                .catch((err) => {});
        },

        // 获取经纬度
        getLocation() {
            return new Promise((resolve, reject) => {
                const getLocation = () => {
                    wx.getLocation({
                        type: "wgs84",
                        success: (res) => {
                            this.longitude = res.longitude; //经度longitude
                            this.latitude = res.latitude; //纬度latitude范围为90 ~ -90
                            resolve();
                        },
                        cancel: (res) => {
                            reject();
                        },
                        fail: (err) => {
                            reject();
                        },
                    });
                };
                //微信签名配置
                wxx.wxaccountConfig(getLocation);
            });
        },

        //去评价
        toEvaluate(info) {
            this.onClose()
            this.$router.push({
                path: "/evaluate/add",
                query: {
                    projectName: info.projectName,
                    userProjectPk: info.userProjectPk, //订单pk
                    orgPk: info.projectOrgPk, //订单的厂商/代理商PK
                    evaluateOrgPk: info.orgPk, //核销门店pk
                    projectPk: info.projectPk, //大项目PK 01
                },
            });
        },

        //查看评价
        checkEvaluate(info) {
            this.onClose()
            this.$router.push({
                path: "/evaluate/detail",
                query: { userProjectPk: info.userProjectPk },
            });
        },

        //打开地图
        openLocation(x, y, name, address) {
            wx.openLocation({
                latitude: y * 1, // 纬度，浮点数，范围为90 ~ -90
                longitude: x * 1, // 经度，浮点数，范围为180 ~ -180。
                name: name, // 位置名
                address: address, // 地址详情说明
                scale: 12, // 地图缩放级别,整形值,范围从1~28。默认为最大
                //infoUrl // 在查看位置界面底部显示的超链接,可点击跳转
            });
        },

        //打电话
        callPhone(phone) {
            if (!phone) {
                return;
            }
            window.location.href = "tel://" + phone;
        },

        //隐藏弹窗
        onClose() {
            this.showWriteOff = false;
            this.$emit("update:show", false);
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
            .go-btn {
                position: absolute;
                bottom: 2px;
                right: 0px;
            }
        }
    }
}
</style>
