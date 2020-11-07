<!--订阅运营数据-->
<template>
    <div class="subscribe">
        <cy-cell title="全部" class="pdtb-15">
            <div slot="sub-title" class="fs-12">订阅所有数据</div>
            <cy-switch v-model="all" slot="desc"></cy-switch>
        </cy-cell>

        <!-- 列表 -->
        <cy-cell
            v-for="item in subscribeList"
            :key="item.pk"
            :title="item.name"
            :titleIcon="item.smallIcon"
            class="pdtb-15"
        >
            <cy-switch v-model="form[item.pk]" slot="desc"></cy-switch>
        </cy-cell>

        <!-- 订阅按钮 -->
        <div class="fixed-bt mgb-safe-50 pdlr-30 pdb-20">
            <cy-btn @click.native="onSubmit" :disabled="disabled" type="blue-gradient" round>订阅</cy-btn>
        </div>

        <!-- 切换角色 -->
        <change-role :data="roleList" @changeRole="onChangeRole"></change-role>
    </div>
</template>

<script>
import cySwitch from "@/components/switch";
import changeRole from "@/components/_custom/change_role"; //切换角色
import { roleList } from "@/service/config";

export default {
    name: "subscribe",
    components: {
        cySwitch,
        changeRole
    },
    data() {
        return {
            disabled: false,
            rolePk: "", //角色PK
            roleType: "", //角色类型
            roleList: [], //角色列表
            subscribeList: [], //订阅列表
            form: {}
        };
    },
    created() {
        this.getAccountsUserAndRole();
    },
    computed: {
        all: {
            get() {
                return Object.keys(this.form).every((item, index, array) => {
                    return this.form[item] === true;
                });
            },
            set(val) {
                for (let key in this.form) {
                    this.form[key] = val;
                }
            }
        }
    },
    watch: {
        //禁用订阅按钮
        // form: {
        //     handler(nVal, oVal) {
        //         const isDisabled = Object.keys(nVal).every(
        //             (item, index, array) => {
        //                 return nVal[item] === false;
        //             }
        //         );
        //         if (isDisabled) {
        //             this.disabled = true;
        //         } else {
        //             this.disabled = false;
        //         }
        //     },
        //     deep: true
        // }
    },
    methods: {
        //获取上次访问的角色信息，角色列表
        getAccountsUserAndRole() {
            this.$toast.loading("加载中…");
            const params = {
                pk: this.$store.state.user.pk
            };
            this.$api
                .getAccountsUserAndRole(params)
                .then(res => {
                    this.rolePk = res.obj.defaultRoleInfo.rolePk || this.$store.state.user.pk;
                    this.roleType = res.obj.defaultRoleInfo.type || 3; //3-普通车主
                    this.getSubscribeDataList();
                    //角色列表
                    this.roleList = this.sortKey(res.obj.roleList, "type");
                    this.$store.commit("setDefaultRole",res.obj.defaultRoleInfo)
                })
                .catch(err => {});
        },

        //获取订阅配置列表
        getSubscribeDataList() {
            const roleType = roleList[this.roleType];
            this.$api
                .getSubscribeDataList({
                    //type: '2'//roleType
                    [roleType]: "1"
                })
                .then(res => {
                    res.obj.forEach(item => {
                        this.$set(this.form, item.pk, false);
                    });

                    this.subscribeList = res.obj;
                    this.getSubscribeDataDetailList();
                })
                .catch(err => {});
        },

        //获取选中订阅配置列表
        getSubscribeDataDetailList() {
            this.$api
                .getSubscribeDataDetailList({
                    rolePk: this.rolePk,
                    type: this.roleType
                })
                .then(res => {
                    const curNavList = res.obj.map(item => {
                        return item.subscribePk;
                    });
                    for (let key in this.form) {
                        if (curNavList.includes(key)) {
                            this.form[key] = true;
                        }
                    }
                    this.$toast.clear();
                })
                .catch(err => {});
        },

        //切换角色
        onChangeRole(option) {
            this.rolePk = option.rolePk;
            this.roleType = option.type;
            this.getSubscribeDataList();
        },

        //提交
        onSubmit() {
            this.disabled = true;
            let subscribePks = [];
            for (let k in this.form) {
                if (this.form[k] === true) {
                    subscribePks.push(k);
                }
            }
            const form = {
                rolePk: this.rolePk,
                type: this.roleType,
                subscribePks: subscribePks.join(",")
            };
            this.$api
                .saveOrUpdateDataList(form)
                .then(res => {
                    this.$toast("订阅成功，即将跳转去查看运营数据");
                    setTimeout(() => {
                        this.$router.push("/mydata");
                    }, 1500);
                })
                .catch(err => {
                    this.disabled = false;
                })
        },

        //数组对象排序
        sortKey(array, key) {
            return array.sort(function(a, b) {
                return a[key] - b[key];
            });
        },

    }
};
</script>
<style lang="scss">
</style>
