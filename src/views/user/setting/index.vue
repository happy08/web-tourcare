<!--设置-->
<template>
    <div class="setting">
        <cy-cell titleIcon="person" title="个人信息" link="/setting/user_info" />
        <cy-cell titleIcon="horn" title="消息提醒" link="/setting/message_remind" />
        <cy-cell titleIcon="label" title="订阅设置" link="/setting/subscribe" />
        <cy-cell titleIcon="weixin" title="微信解绑" link="javascript:;" @click.native="untiePhone" />
    </div>
</template>

<script>
import { mapState } from "vuex";
//import _storage from "@/utils/localStorage";

export default {
    name: "setting",
    components: {},
    data() {
        return {};
    },
    created() {},
    computed: {
        ...mapState({
            userPk: state => state.user.pk
        })
    },
    methods: {
        untiePhone() {
            this.$dialog({
                title: "您确定要解除绑定吗？",
                onConfirm: () => {
                    this.$toast.loading("加载中…");
                    const params = {
                        pk: this.userPk
                    };
                    this.$api
                        .untiePhone(params)
                        .then(res => {
                            const sysSource = this.$store.state.sysInfo.pk
                            this.$toast.success("解除绑定成功");
                            //_storage.remove("vuex");
                            this.$store.commit('setUser', "")
                            setTimeout(() => {
                                const url = window.location.href.split("#")[0];
                                window.location.href = `${url}#/auth?sysSource=${sysSource}`;
                            }, 1000);
                        })
                        .catch(err => {});
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
