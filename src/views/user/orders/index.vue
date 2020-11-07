<!--我的订单-->
<template>
    <div class="orders bg-grey">
        <cy-pulldown-refresh
            :curIndex="curTabIndex"
            :tabList="tabList"
            top="1.2rem"
            @initMescroll="initMescroll"
            @onItemClick="onItemClick"
            @upCallback="getProjectListByGroup"
        >
            <!-- <template #tab>
                <cy-tab
                    v-model="curTabIndex"
                    barWidth="30%"
                    :barActiveColor="['#1C71FA','#4DD4F7']"
                    :barHeight="3"
                    @onIndexChange="onIndexChange"
                >
                    <cy-tab-item v-for="item in tabList" :key="item.name">
                         <div class="pdtb-10">
                            <div>{{item.name}}</div>
                            <div>({{item.count}})</div>
                        </div>
                    </cy-tab-item>
                </cy-tab>
            </template>-->
            <ul class="data-list pd-10">
                <template v-for="(item,index) in dataList">
                    <li
                        :class="['item','flex',{'active':item.status==='0'},'cy-slide-right-in','ani-d-'+(index%10)]"
                        :key="item.pk"
                        @click="onOrderDetail(item)"
                    >
                        <div class="item-l">
                            <div :class="['pdb-10',item.status==='2'?'pdt-35':'pdt-25']">
                                ￥
                                <span class="fs-20">{{item.price}}</span>
                            </div>
                            <cy-btn
                                v-if="item.status==='0' || item.status==='1'"
                                type="white"
                                class="pdlr-10"
                                plain
                                round
                                xs
                            >{{item.status==='0'?'立即使用':'查看详情'}}</cy-btn>
                        </div>
                        <div class="item-r">
                            <span
                                v-show="item.statusTxt"
                                :class="['status',{'active':item.status==='0'||(item.status==='1'&&item.evaluateStatus==='0')}]"
                            >{{item.statusTxt}}</span>
                            <div class="pdt-15 pdb-10 fs-16 hidden-1">{{item.projectName}}</div>
                            <div class="flex between vcenter">
                                <div class="grey fs-12">{{item.endTime}}到期</div>
                                <!-- @click.native="item.status==='1' && onShowWriteOff()"  -->
                                <cy-btn
                                    v-if="item.status==='0' || item.status==='1'"
                                    type="grey"
                                    color="#939599"
                                    class="status-btn"
                                    plain
                                    round
                                    xs
                                >
                                    <span v-if="item.status==='0'">{{item.num}} 张</span>
                                    <span v-else class="fs-10">
                                        查看核销
                                        <span v-if="item.evaluateStatus !== '0'">|评价</span>
                                    </span>
                                </cy-btn>
                            </div>
                        </div>
                    </li>
                </template>
            </ul>

            <template #empty>
                <div class="tc grey">暂无数据</div>
            </template>
        </cy-pulldown-refresh>

        <!-- 核销记录 -->
        <write-off :show.sync="showWriteOff" :option="optionWriteOff"></write-off>
    </div>
</template>

<script>
import { mapState } from "vuex";
import cyPulldownRefresh from "@/components/pulldown_refresh";
import writeOff from "./write_off"; //核销门店记录
import wxx from "@/utils/wx";

