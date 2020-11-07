<template>
    <div :class="['cy-checkboxgroup', { vertical: vertical }]">
        <div class="cy-checkbox-item" v-for="(item, index) in checkBoxData" :key="item[keys.id]">
            <cy-checkbox
                :name="name || item[keys.name]"
                :disabled="disabled || item[keys.disabled]"
                :label="item[keys.label]"
                :id="item[keys.id]"
                :checked.sync="item.checked"
                :size="size"
                :round="round"
                :background="background"
                v-model="checkboxValues[index]"
                @onChange="handleChange(arguments, item)"
            >{{ item[keys.label] || item[keys.value] || item }}</cy-checkbox>
        </div>
    </div>
</template>
<script>
import cyCheckbox from "../checkbox";
import { isObject } from "../../utils/isDataType";

export default {
    name: "cy-checkboxgroup",
    components: {
        cyCheckbox
    },
    props: {
        name: String,
        checkBoxData: {
            type: Array,
            required: true
        },
        value: {
            type: Array,
            required: true
        },
        keys: {
            type: Object,
            default() {
                return {
                    id: "id",
                    name: "name",
                    class: "class",
                    label: "label",
                    value: "value",
                    disabled: "disabled"
                };
            }
        },
        label: {
            type: [String, Number, Boolean],
            default: ""
        },
        disabled: {
            type: Boolean,
            default: false
        },
        size: [String, Number],
        round: String,
        background: [String, Array],
        vertical: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            ignoreChange: false,
            checkboxValues: [],
            initialValue: []
        };
    },
    watch: {
        value() {
            this.init();
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.initialValue = this.value;
            this.checkBoxData.map(item => {
                if (isObject(item)) {
                    item.checked = this.isOptionCheckedByDefault(item);
                }
            });
        },
        isOptionCheckedByDefault(item) {
            return (
                this.looseIndexOf(
                    this.initialValue,
                    item[this.keys.value] || item
                ) > -1
            );
        },
        looseIndexOf(arr, val) {
            for (let i = 0; i < arr.length; i++) {
                console.log("arr[i], val", arr[i], val);
                if (this.looseEqual(arr[i], val)) {
                    return i;
                }
            }
            return -1;
        },
        looseEqual(a, b) {
            return (
                a == b ||
                (isObject(a) && isObject(b)
                    ? JSON.stringify(a) === JSON.stringify(b)
                    : false)
            );
        },
        handleChange(args, item) {
            if (this.ignoreChange) {
                return;
            }
            const checked = args[0];
            const label = args[1];
            const e = args[2];
            let value = [];
            const itemValue = item[this.keys.value] || item;
            const i = this.looseIndexOf(this.value, itemValue);
            if (checked && i < 0) {
                value = this.value.concat(itemValue);
            }
            if (!checked && i > -1) {
                value = this.value.slice(0, i).concat(this.value.slice(i + 1));
            }
            this.$emit("input", value);
            this.$emit("onChange", value, label, e);
        },
        toggleAll(checked) {
            if (checked === false) {
                this.$emit("input", []);
                return;
            }
            if (checked === true) {
                this.checkBoxData.map(item => {
                    item.checked = true;
                });
            }
            if (!checked) {
                this.checkBoxData.map(item => {
                    item.checked = !item.checked;
                });
            }
            let value = [],
                label = [];
            let resData = this.checkBoxData.filter(item => {
                if (item.checked) {
                    value.push(item.value);
                    label.push(item.label);
                }
                return item.checked;
            });
            this.$emit("input", value);
            this.$emit("onChange", value, label, null);
        }
    }
};
</script>
<style lang="scss">
.cy-checkboxgroup {
    .cy-checkbox-item {
        display: flex;
        align-items: center;
        margin-right: 15px;
        padding: 3px 0;
        .cy-checkbox,
        label {
            display: inline-block;
            margin: 0;
            vertical-align: middle;
        }
    }
    &.vertical {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
}
</style>
