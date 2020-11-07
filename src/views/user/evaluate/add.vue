
<!--评价体验-->
<template>
    <div class="evaluate">
        <div class="pd-15">
            <div class="mgt-10 fs-18 tc">您对{{projectName}}项目是否满意？</div>
            <div class="mgt-10 orange tc">{{form.remark}}</div>
            <div class="flex center mgt-10">
                <cy-rate v-model="form.level" @click="onChangeRate" :size="25"></cy-rate>
            </div>
            <div class="mgt-20">
                <div v-for="(item,index) in lableList" :key="index" class="lable-item flex mgb-10">
                    <div class="remark">{{item.groupName}}</div>
                    <div class="flex wrap">
                        <div v-for="(lableItem,lableIndex) in item.labelJson" :key="lableIndex">
                            <cy-btn
                                v-if="!lableItem.status"
                                @click.native="onChangeLable(index,lableIndex,item.groupName)"
                                class="mgr-5 mgb-5"
                                color="#333"
                                background="#f0f0f0"
                                xs
                            >{{lableItem.labelName}}</cy-btn>
                            <cy-btn
                                v-else
                                @click.native="onChangeLable(index,lableIndex,item.groupName)"
                                class="mgr-5 mgb-5"
                                type="blue"
                                plain
                                xs
                            >{{lableItem.labelName}}</cy-btn>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mgt-20 b-line"></div>

            <div class="mgt-20 fs-20 tc">您对门店服务是否满意？</div>
            <div class="mgt-10 tc orange">{{form.remarkServer}}</div>
            <div class="flex center mgt-10">
                <cy-rate v-model="form.levelServer" @click="onChangeServerRate" :size="25"></cy-rate>
            </div>
            <div class="mgt-20">
                <div
                    v-for="(item,index) in lableServerList"
                    :key="index"
                    class="lable-item flex mgb-10"
                >
                    <div class="remark">{{item.groupName}}</div>
                    <div class="flex wrap">
                        <div v-for="(lableItem,lableIndex) in item.labelJson" :key="lableIndex">
                            <cy-btn
                                v-if="!lableItem.status"
                                @click.native="onChangeServerLable(index,lableIndex,item.groupName)"
                                class="mgr-5 mgb-5"
                                color="#333"
                                background="#f0f0f0"
                                xs
                            >{{lableItem.labelName}}</cy-btn>
                            <cy-btn
                                v-else
                                @click.native="onChangeServerLable(index,lableIndex,item.groupName)"
                                class="mgr-5 mgb-5"
                                type="blue"
                                plain
                                xs
                            >{{lableItem.labelName}}</cy-btn>
                        </div>
                    </div>
                </div>
            </div>

            <div class="textarea">
                <cy-textarea v-model="form.otherReamrk" placeholder="听说你还想夸夸我？" maxLen="50"></cy-textarea>
            </div>
            <div class="flex between">
                <div>{{accept === 'video' ? "视频":accept === 'image' ?"照片":"选择类型"}}</div>
                <!-- <div @click="showAccept = true" class="flex center fs-12 grey">
                    照片或视频二选一
                    <cy-icon type="youjiantou" size="10" class="mgl-5"></cy-icon>
                </div>-->
            </div>

            <cy-upyun-upload-image
                v-if="accept === 'video'"
                :list="imgList"
                @upload="handleUploadImage"
                :maxLen="1"
                :multiple="true"
                accept="video/*"
            ></cy-upyun-upload-image>
            <cy-upyun-upload-image
                v-if="accept === 'image'"
                :list="imgList"
                @upload="handleUploadImage"
                :maxLen="9"
                accept="image/*"
            ></cy-upyun-upload-image>

            <div class="flex center pdt-30">
                <cy-checkbox
                    v-model="form.isAnonymous"
                    round
                    @onChange="onChangeAnonymous"
                    label="匿名评价"
                    background="#999"
                ></cy-checkbox>
            </div>

            <div class="pdlr-20 pdtb-10">
                <cy-btn @click.native="onSubmit" type="blue-gradient" round>提交</cy-btn>
            </div>

            <cy-popup
                v-model="showAccept"
                :closeIcon="false"
                round
                position="bottom"
                height="130px"
                width="100%"
            >
                <div class="pdt-15">
                    <cy-cell @click.native="onChangeAccept('image')" title="照片"></cy-cell>
                    <cy-cell @click.native="onChangeAccept('video')" title="视频"></cy-cell>
                </div>
            </cy-popup>
        </div>
    </div>
