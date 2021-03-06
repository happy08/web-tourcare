<template>
    <div>
        <slot name="tab">
            <div v-if="tabList" ref="navWarp">
                <div ref="navItem">
                    <cy-tab
                        v-model="curTabIndex"
                        barWidth="25%"
                        :noScrollNum="4"
                        :barActiveColor="['#29d7a8','#3f8bfd']"
                        :barHeight="4"
                        @onIndexChange="onIndexChange"
                    >
                        <cy-tab-item v-for="item in tabList" :key="item.name" @onItemClick="onItemClick(item.tabIndex)">
                            <div class="pdtb-10">
                                <div class="flex center">{{item.name}}<small class="mgl-3" v-if="item.count">({{item.count}})</small></div>
                            </div>
                        </cy-tab-item>
                    </cy-tab>
                </div>
            </div>
        </slot>
        <div ref="mescroll" class="mescroll" :style="`top:${toTop}`">
            <!--滑动区域-->
            <slot></slot>

            <!-- 无数据 容器 -->
            <div id="htmlEmpty">
                <slot name="empty">暂无数据</slot>
            </div>
        </div>
    </div>
</template>

<script>
import cyTab from "@/components/tab";
import cyTabItem from "@/components/tab/tab_item";
import MeScroll from "./mescroll.js/mescroll.min.js";
import "./mescroll.js/mescroll.min.css";

//import MescrollVue from "mescroll.js/mescroll.vue";

