<!--弹出确认框-->
<template>
    <div class="cy-dialog-wrapper" :id="id">
        <transition name="cy-zoom">
            <div class="cy-dialog-box" v-show="value">
                <div class="cy-dialog" @click.stop>
                    <div class="cy-dialog-body">
                        <span class="cy-dialog-title" v-html="title" v-if="title"></span>
                        <div v-if="$slots.default" class="cy-dialog-content">
                            <slot></slot>
                        </div>
                        <div v-else-if="content" class="cy-dialog-content" v-html="content"></div>
                    </div>
                    <div class="cy-dialog-footer">
                        <cy-btn
                            type="grey"
                            lg
                            plain
                            angle
                            class="cy-dialog-btn"
                            v-if="!noCancel"
                            @click.native="handleCancel"
                        >{{cancelTxt}}</cy-btn>
                        <cy-btn
                            lg
                            plain
                            angle
                            class="cy-dialog-btn"
                            v-if="!noConfirm"
                            :disabled="confirmDisabled"
                            @click.native="handleConfirm"
                        >{{confirmTxt}}</cy-btn>
                    </div>
                </div>
            </div>
        </transition>
        <cy-overlay :show="value"></cy-overlay>
    </div>
</template>
<script>
import cyOverlay from "../overlay";
import cyBtn from "../btn";

export default {
    name: "cy-dialog",
    components: {
        cyOverlay,
        cyBtn
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        id: {
            default: ""
        },
        title: {
            default: ""
        },
        content: {
            default: ""
        },
        noConfirm: {
            type: Boolean,
            default: false
        },
        noCancel: {
            type: Boolean,
            default: false
        },
        cancelTxt: {
            default: "取消"
        },
        confirmTxt: {
            default: "确定"
        },
        confirmDisabled: {
            type: Boolean,
            default: false
        },
        onConfirm: {
            type: Function,
            default: null
        },
        onCancel: {
            type: Function,
            default: null
        },
        onClose: {
            type: Function,
            default: null
        }
    },
    methods: {
        handleClose(target) {
            this.$emit("onClose", target);
            if (
                typeof this.onClose === "function" &&
                this.onClose(target) === false
            ) {
                return;
            }

            //this.$slots 是空对象 说明是以组件使用
            let slots = Object.keys(this.$slots);
            slots.length !== 0
                ? this.$emit("input", false)
                : (this.value = false);
        },
        handleConfirm() {
            this.$emit("onConfirm");
            if (typeof this.onConfirm === "function") {
                this.onConfirm.call(this);
            }
            this.handleClose("onConfirm");
        },
        handleCancel() {
            this.$emit("onCancel");
            if (typeof this.onCancel === "function") {
                if (this.onCancel.call(this) === false) return;
            }
            this.handleClose("onCancel");
        }
    }
};
</script>
<style lang="scss">
@import "../../../assets/css/_variable";
@import "../../../assets/css/_mixin";

.cy-dialog-wrapper {
    position: relative;
    z-index: 2040;
    .cy-dialog-box {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
        z-index: 2020;
        .cy-dialog {
            position: relative;
            width: 86%;
            max-height: 70vh;
            background: #fff;
            border-radius: 5px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            .cy-dialog-body {
                box-sizing: border-box;
                padding: 30px 20px 20px;
                display: flex;
                flex-direction: column;
                flex: 0 1 auto;
                .cy-dialog-title {
                    display: block;
                    line-height: 1.5;
                    color: #666;
                    font-size: 16px;
                    text-align: center;
                    flex-shrink: 0;
                    padding-bottom: 8px;
                }
                .cy-dialog-content {
                    flex: 1;
                    text-align: center;
                    justify-content: center;
                    overflow: auto;
                    font-size: $baseFontSize;
                    word-break: break-all;
                    padding-bottom: 10px;
                    -webkit-overflow-scrolling: touch;
                }
            }
            .cy-dialog-footer {
                position: relative;
                width: 100%;
                display: flex;
                flex-shrink: 0;
                border-radius: 0 0 5px 5px;
                overflow: hidden;
                flex-direction: row;
                &::before {
                    @include setTopLine(#e6e6e6);
                }
                .cy-dialog-btn:first-child {
                    &::before {
                        @include setRightLine(#e6e6e6);
                    }
                }
                .cy-dialog-btn {
                    border-width: 0px !important;
                }
            }
        }
    }
}
</style>