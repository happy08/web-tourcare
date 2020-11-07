<template>
    <div class="cy-stepper">
        <span @click="reduce" :class="{'cy-stepper-grey': isRDisable}">-</span>
        <input
            type="number"
             pattern="[0-9]*"
            :min="minNum"
            :max="max"
            :readonly="readonly"
            :value="num | maxv(minNum, max)"
            @focus="focus"
            @blur="blur"
        />
        <span @click="add" :class="{'cy-stepper-grey': isADisable}">+</span>
    </div>
</template>
<script>
import { add, sub } from "@/utils/number";

export default {
    name: "cy-stepper",
    props: {
        min: {
            type: [Number, String],
            default: 0
        },
        max: {
            type: [Number, String],
            default: Infinity
        },
        step: {
            type: [Number, String],
            default: 1
        },
        readonly: {
            type: Boolean,
            default: false
        },
        value: {
            type: [Number, String],
            required: true
        }
    },
    data() {
        return {
            tempNum: "",
            focusing: false,
            num: this.value,
            minNum: this.min
        };
    },
    filters: {
        maxv(v, min, max) {
            let val = v;
            if (val > max) val = max;
            if (val < min) val = min;
            return val;
        }
    },
    watch: {},
    computed: {
        isRDisable() {
            return (
                sub(this.focusing ? this.tempNum : this.num, this.step) <
                this.min
            );
        },
        isADisable() {
            return this.max && Number(this.num) > sub(this.max , this.step);
        }
    },
    methods: {
        focus(e) {
            if (this.readonly) return;
            const v = this.num;
            this.tempNum = v;
            this.minNum = "";
            this.focusing = true;
            this.$emit("input", this.num);
        },

        blur(e) {
            if (this.readonly) return;
            let v = e.target.value;
            this.minNum = this.min;
            this.focusing = false;
            if (v) {
                if (v > this.max) v = this.max;
                if (v < this.minNum) v = this.minNum;
                this.num = v;
            } else {
                this.num = this.tempNum;
            }
            this.$emit("input", this.num);
        },

        add() {
            this.num = Number(this.num);
            if (
                this.num <= sub(this.max, this.step) &&
                this.max > this.minNum
            ) {
                this.num = add(this.num, Number(this.step));
                this.$emit("input", this.num);
            }
        },

        reduce() {
            if (sub(this.num, this.step) >= this.minNum) {
                this.num = sub(this.num, Number(this.step));
                this.$emit("input", this.num);
            }
        }
    }
};
</script>
<style lang="scss">
.cy-stepper {
    min-width: 100px;
    min-height: 30px;
    display: flex;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    span {
        color: #888888;
        font-size: 20px;
        line-height: 1;
        background: #f3f3f3;
        width: 33%;
        text-align: center;
        cursor: pointer;
        padding: 0;
        box-sizing: border-box;
        -webkit-user-select: none;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    input {
        margin: 0 2px;
        border: none;
        width: 34%;
        text-align: center;
        background: #f3f3f3;
        border-radius: 0;
        padding: 0;
        appearance: none;
        box-sizing: border-box;
        outline: none;
        font-family: initial;
        font-size: 16px;
        color: #111111;
    }
    .cy-stepper-grey {
        color: #ccc;
    }
}
</style>