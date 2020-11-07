<!--查看评价-->
<template>
    <ul class="data-list">
        <li class="b-line">
            <div class="item-l">
                <cy-image :src="info.isAnonymous==='1'?require('@/assets/img/logo.png'):info.face" round></cy-image>
            </div>
            <div class="item-r">
                <div class="flex between mgb-5">
                    <div class="fs-14">{{info.isAnonymous==='1'?'匿名':info.userName}}</div>
                    <div class="fs-12 grey">{{info.createTime}}</div>
                </div>
                <div class="flex lh12">
                    项目：
                    <cy-rate v-model="info.level" :readOnly="true"></cy-rate>
                    <span class="pdl-5 orange">{{info.remark}}</span>
                </div>
                <div class="pdtb-5">
                    <div class="flex" v-for="(items,index) in info.labelList" :key="index">
                        <div class="group-name grey">{{items.groupName}}</div>
                        <div>
                            <cy-btn
                                v-for="(item,index) in items.labelJson"
                                :key="index"
                                class="mgr-5 mgb-5"
                                type="blue"
                                plain
                                xs 
                            >{{item.labelName}}</cy-btn>
                        </div>
                    </div>
                </div>

                <div class="flex lh12">
                    门店：
                    <cy-rate v-model="info.levelServer" :readOnly="true"></cy-rate>
                    <span class="pdl-5 orange">{{info.remarkServer}}</span>
                </div>
                <div class="pdtb-5">
                    <div class="flex" v-for="(items,index) in info.labelServerList" :key="index">
                        <div class="group-name grey">{{items.groupName}}</div>
                        <div>
                        <cy-btn
                            v-for="(item,index) in items.labelJson"
                            :key="index"
                            class="mgr-5 mgb-5"
                            type="blue"
                            plain
                            xs
                        >{{item.labelName}}</cy-btn>
                        </div>
                    </div>
                </div>
                <!-- <div v-show="!info.show" v-html="info.otherReamrk"></div> -->
                <div v-html="info.otherReamrk"></div>
                <!-- <div @click="onShowDtail(index)" class="blue fs-12">{{info.show === true?'收起':'全文'}}</div> -->

                <cy-row class="pdr-50" wrap="wrap" :gutter="3">
                    <cy-col
                        v-for="(items,index) in info.imgList"
                        :key="index"
                        @click.native="items.type==='0'?previewImage(index):''"
                        :span="items.type==='1'?'':8"
                        class="mgt-5"
                    >
                        <cy-image v-if="items.type==='0'" :src="items.url"></cy-image>
                        <div v-if="items.type==='1'" class="bg-grey lh1">
                            <video
                                controls="controls"
                                class="evaluate-video w100"
                                x5-playsinline
                                playsinline
                                webkit-playsinline
                                :src="items.url"
                            ></video>
                        </div>
                    </cy-col>
                </cy-row>
            </div>
        </li>
    </ul>
</template>

<script>
import cyRate from "@/components/rate";

export default {
    name: "evaluate_detail",
    components: {
        cyRate,
    },
    props: {},
    data() {
        return {
            userProjectPk: "",
            info: {},
        };
    },
    created() {
        this.userProjectPk = this.$route.query.userProjectPk;
        this.init();
    },
    computed: {},
    watch: {},
    methods: {
        init() {
            this.$toast.loading("加载中…");
            const params = {
                userProjectPk: this.userProjectPk,
            };
            this.$api
                .findEvaluateProject(params)
                .then((res) => {
                    this.info = res.obj;
                    this.$toast.clear();
                })
                .catch((err) => {});
        },

        //图片预览
        previewImage(index) {
            const curUrl = this.info.imgList[index].url;
            const imgList = this.info.imgList.map((item) => item.url);
            wx.previewImage({
                current: curUrl, // 当前显示图片的http链接
                urls: imgList, // 需要预览的图片http链接列表
            });
        },

        //查看全文
        onShowDtail(index) {
            this.info.show = !this.info.show;
        },
    },
};
</script>
<style lang="scss" scoped>
.data-list {
    li {
        position: relative;
        display: flex;
        align-items: top;
        margin: 0px 15px;
        padding: 15px 0;
        .item-l {
            flex: 0 0 30px;
            height: 30px;
        }
        .item-r {
            flex: 1;
            margin-left: 15px;
            font-size: 12px;
            .evaluate-video {
                height: 169px;
            }
            .group-name{
                line-height: 2;
                flex: 0 0 60px;
            }
        }
    }
}
</style>

