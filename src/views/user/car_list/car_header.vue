<template>
    
        <div class="car-menu">
            <div :class="['car-menu-item','active']" @click="linkTo(1)">
                <span>{{brandName ? brandName : '品牌'}}</span>
            </div>
            <div :class="['car-menu-item',{'active':clazzName}]" @click="linkTo(2)">
                <span>{{clazzName ? clazzName : '车系'}}</span>
            </div>
            <div class="car-menu-item">
                <span>车型</span>
            </div>
        </div>
   
</template>

<script>
export default {
    name: "car_header",
    components: {},
    props: {
        brandName: {
            type: String
        },
        clazzName: {
            type: String
        }
    },
    data() {
        return {};
    },
    created() {},
    computed: {
    },
    methods: {
        linkTo(step) {
            this.$emit("change",step)

            // this.brandName &&
            //     this.$router.push({
            //         path: "/car_list/car_line",
            //         query: { brandName: this.brandName }
            //     });
        }
    },
    
};
</script>
<style lang="scss" scoped>

.car-menu {
    position: fixed;
    width: 100%;
    top: 0;
    display: flex;
    width: 100%;
    overflow: hidden;
    z-index: 99;
    .car-menu-item {
        position: relative;
        flex: 1;
        height: 33px;
        line-height: 33px;
        padding-left: 25px;
        background-color: #dceefa;
        color: #999999;
        &::after {
            position: absolute;
            right: -10px;
            top: -1px;
            display: block;
            width: 36px;
            height: 36px;
            border-top: 12px solid #fff;
            border-right: 12px solid #fff;
            content: "";
            z-index: 200;
            transform: rotate(45deg);
        }
        &:last-child::after {
            border: none;
        }
        &.active {
            background: #0f7abf;
            color: #fff;
        }
    }
}
</style>
