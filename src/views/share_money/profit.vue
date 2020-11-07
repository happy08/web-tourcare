<template>
    <div>
        <!--收益弹窗-->
        <div :class="['profit_btn','mgb-safe-50',{'animation':animation}] ">
            <cy-image
                @click.native="showProfit = true"
                :src="require('@/assets/img/share_money/profit_btn.png')"
            ></cy-image>
        </div>
        <cy-popup
            v-model="showProfit"
            :closeIcon="false"
            :clickOverlayClose="false"
            position="center"
            width="100%"
            height="100%"
            background="transparent"
        >
            <div class="profit-box">
                <div class="profit-inner">
                    <div
                        class="title-name tc fs-16"
                    >您好，{{$store.state.user.name || $store.state.user.nickName}}</div>
                    <div class="total flex between pdt-15 pdb-15">
                        <div>共获得返利</div>
                        <div class="flex vcenter">
                            <cy-image
                                :src="require('@/assets/img/share_money/coin_icon.png')"
                                width="14px"
                                height="14px"
                                class="mgr-5"
                            ></cy-image>
                            <span class="brightred">{{rewardMoneySum}}元</span>
                        </div>
                    </div>
                    <div class="pdlr-5">
                        <cy-row :gutter="15">
                            <cy-col :span="8">
                                <div class="total-item white tc">
                                    <div class="title fs-12">今天获得返利</div>
                                    <div class="flex center pdt-20 fs-20 red">
                                        {{todayRewardMoneySum}}
                                        <span class="mgt-5 fs-12">元</span>
                                    </div>
                                    <div
                                        class="text fs-10"
                                    >比昨日上升{{todayRewardMoneySum-yesterdayRewardMoneySum}}元</div>
                                </div>
                            </cy-col>
                            <cy-col :span="8">
                                <div class="total-item white tc">
                                    <div class="title fs-12">昨天获得返利</div>
                                    <div class="flex center pdt-20 fs-20 red">
                                        {{yesterdayRewardMoneySum}}
                                        <span class="mgt-5 fs-12">元</span>
                                    </div>
                                </div>
                            </cy-col>
                            <cy-col :span="8">
                                <div class="total-item white tc">
                                    <div class="title fs-12">本月获得返利</div>
                                    <div class="flex center pdt-20 fs-20 red">
                                        {{thisMonthRewardMoneySum}}
                                        <span class="mgt-5 fs-12">元</span>
                                    </div>
                                    <div
                                        class="text fs-10"
                                    >比上月上升{{thisMonthRewardMoneySum-lastMonthRewardMoneySum}}元</div>
                                </div>
                            </cy-col>
                        </cy-row>
                    </div>
                </div>
                <div class="flex center pdt-50 mgt-50">
                    <cy-image
                        @click.native="showProfit = false"
                        :src="require('@/assets/img/share_money/know_bg.png')"
                        width="105px"
                        heigth="49px"
                    ></cy-image>
                </div>
            </div>
        </cy-popup>
    </div>
</template>
<script>
export default {
    components: {},
    props: {
        projectPk: String,
        show: {
            type: Boolean,
            default: false
        },
        animation: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            showProfit: false, //自购省钱弹窗
            rewardMoneySum: "",
            todayRewardMoneySum: "",
            yesterdayRewardMoneySum: "",
            thisMonthRewardMoneySum: "",
            lastMonthRewardMoneySum: ""
        };
    },
    watch: {
        projectPk(nVal, oVal) {
            this.getIncome(nVal);
        },
        show(nVal, oVal) {
            this.showProfit = nVal;
        }
    },
    created() {},
    methods: {
        getIncome(pk) {
            const params = {
                projectPk: pk
            };
            this.$api
                .getIncome(params)
                .then(res => {
                    this.lastMonthRewardMoneySum =
                        res.obj.lastMonthRewardMoneySum;
                    this.rewardMoneySum = res.obj.rewardMoneySum;
                    this.thisMonthRewardMoneySum =
                        res.obj.thisMonthRewardMoneySum;
                    this.todayRewardMoneySum = res.obj.todayRewardMoneySum;
                    this.yesterdayRewardMoneySum =
                        res.obj.yesterdayRewardMoneySum;
                })
                .catch(err => {});
        }
    }
};
</script>
<style lang="scss" scoped>
.profit_btn {
    position: fixed;
    width: 60px;
    height: 74px;
    right: 3px;
    bottom: 80px;
    z-index: 90;
    transition: all 0.3s;
    transform-origin: center bottom;
    animation: rotateLR 4s 0s linear infinite;
    &.animation {
        bottom: 130px;
    }
}
.profit-box {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    height: 254px;
    background: url("../../assets/img/share_money/profit_bg.png") no-repeat;
    background-size: cover;
    .profit-inner {
        width: 320px;
        margin: 0 auto;
        padding-top: 35px;
        .title-name {
            color: #83542a;
        }
        .total {
            color: #650000;
        }
        .total-item {
            white-space: nowrap;
            overflow: hidden;
            line-height: 1.4;
            .title {
                padding-top: 3px;
                white-space: nowrap;
                font-size: 10px;
            }
            .text {
                margin-top: 10px;
                color: #bb7742;
                white-space: nowrap;
                font-size: 8px;
            }
        }
    }
}
</style>