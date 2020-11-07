<template>
    <div>
        <div class="cy-sticky-box" ref="stickyBox">
            <slot></slot>
        </div>
        <div class="cy-sticky-fill" :style="{'height':height+'px'}"></div>
    </div>
</template>

<script>
import throttle from "@/utils/throttle";
export default {
    name: "cy-sticky",
    props: {
        scrollBox: {
            type: String
        },
        top: {
            type: Number
        },
        //是否要重新绑定(用于内容变化导致位置变化)
        fresh: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            initTimes: 0,
            height: 0,
            scrollHandler: null
        };
    },
    created() {},
    activated() {
        if (this.initTimes > 0) {
            this.bindStickyFresh();
        }
        this.initTimes++;
    },
    mounted() {
        this.$nextTick(() => {
            !this.fresh && this.bindSticky();
        });
    },
    methods: {
        //重新绑定  用于内容变化导致位置变化定位不再正确的情况
        bindStickyFresh() {
            this.bindSticky();
        },

        bindSticky() {
            this.$nextTick(() => {
                const stickyBox = this.$refs.stickyBox;
                this.height = stickyBox.clientHeight || stickyBox.offsetHeight;
                this.sticky(stickyBox, {
                    scrollBox: this.scrollBox,
                    top: this.top
                });
            });
        },

        sticky(nav, options = {}) {
            let scrollBox = options.scrollBox || window;
            let top = options.top || 0;

            if (typeof scrollBox === "string") {
                scrollBox = document.getElementById(scrollBox);
                if (!scrollBox) {
                    return;
                }
            }
            let navOffsetY = nav.offsetTop - top;
            scrollBox.removeEventListener("scroll", this.scrollHandler);

            const getTop = () => {
                if (scrollBox === window) {
                    return (
                        (document.documentElement &&
                            document.documentElement.scrollTop) ||
                        document.body.scrollTop
                    );
                } else {
                    return scrollBox.scrollTop;
                }
            };

            const scrollHandler = () => {
                const distance = getTop();
                this.$emit("scrollChange", distance);
                if (distance > navOffsetY) {
                    nav.style.top = top + "px";
                    nav.classList.add("cy-sticky-fixed");
                } else {
                    nav.classList.remove("cy-sticky-fixed");
                }
            };


            if (this.isSupportSticky()) {
                nav.style.top = top + "px";
                // 使用sticky
                nav.classList.add("cy-sticky");
            } else {
                if (nav.classList.contains("cy-sticky-fixed")) {
                    const top = getTop();
                    navOffsetY = nav.parentNode.offsetTop - top;
                    if (top < navOffsetY) {
                        nav.classList.remove("cy-sticky-fixed");
                    }
                } else {
                    navOffsetY = nav.offsetTop - top;
                }

                this.scrollHandler = scrollHandler;
                //scrollBox.addEventListener("scroll", scrollHandler);
                scrollBox.addEventListener("scroll", throttle(scrollHandler, 100));
                
            }
        },

        // 判断是否支持sticky属性
        isSupportSticky() {
            let prefixTestList = ["", "-webkit-", "-ms-", "-moz-", "-o-"];
            let stickyText = "";
            for (let i = 0; i < prefixTestList.length; i++) {
                stickyText += "position:" + prefixTestList[i] + "sticky";
            }
            // 创建一个dom来检查
            let div = document.createElement("div");
            let body = document.body;
            div.style.cssText = "display:none" + stickyText;
            body.appendChild(div);
            let isSupport = /sticky/i.test(
                window.getComputedStyle(div).position
            );
            body.removeChild(div);
            div = null;
            return isSupport;
        }
    },
    destroyed() {
        let scrollBox = this.scrollBox || window;
        if (typeof scrollBox === "string") {
            scrollBox = document.getElementById(scrollBox);
            if (!scrollBox) {
                return;
            }
        }
        scrollBox.removeEventListener("scroll", this.scrollHandler);
    }
};
</script>

<style lang="scss">
.cy-sticky-box {
    z-index: 1020;
}
.cy-sticky {
    width: 100%;
    position: sticky;
    top: 0;
}
.cy-sticky-fixed {
    width: 100%;
    position: fixed;
    top: 0;
    transform: translate3d(0, 0, 0);
}
.cy-sticky-fill {
    display: none;
}
.cy-sticky-fixed + .cy-sticky-fill {
    display: block;
}
</style>
