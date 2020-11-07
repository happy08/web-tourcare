<template>
    <cy-popup
        v-model="showValue"
        position="bottom"
        height="auto"
        overlay="transparent"
        background="#eaebec"
        :closeIcon="false"
    >
        <div class="cy-carkeyboard">
            <div class="cy-carkeyboard-province" v-if="keyboardType === 'province'">
                <div
                    v-for="(item,index) in provinces"
                    :key="item"
                    :class="['cy-carKeyboard-item',`cy-carKeyboard-item-letter-${index}`]"
                >
                    <div class="text" @click.stop="handleTapProvince(item)">{{item}}</div>
                </div>
            </div>
            <div v-if="keyboardType === 'letter'">
                <div class="cy-carkeyboard-lastletter">
                    <div
                        v-for="(item,index) in lastLetters"
                        :key="item"
                        class="cy-carKeyboard-item"
                    >
                        <div class="text" @click.stop="handleTapLetter(index,item)">{{item}}</div>
                    </div>
                </div>
                <div class="cy-carkeyboard-letter">
                    <div
                        v-for="(item,index) in letters"
                        :key="item"
                        :class="['cy-carKeyboard-item',`cy-carkeyboard-item-${index}`]"
                    >
                        <div class="text" @click.stop="handleTapLetter(index,item)">{{item}}</div>
                    </div>
                </div>
            </div>
        </div>
    </cy-popup>
</template>
<script>
import cyPopup from "../_global/popup";

export default {
    name: "cy-keyboard-car",
    components: {
        cyPopup
    },
    props: {
        value: String,
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            showValue: false,
            carNo: "",
            keyboardType: "province", // 键盘类型 province 简称 letter 数字字母
            provinces: [
                "京",
                "津",
                "冀",
                "晋",
                "蒙",
                "辽",
                "吉",
                "黑",
                "沪",
                "苏",
                "浙",
                "皖",
                "闽",
                "赣",
                "鲁",
                "豫",
                "鄂",
                "湘",
                "粤",
                "桂",
                "琼",
                "陕",
                "甘",
                "青",
                "宁",
                "新",
                "渝",
                "川",
                "贵",
                "云",
                "藏",
                "台",
                "确定"
            ],
            lastLetters: ["港", "澳", "学", "警", "领"],
            letters: [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                0,
                "Q",
                "W",
                "E",
                "R",
                "T",
                "Y",
                "U",
                "I",
                "O",
                "P",
                "A",
                "S",
                "D",
                "F",
                "G",
                "H",
                "J",
                "K",
                "L",
                "",
                "Z",
                "X",
                "C",
                "V",
                "B",
                "N",
                "M",
                "确定"
            ]
        };
    },
    created() {
        this.showValue = this.show;
    },
    watch: {
        value(val) {
            this.carNo = val;
            if (this.carNo && this.carNo.length === 0) {
                //this.showValue = false;
                this.keyboardType = "province";
            }
        },
        show(val) {
            this.showValue = val;
        },
        showValue(val) {
            this.$emit("update:show", val);
        },
        carNo(val) {
            this.$emit("input", val);
        }
    },
    computed: {},
    methods: {
        // 输入省份
        handleTapProvince: function(text) {
            if (text === "确定") {
                // 确定，触发键盘隐藏
                this.showValue = false;
                //this.keyboardType = "province";
            } else {
                this.carNo = text;
                this.keyboardType = "letter";
            }
        },

        // 输入港澳台及数字字母
        handleTapLetter: function(id, text) {
            if (id === 17 || id === 18) {
                //禁止 I  O
                return;
            }
            if (id === 29) {
                // 删除
                this.carNo = this.carNo.substr(0, this.carNo.length - 1);
                if (this.carNo.length === 0) {
                    // 字符长度为0则切换到简称键盘
                    this.keyboardType = "province";
                }
            } else if (id === 37) {
                // 确定，触发键盘隐藏
                this.showValue = false;
                //this.keyboardType = "province";
            } else {
                if (this.carNo.length > 7) {
                    // 最多8位
                    this.showValue = false;
                    // setTimeout(() => {
                    //     this.keyboardType = "province";
                    // }, 500);
                } else {
                    // 普通输入
                    this.carNo = this.carNo + text;
                }
            }
        }
    }
};
</script>

<style lang="scss">
.cy-carkeyboard {
    height: 100%;
    background-color: #d0d3da;
}
.cy-carkeyboard-province,
.cy-carkeyboard-letter,
.cy-carkeyboard-lastletter {
    display: flex;
    flex-flow: wrap;
    justify-content: flex-start;
    padding: 5px 0px;
}

.cy-carkeyboard-lastletter {
    padding-bottom: 0;
}

.cy-carkeyboard-letter {
    padding-top: 0;
}

.cy-carKeyboard-item {
    padding: 5px 3px;
    width: 14.285%;
    -webkit-touch-callout: none; /*系统默认菜单被禁用*/
    -webkit-user-select: none; /*webkit浏览器*/
    user-select: none;
}

.cy-carKeyboard-item .text {
    position: relative;
    display: block;
    height: 100%;
    width: 100%;
    border-radius: 4px;
    background: #fff;
    font-size: 16px;
    color: #000;
    line-height: 36px;
    text-align: center;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);
}

.cy-carkeyboard-item-17 .text {
    background: #f2f2f2;
    color: #666;
}
.cy-carkeyboard-item-18 .text {
    background: #f2f2f2;
    color: #666;
}

.cy-carKeyboard-item .text:active {
    background: #f2f2f2;
}

.cy-carkeyboard-letter .cy-carKeyboard-item {
    position: relative;
    padding: 5px 3px;
    width: 10%;
}

.cy-carkeyboard-item-29 .text {
    height: 36px;
}

.cy-carkeyboard-item-29:before,
.cy-carkeyboard-item-29:after {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    content: "";
}

.cy-carkeyboard-item-29:before {
    width: 10px;
    height: 1px;
    background: #454545;
    transform: translate(-50%, 0);
}

.cy-carkeyboard-item-29:after {
    width: 8px;
    height: 8px;
    border-top: 1px solid #454545;
    border-left: 1px solid #454545;
    transform: rotate(-45deg) translate(-2px, -7px);
}

.cy-carkeyboard-letter .cy-carkeyboard-item-37 {
    width: 30%;
}
.cy-carkeyboard-province .cy-carKeyboard-item-letter-32 {
    width: 42.855%;
}
.cy-carkeyboard-item-37 .text,
.cy-carKeyboard-item-letter-32 .text {
    background: #3f8bfd;
    color: #fff;
}
.cy-carkeyboard-item-37 .text:active {
    background: #f2f2f2;
    color: #000;
}
</style>