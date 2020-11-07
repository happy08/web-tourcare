<!--施工案例-->
<template>
    <div class="case">
        <case-data-list :isPullLoadMore="true" :option="caseOption"></case-data-list>
        <!--返回顶部 -->
        <cy-to-top></cy-to-top>
    </div>
</template>

<script>
import caseDataList from "@/components/_custom/case/data_list"; //案例列表
import cyToTop from "@/components/totop";

export default {
    name: "construction_case",
    components: {
        caseDataList,
        cyToTop
    },
    data() {
        return {
            caseOption: {
                pageSize: 15
            } //施工案例参数
        };
    },
    created() {},
    computed: {},
    methods: {}
};
</script>
<style lang="scss" scoped>
</style>
