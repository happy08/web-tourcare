<!--消息提醒设置-->
<template>
    <div class="message-remind bg-grey pdb-50">
        <div>
            <cy-cell
                v-for="item in msgList"
                :key="item.msgPk"
                :titleIcon="item.icon"
                :title="item.title"
                :subTitle="item.description"
                @click.native="item.type === '1' ? showExpireMsg=true : ''"
                :link="item.type === '1' ? 'javascript:' : ''"
            >
                <template v-if="item.type === '1'" slot="desc">
                    <div class="fs-14">{{serviceValue}}</div>
                </template>
                <template v-else slot="desc">
                    <input
                        v-model="item.value"
                        class="num"
                        type="number"
                        pattern="number"
                        onkeyup="value=value.replace(/[^\d\.]/g,'')"
                    />
                    <div class="mglr-5 fs-14">{{item.unit}}</div>
                    <cy-switch v-model="item.switchStatus"></cy-switch>
                </template>
            </cy-cell>
        </div>

        <!-- 服务到期提醒 -->
        <cy-popup
            v-model="showExpireMsg"
            :closeIcon="false"
            round
            position="center"
            width="90%"
            height="auto"
            background="#172E3B"
        >
            <div class="popup-inner pd-20 pdlr-50 tc white">
                <div class="mgt-10 mgb-20 fs-22">服务到期提醒</div>
                <div class="pdlr-10">
                    <div
                        v-for="(item,index) in serviceList"
                        :key="index"
                        class="flex between venter mgb-20"
                    >
                        <div class="fs-16">{{item.anotherName}}</div>
                        <cy-switch v-model="item.switchStatus"></cy-switch>
                    </div>
                </div>
                <div>
                    <cy-btn
                        @click.native="showExpireMsg=false"
                        type="blue-gradient"
                        round
                        class="mgb-15"
                    >确定</cy-btn>
                </div>
            </div>
        </cy-popup>

        <div class="fixed-bt mgb-safe-0 pdlr-30 pd-15">
            <div v-if="orgName" class="mgb-15 tc">代理商：{{orgName}}</div>
            <cy-btn :disabled="disabled" @click.native="onSubmit" type="blue-gradient" round>保存</cy-btn>
        </div>

        <!-- 切换角色
        <change-role v-if="roleList.length>0" :data="roleList" @changeRole="onChangeRole"></change-role>
        -->
    </div>
</template>

<script>
import { mapState } from "vuex";
import cySwitch from "@/components/switch";
import changeRole from "@/components/_custom/change_role"; //切换角色
//import { roleList } from "@/service/config";
import validator from "@/utils/validator";

