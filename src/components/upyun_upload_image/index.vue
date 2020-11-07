<template>
    <div class="cy-upload">
        <slot>
            <div v-for=" (item,index) in list" :key="index">
                <div :class="['cy-upload-item',{'cy-upload-video':accept === 'video/*'}]">
                    <div class="cy-upload-del">
                        <cy-icon
                            type="close2"
                            color="#999"
                            size="30"
                            @click.native="onDelImg(index)"
                        ></cy-icon>
                    </div>
                    <cy-image v-if="accept === 'image/*'" :src="item" @click.native="previewImage(index)"></cy-image>
                    <video v-if="accept === 'video/*'" controls :src="item" width="100%" height="100%">您的浏览器不支持 video 标签。</video>
                </div>
            </div>
        </slot>
        <div v-if="list.length < maxLen" class="cy-upload-edit">
            <input
                type="file"
                @change="chooseImg($event)"
                class="cy-upload-file"
                :accept="accept"
                multiple
            />
        </div>
    </div>
</template>
<script>
import "./upyun/upyun-mu";
import createMD5 from "./upyun/createMD5";
import compression from "@/utils/compression";
import clone from "@/utils/clone";
import { config } from "@/service/config"; // 导入配置域名
/**
 * 上传图片到又拍云
 * @param {Array} list 图片数组
 * @param {Number} maxLen 最大上传图片数量
 * @param {Array} acceptType 允许上传的类型
 * @param {String} typeError 上传失败提示语
 */
export default {
    name: "cy-upyun-upload-image",
    props: {
        list: {
            type: Array,
            default: () => []
        },
        maxLen: {
            type: Number,
            default: 9
        },
        multiple: {
            type: Boolean,
            default: false
        },
        acceptType: {
            type: Array,
            default: () => ["image/jpeg", "image/png", "image/gif", "image/bmp"]
        },
        typeError: {
            type: String,
            default: "不支持上传该类型"
        },
        accept: {
            type: String,
            default: "image/*"
        }
    },
    data() {
        return {};
    },
    methods: {
        //获取上传图片Token
        getToken(file, filemd5, path) {
            return new Promise((resolve, reject) => {
                this.$api
                    .getUpyunToken({
                        path,
                        extendName: file.type.split("/")[1],
                        fileSize: file.size,
                        fileMD5: filemd5
                    })
                    .then(res => {
                        resolve(res.obj);
                    });
            });
        },
        // 选择图片
        async chooseImg($event) {
            let length = $event.target.files.length;
            const leaveLen = this.maxLen - this.list.length;
            if (leaveLen < length) {
                length = leaveLen;
            }
            for (let i = 0; i < length; i++) {
                const file = $event.target.files[i];
                await this.uploadToUpyun(file);
            }
            if (leaveLen < $event.target.files.length) {
                await this.sleep(1000);
                this.$toast(`最多只能上传${this.maxLen}${this.accept === "image/*"?'张图片':'个视频'}`);
            }
        },
        // 上传图片到又拍云
        async uploadToUpyun(file) {
            try {
                /** 检测上传类型 */
                if (this.accept === "image/*") {
                    if (!this.acceptType.includes(file.type)) {
                        this.$toast(this.typeError);
                        return;
                    }
                }
                this.$toast.loading("上传中...");
                if (this.accept === "image/*") {
                    file = await compression(file); //压缩图片
                }
                const md5 = await createMD5(file);
                /** 上传路径 */
                const path =
                    this.accept === "image/*"
                        ? config.UPYUN_IMAGE_PATH
                        : config.UPYUN_IMAGE_VIDEO;
                const data = await this.getToken(file, md5, path);
                const upyun_config = {
                        bucket: data.bucket,
                        expiration: data.expiration,
                        signature: data.signature,
                        path: data.path
                    },
                    instance = new Sand(upyun_config, file);
                await instance.upload(upyun_config.path);
                const url = `http://agent-res.wlyinfo.com${upyun_config.path}`;
                this.$toast.clear();
                this.$emit("upload", {
                    type: this.accept === "image/*" ? "image" : "video",
                    data: [...this.list, url]
                });
            } catch (err) {
                console.log(err);
            }
        },
        //删除
        onDelImg(index) {
            const list = clone(this.list);
            list.splice(index, 1);
            this.$emit("upload", {
                type: this.accept === "image/*" ? "image" : "video",
                data: list
            });
        },
        async sleep(interval) {
            return new Promise(resolve => {
                setTimeout(resolve, interval);
            });
        },
              
        //图片预览
        previewImage(index) {
            const curUrl = this.list[index];
            wx.previewImage({
                current: curUrl, // 当前显示图片的http链接
                urls: this.list // 需要预览的图片http链接列表
            });
        },

    }
};
</script>
<style lang="scss">
.cy-upload {
    display: flex;
    flex-wrap: wrap;
    /* justify-content: space-between; */
}
.cy-upload-item {
    position: relative;
    margin: 10px;
    width: 105px;
    height: 105px;
    margin: 5px;
    &.cy-upload-video {
        width: 200px;
        height: 200px;
        background: #333;
    }
}
.cy-upload-del {
    position: absolute;
    z-index: 5;
    right: -10px;
    top: -10px;
    &::before {
        content: "";
        position: absolute;
        width: 80%;
        height: 80%;
        left: 10%;
        top: 10%;
        background: #ffffff;
        border-radius: 50%;
        z-index: -1;
    }
}
.cy-upload-edit {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 105px;
    height: 105px;
    border: 1px solid #cecece;
    margin: 5px;
}
.cy-upload-edit::after {
    content: "";
    position: absolute;
    left: 50;
    width: 1px;
    height: 50%;
    background: #cecece;
}
.cy-upload-edit::after {
    content: "";
    position: absolute;
    left: 50%;
    width: 1px;
    height: 50%;
    background: #cecece;
}
.cy-upload-edit::before {
    content: "";
    position: absolute;
    left: 25%;
    height: 1px;
    width: 50%;
    background: #cecece;
}
.cy-upload-edit .cy-upload-file {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
}
</style>