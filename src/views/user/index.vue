<!--个人中心-->
<template>
    <div class="user-center pdb-50 bg-darkblue white">
        <div class="head flex vcenter between pdt-30 pdb-15 pdlr-25">
            <div class="big-circle"></div>
            <div class="small-circle"></div>
            <div>
                <div class="mgb-5 fs-18">{{userName}}</div>
                <!-- <span v-if="!!userPhone" class="phone">{{userPhone}}</span>-->
                <!-- 切换角色 -->
                <change-role v-if="roleList.length>0" :data="roleList" @changeRole="onChangeRole">
                    <div class="user-change-role">
                        {{orgName}} | {{orgType}}
                        <cy-icon type="xiajiantou" size="10"></cy-icon>
                    </div>
                </change-role>
            </div>
            <div class="flex vcenter">
                <cy-image :src="userFace" round width="55px" height="55px"></cy-image>
            </div>
        </div>

        <div class="experience">
            <cy-image :src="require('@/assets/img/user/experience.png')" width="100%" height="100%"></cy-image>

            <cy-btn
                v-if="!!isExperience"
                @click.native="handleExperience"
                class="btn-experience pdlr-15"
                type="blue-gradient"
                round
                sm
            >{{status.isExperience==='2'||status.isExperience==='3'?'体验中心':'免费体验'}}</cy-btn>
        </div>

        <div class="share mglr-10 pdtb-10">
            <cy-row class="tc" @click.native="$router.push('myshare')">
                <cy-col :span="8">
                    <div>
                        <div class="fs-20">{{rewardMoneySum}}</div>
                        <div class="fs-12 grey">返现(元)</div>
                    </div>
                </cy-col>
                <cy-col :span="8">
                    <div>
                        <div class="fs-20">{{forwardStatusSum}}</div>
                        <div class="fs-12 grey">转发(次)</div>
                    </div>
                </cy-col>
                <cy-col :span="8">
                    <div>
                        <div class="fs-20">{{browseStatusSum}}</div>
                        <div class="fs-12 grey">浏览(次)</div>
                    </div>
                </cy-col>
            </cy-row>
        </div>

        <div class="menu mglr-10 mgt-10 mgb-20">
            <div
                v-for="(item,index) in menuList"
                :key="index"
                @click="linkTo(item.link)"
                class="cell-item flex between vcenter"
                v-show="item.show"
            >
                <div class="lh1">
                    <cy-icon :type="item.icon" size="20"></cy-icon>
                    <span class="mgl-10">{{item.name}}</span>
                </div>
                <cy-icon type="youjiantou" size="10" color="#4D6E89"></cy-icon>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import changeRole from "@/components/_custom/change_role"; //切换角色
import { coverPhone } from "@/utils/number";

