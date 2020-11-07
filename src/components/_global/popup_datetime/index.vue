<template>
    <div style="display:none"
        class="weui-cell__ft cy-cell-primary cy-datetime-value"
        :style="{textAlign: valueTextAlign}"
    >
        <span class="cy-cell-placeholder" v-if="!currentValue && placeholder">{{ placeholder }}</span>
        <span
            class="cy-cell-value"
            v-if="currentValue"
        >{{ displayFormat ? displayFormat(currentValue) : currentValue }}</span>
    </div>
</template>

<script>
import Picker from "./datetimepicker";
import format from "./format";

export default {
    name: "cy-popup-datetime",
    props: {
        format: {
            type: String,
            default: "YYYY-MM-DD",
            validator(val) {
                /* istanbul ignore if */
                if (
                    process.env.NODE_ENV === "development" &&
                    val &&
                    /A/.test(val) &&
                    val !== "YYYY-MM-DD A"
                ) {
                    return console.error(
                        "Datetime prop:format 使用 A 时只允许的值为： YYYY-MM-DD A"
                    );
                }
                return true;
            }
        },
        title: String,
        value: {
            type: String,
            default: ""
        },
        inlineDesc: String,
        placeholder: String,
        minYear: Number,
        maxYear: Number,
        confirmText: {
            type: String,
            default: "确认"
        },
        cancelText: {
            type: String,
            default: "取消"
        },
        clearText: String,
        yearRow: {
            type: String,
            default: "{value}"
        },
        monthRow: {
            type: String,
            default: "{value}"
        },
        dayRow: {
            type: String,
            default: "{value}"
        },
        hourRow: {
            type: String,
            default: "{value}"
        },
        minuteRow: {
            type: String,
            default: "{value}"
        },
        required: {
            type: Boolean,
            default: false
        },
        minHour: {
            type: Number,
            default: 0
        },
        maxHour: {
            type: Number,
            default: 23
        },
        startDate: {
            type: String,
            validator(val) {
                /* istanbul ignore if */
                if (
                    process.env.NODE_ENV === "development" &&
                    val &&
                    val.length !== 10
                ) {
                    console.error(
                        "Datetime prop:start-date 必须为 YYYY-MM-DD 格式"
                    );
                }
                return val ? val.length === 10 : true;
            }
        },
        endDate: {
            type: String,
            validator(val) {
                /* istanbul ignore if */
                if (
                    process.env.NODE_ENV === "development" &&
                    val &&
                    val.length !== 10
                ) {
                    console.error(
                        "Datetime prop:end-date 必须为 YYYY-MM-DD 格式"
                    );
                }
                return val ? val.length === 10 : true;
            }
        },
        valueTextAlign: String,
        displayFormat: Function,
        readonly: Boolean,
        hourList: Array,
        minuteList: Array,
        show: Boolean,
        defaultSelectedValue: String,
        computeHoursFunction: Function,
        computeDaysFunction: Function,
        orderMap: Object
    },
    created() {
        this.isFirstSetValue = false;
        this.currentValue = this.value;
    },
    data() {
        return {
            uuid: Math.random()
                .toString(36)
                .substring(3, 8),
            currentShow: false,
            currentValue: null,
            valid: true,
            errors: {}
        };
    },
    mounted() {
        const uuid = this.uuid;
        this.$el.setAttribute("id", `cy-datetime-${uuid}`);
        if (!this.readonly) {
            this.$nextTick(() => {
                this.render();
                
                if (this.show) {
                    this.$nextTick(() => {
                        this.picker && this.picker.show(this.currentValue);
                    });
                }
            });
        }
    },
    computed: {
        styles() {
            if (!this.$parent) {
                return {};
            }
            return {
                width: this.$parent.labelWidth,
                textAlign: this.$parent.labelAlign,
                marginRight: this.$parent.labelMarginRight
            };
        },
        pickerOptions() {
            const _this = this;
            const options = {
                trigger: "#cy-datetime-" + this.uuid,
                format: this.format,
                value: this.currentValue,
                output: ".cy-datetime-value",
                confirmText: _this.getButtonText("confirm"),
                cancelText: _this.getButtonText("cancel"),
                clearText: _this.clearText,
                yearRow: this.yearRow,
                monthRow: this.monthRow,
                dayRow: this.dayRow,
                hourRow: this.hourRow,
                minuteRow: this.minuteRow,
                minHour: this.minHour,
                maxHour: this.maxHour,
                startDate: this.startDate,
                endDate: this.endDate,
                hourList: this.hourList,
                minuteList: this.minuteList,
                defaultSelectedValue: this.defaultSelectedValue,
                computeHoursFunction: this.computeHoursFunction,
                computeDaysFunction: this.computeDaysFunction,
                orderMap: this.orderMap || {},
                onSelect(type, val, wholeValue) {
                    if (_this.picker && _this.picker.config.renderInline) {
                        _this.$emit("input", wholeValue);
                        _this.$emit("onChange", wholeValue);
                    }
                },
                onConfirm(value) {
                    _this.currentValue = value;
                },
                onClear(value) {
                    _this.$emit("on-clear", value);
                },
                onHide(type) {
                    _this.currentShow = false;
                    _this.$emit("update:show", false);
                    _this.validate();
                    _this.$emit("onHide", type);
                    if (type === "cancel") {
                        _this.$emit("onCancel");
                    }
                    if (type === "confirm") {
                        setTimeout(() => {
                            _this.$nextTick(() => {
                                _this.$emit("onConfirm", _this.value);
                            });
                        });
                    }
                },
                onShow() {
                    _this.currentShow = true;
                    _this.$emit("update:show", true);
                    _this.$emit("onShow");
                }
            };
            if (this.minYear) {
                options.minYear = this.minYear;
            }
            if (this.maxYear) {
                options.maxYear = this.maxYear;
            }
            return options;
        },
        firstError() {
            let key = Object.keys(this.errors)[0];
            return this.errors[key];
        },
        labelClass() {
            if (!this.$parent) {
                return {};
            }
            return {
                "cy-cell-justify":
                    this.$parent.labelAlign === "justify" ||
                    this.$parent.$parent.labelAlign === "justify"
            };
        }
    },
    methods: {
        getButtonText(type) {
            if (type === "cancel" && this.cancelText) {
                return this.cancelText;
            } else if (type === "confirm" && this.confirmText) {
                return this.confirmText;
            }
            return this.$el.getAttribute(`data-${type}-text`);
        },
        render() {
            this.$nextTick(() => {
                this.picker && this.picker.destroy();
                this.picker = new Picker(this.pickerOptions);
            });
        },
        validate() {
            if (!this.currentValue && this.required) {
                this.valid = false;
                this.errors.required = "必填";
                return;
            }
            this.valid = true;
            this.errors = {};
        }
    },
    watch: {
        readonly(val) {
            if (val) {
                this.picker && this.picker.destroy();
            } else {
                this.render();
            }
        },
        show(val) {  
            if (val === this.currentShow) return;
            if (val) {
                this.picker && this.picker.show(this.currentValue);
            } else {
                this.picker && this.picker.hide(this.currentValue);
            }
        },
        currentValue(val, oldVal) {
            this.$emit("input", val);
            if (!this.isFirstSetValue) {
                this.isFirstSetValue = true;
                oldVal && this.$emit("onChange", val);
            } else {
                this.$emit("onChange", val);
            }
            this.validate();
        },
        startDate() {
            this.render();
        },
        endDate() {
            this.render();
        },
        format(val) {
            if (this.currentValue) {
                this.currentValue = format(this.currentValue, val);
            }
            this.render();
        },
        value(val) {
            // do not force render when renderInline is true
            if (
                this.readonly ||
                (this.picker && this.picker.config.renderInline)
            ) {
                this.currentValue = val;
                return;
            }
            if (this.currentValue !== val) {
                this.currentValue = val;
                this.render();
            }
        }
    },
    beforeDestroy() {
        this.picker && this.picker.destroy();
    }
};
</script>

