<!--激活分享二维码-->
<template>
    <div>
        <div class="container pdtb-30 white tc">
            <div class="pdt-30 fs-26">邀请同事加入{{$store.state.sysInfo.name}}</div>
            <div class="pdt-5 fs-14">邀请同事/车主加入，赶紧去邀请吧！</div>
            <div class="head-bg"></div>
            <div class="qrcode">
                <div class="body-bg"></div>
                <cy-image v-if="qrCodeUrl" :src="qrCodeUrl"></cy-image>
            </div>
            <div class="pdt-5 fs-14">截图让同事扫码也可以加入 </div>
           
        </div>

    </div>
</template>

<script>
import wxx from "@/utils/wx";

export default {
    name: "equipment_share",
    components: {},
    data() {
        return {
            equipmentId: "",
            storeOrgPk: "",
            agentOrgPk: "",
            qrCodeUrl: "",
            showPoint: false
        };
    },
    created() {
        this.init();
    },
    computed: {},
    methods: {
        init() { 
            this.equipmentId = this.$route.query.equipmentId;
            this.storeOrgPk = this.$route.query.storeOrgPk;
            this.agentOrgPk = this.$route.query.agentOrgPk;
            this.getEquipmentInviteQRCode();

            const setWxConfig = () => {
                wx.hideOptionMenu(); //隐藏分享子按钮
            };
            //微信签名配置
            wxx.wxaccountConfig(setWxConfig);
        },

        //生成邀请同事二维码
        getEquipmentInviteQRCode() {
            this.$toast.loading("生成二维码…")
            //二维码参数
            const inviteContent = {
                userPk: this.$store.state.user.pk,
                equipmentId: this.equipmentId, //设备id
                sysSource: this.$store.state.sysInfo.pk
            };
            const params = {
                equipmentId: this.equipmentId, //设备id
                inviteContent: JSON.stringify(inviteContent),
                agentOrgPk: this.agentOrgPk, //代理商pk
                storeOrgPk: this.storeOrgPk //门店pk
            };
            this.$api
                .getEquipmentInviteQRCode(params)
                .then(res => {
                    this.qrCodeUrl = res.obj.qrCodeUrl;
                    this.$toast.clear();
                })
                .catch(err => {});
        },

        //邀请同事
        onShare() {
            this.showPoint = true;
        }
    }
};
</script>
<style lang="scss" scoped>
.container {
    position: relative;
    min-height: 100vh;
    background: #172e3b;
    background-size: 100%;
    z-index: 9;
}
.head-bg {
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -95px;
    z-index: -1;
    width: 190px;
    height: 200px;
    background: #183342;
}
.body-bg {
    position: absolute;
    top: 110px;
    left: 50%;
    margin-left: -150px;
    z-index: -1;
    width: 300px;
    height: 300px;
    background: #183342;
    transform: rotate(-45deg);
    &::before {
        content: "";
        position: absolute;
        top: 5%;
        left: 5%;
        width: 90%;
        height: 90%;
        background: #183647;
        transform: rotate(0deg);
    }
}
.qrcode {
    width: 190px;
    height: 190px;
    margin: 38px auto 15px auto;
    padding: 10px;
    background-image: linear-gradient(270deg, #4dd4f7 0%, #1c71fa 100%);
}
.point-box {
    height: 60%;
}
/deep/.cy-popup.cy-center {
    transform: translate(-50%, -50%);
}
</style>
