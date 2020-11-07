<template>
    <button
        class="cy-btn"
        :style="style"
        :class="classes"
        :disabled="disabled"
        @click="handleClick"
    >
        <cy-icon v-if="icon" :type="icon"></cy-icon>
        <slot>{{ text }}</slot>
    </button>
</template>

<script>
import cyIcon from "../icon";
export default {
    name: "cy-btn",
    components: {
        cyIcon
    },
    props: {
        type: {
            default: "blue"
        },
        disabled: Boolean,
        lg: Boolean,
        sm: Boolean,
        xs: Boolean,
        xxs: Boolean,
        icon: String,
        round: Boolean,
        angle: Boolean,
        plain: Boolean,
        inline: Boolean,
        block: Boolean,
        shadow: String,
        text: String,
        link: String,
        color: String,
        border: String,
        background: {
            type: [String, Array]
        }
    },
    methods: {
        handleClick() {
            this.link &&
                !this.disabled &&
                this.$utils.go(this.link, this.$router);
        }
    },
    computed: {
        isArray() {
            return Array.isArray(this.background);
        },
        isImg() {
            return this.background.indexOf("/") !== -1;
        },
        style() {
            let style = {};
            if (this.background) {
                if (this.isArray) {
                    style.background = `linear-gradient(${
                        this.background[2] == "vertical" ? "180" : "90"
                    }deg, ${this.background[0]}, ${this.background[1]})`;
                } else {
                    style[this.isImg ? "backgroundImage" : "background"] = this
                        .isImg
                        ? `url(${this.background})`
                        : this.background;
                }
            }
            if (this.shadow) {
                style["box-shadow"] = this.shadow;
            }
            if (this.color) {
                style["color"] = this.color;
            }
            return style;
        },
        classes() {
            return [
                {
                    "cy-btn-disabled": !this.plain && this.disabled,
                    "cy-btn-plain-disabled": this.plain && this.disabled,
                    "cy-btn-lg": this.lg,
                    "cy-btn-sm": this.sm,
                    "cy-btn-xs": this.xs,
                    "cy-btn-xxs": this.xxs,
                    "cy-btn-inline": this.inline,
                    "cy-btn-block": this.block,
                    "cy-btn-radius": this.round,
                    "cy-btn-angle": this.angle,
                    "cy-btn-no-border": this.background && !this.plain
                },
                !this.plain ? `cy-btn-${this.type}` : "",
                this.plain ? `cy-btn-plain-${this.type}` : ""
            ];
        }
    }
};
</script>

<style lang="scss">
@import "../../../assets/css/_mixin";
/* Button start */
$btnBorderRadius: 5px;
$btnFontColor: #ffffff;
$btnHeight: 44px;
$btnFontSize: 15px;

//lg类型 large
$btnLgFontSize: 16px;
$btnLgHeight: 50px;

//sm类型 small
$btnSmFontSize: 12px;
$btnSmHeight: 30px;

//xs类型 xsmall
$btnXxsFontSize: 12px;
$btnXxsHeight: 20px;

//xxs类型 xxsmall
$btnXsFontSize: 10px;
$btnXsHeight: 16px;

.cy-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 14px;
    padding-right: 14px;
    box-sizing: border-box;
    font-size: $btnFontSize;
    text-align: center;
    text-decoration: none;
    color: $btnFontColor;
    height: $btnHeight;
    line-height: 1;
    border-radius: $btnBorderRadius;
    background-size: 100% 100%;
    background-position: center;
    @include setTapColor();
    overflow: hidden;
}
button,
input {
    &.cy-btn {
        width: 100%;
        outline: 0;
        border-width: 1px;
        border-style: solid;
        -webkit-appearance: none;
        &:focus {
            outline: 0;
        }
    }
    &.cy-btn-inline,
    &.cy-btn-sm,
    &.cy-btn-xs,
    &.cy-btn-xxs {
        width: auto;
    }
    &.cy-btn-block {
        display: block;
        width: 100%;
    }
}

.cy-btn-inline {
    display: inline-block;
}

.cy-btn-radius {
    border-radius: 999px !important;
}
.cy-btn-angle {
    border-radius: 0px !important;
}
.cy-btn-lg {
    height: $btnLgHeight;
    line-height: 1;
    font-size: $btnLgFontSize;
}
.cy-btn-sm {
    display: inline-block;
    padding: 0 8px;
    height: $btnSmHeight;
    line-height: 1;
    font-size: $btnSmFontSize;
    border-radius: 3px;
    .cy-icon {
        width: 18px;
        height: 18px;
    }
}
.cy-btn-xs {
    display: inline-block;
    padding: 0px 4px;
    min-width: 22px;
    height: $btnXxsHeight;
    line-height: 1;
    font-size: $btnXxsFontSize;
    border-radius: 2px;
    .cy-icon {
        width: 15px;
        height: 15px;
    }
}
.cy-btn-xxs {
    display: inline-block;
    padding: 0 4px;
    min-width: 22px;
    height: $btnXsHeight;
    line-height: 1;
    font-size: $btnXsFontSize;
    border-radius: 2px;
    .cy-icon {
        width: 15px;
        height: 15px;
    }
}

.cy-btn.cy-btn-no-border {
    border: 0px solid rgba(0, 0, 0, 0);
}

.cy-btn-disabled,
.cy-btn-plain-disabled {
    cursor: not-allowed;
    background: #e9e9e9 !important;
    border: 1px solid rgba(0, 0, 0, 0) !important;
    color: #ffffff !important;
}

.cy-btn-blue-gradient {
    color: #ffffff;
    border-width: 0px !important;
    background: linear-gradient(90deg, #29d7a8, #3f8bfd) !important; 
    &.cy-btn-disabled {
        opacity: 0.8;
    }
}

@mixin setCyBtn($name: "blue", $background: #1989fa, $color: #1989fa) {
    .cy-btn-#{$name} {
        border-color: $background;
        background-color: $background;
    }
    .cy-btn-plain-#{$name} {
        color: $color;
        border-color: $background;
    }
}
//$name, $background, $color
@include setCyBtn("blue", #1989fa, #1989fa);
@include setCyBtn("green", #4fc08d, #4fc08d);
@include setCyBtn("yellow", #c6a568, #c6a568);
@include setCyBtn("red", #e64340, #e64340);
@include setCyBtn("grey", #bebebe, #5f5e5e);
@include setCyBtn("white", #ffffff, #ffffff);
</style>
