<!--案例 数据列表 -->
<template>
    <div>
        <!--分享按钮-->
        <cy-popup v-model="showShare" round width="100%" height="190px" @onClose="onClose">
            <div class="pd-10 pdb-30 fs-16 tc">分享至</div>
            <cy-row class="pdlr-30 tc">
                <cy-col @click.native="onShare">
                    <cy-image
                        :src="require('@/assets/img/share_money/wechat_icon.png')"
                        width="36px"
                        height="36px"
                        :lazy="false"
                    ></cy-image>
                    <div>直接分享</div>
                </cy-col>
                <cy-col @click.native="onShowPoster">
                    <cy-image
                        :src="require('@/assets/img/share_money/picture_icon.png')"
                        width="36px"
                        height="36px"
                        :lazy="false"
                    ></cy-image>
                    <div>海报分享</div>
                </cy-col>
            </cy-row>
        </cy-popup>

        <!-- 直接分享提示 -->
        <cy-popup
            class="point-popup"
            v-model="showPoint"
            :closeIcon="false"
            :clickOverlayClose="false"
            position="center"
            closeIconPosition="bottom-center"
            width="100%"
            height="100%"
            background="transparent"
        >
            <div class="point-box pdr-10 tr">
                <cy-image
                    :src="require('@/assets/img/share_money/share_bg.png')"
                    width="212px"
                    height="220px"
                ></cy-image>
            </div>
            <div class="flex center mgt-50">
                <cy-image
                    @click.native="showPoint = false"
                    :src="require('@/assets/img/share_money/know_bg.png')"
                    width="105px"
                    heigth="49px"
                ></cy-image>
            </div>
        </cy-popup>

        <!--海报弹窗v-if="showPoster"-->
        <cy-popup
            class="poster-popup"
            v-model="showPoster"
            :closeIcon="false"
            :clickOverlayClose="false"
            position="center"
            closeIconPosition="bottom-center"
            width="100%"
            height="100%"
            background="transparent"
        >
            <div class="poster-box" @touchmove.prevent>
                <cy-swiper :center="true" :pagination="false" :swiperData="postersImgList">
                    <div
                        v-for="(item,index) in postersImgList"
                        :key="index"
                        class="cy-swiper-slide"
                    >
                        <cy-image :src="item.src"></cy-image>
                    </div>
                </cy-swiper>
            </div>
            <div class="poster-close">
                <cy-icon @click.native="showPoster = false" type="close1" size="50" color="#ffffff"></cy-icon>
            </div>

            <!-- 海报html -->
            <div class="poster-html">
                <div v-for="(item,index) in postersImgListTmp" :key="index" class="html2canvas">
                    <img :src="item.src" />
                    <div class="flex center pdl-10 pdb-10">
                        <div>
                            <cy-image
                                :src="option.face"
                                round
                                width="25px"
                                height="25px"
                                :lazy="false"
                            ></cy-image>
                        </div>
                        <div class="mglr-10 fs-10">
                            <div class="fs-18">
                                <span class="fs-10">我是</span>
                                {{option.nickName}}
                            </div>
                            <div>
                                我为身边的朋友分享
                                <span class="red">「{{option.shareTitle}}」</span>
                            </div>
                            <div>{{option.shareDsc}}</div>
                            <div>码上进去抢购，和我一起体验吧！</div>
                        </div>
                        <div class="flex center">
                            <cy-image
                                :src="option.qcode"
                                width="100px"
                                height="100px"
                                :lazy="false"
                            ></cy-image>
                        </div>
                    </div>
                </div>
            </div>
        </cy-popup>
    </div>
</template>

<script>
import html2canvas from "html2canvas";
import cySwiper from "@/components/swiper";

