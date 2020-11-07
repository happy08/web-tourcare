<!--全部评价-->
<template>
    <div class="evaluate">
        <evaluate-data-info :option="evaluateOption" :isPullLoadMore="true"></evaluate-data-info>
    </div>
</template>

<script>
import evaluateDataInfo from "@/components/_custom/evaluate/data_info"; //评价列表

export default {
    name: "evaluate",
    components: {
        evaluateDataInfo
    },
    data() {
        return {
            evaluateOption: {} //评价列表参数
        };
    },
    created() {
        let evaluateOption = {
            projectPk: this.$route.query.projectPk //大项目pk
        };
        const orgPk = this.$route.query.orgPk;
        if (orgPk) {
            evaluateOption = {
                ...evaluateOption,
                evaluateOrgPk: res.obj.orgPk //门店pk
            };
        }
        this.evaluateOption = evaluateOption
    },
    computed: {},
    methods: {}
};
</script>
<style lang="scss" scoped>
</style>
