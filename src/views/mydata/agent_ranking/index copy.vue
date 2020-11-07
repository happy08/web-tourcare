<!--经营排行榜-->
<template>
    <div class="min-h101 mgb-30">
        <!-- <data-header title="经营排行榜" @onChange="onChangeSearch"></data-header> -->
        <!-- <data-tab @onIndexChange="onTabChange"></data-tab> -->
        <equipment :option="option" />
        <!-- <component :is="tabIndex === 0 ?'equipment':'operate'" :option="option"></component> -->
    </div>
</template>

<script>
import dataHeader from "@/components/_custom/mydata/data_header"; //数据头部
import { dateDiffDate, dateDiffDays } from "@/utils/formatDate";
//import dataTab from "@/components/_custom/mydata/data_tab"; //数据tab
import equipment from "./equipment"; //设备数据

export default {
    name: "aget_ranking",
    components: {
        dataHeader,
        //dataTab,
        equipment,
    },
    props: {
        option: Object,
    },
    data() {
        return {
            //tabIndex: 0,
            //option:{}
        };
    },

    created() {},
    watch: {
        // option(nVal, oVal) {
        //     this.getDataList(nVal);
        // },

    },
    mounted() {},
    computed: {},
    methods: {        
        // //条件搜索
        // onChangeSearch(option) {
        //     this.pageNum = 1;
        //     //计算日期相差天数
        //     const days = dateDiffDays(option.startTime, option.endTime)
        //     //计算days天前的日期
        //     option.startLastTime = dateDiffDate(option.startTime, -days)
        //     option.endLastTime = dateDiffDate(option.startTime, -1)

        //     this.option = option
        // },

        // onTabChange(v) {
        //     this.tabIndex = v;
        // }


    }
};
</script>
<style lang="scss" scoped>
</style>
