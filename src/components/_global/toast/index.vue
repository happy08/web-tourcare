<template>
    <transition name="cy-fade">
        <div
            :id="id"
            :class="['cy-toast','cy-toast-center',{'cy-toast-has-icon':icon},{'cy-toast-cover':cover}]"
            v-show="show"
        >
            <div class="cy-toast-inner" :style="{'background-color':bgColor}">
                <span class="cy-toast-icon-wrapper">
                    <cy-loading v-if="type==='loading'" size="35" />
                    <cy-icon v-else-if="type==='success'" type="check" color="#fff" size="45" />
                    <cy-icon v-else-if="type==='fail'" type="close1" color="#fff" size="45" />
                    <img v-else :class="['cy-toast-icon',type]" :src="icon" />
                </span>
                <span class="cy-toast-text" v-html="msg"></span>
            </div>
        </div>
    </transition>
</template>
<script>
import cyLoading from "../../loading";
import cyIcon from "../icon";

export default {
    name: "cy-toast",
    components: {
        cyLoading,
        cyIcon
    },
    props: {},
    data() {
        return {
            id: "",
            msg: "",
            show: false,
            duration: 2000,
            timer: null,
            type: "",
            icon: null,
            bgColor: "rgba(46, 46, 46, 0.7)",
            onClose: null,
            cover: false
        };
    },
    watch: {
        show(val) {
            if (val) {
                this.handleShow();
            }
        }
    },
    methods: {
        handleShow() {
            this.clearTimer();
            if (this.duration > 0) {
                this.timer = setTimeout(() => {
                    this.handleClose();
                }, this.duration);
            }
        },
        handleClose() {
            this.clearTimer();
            this.show = false;
            typeof this.onClose === "function" && this.onClose();
        },
        clearTimer() {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
        }
    }
};
</script>

<style lang="scss">
@import "../../../assets/css/variable";
.cy-toast {
    position: fixed;
    left: 0;
    width: 100%;
    text-align: center;
    pointer-events: none;
    z-index: 9999;
    &.cy-toast-cover {
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: auto;
        height: 100%;
    }
    .cy-toast-inner {
        position: relative;
        display: inline-block;
        font-size: $baseFontSize;
        max-width: 65%;
        min-width: 120px;
        text-align: center;
        line-height: 1.5;
        padding: 10px 30px;
        word-break: break-all;
        background: rgba(46, 46, 46, 0.8);
        border-radius: 7px;
        color: #fff;
    }
    &.cy-toast-has-icon {
        .cy-toast-inner {
            padding: 60px 25px 20px;
        }
        .cy-toast-icon-wrapper {
            position: absolute;
            left: 0;
            top: 10px;
            width: 100%;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .cy-toast-icon {
            display: inline-block;
            width: 40px;
            height: 40px;
            background-repeat: no-repeat;
            background-size: 100%;
        }
    }
    &.cy-toast-center {
        top: 50%;
        transform: translateY(-50%);
    }
}
</style>