export default {
    name: "user",
    components: {
        changeRole,
    },
    data() {
        return {
            miniProgram: "0", //从小程序进来 0否 1是
            rewardMoneySum: "", //	返利总金额
            forwardStatusSum: "", // 转发次数
            browseStatusSum: "", // 浏览次数
            //导航
            menuList: [
                {
                    name: "我的订单",
                    icon: "wodedingdan",
                    link: "/orders",
                    show: true,
                },
                {
                    name: "分享记录",
                    icon: "fenxiangjilu",
                    link: "/myshare",
                    show: true,
                },
                {
                    name: "车辆信息",
                    icon: "cheliangxinxi",
                    link: "/setting/car_info",
                    show: true,
                },
                {
                    name: "消息提醒",
                    icon: "xiaoxitixing",
                    link: "/setting/message_remind",
                    show: false,
                },
                {
                    name: "手机解绑",
                    icon: "weixinjiebang",
                    link: "untiePhone",
                    show: false,
                },
            ],
            status: {}, //体验权限
            isExperience: false, //是否免费体验：0-否 1-是 2-已申请 3-已体验
            orgName: "",
            orgType: "",
            roleList: [],
        };
    },
    async created() {
        const query = this.$route.query;
        this.miniProgram = query.miniProgram; //=1 从小程序扫码跳过来的
        const orgPk = query.orgPk; //门店pk
        const qrcodeType = query.qrcodeType; // 二维码类型，=2推广码
        const qrcodePk = query.qrcodePk; // 二维码pk/推广码pk

        if (this.miniProgram === "1" && !!orgPk) {
            if (qrcodeType === "2" && !!orgPk && !!qrcodePk) {
                await this.updateScanCount(orgPk, qrcodePk); //增加更新扫码次数
            }
            this.getExperienceStatus(orgPk); //体验状态信息
        } else {
            this.getMyPersonalCenter(); //统计
            this.getIsExperience();
        }
        this.getAccountsUserAndRole();
    },
    mounted() { },
    computed: {
        ...mapState({
            userName: (state) => state.user.name || state.user.nickName,
            userPhone: (state) => coverPhone(state.user.phone),
            userFace: (state) => state.user.face,
            defaultRole: (state) => state.defaultRole,
        }),
    },
    methods: {
        //统计信息
        getMyPersonalCenter() {
            this.$toast.loading("加载中…");
            this.$api
                .getMyPersonalCenter()
                .then((res) => {
                    this.rewardMoneySum = res.obj.rewardMoneySum || "0";
                    this.forwardStatusSum = res.obj.forwardStatusSum || "0";
                    this.browseStatusSum = res.obj.browseStatusSum || "0";
                    this.$toast.clear();
                })
                .catch((err) => {});
        },

        //获取上次访问的角色信息，角色列表
        getAccountsUserAndRole() {
            const params = {
                pk: this.$store.state.user.pk,
            };
            this.$api
                .getAccountsUserAndRole(params)
                .then((res) => {
                    //角色列表 0-厂商 1-代理商 2-门店 3-普通车主 4-普通车主关注的门店 --只有0&1才需要设置消息提醒
                    const rList = res.obj.roleList.filter((item) => {
                        return item.type === "0" || item.type === "1";
                    });
                    this.menuList.map((item) => {
                        //this.$toast("无权限，您不是厂商或代理商");
                        if (item.name === "消息提醒" && rList.length > 0) {
                            item.show = true;
                        }
                        if (item.name === "手机解绑" && !!this.userPhone) {
                            item.show = true;
                        }
                        return item;
                    });

                    const defaultOrgPk =
                        res.obj.defaultRoleInfo.defaultOrgPk ||
                        this.$store.state.user.pk;
                    //角色是【普通车主】时 设置orgPk=-01标识
                    const roleList = res.obj.roleList.map((item) => {
                        item.orgPk =
                            item.type === "3" && !item.orgPk
                                ? "-01"
                                : item.orgPk;
                        return item;
                    });

                    //当前角色
                    let currentRole = roleList.filter((item) => {
                        return item.orgPk === defaultOrgPk;
                    })[0];
                    if (!currentRole) {
                        currentRole = roleList[0];
                    }
                    this.orgName = currentRole.orgName || currentRole.roleName;
                    this.orgType = ["0", "1", "2"].includes(currentRole.type)
                        ? "企业"
                        : "车主";
                    this.roleList = this.sortKey(roleList, "type");
                    this.$store.commit("setDefaultRole", {
                        ...res.obj.defaultRoleInfo,
                        orgName: currentRole.orgName || "",
                    });
                })
                .catch((err) => {});
        },

        //切换角色
        onChangeRole(option) {
            this.orgName = option.orgName || option.roleName;
            this.orgType = ["0", "1", "2"].includes(option.type)
                ? "企业"
                : "车主";
        },

        //增加更新扫码次数
        updateScanCount(orgPk, qrcodePk) {
            console.log("updateScanCount");
            return new Promise((resolve) => {
                const params = {
                    orgPk: orgPk,
                    pk: qrcodePk, //推广码pk
                };
                this.$api
                    .updateScanCount(params)
                    .then((res) => {
                        resolve();
                    })
                    .catch((err) => {
                        resolve();
                    });
            });
        },

        //跳转
        linkTo(link) {
            if (link === "untiePhone") {
                this.untiePhone();
                return;
            }
            this.$router.push({
                path: link,
            });
        },

        //微信解绑
        untiePhone() {
            this.$dialog({
                title: "您确定要解除手机号绑定吗？",
                onConfirm: () => {
                    this.$toast.loading("加载中…");
                    const params = {
                        pk: this.$store.state.user.pk,
                    };
                    this.$api
                        .untiePhone(params)
                        .then((res) => {
                            const sysSource = this.$store.state.sysInfo.pk;
                            this.$toast.success("解除手机号绑定成功");
                            this.$store.commit("addPhone", "");
                            // setTimeout(() => {
                            //     this.$router.push("/share_money");
                            //     // const url = window.location.href.split("#")[0];
                            //     // window.location.href = `${url}#/auth?sysSource=${sysSource}`;
                            // }, 1000);
                        })
                        .catch((err) => {});
                },
            });
        },

        // 获取体验
        async getIsExperience() {
            let orgPk = "";
            //type=1是代理商 type=2是门店
            if (
                this.defaultRole.type === "1" ||
                this.defaultRole.type === "2"
            ) {
                orgPk = this.defaultRole.defaultOrgPk;
                this.getExperienceStatus(orgPk);
            } else {
                try {
                    orgPk = await this.getUserRelationListByPage(); //获取用户上一次关注的代理商/门店 和 代理商/门店列表
                    this.getExperienceStatus(orgPk); //获取免费体验信息
                } catch (err) {
                    this.isExperience = false;
                }
            }
        },

        //获取用户上一次关注的代理商/门店 和 代理商/门店列表
        getUserRelationListByPage() {
            return new Promise((resolve, reject) => {
                const params = {
                    pageNum: "1",
                    pageSize: "15",
                };
                this.$api
                    .getUserRelationListByPage(params)
                    .then((res) => {
                        //没有默认关注过代理商/门店
                        if (!res.obj.recentlyUsed) {
                            reject();
                        } else {
                            const orgPk = res.obj.recentlyUsed.orgPk;
                            resolve(orgPk);
                        }
                    })
                    .catch((err) => {
                        reject();
                    });
            });
        },

        //获取体验状态
        getExperienceStatus(orgPk) {
            this.$api
                .getExperienceStatus({
                    orgPk: orgPk,
                })
                .then((data) => {
                    this.isExperience =
                        data.obj.isExperience !== "0" ? true : false; //是否免费体验：0-否 1-是 2-已申请 3-已体验
                    this.status = data.obj;
                    //从小程序扫码跳过来的
                    if (this.miniProgram === "1") {
                        this.$router.push("/user"); //跳转后能返回到user
                        this.handleExperience();
                    }
                })
                .catch((err) => {});
        },

        // 跳转体验中心
        handleExperience() {
            if (this.status.isExperience === "1") {
                this.$router.push(
                    `/experience?orgPk=${this.status.experienceOrgPk}&orgName=${this.status.shopName}`
                );
            }
            if (
                this.status.isExperience === "2" ||
                this.status.isExperience === "3"
            ) {
                // 体验状态 门店简码 门店orgpk
                this.$router.push(
                    `/experience_center/${this.status.isExperience},${this.status.experienceSimpleCode},${this.status.experienceOrgPk},${this.status.shopName}`
                );
            }
        },

        //数组对象排序
        sortKey(array, key) {
            return array.sort(function (a, b) {
                return a[key] - b[key];
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/_mixin";

.head {
    position: relative;
    overflow: hidden;
}

.big-circle {
    position: absolute;
    top: -80px;
    left: -70px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.06);
}

.small-circle {
    position: absolute;
    right: -30px;
    top: 10px;
    width: 70px;
    height: 65px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.06);
}

.user-change-role {
    display: inline-block;
    padding: 3px 10px 2px 10px;
    border: solid 1px rgba(255, 255, 255, 0.3);
    color: #eeeeee;
    background: rgba(255, 255, 255, 0.1);
    font-size: 12px;
    line-height: 1;
    border-radius: 50px;
}

.experience {
    position: relative;
    width: 370;
    height: 119px;
    margin: 10px;
    background-color: #092c49;
    border-radius: 5px;
    overflow: hidden;
    .btn-experience {
        position: absolute;
        top: 50%;
        right: 30px;
        font-size: 14px;
        transform: translateY(-50%);
    }
}

.share {
    background: #092c49;
    border-radius: 5px;
    .grey {
        color: #d9eeff;
    }
}

.menu {
    background: #092c49;
    border-radius: 5px;
    .cell-item {
        position: relative;
        padding: 15px;
        &::after {
            @include setBottomLine(#ebedf0);
            left: 45px;
            border-color: #0a4373;
        }
        &:last-child {
            &::after {
                border-color: rgba(255, 255, 255, 0);
            }
        }
    }
}
</style>
