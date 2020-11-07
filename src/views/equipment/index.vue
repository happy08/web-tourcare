<!--激活设备-->
<template>
    <div class="equipment">
        <div class="head-bg"></div>
        <div class="container mglr-20 mgb-20">
            <div class="head flex vcenter pd-15">
                <div class="flex vcenter mgr-10">
                    <cy-image :src="userFace" round width="52px" height="52px"></cy-image>
                </div>
                <div class="white">
                    <div class="mgb-5 fs-14">{{userName}}</div>
                    <span v-if="!!userPhone" class="phone">{{userPhone}}</span>
                </div>
            </div>
            <div class>
                <div class="pd-10 darkblue tc">- 设备信息 -</div>
                <div class="item">
                    <div class="flex vcenter darkgrey">
                        <cy-icon type="card" class="mgr-5" size="20"></cy-icon>设备名称
                    </div>
                    <div class="black w50 tr">{{info.equipmentName}}</div>
                </div>
                <div v-if="!!info.equipmentBrand" class="item">
                    <div class="flex vcenter darkgrey">
                        <cy-icon type="flag" class="mgr-5" size="20"></cy-icon>设备品牌
                    </div>
                    <div class="black">{{info.equipmentBrand}}</div>
                </div>
                <div class="item">
                    <div class="flex vcenter darkgrey">
                        <cy-icon type="text" class="mgr-5" size="20"></cy-icon>设备型号
                    </div>
                    <div class="black">{{info.equipmentType || '--'}}</div>
                </div>
                <div class="item">
                    <div class="flex vcenter darkgrey">
                        <cy-icon type="label" class="mgr-5" size="20"></cy-icon>设备ID
                    </div>
                    <div class="black">{{info.equipmentId || '--'}}</div>
                </div>
                <div class="item">
                    <div class="flex vcenter darkgrey">
                        <cy-icon type="data" class="mgr-5" size="20"></cy-icon>设备状态
                    </div>
                    <div class="black">{{info.status === '1' ? "已分配":"未分配" }}</div>
                </div>
                <div class="item">
                    <div class="flex vcenter darkgrey">
                        <cy-icon type="room" class="mgr-5" size="20"></cy-icon>代理商
                    </div>
                    <div class="black">{{info.agentOrgName || '--'}}</div>
                </div>
                <div class="item">
                    <div class="flex vcenter darkgrey">
                        <cy-icon type="papers" class="mgr-5" size="20"></cy-icon>门店类型
                    </div>
                    <div class="black">{{info.storeType}}</div>
                </div>
                <div class="item">
                    <div class="flex vcenter darkgrey">
                        <cy-icon type="heart" class="mgr-5" size="20"></cy-icon>门店名称
                    </div>
                    <div class="black">{{info.storeOrgName || '--'}}</div>
                </div>
                <div class="item">
                    <div class="flex vcenter darkgrey">
                        <cy-icon type="room" class="mgr-5" size="20"></cy-icon>门店简称
                    </div>
                    <div class="black">{{info.storeCode || '--'}}</div>
                </div>
                <div class="item">
                    <div class="flex vcenter darkgrey">
                        <cy-icon type="location" class="mgr-5" size="20"></cy-icon>门店地址
                    </div>
                    <div class="black w50 tr">{{info.storeOrgAddress || '--'}}</div>
                </div>
                <div class="pd-10 tc">
                    <div v-if="info.status === '0'">
                        当前设备未分配，请联系相关业务人员
                        <br />
                        （{{info.storeOrgManagerPhone}}）
                    </div>
                </div>

                <div class="pdlr-30 pdb-20">
                    <cy-btn
                        v-if="info.status === '1'"
                        @click.native="onActivation"
                        type="blue-gradient"
                        round
                    >激活设备</cy-btn>
                    <a v-if="info.status === '0'" :href="'tel:'+info.storeOrgManagerPhone">
                        <cy-btn type="blue-gradient" round>立即联系</cy-btn>
                    </a>
                </div>
            </div>
        </div>

        <!-- 该设备已激活 -->
        <cy-popup
            v-model="showSuccess"
            :closeIcon="false"
            :clickOverlayClose="false"
            closeIconPosition="bottom-center"
            round
            position="center"
            width="90%"
            height="auto"
            background="#172E3B"
        >
            <div class="popup-inner pd-20 pdb-50 tc">
                <div class=" fs-26 red">恭喜您 ! !</div>
                <div class="mgt-20 fs-22 white">该设备已激活</div>
                <div class="mgt-15 mgb-15 fs-16 yellow">前往运营数据{{isInvite == '1'?'或者邀请同事加入':''}}</div>
                <div class="pdlr-30">
                    <cy-btn v-if="isInvite == '1'" @click.native="linkTo" type="blue-gradient" round class="mgb-15">邀请同事</cy-btn>
                    <cy-btn @click.native="$router.push('/mydata')" type="blue" plain round>运营数据</cy-btn>
                </div>
            </div>
        </cy-popup>

        <!-- 设备激活失败 -->
        <cy-popup
            v-model="showFail"
            :closeIcon="false"
            :clickOverlayClose="true"
            closeIconPosition="bottom-center"
            round
            position="center"
            width="90%"
            height="auto"
            background="#172E3B"
        >
            <div class="popup-inner pd-20 tc">
                <cy-image
                    :src="require('@/assets/img/equipment/question_bg.png')"
                    width="83px"
                    height="47px"
                ></cy-image>
                <div class="mgt-20 fs-22 white">设备激活失败 ?</div>
                <div class="mgt-15 mgb-15 fs-14 white tl">
                    1.检查设备是否联网或确保设备连接的WiFi可用
                    <br />2.联系供应商检查设备是否损坏
                </div>
                <div class="pdlr-30 mgt-30">
                    <a v-if="!!info.storeOrgManagerPhone" :href="'tel:'+info.storeOrgManagerPhone">
                        <cy-btn type="blue-gradient" round>联系供应商 {{info.storeOrgManagerPhone}}</cy-btn>
                    </a>
                </div>
            </div>
        </cy-popup>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { coverPhone } from "@/utils/number";