export default {
    name: "orders",
    components: {
        cyPulldownRefresh,
        writeOff,
    },
    data() {
        return {
            mescroll: null,
            curTabIndex: 0, //选中tab
            tabList: [
                {
                    name: "全部",
                    count: "0",
                    status: "-1",
                    tabIndex: 0,
                },
                {
                    name: "可用",
                    count: "0",
                    status: "0",
                    tabIndex: 1,
                },
                {
                    name: "核销",
                    count: "0",
                    status: "1",
                    tabIndex: 2,
                },
                {
                    name: "过期",
                    count: "0",
                    status: "2",
                    tabIndex: 3,
                },
            ],
            dataList: [],
            showWriteOff: false, //显示核销记录
            optionWriteOff: {}, //核销记录配置
        };
    },
    created() {
        //const curTabIndex = this.$route.query.curTabIndex;
        //if (curTabIndex) this.curTabIndex = curTabIndex * 1;
    },
    activated() {
        const curTabIndex = this.$route.query.curTabIndex;
        if (curTabIndex) {
            this.curTabIndex = curTabIndex * 1;
            this.onItemClick(this.curTabIndex)
        }
    },
    computed: {
        ...mapState(["defaultRole"]),
    },
    methods: {
        initMescroll(mescroll) {
            this.mescroll = mescroll;
        },

        //切换tab
        onItemClick(tabIndex) {
            //if (this.curTabIndex !== tabIndex) {
                this.dataList = [];
                this.curTabIndex = tabIndex;
                this.mescroll && this.mescroll.resetUpScroll();
            //}
        },

        //上拉回调 获取列表数据
        getProjectListByGroup(page) {
            const curStatus = this.tabList.filter((item) => {
                return item.tabIndex === this.curTabIndex;
            })[0].status;

            let orgPk = "";
            //0-厂商 1-代理商 2-门店 3-普通车主 4-普通车主关注的门店
            if (
                this.defaultRole.type === "1" ||
                this.defaultRole.type === "2" ||
                this.defaultRole.type === "4"
            ) {
                orgPk = this.defaultRole.defaultOrgPk;
                document.title = "我的订单-" + this.defaultRole.orgName;
            }
            const params = {
                orgPk: orgPk, //代理商/门店pk
                pageNum: page.num, //页码
                pageSize: page.size, //每页长度
                chooseStatus: curStatus, //状态
            };
            this.$api
                .getProjectListByGroup(params)
                .then((res) => {
                    if (page.num === 1) this.dataList = [];
                    const statusList = [
                        {
                            num: res.obj.allStatusCount,
                            status: "-1",
                        },
                        ...res.obj.statusList,
                    ];
                    //头部tab
                    this.tabList = this.tabList.map((item, index, list) => {
                        const slist = statusList.filter((i) => {
                            return i.status === item.status;
                        });
                        item.count = slist[0].num + "";
                        return item;
                    });
                    //列表数据
                    res.obj.pages.map((item, index, list) => {
                        switch (item.status) {
                            case "0":
                                item.statusTxt =
                                    item.isExpire === "0" ? "即将到期" : "";
                                break;
                            case "1":
                                if (item.allowEvaluate === "0") {
                                    //不可评价
                                    item.statusTxt = "";
                                } else {
                                    //可评价
                                    item.statusTxt =
                                        item.evaluateStatus === "0"
                                            ? "待评价"
                                            : "已评价";
                                }
                                break;
                            case "2":
                                item.statusTxt = "已过期";
                                break;
                            default:
                                item.statusTxt = "";
                        }
                        return item;
                    });
                    this.dataList = this.dataList.concat(res.obj.pages);
                    // 数据渲染成功后,隐藏下拉刷新的状态
                    this.$nextTick(() => {
                        this.mescroll.endSuccess(res.obj.pages.length);
                    });
                })
                .catch((e) => {
                    // 隐藏上拉和下拉的加载进度
                    this.mescroll.endErr();
                });
        },

        //订单详情
        onOrderDetail(item) {
            //未核销
            if (item.status === "0") {
                this.$router.push("/orders") //清除参数
                //可用
                setTimeout(()=>{
                    this.$router.push({
                        path: "/orders/detail",
                        query: {
                            projectPk: item.projectPk,
                            orgPk: item.orgPk,
                            pk: item.pk,
                        },
                    });
                },50)
            } else if (item.status === "1") {
                //已核销
                this.optionWriteOff = item;
                this.showWriteOff = true;
            }
        },
    },

    //设置页面缓存
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.$store.commit("setKeepAlive", ["orders"]);
        });
    },

    //清除页面缓存
    beforeRouteLeave(to, from, next) {
        if (to.path !== "/orders/detail" && to.path !== "/evaluate/add" && to.path !== "/evaluate/detail") {
            this.$store.commit("setKeepAlive", []);
        }
        next();
    },
};
</script>
<style lang="scss" scoped>
.data-list {
    .item {
        width: 100%;
        height: 100px;
        margin-bottom: 10px;
        background-image: url("../../../assets/img/user/orders/greycard_bg.png");
        background-size: cover;
        background-position: left center;
        &.active {
            background-image: url("../../../assets/img/user/orders/bluecard_bg.png");
        }
        .item-l {
            flex: 0 0 105px;
            width: 105px;
            color: #ffffff;
            text-align: center;
            font-size: 12px;
        }
        .item-r {
            position: relative;
            flex: 1;
            padding: 15px;
            .status {
                position: absolute;
                top: 0;
                right: 0;
                display: inline-block;
                padding: 4px 8px;
                width: 64px;
                line-height: 1;
                border-radius: 0 8px 0 8px;
                font-size: 12px;
                text-align: center;
                color: #62676b;
                background: #d5d5d5;
                &.active {
                    color: #9f7d3f;
                    background: #faeed3;
                }
            }
            .status-btn {
                width: 78px;
            }
        }
    }
}
</style>
