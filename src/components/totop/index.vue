<template>
    <div :class="['cy-totop','mgb-safe-0',{'relative':relative,'cy-totop-none':!show}]" @click="onTotop">
        <slot>
            <div class="cy-totop-inner">
                <cy-icon type="placement1" color="#ffffff" size="38"></cy-icon>
            </div>
        </slot>
    </div>
</template>
<script>
export default {
    name: "cy-totop",
    components: {
    },
    props:{
        relative:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            show: false
        };
    },
    watch: {},
    mounted() {
        if(!this.relative){
            window.addEventListener("scroll", this.onScroll, true);
        }
    },
    methods: {
        onTotop() {
            this.toTop();
        },
        onScroll() {
            //获取滚动距顶部的距离
            let scrollTop =
                window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop;
            if (scrollTop > 600) {
                this.show = true;
            } else {
                this.show = false;
            }
        },
        toTop: (delay = 8) => {
            let timer = setInterval(() => {
                let scrollTop =
                    document.documentElement.scrollTop ||
                    document.body.scrollTop;
                let ispeed = Math.floor(-scrollTop / delay);
                document.documentElement.scrollTop = document.body.scrollTop =
                    scrollTop + ispeed;
                if (scrollTop === 0) {
                    clearInterval(timer);
                }
            }, delay);
        }
    },
    beforeDestroy() {
        window.removeEventListener("scroll", this.onScroll);
    }
};
</script>
<style lang="scss">

.cy-totop {
    position: fixed;
    bottom: 75px;
    right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width:38px;
    height:38px;
    border-radius: 50%;
    z-index: 780;
    transition: all .3s;
    transform: translateY(0px);
    &.cy-totop-none {
        transform: translateY(200px);
    }
    &.relative{
    position: absolute;
    bottom: 0px;
    right: 0px;
    transform: translateY(0px) !important;
}
}
</style>

