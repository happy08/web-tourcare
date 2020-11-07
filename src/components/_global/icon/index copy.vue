<template>
    <i :style="style" :class="['cy-icon','iconfont','icon'+type]"></i>
</template>

<script>
export default {
    name: "cy-icon",
    props: {
        type: String,
        size: {
            type: String,
            default: ""
        },
        color: {
            type: String,
            default: ""
        }
    },
    computed: {
        style() {
            return {
                fontSize: this.size,
                color: this.color
            };
        }
    },
    methods: {}
};
</script>
<style lang="scss">
@import url('//at.alicdn.com/t/font_1758901_4vktwwktrbt.css');
.cy-icon{
    font-size: 18px;
    line-height: 1;
}
</style>