export default {
    name: "equipment",
    components: {},
    data() {
        return {
            showSuccess: false,
            showFail: false,
            user: {},
            info: {}, //设备信息
            equipmentId: "", //06170013 06170023
            activationStatus:"", //是否激活过
            isInvite:"0" //是否邀请 0-否 1-是
        };
    },
    created() {
        this.equipmentId = this.$route.query.equipmentId;
        this.getEquipmentInfo(this.equipmentId);
    },
    computed: {
        ...mapState({
            userName: state => state.user.name || state.user.nickName,
            userPhone: state => coverPhone(state.user.phone),
            userFace: state => state.user.face
        })
    },
    methods: {
        //设备信息
        getEquipmentInfo(equipmentId) {
            this.$toast.loading("加载中");
            this.$api
                .getEquipmentInfo({
                    equipmentId: this.equipmentId
                })
                .then(res => {
                    let storeType = "";
                    if (!!res.obj.storeType) {
                        storeType =
                            res.obj.storeType === "1" ? "4S店" : "维修店";
                    }
                    this.info = {
                        ...res.obj,
                        storeType: storeType
                    };

                    this.$toast.clear();
                })
                .catch(err => {});
        },

        //激活设备
        onActivation() {
            //this.showSuccess = true; return
            this.$toast.loading("正在激活中");
            const params = {
                agentCode: this.info.agentCode,
                storeCode: this.info.storeCode,
                equipmentName: this.info.equipmentName,
                equipmentId: this.info.equipmentId,
                equipmentType: this.info.equipmentType,
                equipmentBrand: this.info.equipmentBrand,
                status: this.info.status,
                sim: this.info.sim, //sim卡号
                address: this.info.address, //设备地址
                errMsg: false //错误信息不提示
            };
            this.$api
                .activationEquipment(params)
                .then(res => {
                    this.showSuccess = true;
                    this.activationStatus = res.obj.activationStatus
                    this.isInvite = res.obj.isInvite
                    this.info = {
                        ...this.info,
                        agentOrgPk: res.obj.agentOrgPk,
                        storeOrgPk: res.obj.storeOrgPk
                    };
                    this.$toast.clear();
                })
                .catch(err => {
                    this.showFail = true;
                    this.$toast.clear();
                });
        },

        //跳转
        linkTo() {
            this.$router.push({
                path: "/equipment_share",
                query: {
                    equipmentId: this.info.equipmentId,
                    storeOrgPk: this.info.storeOrgPk,
                    agentOrgPk: this.info.agentOrgPk
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.head-bg {
    position: relative;
    height: 100px;
    background: #172E3B;
}
.head {
    height: 80px;
    background: url("../../assets/img/equipment/head_code_bg.png") top center;
    background-size: cover;
}
.container {
    position: relative;
    margin-top: -80px;
    border-radius: 10px 10px 0 0;
    box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}
.phone {
    display: inline-block;
    padding: 2px 10px;
    border: solid 1px rgba(255, 255, 255, 0.3);
    color: #eeeeee;
    background: rgba(255, 255, 255, 0.1);
    font-size: 12px;
    line-height: 1;
    border-radius: 50px;
}
.item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 13px 10px;
    border-bottom: 1px solid #ebedf0;
}
</style>
