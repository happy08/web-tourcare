<!--背景音乐 -->
<template>
    <div class="share-music">
        <div
            @click="!isPlay?playMusic():pauseMusic()"
            class="music-line"
            :class="{active:!!isPlay}"
        >
            <span class="line line1"></span>
            <span class="line line2"></span>
            <span class="line line3"></span>
        </div>
        <audio id="audioMusic" loop preload="preload" hidden>
            <source :src="src" type="audio/mpeg" />
        </audio>
    </div>
</template>

<script>
import wxx from "@/utils/wx";

export default {
    name: "music",
    components: {},
    props: {
        src: String,
        play: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            isPlay: this.play,
            audioMusic: null,
            nowTime: new Date().getTime(),
        };
    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            this.audioMusic = document.getElementById("audioMusic");
            this.init();
            // //播放音乐
            //     const playMusic = () => {
            //         this.audioMusic.play();
            //         this.isPlay = true;
            //     };
            //     //微信签名配置
            //     wxx.wxaccountConfig(playMusic);
        });

        //监听页面后台运行
        document.addEventListener(
            "visibilitychange",
            this.pageVisibilityChange,
            false
        );
    },
    computed: {},
    watch: {
        play(nVal, oVal) {
            if (nVal) {
                this.playMusic();
            } else {
                this.isPlay = false;
                this.audioMusic.pause();
                this.$emit("change", false);
            }
        },
    },
    methods: {
        init() {
            const shareMoneyMusic = this.$store.state.shareMoneyMusic;
            //时间超过3天
            if (
                shareMoneyMusic &&
                shareMoneyMusic.lastTime &&
                shareMoneyMusic.lastTime <
                    this.nowTime - 3 * 24 * 60 * 60 * 1000
            ) {
                this.isPlay = true;
                this.audioMusic.play();
                this.$emit("change", true);
                const music = {
                    play: true,
                    lastTime: this.nowTime,
                };
                this.$store.commit("setShareMoneyMusic", music);
            }
        },

        //播放音乐
        playMusic() {
            this.isPlay = true;
            this.audioMusic.play();
            this.$emit("change", true);
            const music = {
                lastTime: this.nowTime,
                play: true,
            };
            this.$store.commit("setShareMoneyMusic", music);
        },

        //暂停音乐
        pauseMusic() {
            this.isPlay = false;
            this.audioMusic.pause();
            this.$emit("change", false);
            const music = {
                lastTime: this.nowTime,
                play: false,
            };
            this.$store.commit("setShareMoneyMusic", music);
        },

        pageVisibilityChange() {
            // 网页后台运行
            if (document.visibilityState == "hidden") {
                this.isPlay = false;
                this.audioMusic.pause();
                this.$emit("change", false);
            } else {
                setTimeout(() => {
                    const shareMoneyMusic = this.$store.state.shareMoneyMusic;
                    if (shareMoneyMusic.pay === true) {
                        this.playMusic();
                    }
                }, 1000);
            }
        },
    },

    beforeDestroy() {
        document.removeEventListener(
            "visibilitychange",
            this.pageVisibilityChange,
            false
        );
    },
};
</script>
<style lang="scss" scoped>
.music-line {
    display: flex;
    width: 18px;
    height: 18px;
    justify-content: space-between;
    align-items: flex-end;
    .line {
        width: 3px;
        background: #6a0101;
    }
    &.active {
        .line {
            animation-duration: 0.5s;
            animation-fill-mode: both;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
            animation-direction: alternate;
        }
    }
    .line1 {
        height: 50%;
        animation-name: height1;
    }
    .line2 {
        height: 70%;
        animation-name: height2;
    }
    .line3 {
        height: 30%;
        animation-name: height3;
    }
    @keyframes height1 {
        0% {
            height: 20%;
        }
        10% {
            height: 30%;
        }
        80% {
            height: 80%;
        }
    }
    @keyframes height2 {
        0% {
            height: 10%;
        }
        50% {
            height: 70%;
        }
        100% {
            height: 100%;
        }
    }
    @keyframes height3 {
        0% {
            height: 80%;
        }
        40% {
            height: 30%;
        }
        100% {
            height: 20%;
        }
    }
}
</style>
