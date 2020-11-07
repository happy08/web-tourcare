<template>
    <div>
        <!--自购省钱弹窗-->
        <cy-popup
            v-model="showBuy"
            :class="['share-buy-popup', {'bottom':showCarNo}]"
            :closeIcon="false"
            width="100%"
            height="auto"
            round
            @onClose="onClose"
        >
            <cy-cell class="mgt-10">
                <div class="fs-18 red bold">
                    抢购价格¥{{info.price}}
                    <span class="pdl-10 cost-price">原价¥{{info.costPrice}}</span>
                </div>
            </cy-cell>

            <cy-field v-model="form.name" disabled placeholder="请输入姓名呢称" :clearIcon="false">
                <template #label>
                    呢称
                    <span class="pdl-5 red">*</span>
                </template>
            </cy-field>

            <cy-field
                v-model="form.phone"
                pattern="[0-9]*"
                :maxLen="11"
                placeholder="请输入手机号"
                :clearIcon="false"
            >
                <template #label>联系手机</template>
            </cy-field>

            <cy-field
                v-model="form.carNo"
                @click.native="showCarNo=true"
                :maxLen="11"
                label="车牌号码"
                :clearIcon="false"
            >
                <template #input>
                    <div class="flex vcenter hend w100">
                        {{form.carNo}}
                        <span v-show="!form.carNo" class="lightgrey iblock">请输入车牌号码</span>
                        <span v-show="showCarNo" class="cursor-blink iblock"></span>
                    </div>
                </template>
            </cy-field>

            <cy-field label="数量" placeholder="请输入" :clearIcon="false">
                <template #input>
                    <div class="buy-stepper flex hend w100">
                        <cy-stepper v-model="form.purchaseQuantity" :min="1"></cy-stepper>
                    </div>
                </template>
            </cy-field>
            <div v-if="orderList.length>0" class="mg-15">
                <div class="fs-15">{{orderList.length}}名车主已抢购</div>
                <div class="mgt-10 flex">
                    <cy-image
                        v-for="(item,index) in orderList"
                        :key="index"
                        :src="item.face"
                        width="0.8rem"
                        height="0.8rem"
                        round
                        :class="{'mgr-15':index!='7'}"
                    ></cy-image>
                </div>
            </div>

            <div class="mg-15 pdb-safe-0">
                <cy-btn type="blue-gradient" @click.native="onSubmit" round lg>立即抢购({{info.price}}元)</cy-btn>
            </div>
        </cy-popup>

        <!-- 车牌键盘 -->
        <cy-keyboard-car class="keyboard-car-popup" v-model="form.carNo" :show.sync="showCarNo"></cy-keyboard-car>

        <!--弹窗关注二维码-->
        <cy-popup
            v-model="showFollow"
            position="center"
            round
            :closeIcon="false"
            :clickOverlayClose="false"
            width="70%"
            height="auto"
        >
            <div class="pd-10">
                <cy-image :src="require('@/assets/img/followQRCode.jpg')" :lazy="false"></cy-image>
                <div class="mgb-10 tc grey lh1">长 按 二 维 码 识 别 关 注</div>
                <div class="mgb-10 tc grey lh1">点击个人中心查看订单</div>
            </div>
        </cy-popup>
    </div>
</template>
<script>
import cyKeyboardCar from "@/components/keyboard_car";
import cyStepper from "@/components/stepper";
import { isPhone } from "@/utils/isCheck";
import validator from "@/utils/validator";
import wxx from "@/utils/wx";

