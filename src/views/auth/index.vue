<template>
    <div class="pd-30 tc grey">加载中…</div>
</template>

<script>
import wxAuth from "@/utils/wxAuth";
import { config } from "@/service/config";

export default {
    name: "auth",
    components: {},
    data() {
        return {};
    },
    created() {
        if (this.$store.state.user) {
            const redirect_url = this.$store.state.redirectUrl;
            this.$router.replace({ path: redirect_url || "/share_money" });
            this.$toast.clear();
            return;
        }
        this.init();
    },
    computed: {},
    methods: {
        async init() {
            //this.$toast.loading("加载中…");
            const code = this.$utils.getUrlParams("code"); //this.$route.query.code;
            if (!code) {
                document.title = "微信授权";
                const redirect_uri =
                    config.DOMAIN_WEB + config.DOMAIN_PATH + "/JINHAO/auth"; //`http://coupon.mynatapp.cc/${config.DOMAIN_PATH}`; //JINHAO=#
                wxAuth.auth(redirect_uri);
            } else {
                document.title = "加载中…";

                //登录   用户点击了授权
                await this.$store.dispatch("getUser", code);

                //跳转
                const redirect_url = this.$store.state.redirectUrl;
                //redirect_url && this.$store.commit('setRedirectUrl', "");
                this.$router.replace({ path: redirect_url || "/" });
                
            }
        }
    }
};
</script>
