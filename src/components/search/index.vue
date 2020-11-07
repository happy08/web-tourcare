<template>
    <div class="cy-search">
        <form action="javascript:void 0">
            <cy-field v-model="currentValue" :placeholder="placeholder" @keyup.enter="onSearch">
                <template #label>
                    <cy-icon class="cy-search-icon" type="search" color="#888" size="25"></cy-icon>
                </template>

                <template #default>
                    <div class="cy-search-btn" @click="onSearch">搜索</div>
                </template>
            </cy-field>
        </form>
    </div>
</template>
<script>
import cyField from "../_global/field";

export default {
    name: "cy-search",
    components: {
        cyField,
    },
    props: {
        value: {
            type: [String, Number],
            required: true,
        },
        placeholder: String,
    },
    data() {
        return {};
    },
    watch: {},
    computed: {
        currentValue: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            },
        },
    },
    methods: {
        onSearch() {
            //if (this.currentValue) {
            document.activeElement.blur();
            this.$emit("search");
            // } else {
            //     this.$toast(this.placeholder || "请输入关键词");
            // }
        },
    },
};
</script>
<style lang="scss" >
.cy-search .cy-field {
    padding: 5px 20px 5px 15px;
}
</style>