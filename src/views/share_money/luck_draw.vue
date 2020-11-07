<!--抽奖-->
<template>
    <div>
        <cy-popup
            v-model="showLuckDraw"
            :closeIcon="true"
            position="right"
            width="100%"
            height="100%"
            @onClose="onClose"
        >
            <div class="lottery">
                <div class="lottery-item">
                    <div class="lottery-start">
                        <div class="box" @click="startLottery">抽奖</div>
                    </div>
                    <ul>
                        <li v-for="(item,i) in list" :key="i" :class="i==index?'on':''">
                            <div class="box">{{item.title}}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </cy-popup>
    </div>
</template>

<script>
import cySearch from "@/components/search";

export default {
    name: "choose_stores",
    components: {
        cySearch,
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        option: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    data() {
        return {
            showLuckDraw: false, //弹窗
            isStart: 1,

            list: [
                { title: "谢谢参与" },
                { title: "美女一个" },
                { title: "宝马一辆" },
                { title: "单车一辆" },
                { title: "鸡蛋一蓝" },
                { title: "500红包" },
                { title: "靓号一个" },
                { title: "鲜花一蓝" },
            ], //奖品1-9
            index: -1, // 当前转动到哪个位置，起点位置
            count: 8, // 总共有多少个位置
            timer: 0, // 每次转动定时器
            speed: 200, // 初始转动速度
            times: 0, // 转动次数
            cycle: 50, // 转动基本次数：即至少需要转动多少次再进入抽奖环节
            prize: -1, // 中奖位置
            click: true,
        };
    },
    created() {},
    mounted() {},
    computed: {},
    watch: {
        show(nVal, oVal) {
            this.showLuckDraw = nVal;
            // if (nVal === true && this.form.carNo === "") {
            //     this.getUserCarList();
            // }
        },
        // option: {
        //     handler(nVal, oVal) {
        //         nVal && this.useStores(nVal);
        //     },
        //     //immediate: true,
        //     deep: true,
        // },
    },
    methods: {
        startLottery() {
            if (!this.click) {
                return;
            }
            this.click = false;
            this.startRoll();
        },

        // 开始转动
        startRoll() {
            if(this.times === 0){
                setTimeout(() => {
                    this.prize = 3; //parseInt(Math.random() * 10, 0) || 0; //中奖位置
                }, 10000);
            }

            this.times += 1; // 转动次数
            this.oneRoll(); // 转动过程调用的每一次转动方法，这里是第一次调用初始化
            // 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
            if (this.times > this.cycle + 10 && this.prize === this.index) {
                clearTimeout(this.timer); // 清除转动定时器，停止转动
                this.prize = -1;
                this.times = 0;
                this.speed = 200;
                this.click = true;
                setTimeout((res) => {
                    this.$toast(this.list[this.index].title);
                }, 500);
            } else {
                if (this.times < this.cycle) {
                    this.speed -= 10; // 加快转动速度
                } else if (this.times === this.cycle) {
                    if (this.prize > 7) {
                        this.prize = 7;
                    }
                } else if (
                    this.times > this.cycle + 10 &&
                    ((this.prize === 0 && this.index === 7) ||
                        this.prize === this.index + 1)
                ) {
                    this.speed += 110;
                } else {
                    this.speed += 20;
                }
                if (this.speed < 40) {
                    this.speed = 40;
                }
                this.timer = setTimeout(this.startRoll, this.speed);
            }
        },

        // 每一次转动
        oneRoll() {
            let index = this.index; // 当前转动到哪个位置
            const count = this.count; // 总共有多少个位置
            index += 1;
            if (index > count - 1) {
                index = 0;
            }
            this.index = index;
        },

        //关闭
        onClose() {
            this.showLuckDraw = false;
            this.$emit("update:show", false);
        },
    },
};
</script>
<style lang="scss" scoped>
.lottery {
    overflow: hidden;
    padding: 20px;
    width: 400px;
    margin: 0 auto;
    .lottery-item {
        height: 340px;
        position: relative;
        .lottery-start {
            position: absolute;
            left: 33.33333333%;
            width: 33.33333333%;
            top: 110px;
            padding-right: 10px;
            .box {
                height: 100px;
                font-size: 14px;
                color: #fff;
                cursor: pointer;
                text-align: center;
                overflow: hidden;
                background: #333;
                background-size: 100% 100%;
            }
        }

        ul li {
            width: 33.33333333%;
            position: absolute;
            padding-right: 10px;
            &:nth-child(2) {
                left: 33.33333333%;
            }
            &:nth-child(3) {
                left: 66.66666666%;
            }
            &:nth-child(4) {
                left: 66.66666666%;
                top: 110px;
            }
            &:nth-child(5) {
                left: 66.66666666%;
                top: 220px;
            }
            &:nth-child(6) {
                left: 33.33333333%;
                top: 220px;
            }
            &:nth-child(7) {
                left: 0;
                top: 220px;
            }
            &:nth-child(8) {
                left: 0;
                top: 110px;
            }

            .box {
                height: 100px;
                font-size: 14px;
                color: #fff;
                cursor: pointer;
                text-align: center;
                overflow: hidden;
                background: #333;
                background-size: 100% 100%;
            }
            &.on {
                .box {
                    height: 100px;
                    position: relative;
                    text-align: center;
                    overflow: hidden;
                    background: #d92b2f;
                    background-size: 100% 100%;
                }
            }
        }
    }
}
</style>
     