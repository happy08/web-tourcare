
//分页 上拉加载更多
export const MixinPage = {
    data() {
        return {
            //noData: false,
            isLoading: true,
            isHasMore: true,
            pageNum: 1, //当前页
            pageSize: 15, //每页
            total: 0 //总页
        }
    },
    methods: {
        onLoadmore() {
            if (this.pageNum < this.total) {
                this.isLoading = true;
                this.pageNum++;
                this.getDataList();
            } else {
                this.isHasMore = false;
            }
        }

    }
}



