
export const MixinScroll = {
    data() {
        return {
            scrollEl: null,
            active: 0,
            topArr: []
        }
    },
    methods: {
        initScrollElement() {
            this.$nextTick(() => {
                const element = this.$refs.scroller;
                this.scrollEl = element;
                if (this.scrollEl) {
                    this.scrollEl.addEventListener(
                        "scroll",
                        this.onScroll,
                        false
                    );

                    let top = [];
                    for (let index in this.navList) {
                        const offsetTop = this.$refs["data" + index][0]
                            .offsetTop;
                        top.push(offsetTop);
                    }
                    this.topArr = top.splice(1);
                    console.log('top',this.topArr);
                }
            });
        },
        onScroll() {
            this.requestAniFrame()(() => {
                const { scrollTop } = this.scrollEl;
                const index =
                    this.topArr &&
                    this.topArr.findIndex(val => {
                        return val > scrollTop;
                    });
                this.active = index < 0 ? this.topArr.length : index;
            });
        },
        changeScroll(index) {
            this.scrollEl.scrollTop = this.scrollEl.scrollTop = this.topArr[
                index-1
            ];
            setTimeout(() =>{this.active = index;},50)
            
        },
        requestAniFrame() {
            return (
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                }
            );
        },

    }
}

