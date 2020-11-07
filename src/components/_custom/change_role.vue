<!--切换角色-->
<template>
    <div class="change-role black">
        <div @click="dataList.length>1?showRole=true:''" class="flex center">
            <slot>
                <cy-icon
                    :type="defaultType==='0'?'factory':defaultType==='1'?'label':defaultType==='2'?'room':'person'"
                    size="22"
                    class="change-role-icon"
                ></cy-icon>
                <span class="pdlr-10 fs-16 white">{{orgName}}</span>
                <cy-icon v-if="dataList.length>1" type="xiajiantou" size="12" class="change-role-icon"></cy-icon>
            </slot>
        </div>
        <cy-popup v-model="showRole" :closeIcon="false" height="8.6rem">
            <div class="pd-15">切换角色</div>
            <cy-cell
                v-for="(item,index) in dataList"
                :key="index"
                @click.native="onChange(item)"
                :class="{'active':item.orgPk === defaultOrgPk}"
                :title="`[${item.title}] ${item.orgName || item.roleName}`"
                :titleIcon="item.titleIcon"
                link="javascript:;"
            ></cy-cell>
        </cy-popup>
    </div>
</template>
<script>
import { mapState } from "vuex";
import wxx from "@/utils/wx";

export default {
    name: "change_role",
    props: {
        data: {
            type: Array,
        },
        orgName: {
            type: String,
        },
    },
    components: {},
    data() {
        return {
            showRole: false,
            address: {},
        };
    },
    created() {
        this.init();
    },
    computed: {
        ...mapState({
            defaultOrgPk: (state) => state.defaultRole.defaultOrgPk,
            defaultType: (state) => state.defaultRole.type,
        }),
        dataList() {
            return this.data.map((item) => {
                if (item.type === "0") {
                    item.title = "厂商";
                    item.titleIcon = "factory";
                } else if (item.type === "1") {
                    item.title = "服务商";
                    item.titleIcon = "label";
                } else if (item.type === "2") {
                    item.title = "门店";
                    item.titleIcon = "room";
                } else if (item.type === "3") {
                    item.title = "车主";
                    item.titleIcon = "person";
                } else {
                    item.title = "车主关注";
                    item.titleIcon = "person";
                }
                return item;
            });
        },
    },
    methods: {
        init() {
            const setWxConfig = () => {
                //获取经纬度
                wx.getLocation({
                    type: "wgs84",
                    success: (res) => {
                        this.getMapAddress(res.latitude, res.longitude);
                    },
                    cancel: () => {},
                });
            };
            //微信签名配置
            wxx.wxaccountConfig(setWxConfig);
        },

        //获取用户地理位置名称
        getMapAddress(latitude, longitude) {
            //腾讯API逆解析
            const params = {
                key: this.$api.config.TENCENT_MAP_ADDRESS_Key,
                location: `${latitude},${longitude}`,
                get_poi: 0,
                output: "jsonp",
            };
            this.$jsonp(this.$api.config.TENCENT_MAP_ADDRESS_API, params)
                .then((res) => {
                    this.address = res.result.address_component;
                })
                .catch((err) => {});
        },

        //切换角色
        onChange(option) {
            this.showRole = false;
            // if (option.rolePk === this.defaultOrgPk) {
            //     return;
            // }
            //type  0-厂商 1-代理商 2-门店 3-普通车主 4-普通车主关注的门店
            this.$emit("changeRole", option);
            this.addOrUpdateUserRole(option);
            //0厂商 3普通车主
            if(option.type !=='0' && option.type !=='3'){
                this.addOrUpdateRelation(option);
            }
        },

        //修改默认角色
        addOrUpdateUserRole(option) {
            const params = {
                defaultOrgPk: option.orgPk, //01 厂商
                //orgName: option.orgName,
                rolePk: option.rolePk,
                type: option.type,
                nation: this.address.nation || "", //国家
                province: this.address.province || "", //省份
                city: this.address.city || "", //市
                district: this.address.district || "", //区县
            };
            //修改默认角色
            this.$api
                .addOrUpdateUserRole(params)
                .then((res) => {
                    this.$store.commit("setDefaultRole", {
                        ...res.obj,
                        orgName: option.orgName || ''
                    });
                })
                .catch((err) => {});
        },
        
        //新增或修改关注代理商/门店信息
        addOrUpdateRelation(option) {
            const params = {
                orgPk: option.orgPk,
            };
            this.$api
                .addOrUpdateRelation(params)
                .then((res) => {
                    
                })
                .catch((err) => {});
        },

    },
};
</script>
<style lang="scss" scoped>
.change-role {
    .change-role-icon {
        color: #fff;
    }
}
/deep/.cy-cell.active {
    color: #0861ef;
    /deep/.cy-icon {
        color: #0861ef !important;
    }
}
</style>