<template>
    <popup
        v-model="showValue"
        position="bottom"
        height="290px"
        :closeIcon="false"
        :id="`cy-popup-picker-${uuid}`"
        @onClose="onHide(false)"
    >
        <slot name="header">
            <popup-header
                @onCancel="onHide(false)"
                @onConfirm="onHide(true)"
                :cancelText="cancelText || '取消'"
                :confirmText="confirmText || '确认'"
                :title="title"
            ></popup-header>
        </slot>
        <picker
            :data="data"
            v-model="tempValue"
            :columns="columns"
            :displayColumns="displayColumns"
            :container="`#cy-popup-picker-${uuid}`"
            :columnWidth="columnWidth"
        ></picker>
    </popup>
</template>


<script>
import Picker from "../_global/picker";
import Popup from "../_global/popup";
import PopupHeader from "../popup_header";
import value2name from "../../utils/value2name";

const getObject = function(obj) {
    return JSON.parse(JSON.stringify(obj));
};

export default {
    name: "cy-popup-picker",

    created() {
        if (typeof this.show !== "undefined") {
            this.showValue = this.show;
        }
    },
    components: {
        Picker,
        Popup,
        PopupHeader
    },
    props: {
        show: Boolean,
        cancelText: String,
        confirmText: String,
        title: String,
        data: {
            type: Array,
            default() {
                return [];
            }
        },
        value: {
            type: Array,
            default() {
                return [];
            }
        },
        columns: {
            type: Number,
            default: 0
        },
        displayColumns: {
            type: Number,
            default: 0
        },
        columnWidth: Array,
        popupTitle: String
    },
    data() {
        return {
            uuid: Math.random()
                .toString(36)
                .substring(3, 8),
            tempValue: getObject(this.value),
            currentData: JSON.stringify(this.data),
            showValue: false,
            currentValue: this.value
        };
    },
    methods: {
        getNameValues() {
            return value2name(this.currentValue, this.data);
        },
        onHide(type) {
            this.showValue = false;
            if (type) {
                this.currentValue = getObject(this.tempValue);
            }
            if (!type) {
                if (this.value.length > 0) {
                    this.tempValue = getObject(this.currentValue);
                }
            }
        }
    },
    watch: {
        value(val) {
            if (JSON.stringify(val) !== JSON.stringify(this.tempValue)) {
                this.tempValue = getObject(val);
                this.currentValue = getObject(val);
            }
        },
        currentValue(val) {
            this.$emit("input", getObject(val));
            const _val = getObject(val);
            this.$emit("onChange", _val, this.getNameValues(_val, this.data));
        },
        show(val) {
            this.showValue = val;
        },
        showValue(val) {
            this.$emit("update:show", val);
        }
    }
};
</script>

