<!--第二步：根据品牌选择车系-->
<template>
    <div class="car-line">
        <div v-for="(item,index) in dataList" :key="index">
            <div class="carline-group-name">{{item.name}}</div>
            <div
                v-for="(item,index) in item.children"
                :key="index"
                class="carline-group-item"
                @click="nextTo(item.clazzName)"
            >{{item.clazzName}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "car_line",
    components: {},
    props:{
        brandName:{
            type:String
        }
    },
    data() {
        return {
            dataList: []
        };
    },
    created() {
        this.init();
    },
    computed: {
        // brandName() {
        //     return this.$route.query.brandName;
        // }
    },
    methods: {
        async init() {
            this.$toast.loading("加载中…");
            const lineList = await this.getCarLineList();
            const classList = lineList.reduce((list, item) => {
                if (item.manufactor && !list.includes(item.manufactor)) {
                    return [...list, item.manufactor];
                } else {
                    return list;
                }
            }, []);

            const dataList = classList.map(item => ({
                name: item,
                children: []
            }));
            // 品牌列表
            const _lineList = dataList.map(item => {
                item.children = lineList.filter(
                    o => o.manufactor === item.name
                );
                return item;
            });
            this.dataList = [..._lineList];
            this.$toast.clear();
        },

        //查询热门品牌列表
        async getCarLineList() {
            const params = {
                brandName: this.brandName
            };
            let res = await this.$api.getCarLineList(params);
            if (res && res.obj) {
                return res.obj;
            }
        },

        //跳转
        nextTo(clazzName) {
            this.$emit("change",clazzName)
        }
    }
};
</script>
<style lang="scss" scoped>
.car-line{
    position: absolute;
    top: 33px;
    bottom: 0;
    left: 0;
    right:0;
    background: #ededed;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    z-index: 10;
}
.carline-group-name {
    padding-left: 12px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    font-weight: 600;
    color: #1f1f1f;
    background: #ededed;
}
.carline-group-item {
    position: relative;
    padding: 14px 12px;
    font-size: 14px;
    color: #1f1f1f;
    background: #ffffff;
    &:after {
        position: absolute;
        right: 12px;
        bottom: 0;
        left: 12px;
        height: 1px;
        background: #ebebeb;
        content: "";
    }
}
</style>