export default {
    name: "mescrollOptions",
    components: {
        cyTab,
        cyTabItem
        //MescrollVue
    },
    props: {
        tabList: Array,
        downOption: Object,
        upOption: Object,
        top: {
            type: [Number, String],
            default: "0px"
        },
        curIndex: {
            type: [Number, String],
            default: 0
        }
    },
    data() {
        return {
            mescroll: null,
            curTabIndex: 0, // 菜单
            toTop: this.top ? this.top : this.tabList ? "1.17333rem" : "0px", //44px距顶距离
            //下拉配置
            down: {
                use: true, // 是否初始化下拉刷新; 默认true
                auto: true, // 是否在初始化完毕之后自动执行下拉回调callback; 默认true
                autoShowLoading: false, // 如果在初始化完毕之后自动执行下拉回调,是否显示下拉刷新进度; 默认false
                isLock: false, // 是否锁定下拉,默认false;
                isBoth: false, // 下拉刷新时,如果滑动到列表底部是否可以同时触发上拉加载;默认false,两者不可同时触发;
                callback: mescroll => {
                    //console.log("down --> callback");
                    // 下拉刷新的回调,默认重置上拉加载列表为第一页(down的auto默认true,初始化Mescroll之后会自动执行到这里,而mescroll.resetUpScroll会触发up的callback)
                    mescroll.resetUpScroll();
                    this.$emit("pullDown");
                },
                offset: 60, // 触发刷新的距离,默认80
                inOffsetRate: 1, // 在列表顶部,下拉的距离小于offset时,改变下拉区域高度比例;值小于1且越接近0,高度变化越小,表现为越往下越难拉
                outOffsetRate: 0.2, // 超过指定距离范围外时,改变下拉区域高度比例;值小于1且越接近0,越往下拉高度变化越小;
                bottomOffset: 20, // 当手指touchmove位置在距离body底部20px范围内的时候结束上拉刷新,避免Webview嵌套导致touchend事件不执行
                minAngle: 45, // 向下滑动最少偏移的角度,取值区间  [0,90];默认45度,即向下滑动的角度大于45度则触发下拉;而小于45度,将不触发下拉,避免与左右滑动的轮播等组件冲突;
                hardwareClass: "mescroll-hardware", // 硬件加速样式;解决iOS下拉因隐藏进度条而闪屏的问题,参见mescroll.css
                mustToTop: false, // 是否滚动条必须在顶部,才可以下拉刷新.默认false. 当您发现下拉刷新会闪白屏时,设置true即可修复.
                warpId: null, // 可配置下拉刷新的布局添加到指定id的div;默认不配置,默认添加到mescrollId
                warpClass: "mescroll-downwarp", // 容器,装载布局内容,参见mescroll.css
                resetClass: "mescroll-downwarp-reset", // 高度重置的动画,参见mescroll.css
                textInOffset: "下拉刷新", // 下拉的距离在offset范围内的提示文本
                textOutOffset: "释放更新", // 下拉的距离大于offset范围的提示文本
                textLoading: "加载中 ...", // 加载中的提示文本
                htmlContent:
                    '<p class="downwarp-progress"></p><p class="downwarp-tip"></p>', // 布局内容
                inited: function(mescroll, downwarp) {
                    // 初始化完毕的回调,可缓存dom
                    mescroll.downTipDom = downwarp.getElementsByClassName(
                        "downwarp-tip"
                    )[0];
                    mescroll.downProgressDom = downwarp.getElementsByClassName(
                        "downwarp-progress"
                    )[0];
                },
                inOffset: mescroll => {
                    //console.log("down --> inOffset");
                    // 进入指定距离offset范围内那一刻的回调
                    if (mescroll.downTipDom)
                        mescroll.downTipDom.innerHTML =
                            mescroll.optDown.textInOffset;
                    if (mescroll.downProgressDom)
                        mescroll.downProgressDom.classList.remove(
                            "mescroll-rotate"
                        );
                },
                outOffset: function(mescroll) {
                    //console.log("down --> outOffset");
                    // 下拉超过指定距离offset那一刻的回调
                    if (mescroll.downTipDom)
                        mescroll.downTipDom.innerHTML =
                            mescroll.optDown.textOutOffset;
                },
                onMoving: function(mescroll, rate, downHight) {
                    // 下拉过程中的回调,滑动过程一直在执行; rate下拉区域当前高度与指定距离offset的比值(inOffset: rate<1; outOffset: rate>=1); downHight当前下拉区域的高度
                    if (mescroll.downProgressDom) {
                        let progress = 360 * rate;
                        mescroll.downProgressDom.style.webkitTransform =
                            "rotate(" + progress + "deg)";
                        mescroll.downProgressDom.style.transform =
                            "rotate(" + progress + "deg)";
                    }
                },
                beforeLoading: function(mescroll, downwarp) {
                    // 准备触发下拉刷新的回调
                    return false; // 如果要完全自定义下拉刷新,那么return true,此时将不再执行showLoading(),callback();
                },
                showLoading: function(mescroll) {
                    // 触发下拉刷新的回调
                    if (mescroll.downTipDom) {
                        mescroll.downTipDom.innerHTML =
                            mescroll.optDown.textLoading;
                    }
                    if (mescroll.downProgressDom) {
                        mescroll.downProgressDom.classList.add(
                            "mescroll-rotate"
                        );
                    }
                },
                afterLoading: mescroll => {
                    // 结束下拉之前的回调. 返回延时执行结束下拉的时间,默认0ms; 常用于结束下拉之前再显示另外一小段动画,才去结束下拉的场景
                    return 0;
                }
            },
            //上拉配置
            up:{
                use: true, // 是否初始化上拉加载; 默认true
                auto: true, // 是否在初始化时以上拉加载的方式自动加载第一页数据; 默认true
                isLock: false, // 是否锁定上拉,默认false
                isBoth: true, // 上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新;默认false,两者不可同时触发; 这里为了演示改为true,不必等列表加载完毕才可下拉;
                isBounce: true, // 是否允许ios的bounce回弹;默认true,允许回弹; 此处配置为false,可解决微信,QQ,Safari等等iOS浏览器列表顶部下拉和底部上拉露出浏览器灰色背景和卡顿2秒的问题
                callback: page => { 
                    this.$emit("upCallback", page, this.mescroll);
                }, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
                page: {
                    num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                    size: 10, // 每页数据条数
                    time: null // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
                },
                noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
                offset: 10, // 离底部的距离
                toTop: {
                    // // 回到顶部按钮,需配置src才显示
                    // warpId: null, // 父布局的id; 默认添加在body中
                    // src: "./static/mescroll/mescroll-totop.png", // 图片路径,默认null;
                    // html: null, // html标签内容,默认null; 如果同时设置了src,则优先取src
                    // offset: 1000, // 列表滚动多少距离才显示回到顶部按钮,默认1000
                    // warpClass: "mescroll-totop", // 按钮样式,参见mescroll.css
                    // showClass: "mescroll-fade-in", // 显示样式,参见mescroll.css
                    // hideClass: "mescroll-fade-out", // 隐藏样式,参见mescroll.css
                    // duration: 300, // 回到顶部的动画时长,默认300ms
                    // supportTap: false, // 默认点击事件用onclick,会有300ms的延时;如果您的运行环境支持tap,则可配置true;
                    // btnClick: null // 点击按钮的回调; 小提示:如果在回调里return true,将不执行回到顶部的操作.
                },
                loadFull: {
                    use: false, // 列表数据过少,不足以滑动触发上拉加载,是否自动加载下一页,直到满屏或者无更多数据为止;默认false,因为可通过调高page.size或者嵌套mescroll-bounce的div避免这个情况
                    delay: 500 // 延时执行的毫秒数; 延时是为了保证列表数据或占位的图片都已初始化完成,且下拉刷新上拉加载中区域动画已执行完毕;
                },
                empty: {
                    customId: "htmlEmpty"
                    // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才生效;
                    //warpId: "htmlEmpty", // 父布局的id; 如果此项有值,将不使用clearEmptyId的值;
                    //icon: "./static/mescroll/mescroll-empty.png", // 图标,默认null
                    //tip: "暂无相关数据",//"暂无相关数据",//"暂无相关数据", // 提示
                    //btntext: "去逛逛 >", // 按钮,默认""
                    //btnClick: function() {
                    // 点击按钮的回调,默认null
                    //alert("点击了按钮,具体逻辑自行实现");
                    //},
                    //supportTap: false // 默认点击事件用onclick,会有300ms的延时;如果您的运行环境支持tap,则可配置true;
                },
                showEmpty: () => {
                    //console.log("showEmpty()");
                },
                removeEmpty: () => {
                    //console.log("removeEmpty()");
                },
                //clearId: null, // 加载第一页时需清空数据的列表id; 如果此项有值,将不使用clearEmptyId的值; 使用vue则不能配置此项
                //clearEmptyId: null, // 相当于同时设置了clearId和empty.warpId; 简化写法,默认null; 使用vue则不能配置此项
                hardwareClass: "mescroll-hardware", // 硬件加速样式,动画更流畅,参见mescroll.css
                warpId: null, // 可配置上拉加载的布局添加到指定id的div;默认不配置,默认添加到mescrollId
                warpClass: "mescroll-upwarp", // 容器,装载布局内容,参见mescroll.css
                htmlLoading:
                    '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>', // 上拉加载中的布局
                htmlNodata: '<div class="upwarp-bg"><p class="upwarp-nodata">没有更多啦</p></div>', // 无数据的布局
                inited: (mescroll, upwarp)=> {
                    this.$emit("initMescroll",mescroll);
                    // 初始化完毕的回调,可缓存dom 比如 mescroll.upProgressDom = upwarp.getElementsByClassName("upwarp-progress")[0];
                },
                showLoading: (mescroll, upwarp) => {
                    //console.log("up --> showLoading");
                    // 上拉加载中.. mescroll.upProgressDom.style.display = "block" 不通过此方式显示,因为ios快速滑动到底部,进度条会无法及时渲染
                    upwarp.innerHTML = mescroll.optUp.htmlLoading;
                },
                showNoMore: (mescroll, upwarp) => {
                    //console.log("up --> showNoMore");
                    // 无更多数据
                    upwarp.innerHTML = mescroll.optUp.htmlNodata;
                },
                onScroll: function(mescroll, y, isUp) {
                    // 列表滑动监听,默认onScroll: null;
                    // y为列表当前滚动条的位置
                    // console.log(
                    //     "up --> onScroll 列表当前滚动的距离 y = " +
                    //         y +
                    //         ", 是否向上滑动 isUp = " +
                    //         isUp
                    // );
                },
                scrollbar: {
                    use: typeof window.orientation === "undefined", // 默认只在PC端自定义滚动条样式
                    barClass: "mescroll-bar"
                },
                lazyLoad: {
                    use: true, // 是否开启懒加载,默认false
                    attr: "imgurl", // html标签中,存放网络图片地址的属性名: <img src='占位图' imgurl='网络图'/>
                    showClass: "mescroll-lazy-in", // 显示样式,参见mescroll.css
                    delay: 500, // 列表滚动的过程中每500ms检查一次图片是否在可视区域,如果在可视区域则加载图片
                    offset: 200 // 超出可视区域200px的图片仍可触发懒加载,目的是提前加载部分图片
                }
            }
        };
    },
    watch: {
        curIndex: {
            handler(nVal, oVal) {
                this.curTabIndex = nVal;
            },
            immediate: true
        }
    },
    computed: {},
    mounted() {
        this.mescroll = new MeScroll(this.$refs.mescroll, {
            up: this.getMescrollUp(),
            down: this.getMescrollDown()
        });

        // safari不支持sticky  不理想会闪
        // this.$nextTick(() => {
        //     let navWarp = this.$refs.navWarp; //document.getElementById("navWarp");
        //     if (this.cssSupport("position", "sticky")) {
        //         navWarp.classList.add("nav-sticky");
        //         return;
        //     }

        //     //不支持sticky 悬停效果,通过监听mescroll的scroll事件,控制navContent是否为fixed定位来实现
        //     navWarp.style.height = navWarp.offsetHeight + "px"; //固定高度占位,避免悬浮时列表抖动
        //     let navContent = this.$refs.navItem;
        //     this.mescroll.optUp.onScroll = function(mescroll, y, isUp) {
        //         if (y >= navWarp.offsetTop + 100) {
        //             navContent.classList.add("nav-fixed");
        //         } else {
        //             navContent.classList.remove("nav-fixed");
        //         }
        //     };
        // });
    },
    beforeRouteEnter(to, from, next) {
        // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
        next(vm => {
            if (vm.mescroll) {
                // 恢复到之前设置的isBounce状态
                if (vm.mescroll.lastBounce != null)
                    vm.mescroll.setBounce(vm.mescroll.lastBounce);
                // 滚动到之前列表的位置(注意:路由使用keep-alive才生效)
                if (vm.mescroll.lastScrollTop) {
                    vm.mescroll.setScrollTop(vm.mescroll.lastScrollTop);
                    setTimeout(() => {
                        // 需延时,因为setScrollTop内部会触发onScroll,可能会渐显回到顶部按钮
                        vm.mescroll.setTopBtnFadeDuration(0); // 设置回到顶部按钮显示时无渐显动画
                    }, 16);
                }
            }
        });
    },
    beforeRouteLeave(to, from, next) {
        // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
        if (this.mescroll) {
            this.mescroll.lastBounce = this.mescroll.optUp.isBounce; // 记录当前是否禁止ios回弹
            this.mescroll.setBounce(true); // 允许bounce
            this.mescroll.lastScrollTop = this.mescroll.getScrollTop(); // 记录当前滚动条的位置
            this.mescroll.hideTopBtn(0); // 隐藏回到顶部按钮,无渐隐动画
        }
        next();
    },
    activated() {
        
    },

    methods: {
        //判断支持某个css
        cssSupport: function(attr, value) {
            const element = document.createElement("div");
            if (attr in element.style) {
                element.style[attr] = value;
                return element.style[attr] === value;
            } else {
                return false;
            }
        },

        // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10

        // 切换菜单
        onIndexChange(newIndex, oldIndex) {
            if (newIndex !== oldIndex && typeof oldIndex !== 'undefined') {
                // //this.curTabIndex = newIndex;
                // //mescroll.resetUpScroll会触发up的callback
                //this.mescroll.resetUpScroll(); // 刷新列表数据
                this.$emit("onIndexChange", newIndex, this.mescroll);
            }
        },
        // 切换菜单
        onItemClick(tabIndex){
            this.$emit("onItemClick", tabIndex, this.mescroll);
        },
        // mescroll组件初始化的回调,可获取到mescroll对象
        mescrollInit(mescroll) {
            //mescroll.tabType = 0; // 加入标记,便于在回调中取到对应的list
            this.mescroll = mescroll;
        },

        //下拉配置  多mescroll的配置,需通过方法获取,保证每个配置是单例tabType
        getMescrollDown(mescroll) {
             //let isAuto = mescroll.tabType === 0; // 第一个mescroll传入true,列表自动加载
            return Object.assign(this.down,this.downOption) ;
        },

        //上拉配置
        getMescrollUp() {
            return Object.assign(this.up,this.upOption) ;
        }
    }
};
</script>

<style lang="scss" scoped>
#htmlEmpty {
    display: none;
}
/*以fixed的方式固定mescroll的高度*/
.mescroll {
    position: absolute;
    top: 0px;
    bottom: 0;
    height: auto;
    width: 100%;
}

.swiper {
    width: 100%;
    vertical-align: bottom;
}

/*ios使用sticky样式实现*/
.nav-sticky {
    z-index: 9999;
    /*需设置zIndex,避免在悬停时,可能会被列表数据遮住*/
    position: -webkit-sticky;
    position: sticky;
    top: 0;
}

/*android悬停*/
.nav-fixed {
    z-index: 9999;
    position: fixed;
    top: 0px;
    left: 0;
    width: 100%;
}
</style>
