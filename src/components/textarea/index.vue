<template>
    <div class="cy-txtarea">
        <div class="cy-txt-area">
            <textarea
                :placeholder="placeholder"
                v-model="textInfo"
                @input="txtLength"
            ></textarea>
            <span :class="['cy-txt-max', {'error':error}]" v-show="limitShow">{{txtNum>maxLen?maxLen:txtNum}}/{{maxLen}}</span>
        </div>
    </div>
</template>
<script>
export default {
    name: "cy-txtarea",
    props: {
        maxLen: {
            type: [String, Number],
            default: 10
        },
        placeholder: {
            type: String,
            default: "请输入"
        },
        limitShow: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            textInfo: "",
            txtNum: 0,
            error: false
        };
    },
    computed:{
       
    },
    methods: {
        txtLength() {
            let txtVal = this.textInfo.length;
            this.txtNum = txtVal;
            if (txtVal > this.maxLen) {
                this.error = true
                this.$emit("onError");
                this.textInfo = this.textInfo.substr(0,this.maxLen)
                this.txtNum --
            }else{
                if(this.error) this.error = false
            }
            this.$emit("input", this.textInfo);
        }
    }
};
</script>
<style lang="scss">
.cy-txtarea {
    background: #fff;
    .cy-txt-area {
        position: relative;
        textarea {
            resize: none;
            width: 100%;
            height: 80px;
            border: none;
            outline: none;
            margin: 0;
            padding: 0;
            background: transparent;
            display: block;
        }
        .cy-txt-max {
            color: #666;
            position: absolute;
            right: 10px;
            bottom: 0px;
            font-size: 12px;
            &.error{
                 color: #e2231a;
            }
        }
       
    }
}
</style>
