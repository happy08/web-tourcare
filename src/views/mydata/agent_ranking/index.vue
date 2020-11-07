<!-- 经营排行榜 -设备数据-->
<template>
    <div class="mgb-30">
        <div class>
            <cy-row wrap="wrap" class="pdlr-5 blue fs-12">
                <cy-col :span="12" v-for="(item,index) in totalList" :key="index">
                    <div class="data-box bg-blue mglr-5 mgb-10 pd-10 cy-zoom-in">
                        <div class="flex between">
                            <span>环比{{(item.currentValue>=0?'+':'-')+item.currentValue}}</span>
                            <span class="flex vcenter" :class="item.ratio<0?'red':'blue'">
                                <cy-icon
                                    v-if="item.ratio>0"
                                    class="cy-up mgr-3"
                                    type="wangshang"
                                    color="#52A0FF"
                                    :size="12"
                                ></cy-icon>
                                <cy-icon
                                    v-if="item.ratio<0"
                                    class="mgr-3"
                                    type="wangxia"
                                    color="#FF5F5F"
                                    :size="12"
                                ></cy-icon>
                                {{item.ratio}}%
                            </span>
                        </div>
                        <div class="fs-26 ts-blue tc bold">
                            <number-plus class="greenblue" :value="item.value"></number-plus>
                        </div>
                        <div class="tc">{{item.title}}({{item.unit}})</div>
                        <div class="data-border-line border-lt"></div>
                        <div class="data-border-line border-rt"></div>
                        <div class="data-border-line border-lb"></div>
                        <div class="data-border-line border-rb"></div>
                    </div>
                </cy-col>
            </cy-row>
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
            <data-list :headList="headList" @sort="onSort">
                <div class="data-list">
                    <div v-for="(item,index) in dataList" :key="index" class="item">
                        <div class="pdtb-10 pdlr-5" :class="item.me?'bg-myself':''">
                            <div v-if="item.me" class="icon-myself">我在这</div>
                            <cy-row
                                :gutter="5"
                                class="white fs-15 tc cy-slide-right-in"
                                :class="'ani-d-'+(index%pageSize)"
                            >
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
                                <cy-col>
                                    <div>￥{{item.storeTotalCharge}}</div>
                                     <div class="flex center">
                                        <span class="assist lightblue">{{item.storeLastCharge}}</span>
                                        <span
                                            class="assist"
                                            :class="item.storeChargeRatio<0?'red':'skyblue'"
                                        >
                                            <cy-icon
                                                v-if="item.storeChargeRatio>0"
                                                type="wangshang"
                                                color="#52A0FF"
                                                :size="7"
                                            ></cy-icon>
                                            <cy-icon
                                                v-if="item.storeChargeRatio<0"
                                                type="wangxia"
                                                color="#FF5F5F"
                                                :size="7"
                                            ></cy-icon>
                                            {{item.storeChargeRatio}}%
                                        </span>
                                    </div>
                                    <div class="mgt-5 hidden-2 lh12 fs-10">{{item.agentOrgName}}</div>
                                </cy-col>
                                <cy-col>
                                    <div>{{item.equipmentTotalSum}}</div>
                                    <div class="flex center">
                                        <span class="assist lightblue">{{item.equipmentLastSum}}</span>
                                        <span
                                            class="assist"
                                            :class="item.equipmentRatio<0?'red':'skyblue'"
                                        >
                                            <cy-icon
                                                v-if="item.equipmentRatio>0"
                                                type="wangshang"
                                                color="#52A0FF"
                                                :size="7"
                                            ></cy-icon>
                                            <cy-icon
                                                v-if="item.equipmentRatio<0"
                                                type="wangxia"
                                                color="#FF5F5F"
                                                :size="7"
                                            ></cy-icon>
                                            {{item.equipmentRatio}}%
                                        </span>
                                    </div>
                                </cy-col>
                                <cy-col>
                                    <div>{{item.storeTotalSum}}</div>
                                    <div class="flex center">
                                        <span class="assist lightblue">{{item.storeLastSum}}</span>
                                        <span
                                            class="assist"
                                            :class="item.storeRatio<0?'red':'skyblue'"
                                        >
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
                                            ></cy-icon>
                                            {{item.storeRatio}}%
                                        </span>
                                    </div>
                                </cy-col>
                                <cy-col>
                                    <div>{{item.constructionTotalTimes}}</div>
                                    <div class="flex center">
                                        <span
                                            class="assist lightblue"
                                        >{{item.constructionLastTimes}}</span>
                                        <div
                                            class="assist"
                                            :class="item.constructionRatio<0?'red':'skyblue'"
                                        >
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
import { sub, mul, div } from "@/utils/number";
import numberPlus from "@/components/_custom/mydata/number_plus"; //数字加
import cyPullupLoading from "@/components/pullup_loading"; //加载更多
import dataList from "@/components/_custom/mydata/data_list"; //数据列表
import { MixinPage } from "@/utils/mixins/index";

