<!--订单详情-->
<template>
    <div class="orders bg-grey">
        <div class="head tc" :style="`background-image: url(${require('../../../assets/img/user/orders/yellow_bg.png')})`">
            <!-- <div class="qrcode">
                <cy-image :src="qrCode"></cy-image>
            </div> -->
            <div class="code">
                <span class="text">{{checkCode}}</span>
                <div class="code-btn">校验码</div>
            </div>
            <div class="mgb-5 white fs-12">说明：请展示校验码或在设备上输入校验码</div>
            <cy-btn
                @click.native="$router.replace(`/orders?curTabIndex=2&KeepAlive=0`)"
                class="pdlr-20"
                background="rgba(0,0,0,.2)"
                color="#ffffff"
                round
                sm
            >
                <div class="flex center fs-14">
                    核销记录
                    <cy-icon class="mgl-10" type="youjiantou" size="9"></cy-icon>
                </div>
            </cy-btn>
        </div>

        <cy-pullup-loading @loadmore="onLoadmore" :hasMore="isHasMore" :isLoading="isLoading" :dataList="dataList">
            <div class="pdt-15 bg-white">
                <div class="search mgb-10">
                    <cy-search v-model="keyword" @search="onSearch" placeholder="请输入门店称"></cy-search>
                </div>
                <!-- 核销门店列表 -->
                <store-list :dataList="dataList"></store-list>
            </div>
        </cy-pullup-loading>
    </div>
</template>

<script>
import cyPullupLoading from "@/components/pullup_loading";
import cySearch from "@/components/search";
import storeList from "./store_list"; //核销门店记录
import { MixinPage } from "@/utils/mixins/index";
import wxx from "@/utils/wx";

export default {
    name: "orders_detail",
    mixins: [MixinPage],
    components: {
        cyPullupLoading,
        storeList,
        cySearch,
    },
    data() {
        return {
            //qrCode: require("@/assets/img/user/orders/seize_bg.png"), //默认图片
            checkCode: "",
            keyword: "",
            latitude: "",
            longitude: "",
            dataList: [],
        };
    },
    created() { 
        this.projectPk = this.$route.query.projectPk; //项目pk
        this.orgPk = this.$route.query.orgPk;
        this.pk = this.$route.query.pk;
        this.init();
    },
    mounted() {},
    computed: {},
    methods: {
        async init() {
            //this.$toast.loading("加载中…");
            try {
                await this.creatCheckCode();
            } catch (err) {
                setTimeout(() => {
                    this.$router.go(-1);
                }, 1500);
                return;
            }
            // 获取经纬度
            const getLocation = () => {
                wx.getLocation({
                    type: "wgs84",
                    success: (res) => {
                        this.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        this.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        this.getDataList();
                    },
                    cancel: () => {
                        this.$toast.clear();
                        this.$nextTick(() => {
                            this.$dialog({
                                title: "是否开启定位导航去门店？",
                                onConfirm: () => {
                                    this.init();
                                },
                                onCancel: () => {
                                    this.getDataList();
                                },
                            });
                        });
                    },
                    fail: (err) => {
                        this.$toast.clear();
                        this.$nextTick(() => {
                            this.$dialog({
                                title: "无法导航去门店，请手动设置开启定位",
                                noCancel: true,
                                onConfirm: () => {
                                    this.getDataList();
                                },
                            });
                        });
                    },
                });
            };
            //签名配置
            wxx.wxaccountConfig(getLocation);
        },

        //获取code
        creatCheckCode() {
            return new Promise((resolve, reject) => {
                const params = {
                    orgPk: this.orgPk,
                    pk: this.pk,
                };
                this.$api
                    .creatCheckCode(params)
                    .then((res) => {
                        this.checkCode = res.obj.checkCode.slice(0,3)+' '+res.obj.checkCode.slice(3) ;
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },

        //获取列表
        getDataList() {
            const params = {
                x: this.longitude,
                y: this.latitude,
                name: this.keyword,
                projectPk: this.projectPk,
                orgPk: this.orgPk,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
            };
            this.$api
                .useStoresByShareNew(params)
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
                    const serviceList = [
                        { name: "洗车" },
                        { name: "镀晶" },
                        { name: "美容" },
                        { name: "保养" },
                        { name: "维修" },
                    ];
                    const levelText = ["一星", "二星", "三星", "四星", "五星"];

                    const list = res.obj.map((item, index, list) => {
                        const imgList = item.imgList.filter((item) => {
                            return item.type === "0"; //=0门店形象
                        });
                        item.imgList = imgList;
                        item.serviceList = //主营
                            item.serviceList.length === 0
                                ? serviceList
                                : item.serviceList;
                        item.distance = !!this.longitude
                            ? (item.distance / 1000).toFixed(2) + ""
                            : false;
                        item.levelText = levelText[item.level - 1];

                        item.distance = !!this.longitude
                            ? (item.distance / 1000).toFixed(2)
                            : false;
                        item.projectPk = this.projectPk;
                        return item;
                    });

                    this.dataList = this.dataList.concat(list);
                    this.$toast.clear();
                })
                .catch((err) => {});
        },

        //搜索
        onSearch() {
            this.pageNum = 1;
            this.isLoading = true;
            this.dataList = [];
            this.getDataList();
        },
    },

    // //清除页面缓存
    // beforeRouteLeave(to, from, next) { console.log('to',to);
    //     if (to.path === "/orders" && to.query.KeepAlive ==='0') {
    //         this.$store.commit("setKeepAlive", []);
    //     }
    //     next();
    // }
};
</script>
<style lang="scss" scoped>
.head {
    width: 100%;
    height: 340px;
    padding: 30px;
    background-color: #2999eb;
    background-size: cover;
    // .qrcode {
    //     width: 100px;
    //     height: 100px;
    //     padding: 5px;
    //     margin: 5px auto;
    // }
    .code {
        display: flex;
        align-items: center;
        margin: 165px auto 0px auto;
        width: 260px;
        height: 85px;
        line-height: 85px;
        .text {
            flex: 1;
            font-size: 54px;
            font-weight: 700;
            color: #d01a1a;
            letter-spacing: -1px;
        }
        .code-btn {
            flex: 0 0 53px;
            height: 29px;
            line-height: 29px;
            text-align: center;
            font-weight: 600;
            font-size: 13px;
            color: #cf392c;
            background: url("../../../assets/img/user/orders/label_bg.png");
            background-size: cover;
        }
    }
}
.search {
    margin: 0px 20px;
    border: solid 1px #d8d8d8;
    border-radius: 60px;
    overflow: hidden;
}
</style>
