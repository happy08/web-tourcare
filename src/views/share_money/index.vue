<!--健康接力-->
<template>
    <div class="share-money bg-grey">
        <!-- 项目详情 -->
        <project v-if="showProject" :option="projectOption"></project>

        <!-- 选择门店 -->
        <choose-stores v-if="showChooseStores" :option="chooseStoresOption" @change="changeStores"></choose-stores>

        <!-- 代理商未配置活动 -->
        <no-active v-if="showActive"></no-active>
    </div>
</template>

<script>
import { mapState } from "vuex";
import wxx from "@/utils/wx";
import project from "./project";
import chooseStores from "./choose_stores";
import noActive from "./no_active";

export default {
    name: "share_money",
    components: {
        project,
        chooseStores,
        noActive,
    },
    data() {
        return {
            orgPk: "",
            showProject: false,
            projectOption: {},
            showChooseStores: false,
            chooseStoresOption: {},
            showActive: false,
        };
    },
    created() {
        //this.$store.commit("setDefaultRole", "");
        this.init();
    },
    mounted() {},
    computed: {
        ...mapState(["defaultRole", "user"]),
    },
    methods: {
        async init() {
            this.$toast.loading("加载中…");
            this.orgPk = this.$route.query.orgPk;
            if (!this.orgPk) {
                //当前角色是1代理商/2门店/4普通车主关注门店
                if (
                    this.defaultRole &&
                    (this.defaultRole.type === "1" ||
                        this.defaultRole.type === "2" ||
                        this.defaultRole.type === "4")
                ) {
                    this.orgPk = this.defaultRole.defaultOrgPk;
                    this.getProject();
                } else if (this.user.newUser === "1") {
                    //=1新用户 必须开启定位
                    await this.getLocation(true);
                } else {
                    try {
                        this.orgPk = await this.getUserRelationListByPage(); //获取用户上一次关注的代理商/门店 和 代理商/门店列表
                        this.getProject();
                    } catch (err) {}
                }
            } else {
                this.getProject();
            }
        },

        //获取宝贝详情
        getProject() {
            const params = {
                orgPk: this.orgPk,
            };
            this.$api.getProject(params).then(async (res) => {
                const dockingStatus = res.obj.dockingStatus;
                if (dockingStatus === "0") {
                    //=0新用户 必须定位去选择门店
                    await this.getLocation(true);
                    return;
                }
                if (dockingStatus === "1") {
                    //=1代理商未开启活动
                    this.showActive = true;
                    this.$toast.clear();
                    return;
                }
                this.showProject = true;
                const orgPk = !!this.orgPk ? { orgPk: this.orgPk } : {};
                this.projectOption = {
                    ...this.projectOption,
                    ...res.obj,
                    ...orgPk,
                };
            });
        },

        //获取用户上一次关注的代理商/门店 和 代理商/门店列表
        getUserRelationListByPage() {
            return new Promise((resolve, reject) => {
                const params = {
                    pageNum: "1",
                    pageSize: "50",
                };
                this.$api
                    .getUserRelationListByPage(params)
                    .then(async (res) => {
                        //没有默认关注过代理商/门店
                        if (!res.obj.recentlyUsed) {
                            //没有关注列表  说明是新用户则【必须开启定位】
                            if (res.obj.pages && res.obj.pages.length <= 0) {
                                await this.getLocation(true);
                            } else {
                                //选择门店
                                await this.getLocation(true);
                                // document.title = "请选择门店";
                                // this.showChooseStores = true;
                                //this.relationStoreList = res.obj.pages;
                            }
                            reject();
                        } else {
                            const orgPk = res.obj.recentlyUsed.orgPk;
                            resolve(orgPk);
                        }
                    })
                    .catch(async (err) => {
                        await this.getLocation(true);
                        reject();
                    });
            });
        },

        //获取经纬度 isMust-新用户必须开启定位
        getLocation(isMust = false) {
            return new Promise((resolve, reject) => {
                this.$nextTick(() => {
                    this.$toast.clear();
                });
                const setWxConfig = () => {
                    wx.getLocation({
                        type: "wgs84",
                        success: (res) => {
                            //新用户-去选择附近门店
                            if (!!isMust) {
                                this.projectOption = {
                                    latitude: res.latitude, //纬度
                                    longitude: res.longitude, //经度
                                };
                                this.chooseStoresOption = {
                                    latitude: res.latitude, //纬度
                                    longitude: res.longitude, //经度
                                };
                                document.title = "请选择门店";
                                this.showChooseStores = true;
                                this.$toast.clear();
                            }
                            resolve();
                        },
                        cancel: () => {
                            if (!!isMust) {
                                this.$nextTick(() => {
                                    this.$dialog({
                                        title: "活动有区域限制，请开启定位",
                                        noCancel: true,
                                        onConfirm: () => {
                                            this.getLocation(true);
                                        },
                                    });
                                });
                            } else {
                                resolve();
                            }
                        },
                        fail: (err) => {
                            if (!!isMust) {
                                this.$nextTick(() => {
                                    this.$dialog({
                                        title:
                                            "活动有区域限制，请前往设置开启定位！",
                                        noCancel: true,
                                        onConfirm: () => {
                                            this.getLocation(true);
                                        },
                                    });
                                });
                            } else {
                                resolve();
                            }
                        },
                    });
                };
                //微信签名配置
                wxx.wxaccountConfig(setWxConfig);
            });
        },

        //选择门店
        changeStores(orgPk) {
            this.orgPk = orgPk;
            this.getProject();
        },
    },
};
</script>
<style lang="scss" scoped>
</style>
     