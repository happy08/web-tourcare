<!--弹出层-->
<template>
    <div>
        <transition :name="transitionName"> 
            <div
                ref="popupBox"
                v-show="value"
                :style="style"
                :class="['cy-popup','pdb-safe-0',`cy-${position}`, { round }]"
            >
                <div class="cy-popup-inner">
                    <slot></slot>
                </div>
                <slot name="close">
                    <cy-icon
                        v-if="closeIcon"
                        @click.native="handleClose"
                        type="close2"
                        size="25"
                        :class="['cy-popup_close-icon',closeIconPosition]"
                    ></cy-icon>
                </slot>
            </div>
        </transition>
        <cy-overlay :style="styleOverlay" :show="value" @click.native="handleClose"></cy-overlay>
    </div>
</template>
<script>
import cyOverlay from "../overlay";
import cyIcon from "../icon";

export default {
    name: "cy-popup",
    components: {
        cyOverlay,
        cyIcon
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        position: {
            type: String,
            default: "bottom"
        },
        width: {
            type: String,
            default: "100%"
        },
        height: {
            type: String,
            default: "40%"
        },
        background: {
            type: String
        },
        round: Boolean,
        closeIcon: {
            type: Boolean,
            default: true
        },
        overlay: {
            type: [Boolean,String],
            default: true
        },
        clickOverlayClose: {
            type: Boolean,
            default: true
        },
        closeIconPosition: {
            type: String,
            default: "top-right"
        }
    },
    data() {
        return {
            transitionName: "cy-fade"
        };
    },
    created() {
        this.setPosition(this.position);
    },
    watch: {
        position(val) {
            this.setPosition(val);
        }
    },
    computed: {
        style() {
            return [
                {
                    width: this.width,
                    height: this.height,
                    background: this.background
                }
            ];
        },
        styleOverlay() {
            const overlay = this.overlay;
            return [
                {
                    [overlay == "hidden" ? "visibility" : "background"]: overlay
                }
            ];
        }
    },
    methods: {
        handleClose() {
            this.clickOverlayClose && this.$emit("input", false);
            this.$emit("onClose", false);
        },
        setPosition(position) {
            if (position === "center") {
                this.transitionName = "cy-fade";
            } else {
                switch (position) {
                    case "top":
                        position = "down";
                        break;
                    case "bottom":
                        position = "up";
                        break;
                }
                this.transitionName = `cy-slide-${position}`;
            }
        }
    }
};
</script>

<style lang="scss">
$cy-close-icon-margin: 12px;
$cy-border-radius: 10px;

.cy-popup {
    position: fixed;
    max-height: 100%;
    overflow-y: visible;
    background-color: #fff;
    transition: all 0.3s;
    -webkit-overflow-scrolling: touch;
    z-index: 2028;
    background-size: 100% 100% !important;
    &.cy-center {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -60%);
        &.round {
            border-radius: $cy-border-radius;
        }
    }
    &.cy-bottom {
        bottom: 0;
        left: 0;
        width: 100%;
        &.round {
            border-radius: $cy-border-radius $cy-border-radius 0 0;
        }
    }
    &.cy-right {
        top: 0;
        right: 0;
        &.round {
            border-radius: $cy-border-radius 0 0 $cy-border-radius;
        }
    }
    &.cy-left {
        top: 0;
        left: 0;
        &.round {
            border-radius: 0 $cy-border-radius $cy-border-radius 0;
        }
    }
    &.cy-top {
        top: 0;
        left: 0;
        width: 100%;
        &.round {
            border-radius: 0 0 $cy-border-radius $cy-border-radius;
        }
    }

    .cy-popup-inner {
        height: 100%;
        overflow-y: auto;
    }
    .cy-popup_close-icon {
        position: absolute;
        z-index: 1030;
        color: #969799;
        font-size: 18px;
        cursor: pointer;
        &:active {
            opacity: 0.7;
        }
        &.top-left {
            top: $cy-close-icon-margin;
            left: $cy-close-icon-margin;
        }
        &.top-right {
            top: $cy-close-icon-margin;
            right: $cy-close-icon-margin;
        }
        &.bottom-left {
            bottom: $cy-close-icon-margin;
            left: $cy-close-icon-margin;
        }
        &.bottom-right {
            right: $cy-close-icon-margin;
            bottom: $cy-close-icon-margin;
        }
        &.bottom-center {
            left: 50%;
            margin-left: -17px;
            bottom: -60px;
            width: 35px;
            height: 35px;
        }
    }
}
</style>