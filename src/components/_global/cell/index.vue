<!--单元格-->
<template>
    <div :class="['cy-cell',theme?'cy-field-'+theme:'',{'cy-cell-link':!!link}]" @click="onClick">
        <div class="cy-cell-box">
            <div class="cy-cell-left">
                <cy-icon
                    class="cy-cell-left-icon"
                    :type="titleIcon"
                    v-if="!!titleIcon"
                    size="18"
                    color="#2C2C2C"
                />
                <div class="cy-cell-title">
                    <slot>
                        <div v-html="title"></div>
                        <span class="cy-cell-sub-title">
                            <slot name="sub-title">{{subTitle}}</slot>
                        </span>
                    </slot>
                </div>
            </div>
            <div class="cy-cell-right">
                <span class="cy-cell-desc">
                    <slot name="desc">{{desc}}</slot>
                </span>
                <span class="cy-cell-icon" v-if="!!link">
                    <slot name="icon">
                        <cy-icon type="youjiantou" color="#ccc" size="12" />
                    </slot>
                </span>
            </div>
        </div>
    </div>
</template>
<script>
import cyIcon from "../icon";

export default {
    name: "cy-cell",
    components: {
        cyIcon
    },
    props: {
        theme: {
            type: String,
            default: "",
        },
        title: {
            type: String,
            default: ""
        },
        titleIcon: {
            type: String,
            default: ""
        },
        link: {
            type: String,
            default: null
        },
        subTitle: {
            type: String,
            default: ""
        },
        desc: {
            type: String,
            default: ""
        }
    },
    data() {
        return {};
    },
    methods: {
        onClick() {
            if(this.link === 'javascript:;'){
                return
            }
            this.link && this.$utils.go(this.link, this.$router);
        }
    }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/css/_mixin";

/* Cell */
$cellFontSize: 15px;
$cellFontSizeSmall: 12px;

.cy-cell {
    position: relative;
    padding: 12px 15px;
    text-decoration: none;
    outline: none;
    background: #ffffff;
    &::after {
        @include setBottomLine(#ebedf0);
        left: 15px;
    }
    &.cy-cell-link:active {
        background-color: #f2f3f5 !important;
    }
    &.cy-field-blue {
        background: rgba(0, 0, 0, 0);
        &::after {
            @include setBottomLine(#0A4373);
            left: 32px;
        }
        .cy-cell-title {
            color: #fff;
        }
        .cy-cell-sub-title {
            color: #fff;
        }
        .cy-cell-right {
            color: #fff;
        }
         
    }
    .cy-cell-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 25px;
        .cy-cell-left-icon {
            margin-right: 5px;
        }
    }
    .cy-cell-left {
        display: flex;
        align-items: center;
        flex: 1;
    }
    .cy-cell-title {
        display: flex;
        flex: 1;
        flex-direction: column;
        line-height: 1.2;
        font-size: $cellFontSize;
    }
    .cy-cell-sub-title {
        display: block;
        margin-top: 5px;
        font-size: $cellFontSizeSmall;
        color: #999;
        &:empty {
            display: none;
        }
    }
    .cy-cell-right {
        display: flex;
        align-items: center;
        font-size: 14px;
        line-height: 1;
        color: #969799;
        .cy-cell-desc {
            display: flex;
            align-items: center;
        }
    }
    .cy-cell-icon {
        display: flex;
        align-items: center;
        margin-left: 5px;
    }
}
</style>