<!--车辆信息-->
<template>
    <div class="car-info bg-grey">
        <cy-field
            label="车牌号"
            v-model="form.carNo"
            labelIcon="write"
            :clearIcon="false"
            @click.native="showCar=true"
            labelWidth="60px"
        >
            <template #input>
                {{form.carNo}}
                <span v-show="showCar" class="cursor-blink"></span>
                <span v-show="!form.carNo" class="grey">请输入车牌号</span>
            </template>
            <template #default>
                <cy-icon type="youjiantou" size="13" color="#BFBFBF"></cy-icon>
            </template>
        </cy-field>
        <!-- <div class="pdlr-20 pdtb-5 fs-12">车辆型号</div> -->
        <cy-field label="车型" labelIcon="papers" labelWidth="60px">
            <template #input>
                <div class="flex between vcenter w100">
                    <div @click="showCarList=true" class="w100">
                        <span v-if="!isCarEmpty" class="lightgrey">请选择车型</span>
                        <span v-else>{{carInfo}}</span>
                    </div>
                    <span @click="onScanVin" class="mgl-15">
                        <cy-icon type="scan" size="25" color="#BFBFBF"></cy-icon>
                    </span>
                </div>
            </template>
            <template #default>
                <cy-icon type="youjiantou" size="13" color="#BFBFBF"></cy-icon>
            </template>
        </cy-field>
        <div class="pdlr-30 pd-20">
            <cy-btn @click.native="onSubmit" type="blue-gradient" round>保存</cy-btn>
        </div>

        <cy-keyboard-car v-model="form.carNo" :show.sync="showCar"></cy-keyboard-car>

        <car-list @change="changeCarInfo" v-if="showCarList"></car-list>
    </div>
</template>

<script>
import cyKeyboardCar from "@/components/keyboard_car";
import carList from "../car_list";
import scanVin from "@/utils/scanVin";
import validator from "@/utils/validator";

export default {
    name: "car_info",
    components: {
        cyKeyboardCar,
        carList,
    },
    data() {
        return {
            showCar: false,
            showCarList: false,
            carInfo: "",
            form: {
                carNo: "",
                pk: "", //修改为必填
                year: "", //年份
                clazzType: "", //车系
                //clazzPk: "", //车系主键
                clazzName: "", //车系名称
                brandName: "", //品牌名称
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
                        validator: (rule, value) => this.isCarNo(value), //regular.length
                    },
                ],
            },
        };
    },
    created() {
        this.getUserCarList();
    },
    computed: {
        isCarEmpty() {
            return this.carInfo.replace(/(^\s*)|(\s*$)/g, "");
        },
    },
    methods: {
        //获取车辆信息
        getUserCarList() {
            //this.$toast.loading("加载中…");
            this.$api.getUserCarList().then((res) => {
                if (res.obj.length > 0) {
                    const obj = res.obj[0];
                    this.carInfo = `${obj.brandName} ${obj.clazzName} ${obj.year} ${obj.clazzType}  ${obj.salesName}`;
                    this.form = {
                        pk: obj.pk,
                        carNo: obj.carNo,
                        year: obj.year, //年份
                        clazzType: obj.clazzType, //车系
                        clazzName: obj.clazzName, //车系名称
                        brandName: obj.brandName, //品牌名称
                        salesName: obj.salesName, //
                    };
                }
                this.$toast.clear();
            });
        },

        //识别
        async onScanVin() {
            // wx.chooseImage({
            //     count: 1, // 默认9
            //     sizeType: ["compressed"], //"original",  可以指定是原图还是压缩图，默认二者都有
            //     sourceType: ["album","camera"], //"album",  可以指定来源是相册还是相机，默认二者都有
            //     success: (res) => {
            //         this.src=res.localIds
            //         console.log('res',res);
            //         //alert(res.localIds) // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            //     },
            // });

            try {
                const vinCode = await scanVin();
                if (!!vinCode) {
                    this.queryCadDataByVinCode(vinCode);
                } else {
                    this.$toast("识别失败");
                }
            } catch (err) {}
        },

        // VIN码查询车型列表
        queryCadDataByVinCode(vinCode) {
            const params = {
                vinCode,
                checkTimes: "true",
            };
            this.$api
                .queryCadDataByVinCode(params)
                .then((res) => {
                    const obj = res.obj[0];
                    this.carInfo = `${obj.brandName} ${obj.clazzName} ${obj.year} ${obj.type}  ${obj.salesName}`;
                    this.form = {
                        ...this.form,
                        year: obj.year, //年份
                        clazzType: obj.type, //车系
                        clazzName: obj.clazzName, //车系名称
                        brandName: obj.brandName, //品牌名称
                        salesName: obj.salesName, //
                    };
                })
                .catch(() => {
                    this.$toast("查询车型失败，请核对VIN码是否正确");
                });
        },

        //提交
        onSubmit() {
            const option = {
                rules: this.rules,
                data: this.form,
            };
            validator(option)
                .then(() => {
                    this.$toast.loading("加载中…");
                    this.$api
                        .addOrUpdateUserCar(this.form)
                        .then((res) => {
                            this.form.pk = res.obj.pk;
                            this.$toast.success("保存成功");
                            setTimeout(() => {
                                this.$router.replace("/user");
                            }, 1500);
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },

        //选择车型
        changeCarInfo(car) {
            this.carInfo = `${car.brandName} ${car.clazzName} ${car.year} ${car.clazzType}  ${car.salesName}`;
            this.form = {
                ...this.form,
                ...car,
            };
            this.showCarList = false;
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
.cursor-blink {
    width: 1px;
    height: 15px;
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
</style>
