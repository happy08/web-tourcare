<template>
    <div class="cy-radiogroup">
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "cy-radiogroup",
    props: {
        value: {
            type: [String, Number, Boolean],
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    }
};
</script>
<style lang="scss">
.cy-radiogroup {
    display: flex;
}
</style>