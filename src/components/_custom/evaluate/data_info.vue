<!--评价信息-->
<template>
    <div>
        <div class="head pdtb-10 mglr-15 lh12 b-line tc">
            <cy-row>
                <cy-col :span="12">
                    <div class="fs-18 darkblue">{{levelAvg}}.0分</div>
                    <div class="fs-12 grey">综合评分</div>
                </cy-col>
                <cy-col :span="12" class="l-line">
                    <div class="fs-18 darkblue">{{evaluateTotal}}条</div>
                    <div class="fs-12 grey">评价数</div>
                </cy-col>
            </cy-row>
        </div>

        <cy-pullup-loading
            @loadmore="onLoadmore"
            :isPullLoadMore="isPullLoadMore"
            :isLoading="isLoading"
            :hasMore="isHasMore"
            :dataList="dataList"
        >
            <div class="pdlr-10">
                <data-list :dataList="dataList"></data-list>
            </div>
        </cy-pullup-loading>
    </div>
</template>

<script>
import cyPullupLoading from "@/components/pullup_loading";
import dataList from "./data_list";
import { MixinPage } from "@/utils/mixins/index";

export default {
    name: "evaluate_info",
    mixins: [MixinPage],
    components: {
        cyPullupLoading,
        dataList,
    },
    props: {
        isPullLoadMore: {
            type: Boolean,
            default: true,
        },
        option: Object,
    },
    data() {
        return {
            levelAvg: "0",
            evaluateTotal: "0",
            dataList: [],
        };
    },
    created() {},
    computed: {},
    watch: {
        option: {
            handler(nVal, oVal) {
                if (JSON.stringify(nVal) !== "{}") {
                    this.getDataList();
                }
            },
            immediate: true,
        },
    },
    methods: {
        //获取评价列表
        getDataList() {
            let params = {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
            };
            params = { ...params, ...this.option };

            this.$api
                .findAllEvaluateProject(params)
                .then((res) => {
                    this.total = res.total;
                    this.isLoading = false;
                    if (
                        res.obj.page.length < params.pageSize ||
                        params.pageNum === this.total
                    ) {
                        this.isHasMore = false;
                    } else {
                        this.isHasMore = true;
                    }

                    this.levelAvg = res.obj.levelAvg;
                    this.evaluateTotal = res.obj.evaluateTotal;
                    // const list = res.obj.page.map((item) => {
                    //     item.show = false;
                    //     return item;
                    // });

                    this.dataList = this.dataList.concat(res.obj.page);
                    this.$emit("change", this.evaluateTotal);
                })
                .catch(() => {
                    this.isHasMore = false;
                });
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
        margin: 0px 15px;
        padding: 15px 0;
        .item-l {
            flex: 0 0 30px;
            height: 30px;
        }
        .item-r {
            flex: 1;
            margin-left: 15px;
        }
    }
}
</style>