</template>

<script>
import cyRate from "@/components/rate";
import cyTextarea from "@/components/textarea";
import cyUpyunUploadImage from "@/components/upyun_upload_image";
import cyCheckbox from "@/components/checkbox";

export default {
    name: "evaluate_add",
    components: {
        cyRate,
        cyTextarea,
        cyUpyunUploadImage,
        cyCheckbox,
    },
    data() {
        return {
            projectName: "",
            evaluateList: [],
            evaluateServerList: [],
            lableList: [], //标签
            lableServerList: [], //标签
            imgList: [], //上传的图片
            accept: "image",
            showAccept: false,
            form: {
                orgPk: "", //订单厂商pk
                evaluateOrgPk: "", //评价门店pk
                projectPk: "", //大项目pk
                userProjectPk: "", //用户项目pk/订单pk
                level: 5, //星级
                remark: "五星", //星级描述
                labelJson: [], //标签

                levelServer: 5, //服务星级
                remarkServer: "五星", //服务星级描述
                labelServerJson: [], //服务标签

                otherReamrk: "", //评价内容
                imgJson: [], //图片或视频
                isAnonymous: "0", //匿名 0=否 1=是
            },
        };
    },
    created() {
        const query = this.$route.query;
        this.projectName = query.projectName; //项目名称
        this.form = {
            ...this.form,
            userProjectPk: query.userProjectPk, //订单pk
            orgPk: '01', //厂商PK
            evaluateOrgPk: query.orgPk, //核销门店pk
            projectPk: query.projectPk, //大项目PK 01
        };
        this.getEvaluateList();
    },
    watch: {
        "form.level"(nVal, oVal) {
            let remark = "五星";
            switch (nVal) {
                case 1:
                    remark = "一星";
                    break;
                case 2:
                    remark = "二星";
                    break;
                case 3:
                    remark = "三星";
                    break;
                case 4:
                    remark = "四星";
                    break;
                case 5:
                    remark = "五星";
                    break;
                default:
                    remark = "五星";
            }
            this.form.remark = remark;
        },
        "form.levelServer"(nVal, oVal) {
            let remark = "五星";
            switch (nVal) {
                case 1:
                    remark = "一星";
                    break;
                case 2:
                    remark = "二星";
                    break;
                case 3:
                    remark = "三星";
                    break;
                case 4:
                    remark = "四星";
                    break;
                case 5:
                    remark = "五星";
                    break;
                default:
                    remark = "五星";
            }
            this.form.remarkServer = remark;
        },
    },
    computed: {},
    methods: {
        //获取项目评价标签
        getEvaluateList() {
            const params = {
                orgPk: this.form.orgPk,
                projectPk: this.form.projectPk,
            };
            this.$api.getEvaluateList(params).then((res) => {
                if (res.obj && res.obj.length > 0) {
                    const list = res.obj.map((item) => {
                        item.labelJson.map((item) => {
                            item.status = true;
                            return item;
                        });
                        return item;
                    });
                    //项目评价
                    this.evaluateList = list.filter((item) => {
                        return item.type === "0";
                    });
                    //默认五星
                    this.lableList = this.evaluateList.filter((item) => {
                        return item.level === 5;
                    });

                    //服务评价
                    this.evaluateServerList = list.filter((item) => {
                        return item.type === "1";
                    });
                    //默认五星
                    this.lableServerList = this.evaluateServerList.filter(
                        (item) => {
                            return item.level === 5;
                        }
                    );
                }
            });
        },

        //选星级-项目评价
        onChangeRate(level) {
            this.lableList = this.evaluateList.filter((item) => {
                return item.level === level;
            });
        },

        //选中标签-项目评价
        onChangeLable(index, labelIndex, groupName) {
            const list = this.lableList[index].labelJson.filter((item) => {
                return item.status === true;
            });
            if (
                list.length <= 1 &&
                this.lableList[index].labelJson[labelIndex].status
            ) {
                this.$toast(groupName+"：至少选择一项");
            } else {
                this.$toast.clear();
                this.lableList[index].labelJson[labelIndex].status = !this
                    .lableList[index].labelJson[labelIndex].status;
            }
        },

        //选星级-服务评价
        onChangeServerRate(level) {
            this.lableServerList = this.evaluateServerList.filter((item) => {
                return item.level === level;
            });
        },

        //选中标签-服务评价
        onChangeServerLable(index, labelIndex, groupName) {
            const list = this.lableServerList[index].labelJson.filter(
                (item) => {
                    return item.status === true;
                }
            );
            if (
                list.length <= 1 &&
                this.lableServerList[index].labelJson[labelIndex].status
            ) {
                this.$toast(groupName+"：至少选择一项");
            } else {
                this.$toast.clear();
                this.lableServerList[index].labelJson[labelIndex].status = !this
                    .lableServerList[index].labelJson[labelIndex].status;
            }
        },

        //切换匿名
        onChangeAnonymous(values, label, e) {
            this.form.isAnonymous = values;
        },

        //上传图片视频
        handleUploadImage(e) {
            //this.form.imgJson.type = e.type;
            //this.form.imgJson.url = e.data && e.data.join(",");
            this.imgList = e.data;
        },

        //提交
        onSubmit() {
            this.$toast.loading("加载中…");
            //项目标签
            let labelJson = this.lableList.map((item) => {
                const label = item.labelJson.filter((labelItem) => {
                    return labelItem.status === true;
                });
                return label.map((LItem) => {
                    return {
                        labelName: LItem.labelName,
                        groupType: item.groupType,
                        groupName: item.groupName
                    };
                });
            });
            labelJson = this.arrayFlat(labelJson);
            this.form.labelJson = JSON.stringify(labelJson);

            //服务标签
            let labelServerJson = this.lableServerList.map((item) => {
                const label = item.labelJson.filter((labelItem) => {
                    return labelItem.status === true;
                });
                //console.log('label',label);
                return label.map((LItem) => {
                    return {
                        labelName: LItem.labelName,
                        groupType: item.groupType,
                        groupName: item.groupName
                    };
                });
            });
            labelServerJson = this.arrayFlat(labelServerJson);
            this.form.labelServerJson = JSON.stringify(labelServerJson);

            const imgJson = [];
            for (let i in this.imgList) {
                imgJson.push({
                    type: this.accept === "image" ? 0 : 1,
                    url: this.imgList[i],
                });
            }
            this.form.imgJson = JSON.stringify(imgJson);
            //匿名
            this.form.isAnonymous = this.form.isAnonymous === true ? "1" : "0";

            this.$api
                .saveEvaluateProject(this.form)
                .then((res) => {
                    this.$toast.success("评价成功");
                    setTimeout(() => {
                        this.$router.go(-1);
                    }, 1000);
                })
                .catch((err) => {});
        },

        //切换上传照片或者视频
        onChangeAccept(v) {
            this.showAccept = false;
            this.accept = v;
            this.imgList = [];
        },

        //扁平数组
        arrayFlat(arr) {
            return arr.reduce((prev, cur) => {
                return prev.concat(
                    Array.isArray(cur) ? this.arrayFlat(cur) : cur
                );
            }, []);
        },
    },
};
</script>
<style lang="scss" scoped>
.lable-item {
    .remark {
        flex: 0 0 70px;
    }
}
.textarea {
    padding: 10px;
    margin: 10px 0px;
    border-radius: 8px;
    border: solid 1px #cecece;
}
video::-webkit-media-controls-volume-control-container.closed {
    display: none;
}
</style>
