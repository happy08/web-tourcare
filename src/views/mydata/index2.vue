<!--我的数据-->
<template>
    <div class="bg-darkblue pdb-50">
        <div class="head">
            <div class="head-inner flex between vcenter pdtb-10 pdlr-15 b-line">
                <div>
                    <!-- 切换角色 -->
                    <change-role
                        v-if="roleList.length>0"
                        :data="roleList"
                        :orgName="orgName"
                        @changeRole="onChangeRole"
                    ></change-role>
                </div>
                <!-- 导航列表 -->
                <div>
                    <div
                        :class="['menu',{active:showNavList===true}]"
                        @click="showNavList=true"
                        v-if="navList.length > 0"
                    >
                        <span class="line"></span>
                        <span class="line"></span>
                        <span class="line"></span>
                    </div>
                    <cy-popup
                        v-model="showNavList"
                        :closeIcon="true"
                        position="right"
                        height="auto"
                        width="50%"
                        background="transparent"
                    >
                        <div class="pdt-50 white">
                            <div
                                v-for="(item,index) in navList"
                                :key="item.pk"
                                @click="scrollToPage(index)"
                                :class="[showNavList===true?'cy-slide-right-in':'cy-slide-right-out', 'ani-d-'+index,'bg-blue','menu-item']"
                            >
                                <!-- <cy-icon class="mgr-10" :type="item.icon" size="40"></cy-icon> -->
                                {{item.name}}
                            </div>
                            <!-- <cy-row wrap="wrap" class="pdtb-15" v-if="navList.length > 0">
                                <template v-for="(item,index) in navList">
                                    <cy-col :key="item.pk" :span="8" class="mgb-40">
                                        <cy-icon
                                            @click.native="scrollToPage(index)"
                                            :type="item.icon"
                                            size="85"
                                        ></cy-icon>
                                        <div class="item-name">{{item.name}}</div>
                                    </cy-col>
                                </template>
                            </cy-row>-->
                        </div>
                    </cy-popup>
                </div>
            </div>
            <data-header
                :option="optionHeader"
                @onChangeTime="onChangeTime"
                @onChange="onChangeSearch"
            ></data-header>
        </div>

        <div class="mydata-inner">
            <!--@scrollChange="scrollChange" -->
            <cy-pullup-loading @loadmore="onLoadmore" :hasMore="isHasMore" :dataList="navList">
                <!-- 所有数据 -->
                <div class="all-data" v-if="navList.length > 0">
                    <template v-for="(item,index) in navList">
                        <div :ref="'data'+index" :key="item.id" style="padding-top:90px">
                            <div v-if="item.isShow">
                                <div class="flex center pdtb-10 fs-16 bold cy-zoom-in">
                                    <cy-image
                                        :src="require('@/assets/img/mydata/circular1_bg.png')"
                                        width="18px"
                                        height="9px"
                                    ></cy-image>
                                    <span class="title greenblue pdlr-10">{{item.name}}</span>
                                    <cy-image
                                        :src="require('@/assets/img/mydata/circular2_bg.png')"
                                        width="18px"
                                        height="9px"
                                    ></cy-image>
                                </div>
                                <component
                                    :ref="'component'+index"
                                    :is="item.component"
                                    :option="optionSearch"
                                ></component>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- 下页箭头
                <div v-if="navList.length>0" class="fixed-bt mgb-safe-50 tc">
                    <div class="pdtb-5" v-show="nextPage !== 0" @click.stop="scrollToPage(nextPage)">
                        <cy-image
                            :src="require('@/assets/img/mydata/lower_btn.png')"
                            width="20px"
                            height="20px"
                        ></cy-image>
                    </div>
                    <div class="pdtb-5" v-show="nextPage === 0" @click.stop="scrollToPage(0)">
                        <cy-image
                            :src="require('@/assets/img/mydata/upper_btn.png')"
                            width="20px"
                            height="20px"
                        ></cy-image>
                    </div>
                </div>-->

                <!--返回顶部 -->
                <cy-to-top></cy-to-top>
            </cy-pullup-loading>
        </div>
    </div>
</template>

<script>
import cyPullupLoading from "@/components/pullup_loading";
import changeRole from "@/components/_custom/change_role"; //切换角色
import cyToTop from "@/components/totop";
import { mapState } from "vuex";
import { roleList } from "@/service/config";
import { dateDiffDate, dateDiffDays } from "@/utils/formatDate";
import debounce from "@/utils/debounce";

