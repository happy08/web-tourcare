<!--闲置设备-->
<template>
    <div class="mgb-50">
        <div class="pd-15 white">
            <div class="fs-26">闲置设备</div>
            <div class="mgt-5">设备类型：{{projectType}}</div>
            <div class="mgt-5">闲置时间：{{idleTime}}</div>
            <div class="mgt-5">闲置台数：{{idleNum}}台</div>
        </div>

        <!-- 数据列表 -->
        <cy-pullup-loading
            :isPullLoadMore="false"
            @loadmore="onLoadmore"
            :hasMore="isHasMore"
            :isLoading="isLoading"
            :noMore="false"
            :dataList="dataList"
        >
            <data-list :headList="headList">
                <div class="data-list white">
                    <div class="item" v-for="(item,index) in dataList" :key="index">
                        <cy-row :gutter="5" class="tc">
                            <cy-col>
                                <div>{{item.equipmentId}}</div>
                            </cy-col>
                            <cy-col>
                                <div>{{item.storeOrgName}}</div>
                            </cy-col>
                        </cy-row>
                    </div>
                </div>
            </data-list>
        </cy-pullup-loading>
    </div>
</template>

<script>
import cyPullupLoading from "@/components/pullup_loading"; //加载更多
import cyBadge from "@/components/badge";
import dataList from "@/components/_custom/mydata/data_list"; //数据列表
import { MixinPage } from "@/utils/mixins/index";

export default {
    name: "share_detail",
    mixins: [MixinPage],
    props: {
        option: Object,
    },
    components: {
        cyPullupLoading,
        cyBadge,
        dataList,
    },
    data() {
        return {
            projectType: "",
            idleTime: "",
            idleNum: "",

            headList: [
                {
                    pk: "0",
                    name: "设备ID",
                },
                {
                    pk: "1",
                    name: "所属门店",
                },
            ],
            dataList: [],
        };
    },
    created() {},
    watch: {
        option: {
            handler(nVal, Oval) {
                this.pageNum = 1;
                this.getDataList();
            },
            immediate: true,
            deep: true,
        },
    },
    computed: {},
    methods: {
        //获取分享详情列表
        getDataList() {
            this.$toast.loading("加载中…");
            if (this.pageNum === 1) {
                this.dataList = [];
            }
            const params = {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                ...this.option,
            };
            this.$api
                .getIdleEquipmentList(params)
                .then((res) => {
                    this.total = res.total;
                    this.isLoading = false;
                    if (
                        res.obj.pageList.length < this.pageSize ||
                        this.pageNum === this.total
                    ) {
                        this.isHasMore = false;
                    } else {
                        this.isHasMore = true;
                    }
                    this.projectType = res.obj.projectType;
                    let time = this.option.idleTime.split(" ");
                    if (this.option.type == 0) {
                        const t = time[1].split(":");
                        time = `${time[0]} ${t[0]}:${t[1]}`;
                    } else {
                        time = time[0];
                    }
                    this.idleTime = time;
                    this.idleNum = res.obj.idleNum;
                    this.dataList = this.dataList.concat(res.obj.pageList);
                    this.$toast.clear();
                })
                .catch((err) => {
                    this.isHasMore = false;
                });
        },
    },
};
</script>
<style lang="scss" scoped>
.data-list {
    .item {
        padding: 12px 10px;
        background: #032038;
        &:nth-child(2n) {
            background: #04233d;
        }
    }
}
</style>
