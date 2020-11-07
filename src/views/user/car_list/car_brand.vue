<!--第一步：选择车型-->
<template>
    <div class="car-brand">
        <div class="car-letter">
            <span
                v-for="(item,index) in navList"
                :key="item"
                :class="['car-letter-cell',{'active':index === active}]"
                @click="changeScroll(index)"
            >{{item}}</span>
        </div>
        <div class="car-main" ref="scroller">
            <div
                v-for="(item,index) in dataList"
                :key="index"
                :ref="'data'+index"
                class="car-group"
            >
                <div class="car-type">{{item.name}}</div>
                <div class="car-list">
                    <div
                        v-for="(item,index) in item.children"
                        :key="index"
                        class="car-item"
                        @click="nextTo(item.brandName)"
                    >
                        <div class="car-item-photo">
                            <cy-image :src="item.icon" width="30px" height="30px"></cy-image>
                        </div>
                        <div class="car-item-name">{{item.brandName}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { MixinScroll } from "./mixins/index";

export default {
    name: "car_list",
    mixins: [MixinScroll],
    components: {},
    data() {
        return {
            navList: [],
            dataList: [],
        };
    },
    created() {
        this.init();
    },
    computed: {},
    mounted() {},

    methods: {
        async init() {
            this.$toast.loading("加载中…");
            const hotBrandList = await this.getHotCarBrandList();
            const brandList = await this.getCarBrandList();

            const dataList = this.navList.map(item => ({
                name: item,
                children: []
            }));
            this.navList = ["热", ...this.navList];
            // 热门品牌
            const _hotBrandList = [
                {
                    name: "热门品牌",
                    children: [...hotBrandList]
                }
            ];
            // 品牌列表
            const _brandList = dataList.map(item => {
                item.children = brandList.filter(o => o.initial === item.name);
                return item;
            });
            this.dataList = [..._hotBrandList, ..._brandList];
            this.$toast.clear();

            //初始化滚动
            this.initScrollElement();
        },

        //查询热门品牌列表
        async getHotCarBrandList() {
            let res = await this.$api.getHotCarBrandList();
            if (res && res.obj) {
                return res.obj;
            }
        },

        //查询品牌列表
        async getCarBrandList() {
            let res = await this.$api.getCarBrandList();
            if (res && res.obj) {
                this.getLetter(res.obj);
                return res.obj;
            }
        },

        // 品牌对应字母列表
        getLetter(list) {
            const letter = list.reduce((letters, item) => {
                if (item.initial && !letters.includes(item.initial)) {
                    return [...letters, item.initial];
                } else {
                    return letters;
                }
            }, []);
            this.navList = letter;
        },

        //跳转
        nextTo(brandName) {
            this.$emit("change",brandName)
        }
    }
};
</script>
<style lang="scss" scoped>
.car-list {
    padding-top: 33px;
}
.car-letter {
    position: absolute;
    top: 33px;
    bottom: 0;
    left: 0;
    width: 60px;
    background: #ededed;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
.car-letter-cell {
    position: relative;
    display: block;
    height: 45px;
    line-height: 45px;
    font-size: 13px;
    color: #333;
    text-indent: 12px;
    transition: all 0.3s ease-out;
    &:after {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 2px;
        background: #ededed;
        content: "";
    }
    &.active {
        background: #fff;
        &:after {
            background: #ff9649;
        }
    }
}
.car-main {
    position: absolute;
    top: 33px;
    right: 0;
    bottom: 0;
    left: 60px;
    background: #ffffff;
    overflow-y: auto;
    transition: all 0.3s ease-out;
    -webkit-overflow-scrolling: touch;
}
.car-type {
    height: 25px;
    text-align: center;
    font-size: 12px;
    line-height: 25px;
    color: #1f1f1f;
    background: #ededed;
}
.car-list {
    display: flex;
    flex-wrap: wrap;
    padding: 8px 0;
}
.car-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 25% 0 0;
    height: 64px;
}
.car-item-photo {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 30px;
    img {
        max-height: 30px;
    }
}
.car-item-name {
    margin-top: 6px;
    font-size: 12px;
    color: #333;
    line-height: 1;
}
</style>
