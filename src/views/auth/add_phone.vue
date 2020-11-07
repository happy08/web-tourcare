<!--绑定手机号-->
<template>
    <div class="login bg-darkblue">
        <div class="pdt-20 tc">
            <cy-image
                :src="require('@/assets/img/car2_bg.png')"
                width="198px"
                height="229px"
            ></cy-image>
        </div>
        <div class="pdlr-20 mgb-30">
            <div class="pd-10 mgt-20 bg-blue round-5">
                <cy-field
                    theme="blue"
                    class="pdl-0 pdr-0"
                    v-model="form.phone"
                    labelIcon="shouji"
                    placeholder="手机号"
                ></cy-field>
                <cy-field
                    theme="blue"
                    class="pdl-0 pdr-0"
                    v-model="form.captcha"
                    type="captcha"
                    labelIcon="lock1"
                    maxlength="6"
                    placeholder="验证码"
                >
                    <count-down :orgPk="form.orgPk" :phone="form.phone"></count-down>
                </cy-field>
            </div>

            <div v-if="shareUserInfo" class="flex center mg-10 white fs-12">
                <cy-image :src="shareUserInfo.face" round width="20px" height="20px" class="mgr-5"></cy-image>
                <div
                    class="lh1"
                >{{shareUserInfo.nickName || shareUserInfo.name}}邀请您加入{{$store.state.sysInfo.name}}</div>
            </div>

            <div class="flex pdt-15 pdlr-40 fs-12 grey">
                 <span style="flex:0 0 70px">温馨提示：</span>  
                 <div>完善手机号，获得系统权限方可浏览首页，获得更多功能信息</div> 
            </div>

            <div class="mglr-40 mgt-40 mgb-10">
                <!-- :disabled="!disabled" -->
                <cy-btn
                    type="blue-gradient"
                    @click.native="addPhone"
                    round
                >绑定账号</cy-btn>
            </div>
            <div class="no-account tc white">如无账号，自动注册账号</div>
        </div>
    </div>
</template>

<script>
import countDown from "@/components/_custom/count_down";
import validator from "@/utils/validator";
import { isPhone } from "@/utils/isCheck";
import { coverPhone } from "@/utils/number";

export default {
    name: "add_phone",
    components: {
        countDown,
    },
    data() {
        return {
            orgPk: "",
            redirect_url: "",
            shareUserInfo: "",
            user: {},
            form: {
                phone: "",
                captcha: "",
                pk: "",
                orgPk: "",
                inviteLogPk: "",
            },
            rules: {
                phone: {
                    type: "string",
                    required: true,
                    message: "手机号输入有误",
                    validator: (rule, value) => isPhone(value),
                },
                captcha: [
                    {
                        type: "string",
                        required: true,
                        message: "验证码不能为空",
                    },
                    {
                        min: 6, //长度
                        max: 6, //长度
                        message: "验证码长度6位",
                    },
                ],
            },
        };
    },
    created() {
        this.form.orgPk = this.$route.query.orgPk || "";
        this.form.inviteLogPk = this.$route.query.inviteLogPk || ""; //激活设备后 邀请pk
        this.init();
    },
    computed: {
        // disabled() {
        //     return !!this.form.phone && !!this.form.captcha;
        // },
    },
    methods: {
        init() {
            this.user = this.$store.state.user;
            const url = this.$store.state.redirectUrl;
            this.redirect_url =
                url.indexOf("/add_phone") !== -1 ? "/" : url || "/";
            if (this.user && this.user.phone) {
                this.$router.replace({ path: this.redirect_url });
                return;
            }
            const sharePk = this.$route.query.sharePk;
            if (!!sharePk) {
                this.getShareInfo(sharePk);
            }
           this.$toast.clear();
            
        },

        //获取邀请人信息
        async getShareInfo(sharePk) {
            try {
                const params = {
                    pk: sharePk,
                };
                const res = await this.$api.getAccountsUser(params);
                if (!!res && !!res.obj) {
                    this.shareUserInfo = {
                        ...res.obj,
                        phone: coverPhone(res.obj.phone),
                    };
                }
            } catch (err) {}
        },

        //提交
        addPhone() {
            this.form = {
                ...this.form,
                pk: this.user.pk,
            };
            const option = {
                rules: this.rules,
                data: this.form,
            };
            validator(option).then(async () => {
                this.$toast.loading("加载中…");
                try {
                    const res = await this.$api.addPhone(this.form);
                    if (!!res && !!res.obj) {
                        this.$toast.success("绑定成功");
                        this.$store.commit("addPhone", res.obj.phone);
                        setTimeout(() => {
                            this.$router.replace({ path: this.redirect_url });
                            this.$toast.clear();
                        }, 1500);
                    }
                } catch (err) {
                    this.$toast.clear();
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.no-account {
    letter-spacing: 3px;
}
</style>
