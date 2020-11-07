<!--评价 数据列表-->
<template>
    <ul class="data-list">
        <li v-for="(item,index) in dataList" :key="item.pk" class="b-line">
            <div class="item-l">
                <cy-image :src="item.isAnonymous==='1'?require('@/assets/img/logo.png'):item.face" round></cy-image>
            </div>
            <div class="item-r">
                <div class="flex between mgb-5">
                    <div class="fs-14">{{item.isAnonymous==='1'?'匿名':item.userName}}</div>
                    <div class="fs-12 grey">{{item.createTime}}</div>
                </div>
                <div class="flex lh12">
                    项目：
                    <cy-rate v-model="item.level" :readOnly="true"></cy-rate>
                    <span class="pdl-5 orange">{{item.remark}}</span>
                </div>
                <div class="pdtb-5">
                    <div class="flex" v-for="(items,index) in item.labelList" :key="index">
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

                <!-- <div class="flex lh12">
                    门店：
                    <cy-rate v-model="item.levelServer" :readOnly="true"></cy-rate>
                    <span class="pdl-5 orange">{{item.remarkServer}}</span>
                </div>
                <div class="pdtb-5">
                    <div class="flex" v-for="(items,index) in item.labelServerList" :key="index">
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
                </div> -->

                <!-- <div class="lh12">
                    <cy-rate v-model="item.level" :readOnly="true"></cy-rate>
                </div>
                <div class="pdtb-5">
                    <cy-btn
                        v-for="(items,lindex) in item.labelList"
                        :key="lindex"
                        class="mgr-5"
                        type="blue"
                        plain
                        xs
                    >{{items.labelName}}</cy-btn>
                </div> -->
                <div v-html="item.otherReamrk"></div>
                <!-- <div v-show="!item.show" v-html="item.otherReamrk"></div>
                <div v-show="item.show" v-html="item.otherReamrk"></div>
                <div @click="onShowDtail(index)" class="blue fs-12">{{item.show === true?'收起':'全文'}}</div>-->

                <cy-row class="pdr-50" wrap="wrap" :gutter="3">
                    <cy-col
                        v-for="(items,idx) in item.imgList"
                        :key="idx"
                        @click.native="items.type==='0'?previewImage(index,idx):''"
                        :span="items.type==='1'?'':'8'"
                        class="mgt-5"
                    >
                        <cy-image v-if="items.type==='0'" :src="items.url" height="78px"></cy-image>
                        <div v-if="items.type==='1'" class="bg-grey lh1">
                            <video
                                controls="controls"
                                class="slideVideo w100"
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
    name: "evaluate_list",
    components: {
        cyRate
    },
    props: {
        dataList: Array
    },
    data() {
        return {};
    },
    created() {},
    computed: {},
    watch: {},
    methods: {
        //图片预览
        previewImage(dataIndex, imgIndex) { 
            const curUrl = this.dataList[dataIndex].imgList[imgIndex].url;
            const imgList = this.dataList[dataIndex].imgList.map(
                item => item.url
            );
            wx.previewImage({
                current: curUrl, // 当前显示图片的http链接
                urls: imgList // 需要预览的图片http链接列表
            });
        },
        //查看全文
        onShowDtail(index) {
            this.dataList[index].show = !this.dataList[index].show;
        }
    }
};
</script>
<style lang="scss" scoped>
.data-list {
    li {
        position: relative;
        display: flex;
        align-items: top;
        padding: 10px 0;
        .item-l {
            flex: 0 0 30px;
            height: 30px;
        }
        .item-r {
            flex: 1;
            margin-left: 15px;
            font-size: 12px;
            .slideVideo {
                height: 169px;
            }
            .group-name{
                line-height: 2;
                width: 60px;
                flex: 0 0 60px;
            }
        }
    }
}
</style>
