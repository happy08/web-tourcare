<!--申请体验-->
<template>
    <div class="bg-darkblue">
        <div class="transition ani-d-5" :class="showCar?'translateY':''">
            <div class="pdt-25 ls-5 tc white">
                <div class="experience-shadow">
                    <cy-image
                        :src="require('@/assets/img/experience/bg_home.png')"
                        width="330px"
                        height="285px"
                    ></cy-image>
                </div>
                <div class="pdt-30">{{$store.state.sysInfo.name}}项目体验</div>
            </div>

            <div class="pdlr-15">
                <div class="pd-10 mgt-20 bg-blue round-5">
                    <cy-field
                        theme="blue"
                        class="pdl-0 pdr-0"
                        v-model="form.carNo"
                        :required="true"
                        labelIcon="chepaihao"
                        maxlength="6"
                        placeholder="车牌号"
                        @click.native="onShowCar"
                    >
                        <template #input>
                            <span class="white">{{form.carNo}}</span>
                            <span v-show="showCar" class="cursor-blink"></span>
                            <span v-show="!form.carNo" class="lightgrey">请输入车牌号</span>
                        </template>
                    </cy-field>
                    <cy-field
                        theme="blue"
                        class="pdl-0 pdr-0"
                        v-model="form.userName"
                        labelIcon="nicheng"
                        maxlength="6"
                        placeholder="昵称"
                    ></cy-field>
                    <cy-field
                        theme="blue"
                        class="pdl-0 pdr-0"
                        v-model="form.phone"
                        labelIcon="shouji"
                        placeholder="手机"
                    ></cy-field>
                </div>

                <div class="mglr-30 mgt-40 mgb-15">
                    <cy-btn type="blue-gradient" @click.native="onSubmit" round>免费体验5分钟</cy-btn>
                </div>
                <div class="mgb-50 ls-5 tc white">(项目正常施工时长为15分钟)</div>
            </div>
        </div>

        <cy-keyboard-car v-model="form.carNo" :show.sync="showCar"></cy-keyboard-car>
    </div>
</template>

<script>
import cyKeyboardCar from "@/components/keyboard_car";
import validator from "@/utils/validator";
import { isPhone } from "@/utils/isCheck";
import { coverPhone } from "@/utils/number";
import scrollToView from "@/utils/scrollToView";

export default {
    name: "add_phone",
    components: {
        cyKeyboardCar,
    },
    data() {
        return {
            orgName: "", //门店名称
            showCar: false,
            form: {
                orgPk: "", //门店Pk
                carNo: "",
                userName: "",
                phone: "",
            },
            rules: {
                carNo: [
                    {
                        type: "string",
                        required: true,
                        message: "车牌号不能为空",
                    },
                    {
                        min: 7, //最小长度
                        max: 8, //最大长度
                        message: "请正确输入车牌号",
                        validator: (rule, value) => this.isCarNo(value),
                    },
                ],
            },
        };
    },
    created() {
        const orgPk = this.$route.query.orgPk; //门店pk
        this.orgName = this.$route.query.orgName; //门店名称
        document.title = "申请体验-" + this.orgName || "";
        if (!orgPk) {
            this.$router.go(-1);
        }
        this.form = {
            ...this.form,
            orgPk: orgPk,
            userName:
                this.$store.state.user.name ||
                this.$store.state.user.nickName ||
                "",
            phone: this.$store.state.user.phone || ""
        };
        this.getUserCarList();
    },
    computed: {},
    methods: {
        //获取车辆信息
        getUserCarList() {
            this.$api
                .getUserCarList()
                .then((res) => {
                    if (res.obj && res.obj.length > 0) {
                        const obj = res.obj[0];
                        this.form.carNo = obj.carNo;
                    }
                })
                .catch((err) => {});
        },

        //提交
        onSubmit() {
            const option = {
                rules: this.rules,
                data: this.form
            };
            validator(option).then(() => {
                this.$dialog({
                    title: `您只有一次申请体验机会，请确认在[${this.orgName}]门店体验`,
                    onConfirm:()=> {
                        this.$toast.loading("加载中…");
                        this.$api
                            .applyExperience(this.form)
                            .then((res) => {
                                this.$toast.success("申请成功");
                                setTimeout(() => {
                                    this.$toast.clear();
                                    this.$router.push("/user");
                                }, 1500);
                            })
                            .catch((err) => {});
                    },
                    onCancel() {},
                });
            });
        },

        onShowCar() {
            if (this.showCar === false) {
                this.showCar = true;
            }
        },

        //验证车牌号
        isCarNo(num) {
            var xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
            var creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
            if (num.length === 7) {
                return creg.test(num);
            } else if (num.length === 8) {
                return xreg.test(num);
            } else {
                return false;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.lightgrey {
    color: #999;
}
.transition {
    transition: 0.3s;
}
.translateY {
    transform: translateY(-150px);
}
.experience-shadow {
    position: relative;
    z-index: 1;
}
.experience-shadow:after {
    content: "";
    width: 40%;
    left: 30%;
    bottom: 10%;
    height: 0px;
    display: block;
    position: absolute;
    z-index: -1;
    box-shadow: 0px 0px 60px 30px #25487c;
}
.cursor-blink {
    width: 3px;
    height: 17px;
    border-radius: 2px;
    background-color: #166cee;
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
.ls-5 {
    letter-spacing: 5px;
}
</style>
