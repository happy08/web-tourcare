 <template>
    <span ref="numberGrow" :data-value="value">0</span>
</template>
 <script>
import { add, div } from "@/utils/number";

export default {
    name: "data_list",
    components: {},
    props: {
        step: {
            type: Number,
            default: 20,
        },
        value: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {};
    },
    created() {},
    mounted() {
    },
    computed: {},
    watch: {
        value: {
            handler(nVal, oVal) {
                //if (typeof(oVal) !== 'undefined') {
                    this.$nextTick(() => {
                        this.numberGrow(this.$refs.numberGrow);
                    });
                //}
            },
            immediate: true
        },
    },
    methods: {
        numberGrow(ele) {
            let step = this.step;
            let isDecimal = true; //是否小数
            if (String(this.value).indexOf(".") === -1) {
                isDecimal = false;
            }
            let stepVal = div(this.value, step);
            let start = 0;
            let t = setInterval(() => {
                start = add(start, stepVal);
                if (step <= 0) {
                    ele.innerHTML = this.value;
                    clearInterval(t);
                    t = null;
                    return;
                }
                step--;
                ele.innerHTML = isDecimal ? start.toFixed(2) : Math.ceil(start);
            }, 50);
        },
    },
};
</script>

 