import dataHeader from "@/components/_custom/mydata/data_header"; //数据头部
import gatherData from "./gather_data"; //汇总数据
import agentRanking from "./agent_ranking"; //经营排行榜
import storeRanking from "./store_ranking"; //门店商排行榜
import ownerRanking from "./owner_ranking"; //车主排行榜
import achievementRanking from "./achievement_ranking"; //业绩排行榜
import shareReport from "./share_report"; //分享效果报表
import shareDetail from "./share_detail"; //分享效果详情
import distribution from "./distribution"; //门店分布
import scrollToView from "@/utils/scrollToView";

export default {
    name: "mydata",
    components: {
        cyPullupLoading,
        cyToTop,
        dataHeader,
        gatherData,
        agentRanking,
        storeRanking,
        ownerRanking,
        achievementRanking,
        shareReport,
        shareDetail,
        distribution,
        changeRole,
    },
    data() {
        return {
            optionHeader: {},
            optionTime: "",
            optionSearch: {},
            pageNum: 1,
            showNavList: false,
            navList: [],
            isHasMore: true,
            nextPage: 1,
            stopScroll: true,
            orgName: "",
            roleList: [],
        };
    },
    created() {
        this.scrollListener();
        this.getAccountsUserAndRole();
    },
    watch: {},
    mounted() {
        this.clientHeight =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;
    },
    computed: {
        ...mapState({
            user: (state) => state.user,
            sysName: (state) => state.sysInfo.name,
            defaultRole: (state) => state.defaultRole,
        }),
        //总页
        total() {
            return this.navList.length;
        },
    },
    methods: {
        //获取上次访问的角色信息，角色列表
        getAccountsUserAndRole() {
            //this.$toast.loading("加载中…");
            const params = {
                pk: this.user.pk,
            };
            this.$api
                .getAccountsUserAndRole(params)
                .then((res) => {
                    const rolePk =
                        res.obj.defaultRoleInfo.rolePk ||
                        this.$store.state.user.pk;

                    //当前角色
                    let currentRole = res.obj.roleList.filter((item) => {
                        return item.rolePk === rolePk;
                    })[0];
                    if (!currentRole) {
                        currentRole = res.obj.roleList[0];
                    }
                    this.orgName = currentRole.orgName || currentRole.roleName;
                    //是代理商
                    if (currentRole.type === "1") {
                        this.optionSearch.province = currentRole.province; //省 -门店分布有用
                        this.optionSearch.provincePinYin =
                            currentRole.provincePinYin; //省拼音 -门店分布有用
                    }

                    //角色类型 roleList = { 0: "company", 1: "agent", 2: "store", 3: "member" } 0-厂商 1-代理商 2-门店 3-普通车主 4-普通车主关注的门店
                    this.getSubscribeDataList(
                        currentRole.type,
                        currentRole.orgPk
                    );

                    this.roleList = this.sortKey(res.obj.roleList, "type"); //res.obj.roleList.sort(this.compare("type"));
                    this.$store.commit(
                        "setDefaultRole",
                        res.obj.defaultRoleInfo
                    );
                })
                .catch((err) => {});
        },

        //获取订阅配置列表
        getSubscribeDataList(type, orgPk) {
            //搜索代理商/门店pk参数  type 0-厂商 1-代理商 2-门店 3-普通车主 4-普通车主关注的门店
            if (type === "2") {
                this.optionSearch.storeOrgPk = orgPk;
                this.optionSearch.agentOrgPk &&
                    delete this.optionSearch.agentOrgPk;
            } else if (type === "1" || type === "0") {
                this.optionSearch.agentOrgPk = orgPk;
                this.optionSearch.storeOrgPk &&
                    delete this.optionSearch.storeOrgPk;
            } else {
                this.optionSearch.agentOrgPk &&
                    delete this.optionSearch.agentOrgPk;
                this.optionSearch.storeOrgPk &&
                    delete this.optionSearch.storeOrgPk;
            }

            const roleType = roleList[type];
            this.$api
                .getSubscribeDataList({
                    [roleType]: "1",
                })
                .then((res) => {
                    const list = res.obj.filter((item, index) => {
                        index === 0
                            ? (item.isShow = true)
                            : (item.isShow = false);
                        return item;
                    });
                    this.navList = list;
                })
                .catch((err) => {});
        },

        //选择时间 条件搜索
        onChangeTime(option) {
            console.log("option", option);
            //计算日期相差天数
            const days = dateDiffDays(option.startTime, option.endTime);
            //计算days天前的日期
            // option.startLastTime = dateDiffDate(option.startTime, -days);
            // option.endLastTime = dateDiffDate(option.startTime, -1);

            this.optionTime = {
                ...option,
                startTime: option.startTime,
                endTime: option.endTime,
                startLastTime: dateDiffDate(option.startTime, -days),
                endLastTime: dateDiffDate(option.startTime, -1),
            };
            console.log("this.optionTime", this.optionTime);
            for (var index = 0; index < this.navList.length; index++) {
                //this.navList.forEach((item, index) => {
                const el = this.$refs["data" + index][0];
                const isViewport = this.isElementInViewport(el);
                console.log("is", isViewport, index);
                //栏目在可视区域
                if (isViewport) {
                    const component = this.$refs["component" + index][0];
                    component.updateData &&
                        component.updateData(this.optionTime);
                    //this.scrollToPage(index);
                    //return;
                }
                //});
            }
        },

        //条件搜索
        onChangeSearch(option) {
            // //只有切换时间时才不会重新局部更新栏目
            if (option.startTime && option.endTime) {
                //计算日期相差天数
                const days = dateDiffDays(option.startTime, option.endTime);
                //计算days天前的日期
                option.startLastTime = dateDiffDate(option.startTime, -days);
                option.endLastTime = dateDiffDate(option.startTime, -1);
            }
            //else{
            //重新整个更新栏目 置顶
            this.pageNum = 1;
            window.scrollTo(0, 0);
            const list = this.navList.filter((item, index) => {
                index === 0 ? (item.isShow = true) : (item.isShow = false);
                return item;
            });
            this.navList = list;

            this.optionSearch = {
                ...this.optionSearch,
                ...option,
            };

            //}
        },

        //切换角色
        onChangeRole(option) {
            //设置服务商默认是全部
            this.optionHeader = {
                agentOrgPk: "01",
                agentName: "",
            };
            this.pageNum = 1;
            this.navList = [];
            this.orgName = option.orgName || option.roleName;
            //是代理商
            if (option.type === "1") {
                this.optionSearch.province = option.province; //省 -门店分布有用
                this.optionSearch.provincePinYin = option.provincePinYin; //省拼音 -门店分布有用
            }
            window.scrollTo(0, 0);
            this.getSubscribeDataList(option.type, option.orgPk);
        },

        //下拉加载下一页
        onLoadmore() {
            if (this.pageNum < this.total) {
                this.scrollToPage(this.pageNum, false);
            } else {
                this.isHasMore = false;
            }
        },

        //监听滚动
        onScroll() {
            for (var index = 0; index < this.navList.length; index++) {
                const el = this.$refs["data" + index][0];
                const isViewport = this.isElementInViewport(el);
                console.log("is", isViewport, index);
                //栏目在可视区域
                if (isViewport && !!this.optionTime) {
                    const component = this.$refs["component" + index][0];
                    const isOnce =
                        component.updateData &&
                        component.updateData(this.optionTime);
                    //第一次加载数据后滚动到当前栏目顶部
                    if (isOnce) {
                        this.scrollToPage(index);
                    }
                    //this.scrollToPage(index);
                    //return
                }
            }
            // this.navList.forEach((item, index) => {
            //     const el = this.$refs["data" + index][0];
            //     const isViewport = this.isElementInViewport(el);
            //     console.log("is", isViewport, index);
            //     //栏目在可视区域
            //     if (isViewport && !!this.optionTime) {
            //         const component = this.$refs["component" + index][0];
            //         const isOnce=  component.updateData && component.updateData(this.optionTime);
            //         //第一次加载数据后滚动到当前栏目顶部
            //         if(isOnce){
            //             this.scrollToPage(index);
            //         }
            //         console.log("s",a, this.optionTime);
            //         //this.scrollToPage(index);
            //         return
            //     }
            // });

            // if (top <= this.clientHeight) {
            //     this.nextPage = 1;
            // } else {
            //     const index =
            //         (this.topArr &&
            //             this.topArr.findIndex((val) => {
            //                 top = top + 10;
            //                 return val >= top || val === 0;
            //             })) ||
            //         1;
            //     this.nextPage = index > this.total || index === -1 ? 0 : index;
            // }
        },

        //滚动防抖
        scrollListener() {
            window.addEventListener(
                "scroll",
                debounce(this.onScroll, 50),
                false
            );
        },

        //scrollChange(top) {},

        //滚动到第几页
        scrollToPage(dataIndex, isScroll = true) {
            //防止快速点击下一页
            if (this.stopScroll === false) {
                return;
            }
            this.showNavList = false;
            this.stopScroll = false;
            if (dataIndex !== 0) {
                this.navList[dataIndex].isShow = true;
                this.pageNum = dataIndex + 1;
            }
            this.$nextTick(async () => {
                if (dataIndex !== 0) {
                    let top = [];
                    const show = this.navList.map(function (v) {
                        return v.isShow;
                    });
                    for (let index in show) {
                        if (show[index] === true) {
                            const offsetTop = this.$refs["data" + index][0]
                                .offsetTop;
                            top.push(offsetTop);
                        } else {
                            //index < dataIndex - 1 ? top.push(1) : top.push(0);
                            index < dataIndex ? top.push(1) : top.push(0);
                            //top.push(0);
                        }
                    }
                    this.topArr = top;
                }
                if (isScroll && this.topArr) {
                    await scrollToView(this.topArr[dataIndex]);
                }
                this.stopScroll = true;
            });
            console.log("this.topArr", this.topArr);
        },

        //数组对象排序
        sortKey(array, key) {
            return array.sort(function (a, b) {
                return a[key] - b[key];
            });
        },

        //判断DOM是否在可视区域
        isElementInViewport(el) {
            let rect = el.getBoundingClientRect();
            return !(
                rect.top >=
                    (window.innerHeight ||
                        document.documentElement.clientHeight) ||
                rect.bottom <= 0
            );
        },
    },
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/_mixin";
.head {
    position: fixed;
    width: 100%;
    z-index: 1010;
    .head-inner {
        background: rgba(9, 39, 64, 0.95);
        // backdrop-filter: blur(20px);
        .menu {
            position: relative;
            width: 22px;
            height: 16px;
            .line {
                position: absolute;
                height: 2px;
                width: 100%;
                background: linear-gradient(295deg, #3f8bfd 0%, #29d7a8 100%);
                border-radius: 10px;
                transition: 0.5s;
                &:nth-child(1) {
                    top: 0;
                }
                &:nth-child(2) {
                    right: 0px;
                    top: 7px;
                }
                &:nth-child(3) {
                    bottom: 0;
                }
            }
        }
        .menu.active {
            .line {
                &:nth-child(1) {
                    top: 7px;
                    transform: rotate(-45deg);
                }
                &:nth-child(2) {
                    right: -200%;
                    top: 7px;
                }
                &:nth-child(3) {
                    bottom: 7px;
                    transform: rotate(45deg);
                }
            }
        }
    }
    .b-line::after {
        border-color: #066ec3;
    }
}
.menu-item {
    margin: 15px 0;
    padding: 10px 30px;
    border-radius: 50px 0 0 50px;
}
.mydata-inner {
    // margin-top: 100px;
    /deep/.cy-pulldown-loading-more {
        display: none;
    }
}
.org-name {
    display: inline-block;
    margin: 10px 0 15px 0;
    padding: 3px 10px;
    background: #172e3b;
    border-radius: 5px;
    color: #ffffff;
}

// .item-name {
//     position: relative;
//     width: 90px;
//     padding: 2px;
//     margin: 8px auto 0 auto;
//     background: #f5f8fa;
//     border-radius: 5px;
//     font-size: 12px;
//     font-weight: bold;
//     color: #2c749b;
//     letter-spacing: 1.5px;
//     &::before {
//         content: "";
//         position: absolute;
//         top: -8px;
//         left: 50%;
//         margin-left: -4px;
//         @include setArrow(4px, #f5f8fa, bottom);
//     }
// }

.all-data {
    // .title {
    //     animation: textshadow 3s ease-in infinite;
    //     @keyframes textshadow {
    //         0% {
    //             text-shadow: 0 0 2px #3f8bfd;
    //         }
    //         50% {
    //             text-shadow: 0 0 10px #29d7a8;
    //         }
    //         100% {
    //             text-shadow: 0 0 2px #3f8bfd;
    //         }
    //     }
    // }
    /deep/.cy-pulldown-loading-more {
        display: block;
    }
}
</style>