<style lang="scss">

.dp-container {
    &.cy-datetime-view {
        position: static;
        transition: none;
        & .dp-header {
            display: none;
        }
    }
}

.cy-datetime-clear {
    text-align: center;
}

.dp-container {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    z-index: 10000;
    background-color: #fff;
    transition: transform 0.3s ease;
    transform: translateY(100%);
    &.cy-datetime-container-active {
        transform: translateY(0);
    }
}

.dp-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    opacity: 0;
    transition: opacity 0.2s ease-in;
    background-color: #000;
    z-index: 9999;
}

.dp-header {
    display: flex;
    width: 100%;
    box-align: center;
    align-items: center;
    background-image: linear-gradient(
        to bottom,
        #e7e7e7,
        #e7e7e7,
        transparent,
        transparent
    );
    background-position: bottom;
    background-size: 100% 1px;
    background-repeat: no-repeat;
}

.dp-header .dp-item {
    color: #333;
    font-size: 16px;
    height: 44px;
    line-height: 44px;
    cursor: pointer;
}

.dp-header .dp-item.dp-left {
    color: #333;
}

.dp-header .dp-item.dp-right {
    color: #1C71FA;
}

.dp-content {
    display: flex;
    width: 100%;
    box-align: center;
    align-items: center;
    padding: 10px 0;
}

.dp-header .dp-item,
.dp-content .dp-item {
    box-sizing: border-box;
    flex: 1;
}
.cy-datetime-cancel {
    text-align: left;
    padding-left: 15px;
}
.cy-datetime-confirm {
    text-align: right;
    padding-right: 15px;
}
.cy-datetime {
    color: #000;
    text-decoration: none;
}
.cy-datetime .cy-input-icon {
    float: right;
}
.cy-cell-primary {
    flex: 1;
}
</style>
