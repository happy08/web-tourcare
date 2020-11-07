<!--选择器-->
<template>
    <div class="cy-picker">
        <cy-row :gutter="0" v-if="currentData.length>0">
            <cy-col
                :span="columnWidth && columnWidth[index]"
                v-for="(one, index) in currentData"
                :key="index"
                style="margin-left:0;"
            >
                <div class="cy-picker-item" :id="`cy-picker-${uuid}-${index}`"></div>
            </cy-col>
        </cy-row>
    </div>
</template>

<script>
import Scroller from "./scroller.js";
import cyRow from "../row";
import cyCol from "../row/col";
import Manager from "./chain";
import value2name from "../../../utils/value2name";
import { isArray } from "../../../utils/isDataType";

export default {
    name: "cy-picker",
    components: {
        cyRow,
        cyCol
    },
    props: {
        data: Array,
        columns: {
            type: Number,
            default: 0
        },
        displayColumns: {
            type: Number,
            default: 0
        },
        value: Array,
        itemClass: {
            type: String,
            default: "scroller-item"
        },
        columnWidth: Array
    },
    data() {
        return {
            scroller: [],
            count: 0,
            uuid: "",
            currentData: this.data,
            currentValue: this.value
        };
    },

    created() {
        if(this.data.length <= 0) return
        if (this.columns !== 0) {
            const length = this.columns;
            this.store = new Manager(
                this.data,
                length,
                this.displayColumns || this.columns
            );
            this.currentData = this.store.getColumns(this.value);
        }
    },
    mounted() {
        this.uuid = Math.random()
            .toString(36)
            .substring(3, 8);
        this.$nextTick(() => {
            this.render(this.currentData, this.currentValue);
        });
    },
    methods: {
        getNameValues() {
            return value2name(this.currentValue, this.data);
        },
        getId(i) {
            return `#cy-picker-${this.uuid}-${i}`;
        },
        render(data, value) {
            this.count = this.currentData.length;
            const _this = this;
            if (!data || !data.length) {
                return;
            }
            let count = this.currentData.length;
            // set first item as value
            if (value.length < count) {
                for (let i = 0; i < count; i++) {
                    if (
                        process.env.NODE_ENV === "development" &&
                        typeof data[i][0] === "undefined" &&
                        isArray(this.data) &&
                        this.data[0] &&
                        typeof this.data[0].value !== "undefined" &&
                        !this.columns
                    ) {
                        console.error(
                            "[error] 渲染出错，如果为联动模式，需要指定 columns(列数)"
                        );
                    }
                    this.$set(
                        _this.currentValue,
                        i,
                        data[i][0].value || data[i][0]
                    );
                }
            }

            for (let i = 0; i < data.length; i++) {
                /**
                 * Still don't know why this happens
                 */
                if (!document.querySelector(_this.getId(i))) {
                    return;
                }

                _this.scroller[i] && _this.scroller[i].destroy();
                _this.scroller[i] = new Scroller(_this.getId(i), {
                    data: data[i],
                    defaultValue: value[i] || data[i][0].value,
                    itemClass: _this.itemClass,
                    onSelect(value) {
                        _this.$set(_this.currentValue, i, value);
                        if (
                            !this.columns ||
                            (this.columns &&
                                _this.getValue().length === _this.store.count)
                        ) {
                            _this.$nextTick(() => {
                                _this.$emit("onChange", _this.getValue());
                            });
                        }
                        if (_this.columns !== 0) {
                            _this.renderChain(i + 1);
                        }
                    }
                });
                if (_this.currentValue) {
                    _this.scroller[i].select(value[i]);
                }
            }
        },
        renderChain(i) {
            if (!this.columns) {
                return;
            }

            // do not render for last scroller
            if (i > this.count - 1) {
                return;
            }

            const _this = this;
            let ID = this.getId(i);
            // destroy old one
            this.scroller[i].destroy();
            let list = this.store.getChildren(_this.getValue()[i - 1]);
            this.scroller[i] = new Scroller(ID, {
                data: list,
                itemClass: _this.item_class,
                onSelect(value) {
                    _this.$set(_this.currentValue, i, value);
                    _this.$nextTick(() => {
                        _this.$emit("onChange", _this.getValue());
                    });
                    _this.renderChain(i + 1);
                }
            });
            // list is Array(empty) as maybe
            if (list.length) {
                this.$set(this.currentValue, i, list[0].value);
                this.renderChain(i + 1);
            } else {
                this.$set(this.currentValue, i, null);
            }
        },
        getValue() {
            let data = [];
            for (let i = 0; i < this.currentData.length; i++) {
                if (this.scroller[i]) {
                    data.push(this.scroller[i].value);
                } else {
                    return [];
                }
            }
            return data;
        },
        emitValueChange(val) {
            if (
                !this.columns ||
                (this.columns && val.length === this.store.count)
            ) {
                this.$emit("onChange", val);
            }
        }
    },
    watch: {
        value(val) {
            if (JSON.stringify(val) !== JSON.stringify(this.currentValue)) {
                this.currentValue = val;
            }
        },
        currentValue(val, oldVal) {
            this.$emit("input", val);
            // render all the scroller for chain datas
            if (this.columns !== 0) {
                if (val.length > 0) {
                    if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
                        this.currentData = this.store.getColumns(val);
                        this.$nextTick(function() {
                            this.render(this.currentData, val);
                        });
                    }
                } else {
                    this.render(this.currentData, []);
                }
            } else {
                if (val.length) {
                    for (let i = 0; i < val.length; i++) {
                        if (
                            this.scroller[i] &&
                            this.scroller[i].value !== val[i]
                        ) {
                            this.scroller[i].select(val[i]);
                        }
                    }
                } else {
                    this.render(this.currentData, []);
                }
            }
        },
        data(val) {
            if (JSON.stringify(val) !== JSON.stringify(this.currentData)) {
                this.currentData = val;
            }
        },
        currentData(newData) {
            if (isArray(newData[0])) {
                this.$nextTick(() => {
                    this.render(newData, this.currentValue);
                    // emit change after rerender
                    this.$nextTick(() => {
                        this.emitValueChange(this.getValue());

                        if (
                            JSON.stringify(this.getValue()) !==
                            JSON.stringify(this.currentValue)
                        ) {
                            if (
                                !this.columns ||
                                (this.columns &&
                                    this.getValue().length === this.store.count)
                            ) {
                                this.currentValue = this.getValue();
                            }
                        }
                    });
                });
            } else {
                if (this.columns !== 0) {
                    if (!newData.length) {
                        return;
                    }
                    const length = this.columns;
                    this.store = new Manager(
                        newData,
                        length,
                        this.displayColumns || this.columns
                    );
                    this.currentData = this.store.getColumns(this.currentValue);
                }
            }
        }
    },
    beforeDestroy() {
        for (let i = 0; i < this.count; i++) {
            this.scroller[i] && this.scroller[i].destroy();
            this.scroller[i] = null;
        }
    }
};
</script>
<style lang="scss">
.scroller-component {
    display: block;
    position: relative;
    height: 220px;
    overflow: hidden;
    width: 100%;
    background-color: #ffffff;
}
.scroller-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1;
}
.scroller-mask {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    margin: 0 auto;
    width: 100%;
    z-index: 3;
    transform: translateZ(0px);
    background-image: -webkit-linear-gradient(
            to top,
            rgba(255, 255, 255, 1),
            rgba(255, 255, 255, 0.3)
        ),
        -webkit-linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.3));
    background-image: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 1),
            rgba(255, 255, 255, 0.3)
        ),
        linear-gradient(
            to top,
            rgba(255, 255, 255, 1),
            rgba(255, 255, 255, 0.3)
        );
    background-position: top, bottom;
    background-size: 100% 90px;
    background-repeat: no-repeat;
}
.scroller-item {
    text-align: center;
    font-size: 16px;
    height: 44px;
    line-height: 44px;
    color: #000;
}
.scroller-indicator {
    width: 100%;
    height: 44px;
    margin-top: -22px;
    position: absolute;
    left: 0;
    border-top: solid 1px rgba(0, 0, 0, 0.05);
    border-bottom: solid 1px rgba(0, 0, 0, 0.05);
    top: 50%;
    z-index: 3;
}
.scroller-item {
    line-clamp: 1;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>