export default {
    name: "message_remind",
    components: {
        cySwitch,
        changeRole,
    },
    data() {
        return {
            rolePk: "", //角色PK
            roleType: "", //角色类型
            //roleList: [], //角色列表
            orgName: "",
            msgList: [],
            disabled: true,
            showExpireMsg: false,
            serviceValue: [],
            serviceList: [],
        };
    },
    created() {
        if (
            this.defaultRole &&
            (this.defaultRole.type === "0" || this.defaultRole.type === "1")
        ) {
            this.rolePk = this.defaultRole.rolePk;
            this.roleType = this.defaultRole.type;
            this.orgName = this.defaultRole.orgName;
            this.getUserMsgInstall();
            this.getServiceExpired();
        } else {
            this.getAccountsUserAndRole();
        }
    },
    computed: {
        ...mapState(["defaultRole"]),
    },
    watch: {
        serviceList: {
            handler(nVal, oVal) {
                let list = [];
                nVal.forEach((item) => {
                    if (item.switchStatus === true) {
                        list.push(item.value + item.unit);
                    }
                });
                this.serviceValue = list.join(",");
            },
            deep: true,
        },
    },
    methods: {
        //获取上次访问的角色信息，角色列表
        getAccountsUserAndRole() {
            this.$toast.loading("加载中…");
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
                    if (rList.length <= 0) {
                        this.$toast("无权限，您不是厂商或代理商");
                        setTimeout(() => {
                            this.$router.go(-1);
                        }, 1500);
                        return;
                    }
                    //this.roleList = this.sortKey(rList, "type");
                    const defaultRoleInfo = res.obj.defaultRoleInfo;
                    //默认角色0-厂商和1-代理商
                    if (
                        defaultRoleInfo.type === "0" ||
                        defaultRoleInfo.type === "1"
                    ) {
                        this.orgPk = defaultRoleInfo.defaultOrgPk;
                        this.rolePk = defaultRoleInfo.rolePk;
                        this.roleType = defaultRoleInfo.type;

                        let currentRole = rList.filter((item) => {
                            return item.orgPk === defaultRoleInfo.defaultOrgPk;
                        })[0];
                        this.orgName = currentRole.orgName;
                    } else {
                        this.orgPk = rList[0].orgPk;
                        this.rolePk = rList[0].rolePk;
                        this.roleType = rList[0].type;
                        this.orgName = rList[0].orgName;
                    }

                    this.getUserMsgInstall();
                    this.getServiceExpired();
                })
                .catch((err) => {});
        },

        //获取用户消息提醒配置
        getUserMsgInstall() {
            const params = {
                rolePk: this.rolePk,
                userType: this.roleType,
            };
            this.$api
                .getUserMsgInstall(params)
                .then((res) => {
                    this.setMsgList(res.obj);
                    this.$toast.clear();
                })
                .catch((err) => {});
        },

        //设置消息列表 --保存成功后如果是新增需要重新设置 新增无pk修改有pk
        setMsgList(res) {
            this.msgList = [];
            res.forEach((item) => {
                item.switchStatus = item.switchStatus == "1" ? true : false;
                this.$set(this.msgList, item.msgPk, item);
            });
            this.msgList = this.msgList.filter((item) => item);
            this.disabled = false;
        },

        //获取服务到期提醒配置
        getServiceExpired() {
            const params = {
                type: "1",
                rolePk: this.rolePk,
                userType: this.roleType,
            };
            this.$api
                .getServiceExpired(params)
                .then((res) => {
                    let serviceValue = [];
                    const list = res.obj.map((item) => {
                        if (item.switchStatus == "1") {
                            item.switchStatus = true;
                            serviceValue.push(item.value + item.unit);
                        } else {
                            item.switchStatus = false;
                        }
                        return item;
                    });
                    this.serviceValue = serviceValue.join(",");
                    this.serviceList = list;
                })
                .catch((err) => {});
        },

        //切换角色
        onChangeRole(option) {
            this.$toast.loading("加载中…");
            this.orgPk = option.orgPk;
            this.rolePk = option.rolePk;
            this.roleType = option.type;
            this.getUserMsgInstall();
            this.getServiceExpired();
        },

        //提交
        onSubmit() {
            this.$toast.loading("加载中…");
            this.disabled = true;
            let list = [];
            this.msgList.forEach((item) => {
                if (item.type !== "1") {
                    let tmp = {
                        ...item,
                        switchStatus: item.switchStatus === true ? "1" : "0",
                        sysSource: this.$store.state.sysInfo.pk,
                    };
                    delete tmp.title;
                    list.push(tmp);
                }
            });

            let rules = {},
                data = {};
            list.forEach((item) => {
                //验证规则
                rules[item.msgPk + "value"] = {
                    type: "string",
                    required: true,
                    message: "请输入" + item.name,
                };
                //验证数据
                data[item.msgPk + "value"] = item.value;
            });
            const option = {
                rules: rules,
                data: data,
            };
            validator(option)
                .then(() => {
                    const serviceList = this.serviceList.map((item) => {
                        let tmp = {
                            ...item,
                            switchStatus:
                                item.switchStatus === true ? "1" : "0",
                        };
                        return tmp;
                    });
                    list = [...serviceList, ...list];
                    const params = {
                        orgPk: this.orgPk,
                        rolePk: this.rolePk,
                        userType: this.roleType,
                        installJson: JSON.stringify(list),
                    };
                    this.$api
                        .saveOrUpdateUserMsgInstall(params)
                        .then((res) => {
                            //如果是新增 需重新设置列表变为修改
                            if (res.obj.add && res.obj.add.length > 0) {
                                this.setMsgList(res.obj.add);
                            }
                            this.$toast.success("保存成功");
                            setTimeout(() => {
                                this.$router.replace("/user");
                            }, 1000);
                        })
                        .catch((err) => {
                            this.disabled = false;
                        });
                })
                .catch(() => {});
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
.num {
    width: 35px;
    height: 35px;
    font-size: 14px;
    color: #111111;
    text-align: center;
    background: #e6e6e6;
}
</style>
