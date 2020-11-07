/** 滚动动画
 * @param top:Number 目标距顶距离
 * @param delay:Number
 */ 
const scrollToView = (top, delay = 8) => {
    return new Promise((resolve) => {
        // 获取需要滚动的距离
        let timer = setInterval(() => {
            const scrollTop =
                document.documentElement.scrollTop ||
                document.body.scrollTop;
            const differ = top - scrollTop;
            const ispeed =
                differ > 0
                    ? Math.ceil(differ / delay)
                    : Math.floor(differ / delay);
            if (Math.abs(differ) <= 1) {
                window.clearInterval(timer);
                resolve(true)
            }
            document.documentElement.scrollTop = document.body.scrollTop =
                scrollTop + ispeed;
        }, delay);
    })
}

export default scrollToView;