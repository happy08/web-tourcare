<!--门店排行榜-->
<template>
    <div class="mgb-30">
        <!-- 数据列表 -->
        <cy-pullup-loading :isPullLoadMore="false" @loadmore="onLoadmore" :hasMore="isHasMore" :isLoading="isLoading" :noMore="false" :dataList="dataList">
            <data-list :headList="headList" @sort="onSort">
                <div class="data-list">
                    <div v-for="(item,index) in dataList" :key="index" class="item">
                        <div class="pdtb-10 pdlr-5" :class="item.me?'bg-myself':''">
                            <div v-if="item.me" class="icon-myself">我在这</div>
                            <cy-row :gutter="5" class="white fs-15 tc cy-slide-right-in" :class="'ani-d-'+(index%pageSize)">
                                <cy-col class="flex center w60">
                                    <cy-image
                                        v-if="item.rank===1"
                                        class="cy-rotate-rank ani-d-1"
                                        :src="require('@/assets/img/mydata/one_icon.png')"
                                        width="25px"
                                        height="28px"
                                    ></cy-image>
                                    <cy-image
                                        v-else-if="item.rank===2"
                                        class="cy-rotate-rank ani-d-3"
                                        :src="require('@/assets/img/mydata/two_icon.png')"
                                        width="25px"
                                        height="25px"
                                    ></cy-image>
                                    <cy-image
                                        v-else-if="item.rank===3"
                                        class="cy-rotate-rank ani-d-5"
                                        :src="require('@/assets/img/mydata/three_icon.png')"
                                        width="25px"
                                        height="25px"
                                    ></cy-image>
                                    <span v-else>{{item.rank}}</span>
                                </cy-col>
                                <cy-col class="flex center">
                                    <div class="fs-12 hidden-2">{{item.storeOrgName}}</div>
                                </cy-col>
                                <cy-col>
                                    <div>￥{{item.storeTotalCharge}}</div>
                                    <div class="flex center">
                                        <span class="assist lightblue">{{item.storeLastCharge}}</span>
                                        <span class="assist" :class="item.storeRatio<0?'red':'skyblue'">
                                            <cy-icon
                                                v-if="item.storeRatio>0"
                                                type="wangshang"
                                                color="#52A0FF"
                                                :size="7"
                                            ></cy-icon>
                                            <cy-icon
                                                v-if="item.storeRatio<0"
                                                type="wangxia"
                                                color="#FF5F5F"
                                                :size="7"
                                            ></cy-icon>{{item.storeRatio}}%
                                        </span>
                                    </div>
                                </cy-col>
                                <cy-col>
                                    <div>{{item.salesTotalNum}}</div>
                                    <div class="flex center">
                                        <span class="assist lightblue">{{item.salesLastNUm}}</span>
                                        <span class="assist" :class="item.salesRatio<0?'red':'skyblue'">
                                            <cy-icon
                                                v-if="item.salesRatio>0"
                                                type="wangshang"
                                                color="#52A0FF"
                                                :size="7"
                                            ></cy-icon>
                                            <cy-icon
                                                v-if="item.salesRatio<0"
                                                type="wangxia"
                                                color="#FF5F5F"
                                                :size="7"
                                            ></cy-icon>{{item.salesRatio}}%
                                        </span>
                                    </div>
                                </cy-col>
                                <cy-col>
                                    <div>{{item.constructionTotalTimes}}</div>
                                    <div class="flex center">
                                        <span class="assist lightblue">{{item.constructionLastTimes}}</span>
                                        <div class="assist" :class="item.constructionRatio<0?'red':'skyblue'">
                                            <cy-icon
                                                v-if="item.constructionRatio>0"
                                                type="wangshang"
                                                color="#52A0FF"
                                                :size="7"
                                            ></cy-icon>
                                            <cy-icon
                                                v-if="item.constructionRatio<0"
                                                type="wangxia"
                                                color="#FF5F5F"
                                                :size="7"
                                            ></cy-icon>
                                            {{item.constructionRatio}}%
                                        </div>
                                    </div>
                                </cy-col>
                            </cy-row>
                        </div>
                    </div>
                </div>
            </data-list>
        </cy-pullup-loading>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { dateDiffDate, dateDiffDays } from "@/utils/formatDate";
import { sub, mul, div } from "@/utils/number";
import cyPullupLoading from "@/components/pullup_loading"; //加载更多
import cyBadge from "@/components/badge";
import dataHeader from "@/components/_custom/mydata/data_header"; //数据头部
import dataList from "@/components/_custom/mydata/data_list"; //数据列表
import { MixinPage } from "@/utils/mixins/index";