export default {
    name: "aget_ranking",
    mixins: [MixinPage],
    components: {
        cyPullupLoading,
        numberPlus,
        dataList,
    },
    props: {
        option: Object,
    },
    data() {
        return {
            pageSize:3,
            params: {
                agentOrgPk: this.$store.state.defaultRole.defaultOrgPk,
                startTime: "",
                endTime: "",
                orderBy: "0", //0 = 收益， 1=设备数量， 2=门店数量， 3=施工次数
                orderType: "0", //0=降序 1=升
            },
            totalList: [
                {
                    title: "收益",
                    unit: "元",
                    value: 0,
                    currentValue: 0,
                    ratio: 0, //环比率
                },
                {
                    title: "设备",
                    unit: "台",
                    value: 0,
                    currentValue: 0,
                    ratio: 0,
                },
                {
                    title: "门店",
                    unit: "家",
                    value: 0,
                    currentValue: 0,
                    ratio: 0,
                },
                {
                    title: "施工",
                    unit: "次",
                    value: 0,
                    currentValue: 0,
                    ratio: 0,
                },
            ],
            headList: [
                {
                    pk: "-1",
                    name: "排名",
                    unit: "",
                    sort: false,
                    rank: true, //排名标识
                },
                {
                    pk: "0",
                    name: "收益",
                    unit: "",
                    sort: "0", //-1不排序 0=降序 1=升
                },
                {
                    pk: "1",
                    name: "设备",
                    unit: "台",
                    sort: "-1",
                },
                {
                    pk: "2",
                    name: "门店",
                    unit: "家",
                    sort: "-1",
                },
                {
                    pk: "3",
                    name: "施工",
                    unit: "次",
                    sort: "-1",
                },
            ],
            dataList: [],
            tmpTime:{}
        };
    },
    created() {},
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
    mounted() {},
    computed: {},
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

        //获取经营排行榜
        getDataList(option = {}) {
            if (this.pageNum === 1) {
                this.dataList = [];
            }
            this.params = {
                ...this.params,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                ...option,
            };
            this.$api
                .agentRank(this.params)
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
                    const allAgentRank = res.obj.allAgentRank;
                    const [
                        storeChargeCurrentValue,
                        storeChargeRatio,
                    ] = this.computeRatio(
                        allAgentRank.storeCharge,
                        allAgentRank.storeLastCharge
                    );
                    const [
                        equipmentCurrentValue,
                        equipmentRatio,
                    ] = this.computeRatio(
                        allAgentRank.equipmentSum,
                        allAgentRank.equipmentLastSum
                    );
                    const [storeCurrentValue, storeRatio] = this.computeRatio(
                        allAgentRank.storeSum,
                        allAgentRank.storeLastSum
                    );
                    const [
                        constructionCurrentValue,
                        constructionRatio,
                    ] = this.computeRatio(
                        allAgentRank.constructionTimes,
                        allAgentRank.constructionLastTimes
                    );
                    this.totalList = [
                        {
                            title: "收益",
                            unit: "元",
                            value: allAgentRank.storeTotalCharge,
                            currentValue: storeChargeCurrentValue,
                            ratio: storeChargeRatio, //环比率
                        },
                        {
                            title: "设备",
                            unit: "台",
                            value: allAgentRank.equipmentTotalSum,
                            currentValue: equipmentCurrentValue,
                            ratio: equipmentRatio,
                        },
                        {
                            title: "门店",
                            unit: "家",
                            value: allAgentRank.storeTotalSum,
                            currentValue: storeCurrentValue,
                            ratio: storeRatio,
                        },
                        {
                            title: "施工",
                            unit: "次",
                            value: allAgentRank.constructionTotalTimes + res.obj.inventoryTotalTimes,
                            currentValue: constructionCurrentValue,
                            ratio: constructionRatio,
                        },
                    ];

                    let list = res.obj.pageList;
                    //是代理商且非厂商 不要自己当条
                    if(!!option.agentOrgPk && option.agentOrgPk === '01'){                    
                        //最前面拼上自己
                        if (this.pageNum === 1 && res.obj.agent) {
                            list.unshift({
                                ...res.obj.agent,
                                me: true,
                            });
                        }
                    }
                    list = list.map((item) => {
                        const [
                            equipmentCurrentValue,
                            equipmentRatio,
                        ] = this.computeRatio(
                            item.equipmentSum,
                            item.equipmentLastSum
                        );
                        item.equipmentRatio = equipmentRatio;
                        item.equipmentLastSum =
                            (equipmentCurrentValue >= 0 ? "+" : "") +
                            equipmentCurrentValue;

                        const [
                            storeChargeCurrentValue,
                            storeChargeRatio,
                        ] = this.computeRatio(item.storeCharge, item.storeLastCharge);
                        item.storeChargeRatio = storeChargeRatio;
                        item.storeLastCharge =
                            (storeChargeCurrentValue >= 0 ? "+" : "") +
                            storeChargeCurrentValue;

                        const [
                            storeCurrentValue,
                            storeRatio,
                        ] = this.computeRatio(item.storeSum, item.storeLastSum);
                        item.storeRatio = storeRatio;
                        item.storeLastSum =
                            (storeCurrentValue >= 0 ? "+" : "") +
                            storeCurrentValue;

                        const [
                            constructionCurrentValue,
                            constructionRatio,
                        ] = this.computeRatio(
                            item.constructionTimes,
                            item.constructionLastTimes
                        );
                        item.constructionRatio = constructionRatio;
                        item.constructionLastTimes =
                            (constructionCurrentValue >= 0 ? "+" : "") +
                            constructionCurrentValue;
                        return item;
                    });
                    this.dataList = this.dataList.concat(list);
                })
                .catch((err) => {
                    this.isHasMore = false;
                });
        },

        //计算环比 val1=当期数，val2=上期数
        computeRatio(val1, val2) {
            const currentValue = val1;
            const ratio = val2 === 0 ? "- " : mul(div(Math.round(mul(div(sub(val1, val2), val2 || 1), 100)), 100),100);
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
                    rank: item.rank,
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
    },
};
</script>
<style lang="scss" scoped>
.data-box {
    position: relative;
    border: solid 1px #0a4373;
    &.bg-blue {
        background: #032038;
    }
    .data-border-line {
        position: absolute;
        z-index: 1;
        width: 8px;
        height: 8px;
        border-color: #42e6ff;
        border-style: solid;
        border-width: 0px;
        background: rgba(0, 0, 0, 0);
        &.border-lt {
            top: -1px;
            left: -1px;
            border-top-width: 1px;
            border-left-width: 1px;
        }
        &.border-rt {
            top: -1px;
            right: -1px;
            border-top-width: 1px;
            border-right-width: 1px;
        }
        &.border-rb {
            bottom: -1px;
            right: -1px;
            border-bottom-width: 1px;
            border-right-width: 1px;
        }
        &.border-lb {
            bottom: -1px;
            left: -1px;
            border-bottom-width: 1px;
            border-left-width: 1px;
        }
    }
}
.data-list {
    .bg-myself {
        position: relative;
        background: #003f74;
    }
    .icon-myself {
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
            white-space: nowrap;
        }
    }
}
</style>
