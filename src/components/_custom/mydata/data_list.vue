<!--数据列表-->
<template>
    <div class="data-list">
        <cy-row class="head pdlr-5" :gutter="5">
            <cy-col
                class="flex center"
                :class="{w60:!!item.rank}"
                v-for="(item,index) in headList"
                :key="index"
            >
                <div class="flex center blue lh1" @click="!!item.sort? $emit('sort',item.pk,item.sort):''">
                    <div
                        :class="{greenblue:!!item.sort&&item.sort !== '-1'}"
                    >
                        {{item.name}}
                        <span v-if="item.unit" class="unit">({{item.unit}})</span>
                    </div>
                    <cy-icon
                        v-if="item.sort"
                        v-show="item.sort !== '-1'"
                        class="sort"
                        :type="item.sort === '1'?'sort2':'sort3'"
                    ></cy-icon>
                </div>
            </cy-col>
        </cy-row>

        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "data_list",
    components: {},
    props: {
        headList: {
            type: Array,
            default: [],
        },
    },
    data() {
        return {};
    },
    created() {},
    computed: {},
    watch: {},
    methods: {},
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/_mixin";

.data-list {
    .head {
        background: #04233d;
        padding: 18px 0;
        .greenblue {
            position: relative; 
            white-space: nowrap;
            &::before {
                position: absolute;
                content: "";
                bottom: -6px;
                height: 2px;
                width: 90%;
                border-radius: 10px;
                background: linear-gradient(295deg, #3f8bfd 0%, #29d7a8 100%);
            }
        }
        .w60 {
            width: 60px;
            flex: 0 0 60px;
        }
        .unit {
            margin: 0 2px;
        }
        .sort {
            display: inline-block;
            width: 9px;
            height: 9px;
        }
    }
}
</style>
