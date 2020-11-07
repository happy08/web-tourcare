<template>
    <div :class="['cy-image',{'cy-image-round':round}]" :style="{width: width,height: height}">
        <img v-if="lazy" v-lazy="src"  class="cy-image-img" :style="{'object-fit':fit}"/>
        <img v-else :src="src"  class="cy-image-img" :style="{'object-fit':fit}"/>
    </div>
</template>

<script>
export default {
    name: "cy-image",
    props: {
        src: {
            type: String
        },
        lazy: {
            type: Boolean,
            default: true
        },
        width: String,
        height: String,
        round: {
            type: Boolean,
            default: false
        },
        fit: {
            type: String,
            default: "cover"
        }
    },
    computed: {
    },
    methods: {}
};
</script>
<style lang="scss">
.cy-image {
    position: relative;
    width: 100%;
    height: 100%;
    display: inline-block;
    &.cy-image-round {
        overflow: hidden;
        border-radius: 50%;
        img {
            border-radius: inherit;
        }
    }
    .cy-image-img {
        display: block;
        width: 100%;
        height: 100%;
    }
}
</style>
