<!--数据头部-->
<template>
    <div class="data-tab">
        <ul
            :style="`background-image: url(${require('../../../assets/img/mydata/tab'+(activeTab === 0?'5':'6')+'.png')})`"
        >
            <li :class="['left', {'active':activeTab === 0}]" @click="onItemClick(0)">设备数据</li>
            <li :class="['right', {'active':activeTab === 1}]" @click="onItemClick(1)">运营数据</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "data_tab",
    components: {},
    props: {
        currentIndex: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            activeTab: this.currentIndex
        };
    },
    created() {},
    computed: {},
    watch: {},
    methods: {
        onItemClick(val) {
            if (this.activeTab !== val) {
                this.activeTab = val;
                this.$emit("onIndexChange", val);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.data-tab {
    ul {
        display: flex;
        border-radius: 10px 10px 0 0;
        background-size: cover;
        background-color: #ddebff;
        overflow: hidden;
        li {
            flex: 1;
            height: 42px;
            line-height: 42px;
            text-align: center;
            font-size: 15px;
            color: #172e3b;
            font-weight: 700;
            background-size: 100% 100%;
            &.active {
                color: #0861ef;
            }
        }
    }
}
</style>
