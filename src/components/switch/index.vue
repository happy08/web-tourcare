<template>
    <div
        :class="['cy-switch',{'cy-switch-active':isActive},{'cy-switch-disabled':disabled}]"
        :style="{'font-size':size+'px' || ''}"
        @click="handleToggle"
    >
        <div class="cy-switch-btn"></div>
    </div>
</template>
<script>
export default {
    name: "cy-switch",
    props: {
        value: {
            type: [Boolean, Number],
            default: false
        },
        size: {
            type: String,
            default: ""
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isActive: false
        };
    },
    created() {
        this.isActive = this.value;
    },
    watch: {
        value(nVal, oVal) {
            this.isActive = nVal;
            this.$emit("onChange", this.isActive);
        }
    },
    methods: {
        handleToggle() {
            const status = this.isActive;
            if (!this.disabled) {
                if (!!this.$listeners["onBeforChange"]) {
                    this.$emit("onBeforChange", !status);
                } else {
                    this.isActive = !status;
                    this.$emit("input", this.isActive);
                    //this.$emit("onChange", this.isActive);
                }
            }
        }
    }
};
</script>
<style lang="scss">
/* Switch */
$switchBgColorActive: #4bd964;
$switchBgColor: #fafafa;
$switchFontSize: 24px;

.cy-switch {
    position: relative;
    display: inline-block;
    font-size: $switchFontSize;
    height: 1em;
    width: 2em;
    background: $switchBgColor;
    border-radius: 1000px;
    vertical-align: bottom;
    box-sizing: content-box;
    border: 1px solid rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
    .cy-switch-btn {
        position: absolute;
        left: 0;
        height: 1em;
        width: 1em;
        background: #ffffff;
        box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        box-sizing: border-box;
        transition: all 0.2s;
    }
    &.cy-switch-active {
        border-color: $switchBgColorActive;
        background: $switchBgColorActive;
        .cy-switch-btn {
            left: 1em;
        }
    }
    &.cy-switch-disabled {
        opacity: 0.6;
    }
}
</style>