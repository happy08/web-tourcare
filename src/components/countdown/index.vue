<template>
    <div class="cy-countdown" v-html="restTime">
        <slot></slot>
    </div>
</template>
<script>
import { semantics } from "@/utils/formatDate";

export default {
    name: "cy-countdown",
    data() {
        return {
            restTime: "",
        };
    },
    props: {
        showDays: {
            default: false,
            type: Boolean,
        },
        // nowTime: {
        //     // 可以是服务器当前时间
        //     type: [Number, String],
        //     default: ""
        // },
        // endTime: {
        //     type: [Number, String],
        //     default: "" //Date.now()
        // },
        //时间差
        expireTime: {
            type: [Number, String],
            default: "0",
        },
    },
    created() {},
    computed: {},
    watch: {
        expireTime: {
            handler(nVal, oVal) {
                this.countdown(nVal);
            },
            immediate: true,
        },
    },
    methods: {
        // init() {
        //     if (this.nowTime && this.endTime) {
        //         const now = new Date(
        //             this.nowTime.replace(/\-/g, "/")
        //         ).getTime();
        //         const end = new Date(
        //             this.endTime.replace(/\-/g, "/")
        //         ).getTime();

        //         const restTime = end - now;
        //         this.countdown(restTime)
        //     } else {
        //         //this.restTime = semantics(0, true);
        //     }
        // },

        countdown(restTime) {
            const delay = 1000;
            if (restTime < delay) {
                this.restTime = this.toTimeStr(0, true);
                this.$emit("end");
                return;
            }
            let timer = setInterval(() => {
                restTime = restTime - delay;
                this.restTime = this.toTimeStr(restTime);
                if (restTime < delay) {
                    restTime = 0;
                    this.$emit("end");
                    clearInterval(timer);
                }
            }, delay);
        },

        /* 秒 转成 -天-时-分-秒 */
        toTimeStr(time) {
            let [days, hours, minutes, seconds] = semantics(time);
            let date = "";
            date += `<span>${days}</span>天 `;
            date += `${this.fill2(hours)}:`;
            date += `${this.fill2(minutes)}:`;
            date += `${this.fill2(seconds)}`;
            return date;
        },

        fill2(v) {
            v += "";
            if (v.length < 2) {
                v = "0" + v;
            }
            const n = `<span>${v}</span>`;
            // for (let i = 0; i < v.length; i++) {
            //     n += `<span>${v.substr(i, 1)}</span>`;
            // }
            return n;
        },
    },
};
</script>