export default {
    name: "share",
    components: {
        cySwiper,
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        displayShare: {
            //直接显示分享
            type: Boolean,
            default: false,
        },
        displayPoster: {
            //直接显示海报
            type: Boolean,
            default: false,
        },
        option: {
            type: Object,
        },
    },
    data() {
        return {
            showShare: false,
            showPoint: false,
            showPoster: false,
            postersImgList: [],
            postersImgListTmp: [],
            swiperImgIndex: 1,
        };
    },
    created() {},
    mounted() {},

    computed: {},
    watch: {
        show(nVal, oVal) {
            this.showShare = nVal;
        },
        displayShare(nVal, oVal) {
            !!nVal && this.onShare();
        },
        displayPoster(nVal, oVal) {
            !!nVal && this.onShowPoster();
        },
    },
    methods: {
        //直接分享
        onShare() {
            this.onClose();
            this.showPoint = true;
        },

        //显示海报弹窗
        onShowPoster() {
            if (
                !this.option.posterImgList ||
                this.option.posterImgList.length < 0
            ) {
                this.$toast("未配置海报图片");
                return;
            }
            this.$toast.loading("生成海报中…");
            this.postersImgList = [];
            this.onClose();

            this.postersImgListTmp = this.option.posterImgList.map((item) => {
                return { src: item.posterImg };
            });

            // for (let item of this.option.posterImgList) {
            //     const src = await this.drawPosters(item.posterImg);
            //     this.postersImgList.push({ src: src });
            // }
            setTimeout(() => {
                const htmlDom = document.querySelectorAll(".html2canvas");
                for (let i = 0; i < htmlDom.length; i++) {
                    html2canvas(htmlDom[i], {
                        allowTaint: false, //允许污染
                        taintTest: true, //在渲染前测试图片
                        useCORS: true, //使用跨域
                        background: "#fff",
                        width: htmlDom[i].clientWidth,
                        height: htmlDom[i].clientHeight,
                        scrollY: 0,
                        scrollX: 0,
                    }).then((canvas) => {
                        //转成图片
                        let src = canvas.toDataURL("image/jpeg");
                        this.postersImgList.push({ src: src });

                        this.$toast.clear();
                    });
                }
            }, 500);
            this.showPoster = true;
        },

        //隐藏弹窗
        onClose() {
            this.showShare = false;
            this.$emit("update:show", false);
            this.$emit("update:displayShare", false);
            this.$emit("update:displayPoster", false);
        },

        // 绘制海报
        async drawPosters(image) {
            let canvas = document.createElement("canvas");
            let ctx2d = canvas.getContext("2d");
            let img = await this.loadImg(image);

            // 获取设备像素比 避免模糊
            const ratio = this.devicePixelRatio(ctx2d);

            let w = 0,
                h = 0,
                whiteH = 60 * ratio; //白底高度
            if (img.width < 750) {
                w = img.width * ratio;
                h = img.height * ratio;
                canvas.width = w;
                canvas.height = h + whiteH;
            } else {
                w = 750 * ratio;
                canvas.width = w;
                var scale = img.width / img.height;
                w = w > img.width ? img.width : w;
                h = (w / scale) * ratio;
                canvas.height = h + whiteH;
            }
            ctx2d.drawImage(img, 0, 0, w, h - whiteH);

            //画白底
            ctx2d.fillStyle = "#fff";
            ctx2d.fillRect(0, h - whiteH, w, h);

            //绘制文字
            this.drawText(ctx2d, {
                text: "我是",
                fontSize: `${10 * ratio}px Arial`,
                x: 65 * ratio,
                y: h - whiteH + 30 * ratio,
                color: "#333333",
            });
            this.drawText(ctx2d, {
                text: this.option.nickName,
                fontSize: `${16 * ratio}px Arial`,
                x: 90 * ratio,
                y: h - whiteH + 30 * ratio,
                color: "#333333",
            });
            // this.drawText(ctx2d, {
            //     text: "「" + this.option.nickName + "」",
            //     fontSize: `${14 * ratio}px Arial`,
            //     x: 205 * ratio,
            //     y: h - whiteH + 40 * ratio,
            //     color: "#FF3025",
            // });
            this.drawText(ctx2d, {
                text: "我为身边的朋友分享",
                fontSize: `${10 * ratio}px Arial`,
                x: 65 * ratio,
                y: h - whiteH + 50 * ratio,
                color: "#333333",
            });
            this.drawText(ctx2d, {
                text: "「车内大健康检测治理项目」",
                fontSize: `${10 * ratio}px Arial`,
                x: 155 * ratio,
                y: h - whiteH + 50 * ratio,
                color: "#FF3025",
            });
            this.drawText(ctx2d, {
                text: "国家高新技术企业出品，先检测后科学治理车内环",
                fontSize: `${10 * ratio}px Arial`,
                x: 65 * ratio,
                y: h - whiteH + 70 * ratio,
                color: "#333333",
            });
            this.drawText(ctx2d, {
                text: "境危害，有健康，爱恒久！", //「" + this.option.projectName + "」
                fontSize: `${10 * ratio}px Arial`,
                x: 65 * ratio,
                y: h - whiteH + 85 * ratio,
                color: "#333333",
            });
            this.drawText(ctx2d, {
                text: "码上进去抢购，和我一起体验吧！",
                fontSize: `${10 * ratio}px Arial`,
                x: 65 * ratio,
                y: h - whiteH + 105 * ratio,
                color: "#333333",
            });

            await this.drawFace(ctx2d, canvas, ratio, w, h);

            return this.drawQcode(ctx2d, canvas, ratio);
        },

        // 绘制文字
        drawText(ctx, info = {}) {
            const x = info.x || 0;
            const y = info.y || 0;
            const text = info.text || "";
            ctx.fillStyle = info.color || "#333";
            ctx.font = info.fontSize || "12px Arial";
            ctx.fillText(text, x, y);
        },

        // 绘制头像
        drawFace(ctx2d, canvas, ratio, w, h) {
            return new Promise(async (resolve, reject) => {
                ctx2d.beginPath();
                // 绘制圆，参数（x坐标，y坐标，圆半径，起始角度，终止角度）
                ctx2d.arc(30 * ratio, h, 25 * ratio, 0, 2 * Math.PI);
                ctx2d.save();
                // 剪切形状
                ctx2d.clip();

                let img = await this.loadImg(this.option.face);
                // 绘制头像，参数（图片资源，x坐标，y坐标，宽度，高度）
                ctx2d.drawImage(
                    img,
                    5 * ratio,
                    h - 25 * ratio,
                    50 * ratio,
                    50 * ratio
                );
                ctx2d.restore();
                ctx2d.closePath();
                resolve();
            });
        },

        // 绘制二维码
        async drawQcode(ctx2d, canvas, ratio) {
            let img = await this.loadImg(this.option.qcode);
            let w = 120 * ratio,
                h = 120 * ratio;
            // if (img.width < 100) {
            //     h = w = img.width;
            // } else {
            //     h = w = 86;
            // }
            let left = canvas.width - w - 0;
            let top = canvas.height - h - 0;
            ctx2d.drawImage(img, left, top, w, h);

            //转成图片 返回
            let src = canvas.toDataURL("image/jpeg");
            return src;
        },

        // // canvas转图片
        // convertCanvasToImage(canvas) {
        //     var image = new Image();
        //     image.src = canvas.toDataURL("image/png");
        //     return imageSrc;
        // }

        // 获取设备像素比
        devicePixelRatio(ctx2d) {
            let devRatio = window.devicePixelRatio || 1,
                // ctx2d的像素比
                backingStore =
                    ctx2d.backingStorePixelRatio ||
                    ctx2d.webkitBackingStorePixelRatio ||
                    ctx2d.mozBackingStorePixelRatio ||
                    ctx2d.msBackingStorePixelRatio ||
                    ctx2d.oBackingStorePixelRatio ||
                    ctx2d.backingStorePixelRatio ||
                    1;
            const ratio = devRatio / backingStore;
            return ratio;
            // canvas 放大后，相应的绘制图片也要放大
            //ctx.scale(ratio, ratio);
        },

        // 加载图片
        loadImg(url) {
            return new Promise((resolve, reject) => {
                var img = new Image();
                img.setAttribute("crossOrigin", "anonymous");
                // 加载成功
                img.onload = () => {
                    resolve(img);
                };
                // 加载失败
                img.onerror = () => {
                    reject(new Error("图片加载失败"));
                };
                img.src = url;
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.point-box {
    margin-top: 20%;
    width: 100%;
    height: 55%;
}
.poster-popup {
    /deep/.cy-popup {
        transform: translate(-50%, -50%);
    }
    .poster-box {
        margin-top: 15%;
    }
    .poster-close {
        position: absolute;
        bottom: 40px;
        left: 50%;
        margin-left: -25px;
    }
}
.poster-html {
    position: absolute;
    left: -200%;
    max-width: 100%;
    .html2canvas {
        background: #ffffff;
    }
}
</style>
