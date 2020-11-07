<template>
    <div class="base-tabbar mgb-safe-0">
        <div
            class="tabbar-nav"
            v-for="(item) in tabList"
            :key="item.title"
            @click="linkTo(item.href)"
        >
            <span class="icon-box">
                <div><cy-icon :type="item.icon" :color="item.href == path?'#ffffff':'#8293A0'" size="20"></cy-icon></div>
                <div :class="['tabbar-nav-title',item.href == path?'active':'']">{{item.title}}</div>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: "base_tabbar",
    props: {
        path: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            tabList: [
                {
                    title: "运营数据",
                    href: "/mydata",
                    icon: "yunyingshuju",
                },
                {
                    title: "健康接力",
                    href: "/share_money",
                    icon: "fenxiangyouqian",
                },
                {
                    title: "个人中心",
                    href: "/user",
                    icon: "gerenzhongxin",
                }
            ]
        };
    },
    components: {

    },
    methods: {
        linkTo(to) {
            this.$router.replace(to)
        }
    },
    
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/_variable.scss";
.base-tabbar {
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: $tabbarHeight;
    transform: translateY(200%);
    background: linear-gradient(180deg,#093356 0%,#06233b 100%);;
    z-index: 980;
    transition: 0s;
    &.show {
        transform: translateY(0px);
    }
}

.tabbar-nav {
    flex: 1;
    text-align: center;
    text-decoration: none;
    color: #ffffff;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &.active {
        color: #fa8909;
    }

    .icon-box {
        position: relative;
        display: inline-block;
        padding: 0px;
        line-height: 1;
        .tips {
            position: absolute;
            top: -2px;
            right: 0;
            transform: translateX(60%);
        }
    }
    .icon-box {
        .tabbar-nav-title {
            color: #8293A0;
            margin-top: 3px;
            font-size: 12px;
            line-height: 1;
            &.active{
                color: #ffffff;
            }
        }
    }
}
</style>
