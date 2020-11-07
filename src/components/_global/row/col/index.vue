<template>
    <div class="cy-col" :class="classObj">
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "cy-col",
    props: {
        span: [String, Number],
        offset: {
            type: [String, Number],
            default: "0"
        }
    },
    data() {
        return {
            classObj: {}
        };
    },
    watch: {
        span: {
            handler(val) {
                if (val) {
                    this.classObj = Object.assign(this.classObj, {
                        ["cy-col-" + val]: this.span == val
                    });
                }
            },
            immediate: true
        },
        offset: {
            handler(val) {
                if (val) {
                    this.classObj = Object.assign(this.classObj, {
                        ["cy-col-offset-" + val]: this.offset == val
                    });
                }
            },
            immediate: true
        }
    },
    methods: {}
};
</script>

<style lang="scss">
.cy-col {
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    word-break: break-all;
}
.cy-col-offset-1 {
    margin-left: 4.16667%;
}
.cy-col-1 {
    flex: 0 0 4.16667%;
    max-width: 4.16667%;
}
.cy-col-offset-2 {
    margin-left: 8.33333%;
}
.cy-col-2 {
    flex: 0 0 8.33333%;
    max-width: 8.33333%;
}
.cy-col-offset-3 {
    margin-left: 12.5%;
}
.cy-col-3 {
    flex: 0 0 12.5%;
    max-width: 12.5%;
}
.cy-col-offset-4 {
    margin-left: 16.66667%;
}
.cy-col-4 {
    flex: 0 0 16.66667%;
    max-width: 16.66667%;
}
.cy-col-offset-5 {
    margin-left: 20%;
}
.cy-col-5 {
    flex: 0 0 20%;
    max-width: 20%;
}
.cy-col-offset-6 {
    margin-left: 25%;
}
.cy-col-6 {
    flex: 0 0 25%;
    max-width: 25%;
}
.cy-col-offset-8 {
    margin-left: 33.33333%;
}
.cy-col-8 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
}
.cy-col-offset-12 {
    margin-left: 50%;
}
.cy-col-12 {
    flex: 0 0 50%;
    max-width: 50%;
}
.cy-col-offset-24 {
    margin-left: 100%;
}
.cy-col-24 {
    flex: 0 0 100%;
    max-width: 100%;
}
</style>