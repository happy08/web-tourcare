<!--第三步：根据车系查车型-->
<template>
    <div class="car-type">
        <div class="car-volume">
            <span
                v-for="(item,index) in navList"
                :key="item"
                :class="['car-volume-cell',{'active':index === active}]"
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
                <div class="car-left">{{item.name}}</div>
                <div class="car-list">
                    <div
                        v-for="(item,index) in item.children"
                        :key="index"
                        class="car-item"
                        @click="nextTo(item)"
                    >{{item.year}} {{item.type}} {{item.salesName}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { MixinScroll } from "./mixins/index";

export default {
    name: "car_type",
    mixins: [MixinScroll],
    components: {},
    props: {
        brandName: {
            type: String
        },
        clazzName: {
            type: String
        }
    },
    data() {
        return {
            navList: [],
            dataList: []
        };
    },
    created() {
        this.init();
    },
    computed: {
    },
    methods: {
        async init() {
            this.$toast.loading("加载中…");
            const navList = await this.getCarSweptVolume();
            const typeList = await this.getCarTypeList();
            //const yearList = await this.getCarYearList();

            const dataList = navList.map(item => ({
                name: item,
                children: []
            }));
            // 车型列表
            const _typeList = dataList.map(item => {
                item.children = typeList.filter(
                    o => o.displacement === item.name
                );
                return item;
            });
            this.navList = [...navList];
            this.dataList = [..._typeList];
            this.$toast.clear();

            //初始化滚动
            this.initScrollElement();
        },

        //根据车系查车型
        async getCarTypeList() {
            const params = {
                brandName: this.brandName,
                clazzName: this.clazzName,
                pageSize: 1000,
                pageNum: 1
            };
            let res = await this.$api.getCarTypeList(params);
            if (res && res.obj) {
                return res.obj;
            }
        },

        //根据车系查年款
        async getCarYearList() {
            const params = {
                brandName: this.brandName,
                clazzName: this.clazzName
            };
            let res = await this.$api.getCarYearList(params);
            if (res && res.obj) {
                return res.obj;
            }
        },

        //根据车系查排量
        async getCarSweptVolume() {
            const params = {
                brandName: this.brandName,
                clazzName: this.clazzName
            };
            let res = await this.$api.getCarSweptVolume(params);
            if (res && res.obj) {
                return res.obj;
            }
        },

        //跳转
        nextTo(item) {
            this.$emit("change", item.year, item.type, item.salesName);
        }
    }
};
</script>
<style lang="scss" scoped>
.car-volume {
    position: absolute;
    top: 33px;
    bottom: 0;
    left: 0;
    width: 60px;
    background: #ededed;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
.car-volume-cell {
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
.car-left {
    height: 25px;
    text-align: center;
    font-size: 12px;
    line-height: 25px;
    color: #1f1f1f;
    background: #ededed;
}
.car-item {
    position: relative;
    padding: 14px 12px;
    font-size: 14px;
    color: #1f1f1f;
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
