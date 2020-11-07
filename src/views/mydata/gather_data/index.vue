<!--汇总数据-->
<template>
    <div>
        <cy-row wrap="wrap" class="pdlr-5 blue fs-12">
            <cy-col
                :span="12"
                v-for="(item,index) in dataList"
                :key="index"
                v-show="item.show"
                @click.native="scrollTo(index)"
            >
                <div class="data-box bg-blue mglr-5 mgb-10 pd-10 cy-zoom-in">
                    <div class="flex between">
                        <span>环比{{(item.currentValue>=0?'+':'-')+item.currentValue}}</span>
                        <span
                            v-if="item.showRatio"
                            class="flex vcenter"
                            :class="item.ratio<0?'red':'blue'"
                        >
                            <cy-icon
                                v-if="item.ratio>0"
                                class="cy-up mgr-3"
                                type="wangshang"
                                color="#52A0FF"
                                :size="12"
                            ></cy-icon>
                            <cy-icon v-if="item.ratio<0" type="wangxia" color="#FF5F5F" :size="12"></cy-icon>
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
        <!-- <cy-cell
                    v-if="item.show"
                    @click.native="scrollTo(index)"
                    class="pdtb-15"
                    :title="`<div class='fs-16'>${item.title}<span class='fs-12 grey'> (${item.unit}) </span></div>`"
                >
                    <span slot="desc" class="fs-20 blue">{{item.value}}</span>
        </cy-cell>-->

        <!-- <cy-sticky @scrollChange="onScrollChange">
            <div ref="stickyTitle" :class="['sticky-title',{'hidden':titleNone}]">汇总数据</div>
        </cy-sticky>-->

        <div class="pdlr-10 pdb-10" id="allData">
            <div v-for="(item,index) in dataList" :key="index">
                <div
                    v-if="item.show"
                    :ref="'allData'+index"
                    class="data-box pd-10 mgb-10 cy-slide-right-in"
                >
                    <div class="title blue bold tc fs-15">
                        {{item.chart.title}}({{item.unit}})
                        <span class="year">{{year}}</span>
                    </div>
                    <component
                        :is="item.chart.component"
                        :option="item.chart.option"
                        :height="item.chart.height"
                        :tooltipClick="item.chart.option.tooltip && item.chart.option.tooltip[item.chart.option.tooltip.clickName]"
                    ></component>
                    <div
                        v-if="item.type!=='agent' && item.chart.option.dataZoom[0].show"
                        class="mgt-5 fs-12 tc grey"
                    >可左右滑动查看数据</div>
                    <div class="data-border-line border-lt"></div>
                    <div class="data-border-line border-rt"></div>
                    <div class="data-border-line border-lb"></div>
                    <div class="data-border-line border-rb"></div>
                </div>
            </div>
        </div>

        <!-- 闲置设备 -->
        <idle-equipment v-if="showIdleEquipmentDtail" :option="IdleEquipmentDtailOption"></idle-equipment>

        <div ref="dataBox"></div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { dateDiffDate, dateDiffDays } from "@/utils/formatDate";
import { sub, mul, div } from "@/utils/number";
import numberPlus from "@/components/_custom/mydata/number_plus"; //数字加
import cySticky from "@/components/sticky";
import cyEchartsLine from "@/components/echarts/line"; //线性
import cyEchartsBar from "@/components/echarts/bar"; //横向柱状
import idleEquipment from "./idle_equipment"; //闲置设备
import scrollToView from "@/utils/scrollToView";
import deepMerge from "@/utils/deepMerge";

