<!--选择今日 昨日 7天 一月-->
<template>
    <div class="change-role tc">
        <cy-popup v-model="isShow" :closeIcon="false" round width="100%" height="auto">
            <div class="pd-15">
                <cy-cell
                    v-for="item in dataList"
                    :key="item.name"
                    @click.native="onChange(item.type)"
                    link="javascript:;"
                >{{item.name}}</cy-cell>
            </div>
        </cy-popup>
    </div>
</template>
<script>
import { getDateInterval } from "@/utils/formatDate";

export default {
    name: "change_role",
    props: {
        type: {
            type: Number,
            default: 3
        },
        show: {
            type: Boolean,
            default: false
        },
        data: {
            type: Array,
            default: function() {
                return [
                    { type: 0, name: "今日" },
                    { type: 1, name: "昨日" },
                    //{ type: 2, name: "3天" },
                    { type: 3, name: "7天" },
                    //{ type: 4, name: "15天" },
                    //{ type: 5, name: "本月" },
                    { type: 11, name: "30天" },
                    //{ type: 6, name: "上月" },
                    //{ type: 7, name: "近三月" },
                    //{ type: 8, name: "近半年" },
                    //{ type: 9, name: "近一年" },
                    //{ type: 10, name: "本年" },
                    { type: 99, name: "自定义" }
                ];
            }
        }
    },
    components: {},
    data() {
        return {
            isShow: false,
            dataList: []
        };
    },
    created() {
        this.init();
    },
    watch: {
        show(val) {
            this.isShow = val;
        },
        isShow(val) {
            this.$emit("update:show", val);
        }
    },
    methods: {
        init() {
            this.dataList = this.data.map(item => {
                if (item.type !== 99) {
                    const { endDate, startDate } = getDateInterval(item.type);
                    item.startDate = startDate;
                    item.endDate = endDate;
                }
                return item;
            });
            //this.onChange(this.type)
        },

        onChange(type) {
            const item = this.data.filter(item => {
                return item.type === type;
            });
            this.$emit("onChange", item[0]);
        }
    }
};
</script>
<style lang="scss" scoped>
.change-role {
    position: fixed;
    bottom: 80px;
    right: 0;
    z-index: 1020;
}
</style>