export default {
    name: "distribution",
    mixins: [MixinPage],
    components: {
        cyPullupLoading,
        cyBadge,
        dataHeader,
        dataList
    },
    props: {
        option: Object,
    },
    data() {
        return {
            pageSize:10,
            dataListParams: {
                storeOrgPk: "", //门店pk
                startTime: "",
                endTime: "",
                province: "",
                city: "",
                orderBy: "0", //0 = 收益  1=数量  2=施工
                orderType: "0" //0=降序 1=升
            },
            headList: [
                {
                    pk: "-2",
                    name: "排名",
                    unit: "",
                    sort: false,
                    rank: true, //排名标识
                },
                {
                    pk: "-1",
                    name: "门店",
                    unit: "",
                    sort: false
                },
                {
                    pk: "0",
                    name: "收益",
                    unit: "",
                    sort: "0", //-1不排序 0=降序 1=升
                },
                {
                    pk: "1",
                    name: "销售",
                    unit: "单",
                    sort: "-1",
                },
                {
                    pk: "2",
                    name: "施工",
                    unit: "次",
                    sort: "-1",
                }
            ],
            dataList: [],
            tmpTime:{}
        };
    },
    created() {
        
    },
    watch: {
        option: {
            handler(nVal, oVal) {
                this.pageNum = 1;
                this.tmpTime = nVal
                this.getDataList(nVal);
            },
            immediate: true,
            deep: true,
        }
    },
    computed: {
        ...mapState(["defaultRole"])
    },
    methods: {

        //外部主动更新数据
        updateData(option){ 
            //时间不一致时更新
            if(option.startTime != this.tmpTime.startTime || option.endTime != this.tmpTime.endTime){
                this.$toast("时间变化，数据正在更新")
                this.pageNum = 1
                this.tmpTime = option
                this.getDataList(option)
                return true
            }
            return false
        },
        
        //获取列表
        getDataList(option = {}) {
            if (this.pageNum === 1) {
                this.dataList = [];
            }

            this.dataListParams = {
                ...this.dataListParams,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                ...option
            };
            this.$api
                .mdRankNew(this.dataListParams)
                .then(res => {
                    this.total = res.total;
                    this.isLoading = false;
                    if (
                        res.obj.page.length < this.pageSize ||
                        this.pageNum === this.total
                    ) {
                        this.isHasMore = false;
                    } else {
                        this.isHasMore = true;
                    }

                    let list = res.obj.page;
                    if (this.pageNum === 1 && res.obj.storeDto) {
                        list.unshift({
                            ...res.obj.storeDto,
                            me: true
                        });
                    }
                    list = list.map((item) => {
                        const [ storeCurrentValue, storeRatio ] = this.computeRatio(
                            item.storeCharge,
                            item.storeLastCharge
                        );
                        item.storeRatio = storeRatio;
                        item.storeLastCharge = (storeCurrentValue >= 0 ? "+" : "") + storeCurrentValue;

                        const [ salesCurrentValue, salesRatio ] = this.computeRatio(
                            item.salesNum,
                            item.salesLastNUm
                        );
                        item.salesRatio = salesRatio;
                        item.salesLastNUm = (salesCurrentValue >= 0 ? "+" : "") + salesCurrentValue;

                        const [ constructionCurrentValue, constructionRatio ] = this.computeRatio(
                            item.constructionTimes,
                            item.constructionLastTimes
                        );
                        item.constructionRatio = constructionRatio;
                        item.constructionLastTimes = (constructionCurrentValue >= 0 ? "+" : "") + constructionCurrentValue;
                        return item;
                    });
                    this.dataList = this.dataList.concat(list);
                })
                .catch(err => {
                    this.isHasMore = false;
                });
        },

        //计算环比 val1=当期数，val2=上期数
        computeRatio(val1, val2) {
            const currentValue = val1;
            const ratio = val2 === 0 ? "- " : mul(div(Math.round(mul(div(sub(val1, val2), val2 || 1), 100)), 100),100)
            return [currentValue, ratio];
        },

        //排序
        onSort(pk, sort) {
            this.isLoading = true;
            var sortTmp = "0";
            const headList = this.headList.map((item) => {
                let obj = {
                    pk: item.pk,
                    name: item.name,
                    unit: item.unit,
                    rank: item.rank
                };
                if (item.pk === pk) {
                    sort === "0" ? (obj.sort = "1") : (obj.sort = "0");
                    sortTmp = obj.sort;
                } else {
                    if (!!item.sort) {
                        obj.sort = "-1";
                    } //-1不排序 0=降序 1=升
                }
                return obj;
            });
            this.headList = headList;
            const option = {
                orderBy: pk, //0 = 返现， 1=浏览， 2=转发， 3=购买次数
                orderType: sortTmp, //0=降序 1=升
            };
            this.pageNum = 1;
            this.getDataList(option);
        },

        // //条件搜索
        // onChangeSearch(option) {
        //     this.pageNum = 1;
        //     //计算日期相差天数
        //     const days = dateDiffDays(option.startTime, option.endTime)
        //     //计算days天前的日期
        //     option.startLastTime = dateDiffDate(option.startTime, -days)
        //     option.endLastTime = dateDiffDate(option.startTime, -1)

        //     this.totalOption = option;
        //     this.getDataList(option);
        // }
    }
};
</script>
<style lang="scss" scoped>
.data-list {
    .bg-myself{
        position: relative;
        background: #003f74;
    }
    .icon-myself{
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        padding: 2px;
        width: 15px;
        text-align: center;
        color: #ffffff;
        font-size: 10px;
        background: linear-gradient(90deg, #2bd0b2, #4490ee);
    }
    .item {
        background: #032038;
        &:nth-child(2n) {
            background: #04233d;
        }
        .w60 {
            width: 60px;
            flex: 0 0 60px;
        }
        .assist {
            display: flex;
            align-items: center;
            padding: 0px 5px;
            margin: 0 1px;
            border-radius: 50px;
            font-size: 10px;
            background: #00192d;
            white-space:nowrap;
        }
    }
}
</style>
