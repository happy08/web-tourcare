<template>
    <div id="app" class="layout">
        <transition :name="transition">
            <keep-alive :include="keepAlive">
                <router-view class="wrapper"></router-view>
            </keep-alive>
        </transition>
        <base-tabbar :path="path" :class="{'show':tabbarShow}" />
    </div>
</template> 

<script>
import baseTabbar from "@/components/_custom/base_tabbar";
import wxx from "@/utils/wx";

export default {
    name: "App",
    components: {
        baseTabbar,
    },
    data() {
        return {
            transition: "",
            tabbarShow: false,
            path: "",
        };
    },
    watch: {
        // 监听路由
        $route(to, from) {
            //判断前进后退
            if (
                to.meta.index == from.meta.index ||
                from.meta.index == undefined
            ) {
                this.transition = "page-fade";
                window.scrollTo(0,0)
            } else if (to.meta.index > from.meta.index) {
                this.transition = "page-slide-left";
            } else {
                this.transition = "page-slide-right";
            }

            //判断是否显示tabbar
            if (to.path == "/" || to.path == "/mydata" || to.path == "/user") {
                this.tabbarShow = true;
                this.path = to.path == "/" ? "/mydata" : to.path;
            } else {
                this.tabbarShow = false;
            }
        },
    },
    mounted() {
        //ios input失焦不回弹问题
        const isiOS = !!navigator.userAgent.match(
            /\(i[^;]+;( U;)? CPU.+Mac OS X/
        );
        let timer;
        if (isiOS) {
            document.body.addEventListener("focusin", () => {
                timer && clearTimeout(timer);
            });
            document.body.addEventListener(
                "focusout",
                (e) => {
                    //a等元素也会触发blur事件
                    const input = ["input", "textarea"].includes(
                        e.target.localName
                    );
                    if (input) {
                        timer && clearTimeout(timer);
                        timer = setTimeout(() => {
                            const scrollHeight =
                                document.documentElement.scrollTop ||
                                document.body.scrollTop ||
                                0;
                            window.scrollTo({
                                top: Math.max(scrollHeight - 260, 0),
                                left: 0,
                                behavior: "smooth",
                            });
                        }, 200);
                    }
                },
                true
            );
        }

        const setWxConfig = () => {
            //隐藏菜单项所有“传播类”和“保护类”按钮
            wx.hideAllNonBaseMenuItem();
        };
        //微信签名配置
        wxx.wxaccountConfig(setWxConfig);
    },
    computed: {
        keepAlive() {
            return this.$store.state.keepAlive;
        },
    },

    methods: {},
};
</script>

<style lang="scss">
@import "./assets/css/_variable.scss";
/*fade切换效果*/
.page-fade-enter-active {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    opacity: 1;
    z-index: 99;
}
.page-fade-enter-active,
.page-fade-leave-active {
    transition: opacity .6s;
}
.page-fade-enter,
.page-fade-leave-to {
    opacity: 0;
}

/*slide切换效果*/
.page-slide-right-leave-active,
.page-slide-left-enter-active {
    position: fixed;
    will-change: transform;
    transition: transform 300ms;
    transition-timing-function: ease-out;
    overflow-y: hidden !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 1070 !important;
}
.page-slide-right-enter-active,
.page-slide-left-leave-active {
    position: relative;
    will-change: margin-left;
    transition: margin-left 300ms;
    transition-timing-function: ease-out;
    width: 100%;
}
.page-slide-right-enter-active {
    margin-left: 0;
    z-index: 8 !important;
}
.page-slide-right-enter {
    margin-left: -30%;
}
.page-slide-right-leave-active {
    z-index: 9 !important;
    transform: translate3d(100%, 0, 0);
}
.page-slide-left-enter {
    transform: translate3d(100%, 0, 0);
}
// .page-slide-left-enter-active {
// }
.page-slide-left-leave-active {
    margin-left: -30%;
}

//子路由动画
// .page-slide-child-enter-active,
// .page-slide-child-leave-active {
//   transition: transform 400ms;
// }
// .page-slide-child-enter,
// .page-slide-child-leave-active {
//   transform: translateX(100%);
// }
</style>
