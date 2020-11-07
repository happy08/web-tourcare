<template>
    <label class="cy-checkbox">
        <input
            :class="['cy-checkbox-input',{'cy-checkbox-round':round}]"
            type="checkbox"
            :name="name"
            :disabled="disabled"
            :checked.prop="isChecked"
            :value="submittedValue"
            :style="style"
            @change="onChange"
        />
        <span
            :class="['cy-checkbox-label',{'cy-checkbox-disabled':disabled}]"
            v-if="label"
        >{{label}}</span>
        <span :class="['cy-checkbox-label',{'cy-checkbox-disabled':disabled}]" v-else>
            <slot></slot>
        </span>
    </label>
</template>
<script>
export default {
    name: "cy-checkbox",
    props: {
        name: {
            type: String
        },
        label: {
            type: String,
            default: ""
        },
        value: {
            required: true
        },
        trueValue: {
            default: true
        },
        falseValue: {
            default: false
        },
        submittedValue: {
            type: String,
            default: "on" // HTML default
        },
        checked: {
            type: Boolean,
            default: false
        },
        round: {
            type: Boolean,
            default: false
        },
        background: {
            type: [String, Array],
            default: "#f12"
        },
        size: {
            type: [String, Number]
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isChecked: this.value == this.trueValue || this.checked
        };
    },
    watch: {
        value() {
            this.isChecked = this.looseEqual(this.value, this.trueValue);
        },
        checked(newValue, oldValue) {
            this.isChecked = newValue;
        }
    },
    computed: {
        style() {
            let style = {
                "--pseudoElementBgColor": "#ff3",
                "--pseudoElementColor": "#f43"
            };
            let background = this.background;
            if (background) {
                if (Array.isArray(background)) {
                    style[
                        "--pseudoElementBgColor"
                    ] = `linear-gradient(90deg, ${background[0]}, ${background[1]})`;
                    style["--pseudoElementColor"] = background[0];
                } else {
                    style["--pseudoElementBgColor"] = background;
                    style["--pseudoElementColor"] = background;
                }
            }
            if (this.size) {
                style.width = `${this.size}px`;
                style.height = `${this.size}px`;
            }

            return style;
        }
    },
    mounted() {
        this.$emit(
            "update:checked",
            this.isChecked ? this.trueValue : this.falseValue,
            this.label
        );
        this.$emit(
            "input",
            this.isChecked ? this.trueValue : this.falseValue,
            this.label
        );
    },
    methods: {
        isObject(obj) {
            return obj !== null && typeof obj === "object";
        },
        looseEqual(a, b) {
            return (
                a == b ||
                (this.isObject(a) && this.isObject(b)
                    ? JSON.stringify(a) === JSON.stringify(b)
                    : false)
            );
        },
        onChange(event) {
            const isCheckedPrevious = this.isChecked;
            const isChecked = event.target.checked;

            this.$emit(
                "input",
                isChecked ? this.trueValue : this.falseValue,
                this.label,
                event
            );
            if (isCheckedPrevious !== isChecked) {
                this.$emit(
                    "onChange",
                    isChecked ? this.trueValue : this.falseValue,
                    this.label,
                    event
                );
            }
        }
    }
};
</script>
<style lang="scss">
@import "../../assets/css/_variable";
@import "../../assets/css/_mixin";

.cy-checkbox {
    display: inline-flex;
    align-items: center;
    line-height: 1;
    .cy-checkbox-label {
        padding-left: 3px;
        font-size: 15px;
        pointer-events: none;
        vertical-align: middle;
    }
    .cy-checkbox-disabled {
        color: #999999;
    }
    .cy-checkbox-input {
        position: relative;
        width: 19px;
        height: 19px;
        border: 1px solid transparent;
        -webkit-appearance: none;
        background-size: 100%;
        background-position: center;
        outline: 0;
        opacity: 1;
        vertical-align: middle;
        margin-top: 0px;
        border-color: var(--pseudoElementColor);
        &.cy-checkbox-round {
            border-radius: 50%;
        }
        &:checked {
            background: var(--pseudoElementBgColor);
            &:before {
                content: "";
                position: absolute;
                width: 100%;
                height: 90%;
                top: 10%;
                background-size: 100%;
                opacity: 1;
                pointer-events: none;
                z-index: 2;
                transform: scale(0.7);
                @include setRadioBg("FFFFFF");
            }
        }
        &:disabled {
            overflow: hidden;
            border-color: #ccc !important;
            background: #e1e1e1 !important;
            &:before {
                box-shadow: none;
                @include setRadioBg("aaaaaa");
            }
        }
        &.cy-checkbox-round:after {
            border-radius: 50%;
        }
        &:after {
            position: absolute;
            left: 50%;
            top: 50%;
            content: "";
            width: 0;
            height: 0;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            background: var(--pseudoElementBgColor);
            opacity: 0;
            pointer-events: none;
        }
        &:checked:not(:disabled):after {
            animation: cy-zoom-none 0.3s;
        }
    }
}
</style>