
<template>
    <div class="cy-row">
        <div class="cy-row-flex" :class="classObj" :style="style">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: "cy-row",
    props: {
        gutter: {
            type: [String, Number],
            default: ""
        },
        tag: {
            type: String,
            default: "div"
        },
        justify: {
            type: String,
            default: "start"
        },
        align: {
            type: String,
            default: "flex-start"
        },
        wrap: {
            type: String,
            default: "nowrap"
        }
    },
    data() {
        return {
            classObj: {
                "cy-row-justify-center": this.justify == "center",
                "cy-row-justify-end": this.justify == "end",
                "cy-row-justify-space-between": this.justify == "space-between",
                "cy-row-justify-space-around": this.justify == "space-around",
                "cy-row-align-center": this.align == "center",
                "cy-row-align-flex-end": this.align == "flex-end",
                "cy-row-flex-wrap": this.wrap == "wrap",
                "cy-row-flex-reverse": this.wrap == "reverse"
            },
            styleObj: {
                "margin-left": -this.gutter + "px",
                "margin-right": -this.gutter + "px"
            }
        };
    },
    mounted() {
        let slot = Array.isArray(this.$slots.default) && [...this.$slots.default];
        this.initCol(slot);
    },
    computed: {
        style() {
            if (this.gutter != "") {
                return this.styleObj;
            }
        }
    },
    methods: {
        initCol: function(slot) {   
            for (let i = 0; i < slot.length; i++) {
                let tag = slot[i].tag;
                if (typeof tag == "string") {
                    if (tag.indexOf("cy-col") != -1) {
                        var slotElm = slot[i].elm;
                        slotElm.style.paddingLeft = this.gutter + "px";
                        slotElm.style.paddingRight = this.gutter + "px";
                    }
                }
            }
        }
    }
};
</script>

<style lang="scss">
.cy-row {
    width: 100%;
    overflow: hidden;
}
.cy-row-flex {
    display: flex;
    .cy-col {
        float: none;
    }
}
.cy-row-justify-center {
    justify-content: center;
}
.cy-row-justify-end {
    justify-content: flex-end;
}
.cy-row-justify-space-between {
    justify-content: space-between;
    align-items: center;
}
.cy-row-justify-space-around {
    justify-content: space-around;
}
.cy-row-align-flex-start {
    align-items: flex-start;
}
.cy-row-align-center {
    align-items: center;
}
.cy-row-align-flex-end {
    align-items: flex-end;
}
.cy-row-flex-wrap {
    flex-wrap: wrap;
}
.cy-row-flex-nowrap {
    flex-wrap: nowrap;
}
.cy-row-flex-reverse {
    flex-wrap: wrap-reverse;
}
</style>