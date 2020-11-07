<template>
    <div class="cy-tab-wrap" :class="barPosition === 'top' ? 'cy-tab-bar-top' : ''">
        <div class="cy-tab-container">
            <div class="cy-tab" :class="[{ 'cy-scrollable':scrollable }]" ref="nav">
                <slot></slot>
                <div class="cy-tab-ink-bar" :class="barClass" :style="barStyle">
                    <span class="cy-tab-bar-inner" :style="innerBarStyle" v-if="barWidth"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { parentMixin } from "./tab-mixin";

export default {
    name: "cy-tab",
    mixins: [parentMixin],
    props: {
        value: {
            type: [Number, String],
            default: 0
        },
        activeColor: String,
        barActiveColor: [String, Array],
        defaultColor: String,
        disabledColor: String,
        barWidth: String,
        barHeight: {
            type: [Number, String],
            default: 2
        },
        preventDefault: Boolean,
        noScrollNum: {
            type: Number,
            default: 4
        },
        barPosition: {
            type: String,
            default: "bottom",
            validator(val) {
                return ["bottom", "top"].indexOf(val) !== -1;
            }
        }
    },
    data() {
        return {
            direction: "forward",
            right: "100%",
            hasReady: false
        };
    },
    mounted() {
        this.$nextTick(() => {
            setTimeout(() => {
                this.hasReady = true;
                if (this.value >= 0) {
                    this.currentIndex = this.value;
                }
            }, 0);
        });
    },
    computed: {
        barLeft() {
            if (this.hasReady) {
                const nav = this.$refs.nav;
                const count = this.scrollable
                    ? nav.offsetWidth /
                      this.$children[
                          this.currentIndex || 0
                      ].$el.getBoundingClientRect().width
                    : this.childrenNumber;
                return `${this.currentIndex * (100 / count)}%`;
            }
        },
        barRight() {
            if (this.hasReady) {
                const nav = this.$refs.nav;
                const count = this.scrollable
                    ? nav.offsetWidth /
                      this.$children[
                          this.currentIndex || 0
                      ].$el.getBoundingClientRect().width
                    : this.childrenNumber;
                return `${(count - this.currentIndex - 1) * (100 / count)}%`;
            }
        },

        innerBarStyle() {
            const barArr = Array.isArray(this.barActiveColor);
            const barBackground = barArr
                ? `linear-gradient(90deg, ${this.barActiveColor[0]}, ${this.barActiveColor[1]})`
                : this.barActiveColor;
            return {
                width: this.barWidth,
                background: barBackground || this.activeColor
            };
        },

        barStyle() {
            const commonStyle = {
                left: this.barLeft,
                right: this.barRight,
                display: "block",
                height: this.barHeight + "px",
                transition: !this.hasReady ? "none" : null
            };
            if (!this.barWidth) {
                const barArr = Array.isArray(this.barActiveColor);
                const barBackground = barArr
                    ? `linear-gradient(90deg, ${this.barActiveColor[0]}, ${this.barActiveColor[1]})`
                    : this.barActiveColor;
                commonStyle.background = barBackground || this.activeColor;
            } else {
                commonStyle.background = "transparent"; // when=prop:custom-bar-width
            }
            return commonStyle;
        },
        barClass() {
            return {
                "cy-tab-ink-bar-transition-forward":
                    this.direction === "forward",
                "cy-tab-ink-bar-transition-backward":
                    this.direction === "backward"
            };
        },
        scrollable() {
            return this.childrenNumber > this.noScrollNum;
        }
    },
    watch: {
        currentIndex(newIndex, oldIndex) {
            this.direction = newIndex > oldIndex ? "forward" : "backward";
            //this.$emit("onIndexChange", newIndex, oldIndex);
            this.hasReady && this.scrollToActiveTab();
        }
    },
    methods: {
        scrollToActiveTab() {
            if (!this.scrollable || !this.$children || !this.$children.length) {
                return;
            }
            const currentIndexTab = this.$children[this.currentIndex].$el;
            let count = 0;
            // scroll
            const step = () => {
                const scrollDuration = 15;
                const nav = this.$refs.nav;
                nav.scrollLeft +=
                    (currentIndexTab.offsetLeft -
                        (nav.offsetWidth - currentIndexTab.offsetWidth) / 2 -
                        nav.scrollLeft) /
                    scrollDuration;
                if (++count < scrollDuration) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
    }
};
</script>


<style lang="scss">
@import "../../assets/css/_variable";

.cy-tab {
    display: flex;
    align-items: center;
    background-color: #fff;
    min-height: 44px;
    position: relative;
    .cy-tab-item {
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
        flex: 1;
        width: 100%;
        height: 100%;
        line-height: 1;
        box-sizing: border-box;
        font-size: 14px;
        text-align: center;
        color: #333;
    }
    .cy-tab-item.cy-tab-selected {
        position: relative;
        color: #0078d4;
    }
    .cy-tab-ink-bar {
        position: absolute;
        height: 2px;
        bottom: 0;
        left: 0;
        background-color: $baseFontColor;
        text-align: center;
        &.cy-tab-ink-bar-transition-forward {
            transition: right 0.3s cubic-bezier(0.35, 0, 0.25, 1),
                left 0.3s cubic-bezier(0.35, 0, 0.25, 1) 0.3s * 0.3;
        }
        &.cy-tab-ink-bar-transition-backward {
            transition: right 0.3s cubic-bezier(0.35, 0, 0.25, 1) 0.3s * 0.3,
                left 0.3s cubic-bezier(0.35, 0, 0.25, 1);
        }
    }
}

.cy-tab-bar-top .cy-tab {
    &-ink-bar {
        top: 0;
    }
}

.cy-tab .cy-tab-item.cy-tab-disabled {
    color: #666;
}

/** when=prop:custom-bar-width **/
.cy-tab-bar-inner {
    display: block;
    margin: auto;
    height: 100%;
    border-radius: 10px;
    background-color: $baseFontColor;
    transition: width 0.3s cubic-bezier(0.35, 0, 0.25, 1);
}

.cy-tab-wrap {
    position: relative;
    padding-top: 44px;
}

.cy-tab-container {
    top: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    position: absolute;
}

.cy-scrollable {
    overflow-y: hidden;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 0px;
    box-sizing: content-box;
    &::-webkit-scrollbar {
        display: none;
    }
    .cy-tab-ink-bar {
        bottom: 0px;
        position: absolute;
    }
    .cy-tab-item {
        flex: 0 0 22%;
    }
}
</style>
