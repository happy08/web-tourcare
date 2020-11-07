<!--个人信息-->
<template>
    <div class="user-info bg-grey">
        <cy-cell titleIcon="picture" title="头像">
            <template slot="desc">
                <cy-image :src="$store.state.user.face" round width="30px" height="30px"></cy-image>
            </template>
        </cy-cell>
        <cy-cell
            titleIcon="person"
            title="昵称"
            :desc="$store.state.user.name || $store.state.user.nickName"
        />
        <cy-cell @click.native="linkTo" titleIcon="card" title="车辆" link="car_info">
            <template slot="desc">{{carNo}}</template>
        </cy-cell>
    </div>
</template>

<script>
export default {
    name: "user_info",
    components: {},
    data() {
        return {
            carNo: ""
        };
    },
    created() {
        this.getUserCarList();
    },
    computed: {},
    methods: {
        getUserCarList() {
            this.$api.getUserCarList().then(res => {
                if (res.obj.length > 0) {
                    this.carNo = res.obj[0].carNo;
                }
            });
        },

        //跳转
        linkTo() {
            this.$router.push("/setting/car_info");
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
