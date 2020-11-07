<template>
    <label :class="['cy-radio',$slots.default || 'no-text']" @click="onClick">
        <input
            class="cy-radio-input"
            type="radio"
            :value="currentValue"
            :checked="currentValue === label"
            :disabled="isDisabled"
            :label="label"
            :style="style"
        />
        <span v-show="$slots.default" :class="['cy-radio-label',isDisabled && 'cy-radio-disabled']">
            <slot></slot>
        </span>
    </label>
</template>
<script>
export default {
    name: "cy-radio",
    props: {
        value: {
            type: [String, Number, Boolean],
            default: false
        },
        label: [String, Number, Boolean],
        background: [String, Array],
        size: [String, Number],
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            parent: null
        };
    },
    computed: {
        currentValue: {
            get() {
                return this.parent ? this.parent.value : this.value;
            },
            set(val) {
                (this.parent || this).$emit("input", val);
            }
        },
        isDisabled() {
            return this.parent
                ? this.parent.disabled || this.disabled
                : this.disabled;
        },
        style() {
            let style = {
                "--pseudoElementBgColor": "#f63",
                "--pseudoElementColor": "#f63"
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
    created() {
        this.findCptUpward("cy-radiogroup");
    },
    methods: {
        onClick(event) {
            if (this.isDisabled) {
                return false;
            }
            this.currentValue = this.label;
        },
        findCptUpward(cptName) {
            let parentCpt = this.$parent;
            while (parentCpt) {
                if (parentCpt.$options.name === cptName) {
                    this.parent = parentCpt;
                    break;
                }
                parentCpt = parent.$parent;
            }
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/css/_variable";
@import "../../assets/css/_mixin";

.cy-radio {
    display: flex;
    align-items: center;
    margin-right: 10px;
    line-height: 1;
    &.no-text {
        margin-right: 0px;
    }
    .cy-radio-label {
        padding-left: 3px;
        font-size: 15px;
        pointer-events: none;
        vertical-align: middle;
    }
    .cy-radio-disabled {
        color: #999999;
    }
    .cy-radio-input {
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
        border-radius: 50%;
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
            border-radius: 50%;
            opacity: 0;
            pointer-events: none;
        }
        &:checked:not(:disabled):after {
            animation: cy-zoom-none 0.3s;
        }
    }
}
</style>