export default {
    components: {
        cyKeyboardCar,
        cyStepper,
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        info: {},
    },

    data() {
        return {
            showFollow: false, //关注二维码弹窗
            showBuy: false, //自购省钱弹窗
            form: {
                carNo: "", //车牌号
                name:
                    this.$store.state.user.name ||
                    this.$store.state.user.nickName ||
                    this.$store.state.user.phone, //姓名
                phone: this.$store.state.user.phone, //手机号
                purchaseQuantity: 1, //采购数量，默认为1
                shareUserPk: "", //分享人pk
                applyPk: "", //申请体验记录pk
                orgPk: "", //厂商pk
                projectPk: "", //项目pk
                x: "", //经度
                y: "", //纬度
                address: "", //地址
            },
            rules: {
                name: [
                    {
                        type: "string",
                        required: true,
                        message: "请输入昵称",
                    },
                    // {
                    //     min: 5, //最小长度
                    //     max: 10, //最大长度
                    //     message: "姓名5到10个字符"
                    // }
                ],
                phone: {
                    type: "string",
                    message: "请正确输入手机号",
                    validator: (rule, value) => {
                        if (value !== "") {
                            return isPhone(value);
                        } else {
                            return true;
                        }
                    },
                },
                purchaseQuantity: {
                    type: "string",
                    message: "数量必须大于0",
                    validator: (rule, value) => +value > 0,
                },
            },
            showCarNo: false, //车牌键盘
            orderList:[] //购买订单的用户列表
        };
    },
    watch: {
        show(nVal, oVal) {
            this.showBuy = nVal;
            if (nVal === true && this.form.carNo === "") {
                //申请体验记录pk 是从体验中心跳过来的
                if (!!this.form.applyPk) {
                    this.getApplyExperienceInfo();
                } else {
                    this.getUserCarList();
                }
            }
        },
        info: {
            handler(nVal, oVal) {
                this.form = {
                    ...this.form,
                    applyPk: nVal.applyPk,
                    orgPk: nVal.orgPk, //厂商pk
                    projectPk: nVal.projectPk, //项目pk
                    shareUserPk: nVal.shareUserPk, //分享人pk
                    x: nVal.x, //经度
                    y: nVal.y, //纬度
                    address: nVal.address, //地址
                };
                if(nVal.orderList){
                    this.orderList = nVal.orderList.slice(0,8)
                }
            },
            deep: true,
        },
    },
    created() {},
    methods: {
        //申请体验详情
        getApplyExperienceInfo() {
            const params = {
                applyPk: this.form.applyPk,
            };
            this.$api
                .getApplyExperienceInfo(params)
                .then((res) => {
                    this.form.carNo = res.obj.carNo; //申请体验的车牌号
                })
                .catch((err) => {});
        },

        //获取车辆信息
        getUserCarList() {
            this.$api.getUserCarList().then((res) => {
                if (res.obj.length > 0) {
                    this.form.carNo = res.obj[0].carNo;
                }
            });
        },

        //提交 自购省钱
        onSubmit() {
            this.$toast.loading("支付中…");
            let option = {
                rules: this.rules,
                data: this.form,
            };
            validator(option)
                .then(() => {
                    this.onClose();
                    this.buyProject();
                })
                .catch((err) => {});
        },

        //购买
        async buyProject() {
            try {
                const res = await this.$api.buyProject(this.form);
                if (!!res && !!res.obj) {
                    if (res.obj.payType !== "-1") {
                        //=-1 0元购
                        this.chooseWXPay(res.obj.payData);
                        this.$toast.clear();
                    } else {
                        this.$toast.success("抢购成功");
                        //修改购买次数
                        this.changeBuyStatus();
                    }
                }
            } catch (err) {}
        },

        // 微信支付
        chooseWXPay(option) {
            const chooseWXPay = () => {
                wx.chooseWXPay({
                    timestamp: option.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: option.nonceStr, // 支付签名随机串，不长于 32 位
                    package: option.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                    signType: option.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: option.paySign, // 支付签名
                    success: (res) => {
                        this.$toast.success("支付成功");
                        //修改购买次数
                        this.changeBuyStatus();
                    },
                    fail: (err) => {
                        this.$toast("支付失败");
                    },
                    cancel: (err) => {
                        this.$toast("取消支付");
                    },
                });
            };
            //微信签名配置
            wxx.wxaccountConfig(chooseWXPay);
        },

        //修改购买次数
        changeBuyStatus() {
            this.$emit("change", "buyStatus", async (res) => {
                try {
                    const isAttention = await this.getAccountsUser();
                    //未关注公众号
                    if (isAttention === "0") {
                        this.showFollow = true;
                    } else {
                        //已关注
                        setTimeout(() => {
                            this.$router.push({
                                path: "/orders?curTabIndex=1",
                            });
                        }, 1000);
                    }
                } catch (error) {
                    this.onClose();
                    this.showFollow = true;
                }
            });
        },

        //获取用户是否关注公众号
        getAccountsUser() {
            return new Promise((resolve, reject) => {
                const params = {
                    pk: this.$store.state.user.pk,
                };
                this.$api
                    .getAccountsUser(params)
                    .then((res) => {
                        const isAttention = res.obj.isAttention; //是否关注公众号:0-否 , 1-是
                        resolve(isAttention);
                    })
                    .catch((err) => {
                        reject();
                    });
            });
        },

        //关闭
        onClose() {
            this.showBuy = false;
            this.$emit("update:show", false);
        },
    },
};
</script>
<style lang="scss" scoped>
.share-buy-popup {
    position: relative;
    z-index: 2050;
    .cost-price {
        text-decoration: line-through;
        font-weight:normal;
    }
    .buy-stepper {
        position: absolute;
        right: 0;
        width: 150px;
        height: 40px;
    }
    &.bottom {
        /deep/.cy-popup {
            padding-bottom: 120px !important;
        }
    }
    /deep/.cy-popup {
        transition: padding 0.5s;
    }
    /deep/.cy-field .cy-field-inner .cy-field-input {
        color: #000;
        text-align: right;
        &[disabled] {
            color: #000;
            opacity: 1;
            -webkit-text-fill-color: #000;
        }
    }
}
.cursor-blink {
    width: 1px;
    height: 18px;
    background-color: #333;
    animation: cursor-blink 1s infinite steps(1, start);
}
@keyframes cursor-blink {
    0%,
    100% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
}
.keyboard-car-popup {
    position: relative;
    z-index: 2060;
}
</style>