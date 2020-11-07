<!--数据头部-->
<template>
    <div>
        <div class="head flex between pd-10 white">
            <div>
                <div :class="defaultRole.type === '0'?'cy-slide-left-in':'cy-slide-left-out'">
                    <span
                        v-show="defaultRole.type === '0'"
                        class="flex center change-btn"
                        @click="showAgent = true"
                    >
                        <span v-if="agentOrgPk === ''||agentOrgPk === '01'">选择服务商</span>
                        <span v-else>{{agentName}}</span>
                        <!-- <cy-icon class="mgl-5" type="youjiantou" size="10"></cy-icon> -->
                    </span>
                </div>
            </div>
            <div class="cy-slide-right-in">
                <span class="flex vcenter change-btn" @click="showTimeInterval = true">
                    <cy-icon class="mgr-5" type="calendar" size="20"></cy-icon>
                    <div class="flex center mw50">
                        <span v-if="nameTime==='自定义'" class="fs-10 lh12">
                            {{sTime}}
                            <br />
                            {{eTime}}
                        </span>
                        <span v-else>{{nameTime}}</span>
                    </div>
                </span>
            </div>
        </div>

        <!-- 选择服务商 -->
        <cy-popup v-model="showAgent" :closeIcon="false" height="9.8rem">
            <div class="pd-15">选择服务商</div>
            <div class="search">
                <cy-search v-model="agentKeyword" @search="onSearch" placeholder="输入服务商名称"></cy-search>
            </div>
            <div class>
                <cy-pullup-loading
                    :isPullLoadMore="false"
                    :useWindow="false"
                    @loadmore="onLoadmore"
                    :hasMore="isHasMore"
                    :isLoading="isLoading"
                    :noMore="false"
                    :dataList="dataAgentList"
                >
                    <cy-cell
                        v-for="(item,index) in dataAgentList"
                        :key="index"
                        @click.native="onChangeAgent(item)"
                        :class="{'active':item.pk === agentOrgPk}"
                        :title="item.name"
                        link="javascript:;"
                    ></cy-cell>
                </cy-pullup-loading>
            </div>
        </cy-popup>

        <!-- 选择日期时段 -->
        <date-interval :type="dateType" :show.sync="showTimeInterval" @onChange="onChangeTime"></date-interval>

        <!-- 结束时间 -->
        <cy-popup-datetime
            clear-text="结束时间"
            v-model="eTime"
            :start-date="sTime"
            :end-date="endEndDate"
            :show.sync="showEndTime"
            format="YYYY-MM-DD"
            year-row="{value}年"
            month-row="{value}月"
            day-row="{value}日"
            @onConfirm="onConfirmEndTime"
        ></cy-popup-datetime>

        <!-- 开始时间 -->
        <cy-popup-datetime
            clear-text="开始时间"
            v-model="sTime"
            :end-date="today"
            :show.sync="showStartTime"
            format="YYYY-MM-DD"
            year-row="{value}年"
            month-row="{value}月"
            day-row="{value}日"
            @onConfirm="onConfirmStartTime"
        ></cy-popup-datetime>

        <!-- 选择全国省份
        <cy-popup-picker
            ref="popupPicker"
            v-model="areaVal"
            :columns="2"
            :show.sync="showArea"
            cancelText="取消"
            confirmText="确认"
            title="标题"
            @onChange="onChangeArea"
            :data="areaList"
        ></cy-popup-picker>-->
    </div>
</template>

<script>
import { mapState } from "vuex";
import cyPopupPicker from "@/components/popup_picker";
import dateInterval from "@/components/_custom/mydata/date_interval";
import formatDate from "@/utils/formatDate";
import { MixinPage } from "@/utils/mixins/index";
import cyPullupLoading from "@/components/pullup_loading"; //加载更多
import cySearch from "@/components/search";
import { getDateInterval } from "@/utils/formatDate";

