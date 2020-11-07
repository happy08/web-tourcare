<template>
    <div class="cy-popup-header">
        <div class="cy-popup-header-left" @click="$emit('onCancel')">
            <slot name="cancelText">{{ cancelText }}</slot>
        </div>
        <div class="cy-popup-header-title">
            <slot name="title">{{ title }}</slot>
        </div>
        <div class="cy-popup-header-right" @click="$emit('onConfirm')">
            <slot name="confirmText">{{ confirmText }}</slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "cy-popup-header",
    props: {
        cancelText: String,
        confirmText: String,
        title: String
    }
};
</script>

<style lang="scss">
@import "../../assets/css/_mixin";

.cy-popup-header {
    position: relative;
    display: flex;
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    background-color: #fff;
    &::after {
        @include setBottomLine(#ebedf0);
    }
    .cy-popup-header-title {
        flex: 1;
        text-align: center;
    }
    .cy-popup-header-left {
        padding: 0 15px;
        color: #333;
    }
    .cy-popup-header-right {
        padding: 0 15px;
        color: #1C71FA;
    }
}
</style>
