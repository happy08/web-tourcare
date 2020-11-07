<!--表单-->
<template>
    <div :class="['cy-field',theme?'cy-field-'+theme:'',{'cy-field-disabled':disabled}]">
        <cy-icon :type="labelIcon" v-if="!!labelIcon" size="18" class="cy-field-label-icon"></cy-icon>
        <span v-if="!!required" class="cy-field-required">*</span>
        <slot name="label">
            <div
                class="cy-field-label"
                :style="{'min-width': this.labelWidth ? this.labelWidth : ''}"
                v-if="label"
            >{{label}}</div>
        </slot>
        <div :class="['cy-field-inner',{'cy-field-margin0':!label && !labelIcon}]">
            <slot name="input">
                <input
                    class="cy-field-input"
                    :type="inputType"
                    :value="value"
                    :disabled="disabled"
                    @focus="onFocus"
                    @blur="onBlur"
                    v-bind="$attrs"
                    v-on="inputListeners"
                />
                <div class="cy-field-icon">
                    <cy-icon
                        type="close2"
                        color="#aaaaaa"
                        size="18"
                        class="cy-field-clear"
                        v-if="clearIcon"
                        v-show="clearIconShow"
                        @click.native="onClear"
                    ></cy-icon>
                    <cy-icon
                        :type="eyeType"
                        color="#999999"
                        size="18"
                        class="cy-field-eye"
                        v-if="eyeIconShow"
                        @click.native="onEye"
                    ></cy-icon>
                </div>
            </slot>
        </div>
        <div class="cy-field-btn" v-if="$slots.default">
            <slot></slot>
        </div>
    </div>
</template>
<script>
import cyIcon from "../icon";
export default {
    name: "cy-field",
    components: {
        cyIcon,
    },
    props: {
        theme: {
            type: String,
            default: "",
        },
        value: {
            type: [Number, String],
            default: "",
        },
        type: {
            type: String,
            default: "text",
        },
        required: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
            default: "",
        },
        labelIcon: {
            type: String,
            default: "",
        },
        labelWidth: {
            type: String,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        clearIcon: {
            type: Boolean,
            default: true,
        },
        eyeIcon: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            clearIconShow: false,
            eyeIconShow: true,
            inputType: "text",
        };
    },
    mounted() {
        //this.clearIconShow = !this.disabled && !!this.value;
        this.eyeIconShow = this.type === "password" && !!this.value;
        this.inputType = this.type;
    },
    methods: {
        onClear() {
            this.$emit("input", "");
            this.clearIconShow = false;
            this.eyeIconShow = false;
        },
        onEye() {
            this.inputType = this.inputType === "text" ? "password" : "text";
        },
        onFocus() {
            this.clearIconShow = true;
        },
        onBlur(e) {
            setTimeout(() => {
                this.clearIconShow = false;
            }, 50);
        },
    },
    computed: {
        inputListeners() {
            return Object.assign({}, this.$listeners, {
                input: (event) => {
                    this.clearIconShow = !!event.target.value;
                    this.eyeIconShow =
                        this.type === "password" && !!event.target.value;
                    this.$emit("input", event.target.value);
                },
            });
        },
        eyeType() {
            return this.inputType === "password" ? "eye" : "eye-close";
        },
    },
};
</script>
<style lang="scss">
@import "../../../assets/css/_mixin";

.cy-field {
    position: relative;
    display: flex;
    padding: 10px 15px;
    background: #ffffff;
    align-items: center;
    &:not(:last-child)::after {
        @include setBottomLine(#ebedf0);
    }
    &.cy-field-blue {
        background: rgba(0, 0, 0, 0);
        &:not(:last-child)::after {
            @include setBottomLine(#082f50);
        }
        .cy-field-label {
            color: #fff;
        }
        .cy-field-inner {
            .cy-field-input {
                color: #fff;
            }
        }
    }
    .cy-field-label-icon {
        margin: 0 3px;
    }
    .cy-field-label {
        min-width: 85px;
        display: flex;
        align-items: center;
    }
    .cy-field-inner {
        display: flex;
        flex: 1;
        align-items: center;
        position: relative;
        margin-left: 5px;
        min-height: 30px;
        &.cy-field-margin0 {
            margin-left: 0;
        }
        .cy-field-input {
            flex: 1;
            width: 100%;
            height: 30px;
            outline: none;
            font-size: inherit;
            &::-webkit-input-placeholder {
                color: #c1c4cb;
                font-style: normal;
            }
        }
        .cy-field-icon {
            display: flex;
            align-items: center;
            .cy-icon {
                margin-left: 8px;
            }
        }
    }

    .cy-field-btn {
        line-height: 1;
        margin-left: 8px;
    }
}
.cy-field-required {
    margin-top: 5px;
    padding-left: 5px;
    padding-right: 3px;
    color: #ee0a24;
    font-size: 14px;
    line-height: 0;
}
.cy-field-disabled {
    input {
        color: #444444;
        &::-webkit-input-placeholder {
            color: #7a7a7a;
        }
    }
}
</style>