<!--上拉加载更多-->
<template>
    <div class="cy-pulldown-loading" ref="scroller">
        <slot></slot>
        <div class="cy-pulldown-loading-more">
            <div class="cy-pulldown-bottom-tips">
                <cy-loading v-if="isLoading" text="加载中…" color="#999999" size="18" />
                <div v-else-if="hasMore" @click="$emit('loadmore')" class="flex center">
                    {{moreText}}
                    <cy-icon type="xiala" class="mgl-5"></cy-icon>
                </div>
                <span v-else-if="noMore" class="cy-pulldown-tips">没有更多啦</span>
                <div v-if="!isLoading && !noMore && dataList.length===0">
                    <slot name="noData">
                        <div class="cy-pulldown-loading-no-data">暂无数据</div>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import cyLoading from "../loading";

export default {
    name: "cy-pullup-loading",
    components: {
        cyLoading,
    },
    props: {
        dataList: {
            type: Array,
            default() {
                return [];
            },
        },
        moreText: {
            type: String,
            default: "查看更多",
        },
        hasMore: {
            type: Boolean,
            default: true,
        },
        noMore: {
            //不显示没有更多啦
            type: Boolean,
            default: true,
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
        isPullLoadMore: {
            //是否开启下拉加载更多，可点击加载更多
            type: Boolean,
            default: true,
        },
        useWindow: {
            type: Boolean,
            default: true,
        },
        scrollChange: {
            type: Function,
        },
    },
    data() {
        return {
            beforeScrollTop: 0,
            scrollEl: null,
        };
    },
    created() {},
    mounted: function () {
        if (this.isPullLoadMore) {
            const parentElement = this.getParentElement(this.$el);
            let scrollEl = window;
            if (this.useWindow === false) {
                scrollEl = parentElement;
            }
            this.scrollEl = scrollEl;
            this.scrollListener();
        }
    },

    methods: {
        getParentElement(el) {
            return el && el.parentNode;
        },
        scrollListener() {
            if (this.scrollEl) {
                this.scrollEl.addEventListener("scroll", this.onScroll, false);
                window.addEventListener("resize", this.onScroll, false);
            }
        },

        requestAniFrame() {
            return (
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                }
            );
        },

        onScroll() {
            console.log("this.hasMore", this.hasMore, this.isLoading);
            this.requestAniFrame()(() => {
                if (
                    !this.isScrollAtBottom() ||
                    !this.hasMore ||
                    this.isLoading
                ) {
                    return false;
                } else {
                    this.$emit("loadmore");
                }
            });
        },

        calculateTopPosition(el) {
            if (!el) {
                return 0;
            }
            return el.offsetTop + this.calculateTopPosition(el.offsetParent);
        },

        getWindowScrollTop() {
            return window.pageYOffset !== undefined
                ? window.pageYOffset
                : (
                      document.documentElement ||
                      document.body.parentNode ||
                      document.body
                  ).scrollTop;
        },

        isScrollAtBottom() {
            let offsetDistance;

            let resScrollTop = 0;
            const windowScrollTop = this.getWindowScrollTop();
            if (this.useWindow) {
                offsetDistance =
                    this.calculateTopPosition(this.$refs.scroller) +
                    this.$refs.scroller.offsetHeight -
                    windowScrollTop -
                    window.innerHeight;
            } else {
                const { scrollHeight, clientHeight, scrollTop } = this.scrollEl;
                offsetDistance = scrollHeight - clientHeight - scrollTop;
                resScrollTop = scrollTop;
            }
            this.$emit(
                "scrollChange",
                this.useWindow ? windowScrollTop : resScrollTop
            );
            // 保证是往下滑动的
            let beforeScrollTop = this.beforeScrollTop;
            this.beforeScrollTop = windowScrollTop;
            return (
                offsetDistance <= 20 && windowScrollTop >= this.beforeScrollTop
            );
        },
    },

    activated() {
        if (this.keepAlive) {
            this.keepAlive = false;
            this.scrollListener();
        }
    },

    deactivated() {
        if (this.scrollEl) {
            this.keepAlive = true;
            this.scrollEl.removeEventListener("scroll", this.onScroll, false);
            window.removeEventListener("resize", this.onScroll, false);
        }
    },

    destroyed() {
        if (this.scrollEl) {
            this.scrollEl.removeEventListener("scroll", this.onScroll, false);
            window.removeEventListener("resize", this.onScroll, false);
        }
    },
};
</script>

<style lang="scss">
.cy-pulldown-loading {
    .cy-pulldown-bottom-tips {
        width: 100%;
        padding: 13px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #bfbfbf;
        font-size: 12px;
        .cy-pulldown-tips {
            position: relative;
            line-height: 30px;
            width: 123px;
            padding: 0 0 0 50px;
            margin: 0 auto;
            background: url("./loading_bg.png") left center no-repeat;
            background-size: cover;
        }
    }
    .cy-pulldown-loading-no-data {
        color: #a8a7a7;
        text-align: center;
    }
}
</style>