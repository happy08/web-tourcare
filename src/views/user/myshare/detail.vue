<!--分享详情-->
<template>
    <div class="myshare">
        <div class="head white tc">
            <cy-row class="pdr-10 golden">
                <cy-col :span="6" class="flex center column">
                    <div class="fs-12">阅读(次)</div>
                    <div class="fs-18">{{statistics.browseStatusSum}}</div>
                </cy-col>
                <cy-col :span="6" class="flex center column l-line">
                    <div class="fs-12">转发(次)</div>
                    <div class="fs-18">{{statistics.forwardStatusSum}}</div>
                </cy-col>
                <cy-col :span="6" class="flex center column l-line">
                    <div class="fs-12">购买(次)</div>
                    <div class="fs-18">{{statistics.buyStatusSum}}</div>
                </cy-col>
                <cy-col :span="6" class="flex center column l-line">
                    <div class="fs-12">时长</div>
                    <div class="datetime fs-18" v-html="statistics.browseTimesSum"></div>
                </cy-col>
            </cy-row>
        </div>

        <div class="mgb-20">
            <cy-pullup-loading @loadmore="onLoadmore" :hasMore="isHasMore" :isLoading="isLoading" :noMore="false" :dataList="dataList">
                <ul class="data-list">
                    <li v-for="item in dataList" :key="item.pk" class="b-line">
                        <div class="item-l">
                            <cy-image :src="item.memberFace" round></cy-image>
                        </div>
                        <div class="item-r">
                            <div class>{{item.memberName}}</div>
                            <div class="fs-12 darkgrey">
                                浏览时间
                                <span v-html="item.browseTimes"></span>
                                | {{item.createTime}} {{item.buyStatus == 1?'| 购买':''}} {{item.forwardStatus == 1?`| 转发${item.forwardStatusCount>1?'*'+item.forwardStatusCount:''}`:''}}
                            </div>
                        </div>
                    </li>
                </ul>
            </cy-pullup-loading>
        </div>
    </div>
</template>

<script>
import cyPullupLoading from "@/components/pullup_loading";
import { MixinPage } from "@/utils/mixins/index";
import { semantics } from "@/utils/formatDate";

export default {
    name: "myshare_detail",
    mixins: [MixinPage],
    components: {
        cyPullupLoading,
    },
    data() {
        return {
            statistics: {},
            startDate: "",
            endDate: "",
            dataList: [],
        };
    },
    created() {
        this.status = this.$route.query.status;
        this.browseUserPk = this.$route.query.browseUserPk;
        this.startDate = this.$route.query.startDate;
        this.endDate = this.$route.query.endDate;
        this.getDataList();
    },
    computed: {},
    methods: {
        //获取列表
        getDataList() {
            this.$toast.loading("加载中…");
            if (this.pageNum === 1) {
                this.dataList = [];
            }
            const params = {
                [this.status]: "1",
                browseUserPk: this.browseUserPk,
                startTime: this.startDate,
                endTime: this.endDate,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
            };
            this.$api
                .getMyShareDetail(params)
                .then((res) => {
                    this.total = res.total;
                    this.isLoading = false;
                    if (
                        res.obj.pages.length < params.pageSize ||
                        params.pageNum === this.total
                    ) {
                        this.isHasMore = false;
                    } else {
                        this.isHasMore = true;
                    }

                    this.statistics = {
                        ...res.obj.statistics,
                        browseTimesSum: this.toTimeStr(
                            res.obj.statistics.browseTimesSum * 1000
                        ),
                    };
                    const dataList = res.obj.pages.map((item) => {
                        item.browseTimes = this.toTimeStr(
                            item.browseTimes * 1000
                        );
                        return item;
                    });
                    this.dataList = this.dataList.concat(dataList);
                    this.$toast.clear();
                })
                .catch((err) => {
                    this.isHasMore = false;
                });
        },

        toTimeStr(time) {
            let [days, hours, minutes, seconds] = semantics(time);
            return (
                (days > 0 ? days + "<span>天</span>" : "") +
                (hours > 0 ? hours + "<span>时</span>" : "") +
                (minutes > 0 ? minutes + "<span>分</span>" : "") +
                (seconds > 0 ? seconds + "<span>秒</span>" : "")
            );
        },

        // fill2(v) {
        //     if (v > 0 && v < 10) {
        //         v = "0" + v;
        //     }
        //     return v;
        // },
    },
};
</script>
<style lang="scss" scoped>
.head {
    position: relative;
    display: flex;
    align-items: center;
    height: 91px;
    background: url("../../../assets/img/user/myshare/detail_head_bg.png");
    background-size: 100% 100%;
    .datetime {
        /deep/span {
            font-size: 12px;
        }
    }
}

.l-line::after {
    border-left: 0.02667rem solid #1c4054;
    top: 7px;
    bottom: 7px;
}
.data-list {
    li {
        position: relative;
        display: flex;
        align-items: center;
        margin: 0px 15px;
        padding: 10px 0;

        .item-l {
            flex: 0 0 30px;
            height: 30px;
        }
        .item-r {
            flex: 1;
            margin-left: 15px;
            line-height: 24px;
        }
    }
}
</style>