export default {
    name: "mydata_header",
    mixins: [MixinPage],
    components: {
        cyPopupPicker,
        dateInterval,
        cyPullupLoading,
        cySearch,
    },
    props: {
        // //左侧范围按钮显示
        // areaShow: {
        //     type: Boolean,
        //     default: true,
        // },
        // //联动省市
        // areaValue: {
        //     type: Array,
        //     default: function () {
        //         return ["China", "China"];
        //     },
        // },
        option: {
            type: Object,
            default: function () {
                return {};
            },
        },
        //时间段类型
        dateType: {
            type: Number,
            default: 3, //默认7天
        },
    },
    data() {
        return {
            showAgent: false,
            agentOrgPk: "",
            agentName: "",
            dataAgentList: [],

            showStartTime: false,
            showEndTime: false,
            nameTime: "",
            showTimeInterval: false,
            sTime: "",
            eTime: "",
            endEndDate: "",
            today: formatDate(new Date(), "YYYY-MM-DD"),

            agentKeyword: "", //服务商搜索
        };
    },
    created() {
        this.init();
        this.getDataList();
    },
    watch: {
        option: {
            handler(nVal, oVal) {
                this.agentOrgPk = nVal.agentOrgPk;
                this.agentName = nVal.agentName;
            },
            //immediate: true,
            deep: true,
        },

        // areaShow: {
        //     handler(nVal, oVal) {
        //         if (nVal === true) {
        //             this.getAddressList();
        //         }
        //     },
        //     immediate: true
        // },
        // areaValue(nVal, oVal) {
        //     this.areaVal = nVal;
        // }
    },
    computed: {
        ...mapState({
            defaultRole: (state) => state.defaultRole,
        }),
    },
    methods: {
        init() {
            const type = 3; //=3是默认7天
            const { endDate, startDate } = getDateInterval(3);
            //=99 自定义
            this.nameTime = "7天";
            setTimeout(() => {
                this.sTime = startDate;
                this.eTime = endDate;
            }, 0);

            const option = {
                timeType: type, //时间区间类型
                type: "1", //X轴 显示方式0=小时 1=天 2=月 3=年
                startTime: startDate,
                endTime: endDate,
            };
            this.$emit("onChange", option);
        },

        //获取服务商
        getDataList() {
            const params = {
                name: this.agentKeyword,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
            };
            this.$api
                .getAgentList(params)
                .then((res) => {
                    this.total = res.total;
                    this.isLoading = false;
                    if (
                        res.obj.length < this.pageSize ||
                        this.pageNum === this.total
                    ) {
                        this.isHasMore = false;
                    } else {
                        this.isHasMore = true;
                    }
                    let list = res.obj.map((item) => {
                        item.roleType = "1";
                        return item;
                    });
                    if (this.pageNum === 1) {
                        list.unshift({
                            name: "全部",
                            pk: "01",
                            roleType: "",
                        });
                    }
                    this.dataAgentList = this.dataAgentList.concat(list);
                })
                .catch((err) => {
                    this.isHasMore = false;
                });
        },

        //选择服务商/代理商
        onChangeAgent(option) {
            this.showAgent = false;
            if (option.rolePk === this.agentOrgPk) {
                return;
            }
            this.agentOrgPk = option.pk;
            this.agentName = option.name;
            //设置默认角色
            this.$store.commit("setDefaultRole", this.$store.state.defaultRole);

            this.$emit("onChange", {
                agentOrgPk: option.pk,
                province: option.province,
                provincePinYin: option.provincePinYin,
            });
        },

        //搜索
        onSearch() {
            this.pageNum = 1;
            this.isLoading = true;
            this.dataAgentList = [];
            this.getDataList();
        },

        //选择日期类型
        onChangeTime(item) {
            if (item) {
                this.showTimeInterval = false;
                //区间类型type= 0:今日 1昨日 2:3天 3:7天 4:15天 5本月 6上月 7近三月 8近半年 9近一年 10本年 99自定义
                if (item.type !== 99) {
                    //=99 自定义
                    this.nameTime = item.name;
                    setTimeout(() => {
                        this.sTime = item.startDate;
                        this.eTime = item.endDate;
                    }, 0);
                    const days = this.compareTime(item.startDate, item.endDate);
                    const type = this.xAxisType(days);
                    const option = {
                        timeType: item.type, //时间区间类型
                        type: type, //X轴 显示方式0=小时 1=天 2=月 3=年
                        startTime: item.startDate,
                        endTime: item.endDate,
                    };
                    this.$emit("onChange", option);
                    //this.$emit("onChangeTime", option);
                } else {
                    this.showStartTime = true;
                }
            }
        },

        //确认开始时间
        onConfirmStartTime(v) {
            this.endEndDate = this.compareDateTime(this.sTime, 2);
            setTimeout(() => {
                this.showEndTime = true;
            }, 300);
        },

        //确认结束时间
        onConfirmEndTime() {
            const days = this.compareTime(this.sTime, this.eTime);

            // if (days < 0) {
            //     this.$toast("结束日期不能小于开始日期");
            //     return;
            // }
            //const months = this.compareMonth(this.sTime, this.eTime, 2);
            // if (!months) {
            //     this.$toast("请选择2个月内日期范围");
            //     return;
            // }
            this.nameTime = "自定义";
            const type = this.xAxisType(days);
            const option = {
                timeType: 99, //自定义
                type: type, //时间类型：0=小时 1=天 2=月 3=年
                startTime: this.sTime,
                endTime: this.eTime,
            };
            this.$emit("onChange", option);
            //this.$emit("onChangeTime", option);
        },

        //图表的X轴 以哪种方式显示0=小时 1=天 2=月 3=年
        xAxisType(days) {
            if (days === 0) {
                return 0;
            } else if (days > 0) {
                return 1;
            }
            return 1;
        },

        //时间相差天数-- 开始时间 结束时间 天数
        compareTime(sTime, eTime) {
            const startTime = Date.parse(sTime);
            const endTime = Date.parse(eTime);
            const compareDate = endTime - startTime;
            const days = Math.floor(compareDate / (24 * 3600 * 1000));
            return days;
        },

        //计算N个自然月后的日期
        compareDateTime(sTime, month = 2) {
            sTime = sTime.split("-");
            const sMonth = parseInt(sTime[0]) * 12 + parseInt(sTime[1]);
            const y = parseInt((+sMonth + 2) / 12);
            const m = (+sMonth + 2) % 12;
            return `${y}-${m < 10 ? "0" + m : m}-${sTime[2]}`;
        },

        // //计算时间相差n个自然月-- 开始时间 结束时间 月数
        // compareMonth(sTime, eTime, month = 2) {
        //     sTime = sTime.split("-");
        //     const sMonth = parseInt(sTime[0]) * 12 + parseInt(sTime[1]);
        //     eTime = eTime.split("-");
        //     const eMonth = parseInt(eTime[0]) * 12 + parseInt(eTime[1]);
        //     // 相差月数
        //     const cMonth = Math.abs(sMonth - eMonth);
        //     const cDays = parseInt(eTime[2]) - parseInt(sTime[2]);
        //     if (cMonth < month || (cMonth === month && cDays <= 0)) {
        //         return true;
        //     }
        //     return false;
        // }

        // //获取地址列表
        // getAddressList() {
        //     this.$api.getAddressList().then(res => {
        //         let list = [];
        //         res.obj.forEach((item, index) => {
        //             const isParent = item.level === 0 || item.level === 1;
        //             const obj = {
        //                 name: item.level === 0 ? "全国" : item.name,
        //                 value: item.pinYin,
        //                 parent: isParent ? "0" : item.pPinYin // 为一级时可以不写 parent，但是此时允许空字符串或者字符串 '0'
        //             };
        //             list.push(obj);
        //             if (isParent) {
        //                 const objAll = {
        //                     name: "全部",
        //                     value: "All",
        //                     parent: item.pinYin
        //                 };
        //                 list.push(objAll);
        //             }
        //         });
        //         this.areaList = list;
        //     });
        // },

        // //选择省市
        // onChangeArea(value, name) {
        //     const arrName = name.split(" ");
        //     arrName[1] = arrName[1] === "全部" ? "" : arrName[1];
        //     this.areaName = arrName[1] || arrName[0];
        //     let option = {
        //         province: arrName[0] === "全国" ? "" : arrName[0],
        //         city: arrName[1]
        //     };
        //     this.$emit("onChange", option);
        // },
    },
};
</script>
<style lang="scss" scoped>
.head {
    background: rgba(2, 27, 48, 0.95);
    // backdrop-filter: blur(20px);
}
.change-btn {
    position: relative;
    min-width: 100px;
    height: 32px;
    padding: 0px 10px;
    border-radius: 20px;
    background: linear-gradient(312deg, #4dd4f7 0%, #1c71fa 100%);
    &::after {
        position: absolute;
        //z-index: -1;
        content: "";
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border-radius: 20px;
        background: linear-gradient(
            -45deg,
            rgba(255, 255, 255, 0) 10%,
            rgba(255, 255, 255, 0.3) 15%,
            rgba(255, 255, 255, 0) 20%
        );
        background-size: 800% 100%;
        animation: shine 20s infinite;
        animation-delay: 1s;
        animation-timing-function: linear;
        @keyframes shine {
            0% {
                background-position-x: 400%;
            }
            50% {
                background-position-x: 0%;
            }
            100% {
                background-position-x: -400%;
            }
        }
    }
    .mw50 {
        min-width: 50px;
    }
}
/deep/.cy-cell.active {
    color: #0861ef;
    /deep/.cy-icon {
        color: #0861ef !important;
    }
}
.search {
    margin: 0 15px;
    border: solid 1px #eee;
    border-radius: 50px;
    overflow: hidden;
}
</style>
