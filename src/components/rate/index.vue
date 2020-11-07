<template>
    <div class="cy-rate">
        <cy-icon
            class="cy-rate-item"
            v-for="n in total"
            :key="n"
            type="star1"
            :size="size"
            :color="n<=current?colorArr[current-1]:'#ccc'"
            @click.native="onClick($event,n)"
        ></cy-icon>
    </div>
</template>
<script>
export default {
    name: "cy-rate",
    props: {
        total: {
            type: [String, Number],
            default: 5
        },
        value: {
            type: [String, Number],
            default: 5
        },
        size: {
            type: [String, Number],
            default: 12
        },
        readOnly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            current: 0,
            colorArr:["#FEE0CC","#FDC199","#FCA266","#FB8333","#FA6400"] //不同星级不同颜色
        };
    },
    created() {
        
    },
    watch: {
        value: {
             handler(nVal, oVal) {
                this.current = nVal
            },
            immediate: true 
        }
    },
    methods: {
        onClick($event, idx) {
            if (this.readOnly) {
                this.$emit("input", this.current);
                this.$emit("click", this.current);
            } else {
                this.current = idx;
                this.$emit("input", idx);
                this.$emit("click", idx);
            }
        }
    }
};
</script>
<style lang="scss">
.cy-rate {
    display: flex;
    align-items: center;
    .cy-rate-item {
        display: inline-block;
        margin-right: 5px;
        &:last-child {
            margin-right: 0;
        }
    }
}
</style>