export default {
    name: "gather_data",
    components: {
        cySticky,
        numberPlus,
        cyEchartsLine,
        cyEchartsBar,
        idleEquipment,
    },
    props: {
        option: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    data() {
        return {
            year: "", //搜索年份
            params: {
                type: "", //时间类型：0=小时 1=天 2=月 3=年
                startTime: "",
                endTime: "",
            },
            titleNone: true,
            showIdleEquipmentDtail: false,
            IdleEquipmentDtailOption: {},
            defaultDataList: [
                //设备数
                {
                    type: "equipment",
                    show: true,
                    title: "设备数",
                    unit: "台",
                    value: "0",
                    currentValue: "0",
                    ratio: "0",
                    showRatio: true,
                    power: ["0", "1"], //权限  0-厂商 1-代理商 2-门店 3-普通车主 4-普通车主关注的门店
                    chart: {
                        title: "新增设备数",
                        component: "cy-echarts-line",
                        height: "300px",
                        option: {
                            tooltip: {
                                trigger: "axis",
                                formatter: "{b0}<br/> {a0}: {c0}台",
                            },
                            legend: {
                                data: ["设备"],
                            },
                            dataZoom: [{ show: false }],
                            xAxis: {
                                data: [],
                            },
                            yAxis: {
                                max: (value) => {
                                    if (value.max < 5) return 5;
                                    return value.max;
                                },
                                //minInterval: 1 //y轴不显示小数
                            },
                            series: [
                                {
                                    name: "设备",
                                    type: "bar",
                                    data: [],
                                },
                            ],
                        },
                    },
                },
                //代理商数
                {
                    type: "agent",
                    show: true,
                    title: "代理商数",
                    unit: "家",
                    value: "0",
                    currentValue: "0",
                    ratio: "0",
                    showRatio: true,
                    power: ["0"],
                    chart: {
                        title: "新增代理商数",
                        component: "cy-echarts-bar",
                        height: "360px",
                        option: {
                            tooltip: {
                                trigger: "axis",
                                formatter: "{b0}<br/> {a0}: {c0}家",
                            },
                            legend: {
                                data: ["代理商"],
                            },
                            xAxis: {
                                name: "xAxis",
                                max: (value) => {
                                    if (value.max < 5) return 5;
                                    return value.max;
                                },
                            },
                            yAxis: {
                                data: [],
                            },
                            series: [
                                {
                                    name: "代理商",
                                    type: "bar",
                                    data: [],
                                },
                            ],
                        },
                    },
                },
                //门店数
                {
                    type: "store",
                    show: true,
                    title: "门店数",
                    unit: "家",
                    value: "0",
                    currentValue: "0",
                    ratio: "0",
                    showRatio: true,
                    power: ["0", "1"],
                    chart: {
                        title: "新增门店数",
                        component: "cy-echarts-line",
                        height: "300px",
                        option: {
                            tooltip: {
                                trigger: "axis",
                                formatter: "{b0}<br/> {a0}: {c0}家",
                            },
                            legend: {
                                data: ["门店"],
                            },
                            dataZoom: [{ show: false, start: 10 }],
                            xAxis: {
                                data: [],
                            },
                            yAxis: {
                                max: (value) => {
                                    if (value.max < 5) return 5;
                                    return value.max;
                                },
                            },
                            series: [
                                {
                                    name: "门店",
                                    type: "line",
                                    data: [],
                                },
                            ],
                        },
                    },
                },
                //施工次数
                {
                    type: "construction",
                    show: true,
                    title: "施工次数",
                    //subTitle: "",
                    unit: "次",
                    value: "0",
                    currentValue: "0",
                    ratio: "0",
                    showRatio: true,
                    power: ["0", "1", "2"],
                    chart: {
                        title: "新增施工次数",
                        component: "cy-echarts-line",
                        height: "300px",
                        option: {
                            tooltip: {
                                trigger: "axis",
                                formatter: "{b0}<br/> {a0}: {c0}次",
                            },
                            legend: {
                                data: ["施工"],
                            },
                            dataZoom: [{ show: false }],
                            xAxis: {
                                data: [],
                            },
                            yAxis: {
                                max: (value) => {
                                    if (value.max < 5) return 5;
                                    return value.max;
                                },
                            },
                            series: [
                                {
                                    name: "施工",
                                    type: "bar",
                                    data: [],
                                },
                            ],
                        },
                    },
                },
                //收益统计
                {
                    type: "profit",
                    show: true,
                    title: "收益统计",
                    //subTitle: "收益统计=施工次数*单品毛利+预售次数*单品毛利",
                    unit: "元",
                    value: "0",
                    currentValue: "0",
                    ratio: "0",
                    showRatio: true,
                    power: ["0", "2"],
                    chart: {
                        title: "新增收益统计",
                        component: "cy-echarts-line",
                        height: "300px",
                        option: {
                            tooltip: {
                                trigger: "axis",
                                formatter: "{b0}<br/> {a0}: {c0}元",
                            },
                            legend: {
                                data: ["收益"],
                            },
                            dataZoom: [{ show: false }],
                            xAxis: {
                                data: [],
                            },
                            series: [
                                {
                                    name: "收益",
                                    type: "bar",
                                    data: [],
                                },
                            ],
                        },
                    },
                },
                //闲置数
                {
                    type: "idleEquipment",
                    show: true,
                    title: "闲置数",
                    //subTitle: "当天未施工设备为闲置设备",
                    unit: "台",
                    value: "0",
                    currentValue: "0",
                    ratio: "0",
                    showRatio: false,
                    power: ["0", "1"],
                    chart: {
                        title: "当前闲置台数",
                        component: "cy-echarts-line",
                        height: "300px",
                        option: {
                            tooltip: {
                                formatter: function (params) {
                                    return `<div 
                                    ${
                                        !params[0].data
                                            ? ""
                                            : `onClick="tooltipClick('${params[0].name}','${params[0].data}')"`
                                    }>
                                    ${params[0].name}<br/> 
                                    ${params[0].seriesName}: ${params[0].data}台
                                    ${
                                        !params[0].data
                                            ? ""
                                            : '<div style="margin-top: 3px;padding-top: 3px;border-top: solid 1px rgba(0,0,0,.1);text-align: center;">详情 ><div/></div>'
                                    }`;
                                },
                                clickName: "tooltipClick", //点击事件名称
                                //点击事件
                                tooltipClick: (time, value) => {
                                    this.showIdleEquipment(time, value);
                                },
                            },
                            legend: {
                                data: ["闲置"],
                            },
                            dataZoom: [{ show: false }],
                            xAxis: {
                                data: [],
                            },
                            yAxis: {
                                max: (value) => {
                                    if (value.max < 5) return 5;
                                    return value.max;
                                },
                            },
                            series: [
                                {
                                    name: "闲置",
                                    type: "line",
                                    data: [],
                                },
                            ],
                        },
                    },
                },
            ],
            dataList: [],
            tmpTime: {},
        };
    },

    created() {},
    watch: {
        option: {
            handler(nVal, oVal) {
                this.pageNum = 1;
                this.showIdleEquipmentDtail = false;
                this.tmpTime = nVal;
                this.year = nVal.year;
                this.hzData(nVal);
            },
            immediate: true,
            deep: true,
        },
    },
    computed: {
        ...mapState(["defaultRole"]),
    },
    mounted() {},
    methods: {
        // //条件搜索
        // onChangeSearch(option) {
        //     this.pageNum = 1;
        //     this.showIdleEquipmentDtail = false;
        //     //计算日期相差天数
        //     const days = dateDiffDays(option.startTime, option.endTime)
        //     //计算days天前的日期
        //     option.startLastTime = dateDiffDate(option.startTime, -days)
        //     option.endLastTime = dateDiffDate(option.startTime, -1)
        //     this.hzData(option);
        // },

        //外部主动更新数据
        updateData(option) {
            //时间不一致时更新
            if (
                option.startTime != this.tmpTime.startTime ||
                option.endTime != this.tmpTime.endTime
            ) {
                this.$toast("时间变化，正在更新数据");
                this.tmpTime = option;
                this.hzData(option);
                return true;
            }
            return false;
        },

        hzData(option = {}) {
            this.$toast.loading("加载中…");
            this.params = {
                ...this.params,
                ...option,
            };
            this.$api
                .hzData(this.params)
                .then((res) => {
                    //不同角色对应不同权限
                    this.dataList = this.defaultDataList.filter((item) => {
                        return item.power.includes(this.defaultRole.type);
                    });

                    //x轴
                    let xAxis = [];
                    const nowHours = new Date().getHours() + 1;
                    //设备数
                    let equipmentIndex = 0;
                    const equipmentSum = res.obj.equipmentList.map(
                        (item, index) => {
                            if (option.timeType === 0) {
                                //timeType=0今天 只显示当前小时前的
                                if (item.statisticTime <= nowHours) {
                                    //option.type === 0 只查一天
                                    xAxis.push(
                                        item.statisticTime +
                                            (option.type === 0 ? ":00" : "")
                                    );
                                }
                            } else {
                                let statistic = item.statisticTime.split("-");
                                let statisticTime =
                                    statistic.length === 3
                                        ? statistic[1] + "-" + statistic[2]
                                        : statistic[0];
                                xAxis.push(
                                    statisticTime +
                                        (option.type === 0 ? ":00" : "")
                                );
                            }
                            //第几个开始数据大于0
                            if (item.equipmentSum > 0 && equipmentIndex === 0) {
                                equipmentIndex = index;
                            }
                            return item.equipmentSum;
                        }
                    );

                    // x/y轴移动
                    const equipmentDataZoom = this.xAxisDataZoom(
                        xAxis.length,
                        equipmentIndex
                    );
                    const [
                        equipmentCurrentValue,
                        equipmentRatio,
                    ] = this.computeRatio(
                        res.obj.equipmentSum,
                        res.obj.equipmentLastSum
                    );
                    const equipmentOption = {
                        value: res.obj.equipmentTotalSum,
                        currentValue: equipmentCurrentValue,
                        ratio: equipmentRatio, //环比率
                        chart: {
                            component: "cy-echarts-line",
                            height: "300px",
                            option: {
                                xAxis: {
                                    data: xAxis,
                                },
                                dataZoom: equipmentDataZoom,
                                series: [
                                    {
                                        data: equipmentSum,
                                    },
                                ],
                            },
                        },
                    };

                    //代理商数
                    let agentSumIndex = 0
                    const agentSum = res.obj.agentList.map((item,index) => {
                        //第几个开始数据大于0
                            if (item.storeSum > 0 && agentSumIndex === 0) {
                                agentSumIndex = index;
                            }
                        return item.storeSum;
                    });
                    const agentSumZoom = this.xAxisDataZoom(
                        xAxis.length,
                        agentSumIndex
                    );
                    const [agentCurrentValue, agentRatio] = this.computeRatio(
                        res.obj.agentSum,
                        res.obj.agentLastSum
                    );
                    const agentOption = {
                        value: res.obj.agentTotalSum,
                        currentValue: agentCurrentValue, //环比
                        ratio: agentRatio, //环比率
                        chart: {
                            component: "cy-echarts-bar",
                            height: "360px",
                            option: {
                                yAxis: {
                                    data: xAxis,
                                    // axisLine: {
                                    //     show: false
                                    // },
                                    // axisTick: {
                                    //     show: false
                                    // }
                                },
                                dataZoom: agentSumZoom,
                                series: [
                                    {
                                        data: agentSum,
                                    },
                                ],
                            },
                        },
                    };

                    //门店数
                    let storeSumIndex = 0;
                    const storeSum = res.obj.storeList.map((item, index) => {
                        //第几个开始数据大于0
                        if (item.storeSum > 0 && storeSumIndex === 0) {
                            storeSumIndex = index;
                        }
                        return item.storeSum;
                    });
                    console.log("storeSumIndex", storeSumIndex);
                    const storeDataZoom = this.xAxisDataZoom(
                        xAxis.length,
                        storeSumIndex
                    );
                    console.log("storeSumIndex", storeDataZoom);
                    const [storeCurrentValue, storeRatio] = this.computeRatio(
                        res.obj.storeSum,
                        res.obj.storeLastSum
                    );
                    const storeOption = {
                        value: res.obj.storeTotalSum,
                        currentValue: storeCurrentValue, //环比
                        ratio: storeRatio, //环比率
                        chart: {
                            component: "cy-echarts-line",
                            height: "300px",
                            option: {
                                xAxis: {
                                    data: xAxis,
                                },
                                dataZoom: storeDataZoom,
                                series: [
                                    {
                                        data: storeSum,
                                    },
                                ],
                            },
                        },
                    };

                    //施工次数
                    let constructionIndex = 0;
                    const constructionTimes = res.obj.constructionTimesList.map(
                        (item, index) => {
                            //第几个开始数据大于0
                            if (
                                item.constructionTimes > 0 &&
                                constructionIndex === 0
                            ) {
                                constructionIndex = index;
                            }
                            return item.constructionTimes;
                        }
                    );
                    const constructionZoom = this.xAxisDataZoom(
                        xAxis.length,
                        constructionIndex
                    );
                    const [
                        constructionCurrentValue,
                        constructionRatio,
                    ] = this.computeRatio(
                        res.obj.constructionTimes,
                        res.obj.constructionLastTimes
                    );
                    const constructionOption = {
                        value:
                            res.obj.constructionTotalTimes +
                            res.obj.inventoryTotalTimes,
                        currentValue: constructionCurrentValue, //环比
                        ratio: constructionRatio, //环比率
                        chart: {
                            component: "cy-echarts-line",
                            height: "300px",
                            option: {
                                xAxis: {
                                    data: xAxis,
                                },
                                dataZoom: constructionZoom,
                                series: [
                                    {
                                        data: constructionTimes,
                                    },
                                ],
                            },
                        },
                    };
                    //收益统计
                    let storeChargeIndex = 0;
                    const storeCharge = res.obj.storeChargeList.map(
                        (item, index) => {
                            //第几个开始数据大于0
                            if (
                                item.storeCharge > 0 &&
                                storeChargeIndex === 0
                            ) {
                                storeChargeIndex = index;
                            }
                            return item.storeCharge;
                        }
                    );
                    const storeChargeZoom = this.xAxisDataZoom(
                        xAxis.length,
                        storeChargeIndex
                    );
                    const [
                        storeChargeCurrentValue,
                        storeChargeRatio,
                    ] = this.computeRatio(
                        res.obj.storeCharge,
                        res.obj.storeLastCharge
                    );
                    const profitOption = {
                        value: res.obj.storeTotalCharge,
                        currentValue: storeChargeCurrentValue, //环比
                        ratio: storeChargeRatio, //环比率
                        chart: {
                            component: "cy-echarts-line",
                            height: "300px",
                            option: {
                                xAxis: {
                                    data: xAxis,
                                },
                                dataZoom: storeChargeZoom,
                                series: [
                                    {
                                        data: storeCharge,
                                    },
                                ],
                            },
                        },
                    };
                    //闲置设备数
                    let idleEquipmentSumIndex = 0;
                    const idleEquipmentSum = res.obj.idleEquipmentList.map(
                        (item, index) => {
                            //第几个开始数据大于0
                            if (
                                item.idleEquipmentSum > 0 &&
                                idleEquipmentSumIndex === 0
                            ) {
                                idleEquipmentSumIndex = index;
                            }
                            return item.idleEquipmentSum;
                        }
                    );
                    const idleEquipmentSumZoom = this.xAxisDataZoom(
                        xAxis.length,
                        idleEquipmentSumIndex
                    );
                    const [
                        idleEquipmentCurrentValue,
                        idleEquipmentRatio,
                    ] = this.computeRatio(
                        res.obj.idleEquipmentNum,
                        res.obj.idleEquipmentLastNum
                    );
                    const idleEquipmentOption = {
                        value: res.obj.idleEquipmentNumToday,
                        currentValue: idleEquipmentCurrentValue, //环比
                        ratio: idleEquipmentRatio, //环比率
                        chart: {
                            component: "cy-echarts-line",
                            height: "300px",
                            option: {
                                xAxis: {
                                    data: xAxis,
                                },
                                dataZoom: idleEquipmentSumZoom,
                                series: [
                                    {
                                        data: idleEquipmentSum,
                                    },
                                ],
                            },
                        },
                    };
                    let list = [];
                    this.dataList.forEach((item) => {
                        if (item.type === "equipment") {
                            list.push(deepMerge(item, equipmentOption));
                        }
                        if (item.type === "agent") {
                            list.push(deepMerge(item, agentOption));
                        }
                        if (item.type === "store") {
                            list.push(deepMerge(item, storeOption));
                        }
                        if (item.type === "construction") {
                            list.push(deepMerge(item, constructionOption));
                        }
                        if (item.type === "profit") {
                            list.push(deepMerge(item, profitOption));
                        }
                        if (item.type === "idleEquipment") {
                            list.push(deepMerge(item, idleEquipmentOption));
                        }
                    });
                    console.log("list", list);
                    this.dataList = [...list];
                    this.$toast.clear();

                    //设置滑动offsetTop
                    this.$nextTick(() => {
                        //this.TitleOffsetTop = this.$refs.stickyTitle.offsetTop;
                        this.dataBoxOffsetTop =
                            this.$refs.dataBox.offsetTop - 250;

                        this.allDataOffsetTop = [];
                        const length = this.dataList.length;
                        for (let i = 0; i < length; i++) {
                            if (this.dataList[i].show === true) {
                                const offsetTop =
                                    this.$refs["allData" + i][0].offsetTop -
                                    100;
                                this.allDataOffsetTop.push(offsetTop);
                            }
                        }
                    });
                })
                .catch((err) => {});
        },

        //计算环比 val1=当期数，val2=上期数
        computeRatio(val1, val2) {
            const currentValue = val1;
            const ratio =
                val2 === 0
                    ? "- "
                    : mul(
                          div(
                              Math.round(
                                  mul(div(sub(val1, val2), val2 || 1), 100)
                              ),
                              100
                          ),
                          100
                      );
            return [currentValue, ratio];
        },

        //X轴是否可左右移动
        xAxisDataZoom(length, startValue) {
            let dataZoom = [{ show: false, start: 0, end: 100 }];
            if (length > 8) {
                let start = Math.ceil((startValue / length) * 100);
                start = start - 5 > 0 ? start - 5 : 0;
                const step = (60 / length) * 10;
                let end = start + step > 100 ? 100 : Math.ceil(start + step);
                dataZoom = [{ show: true, start: start, end: end }];
            }
            return dataZoom;
        },

        //显示闲置设备详情
        showIdleEquipment(time, value) {
            this.showIdleEquipmentDtail = true;
            const type = this.params.type;
            let idleTime = "";
            //=0x轴小时 =1天数
            if (type == 0) {
                idleTime = `${this.params.startTime} ${time}:00`;
            } else {
                idleTime = `${time} 00:00:00`;
            }
            this.IdleEquipmentDtailOption = {
                idleTime: idleTime,
                type: type,
                agentOrgPk: this.$store.state.defaultRole.defaultOrgPk,
            };
            this.scrollTo(this.dataList.length - 1);
        },

        //滑动显示头部提示
        onScrollChange(top) {
            if (top > this.TitleOffsetTop && top < this.dataBoxOffsetTop) {
                this.titleNone = false;
            } else {
                this.titleNone = true;
            }
        },

        //滚动到
        scrollTo(v) {
            scrollToView(this.allDataOffsetTop[v]);
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
    .title {
        height: 32px;
        position: relative;
        color: #33b8cc;
        text-shadow: 0px 0px 10px #006890;
        border-bottom: solid 1px #0a4373;
        &::after,
        &::before {
            position: absolute;
            content: "";
            bottom: -2px;
            width: 3px;
            height: 3px;
            background: #066ec3;
        }
        &::after {
            left: 0;
        }
        &::before {
            right: 0;
        }
        .year {
            position: absolute;
            right: 5px;
            top: 50%;
            transform: translateY(-50%);
            color: #ffffff;
            font-size: 12px;
            font-weight: 400;
        }
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
.sticky-title {
    padding: 2px 5px;
    background: rgba(0, 0, 0, 0.6);
    color: #ffffff;
    &.hidden {
        visibility: hidden;
    }
}
.tooltipLink {
    display: block;
    width: 90px;
    color: #ffffff;
    font-size: 14px;
    text-align: left;
    .detail {
        text-align: center;
        display: block;
        margin-top: 3px;
        padding-top: 3px;
        border-top: solid 1px rgba(0, 0, 0, 0.1);
    }
}
</style>
