<template>
    <div class="car-list">
        <car-header
            :brandName="brandName"
            :clazzName="clazzName"
            @change="changeCarHeader"
            v-if="showCarHeader"
        />
        <car-brand @change="changeCarBrand" v-if="showCarBrand" />
        <car-line :brandName="brandName" @change="changeCarLine" v-if="showCarLine" />
        <car-type
            :brandName="brandName"
            :clazzName="clazzName"
            @change="changeCarType"
            v-if="showCarType"
        />
    </div>
</template>

<script>
import carHeader from "./car_header";
import carBrand from "./car_brand";
import carLine from "./car_line";
import carType from "./car_type";

export default {
    name: "car_list",
    components: {
        carHeader,
        carBrand,
        carLine,
        carType
    },
    data() {
        return {
            brandName: "", //品牌名称
            clazzName: "", //车系
            year: "", //年份
            clazzType: "", //车型
            salesName: "", //销售名称
            showCarHeader: true,
            showCarBrand: true,
            showCarLine: false,
            showCarType: false
        };
    },
    created() {},
    computed: {},
    methods: {
        //头部
        changeCarHeader(step) {
            if (step === 1) {
                this.showCarLine = false;
                this.showCarType = false;
                this.showCarBrand = true;
                this.clazzName = ""
            }
            if (step === 2 && this.brandName != "") {
                this.showCarBrand = false;
                this.showCarType = false;
                this.showCarLine = true;
            }
        },

        //选中品牌
        changeCarBrand(val) {
            this.showCarBrand = false;
            this.showCarLine = true;
            this.brandName = val;
        },

        //选中车系
        changeCarLine(val) {
            this.showCarLine = false;
            this.showCarType = true;
            this.clazzName = val;
        },

        //选中车型
        changeCarType(year, type, salesName) {
            this.showCarHeader = false;
            this.showCarType = false;
            this.year = year; //年份
            this.clazzType = type; //车型
            this.salesName = salesName; //销售名称
            const carInfo = {
                brandName: this.brandName,
                clazzName: this.clazzName,
                year: this.year,
                clazzType: this.clazzType,
                salesName: this.salesName
            };
            this.$emit("change", carInfo);
        }
    }
};
</script>
<style lang="scss" scoped>
.car-list {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 20;
    background: #ededed;
}
</style>
